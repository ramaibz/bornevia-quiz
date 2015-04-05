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
