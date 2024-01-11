function isValidURL(url) {
  const pattern = /^(ftp|http|https):\/\/[^ "]+$/;

  return pattern.test(url);
}

  module.exports = { isValidURL }