
const cleanObject = (obj, keysObj) => {

    let newObj = {}

    for(const key_i in obj) {
        let isFound = false
        for(const key_j in keysObj) {
            if(key_i == key_j) {
                isFound = true
            }
        }

        if(!isFound) {
            newObj[key_i] = obj[key_i]
        }
    }

    return newObj
}

module.exports = { cleanObject }