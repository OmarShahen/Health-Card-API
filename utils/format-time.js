const getTime = (dateTimeValue, timeZone) => {
    return new Date(dateTimeValue).toLocaleTimeString('en', { timeZone })
}

const getAge = (dateOfBirth) => {
    return new Date().getFullYear() - new Date(dateOfBirth).getFullYear()
}

const getHoursDifference = (date1, date2) => {
    const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime())
    const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60))
  
    return hours
}

module.exports = { getTime, getAge, getHoursDifference }