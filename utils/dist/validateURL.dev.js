"use strict";

function isValidURL(url) {
  var pattern = /^(ftp|http|https):\/\/[^ "]+$/;
  return pattern.test(url);
}

module.exports = {
  isValidURL: isValidURL
};