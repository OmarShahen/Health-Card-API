const isListUnique = (list) => {

    const listSet = new Set(list)
    if(listSet.size != list.length) {
        return false
    }

    return true
}

module.exports = { isListUnique }