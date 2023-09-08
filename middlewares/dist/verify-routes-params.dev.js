"use strict";

var utils = require('../utils/utils');

var ClinicModel = require('../models/ClinicModel');

var PatientModel = require('../models/PatientModel');

var UserModel = require('../models/UserModel');

var PrescriptionModel = require('../models/PrescriptionModel');

var AppointmentModel = require('../models/AppointmentModel');

var EncounterModel = require('../models/EncounterModel');

var ClinicPatientModel = require('../models/ClinicPatientModel');

var VisitReasonModel = require('../models/VisitReasonModel');

var SpecialityModel = require('../models/SpecialityModel');

var ClinicOwnerModel = require('../models/ClinicOwnerModel');

var ClinicDoctorModel = require('../models/ClinicDoctorModel');

var ClinicPatientDoctorModel = require('../models/ClinicPatientDoctorModel');

var ClinicRequestModel = require('../models/ClinicRequestModel');

var ServiceModel = require('../models/ServiceModel');

var InvoiceModel = require('../models/InvoiceModel');

var InvoiceServiceModel = require('../models/InvoiceServiceModel');

var CardModel = require('../models/CardModel');

var SubscriptionModel = require('../models/SubscriptionModel');

var InsuranceModel = require('../models/InsuranceModel');

var InsurancePolicyModel = require('../models/InsurancePolicyModel');

var FolderModel = require('../models/file-storage/FolderModel');

var FileModel = require('../models/file-storage/FileModel');

