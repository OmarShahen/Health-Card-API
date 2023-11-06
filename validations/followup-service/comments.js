const utils = require('../../utils/utils')
const config = require('../../config/config')

const addComment = (commentData) => {

    const { clinicId, patientId, memberId, description, category, type } = commentData

    if(!clinicId) return { isAccepted: false, message: 'Clinic ID is required', field: 'clinicId' }

    if(!utils.isObjectId(clinicId)) return { isAccepted: false, message: 'Invalid clinic ID format', field: 'clinicId' }

    if(patientId && !utils.isObjectId(patientId)) return { isAccepted: false, message: 'Invalid patient ID format', field: 'patientId' }

    if(!memberId) return { isAccepted: false, message: 'Member ID is required', field: 'memberId' }

    if(!utils.isObjectId(memberId)) return { isAccepted: false, message: 'Invalid member ID format', field: 'memberId' }

    if(!description) return { isAccepted: false, message: 'Description is required', field: 'description' }

    if(typeof description != 'string') return { isAccepted: false, message: 'Invalid description format', field: 'description' }

    if(!category) return { isAccepted: false, message: 'Category is required', field: 'category' }

    if(typeof category != 'string') return { isAccepted: false, message: 'Invalid category format', field: 'category' }

    if(!type) return { isAccepted: false, message: 'Type is required', field: 'type' }

    if(!config.COMMENT_TYPES.includes(type)) return { isAccepted: false, message: 'Invalid type format', field: 'type' }

    return { isAccepted: true, message: 'data is valid', data: commentData }
}

const updateComment = (commentData) => {

    const { description, category, type } = commentData

    if(description && typeof description != 'string') return { isAccepted: false, message: 'Invalid description format', field: 'description' }

    if(category && typeof category != 'string') return { isAccepted: false, message: 'Invalid category format', field: 'category' }

    if(type && !config.COMMENT_TYPES.includes(type)) return { isAccepted: false, message: 'Invalid type format', field: 'type' }

    return { isAccepted: true, message: 'data is valid', data: commentData }
}

module.exports = { addComment, updateComment }