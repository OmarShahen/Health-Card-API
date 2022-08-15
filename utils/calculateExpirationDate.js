
const calculateExpirationDate = (currentDate, expiresIn) => {

    let expiresAt

    const splitDate = expiresIn.split(' ')
    const expiresInNumber = Number.parseInt(splitDate[0])
    const expiresInDate = splitDate[1]

    if(expiresInDate == 'day' || expiresInDate == 'days') {

        expiresAt = new Date(currentDate.setDate(currentDate.getDate() + expiresInNumber))

    } else if(expiresInDate == 'week' || expiresInDate == 'weeks') {

        expiresAt = new Date(currentDate.setDate(currentDate.getDate() + (expiresInNumber * 7)))

    } else if(expiresInDate == 'month' || expiresInDate == 'months') {

        expiresAt = new Date(currentDate.setDate(currentDate.getDate() + (expiresInNumber * 30)))

    } else {

        expiresAt = new Date(currentDate.setDate(currentDate.getDate() + 365))
    }

    return expiresAt
}

module.exports = { calculateExpirationDate }