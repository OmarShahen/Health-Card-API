"use strict";

var getTreatmentExpirationDate = function getTreatmentExpirationDate(drugs) {
  var largestNumberOfDays = 0;

  for (var i = 0; i < drugs.length; i++) {
    var drug = drugs[i];
    var durationNumber = drug.duration.number;
    var durationTimeUnit = drug.duration.timeUnit.toLowerCase();

    if (durationTimeUnit == 'month') {
      durationNumber = durationNumber * 30;
    } else if (durationTimeUnit == 'week') {
      durationNumber = durationNumber * 7;
    }

    if (largestNumberOfDays < durationNumber) {
      largestNumberOfDays = durationNumber;
    }
  }

  var treatmentExpirationDate = new Date();
  treatmentExpirationDate.setDate(treatmentExpirationDate.getDate() + largestNumberOfDays);
  return treatmentExpirationDate;
};

module.exports = {
  getTreatmentExpirationDate: getTreatmentExpirationDate
};