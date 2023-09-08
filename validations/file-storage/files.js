const utils = require('../../utils/utils')
const config = require('../../config/config')

const addFile = (fileData) => {

    const { creatorId, folderId, name, size, type, url, isPinned, isStarred } = fileData


    if(!creatorId) return { isAccepted: false, message: 'Creator ID is required', field: 'creatorId' }

    if(!utils.isObjectId(creatorId)) return { isAccepted: false, message: 'Creator ID format is invalid', field: 'creatorId' }

    if(!folderId) return { isAccepted: false, message: 'Folder ID is required', field: 'folderId' }

    if(!utils.isObjectId(folderId)) return { isAccepted: false, message: 'Parent folder ID format is invalid', field: 'parentFolderId' }

    if(!name) return { isAccepted: false, message: 'Folder name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Folder name format is invalid', field: 'name' }

    if(!size) return { isAccepted: false, message: 'File size is required', field: 'size' }

    if(typeof size != 'number') return { isAccepted: false, message: 'File size format is invalid', field: 'size' }

    if(size > config.MAX_FILE_SIZE) return { isAccepted: false, message: 'File size passed the maximum limit', field: 'size' }

    if(!type) return { isAccepted: false, message: 'File type is required', field: 'type' }

    if(typeof type != 'string') return { isAccepted: false, message: 'File type format is invalid', field: 'type' }

    if(!config.ALLOWED_FILE_EXTENSIONS.includes(type)) return { isAccepted: false, message: 'Invalid file extension type', field: 'type' }

    if(!url) return { isAccepted: false, message: 'File URL is required', field: 'url' }

    if(typeof url != 'string') return { isAccepted: false, message: 'File URL format is invalid', field: 'url' }

    if(!utils.isValidURL(url)) return { isAccepted: false, message: 'File URL structure is not valid', field: 'url' }

    if(isPinned && typeof isPinned != 'boolean') return { isAccepted: false, message: 'Pinned format is invalid', field: 'isPinned' }

    if(isStarred && typeof isStarred != 'boolean') return { isAccepted: false, message: 'Starred format is invalid', field: 'isStarred' }

    return { isAccepted: true, message: 'data is valid', data: fileData }

}

const updateFileName = (fileData) => {

    const { name } = fileData

    if(!name) return { isAccepted: false, message: 'File name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'File name format is invalid', field: 'name' }

    
    return { isAccepted: true, message: 'data is valid', data: fileData }

}

const updateFilePinStatus = (fileData) => {

    const { isPinned } = fileData

    if(typeof isPinned != 'boolean') return { isAccepted: false, message: 'File pin format is invalid', field: 'isPinned' }
    
    return { isAccepted: true, message: 'data is valid', data: fileData }

}


module.exports = { addFile, updateFileName, updateFilePinStatus }
