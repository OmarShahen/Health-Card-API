const validator = require('../utils/utils')
const translations = require('../i18n/index')


const addInstallment = (installmentData, lang) => {

    const { staffId, paid } = installmentData

    if(!staffId) return { isAccepted: false, message: 'staff Id is required', field: 'staffId' }

    if(!validator.isObjectId(staffId)) return { isAccepted: false, message: 'invalid staff Id formate', field: 'staffId' }

    if(!paid) return { isAccepted: false, message: translations[lang]['Price is required'], field: 'paid' }

    if(typeof paid != 'number') return { isAccepted: false, message: translations[lang]['Price must be a number'], field: 'paid' }

    if(paid == 0) return { isAccepted: false, message: translations[lang]['Price must be greater than 0'], field: 'paid' }

    return { isAccepted: true, message: 'data is valid', data: installmentData }

}


module.exports = { addInstallment } 