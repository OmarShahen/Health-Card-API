const mongoose = require('mongoose')

const HealthHistorySchema = new mongoose.Schema({

    isSmokingPast: { type: Boolean },
    isSmokingPresent: { type: Boolean },
    isAlcoholPast: { type: Boolean },
    isAlcoholPresent: { type: Boolean },
    isHospitalConfined: { type: Boolean },
    hospitalConfinedReason: [],
    isSurgicalOperations: { type: Boolean },
    surgicalOperationsReason: [],
    isAllergic: { type: Boolean },
    allergies: [],
    isBloodTransfusion: { type: Boolean },
    isGeneticIssue: { type: Boolean },
    isCancerFamily: { type: Boolean },
    isHighBloodPressure: { type: Boolean },
    isDiabetic: { type: Boolean },
    isChronicHeart: { type: Boolean },
    isChronicNeurological: { type: Boolean },
    isChronicLiver: { type: Boolean },
    isChronicKidney: { type: Boolean },
    isImmuneDiseases: { type: Boolean },
    isBloodDiseases: { type: Boolean }

}, { timestamps: true })

module.exports = { HealthHistorySchema }