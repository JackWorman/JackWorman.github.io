'use strict';

function loadFile(filePath) {
  let result = null;
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status === 200) {
    result = xmlhttp.responseText;
  }
  return result;
}

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

console.log(counts.sort());
