const validator = require('../utils/utils')

const requestDemo = (requestDemoData) => {

    const { firstName, lastName, email, clubName, phone, country } = requestDemoData

    if(!firstName) return { isAccepted: false, message: 'First name is required', field: 'firstName' }

    if(!validator.isNameValid(firstName)) return { isAccepted: false, message: 'Invalid first name formate', field: 'firstName' }

    if(!lastName) return { isAccepted: false, message: 'Last name is required', field: 'lastName' }

    if(!validator.isNameValid(lastName)) return { isAccepted: false, message: 'Invalid last name formate', field: 'lastName' }

    if(!email) return { isAccepted: false, message: 'Email is required', field: 'email' }

    if(!validator.isEmailValid(email)) return { isAccepted: false, message: 'Invalid last email formate', field: 'email' }

    if(!clubName) return { isAccepted: false, message: 'Club name is required', field: 'clubName' }

    if(!validator.isNameValid(clubName)) return { isAccepted: false, message: 'Invalid club name formate', field: 'clubName' }

    if(!phone) return { isAccepted: false, message: 'Phone is required', field: 'phone' }

    if(!validator.isPhoneValid(phone)) return { isAccepted: false, message: 'Phone formate is invalid', field: 'phone' }

    if(!country) return { isAccepted: false, message: 'Country name is required', field: 'country' }

    if(!validator.isNameValid(country)) return { isAccepted: false, message: 'Invalid country name formate', field: 'country' }

    return { isAccepted: true, message: 'data is valid', data: requestDemoData }

}

module.exports = { requestDemo }