const ItemModel = require('../models/ItemModel')
const itemValidator = require('../validations/items')
const PaymentModel = require('../models/paymentModel')
const utils = require('../utils/utils')
const translations = require('../i18n/index')

const addItem = async (request, response) => {

    try {

        const { clubId } = request.params
        const { lang } = request.query
        const { name, price, initialStock } = request.body

        const dataValidation = itemValidator.addItem(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const itemList = await ItemModel.find({ clubId, name })

        if(itemList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Item name is already registered in the club'],
                field: 'name'
            })
        }

        const itemData = { clubId, name, price, initialStock, inStock: initialStock }

        const itemObj = new ItemModel(itemData)
        const newItem = await itemObj.save()

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Added item successfully'],
            item: newItem
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

const getClubItems = async (request, response) => {

    try {

        const { clubId } = request.params

        const items = await ItemModel
        .find({ clubId })
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            items
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

const updateItem = async (request, response) => {

    try {

        const { itemId, clubId } = request.params
        const { lang } = request.query
        const { name, price } = request.body

        const dataValidation = itemValidator.updateItem(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const item = await ItemModel.findById(itemId)

        if(name != item.name) {

            const itemsList = await ItemModel.find({ clubId, name })
            if(itemsList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: translations[lang]['Item name is already registered in the club'],
                    field: 'name'
                })
            }
        }


        const updatedItem = await ItemModel
        .findByIdAndUpdate(itemId, { name, price }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Updated item succesfully'],
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

const deleteItem = async (request, response) => {

    try {

        const { itemId } = request.params
        const { lang } = request.query

        const paymentsList = await PaymentModel.find({ itemId })

        if(paymentsList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['There is payments registered the item'],
                field: 'itemId'
            })
        }

        const deletedItem = await ItemModel.findByIdAndDelete(itemId)

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Item deleted successfully'],
            item: deletedItem
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

const getItemStats = async (request, response) => {

    try {

        const { itemId } = request.params
        const { until, to, specific } = request.query

        const growthUntilDate = utils.growthDatePicker(until, to, specific)
        const itemStatsQuery = utils.statsQueryGenerator('itemId', itemId, { until: growthUntilDate })
        itemStatsQuery.searchQuery.type = 'EARN'

        const itemPromise = ItemModel.findById(itemId)

        const itemAmountSalesGrowthStatsPromise = PaymentModel.aggregate([
            {
                $match: itemStatsQuery.searchQuery
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: '$amount' }
                }
            }
        ])

        const itemPaymentsStatsQuery = utils.statsQueryGenerator('itemId', itemId, request.query)

        const itemPaymentsPromise = PaymentModel.aggregate([
            {
                $match: itemPaymentsStatsQuery.searchQuery
            },
            {
                $lookup: {
                    from: 'suppliers',
                    localField: 'supplierId',
                    foreignField: '_id',
                    as: 'supplier'
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

        const [item, itemAmountSalesGrowthStats, itemPayments] = await Promise.all([
            itemPromise,
            itemAmountSalesGrowthStatsPromise,
            itemPaymentsPromise
        ])

        const IN_STOCK = item.inStock
        const CURRENT_PRICE = item.price
        const TOTAL_EARN_MONEY = utils.calculateTotalPaymentsByType(itemPayments, 'EARN') || 0
        const TOTAL_DEDUCT_MONEY = utils.calculateTotalPaymentsByType(itemPayments, 'DEDUCT') || 0
        const TOTAL_AMOUNT_RECEIVED = utils.calculateTotalAmountByType(itemPayments, 'DEDUCT') || 0
        const TOTAL_AMOUNT_SOLD = utils.calculateTotalAmountByType(itemPayments, 'EARN') || 0
        const NET_PROFIT = TOTAL_EARN_MONEY - TOTAL_DEDUCT_MONEY

        itemPayments.forEach(payment => {

            payment.type == 'DEDUCT' ? payment.supplier = payment.supplier[0] : payment.supplier = {}
            payment.item = payment.item[0]
        } )
        
        const suppliers = utils.getUniqueSuppliersFromPayments(itemPayments)

        return response.status(200).json({
            accepted: true,
            item: item,
            itemAmountSalesGrowthStats,
            inStock: IN_STOCK,
            currentPrice: CURRENT_PRICE,
            netProfit: NET_PROFIT,
            totalEarningsMoney: TOTAL_EARN_MONEY,
            totalDeductionsMoney: TOTAL_DEDUCT_MONEY,
            totalAmountSold: TOTAL_AMOUNT_SOLD,
            totalAmountReceived: TOTAL_AMOUNT_RECEIVED,
            suppliers,
            payments: itemPayments

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

module.exports = { addItem, getClubItems, updateItem, deleteItem, getItemStats }