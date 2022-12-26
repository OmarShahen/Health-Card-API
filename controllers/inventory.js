const ItemModel = require('../models/ItemModel')
const SupplierModel = require('../models/SupplierModel')
const PaymentModel = require('../models/paymentModel')
const inventoryValidator = require('../validations/inventory')
const StaffModel = require('../models/StaffModel')
const utils = require('../utils/utils')
const translations = require('../i18n/index')

const receiveItem = async (request, response) => {

    try {

        const { clubId } = request.params
        const { lang } = request.query
        const { itemId, supplierId, staffId, amount, price } = request.body

        const dataValidation = inventoryValidator.receiveItem(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const item = await ItemModel.findById(itemId)
        if(!item) {
            return response.status(404).json({
                accepted: false,
                message: translations[lang]['Item is not found'],
                field: 'itemId'
            })
        }

        const staff = await StaffModel.findById(staffId)
        if(!staff) {
            return response.status(404).json({
                accepted: false,
                message: translations[lang]['Staff is not found'],
                field: 'staffId'
            })
        }

        const supplier = await SupplierModel.findById(supplierId)
        if(!supplier) {
            return response.status(404).json({
                accepted: false,
                message: translations[lang]['Supplier is not found'],
                field: 'supplierId'
            })
        }

        const ITEM_NEW_AMOUNT = item.inStock + amount
        const TOTAL_PAYMENT = amount * price

        const paymentData = { 
            clubId, 
            staffId,
            type: 'DEDUCT', 
            category: 'INVENTORY',
            itemId,
            supplierId,
            amount,
            price,
            total: TOTAL_PAYMENT
        }

        const paymentObj = new PaymentModel(paymentData)

        const updatedItemPromise = ItemModel
        .findByIdAndUpdate(itemId, { inStock: ITEM_NEW_AMOUNT }, { new: true })

        const [newPayment, updatedItem] = await Promise.all([
            paymentObj.save(),
            updatedItemPromise
        ])

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Added Items to inventory successfully'],
            payment: newPayment,
            item: updatedItem
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const deductItem = async (request, response) => {

    try {

        const { clubId } = request.params
        const { lang } = request.query
        const { itemId, staffId, amount, price } = request.body

        const dataValidation = inventoryValidator.deductItem(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const staff = await StaffModel.findById(staffId)
        if(!staff) {
            return response.status(404).json({
                accepted: false,
                message: translations[lang]['Staff is not found'],
                field: 'staffId'
            })
        }

        const item = await ItemModel.findById(itemId)
        if(!item) {
            return response.status(404).json({
                accepted: false,
                message: translations[lang]['Item is not found'],
                field: 'itemId'
            })
        }

        if(item.inStock == 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['There is no stock for this item'],
                field: 'itemId'
            })
        }


        const ITEM_NEW_AMOUNT = item.inStock - amount
        const TOTAL_PAYMENT = amount * price

        const paymentData = { 
            clubId, 
            staffId,
            type: 'EARN', 
            category: 'INVENTORY',
            itemId,
            amount,
            price,
            total: TOTAL_PAYMENT
        }

        const paymentObj = new PaymentModel(paymentData)

        const updatedItemPromise = ItemModel
        .findByIdAndUpdate(itemId, { inStock: ITEM_NEW_AMOUNT }, { new: true })

        const [newPayment, updatedItem] = await Promise.all([
            paymentObj.save(),
            updatedItemPromise
        ])

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Selled Item successfully'],
            payment: newPayment,
            item: updatedItem
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getClubInventoryStats = async (request, response) => {

    try {

        const { clubId } = request.params
        const { until, to, specific } = request.query


        const items = await ItemModel.find({ clubId })

        const paymentsGrowthStatsQuery = utils.statsQueryGenerator('clubId', clubId, request.query)
        paymentsGrowthStatsQuery.searchQuery.category = 'INVENTORY'

        const inventoryPayments = await PaymentModel.aggregate([
            {
                $match: paymentsGrowthStatsQuery.searchQuery
            },
            {
                $lookup: {
                    from: 'items',
                    localField: 'itemId',
                    foreignField: '_id',
                    as: 'item'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        const growthUntilDate = utils.growthDatePicker(until, to, specific)
        const inventoryGrowthStatsQuery = utils.statsQueryGenerator('clubId', clubId, { until: growthUntilDate })
        inventoryGrowthStatsQuery.searchQuery.type = 'EARN'
        inventoryGrowthStatsQuery.searchQuery.category = 'INVENTORY'

        const itemAmountSalesGrowthStats = await PaymentModel.aggregate([
            {
                $match: inventoryGrowthStatsQuery.searchQuery
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: '$amount' }
                }
            }
        ])

        const salesDistributionStats = utils.statsQueryGenerator('clubId', clubId, request.query)
        salesDistributionStats.searchQuery.category = 'INVENTORY'
        salesDistributionStats.searchQuery.type = 'EARN'

        const itemAmountSalesDistributionStats = await PaymentModel.aggregate([
            {
                $match: salesDistributionStats.searchQuery
            },
            {
                $group: {
                    _id: '$itemId',
                    count: { $sum: '$amount' }
                }
            },
            {
                $lookup: {
                    from: 'items',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'item'
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ])

        const itemMoneySalesDistributionStats = await PaymentModel.aggregate([
            {
                $match: salesDistributionStats.searchQuery
            },
            {
                $group: {
                    _id: '$itemId',
                    count: { $sum: '$total' }
                }
            },
            {
                $lookup: {
                    from: 'items',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'item'
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ])

        const suppliers = await SupplierModel.find({ clubId })

        const TOTAL_ITEMS = items.length
        const TOTAL_ITEMS_AMOUNT = utils.calculateTotalByKey(items, 'inStock')
        const TOTAL_EARN_MONEY = utils.calculateTotalPaymentsByType(inventoryPayments, 'EARN') || 0
        const TOTAL_DEDUCT_MONEY = utils.calculateTotalPaymentsByType(inventoryPayments, 'DEDUCT') || 0
        const TOTAL_AMOUNT_RECEIVED = utils.calculateTotalAmountByType(inventoryPayments, 'DEDUCT') || 0
        const TOTAL_AMOUNT_SOLD = utils.calculateTotalAmountByType(inventoryPayments, 'EARN') || 0
        const NET_PROFIT = TOTAL_EARN_MONEY - TOTAL_DEDUCT_MONEY

        inventoryPayments.forEach(payment => {
            payment.item = payment.item[0]
        })

        itemAmountSalesDistributionStats.forEach(sale => sale.item = sale.item[0])
        itemMoneySalesDistributionStats.forEach(sale => sale.item = sale.item[0])
        
        return response.status(200).json({
            accepted: true,
            itemAmountSalesDistributionStats,
            itemMoneySalesDistributionStats,
            itemAmountSalesGrowthStats,
            totalItems: TOTAL_ITEMS,
            totalItemsAmount: TOTAL_ITEMS_AMOUNT,
            netProfit: NET_PROFIT,
            totalEarningsMoney: TOTAL_EARN_MONEY,
            totalDeductionsMoney: TOTAL_DEDUCT_MONEY,
            totalAmountSold: TOTAL_AMOUNT_SOLD,
            totalAmountReceived: TOTAL_AMOUNT_RECEIVED,
            payments: inventoryPayments,
            items,
            suppliers
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { receiveItem, deductItem, getClubInventoryStats }