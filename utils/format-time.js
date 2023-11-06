const getTime = (dateTimeValue, timeZone) => {
    return new Date(dateTimeValue).toLocaleTimeString('en', { timeZone })
}

const getAge = (dateOfBirth) => {
    return new Date().getFullYear() - new Date(dateOfBirth).getFullYear()
}

module.exports = { getTime, getAge }