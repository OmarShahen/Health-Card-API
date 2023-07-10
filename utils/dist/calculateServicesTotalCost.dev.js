"use strict";

var calculateServicesTotalCost = function calculateServicesTotalCost(services, servicesIds) {
  var totalAmount = 0;

  for (var i = 0; i < servicesIds.length; i++) {
    var serviceId = servicesIds[i];

    for (var j = 0; j < services.length; j++) {
      var service = services[j];

      if (service._id.equals(serviceId)) {
        totalAmount += service.cost;
        break;
      }
    }
  }

  return totalAmount;
};

module.exports = {
  calculateServicesTotalCost: calculateServicesTotalCost
};