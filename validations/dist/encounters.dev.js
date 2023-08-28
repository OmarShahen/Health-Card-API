"use strict";

var utils = require('../utils/utils');

var medicineValidation = function medicineValidation(medicine) {
  var name = medicine.name,
      frequency = medicine.frequency,
      duration = medicine.duration,
      dosage = medicine.dosage,
      instructions = medicine.instructions;
  if (!name) return {
    isAccepted: false,
    message: 'Medicine name is required',
    field: 'medicine.name'
  };
  if (typeof name != 'string') return {
    isAccepted: false,
    message: 'Medicine name must be a string',
    field: 'medicine.name'
  }; //if(!dosage) return { isAccepted: false, message: 'Medicine dosage is required', field: 'medicine.dosage' }

  if (dosage && typeof dosage.amount != 'number') return {
    isAccepted: false,
    message: 'Dosage amount must be a number',
    field: 'medicine.dosage.amount'
  };
  if (dosage && typeof dosage.unit != 'string') return {
    isAccepted: false,
    message: 'Dosage unit must be a string',
    field: 'medicine.dosage.unit'
  }; //if(dosage && !config.DOSGAE_TYPES.includes(dosage.unit)) return { isAccepted: false, message: 'Dosage type is not registered', field: 'medicine.dosage.unit' }
  //if(!frequency) return { isAccepted: false, message: 'Medicine frequency is required', field: 'medicine.frequency' }

  if (frequency && typeof frequency.number != 'number') return {
    isAccepted: false,
    message: 'Frequency number must be a number',
    field: 'medicine.frequency.number'
  };
  if (frequency && typeof frequency.timeUnit != 'string') return {
    isAccepted: false,
    message: 'Frequency time unit must be a string',
    field: 'medicine.frequency.timeUnit'
  }; //if(frequency && !config.TIME_UNIT.includes(frequency.timeUnit)) return { isAccepted: false, message: 'Frequency time unit is not registered', field: 'medicine.frequency.timeUnit' }
  //if(!duration) return { isAccepted: false, message: 'Medicine duration is required', field: 'medicine.duration' }

  if (duration && typeof duration.number != 'number') return {
    isAccepted: false,
    message: 'Duration number must be a number',
    field: 'medicine.duration.number'
  };
  if (duration && typeof duration.timeUnit != 'string') return {
    isAccepted: false,
    message: 'Duration time unit must be a string',
    field: 'medicine.duration.timeUnit'
  }; //if(duration && !config.TIME_UNIT.includes(duration.timeUnit)) return { isAccepted: false, message: 'Duration time unit is not registered', field: 'medicine.duration.timeUnit' }

  if (!Array.isArray(instructions)) return {
    isAccepted: false,
    message: 'Medicine instructions is required',
    field: 'medicine.instructions'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: medicine
  };
};

var addEncounter = function addEncounter(encounterData) {
  var doctorId = encounterData.doctorId,
      patientId = encounterData.patientId,
      clinicId = encounterData.clinicId,
      symptoms = encounterData.symptoms,
      diagnosis = encounterData.diagnosis,
      notes = encounterData.notes,
      medicines = encounterData.medicines,
      registrationDate = encounterData.registrationDate;
  if (!doctorId) return {
    isAccepted: false,
    message: 'Doctor Id is required',
    field: 'doctorId'
  };
  if (!utils.isObjectId(doctorId)) return {
    isAccepted: false,
    message: 'Invalid doctor Id formate',
    field: 'doctorId'
  };
  if (!patientId) return {
    isAccepted: false,
    message: 'Patient Id is required',
    field: 'patientId'
  };
  if (!utils.isObjectId(patientId)) return {
    isAccepted: false,
    message: 'Invalid patient Id format',
    field: 'patientId'
  };
  if (!clinicId) return {
    isAccepted: false,
    message: 'Clinic Id is required',
    field: 'clinicId'
  };
  if (!utils.isObjectId(clinicId)) return {
    isAccepted: false,
    message: 'Invalid clinic Id formate',
    field: 'clinicId'
  };
  if (!Array.isArray(symptoms)) return {
    isAccepted: false,
    message: 'Symptoms must be a list',
    field: 'symptoms'
  };
  if (symptoms.length == 0) return {
    isAccepted: false,
    message: 'Symptoms is required',
    field: 'symptoms'
  };
  if (!Array.isArray(diagnosis)) return {
    isAccepted: false,
    message: 'Diagnosis must be a list',
    field: 'diagnosis'
  };
  if (diagnosis.length == 0) return {
    isAccepted: false,
    message: 'Diagnosis must be a list',
    field: 'diagnosis'
  };
  if (notes && !Array.isArray(notes)) return {
    isAccepted: false,
    message: 'Notes is required',
    field: 'notes'
  };
  if (notes && notes.length == 0) return {
    isAccepted: false,
    message: 'Notes must be a list',
    field: 'notes'
  };
  if (registrationDate && !utils.isDateTimeValid(registrationDate)) return {
    isAccepted: false,
    message: 'registration date is invalid',
    field: 'registrationDate'
  };

  if (medicines) {
    if (!Array.isArray(medicines)) return {
      isAccepted: false,
      message: 'Medicines must be a list',
      field: 'medicines'
    };

    for (var i = 0; i < medicines.length; i++) {
      var dataValidation = medicineValidation(medicines[i]);
      if (!dataValidation.isAccepted) return dataValidation;
    }
  }

  return {
    isAccepted: true,
    message: 'data is valid',
    data: encounterData
  };
};

var updateEncounter = function updateEncounter(encounterData) {
  var symptoms = encounterData.symptoms,
      diagnosis = encounterData.diagnosis,
      notes = encounterData.notes;
  if (!Array.isArray(symptoms)) return {
    isAccepted: false,
    message: 'Symptoms must be a list',
    field: 'symptoms'
  };
  if (symptoms.length == 0) return {
    isAccepted: false,
    message: 'Symptoms is required',
    field: 'symptoms'
  };
  if (!Array.isArray(diagnosis)) return {
    isAccepted: false,
    message: 'Diagnosis must be a list',
    field: 'diagnosis'
  };
  if (diagnosis.length == 0) return {
    isAccepted: false,
    message: 'Diagnosis must be a list',
    field: 'diagnosis'
  };
  if (notes && !Array.isArray(notes)) return {
    isAccepted: false,
    message: 'Notes is required',
    field: 'notes'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: encounterData
  };
};

module.exports = {
  addEncounter: addEncounter,
  updateEncounter: updateEncounter
};