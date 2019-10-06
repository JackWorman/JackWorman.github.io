'use strict';

alert(loadFile('https://jackworman.com/Test/scripts/words.txt'));

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
