const ItemModel = require('../models/ItemModel')
const SupplierModel = require('../models/SupplierModel')
const PaymentModel = require('../models/paymentModel')
const inventoryValidator = require('../validations/inventory')
const StaffModel = require('../models/StaffModel')
const utils = require('../utils/utils')
const translations = require('../i18n/index')
const mongoose = require('mongoose')

const recordReceivePaymentsAndUpdateItems = async (itemsData) => {

    const { clubId, supplierId, staffId, items } = itemsData

    let inventoryItems = []
    let payments = []

    for(let i=0;i<items.length;i++) {
        const receivedItem = items[i]
        const item = await ItemModel.findById(receivedItem.itemId)

        const ITEM_NEW_AMOUNT = item.inStock + receivedItem.amount

        const paymentData = {
            type: 'DEDUCT',
            category: 'INVENTORY',
            clubId,
            supplierId,
            staffId,
            itemId: item._id,
            amount: receivedItem.amount,
            price: receivedItem.price,
            total: receivedItem.amount * receivedItem.price
        }

        const updatedItemPromise = ItemModel
        .findByIdAndUpdate(item._id, { inStock: ITEM_NEW_AMOUNT }, { new: true })


        const paymentObj = new PaymentModel(paymentData)
        const newPaymentPromise = paymentObj.save()

        let [updatedItem, newPayment] = await Promise.all([
            updatedItemPromise,
            newPaymentPromise
        ])

        newPayment = { ...newPayment._doc, item: updatedItem._doc }
        payments.push(newPayment)
        inventoryItems.push(updatedItem)

    }

    return { inventoryItems, payments }
}

const recordSelledPaymentsAndUpdateItems = async (itemsData) => {

    const { clubId, staffId, items } = itemsData

    let inventoryItems = []
    let payments = []

    for(let i=0;i<items.length;i++) {
        const selledItem = items[i]
        const item = await ItemModel.findById(selledItem.itemId)

        const ITEM_NEW_AMOUNT = item.inStock - selledItem.amount

        const paymentData = {
            type: 'EARN',
            category: 'INVENTORY',
            clubId,
            staffId,
            itemId: item._id,
            amount: selledItem.amount,
            price: selledItem.price,
            total: selledItem.amount * selledItem.price
        }

        const updatedItemPromise = ItemModel
        .findByIdAndUpdate(item._id, { inStock: ITEM_NEW_AMOUNT }, { new: true })


        const paymentObj = new PaymentModel(paymentData)
        const newPaymentPromise = paymentObj.save()

        let [updatedItem, newPayment] = await Promise.all([
            updatedItemPromise,
            newPaymentPromise
        ])

        newPayment = { ...newPayment._doc, item: updatedItem._doc }
        payments.push(newPayment)
        inventoryItems.push(updatedItem)

    }

    return { inventoryItems, payments }
}

const checkItemsInStock = (items, targetItems) => {

    for(let i=0;i<items.length;i++) {
        const item = items[i]
        const targetItem = targetItems[i]
        if(item.inStock < targetItem.amount) {
            return false
        }
    }

    return true
}  

const subtractEarnWithDeduct = (payments, total=0) => {

    for(let i=0;i<payments.length;i++) {
        const payment = payments[i]

        if(payment.type == 'EARN') {
            total -= payment.amount
        } else if(payment.type == 'DEDUCT') {
            total += payment.amount
        }
    }

    return total

}

