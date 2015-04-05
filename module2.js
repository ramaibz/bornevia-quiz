(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * RULES AND ASSUMPTIONS
 * [?] Gunakan algoritma yang paling efisien yang kamu ketahui.
 * [?] Kompleksitas O(n^2) tidak termasuk jawaban yang memuaskan.
 */

// http://chunk.io/f/6476bb2744504d15809ed4aa64364420
'use strict';
var d = document;

var getFile = require('./src/getFile.js');
var sanitize = require('./src/sanitize.js');
var saveTo = require('./src/saveTo.js');

function getAngka(event) {
  // Program yang dibuat harus membaca sebuah file yang berisikan sebuah nomor yang akan dipakai sebagai N.
  getFile(event.target.files[0], function(err, jumlahdigit) {

    // Apabila file mengandung huruf maka tolak dan print error.
    if(sanitize.isNumber(jumlahdigit)) {
      alert('is not a valid number');
    }

    // Angka Ajaib harus memiliki jumlah digit yang genap, contoh 2, 4, 6, 8, dan seterusnya.
    else if(jumlahdigit % 2 !== 0) {
      alert('Number must be even');
    }

    // Apabila file input terdiri dari lebih dari satu baris, maka tolak dan print error.
    else if(sanitize.checkN(jumlahdigit, 2)) {
      alert('New line is more than one');
    }
    else {
      var webWorker = new Worker('src/quiz2.js');
      var saveElem = d.querySelector('#download2');

      webWorker.postMessage(jumlahdigit);
      webWorker.onmessage = function(n) {
        if(n.data.isLoading === true) {
          d.querySelector('.progressbar').style.display = 'block';
        }
        var angkaAjaib = d.getElementById('res');
        angkaAjaib.innerHTML = n.data.angka || '';

        if(n.data.isLoading === false) {
          d.querySelector('.progressbar').style.display = 'none';

          // Program harus print output ke file lain.
          saveTo(n.data.angka, saveElem, 'txt', 'output');
        }
      }
    }
  })
}

d.getElementById('getangka').addEventListener('change', getAngka, false);

},{"./src/getFile.js":2,"./src/sanitize.js":3,"./src/saveTo.js":4}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
module.exports = {
    trim: function(data) {
      //return data.replace(/\s/g, "");
      return data.trim();
    },
    isNumber: function(data) {
      return isNaN(data);
    },
    checkN: function(data, amount) {
      return data.split(/\r\n|\r|\n/).length > amount;
    },
    email: {
      ifEmail: function(data) {
        var re = /@/;
        return re.test(data);
      },
      toLower: function(data) {
        if(data) {
          return data.toLowerCase();
        }
      },
      isValid: function(data) {
        var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return re.test(data);
      }
    }
  }

},{}],4:[function(require,module,exports){
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

},{}]},{},[1]);
