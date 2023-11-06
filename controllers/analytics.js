const PatientModel = require('../models/PatientModel')
const ClinicPatientModel = require('../models/ClinicPatientModel')
const ClinicOwnerModel = require('../models/ClinicOwnerModel')
const TreatmentSurveyModel = require('../models/followup-service/TreatmentSurveyModel')
const PatientSurveyModel = require('../models/followup-service/PatientSurveyModel')
const CallModel = require('../models/followup-service/CallModel')
const ClinicSubscriptionModel = require('../models/followup-service/ClinicSubscriptionModel')
const utils = require('../utils/utils')

const calculateCallsDurations = (calls) => {
    let total = 0
    for(let i=0;i<calls.length;i++) {
        total += calls[i].duration   
    }

    return total
}

const getOverviewAnalytics = async (request, response) => {

    try {

        const { userId } = request.params

        const ownedClinics = await ClinicOwnerModel.find({ ownerId: userId })
        const ownedClinicsIds = ownedClinics.map(clinic => clinic.clinicId)

        const uniqueOwnedIdsSet = new Set(ownedClinicsIds)
        const uniqueOwnedIdsList = [...uniqueOwnedIdsSet]

        let { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        searchQuery.clinicId = { $in: uniqueOwnedIdsList }

        const totalClinicPatients = await ClinicPatientModel.countDocuments(searchQuery)
        const totalTreatmentsSurveys = await TreatmentSurveyModel.countDocuments(searchQuery)
        const totalPatientsSurveys = await PatientSurveyModel.countDocuments(searchQuery)
        const totalCalls = await CallModel.countDocuments(searchQuery)
        const totalSurveys = totalTreatmentsSurveys + totalPatientsSurveys

        const clinicPatientsGrowth = await ClinicPatientModel.aggregate([
            {
                $match: {
                    clinicId: { $in: uniqueOwnedIdsList }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysOverallExperienceScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$overallExperience',
                    count: { $sum: 1 }
                }
            }
        ])

        const treatmentsSurveysImprovementScores = await TreatmentSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$improvement',
                    count: { $sum: 1 }
                }
            }
        ])

        clinicPatientsGrowth.sort((month1, month2) => new Date(month1._id) - new Date(month2._id))

        patientsSurveysOverallExperienceScores.sort((score1, score2) => score2._id - score1._id)

        treatmentsSurveysImprovementScores.sort((score1, score2) => score2._id - score1._id)

        return response.status(200).json({
            accepted: true,
            totalClinicPatients,
            totalTreatmentsSurveys,
            totalPatientsSurveys,
            totalCalls,
            totalSurveys,
            treatmentsSurveysImprovementScores,
            patientsSurveysOverallExperienceScores,
            clinicPatientsGrowth
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

const getImpressionsAnalytics = async (request, response) => {

    try {

        const { userId } = request.params

        const ownedClinics = await ClinicOwnerModel.find({ ownerId: userId })
        const ownedClinicsIds = ownedClinics.map(clinic => clinic.clinicId)

        const uniqueOwnedIdsSet = new Set(ownedClinicsIds)
        const uniqueOwnedIdsList = [...uniqueOwnedIdsSet]

        let { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        searchQuery.clinicId = { $in: uniqueOwnedIdsList }

        const totalClinicPatients = await ClinicPatientModel.countDocuments(searchQuery)
        const totalPatientsSurveys = await PatientSurveyModel.countDocuments(searchQuery)

        const patientsSurveysOverallExperienceScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$overallExperience',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysCleanScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$environment.isClean',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysComfortableScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$environment.isComfortable',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysStaffFriendlyScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$staff.isFriendly',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysStaffResponsiveScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$staff.isResponsive',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysWaitingSatisfactionScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$waiting.waitingSatisfaction',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysWaitingDelayHappenScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$waiting.isDelayHappened',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysWaitingDelayInformedScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$waiting.isDelayInformed',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysDoctorAttentionScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$healthcareProvider.attentiveness',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysSymptomsAddressedScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$healthcareProvider.isAddressedAdequately',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysTreatmentExplanationScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$healthcareProvider.treatmentExplanation',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysMedicalHistoryScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$healthcareProvider.isMedicalHistoryAsked',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysTimeSlotScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$appointments.isConvenientTimeSlotFound',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysSchedulingEaseScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$appointments.isSchedulingEasy',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysRemindersSentScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$appointments.isReminderSent',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysSchedulingWayScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$appointments.schedulingWay',
                    count: { $sum: 1 }
                }
            }
        ])

        patientsSurveysOverallExperienceScores.sort((score1, score2) => score2._id - score1._id)

        patientsSurveysCleanScores.sort((score1, score2) => score2.count - score1.count)
        patientsSurveysComfortableScores.sort((score1, score2) => score2.count - score1.count)

        patientsSurveysStaffFriendlyScores.sort((score1, score2) => score2.count - score1.count)
        patientsSurveysStaffResponsiveScores.sort((score1, score2) => score2.count - score1.count)

        patientsSurveysWaitingSatisfactionScores.sort((score1, score2) => score2._id - score1._id)
        patientsSurveysWaitingDelayHappenScores.sort((score1, score2) => score2.count - score1.count)
        patientsSurveysWaitingDelayInformedScores.sort((score1, score2) => score2.count - score1.count)

        patientsSurveysDoctorAttentionScores.sort((score1, score2) => score2._id - score1._id)
        patientsSurveysSymptomsAddressedScores.sort((score1, score2) => score2.count - score1.count)
        patientsSurveysTreatmentExplanationScores.sort((score1, score2) => score2._id - score1._id)
        patientsSurveysMedicalHistoryScores.sort((score1, score2) => score2.count - score1.count)

        patientsSurveysTimeSlotScores.sort((score1, score2) => score2.count - score1.count)
        patientsSurveysSchedulingEaseScores.sort((score1, score2) => score2.count - score1.count)
        patientsSurveysRemindersSentScores.sort((score1, score2) => score2.count - score1.count)
        patientsSurveysSchedulingWayScores.sort((score1, score2) => score2.count - score1.count)


        return response.status(200).json({
            accepted: true,
            totalClinicPatients,
            totalPatientsSurveys,
            patientsSurveysSchedulingWayScores,
            patientsSurveysRemindersSentScores,
            patientsSurveysSchedulingEaseScores,
            patientsSurveysTimeSlotScores,
            patientsSurveysDoctorAttentionScores,
            patientsSurveysSymptomsAddressedScores,
            patientsSurveysTreatmentExplanationScores,
            patientsSurveysMedicalHistoryScores,
            patientsSurveysWaitingSatisfactionScores,
            patientsSurveysWaitingDelayHappenScores,
            patientsSurveysWaitingDelayInformedScores,
            patientsSurveysStaffResponsiveScores,
            patientsSurveysStaffFriendlyScores,
            patientsSurveysComfortableScores,
            patientsSurveysCleanScores,
            patientsSurveysOverallExperienceScores,
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            messahe: 'internal server error',
            error: error.message
        })
    }
}

