const PatientSurveyModel = require('../../models/followup-service/PatientSurveyModel')
const CallModel = require('../../models/followup-service/CallModel')
const CounterModel = require('../../models/CounterModel')
const UserModel = require('../../models/UserModel')
const PatientModel = require('../../models/PatientModel')
const ArrivalMethodModel = require('../../models/ArrivalMethodModel')
const ClinicModel = require('../../models/ClinicModel')
const ClinicPatientModel = require('../../models/ClinicPatientModel')
const ClinicOwnerModel = require('../../models/ClinicOwnerModel')
const patientValidator = require('../../validations/followup-service/patients-surveys')
const utils = require('../../utils/utils')
const mongoose = require('mongoose')

const getPatientsSurveys = async (request, response) => {

    try {

        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)
        
        const patientsSurveys = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
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
                $lookup: {
                    from: 'users',
                    localField: 'doneById',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $project: {
                    'patient.emergencyContacts': 0,
                    'patient.healthHistory': 0,
                    'member.password': 0
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        patientsSurveys.forEach(patientSurvey => {
            patientSurvey.patient = patientSurvey.patient[0]
            patientSurvey.member = patientSurvey.member[0]
            patientSurvey.clinic = patientSurvey.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            patientsSurveys
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

const getPatientsSurveysByPatientId = async (request, response) => {

    try {

        const { patientId } = request.params

        const { searchQuery } = utils.statsQueryGenerator('patientId', patientId, request.query)
        
        const patientsSurveys = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
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
                $lookup: {
                    from: 'users',
                    localField: 'doneById',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $project: {
                    'patient.emergencyContacts': 0,
                    'patient.healthHistory': 0,
                    'member.password': 0
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        patientsSurveys.forEach(patientSurvey => {
            patientSurvey.patient = patientSurvey.patient[0]
            patientSurvey.member = patientSurvey.member[0]
            patientSurvey.clinic = patientSurvey.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            patientsSurveys
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

const getPatientsSurveysByClinicId = async (request, response) => {

    try {

        const { clinicId } = request.params

        const { searchQuery } = utils.statsQueryGenerator('clinicId', clinicId, request.query)
        
        const patientsSurveys = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
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
                $lookup: {
                    from: 'users',
                    localField: 'doneById',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $project: {
                    'patient.emergencyContacts': 0,
                    'patient.healthHistory': 0,
                    'member.password': 0
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        patientsSurveys.forEach(patientSurvey => {
            patientSurvey.patient = patientSurvey.patient[0]
            patientSurvey.member = patientSurvey.member[0]
            patientSurvey.clinic = patientSurvey.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            patientsSurveys
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

const getPatientsSurveysByOwnerId = async (request, response) => {

    try {

        const { userId } = request.params

        const ownerClinics = await ClinicOwnerModel.find({ ownerId: userId })

        const clinics = ownerClinics.map(clinic => clinic.clinicId)

        let { searchQuery } = utils.statsQueryGenerator('temp', userId, request.query)
        
        delete searchQuery.temp
        searchQuery.clinicId = { $in: clinics }
        
        const patientsSurveys = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
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
                $lookup: {
                    from: 'users',
                    localField: 'doneById',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $project: {
                    'patient.emergencyContacts': 0,
                    'patient.healthHistory': 0,
                    'member.password': 0
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        patientsSurveys.forEach(patientSurvey => {
            patientSurvey.patient = patientSurvey.patient[0]
            patientSurvey.member = patientSurvey.member[0]
            patientSurvey.clinic = patientSurvey.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            patientsSurveys
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

const getPatientsSurveysByDoneById = async (request, response) => {

    try {

        const { userId } = request.params

        const { searchQuery } = utils.statsQueryGenerator('doneById', userId, request.query)
        
        const patientsSurveys = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
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
                $lookup: {
                    from: 'users',
                    localField: 'doneById',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $project: {
                    'patient.emergencyContacts': 0,
                    'patient.healthHistory': 0,
                    'member.password': 0
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        patientsSurveys.forEach(patientSurvey => {
            patientSurvey.patient = patientSurvey.patient[0]
            patientSurvey.member = patientSurvey.member[0]
            patientSurvey.clinic = patientSurvey.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            patientsSurveys
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

const addPatientSurvey = async (request, response) => {

    try {

        const dataValidation = patientValidator.addPatientSurvey(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { 
            doneById,
            doctorId, 
            reviewerId, 
            overallExperience,
            comment,
            serviceIdeaRate,
            serviceIdeaComment,
            callDuration,
            waitingTimeWaited,
            waitingIsDelayHappened,
            waitingIsDelayInformed,
            waitingSatisfaction,
            environmentIsClean,
            environmentIsComfortable,
            staffIsFriendly,
            staffIsResponsive,
            healthcareProviderAttentiveness,
            healthcareProviderIsAddressedAdequately,
            healthcareProviderTreatmentExplanation,
            healthcareProviderIsMedicalHistoryAsked,
            appointmentsIsConvenientTimeSlotFound,
            appointmentsIsSchedulingEasy,
            appointmentsIsReminderSent,
            appointmentsSchedulingWay,
        } = request.body

        const memberPromise = UserModel.findById(doneById)
        const reviewerPromise = UserModel.findById(reviewerId)
        const doctorPromise = UserModel.findById(doctorId)

        const [member, reviewer, doctor] = await Promise.all([memberPromise, reviewerPromise, doctorPromise])

        if(!member) {
            return response.status(400).json({
                accepted: false,
                message: 'Member ID does not exist',
                field: 'doneById'
            })
        }
        
        if(!reviewer) {
            return response.status(400).json({
                accepted: false,
                message: 'Reviewer ID does not exist',
                field: 'reviewerId'
            })
        }   

        if(!doctor) {
            return response.status(400).json({
                accepted: false,
                message: 'Doctor ID does not exist',
                field: 'doctorId'
            })
        }   

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'PatientSurvey' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const patientSurveyData = {
            patientSurveyId: counter.value,
            doneById,
            reviewerId,
            doctorId,
            overallExperience,
            comment,
            serviceIdeaRate,
            serviceIdeaComment,
            callDuration,
            waiting: {
                timeWaited: waitingTimeWaited,
                isDelayHappened: waitingIsDelayHappened,
                isDelayInformed: waitingIsDelayInformed,
                waitingSatisfaction
            },
            environment: {
                isClean: environmentIsClean,
                isComfortable: environmentIsComfortable
            },
            staff: {
                isFriendly: staffIsFriendly,
                isResponsive: staffIsResponsive
            },
            healthcareProvider: {
                attentiveness: healthcareProviderAttentiveness,
                isAddressedAdequately: healthcareProviderIsAddressedAdequately,
                treatmentExplanation: healthcareProviderTreatmentExplanation,
                isMedicalHistoryAsked: healthcareProviderIsMedicalHistoryAsked
            },
            appointments: {
                isConvenientTimeSlotFound: appointmentsIsConvenientTimeSlotFound,
                isSchedulingEasy: appointmentsIsSchedulingEasy,
                isReminderSent: appointmentsIsReminderSent,
                schedulingWay: appointmentsSchedulingWay
            }
        }

        const patientSurveyObj = new PatientSurveyModel(patientSurveyData)
        const newPatientSurvey = await patientSurveyObj.save()

        const updateDoctor = await UserModel
        .findByIdAndUpdate(doctorId, { totalReviews: doctor.totalReviews + 1 }, { new: true })


        let newCall = {}

        if(callDuration) {
            const counter = await CounterModel.findOneAndUpdate(
                { name: 'call' },
                { $inc: { value: 1 } },
                { new: true, upsert: true }
            )

            const callData = {
                callId: counter.value,
                patientId: reviewerId,
                doctorId,
                doneById,
                patientSurveyId: newPatientSurvey._id,
                duration: callDuration
            }

            const callObj = new CallModel(callData)
            newCall = await callObj.save()
        }
        
        return response.status(200).json({
            accepted: true,
            message: 'Added patient survey successfully!',
            patientSurvey: newPatientSurvey,
            call: newCall,
            doctor: updateDoctor
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

const getPatientsSurveysByDoctorId = async (request, response) => {

    try {

        const { userId } = request.params

        const { searchQuery } = utils.statsQueryGenerator('doctorId', userId, request.query)
        
        const patientsSurveys = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $limit: 25
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'reviewerId',
                    foreignField: '_id',
                    as: 'reviewer'
                }
            },
            {
                $project: {
                    'reviewer.password': 0
                }
            }
        ])

        patientsSurveys.forEach(patientSurvey => {
            patientSurvey.reviewer = patientSurvey.reviewer[0]
        })

        return response.status(200).json({
            accepted: true,
            patientsSurveys
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

const updatePatientSurvey = async (request, response) => {

    try {

        const { patientSurveyId } = request.params

        const dataValidation = patientValidator.updatePatientSurvey(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { 
            arrivalMethodId,
            overallExperience,
            serviceIdeaRate,
            serviceIdeaComment,
            callDuration,
            waitingTimeWaited,
            waitingIsDelayHappened,
            waitingIsDelayInformed,
            waitingSatisfaction,
            environmentIsClean,
            environmentIsComfortable,
            staffIsFriendly,
            staffIsResponsive,
            healthcareProviderAttentiveness,
            healthcareProviderIsAddressedAdequately,
            healthcareProviderTreatmentExplanation,
            healthcareProviderIsMedicalHistoryAsked,
            appointmentsIsConvenientTimeSlotFound,
            appointmentsIsSchedulingEasy,
            appointmentsIsReminderSent,
            appointmentsSchedulingWay,
        } = request.body 

        if(arrivalMethodId) {
            const arrivalMethod = await ArrivalMethodModel.findById(arrivalMethodId)
            if(!arrivalMethod) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Arrival method ID does not exist',
                    field: 'arrivalMethodId'
                })
            }
        }

        const patientSurveyData = {
            arrivalMethodId,
            overallExperience,
            serviceIdeaRate,
            serviceIdeaComment,
            callDuration,
            waiting: {
                timeWaited: waitingTimeWaited,
                isDelayHappened: waitingIsDelayHappened,
                isDelayInformed: waitingIsDelayInformed,
                waitingSatisfaction
            },
            environment: {
                isClean: environmentIsClean,
                isComfortable: environmentIsComfortable
            },
            staff: {
                isFriendly: staffIsFriendly,
                isResponsive: staffIsResponsive
            },
            healthcareProvider: {
                attentiveness: healthcareProviderAttentiveness,
                isAddressedAdequately: healthcareProviderIsAddressedAdequately,
                treatmentExplanation: healthcareProviderTreatmentExplanation,
                isMedicalHistoryAsked: healthcareProviderIsMedicalHistoryAsked
            },
            appointments: {
                isConvenientTimeSlotFound: appointmentsIsConvenientTimeSlotFound,
                isSchedulingEasy: appointmentsIsSchedulingEasy,
                isReminderSent: appointmentsIsReminderSent,
                schedulingWay: appointmentsSchedulingWay
            }
        }

        const updatedPatientSurvey = await PatientSurveyModel.findByIdAndUpdate(patientSurveyId, patientSurveyData, { new: true })
        
        return response.status(200).json({
            accepted: true,
            message: 'Updated patient survey successfully!',
            patientSurvey: updatedPatientSurvey
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

const deletePatientSurvey = async (request, response) => {

    try {

        const { patientSurveyId } = request.params

        const deletedPatientSurvey = await PatientSurveyModel.findByIdAndDelete(patientSurveyId)

        const { clinicId, patientId } = deletedPatientSurvey

        const patientsSurveysList = await PatientSurveyModel.find({ patientId })

        let updatedClinicPatient = {}

        if(patientsSurveysList.length == 0) {
            const updateClinicPatientData = { 
                survey: { 
                    isDone: false, 
                    doneById: null, 
                    doneDate: null
                } 
            }

            updatedClinicPatient = await ClinicPatientModel
            .findOneAndUpdate({ clinicId, patientId }, updateClinicPatientData, { new: true })
        }


        return response.status(200).json({
            accepted: true,
            message: 'Deleted patient survey successfully!',
            patientSurvey: deletedPatientSurvey,
            clinicPatient: updatedClinicPatient
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

const getPatientSurveyById = async (request, response) => {

    try {

        const { patientSurveyId } = request.params

        const patientSurveyList = await PatientSurveyModel.aggregate([
          {
            $match: {
                _id: mongoose.Types.ObjectId(patientSurveyId)
            }
          },
          {
            $lookup: {
                from: 'patients',
                localField: 'patientId',
                foreignField: '_id',
                as: 'patient'
            },
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
            $lookup: {
                from: 'users',
                localField: 'doneById',
                foreignField: '_id',
                as: 'member'
            }
          },
          {
            $lookup: {
                from: 'arrivalmethods',
                localField: 'arrivalMethodId',
                foreignField: '_id',
                as: 'arrivalMethod'
            }
          },
          {
            $project: {
                'member.password': 0,
                'patient.healthHistory': 0,
                'patient.emergencyContacts': 0
            }
          }
        ])

        patientSurveyList.forEach(patientSurvey => {
            patientSurvey.patient = patientSurvey.patient[0]
            patientSurvey.clinic = patientSurvey.clinic[0]
            patientSurvey.member = patientSurvey.member[0]
            patientSurvey.arrivalMethod = patientSurvey.arrivalMethod[0]
        })

        return response.status(200).json({
            accepted: true,
            patientSurvey: patientSurveyList[0]
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
    getPatientsSurveys, 
    getPatientsSurveysByPatientId,
    getPatientsSurveysByClinicId,
    getPatientsSurveysByOwnerId,
    getPatientsSurveysByDoneById,
    getPatientSurveyById,
    getPatientsSurveysByDoctorId,
    addPatientSurvey, 
    deletePatientSurvey, 
    updatePatientSurvey
}