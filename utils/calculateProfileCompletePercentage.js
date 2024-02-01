
const calculateExpertProfileCompletePercentage = (userProfile) => {
    const missingFields = []
    let requiredFields = [
        'firstName', 'email', 'profileImageURL',
        'phone', 'dateOfBirth', 'gender', 'title',
        'description'
    ]

    const totalFields = requiredFields.length + 4
    let completedFields = 0

    for (const field of requiredFields) {
        if (userProfile[field]) {
            completedFields++
        } else {
            missingFields.push(field)
        }
    }

    if(!userProfile.speciality || userProfile.speciality.length == 0) {
        missingFields.push('speciality')
    } else {
        completedFields++
    }

    if(!userProfile.subSpeciality || userProfile.subSpeciality.length == 0) {
        missingFields.push('subSpeciality')
    } else {
        completedFields++
    }

    if(!userProfile.pricing || userProfile.pricing.length == 0) {
        missingFields.push('pricing')
    } else {
        completedFields++
    }

    const { bankAccount, mobileWallet } = userProfile?.paymentInfo

    if(bankAccount?.accountNumber || mobileWallet?.walletNumber) {
        completedFields++
    } else {
        missingFields.push('paymentInfo')
    }

    requiredFields = [...requiredFields, 'speciality', 'subSpeciality', 'pricing', 'paymentInfo']

    const completionPercentage = (completedFields / totalFields) * 100

    return { 
        completionPercentage: Number.parseInt(completionPercentage.toFixed(0)), 
        requiredFields,
        missingFields 
    }
}

module.exports = { calculateExpertProfileCompletePercentage }