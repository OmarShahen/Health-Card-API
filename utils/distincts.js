
const distinctValues = (values, distinctKey) => {

    let found = []
    let newValues = []

    for(let i=0;i<values.length;i++) {

        if(found.includes(values[i][distinctKey])) {
            //newValues[i].branches += 1
            continue
        } else {

            //values[i].branches = 1
            found.push(values[i][distinctKey])
            newValues.push(values[i])
        }

    }

    return newValues
}

const getUniqueIds = (Ids) => {

    const uniqueIds = []

    for(let i=0;i<Ids.length;i++) {
        let isFound = false
        for(let j=0;j<uniqueIds.length;j++) {
            if(Ids[i]._id.equals(uniqueIds[j]._id)) {
                isFound = true
            }
        }

        if(!isFound) {
            uniqueIds.push(Ids[i])
        }
    }

    return uniqueIds
}

const getUniqueSuppliersFromPayments = (payments) => {

    let uniqueSuppliers = []

    for(let i=0;i<payments.length;i++) {
        if(payments[i].type == 'EARN') {
            continue
        }

        const supplier = payments[i].supplier
        let found = false

        for(let j=0;j<uniqueSuppliers.length;j++) {
            const uniqueSupplier = uniqueSuppliers[j]
            if(supplier._id.equals(uniqueSupplier._id)) {
                found = true
                break
            }
        }

        if(!found) {
            uniqueSuppliers.push(supplier)
        }

    }

    return uniqueSuppliers
}

module.exports = { distinctValues, getUniqueIds, getUniqueSuppliersFromPayments }