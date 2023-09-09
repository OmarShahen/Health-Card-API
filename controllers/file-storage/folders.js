const FolderModel = require('../../models/file-storage/FolderModel')
const FileModel = require('../../models/file-storage/FileModel')
const ClinicModel = require('../../models/ClinicModel')
const UserModel = require('../../models/UserModel')
const PatientModel = require('../../models/PatientModel')
const folderValidator = require('../../validations/file-storage/folders')
const mongoose = require('mongoose')
const translations = require('../../i18n/index')

const getFolders = async (request, response) => {

    try {

        const folders = await FolderModel
        .find()
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            folders
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

const addFolder = async (request, response) => {

    try {

        const dataValidation = folderValidator.addFolder(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clinicId, creatorId, parentFolderId, name } = request.body

        
        const creator = await UserModel.findById(creatorId)

        if(!parentFolderId) {
            const clinic = await ClinicModel.findById(clinicId)    
            if(!clinic) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Clinic ID is not registered',
                    field: 'clinicId'
                })
            }
        }

        if(!creator) {
            return response.status(400).json({
                accepted: false,
                message: 'Creator ID is not registered',
                field: 'creatorId'
            })
        }

        let parentFolder = {}

        if(parentFolderId) {
            parentFolder = await FolderModel.findById(parentFolderId)
            if(!parentFolder) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Parent folder is not registered',
                    field: 'parentFolderId'
                })
            }
        }

        const sameFolderNameList = await FolderModel.find({ clinicId, name, parentFolderId })

        if(sameFolderNameList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Folder name is already registered in this folder'],
                field: 'name'
            })
        }

        const newFolderData = { ...request.body }

        if(parentFolderId) {
            newFolderData.clinicId = parentFolder.clinicId
        }

        if(parentFolder.patientId) {
            newFolderData.patientId = parentFolder.patientId
        }

        const folderObj = new FolderModel(newFolderData)
        const newFolder = await folderObj.save()

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added folder successfully!'],
            folder: newFolder
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

const addPatientFolder = async (request, response) => {

    try {

        const dataValidation = folderValidator.addPatientFolder(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { patientId, clinicId, creatorId, parentFolderId, name } = request.body

        
        const creator = await UserModel.findById(creatorId)
        const patient = await PatientModel.findById(patientId)

        if(!parentFolderId) {
            const clinic = await ClinicModel.findById(clinicId)    
            if(!clinic) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Clinic ID is not registered',
                    field: 'clinicId'
                })
            }
        }

        if(!creator) {
            return response.status(400).json({
                accepted: false,
                message: 'Creator ID is not registered',
                field: 'creatorId'
            })
        }

        if(!patient) {
            return response.status(400).json({
                accepted: false,
                message: 'Patient ID is not registered',
                field: 'patientId'
            })
        }

        let parentFolder

        if(parentFolderId) {
            parentFolder = await FolderModel.findById(parentFolderId)
            if(!parentFolder) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Parent folder is not registered',
                    field: 'parentFolderId'
                })
            }
        }

        const sameFolderNameList = await FolderModel.find({ patientId, clinicId, name, parentFolderId })

        if(sameFolderNameList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Folder name is already registered in this folder'],
                field: 'name'
            })
        }

        const newFolderData = { ...request.body }

        if(parentFolderId) {
            newFolderData.clinicId = parentFolder.clinicId
        }

        const folderObj = new FolderModel(newFolderData)
        const newFolder = await folderObj.save()

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added patient folder successfully!'],
            folder: newFolder
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

