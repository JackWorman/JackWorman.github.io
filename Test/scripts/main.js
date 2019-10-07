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

function download(strData, strFileName, strMimeType) {
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

const words = loadFile('https://jackworman.com/Test/scripts/words.txt').split(/\s+/);
const counts = [];
for (const word of words) {
  for (let i = 0; i < word.length; i++) {
    for (let j = 1; j <= word.length - i; j++) {
      const subString = word.substr(i, j);
      if (typeof counts[subString] === 'undefined') {
        counts[subString] = 1;
      } else {
        counts[subString]++;
      }
    }
  }
}

const counts2 = [];
for (const key in counts) {
  counts2.push({letterCombination: key, count: counts[key]});
}
counts2.sort((a, b) => a.count - b.count);

let downLoadString = '';
for (const count2 of counts2) {
  downLoadString += count2.letterCombination + ' - ' + count2.count + '\n';
}

download(downLoadString, 'counts.txt', 'text/plain')
