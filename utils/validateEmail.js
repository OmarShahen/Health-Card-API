
const isEmailValid = (email) => {

    const regularExpressions = /\S+@\S+\.\S+/

    return regularExpressions.test(email)
}

module.exports = { isEmailValid }