const updateFolderName = async (request, response) => {

    try {

        const dataValidation = folderValidator.updateFolderName(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { folderId } = request.params
        const { name } = request.body

        const folder = await FolderModel.findById(folderId)

        if(name != folder.name) {
            const nameList = await FolderModel.find({ clinicId: folder.clinicId, name, parentFolderId: folder.parentFolderId })
            if(nameList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: translations[request.query.lang]['Folder name is already registered in the folder'],
                    field: 'name'
                })
            }
        }

        const updatedFolder = await FolderModel.findByIdAndUpdate(folder._id, { name }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated folder name successfully!'],
            folder: updatedFolder
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


const getFoldersByClinicId = async (request, response) => {

    try {

        const { clinicId } = request.params

        const folders = await FolderModel.aggregate([
            {
                $match: { clinicId: mongoose.Types.ObjectId(clinicId) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'creatorId',
                    foreignField: '_id',
                    as: 'creator'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    'creator.password': 0
                }
            }
        ])

        folders.forEach(folder => folder.creator = folder.creator[0])

        return response.status(200).json({
            accepted: true,
            folders
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

const getClinicsStaffsFoldersByClinicId = async (request, response) => {

    try {

        const { clinicId, patientId } = request.params

        const folders = await FolderModel.aggregate([
            {
                $match: {
                    clinicId: mongoose.Types.ObjectId(clinicId), 
                    patientId: mongoose.Types.ObjectId(patientId)  
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'creatorId',
                    foreignField: '_id',
                    as: 'creator'
                }
            },
            {
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $match: {
                    'creator.roles': { $in: ['STAFF']  }
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    'creator.password': 0
                }
            }
        ])

        folders.forEach(folder => {
            folder.creator = folder.creator[0]
            folder.clinic = folder.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            folders
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

const getFoldersByParentFolderId = async (request, response) => {

    try {

        const { folderId } = request.params

        const folders = await FolderModel.aggregate([
            {
                $match: { parentFolderId: mongoose.Types.ObjectId(folderId) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'creatorId',
                    foreignField: '_id',
                    as: 'creator'
                }
            },
            {
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    'creator.password': 0
                }
            }
        ])

        folders.forEach(folder => {
            folder.creator = folder.creator[0]
            folder.clinic = folder.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            folders
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

const getFoldersByCreatorId = async (request, response) => {

    try {

        const { userId } = request.params

        const folders = await FolderModel.aggregate([
            {
                $match: { 
                    creatorId: mongoose.Types.ObjectId(userId),
                    parentFolderId: { $exists: false },
                    patientId: { $exists: false }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'creatorId',
                    foreignField: '_id',
                    as: 'creator'
                }
            },
            {
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    'creator.password': 0
                }
            }
        ])

        folders.forEach(folder => {
            folder.creator = folder.creator[0]
            folder.clinic = folder.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            folders
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

const getFolderById = async (request, response) => {

    try {

        const { folderId } = request.params

        const folder = await FolderModel.findById(folderId)

        return response.status(200).json({
            accepted: true,
            folder
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

const getHomeFoldersByPatientId = async (request, response) => {

    try {

        const { patientId } = request.params

        const folders = await FolderModel.aggregate([
            {
                $match: { 
                    patientId: mongoose.Types.ObjectId(patientId), 
                    parentFolderId: { $exists: false }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'creatorId',
                    foreignField: '_id',
                    as: 'creator'
                }
            },
            {
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        folders.forEach(folder => {
            folder.creator = folder.creator[0]
            folder.clinic = folder.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            folders
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

const getClinicHomeFoldersByPatientId = async (request, response) => {

    try {

        const { clinicId, patientId } = request.params

        const folders = await FolderModel.aggregate([
            {
                $match: { 
                    patientId: mongoose.Types.ObjectId(patientId),
                    clinicId: mongoose.Types.ObjectId(clinicId),
                    parentFolderId: { $exists: false }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'creatorId',
                    foreignField: '_id',
                    as: 'creator'
                }
            },
            {
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        folders.forEach(folder => {
            folder.creator = folder.creator[0]
            folder.clinic = folder.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            folders
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

const deleteFolder = async (request, response) => {

    try {

        const { folderId } = request.params

        const filesList = await FileModel.find({ folderId })

        if(filesList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Folder contains files'],
                field: 'folderId'
            })
        }

        const foldersList = await FolderModel.find({ parentFolderId: folderId })

        if(foldersList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Folder contains folders'],
                field: 'folderId'
            })
        }

        const deletedFolder = await FolderModel.findByIdAndDelete(folderId)

        return response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Deleted folder successfully!'],
            folder: deletedFolder
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
    getFolders, 
    addFolder,
    addPatientFolder,
    updateFolderName, 
    deleteFolder,
    getFoldersByParentFolderId,
    getFoldersByClinicId,
    getFoldersByCreatorId,
    getFolderById,
    getHomeFoldersByPatientId,
    getClinicsStaffsFoldersByClinicId,
    getClinicHomeFoldersByPatientId
}