const getTreatmentsAnalytics = async (request, response) => {

    try {

        const { userId } = request.params

        const ownedClinics = await ClinicOwnerModel.find({ ownerId: userId })
        const ownedClinicsIds = ownedClinics.map(clinic => clinic.clinicId)

        const uniqueOwnedIdsSet = new Set(ownedClinicsIds)
        const uniqueOwnedIdsList = [...uniqueOwnedIdsSet]

        let { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        searchQuery.clinicId = { $in: uniqueOwnedIdsList }

        const totalClinicPatients = await ClinicPatientModel.countDocuments(searchQuery)
        const totalTreatmentSurveys = await TreatmentSurveyModel.countDocuments(searchQuery)

        const treatmentsSurveysImprovementScores = await TreatmentSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$improvement',
                    count: { $sum: 1 }
                }
            }
        ])

        const treatmentsSurveysExperiencedSideEffectsScores = await TreatmentSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$isExperiencedSideEffects',
                    count: { $sum: 1 }
                }
            }
        ])

        const treatmentsSurveysNewSymptomsOccuredScores = await TreatmentSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$isNewSymptomsOccured',
                    count: { $sum: 1 }
                }
            }
        ])

        const treatmentsSurveysMedicationTookAsPrescribedScores = await TreatmentSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$isMedicationTookAsPrescribed',
                    count: { $sum: 1 }
                }
            }
        ])

        const treatmentsSurveysDosageMissedScores = await TreatmentSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$isDosagesMissed',
                    count: { $sum: 1 }
                }
            }
        ])

        const treatmentsSurveysObtainingMedicationScores = await TreatmentSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$isThereChallengesObtainingMedication',
                    count: { $sum: 1 }
                }
            }
        ])

        const treatmentsSurveysTakingMedicationScores = await TreatmentSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$isThereChallengesTakingMedication',
                    count: { $sum: 1 }
                }
            }
        ])

        const treatmentsSurveysTakingOutterMedicationScores = await TreatmentSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$isTakingOtherOutterMedication',
                    count: { $sum: 1 }
                }
            }
        ])

        const treatmentsSurveysProblemRemeberingScores = await TreatmentSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$isThereProblemRemebering',
                    count: { $sum: 1 }
                }
            }
        ])

        treatmentsSurveysImprovementScores.sort((score1, score2) => score2._id - score1._id)

        treatmentsSurveysExperiencedSideEffectsScores.sort((score1, score2) => score2.count - score1.count)
        treatmentsSurveysNewSymptomsOccuredScores.sort((score1, score2) => score2.count - score1.count)

        treatmentsSurveysMedicationTookAsPrescribedScores.sort((score1, score2) => score2.count - score1.count)
        treatmentsSurveysDosageMissedScores.sort((score1, score2) => score2.count - score1.count)

        treatmentsSurveysObtainingMedicationScores.sort((score1, score2) => score2.count - score1.count)
        treatmentsSurveysTakingMedicationScores.sort((score1, score2) => score2.count - score1.count)

        treatmentsSurveysTakingOutterMedicationScores.sort((score1, score2) => score2.count - score1.count)
        treatmentsSurveysProblemRemeberingScores.sort((score1, score2) => score2.count - score1.count)

        return response.status(200).json({
            accepted: true,
            totalClinicPatients,
            totalTreatmentSurveys,
            treatmentsSurveysTakingOutterMedicationScores,
            treatmentsSurveysProblemRemeberingScores,
            treatmentsSurveysObtainingMedicationScores,
            treatmentsSurveysTakingMedicationScores,
            treatmentsSurveysMedicationTookAsPrescribedScores,
            treatmentsSurveysDosageMissedScores,
            treatmentsSurveysExperiencedSideEffectsScores,
            treatmentsSurveysNewSymptomsOccuredScores,
            treatmentsSurveysImprovementScores,
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            messahe: 'internal server error',
            error: error.message
        })
    }
}