const receiveItems = async (request, response) => {

    try {

        const { clubId } = request.params
        const { lang } = request.query
        const { supplierId, staffId, items } = request.body

        const dataValidation = inventoryValidator.receiveItem(request.body, lang)

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

        const supplier = await SupplierModel.findById(supplierId)
        if(!supplier) {
            return response.status(404).json({
                accepted: false,
                message: translations[lang]['Supplier is not found'],
                field: 'supplierId'
            })
        }

        const itemsIdsList = items.map(item => item.itemId)
        const itemsList = await ItemModel.find({ _id: { $in: itemsIdsList }})

        if(itemsIdsList.length != itemsList.length) {
            return response.status(400).json({
                accepted: false,
                message: 'Item Id does not exist',
                field: 'items'
            })
        }

        request.body.clubId = clubId
        const { inventoryItems, payments } = await recordReceivePaymentsAndUpdateItems(request.body)

        return response.status(200).json({
            accepted: true,
            message: 'Payment is recorded successfully',
            items: inventoryItems,
            payments
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

const deductItems = async (request, response) => {

    try {

        const { clubId } = request.params
        const { lang } = request.query
        const { staffId, items } = request.body

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

        const itemsIdsList = items.map(item => item.itemId)
        const itemsList = await ItemModel.find({ _id: { $in: itemsIdsList }})

        if(itemsIdsList.length != itemsList.length) {
            return response.status(400).json({
                accepted: false,
                message: 'Item Id does not exist',
                field: 'items'
            })
        }

        const isItemsInstock = checkItemsInStock(itemsList, items)
        if(!isItemsInstock) {
            return response.status(400).json({
                accepted: false,
                message: 'There is no stock for an item',
                field: 'items'
            })
        }


        request.body.clubId = clubId
        const { inventoryItems, payments } = await recordSelledPaymentsAndUpdateItems(request.body)

        return response.status(200).json({
            accepted: true,
            message: 'Payment is recorded successfully',
            items: inventoryItems,
            payments
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

const getInventoryPayments = async (request, response) => {

    try {

        const { clubId } = request.params

        const payments = await PaymentModel.aggregate([
            {
                $match: {
                    clubId: mongoose.Types.ObjectId(clubId),
                    category: 'INVENTORY'
                }
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

        payments.forEach(payment => payment.item = payment.item[0])

        return response.status(200).json({
            accepted: true,
            payments
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

const getInventoryPaymentsByStaff = async (request, response) => {

    try {

        const { clubId, staffId } = request.params

        const payments = await PaymentModel.aggregate([
            {
                $match: {
                    clubId: mongoose.Types.ObjectId(clubId),
                    staffId: mongoose.Types.ObjectId(staffId),
                    category: 'INVENTORY'
                }
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

        payments.forEach(payment => payment.item = payment.item[0])

        return response.status(200).json({
            accepted: true,
            payments
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

const deleteDeductItemPayment = async (request, response) => {

    try {

        const { paymentId } = request.params

        const payment = await PaymentModel.findById(paymentId)

        if(payment.category != 'INVENTORY' || payment.type != 'EARN') {
            return response.status(400).json({
                accepted: false,
                message: 'Payment must be from inventory with type EARN',
                field: 'paymentId'
            })
        }

        const item = await ItemModel.findById(payment.itemId)

        const ITEM_NEW_AMOUNT = item.inStock + payment.amount
    
        const updateItemPromise = ItemModel.findByIdAndUpdate(item._id, { inStock: ITEM_NEW_AMOUNT }, { new: true })
        const deletePaymentPromise = PaymentModel.findByIdAndDelete(paymentId)

        const [updatedItem, deletePayment] = await Promise.all([
            updateItemPromise,
            deletePaymentPromise
        ])

        return response.status(200).json({
            accepted: true,
            message: 'Deleted payment successfully',
            item: updatedItem,
            payment: deletePayment
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

const deleteReceiveItemPayment = async (request, response) => {

    try {

        const { paymentId } = request.params

        const payment = await PaymentModel.findById(paymentId)

        if(payment.category != 'INVENTORY' || payment.type != 'DEDUCT') {
            return response.status(400).json({
                accepted: false,
                message: 'Payment must be from inventory with type DEDUCT',
                field: 'paymentId'
            })
        }

        const itemId = payment.itemId

        const oldPaymentsPromise = PaymentModel
        .find({ itemId, category: 'INVENTORY', createdAt: { $lt: payment.createdAt } })

        const itemPromise = ItemModel.findById(itemId)

        const [item, oldPayments] = await Promise.all([
            itemPromise,
            oldPaymentsPromise
        ])

        const oldEarnPayments = oldPayments.filter(payment => payment.type == 'EARN')
        const oldDeductPayments = oldPayments.filter(payment => payment.type == 'DEDUCT')

        const beforePaymentItemAmount = subtractEarnWithDeduct([...oldEarnPayments, ...oldDeductPayments]) + item.initialStock

        const newPayments = await PaymentModel
        .find({ itemId, category: 'INVENTORY', createdAt: { $gt: payment.createdAt } })

        const newEarnPayments = newPayments.filter(payment => payment.type == 'EARN')
        const newDeductPayments = newPayments.filter(payment => payment.type == 'DEDUCT')

        const afterPaymentItemAmount = subtractEarnWithDeduct([...newEarnPayments, ...newDeductPayments], beforePaymentItemAmount) 

        if(afterPaymentItemAmount < 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Cannot delete due to other payments depending on it',
                field: 'paymentId'
            })
        }

        const NEW_ITEM_INSTOCK = item.inStock - payment.amount

        const updatedItemPromise = ItemModel.findByIdAndUpdate(item._id, { inStock: NEW_ITEM_INSTOCK }, { new: true })
        const deletedPaymentPromise = PaymentModel.findByIdAndDelete(paymentId)

        const [updatedItem, deletedPayment] = await Promise.all([
            updatedItemPromise,
            deletedPaymentPromise
        ])

        return response.status(200).json({
            accepted: true,
            message: 'Deleted payment successfully',
            item: updatedItem,
            payment: deletedPayment
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

module.exports = { 
    receiveItems, 
    deductItems, 
    getClubInventoryStats,
    getInventoryPayments,
    getInventoryPaymentsByStaff,
    deleteDeductItemPayment,
    deleteReceiveItemPayment
}