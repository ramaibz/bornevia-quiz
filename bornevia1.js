/**
 * RULES AND ASSUMPTIONS
 * [?] Your program must be fast, efficient, and able to handle extremely large input files
 */

// http://chunk.io/f/f45bae50e6a54e61aeb632a280bcdcfb

(function(){
  'use strict';

  var saveTo = require('./src/saveTo.js');
  var sanitize = require('./src/sanitize.js');
  var d = document;

  function parseCSV(file, callback) {
    Papa.parse(file, {
      download: true,
      //header: true,
      chunk: function(row) {
        if(row.errors) {
          return callback(row.errors, row.data);
        }
        callback(null, row.data);
      }
    })
  }

  function csvLib(files, cb) {
    var raw = {};
    var rawheader, compare, headerlength, comparelen;
    var errorlog = [];
    var finished = [];
    var exist = {};
    var temp = [];
    var merged = [];

    parseCSV(files, function(err, data) {
      errorlog = [];
      raw = data;
      raw.pop();
      headerlength = raw[0].length;

      // merges duplicate
      for(var i=1, len=raw.length-1; i < len; i++) {
        compare = raw[i][0];
        comparelen = raw[i].length;

        // Reject the input file by throwing an error if there are missing columns in any of the rows
        if(comparelen < headerlength) {
          errorlog.push({ row: i+1, msg: 'Content is less than header' });
        }

        // Reject the input file by throwing an error if there are extra columns in any of the rows
        if(comparelen > headerlength) {
          errorlog.push({ row: i+1, msg: 'Content is more than header' })
        }

        if(!exist[compare] && comparelen === headerlength) {
          temp = [];
          for(var v=raw.length-1; v > 0; v--) {
            if(compare === raw[v][0] && raw[v].length === headerlength) {
              for(var y=0; y < headerlength; y++) {
                // Values may contain leading and/or trailing white spaces which consist of spaces, tabs, or mixed of both. Don't forget to trim them in your output.
                var eachrow = sanitize.trim(raw[v][y]);
                if(eachrow !== '') {
                  temp[y] = eachrow;
                }
                if(sanitize.email.ifEmail(eachrow) && eachrow !== '') {
                  // Email may contain mixed of lowercase and uppercase letters, convert all email to lower case in the output
                  var emailisclear = sanitize.email.toLower(eachrow);
                  temp[y] = emailisclear;

                  // Reject the input file by throwing an error if the email is not in a valid format in any of the rows
                  !sanitize.email.isValid(emailisclear) ? errorlog.push({ row: v+1, msg: 'Invalid email format' }) : '';
                }
              }
            }
          }

          // finalizing data
          if(temp.length < headerlength) {
            temp.push('');
          }

          for(var o=0, lena=temp.length; o < lena; o++) {
            temp[o] === undefined ? temp[o] = '' : '';
          }

          finished.push(temp);
          exist[compare] = true;
        }
      }
        // Your output must be sorted by the customers' name alphabetically
        finished.sort();

        // Preserve the header row
        finished.unshift(raw[0]);
        finished = Papa.unparse(finished);

        return cb(errorlog, finished);
    });
  }

  function operate(event) {
    var errorDiv = d.getElementById('error');
    var saveDiv = d.getElementById('download1');

    csvLib(event.target.files[0], function(err, data) {
      if(err.length > 0) {
        errorDiv.innerHTML = '';
        var newDiv;
        for(var i=0, lenx = err.length; i < lenx; i++) {
          newDiv = d.createElement('div');
          var log = d.createTextNode('Row ' + err[i].row + ': ' + err[i].msg);
          newDiv.appendChild(log);
          errorDiv.appendChild(newDiv);
        }
      }
      else {
        errorDiv.innerHTML = '';
        //- Your program must begin with reading a file and end with writing to the resulting output file
        saveTo(data, saveDiv, 'csv', 'customers_merged');
      }
    })

  }

  d.getElementById('csvlib').addEventListener('change', operate, false);

})();

/**
 * First attempt
 */
// function csvSelection(event) {

//finished.unshift(raw[0]);
// for(var p=0; p < finished.length; p++) {
//   if(finished[p].length < headerlength) {
//     finished[p].push("");
//   }
//   for(var o=0, len=finished[p].length; o < len; o++) {
//     if(finished[p][o] === undefined) {
//       finished[p][o] = "";
//     }
//   }
// }
//
// var merged = _.chain(raw)
//   .tap(function(arr) {
//     arr.pop();
//   })
//   .sortBy('Name')
//   .groupBy('Name')
//   .value();


// var res = [];
// var temp = [];
// var resx = {};
// var header;

// // _.forEach(merged, function(n, key, arr) {
// //   var x = n.length;
// //   _.forEach(n, function(r, keys) {
// //     res.push(r);
// //   })
// // })

// Object.getOwnPropertyNames(merged)
//   .forEach(function(val, idxs) {
//     var x = merged[val].length;
//     header = Object.getOwnPropertyNames(merged[val][0]);

//     for(var i = 0 ; i < x; i++) {
//       Object.getOwnPropertyNames(merged[val][i])
//         .forEach(function(v, idx) {
//           var eachval = merged[val][i][v];

//           if(eachval !== '') {
//             temp[idx] = eachval;
//           }

//         })
//     }

//     resx[val] = temp;
//     res.push(temp);
//     temp = [];
// })

// for(var p=0; p < res.length; p++) {
//   if(res[p].length < header.length) {
//     res[p].push("");
//   }
//   for(var o=0, len=res[p].length; o < len; o++) {
//     if(res[p][o] === undefined) {
//       res[p][o] = "";
//     }
//   }
// }
