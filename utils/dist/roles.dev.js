"use strict";

var isRolesValid = function isRolesValid(userRolesList, authorizedRolesList) {
  for (var i = 0; i < authorizedRolesList.length; i++) {
    var role = authorizedRolesList[i];

    for (var j = 0; j < userRolesList.length; j++) {
      var userRole = userRolesList[j];

      if (userRole === role) {
        return true;
      }
    }
  }

  return false;
};

module.exports = {
  isRolesValid: isRolesValid
};