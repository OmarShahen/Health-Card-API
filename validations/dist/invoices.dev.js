"use strict";

var utils = require('../utils/utils');

var config = require('../config/config');

var checkServices = function checkServices(services) {
  for (var i = 0; i < services.length; i++) {
    if (!utils.isObjectId(services[i])) {
      return false;
    }
  }

  return true;
};

var addInvoice = function addInvoice(invoiceData) {
  var clinicId = invoiceData.clinicId,
      patientId = invoiceData.patientId,
      creatorId = invoiceData.creatorId,
      services = invoiceData.services,
      paymentMethod = invoiceData.paymentMethod,
      invoiceDate = invoiceData.invoiceDate,
      paidAmount = invoiceData.paidAmount,
      dueDate = invoiceData.dueDate;
  if (!clinicId) return {
    isAccepted: false,
    message: 'Clinic Id is required',
    field: 'clinicId'
  };
  if (!utils.isObjectId(clinicId)) return {
    isAccepted: false,
    message: 'Clinic Id format is invalid',
    field: 'clinicId'
  };
  if (!patientId) return {
    isAccepted: false,
    message: 'Patient Id is required',
    field: 'patientId'
  };
  if (!utils.isObjectId(patientId)) return {
    isAccepted: false,
    message: 'Patient Id format is invalid',
    field: 'patientId'
  };
  if (!creatorId) return {
    isAccepted: false,
    message: 'Creator Id is required',
    field: 'creatorId'
  };
  if (!utils.isObjectId(creatorId)) return {
    isAccepted: false,
    message: 'Creator Id format is invalid',
    field: 'creatorId'
  };
  if (!services) return {
    isAccepted: false,
    message: 'Services is required',
    field: 'services'
  };
  if (!Array.isArray(services)) return {
    isAccepted: false,
    message: 'Services must be a list',
    field: 'services'
  };
  if (services.length == 0) return {
    isAccepted: false,
    message: 'Services must be atleast one',
    field: 'services'
  };
  if (!checkServices(services)) return {
    isAccepted: false,
    message: 'Invalid services format',
    field: 'services'
  };
  if (typeof paidAmount != 'number') return {
    isAccepted: false,
    message: 'Paid amount format is invalid',
    field: 'paidAmount'
  };
  if (!invoiceDate) return {
    isAccepted: false,
    message: 'Invoice date is required',
    field: 'invoiceDate'
  };
  if (!utils.isDateTimeValid(invoiceDate)) return {
    isAccepted: false,
    message: 'Invalid invoice date format',
    field: 'invoiceDate'
  };
  if (!paymentMethod) return {
    isAccepted: false,
    message: 'Payment method is required',
    field: 'paymentMethod'
  };
  if (!config.PAYMENT_METHOD.includes(paymentMethod)) return {
    isAccepted: false,
    message: 'Invalid payment method value',
    field: 'paymentMethod'
  };
  if (dueDate && !utils.isDateValid(dueDate)) return {
    isAccepted: false,
    message: 'Invalid due date format',
    field: 'dueDate'
  };
  if (dueDate && dueDate < invoiceDate) return {
    isAccepted: false,
    message: 'Due date must be after invoice date',
    field: 'dueDate'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: invoiceData
  };
};

var updateInvoiceStatus = function updateInvoiceStatus(invoiceData) {
  var status = invoiceData.status;
  if (!status) return {
    isAccepted: false,
    message: 'Status is required',
    field: 'status'
  };
  if (!config.INVOICE_STATUS.includes(status)) return {
    isAccepted: false,
    message: 'Invalid status value',
    field: 'status'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: invoiceData
  };
};

var updateInvoicePaid = function updateInvoicePaid(invoiceData) {
  var paid = invoiceData.paid;
  if (!paid) return {
    isAccepted: false,
    message: 'Paid is required',
    field: 'paid'
  };
  if (typeof paid != 'number') return {
    isAccepted: false,
    message: 'Invalid paid value',
    field: 'paid'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: invoiceData
  };
};

var updateInvoice = function updateInvoice(invoiceData) {
  var paymentMethod = invoiceData.paymentMethod,
      invoiceDate = invoiceData.invoiceDate,
      paidAmount = invoiceData.paidAmount;
  if (typeof paidAmount != 'number') return {
    isAccepted: false,
    message: 'Paid amount format is invalid',
    field: 'paidAmount'
  };
  if (!invoiceDate) return {
    isAccepted: false,
    message: 'Invoice date is required',
    field: 'invoiceDate'
  };
  if (!utils.isDateTimeValid(invoiceDate)) return {
    isAccepted: false,
    message: 'Invalid invoice date format',
    field: 'invoiceDate'
  };
  if (!paymentMethod) return {
    isAccepted: false,
    message: 'Payment method is required',
    field: 'paymentMethod'
  };
  if (!config.PAYMENT_METHOD.includes(paymentMethod)) return {
    isAccepted: false,
    message: 'Invalid payment method value',
    field: 'paymentMethod'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: invoiceData
  };
};

module.exports = {
  addInvoice: addInvoice,
  updateInvoiceStatus: updateInvoiceStatus,
  updateInvoicePaid: updateInvoicePaid,
  updateInvoice: updateInvoice
};