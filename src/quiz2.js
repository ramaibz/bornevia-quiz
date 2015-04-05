addEventListener('message', function(n) {
  var jumlahdigit = parseInt(n.data);
  var f = [];

  var chunk = [];
  var finished = [];
  var resultnumber = 0;
  var resultstring = '';
  var powerof;

  function tostr(num) {
    if(num < 10) { return '0' + num }
    else { return '' + num }
  }

  function startend(len, cb) {
    if(len === 2) {
      return cb(0, 99);
    }
    else {
      var start = '1', end = '9', v;
      for(v=1; v < len; v++) {
        start += '0';
        end += '9';
      }
      return cb(parseInt(start), parseInt(end));
    }
  }

  function chunked(num, total) {
    for(var rep = 0, charlen = num.length; rep < charlen; rep += total) {
      chunk.push(num.substring(rep, rep + total));
    }
  }

  // Proses angka ajaib
  function processing(jmldigit, cb) {
    var respower;
    var chunklen = (jmldigit/2);
    var portion = 2;

    startend(jmldigit, function(start, end) {
      postMessage({ isLoading: true });
      for(var i = start; i <= end; i++) {
        jmldigit === 2 && jmldigit > 1
          ? i = tostr(i) // Angka 0 di depan harus diperhitungkan, contoh 01 dan 00 adalah jawaban yang valid.
          : i = i.toString();

        chunked(i, chunklen);
        if(chunk.length === portion) {
          for(var k=0; k < chunk.length; k++) {
            resultnumber += +chunk[k];
            resultstring += chunk[k];
          }
          powerof = Math.pow(resultnumber, 2);
          if(tostr(powerof) === resultstring) {
            f.push(resultstring);
            postMessage({ angka: f.join(', ') });
          }
          resultnumber = 0;
          resultstring = '';
          chunk = [];
        }
      }
      return cb(f);
    })
  }

  processing(jumlahdigit, function(res) {
    if(res) {
      // Selalu ada kata "dan" sebelum jawaban yang terakhir.
      // Tidak perlu kata "dan" apabila jawabannya hanya satu.
      var lastidx = res.length-1;
      if(res.length > 1) {
        res[lastidx] = 'dan ' + res[lastidx];
      }
      // Setiap jawaban dipisahkan oleh sebuah koma dan spasi.
      postMessage({ isLoading: false, angka: res.join(', ') });
    }
  });
}, false);
