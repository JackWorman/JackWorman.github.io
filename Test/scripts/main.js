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

for (const word in words) {
  alert(word);
}
