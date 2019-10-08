'use strict';

function loadFile(filePath) {
  let result = null;
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', filePath, false);
  xmlhttp.send();
  if (xmlhttp.status === 200) {
    result = xmlhttp.responseText;
  }
  return result;
}

function downloadFile(strData, strFileName, strMimeType) {
  var D = document,
      A = arguments,
      a = D.createElement("a"),
      d = A[0],
      n = A[1],
      t = A[2] || "text/plain";

  //build download link:
  a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);

  if (window.MSBlobBuilder) { // IE10
      var bb = new MSBlobBuilder();
      bb.append(strData);
      return navigator.msSaveBlob(bb, strFileName);
  } /* end if(window.MSBlobBuilder) */

  if ('download' in a) { //FF20, CH19
      a.setAttribute("download", n);
      a.innerHTML = "downloading...";
      D.body.appendChild(a);
      setTimeout(function() {
          var e = D.createEvent("MouseEvents");
          e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          a.dispatchEvent(e);
          D.body.removeChild(a);
      }, 66);
      return true;
  }; /* end if('download' in a) */

  //do iframe dataURL download: (older W3)
  var f = D.createElement("iframe");
  D.body.appendChild(f);
  f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
  setTimeout(function() {
      D.body.removeChild(f);
  }, 333);
  return true;
}

//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------

// const words = loadFile('https://jackworman.com/Test/scripts/words.txt').split(/\s+/);
// const countsHashMap = {};
// for (const word of words) {
//   for (let start = 0; start < word.length; start++) {
//     for (let length = 1; length <= word.length - start; length++) {
//       const subString = word.substr(start, length);
//       if (typeof countsHashMap[subString] === 'undefined') {
//         countsHashMap[subString] = 1;
//       } else {
//         countsHashMap[subString]++;
//       }
//     }
//   }
// }
//
// const counts = [];
// for (const countsHashMapKey in countsHashMap) {
//   counts.push({letterCombination: countsHashMapKey, count: countsHashMap[countsHashMapKey]});
// }
// counts.sort((a, b) => {
//   if (b.count - a.count !== 0) {
//     return b.count - a.count;
//   }
//   return a.letterCombination.localeCompare(b.letterCombination);
// });
//
// let downLoadString = '';
// for (let i = 0; i < counts.length; i++) {
//   downLoadString += counts[i].letterCombination + ' ' + counts[i].count + '\n';
// }
// downloadFile(downLoadString, 'counts.txt', 'text/plain');

const words = loadFile('https://jackworman.com/Test/scripts/words.txt').split(/\s+/);
const countsHashMap2 = {};
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
for (const letter of alphabet) {
  countsHashMap2[letter] = {};
  for (const word of words) {
    for (let i = 0; i < word.length; i++) {
      if (word.charAt(i) === letter) {
        let nextLetter = word.charAt(i + 1);
        if (nextLetter === '') {
          nextLetter = 'space';
        }
        if (typeof countsHashMap2[letter][nextLetter] === 'undefined') {
          countsHashMap2[letter][nextLetter] = 1;
        } else {
          countsHashMap2[letter][nextLetter]++;
        }
      }
    }
  }
}

let downLoadString = '';
for (const letter in countsHashMap2) {
  for (const nextLetter in countsHashMap2[letter]) {
    downLoadString += letter + ' ' + letter2 + ' ' + countsHashMap2[letter][nextLetter] + '\n';
  }
}
downloadFile(downLoadString, 'NextLetterCounts.txt', 'text/plain');

console.log(countsHashMap2);
