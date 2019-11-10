"use strict";

const MILLISECONDS_PER_SECOND = 1000;
const DIV_TEXT = document.getElementById(`div-text`);
const TEXTAREA = document.getElementById(`textarea`)

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

let toggleIndicatorInterval = setInterval(toggleIndicator, MILLISECONDS_PER_SECOND / 3);

function toggleIndicator() {
  const SPAN_CHARACTER = document.getElementById(`span-character-${TEXTAREA.value.length + 1}`);
  SPAN_CHARACTER.classList.toggle(`indicator`);
}

TEXTAREA.addEventListener(`change`, (event) => {
  for (let i = 0; i < TEXTAREA.value.length; i++) {
    const SPAN_CHARACTER = document.getElementById(`span-character-${i + 1}`);
    SPAN_CHARACTER.classList.remove(`indicator`);
    if (TEXTAREA.value.charAt(i) === SPAN_CHARACTER.textContent) {
      SPAN_CHARACTER.classList.add(`correct`);
    } else {
      SPAN_CHARACTER.classList.add(`incorrect`);
    }
  }
});
