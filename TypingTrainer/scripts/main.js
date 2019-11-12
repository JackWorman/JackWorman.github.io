"use strict";

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const DIV_TEXT = document.getElementById(`div-text`);
// const TEXTAREA = document.getElementById(`textarea`);
const SPAN_WPM = document.getElementById(`span-wpm`);

let toggleIndicatorInterval;
let updateWPMInterval;
let startTime;
let startTyping = false;
let userInput = ``;
let textSetUp = false;
let shiftPressed = false;

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
    let text = words[Math.floor(Math.random() * words.length)];
    for (let i = 1; i <= 5; i++) {
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
  const SPAN_CHARACTER = document.getElementById(`span-character-${userInput.length + 1}`);
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
  textSetUp = false
  userInput = ``;
  startTyping = false;
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
  if (event.keyCode === 8) {
    event.preventDefault(); // Stops the browser from going to the previous page.
    if (userInput.length !== 0) {
      userInput = userInput.substring(0, userInput.length - 1);
      document.getElementById(`span-character-${userInput.length + 1}`).remove(`indicator`, `correct`, `incorrect`);
    }
  } else {
    userInput += event.key;
    if (event.key === document.getElementById(`span-character-${userInput.length}`).textContent) {
      document.getElementById(`span-character-${userInput.length}`).classList.add(`correct`);
    } else {
      document.getElementById(`span-character-${userInput.length}`).classList.add(`incorrect`);
    }
  }
  // // Clears all classes from each span_character.
  // const SPAN_CHARACTERS = DIV_TEXT.getElementsByTagName(`span`);
  // for (const SPAN_CHARACTER of SPAN_CHARACTERS) {
  //   SPAN_CHARACTER.classList.remove(`indicator`, `correct`, `incorrect`);
  // }
  // Checks if each letter is correct or incorrect.
  // for (let i = 0; i < userInput.length; i++) {
  //   const SPAN_CHARACTER = document.getElementById(`span-character-${i + 1}`);
  //   if (userInput.charAt(i) === SPAN_CHARACTER.textContent) {
  //     SPAN_CHARACTER.classList.add(`correct`);
  //   } else {
  //     SPAN_CHARACTER.classList.add(`incorrect`);
  //   }
  // }
  // Check if done.
  const SPAN_CHARACTERS = DIV_TEXT.getElementsByTagName(`span`);
  if (userInput.length === SPAN_CHARACTERS.length) {
    alert(`WPM: ${updateWPM()}`);
    reset();
  }
});
