const mongoose = require('mongoose')

const TreatmentSurveySchema = new mongoose.Schema({

    treatmentSurveyId: { type: Number, required: true },
    doneById: { type: mongoose.Types.ObjectId, required: true },
    patientId: { type: mongoose.Types.ObjectId, required: true },
    clinicId: { type: mongoose.Types.ObjectId, required: true },
    recordedBy: { type: String, default: 'CALL' },
    callDuration: { type: Number },
    improvement: { type: Number, required: true },
    isOverallHealthChanged: { type: Boolean, required: true },
    isExperiencedSideEffects: { type: Boolean, required: true },
    experiencedSideEffects: [],
    isMedicationTookAsPrescribed: { type: Boolean, required: true },
    isDosagesMissed: { type: Boolean, required: true },
    isTakingOtherOutterMedication: { type: Boolean, required: true },
    isThereChallengesObtainingMedication: { type: Boolean, required: true },
    challengesObtainingMedication: [],
    isThereChallengesTakingMedication: { type: Boolean, required: true },
    challengesTakingMedication: [],
    isThereProblemRemebering: { type: Boolean, required: true },
    isNewSymptomsOccured: { type: Boolean, required: true },
    newSymptomsOccured: [],

}, { timestamps: true })


module.exports = mongoose.model('TreatmentSurvey', TreatmentSurveySchema)