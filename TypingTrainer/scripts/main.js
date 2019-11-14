"use strict";

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const DIV_TEXT = document.getElementById(`div-text-container`);
const SPAN_WPM = document.getElementById(`span-wpm`);
const SPAN_AVERAGE_WPM = document.getElementById(`span-average-wpm`);

localStorage.characters = 0;
localStorage.time = 0;

let toggleIndicatorInterval;
let updateWPMInterval;
let startTime;
let startTyping = false;
let text = ``;
let userInput = ``;
let textSetUp = false;
let shiftPressed = false;

let indicatorLocation = 0;

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
    while (text.length <= Math.max(50, (Number(localStorage.characters) / 5) / (Number(localStorage.time) / 1000 / 60) / 2)) { // 
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
  const spanIndicatedCharacter = DIV_TEXT.childNodes[indicatorLocation];
  if (typeof spanIndicatedCharacter !== `undefined`) {
    spanIndicatedCharacter.classList.toggle(`indicator`);
  }
}

function updateWPM() {
  const words = userInput.length === 0 ? 0 : (userInput.length - 1) / 5;
  const minutes = (performance.now() - startTime) / MILLISECONDS_PER_SECOND / SECONDS_PER_MINUTE;
  const wpm = Math.round(words / minutes);
  SPAN_WPM.textContent = `WPM: ${wpm}`;
  return wpm;
}

function reset() {
  clearInterval(updateWPMInterval);
  clearInterval(toggleIndicatorInterval);
  DIV_TEXT.innerHTML = ``;
  textSetUp = false;
  userInput = ``;
  startTyping = false;
  indicatorLocation = 0;
  setUpText();
}

reset();

document.addEventListener(`keydown`, (event) => {
  // Checks for an invalid key.
  if (!textSetUp || !(event.keyCode >= 65 && event.keyCode <= 90) && event.keyCode !== 8 && event.keyCode !== 32) {
    return;
  }
  event.preventDefault(); // Stops the browser from going to the previous page.
  // First time check
  if (!startTyping) {
    startTyping = true;
    startTime = performance.now();
    updateWPMInterval = setInterval(updateWPM, MILLISECONDS_PER_SECOND / 10);
  }
  const spanIndicatedCharacter = DIV_TEXT.childNodes[indicatorLocation];
  if (event.keyCode === 8) {
    if (userInput.length !== 0) {
      userInput = userInput.substring(0, userInput.length - 1);
      indicatorLocation--;
      if (typeof spanIndicatedCharacter === `undefined`) {
        if (DIV_TEXT.lastChild.classList.contains(`incorrect`)) {
          DIV_TEXT.removeChild(DIV_TEXT.lastChild);
        } else {
          DIV_TEXT.childNodes[indicatorLocation].classList.remove(`correct`);
        }
      } else if (spanIndicatedCharacter.previousSibling.classList.contains(`incorrect`)) {
        DIV_TEXT.removeChild(spanIndicatedCharacter.previousSibling);
      } else {
        DIV_TEXT.childNodes[indicatorLocation].classList.remove(`correct`);
        DIV_TEXT.childNodes[indicatorLocation + 1].classList.remove(`indicator`);
      }
    }
  } else {
    userInput += event.key;
    indicatorLocation++;
    if (typeof spanIndicatedCharacter === `undefined`) {
      const spanIncorrectCharacter = document.createElement(`span`);
      spanIncorrectCharacter.textContent = event.key;
      spanIncorrectCharacter.classList.add(`incorrect`);
      DIV_TEXT.childNodes[indicatorLocation - 2].insertAdjacentElement(`afterend`, spanIncorrectCharacter);
    } else if (event.key === spanIndicatedCharacter.textContent) {
      spanIndicatedCharacter.classList.remove(`indicator`);
      spanIndicatedCharacter.classList.add(`correct`);
    } else {
      const spanIncorrectCharacter = document.createElement(`span`);
      spanIncorrectCharacter.textContent = event.key;
      spanIncorrectCharacter.classList.add(`incorrect`);
      spanIndicatedCharacter.insertAdjacentElement(`beforebegin`, spanIncorrectCharacter);
    }
  }
  // Check if done.
  if (userInput === text) {
    alert(`WPM: ${updateWPM()}`);
    localStorage.characters = Number(localStorage.characters) + (text.length - 1);
    localStorage.time = Number(localStorage.time) + (performance.now() - startTime);
    SPAN_AVERAGE_WPM.textContent = `WPM ${Math.round((Number(localStorage.characters) / 5) / (Number(localStorage.time) / 1000 / 60))}`;
    reset();
  }
});
