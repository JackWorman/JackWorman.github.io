"use strict";

function loadFile(filePath) {
  const xmlHttpRequest = new XMLHttpRequest();
  xmlHttpRequest.open(`GET`, filePath, false);
  xmlHttpRequest.send();
  if (xmlHttpRequest.status === 200) {
    return xmlHttpRequest.responseText;
  } else {
    // Error
  }
}

const lines = loadFile(`https://jackworman.com/TypingTrainer/NextLetterCounts.txt`).split(/\n/);
const letterCounts = {};

for (const line of lines) {
  const letter = line.charAt(0);
  const words = line.split(/\s/);
  if (typeof letterCounts[letter] === `undefined`) {
    letterCounts[letter] = Number(words[2]);
  } else {
    letterCounts[letter] += Number(words[2]);
  }
}
console.log(letterCounts);
