"use strict";

var mongoose = require('mongoose');

var PatientSurveySchema = new mongoose.Schema({
  patientSurveyId: {
    type: Number,
    required: true
  },
  doneById: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  patientId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  clinicId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  overallExperience: {
    type: String
  },
  waiting: {
    timeWaited: {
      type: Number
    },
    isDelayHappened: {
      type: Boolean
    },
    isDelayInformed: {
      type: Boolean
    },
    waitingSatisfaction: {
      type: String
    }
  },
  environment: {
    isClean: {
      type: Boolean
    },
    isComfortable: {
      type: Boolean
    }
  },
  staff: {
    isFriendly: {
      type: Boolean
    },
    isResponsive: {
      type: Boolean
    }
  },
  healthcareProvider: {
    attentiveness: {
      type: String
    },
    isAddressedAdequately: {
      type: Boolean
    },
    isTreatmentExplainedClearly: {
      type: Boolean
    },
    isMedicalHistoryAsked: {
      type: Boolean
    }
  },
  appointments: {
    isConvenientTimeSlotFound: {
      type: Boolean
    },
    isSchedulingEasy: {
      type: Boolean
    },
    isReminderSent: {
      type: Boolean
    },
    schedulingWay: {
      type: String
    }
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('PatientSurvey', PatientSurveySchema);