var verifyClinicId = function verifyClinicId(request, response, next) {
  var clinicId, clinic;
  return regeneratorRuntime.async(function verifyClinicId$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          clinicId = request.params.clinicId;

          if (utils.isObjectId(clinicId)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid clinic Id formate',
            field: 'clinicId'
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 6:
          clinic = _context.sent;

          if (clinic) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'clinic Id does not exist',
            field: 'clinicId'
          }));

        case 9:
          return _context.abrupt("return", next());

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyPatientId = function verifyPatientId(request, response, next) {
  var patientId, patient;
  return regeneratorRuntime.async(function verifyPatientId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          patientId = request.params.patientId;

          if (utils.isObjectId(patientId)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid patient Id formate',
            field: 'patientId'
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(PatientModel.findById(patientId));

        case 6:
          patient = _context2.sent;

          if (patient) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'patient Id does not exist',
            field: 'patientId'
          }));

        case 9:
          return _context2.abrupt("return", next());

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyUserId = function verifyUserId(request, response, next) {
  var userId, user;
  return regeneratorRuntime.async(function verifyUserId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = request.params.userId;

          if (utils.isObjectId(userId)) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid user Id formate',
            field: 'userId'
          }));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(UserModel.findById(userId));

        case 6:
          user = _context3.sent;

          if (user) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'user Id does not exist',
            field: 'userId'
          }));

        case 9:
          return _context3.abrupt("return", next());

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyDoctorId = function verifyDoctorId(request, response, next) {
  var doctorId, doctor;
  return regeneratorRuntime.async(function verifyDoctorId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          doctorId = request.params.doctorId;

          if (utils.isObjectId(doctorId)) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid doctor Id formate',
            field: 'doctorId'
          }));

        case 4:
          _context4.next = 6;
          return regeneratorRuntime.awrap(UserModel.findById(doctorId));

        case 6:
          doctor = _context4.sent;

          if (!(!doctor || !doctor.roles.includes('DOCTOR'))) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'doctor Id does not exist',
            field: 'doctorId'
          }));

        case 9:
          return _context4.abrupt("return", next());

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyPrescriptionId = function verifyPrescriptionId(request, response, next) {
  var prescriptionId, prescription;
  return regeneratorRuntime.async(function verifyPrescriptionId$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          prescriptionId = request.params.prescriptionId;

          if (utils.isObjectId(prescriptionId)) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid prescription Id formate',
            field: 'prescriptionId'
          }));

        case 4:
          _context5.next = 6;
          return regeneratorRuntime.awrap(PrescriptionModel.findById(prescriptionId));

        case 6:
          prescription = _context5.sent;

          if (prescription) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'prescription Id does not exist',
            field: 'prescriptionId'
          }));

        case 9:
          request.doctorId = prescription.doctorId;
          return _context5.abrupt("return", next());

        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 17:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var verifyCardId = function verifyCardId(request, response, next) {
  var cardId, cardsList;
  return regeneratorRuntime.async(function verifyCardId$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          cardId = request.params.cardId;
          _context6.next = 4;
          return regeneratorRuntime.awrap(CardModel.find({
            cardId: cardId
          }));

        case 4:
          cardsList = _context6.sent;

          if (!(cardsList.length == 0)) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'card Id does not exist',
            field: 'cardId'
          }));

        case 7:
          return _context6.abrupt("return", next());

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var verifyAppointmentId = function verifyAppointmentId(request, response, next) {
  var appointmentId, appointment;
  return regeneratorRuntime.async(function verifyAppointmentId$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          appointmentId = request.params.appointmentId;

          if (utils.isObjectId(appointmentId)) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid appointment Id formate',
            field: 'appointmentId'
          }));

        case 4:
          _context7.next = 6;
          return regeneratorRuntime.awrap(AppointmentModel.findById(appointmentId));

        case 6:
          appointment = _context7.sent;

          if (appointment) {
            _context7.next = 9;
            break;
          }

          return _context7.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'appointment Id does not exist',
            field: 'appointmentId'
          }));

        case 9:
          return _context7.abrupt("return", next());

        case 12:
          _context7.prev = 12;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyEncounterId = function verifyEncounterId(request, response, next) {
  var encounterId, encounter;
  return regeneratorRuntime.async(function verifyEncounterId$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          encounterId = request.params.encounterId;

          if (utils.isObjectId(encounterId)) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid encounter Id formate',
            field: 'encounterId'
          }));

        case 4:
          _context8.next = 6;
          return regeneratorRuntime.awrap(EncounterModel.findById(encounterId));

        case 6:
          encounter = _context8.sent;

          if (encounter) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'encounter Id does not exist',
            field: 'encounterId'
          }));

        case 9:
          request.doctorId = encounter.doctorId;
          return _context8.abrupt("return", next());

        case 13:
          _context8.prev = 13;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 17:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var verifyClinicPatientId = function verifyClinicPatientId(request, response, next) {
  var clinicPatientId, clinicPatient;
  return regeneratorRuntime.async(function verifyClinicPatientId$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          clinicPatientId = request.params.clinicPatientId;

          if (utils.isObjectId(clinicPatientId)) {
            _context9.next = 4;
            break;
          }

          return _context9.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid clinic patient Id formate',
            field: 'clinicPatientId'
          }));

        case 4:
          _context9.next = 6;
          return regeneratorRuntime.awrap(ClinicPatientModel.findById(clinicPatientId));

        case 6:
          clinicPatient = _context9.sent;

          if (clinicPatient) {
            _context9.next = 9;
            break;
          }

          return _context9.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'clinic patient Id does not exist',
            field: 'clinicPatientId'
          }));

        case 9:
          return _context9.abrupt("return", next());

        case 12:
          _context9.prev = 12;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 16:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyVisitReasonId = function verifyVisitReasonId(request, response, next) {
  var visitReasonId, visitReason;
  return regeneratorRuntime.async(function verifyVisitReasonId$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          visitReasonId = request.params.visitReasonId;

          if (utils.isObjectId(visitReasonId)) {
            _context10.next = 4;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid visit reason Id formate',
            field: 'visitReasonId'
          }));

        case 4:
          _context10.next = 6;
          return regeneratorRuntime.awrap(VisitReasonModel.findById(visitReasonId));

        case 6:
          visitReason = _context10.sent;

          if (visitReason) {
            _context10.next = 9;
            break;
          }

          return _context10.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'visit reason Id does not exist',
            field: 'visitReasonId'
          }));

        case 9:
          return _context10.abrupt("return", next());

        case 12:
          _context10.prev = 12;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          return _context10.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context10.t0.message
          }));

        case 16:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifySpecialityId = function verifySpecialityId(request, response, next) {
  var specialityId, speciality;
  return regeneratorRuntime.async(function verifySpecialityId$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          specialityId = request.params.specialityId;

          if (utils.isObjectId(specialityId)) {
            _context11.next = 4;
            break;
          }

          return _context11.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid speciality Id formate',
            field: 'specialityId'
          }));

        case 4:
          _context11.next = 6;
          return regeneratorRuntime.awrap(SpecialityModel.findById(specialityId));

        case 6:
          speciality = _context11.sent;

          if (speciality) {
            _context11.next = 9;
            break;
          }

          return _context11.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'speciality Id does not exist',
            field: 'specialityId'
          }));

        case 9:
          return _context11.abrupt("return", next());

        case 12:
          _context11.prev = 12;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          return _context11.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context11.t0.message
          }));

        case 16:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyClinicOwnerId = function verifyClinicOwnerId(request, response, next) {
  var clinicOwnerId, clinicOwner;
  return regeneratorRuntime.async(function verifyClinicOwnerId$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          clinicOwnerId = request.params.clinicOwnerId;

          if (utils.isObjectId(clinicOwnerId)) {
            _context12.next = 4;
            break;
          }

          return _context12.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid clinic owner Id formate',
            field: 'clinicOwnerId'
          }));

        case 4:
          _context12.next = 6;
          return regeneratorRuntime.awrap(ClinicOwnerModel.findById(clinicOwnerId));

        case 6:
          clinicOwner = _context12.sent;

          if (clinicOwner) {
            _context12.next = 9;
            break;
          }

          return _context12.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'clinic owner Id does not exist',
            field: 'clinicOwnerId'
          }));

        case 9:
          return _context12.abrupt("return", next());

        case 12:
          _context12.prev = 12;
          _context12.t0 = _context12["catch"](0);
          console.error(_context12.t0);
          return _context12.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context12.t0.message
          }));

        case 16:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyClinicDoctorId = function verifyClinicDoctorId(request, response, next) {
  var clinicDoctorId, clinicDoctor;
  return regeneratorRuntime.async(function verifyClinicDoctorId$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          clinicDoctorId = request.params.clinicDoctorId;

          if (utils.isObjectId(clinicDoctorId)) {
            _context13.next = 4;
            break;
          }

          return _context13.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid clinic doctor Id formate',
            field: 'clinicDoctorId'
          }));

        case 4:
          _context13.next = 6;
          return regeneratorRuntime.awrap(ClinicDoctorModel.findById(clinicDoctorId));

        case 6:
          clinicDoctor = _context13.sent;

          if (clinicDoctor) {
            _context13.next = 9;
            break;
          }

          return _context13.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'clinic doctor Id does not exist',
            field: 'clinicDoctorId'
          }));

        case 9:
          return _context13.abrupt("return", next());

        case 12:
          _context13.prev = 12;
          _context13.t0 = _context13["catch"](0);
          console.error(_context13.t0);
          return _context13.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context13.t0.message
          }));

        case 16:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyClinicPatientDoctorId = function verifyClinicPatientDoctorId(request, response, next) {
  var clinicPatientDoctorId, clinicPatientDoctor;
  return regeneratorRuntime.async(function verifyClinicPatientDoctorId$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          clinicPatientDoctorId = request.params.clinicPatientDoctorId;

          if (utils.isObjectId(clinicPatientDoctorId)) {
            _context14.next = 4;
            break;
          }

          return _context14.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid clinic patient doctor Id formate',
            field: 'clinicPatientDoctorId'
          }));

        case 4:
          _context14.next = 6;
          return regeneratorRuntime.awrap(ClinicPatientDoctorModel.findById(clinicPatientDoctorId));

        case 6:
          clinicPatientDoctor = _context14.sent;

          if (clinicPatientDoctor) {
            _context14.next = 9;
            break;
          }

          return _context14.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'clinic patient doctor Id does not exist',
            field: 'clinicPatientDoctorId'
          }));

        case 9:
          return _context14.abrupt("return", next());

        case 12:
          _context14.prev = 12;
          _context14.t0 = _context14["catch"](0);
          console.error(_context14.t0);
          return _context14.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context14.t0.message
          }));

        case 16:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyClinicRequestId = function verifyClinicRequestId(request, response, next) {
  var clinicRequestId, clinicRequest;
  return regeneratorRuntime.async(function verifyClinicRequestId$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          clinicRequestId = request.params.clinicRequestId;

          if (utils.isObjectId(clinicRequestId)) {
            _context15.next = 4;
            break;
          }

          return _context15.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid clinic request Id formate',
            field: 'clinicRequestId'
          }));

        case 4:
          _context15.next = 6;
          return regeneratorRuntime.awrap(ClinicRequestModel.findById(clinicRequestId));

        case 6:
          clinicRequest = _context15.sent;

          if (clinicRequest) {
            _context15.next = 9;
            break;
          }

          return _context15.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'clinic request Id does not exist',
            field: 'clinicRequestId'
          }));

        case 9:
          // for the check clinic mode middleware
          request.body.clinicId = clinicRequest.clinicId;
          return _context15.abrupt("return", next());

        case 13:
          _context15.prev = 13;
          _context15.t0 = _context15["catch"](0);
          console.error(_context15.t0);
          return _context15.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context15.t0.message
          }));

        case 17:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var verifyServiceId = function verifyServiceId(request, response, next) {
  var serviceId, service;
  return regeneratorRuntime.async(function verifyServiceId$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          serviceId = request.params.serviceId;

          if (utils.isObjectId(serviceId)) {
            _context16.next = 4;
            break;
          }

          return _context16.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid service Id formate',
            field: 'serviceId'
          }));

        case 4:
          _context16.next = 6;
          return regeneratorRuntime.awrap(ServiceModel.findById(serviceId));

        case 6:
          service = _context16.sent;

          if (service) {
            _context16.next = 9;
            break;
          }

          return _context16.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'service Id does not exist',
            field: 'serviceId'
          }));

        case 9:
          return _context16.abrupt("return", next());

        case 12:
          _context16.prev = 12;
          _context16.t0 = _context16["catch"](0);
          console.error(_context16.t0);
          return _context16.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context16.t0.message
          }));

        case 16:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyInvoiceId = function verifyInvoiceId(request, response, next) {
  var invoiceId, invoice;
  return regeneratorRuntime.async(function verifyInvoiceId$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          invoiceId = request.params.invoiceId;

          if (utils.isObjectId(invoiceId)) {
            _context17.next = 4;
            break;
          }

          return _context17.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid invoice Id formate',
            field: 'invoiceId'
          }));

        case 4:
          _context17.next = 6;
          return regeneratorRuntime.awrap(InvoiceModel.findById(invoiceId));

        case 6:
          invoice = _context17.sent;

          if (invoice) {
            _context17.next = 9;
            break;
          }

          return _context17.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'invoice Id does not exist',
            field: 'invoiceId'
          }));

        case 9:
          return _context17.abrupt("return", next());

        case 12:
          _context17.prev = 12;
          _context17.t0 = _context17["catch"](0);
          console.error(_context17.t0);
          return _context17.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context17.t0.message
          }));

        case 16:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyInvoiceServiceId = function verifyInvoiceServiceId(request, response, next) {
  var invoiceServiceId, invoiceService;
  return regeneratorRuntime.async(function verifyInvoiceServiceId$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          invoiceServiceId = request.params.invoiceServiceId;

          if (utils.isObjectId(invoiceServiceId)) {
            _context18.next = 4;
            break;
          }

          return _context18.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid invoice service Id format',
            field: 'invoiceServiceId'
          }));

        case 4:
          _context18.next = 6;
          return regeneratorRuntime.awrap(InvoiceServiceModel.findById(invoiceServiceId));

        case 6:
          invoiceService = _context18.sent;

          if (invoiceService) {
            _context18.next = 9;
            break;
          }

          return _context18.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'invoice service Id does not exist',
            field: 'invoiceServiceId'
          }));

        case 9:
          return _context18.abrupt("return", next());

        case 12:
          _context18.prev = 12;
          _context18.t0 = _context18["catch"](0);
          console.error(_context18.t0);
          return _context18.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context18.t0.message
          }));

        case 16:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifySubscriptionId = function verifySubscriptionId(request, response, next) {
  var subscriptionId, subscription;
  return regeneratorRuntime.async(function verifySubscriptionId$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.prev = 0;
          subscriptionId = request.params.subscriptionId;

          if (utils.isObjectId(subscriptionId)) {
            _context19.next = 4;
            break;
          }

          return _context19.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid subscription Id format',
            field: 'subscriptionId'
          }));

        case 4:
          _context19.next = 6;
          return regeneratorRuntime.awrap(SubscriptionModel.findById(subscriptionId));

        case 6:
          subscription = _context19.sent;

          if (subscription) {
            _context19.next = 9;
            break;
          }

          return _context19.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'subscription Id does not exist',
            field: 'subscriptionId'
          }));

        case 9:
          return _context19.abrupt("return", next());

        case 12:
          _context19.prev = 12;
          _context19.t0 = _context19["catch"](0);
          console.error(_context19.t0);
          return _context19.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context19.t0.message
          }));

        case 16:
        case "end":
          return _context19.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyInsuranceId = function verifyInsuranceId(request, response, next) {
  var insuranceId, insurance;
  return regeneratorRuntime.async(function verifyInsuranceId$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _context20.prev = 0;
          insuranceId = request.params.insuranceId;

          if (utils.isObjectId(insuranceId)) {
            _context20.next = 4;
            break;
          }

          return _context20.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid insurance Id format',
            field: 'insuranceId'
          }));

        case 4:
          _context20.next = 6;
          return regeneratorRuntime.awrap(InsuranceModel.findById(insuranceId));

        case 6:
          insurance = _context20.sent;

          if (insurance) {
            _context20.next = 9;
            break;
          }

          return _context20.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'Insurance Id does not exist',
            field: 'insuranceId'
          }));

        case 9:
          return _context20.abrupt("return", next());

        case 12:
          _context20.prev = 12;
          _context20.t0 = _context20["catch"](0);
          console.error(_context20.t0);
          return _context20.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context20.t0.message
          }));

        case 16:
        case "end":
          return _context20.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyInsurancePolicyId = function verifyInsurancePolicyId(request, response, next) {
  var insurancePolicyId, insurancePolicy;
  return regeneratorRuntime.async(function verifyInsurancePolicyId$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.prev = 0;
          insurancePolicyId = request.params.insurancePolicyId;

          if (utils.isObjectId(insurancePolicyId)) {
            _context21.next = 4;
            break;
          }

          return _context21.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid insurance policy Id format',
            field: 'insurancePolicyId'
          }));

        case 4:
          _context21.next = 6;
          return regeneratorRuntime.awrap(InsurancePolicyModel.findById(insurancePolicyId));

        case 6:
          insurancePolicy = _context21.sent;

          if (insurancePolicy) {
            _context21.next = 9;
            break;
          }

          return _context21.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'Insurance policy Id does not exist',
            field: 'insurancePolicyId'
          }));

        case 9:
          return _context21.abrupt("return", next());

        case 12:
          _context21.prev = 12;
          _context21.t0 = _context21["catch"](0);
          console.error(_context21.t0);
          return _context21.abrupt("return", response.status(500).json({
            message: 'internal server error',
            error: _context21.t0.message
          }));

        case 16:
        case "end":
          return _context21.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyFolderId = function verifyFolderId(request, response, next) {
  var folderId, folder;
  return regeneratorRuntime.async(function verifyFolderId$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          _context22.prev = 0;
          folderId = request.params.folderId;

          if (utils.isObjectId(folderId)) {
            _context22.next = 4;
            break;
          }

          return _context22.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid folder Id format',
            field: 'folderId'
          }));

        case 4:
          _context22.next = 6;
          return regeneratorRuntime.awrap(FolderModel.findById(folderId));

        case 6:
          folder = _context22.sent;

          if (folder) {
            _context22.next = 9;
            break;
          }

          return _context22.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'Folder Id does not exist',
            field: 'folderId'
          }));

        case 9:
          return _context22.abrupt("return", next());

        case 12:
          _context22.prev = 12;
          _context22.t0 = _context22["catch"](0);
          console.error(_context22.t0);
          return _context22.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context22.t0.message
          }));

        case 16:
        case "end":
          return _context22.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var verifyFileId = function verifyFileId(request, response, next) {
  var fileId, file;
  return regeneratorRuntime.async(function verifyFileId$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          _context23.prev = 0;
          fileId = request.params.fileId;

          if (utils.isObjectId(fileId)) {
            _context23.next = 4;
            break;
          }

          return _context23.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid file Id format',
            field: 'fileId'
          }));

        case 4:
          _context23.next = 6;
          return regeneratorRuntime.awrap(FileModel.findById(fileId));

        case 6:
          file = _context23.sent;

          if (file) {
            _context23.next = 9;
            break;
          }

          return _context23.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'File Id does not exist',
            field: 'fileId'
          }));

        case 9:
          return _context23.abrupt("return", next());

        case 12:
          _context23.prev = 12;
          _context23.t0 = _context23["catch"](0);
          console.error(_context23.t0);
          return _context23.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context23.t0.message
          }));

        case 16:
        case "end":
          return _context23.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

module.exports = {
  verifyClinicId: verifyClinicId,
  verifyPatientId: verifyPatientId,
  verifyUserId: verifyUserId,
  verifyDoctorId: verifyDoctorId,
  verifyPrescriptionId: verifyPrescriptionId,
  verifyAppointmentId: verifyAppointmentId,
  verifyEncounterId: verifyEncounterId,
  verifyClinicPatientId: verifyClinicPatientId,
  verifyVisitReasonId: verifyVisitReasonId,
  verifySpecialityId: verifySpecialityId,
  verifyClinicOwnerId: verifyClinicOwnerId,
  verifyClinicDoctorId: verifyClinicDoctorId,
  verifyClinicPatientDoctorId: verifyClinicPatientDoctorId,
  verifyClinicRequestId: verifyClinicRequestId,
  verifyServiceId: verifyServiceId,
  verifyInvoiceId: verifyInvoiceId,
  verifyInvoiceServiceId: verifyInvoiceServiceId,
  verifyCardId: verifyCardId,
  verifySubscriptionId: verifySubscriptionId,
  verifyInsuranceId: verifyInsuranceId,
  verifyInsurancePolicyId: verifyInsurancePolicyId,
  verifyFolderId: verifyFolderId,
  verifyFileId: verifyFileId
};