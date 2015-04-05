module.exports = function (file, callback) {
  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function(evt) {
    return callback(null, evt.target.result);
  }
  reader.onerror = function() {
    return callback('Unable to read ' + file.fileName);
  }
}
