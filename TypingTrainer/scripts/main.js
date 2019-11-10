"use strict";

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const DIV_TEXT = document.getElementById(`div-text`);
const TEXTAREA = document.getElementById(`textarea`);
const SPAN_WPM = document.getElementById(`span-wpm`);

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

function setUpText() {
  const words = loadFile(`https://jackworman.com/TypingTrainer/words.txt`).split(/\n/);
  let text = words[Math.floor(Math.random() * words.length)];
  for (let i = 0; i < 14; i++) {
    text += ` ${words[Math.floor(Math.random() * words.length)]}`;
  }
  let count = 1;
  for (const character of text) {
    const span = document.createElement(`span`);
    span.setAttribute(`id`, `span-character-${count++}`);
    span.textContent = character;
    DIV_TEXT.appendChild(span);
  }
}
setUpText();

let toggleIndicatorInterval = setInterval(toggleIndicator, MILLISECONDS_PER_SECOND / 3);
function toggleIndicator() {
  const SPAN_CHARACTER = document.getElementById(`span-character-${TEXTAREA.value.length + 1}`);
  SPAN_CHARACTER.classList.toggle(`indicator`);
}

let updateWPMInterval;
let startTime;
function updateWPM() {
  const words = TEXTAREA.value.length / 5;
  const minutes = (performance.now() - startTime) / MILLISECONDS_PER_SECOND / SECONDS_PER_MINUTE;
  const wpm = words / minutes;
  SPAN_WPM.textContent = `WPM: ${Math.round(wpm)}`;
}

let startTyping = false;
TEXTAREA.addEventListener(`input`, (event) => {
  if (!startTyping) {
    startTyping = true;
    startTime = performance.now();
    updateWPMInterval = setInterval(updateWPM, MILLISECONDS_PER_SECOND / 10);
  }
  const SPAN_CHARACTERS = DIV_TEXT.getElementsByTagName(`span`);
  for (const SPAN_CHARACTER of SPAN_CHARACTERS) {
    SPAN_CHARACTER.classList.remove(`indicator`, `correct`, `incorrect`);
  }
  for (let i = 0; i < TEXTAREA.value.length; i++) {
    const SPAN_CHARACTER = document.getElementById(`span-character-${i + 1}`);
    if (TEXTAREA.value.charAt(i) === SPAN_CHARACTER.textContent) {
      SPAN_CHARACTER.classList.add(`correct`);
    } else {
      SPAN_CHARACTER.classList.add(`incorrect`);
    }
  }
  // Check if done.
  if (TEXTAREA.value.length === SPAN_CHARACTERS.length) {
    clearInterval(updateWPMInterval);
    clearInterval(toggleIndicatorInterval);
    alert(`Done.`);
    TEXTAREA.value = ``;
  }
});
