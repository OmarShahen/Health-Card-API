
const calculateTotalPaymentsByType = (payments, type) => {

    let total = 0

    for(let i=0;i<payments.length;i++) {

        if(payments[i].type == type) {
            total += (payments[i].amount * payments[i].price)
        }
    }

    return total
}

const calculateTotalAmountByType = (payments, type) => {

    let total = 0

    for(let i=0;i<payments.length;i++) {
        if(payments[i].type == type) {
            total += payments[i].amount
        }
    }

    return total
}

const calculateTotalPayments = (payments) => {

    let total = 0

    for(let i=0;i<payments.length;i++) {
        total += (payments[i].amount * payments[i].price)
    }

    return total
}

module.exports = { calculateTotalPaymentsByType, calculateTotalPayments, calculateTotalAmountByType }