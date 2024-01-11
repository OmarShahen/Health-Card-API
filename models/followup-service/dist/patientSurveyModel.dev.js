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
    type: mongoose.Types.ObjectId
  },
  clinicId: {
    type: mongoose.Types.ObjectId
  },
  doctorId: {
    type: mongoose.Types.ObjectId
  },
  reviewerId: {
    type: mongoose.Types.ObjectId
  },
  arrivalMethodId: {
    type: mongoose.Types.ObjectId
  },
  overallExperience: {
    type: Number
  },
  serviceIdeaRate: {
    type: Number
  },
  serviceIdeaComment: {
    type: String
  },
  callDuration: {
    type: Number
  },
  comment: {
    type: String
  },
  recordedBy: {
    type: String,
    "default": 'CALL'
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
      type: Number
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
      type: Number
    },
    isAddressedAdequately: {
      type: Boolean
    },
    treatmentExplanation: {
      type: Number
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