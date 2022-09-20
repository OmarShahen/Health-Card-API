
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

module.exports = { distinctValues }