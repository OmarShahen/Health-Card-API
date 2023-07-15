"use strict";

var capitalizeFirstLetter = function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

var concatenateHmacString = function concatenateHmacString(hmacPayment) {
  var amount_cents = hmacPayment.amount_cents,
      created_at = hmacPayment.created_at,
      currency = hmacPayment.currency,
      error_occured = hmacPayment.error_occured,
      has_parent_transaction = hmacPayment.has_parent_transaction,
      id = hmacPayment.id,
      integration_id = hmacPayment.integration_id,
      is_3d_secure = hmacPayment.is_3d_secure,
      is_auth = hmacPayment.is_auth,
      is_capture = hmacPayment.is_capture,
      is_refunded = hmacPayment.is_refunded,
      is_standalone_payment = hmacPayment.is_standalone_payment,
      is_voided = hmacPayment.is_voided,
      owner = hmacPayment.owner,
      pending = hmacPayment.pending,
      success = hmacPayment.success;
  var orderId = hmacPayment.order.id;
  var sourceDataPan = hmacPayment.source_data.pan;
  var sourceDataSubType = hmacPayment.source_data.sub_type;
  var sourceDataType = hmacPayment.source_data.type;
  return "".concat(amount_cents).concat(created_at).concat(currency).concat(error_occured).concat(has_parent_transaction).concat(id).concat(integration_id).concat(is_3d_secure).concat(is_auth).concat(is_capture).concat(is_refunded).concat(is_standalone_payment).concat(is_voided).concat(orderId).concat(owner).concat(pending).concat(sourceDataPan).concat(sourceDataSubType).concat(sourceDataType).concat(success);
};

module.exports = {
  capitalizeFirstLetter: capitalizeFirstLetter,
  concatenateHmacString: concatenateHmacString
};