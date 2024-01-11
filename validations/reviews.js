const utils = require('../utils/utils')


const addReview = (reviewData) => {

    const { expertId, seekerId, rating, note, isRecommend } = reviewData

    if(!expertId) return { isAccepted: false, message: 'Expert ID is required', field: 'expertId' }

    if(!utils.isObjectId(expertId)) return { isAccepted: false, message: 'Invalid expert ID format', field: 'expertId' }

    if(!seekerId) return { isAccepted: false, message: 'Seeker ID is required', field: 'seekerId' }

    if(!utils.isObjectId(seekerId)) return { isAccepted: false, message: 'Invalid seeker ID format', field: 'seekerId' }

    if(note && typeof note != 'string') return { isAccepted: false, message: 'Invalid note format', field: 'note' }

    if(!rating) return { isAccepted: false, message: 'Rating is required', field: 'rating' }

    if(typeof rating != 'number') return { isAccepted: false, message: 'Rating format is invalid', field: 'rating' }

    if(typeof isRecommend != 'boolean') return { isAccepted: false, message: 'Is recommend format is invalid', field: 'isRecommend' }

    return { isAccepted: true, message: 'data is valid', data: reviewData }
}


module.exports = { addReview }