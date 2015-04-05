module.exports = function(file, element, type, fileName) {
  var data = type === 'csv'
    ? 'data:application/csv;charset=utf-8,' + encodeURIComponent(file)
    : ( file = new Blob([file], { type: 'text/plain' }), window.URL.createObjectURL(file) );

  var a = document.createElement('a');
  a.innerHTML = "download";
  a.href = data;
  a.target = '_blank';
  a.download = fileName + '.' + type;

  element.appendChild(a);
}