const getMarketingAnalytics = async (request, response) => {

    try {

        const { userId } = request.params

        const ownedClinics = await ClinicOwnerModel.find({ ownerId: userId })
        const ownedClinicsIds = ownedClinics.map(clinic => clinic.clinicId)

        const uniqueOwnedIdsSet = new Set(ownedClinicsIds)
        const uniqueOwnedIdsList = [...uniqueOwnedIdsSet]

        let { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        searchQuery.clinicId = { $in: uniqueOwnedIdsList }

        const totalClinicPatients = await ClinicPatientModel.countDocuments(searchQuery)
        const totalPatientsSurveys = await PatientSurveyModel.countDocuments(searchQuery)

        const patientsGenderScore = await ClinicPatientModel.aggregate([
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
                $unwind: '$patient'
            },
            {
                $group: {
                    _id: '$patient.gender',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsAgeScore = await ClinicPatientModel.aggregate([
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
                $unwind: '$patient'
            },
            {
                $group: {
                    _id: '$patient.dateOfBirth',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsCitiesScore = await ClinicPatientModel.aggregate([
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
                $unwind: '$patient'
            },
            {
                $group: {
                    _id: '$patient.city',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSocialStatusScore = await ClinicPatientModel.aggregate([
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
                $unwind: '$patient'
            },
            {
                $group: {
                    _id: '$patient.socialStatus',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysSchedulingWayScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$appointments.schedulingWay',
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsArrivingMethods = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$arrivalMethodId',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'arrivalmethods',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'arrivalMethod'
                }
            },
            {
                $unwind: '$arrivalMethod'
            }
        ])

        patientsAgeScore.forEach(dateOfBirth => dateOfBirth._id = utils.getAge(dateOfBirth._id))

        patientsGenderScore.sort((score1, score2) => score2.count - score1.count)
        patientsAgeScore.sort((score1, score2) => score2.count - score1.count)
        patientsCitiesScore.sort((score1, score2) => score2.count - score1.count)
        patientsSocialStatusScore.sort((score1, score2) => score2.count - score1.count)

        patientsSurveysSchedulingWayScores.sort((score1, score2) => score2.count - score1.count)

        patientsArrivingMethods.sort((score1, score2) => score2.count - score1.count)

        patientsArrivingMethods.forEach(method => method._id = method?.arrivalMethod?.name)

        return response.status(200).json({
            accepted: true,
            totalClinicPatients,
            totalPatientsSurveys,
            patientsArrivingMethods,
            patientsSurveysSchedulingWayScores,
            patientsAgeScore,
            patientsSocialStatusScore,
            patientsCitiesScore,
            patientsGenderScore,
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

const getFollowupServiceOverviewAnalytics = async (request, response) => {

    try {

        const subscriptionList = await ClinicSubscriptionModel.find()

        const clinicsIds = subscriptionList.map(subscription => subscription.clinicId)
        
        const uniqueClinicIdsSet = new Set(clinicsIds)
        const uniqueClinicIdsList = [...uniqueClinicIdsSet]

        let { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        const totalPatients = await ClinicPatientModel
        .countDocuments({ ...searchQuery, clinicId: { $in: uniqueClinicIdsList } })
        const totalTreatmentsSurveys = await TreatmentSurveyModel.countDocuments(searchQuery)
        const totalPatientsSurveys = await PatientSurveyModel.countDocuments(searchQuery)
        const totalCalls = await CallModel.countDocuments(searchQuery)
        const totalSurveys = totalTreatmentsSurveys + totalPatientsSurveys

        const totalWaitingSurveys = await ClinicPatientModel
        .countDocuments({ ...searchQuery, survey: { isDone: false } })

        const calls = await CallModel.find(searchQuery)

        const totalCallsDuration = calculateCallsDurations(calls)
        const averageCallDuration = totalCallsDuration / calls.length

        return response.status(200).json({
            accepted: true,
            averageCallDuration,
            totalCallsDuration,
            totalWaitingSurveys,
            totalPatients,
            totalTreatmentsSurveys,
            totalPatientsSurveys,
            totalCalls,
            totalSurveys
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
    getOverviewAnalytics, 
    getImpressionsAnalytics, 
    getTreatmentsAnalytics,
    getMarketingAnalytics,
    getFollowupServiceOverviewAnalytics
}