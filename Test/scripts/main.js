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

let counts = [];

for (const word of words) {
  for (let i = 0; i < word.length; i++) {
    alert(word.substr(i, i));
    if (typeof counts[word.substr(i, i)] === 'undefined') {
      counts[word.substr(i, i)] = 1;
    } else {
      counts[word.substr(i, i)]++;
    }
  }
}
