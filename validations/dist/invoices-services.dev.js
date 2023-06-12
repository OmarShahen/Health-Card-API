"use strict";

var utils = require('../utils/utils');

var addInvoiceService = function addInvoiceService(invoiceServiceData) {
  var invoiceId = invoiceServiceData.invoiceId,
      serviceId = invoiceServiceData.serviceId;
  if (!invoiceId) return {
    isAccepted: false,
    message: 'Invoice Id is required',
    field: 'invoiceId'
  };
  if (!utils.isObjectId(invoiceId)) return {
    isAccepted: false,
    message: 'Invoice Id format is invalid',
    field: 'invoiceId'
  };
  if (!serviceId) return {
    isAccepted: false,
    message: 'Service Id is required',
    field: 'serviceId'
  };
  if (!utils.isObjectId(serviceId)) return {
    isAccepted: false,
    message: 'Service Id format is invalid',
    field: 'serviceId'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: invoiceServiceData
  };
};

module.exports = {
  addInvoiceService: addInvoiceService
};