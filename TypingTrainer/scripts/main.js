"use strict";

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const DIV_TEXT = document.getElementById(`div-text-container`);
const SPAN_WPM = document.getElementById(`span-wpm`);

let toggleIndicatorInterval;
let updateWPMInterval;
let startTime;
let startTyping = false;
let text = ``;
let userInput = ``;
let textSetUp = false;
let shiftPressed = false;

let indicatorLocation = 1;

function loadFile(filePath) {
  return new Promise((resolve, reject) => {
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open(`GET`, filePath);
    xmlHttpRequest.onload = () => {
      if (xmlHttpRequest.status == 200) {
        resolve(xmlHttpRequest.response);
      } else {
        reject(Error(xmlHttpRequest.statusText));
      }
    };
    xmlHttpRequest.onerror = () => {
      reject(Error("Network Error"));
    };
    xmlHttpRequest.send();
  });
}

function setUpText() {
  loadFile(`https://jackworman.com/TypingTrainer/words.txt`).then((response) => {
    const words = response.split(/\n/);
    text = words[Math.floor(Math.random() * words.length)];
    for (let i = 1; i < 5; i++) {
      text += ` ${words[Math.floor(Math.random() * words.length)]}`;
    }
    let count = 1;
    for (const character of text) {
      const span = document.createElement(`span`);
      span.setAttribute(`id`, `span-character-${count++}`);
      span.textContent = character;
      DIV_TEXT.appendChild(span);
    }
    toggleIndicatorInterval = setInterval(toggleIndicator, MILLISECONDS_PER_SECOND / 3);
    textSetUp = true;
  }, function(error) {
    console.error("Failed!", error);
  });
}

function toggleIndicator() {
  const SPAN_CHARACTER = document.getElementById(`span-character-${indicatorLocation}`);
  SPAN_CHARACTER.classList.toggle(`indicator`);
}

function updateWPM() {
  const words = userInput.length === 0 ? 0 : (userInput.length - 1) / 5;
  const minutes = (performance.now() - startTime) / MILLISECONDS_PER_SECOND / SECONDS_PER_MINUTE;
  const wpm = words / minutes;
  SPAN_WPM.textContent = `WPM: ${Math.round(wpm)}`;
  return wpm;
}

function reset() {
  clearInterval(updateWPMInterval);
  clearInterval(toggleIndicatorInterval);
  DIV_TEXT.innerHTML = ``;
  textSetUp = false;
  userInput = ``;
  startTyping = false;
  indicatorLocation = 1;
  setUpText();
}

reset();

document.addEventListener(`keydown`, (event) => {
  // Checks for an invalid key.
  if (!textSetUp || !(event.keyCode >= 65 && event.keyCode <= 90) && event.keyCode !== 8 && event.keyCode !== 32) {
    return;
  }
  // First time check
  if (!startTyping) {
    startTyping = true;
    startTime = performance.now();
    updateWPMInterval = setInterval(updateWPM, MILLISECONDS_PER_SECOND / 10);
  }
  const SPAN_CHARACTER = document.getElementById(`span-character-${indicatorLocation}`);
  if (event.keyCode === 8) {
    event.preventDefault(); // Stops the browser from going to the previous page.
    if (userInput.length !== 0) {
      userInput = userInput.substring(0, userInput.length - 1);
      if (SPAN_CHARACTER.previousSibling.classList.contains(`incorrect`)) {
        DIV_TEXT.removeChild(SPAN_CHARACTER.previousSibling);
      } else {
        indicatorLocation--;
        document.getElementById(`span-character-${indicatorLocation}`).classList.remove(`correct`, `incorrect`);
        document.getElementById(`span-character-${indicatorLocation + 1}`).classList.remove(`indicator`);
      }
    }
  } else {
    userInput += event.key;
    // SPAN_CHARACTER.classList.remove(`indicator`);
    if (event.key === SPAN_CHARACTER.textContent) {
      SPAN_CHARACTER.classList.remove(`indicator`);
      SPAN_CHARACTER.classList.add(`correct`);
      indicatorLocation++;
    } else {
      const span = document.createElement(`span`);
      // span.setAttribute(`id`, `span-character-bad`);
      span.textContent = event.key;
      span.classList.add(`incorrect`);
      SPAN_CHARACTER.insertAdjacentElement(`beforebegin`, span);
    }
  }
  // Check if done.
  if (userInput === text) {
    alert(`WPM: ${updateWPM()}`);
    reset();
  }
});
