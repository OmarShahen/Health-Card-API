const config = require('../config/config')
const utils = require('../utils/utils')

const updateUser = (userData) => {

    const { firstName, lastName, gender } = userData


    if(!firstName) return { isAccepted: false, message: 'First name is required', field: 'firstName' }

    if(!utils.isNameValid(firstName)) return { isAccepted: false, message: 'Invalid name formate', field: 'firstName' }

    if(!lastName) return { isAccepted: false, message: 'Last name is required', field: 'lastName' }

    if(!utils.isNameValid(lastName)) return { isAccepted: false, message: 'Invalid name formate', field: 'lastName' }

    if(!gender) return { isAccepted: false, message: 'Gender is required', field: 'gender' }
    
    if(!config.GENDER.includes(gender)) return { isAccepted: false, message: 'Invalid gender', field: 'gender' }

    return { isAccepted: true, message: 'data is valid', data: userData }

}

const updateUserEmail = (userData) => {

    const { email } = userData

    if(!email) return { isAccepted: false, message: 'email is required', field: 'email' }

    if(!utils.isEmailValid(email)) return { isAccepted: false, message: 'invalid email formate', field: 'email' }

    return { isAccepted: true, message: 'data is valid', data: userData }
}

const updateUserPassword = (userData) => {

    const { password } = userData

    if(!password) return { isAccepted: false, message: 'password is required', field: 'password' }

    if(typeof password != 'string') return { isAccepted: false, message: 'invalid password formate', field: 'password' }

    return { isAccepted: true, message: 'data is valid', data: userData }
}




module.exports = { updateUser, updateUserEmail, updateUserPassword }