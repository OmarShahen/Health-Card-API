const FolderModel = require('../../models/file-storage/FolderModel')
const FileModel = require('../../models/file-storage/FileModel')
const ClinicModel = require('../../models/ClinicModel')
const UserModel = require('../../models/UserModel')
const PatientModel = require('../../models/PatientModel')
const filesValidator = require('../../validations/file-storage/files')
const mongoose = require('mongoose')
const translations = require('../../i18n/index')

const getFiles = async (request, response) => {

    try {

        const files = await FileModel
        .find()
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            files
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}


const addFile = async (request, response) => {

    try {

        const dataValidation = filesValidator.addFile(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { creatorId, folderId, name } = request.body

        const creatorPromise = UserModel.findById(creatorId)
        const folderPromise = FolderModel.findById(folderId)

        const [creator, folder] = await Promise.all([creatorPromise, folderPromise])

        if(!creator) {
            return response.status(400).json({
                accepted: false,
                message: 'Creator ID is not registered',
                field: 'creatorId'
            })
        }

        if(!folder) {
            return response.status(400).json({
                accepted: false,
                message: 'Folder ID is not registered',
                field: 'folderId'
            })
        }

        let nameSearchQuery = { clinicId: folder.clinicId, name, folderId }

        if(folder.patientId) {
            nameSearchQuery.patientId = folder.patientId
        }

        const sameFileNameList = await FileModel.find(nameSearchQuery)

        if(sameFileNameList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['File name is already registered in this folder'],
                field: 'name'
            })
        }

        const newFileData = { ...request.body }
        newFileData.clinicId = folder.clinicId

        if(folder.patientId) {
            newFileData.patientId = folder.patientId
        }

        const fileObj = new FileModel(newFileData)
        const newFile = await fileObj.save()

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added file successfully!'],
            file: newFile
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getFilesByCreatorId = async (request, response) => {

    try {

        const { userId } = request.params
        const { isPinned } = request.query

        const matchQuery = { 
            creatorId: mongoose.Types.ObjectId(userId),
            patientId: { $exists: false }
        }

        const sortQuery = isPinned == 'true' ? { updatedAt: -1 } : { createdAt: -1 }

        if(isPinned == 'true') {
            matchQuery.isPinned = true
        }

        const files = await FileModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $sort: sortQuery
            }
        ])

        return response.status(200).json({
            accepted: true,
            files
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getFilesByPatientId = async (request, response) => {

    try {

        const { patientId } = request.params
        const { isPinned } = request.query

        const matchQuery = { patientId: mongoose.Types.ObjectId(patientId) }
        const sortQuery = isPinned == 'true' ? { updatedAt: -1 } : { createdAt: -1 }

        if(isPinned == 'true') {
            matchQuery.isPinned = true
        }

        const files = await FileModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $sort: sortQuery
            }
        ])

        return response.status(200).json({
            accepted: true,
            files
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getFileById = async (request, response) => {

    try {

        const { fileId } = request.params

        const file = await FileModel.findById(fileId)

        return response.status(200).json({
            accepted: true,
            file
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}


const getFilesByPatientIdAndClinicId = async (request, response) => {

    try {

        const { patientId, clinicId } = request.params

        const files = await FileModel.aggregate([
            {
                $match: { 
                    patientId: mongoose.Types.ObjectId(patientId), 
                    clinicId: mongoose.Types.ObjectId(clinicId) 
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        return response.status(200).json({
            accepted: true,
            files
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getFilesByFolderId = async (request, response) => {

    try {

        const { folderId } = request.params

        const files = await FileModel.aggregate([
            {
                $match: { folderId: mongoose.Types.ObjectId(folderId) }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        return response.status(200).json({
            accepted: true,
            files
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteFile = async (request, response) => {

    try {

        const { fileId } = request.params

        const deletedFile = await FileModel.findByIdAndDelete(fileId)

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Deleted file successfully!'],
            file: deletedFile
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateFileName = async (request, response) => {

    try {

        const dataValidation = filesValidator.updateFileName(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { fileId } = request.params
        const { name } = request.body

        const file = await FileModel.findById(fileId)

        if(name != file.name) {
            const nameList = await FileModel.find({ clinicId: file.clinicId, name, folderId: file.folderId })
            if(nameList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: translations[request.query.lang]['File name is already registered in the folder'],
                    field: 'name'
                })
            }
        }

        const updatedFile = await FileModel.findByIdAndUpdate(file._id, { name }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated file name successfully!'],
            file: updatedFile
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateFilePinStatus = async (request, response) => {

    try {

        const dataValidation = filesValidator.updateFilePinStatus(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { fileId } = request.params
        const { isPinned } = request.body

        const updatedFile = await FileModel.findByIdAndUpdate(fileId, { isPinned }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated file pinning status successfully!'],
            file: updatedFile
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}


module.exports = { 
    getFiles,
    addFile,
    deleteFile,
    updateFileName,
    getFilesByPatientId,
    getFileById,
    getFilesByPatientIdAndClinicId,
    getFilesByFolderId,
    getFilesByCreatorId,
    updateFilePinStatus
}