const getTime = (dateTimeValue, timeZone) => {
    return new Date(dateTimeValue).toLocaleTimeString('en', { timeZone })
}

module.exports = { getTime }