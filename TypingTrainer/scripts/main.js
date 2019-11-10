"use strict";

const MILLISECONDS_PER_SECOND = 1000;

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

const DIV_TEXT = document.getElementById(`div-text`);
const words = loadFile(`https://jackworman.com/TypingTrainer/words.txt`).split(/\n/);
let text = words[Math.floor(Math.random() * words.length)];
for (let i = 0; i < 24; i++) {
  text += ` ${words[Math.floor(Math.random() * words.length)]}`;
}
let count = 1;
for (const character of text) {
  const span = document.createElement(`span`);
  span.setAttribute(`id`, `span-character-${count++}`);
  span.textContent = character;
  DIV_TEXT.appendChild(span);
}

let toggleIndicatorInterval = setInterval(toggleIndicator, MILLISECONDS_PER_SECOND / 2);

function toggleIndicator() {
  document.getElementById(`span-character-${document.getElementById(`textarea`).value.length + 1}`).classList.toggle(`indicator`);
}
