"use strict";

import {KEYBOARD_LAYOUT} from './KeyboardLayout.js';

const CHARACTERS_PER_WORD = 5;
const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const DIV_TEXT = document.getElementById(`div-text-container`);
const SPAN_WPM = document.getElementById(`span-wpm`);
const SPAN_AVERAGE_WPM = document.getElementById(`span-average-wpm`);
const SPAN_ERRORS = document.getElementById(`span-errors`);

const CANVAS_KEYBOARD = document.getElementById(`canvas-keyboard`);
const CONTEXT_KEYBOARD = CANVAS_KEYBOARD.getContext('2d');

const CANVAS_HIGHLIGHT = document.getElementById(`canvas-highlight`);
const CONTEXT_HIGHLIGHT = CANVAS_HIGHLIGHT.getContext('2d');

localStorage.setItem(`words`, 0);
localStorage.setItem(`minutes`, 0);
localStorage.setItem(`wpm`, 0);

let toggleIndicatorInterval;
let updateWPMInterval;
let startTime;
let startTyping = false;
let text = ``;
let userInput = ``;
let textSetUp = false;
let indicatorLocation = 0;
let errors = 0;

function loadFile(filePath) {
  return new Promise((resolve, reject) => {
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open(`GET`, filePath);
    xmlHttpRequest.onload = () => {
      if (xmlHttpRequest.status === 200) {
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


    // let tempWord = words[Math.floor(Math.random() * words.length)];
    // let upperCaseWord = tempWord.charAt(0).toUpperCase() + tempWord.slice(1);
    // text = upperCaseWord;
    // while (text.length < Math.max(50, Number(localStorage.getItem(`wpm`)) * 5 / 2)) {
    //   tempWord = words[Math.floor(Math.random() * words.length)];
    //   upperCaseWord = tempWord.charAt(0).toUpperCase() + tempWord.slice(1);
    //   text += ` ${upperCaseWord}`;
    // }
    let textLength = 0;
    let textWords = [];
    while (textLength < 40 * CHARACTERS_PER_WORD) {
      let word = words[Math.floor(Math.random() * words.length)];
      // Makes it a capital word.
      if (Math.random() <= 0.2) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      // Adds a symbol.
      if (Math.random() <= 0.05) {
        word = `(${word})`;
      }
      textWords.push(word);
      textLength += word.length;
    }


    let text = textWords.join(` `);

    for (const character of text) {
      const spanCharacter = document.createElement(`span`);
      spanCharacter.textContent = character;
      DIV_TEXT.appendChild(spanCharacter);
    }
    toggleIndicatorInterval = setInterval(toggleIndicator, MILLISECONDS_PER_SECOND / 3);
    textSetUp = true;
    highlightKeys();
  }, (error) => {
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
  errors = 0;
  SPAN_ERRORS.textContent = `Errors: ${errors}`;
  setUpText();
}

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
  if (event.keyCode === 8) {
    if (userInput.length !== 0) {
      userInput = userInput.substring(0, userInput.length - 1);
      indicatorLocation--;
      DIV_TEXT.childNodes[indicatorLocation].classList.remove(`correct`, `incorrect`);
      if (indicatorLocation !== text.length - 1) {
        DIV_TEXT.childNodes[indicatorLocation + 1].classList.remove(`indicator`);
      }
    }
  } else if (userInput.length !== text.length) {
    const spanIndicatedCharacter = DIV_TEXT.childNodes[indicatorLocation];
    userInput += event.key;
    indicatorLocation++;
    spanIndicatedCharacter.classList.remove(`indicator`);
    if (event.key === spanIndicatedCharacter.textContent) {
      spanIndicatedCharacter.classList.add(`correct`);
    } else {
      spanIndicatedCharacter.classList.add(`incorrect`);
      errors++;
      SPAN_ERRORS.textContent = `Errors: ${errors}`;
    }
  }
  clearInterval(toggleIndicatorInterval);
  toggleIndicatorInterval = setInterval(toggleIndicator, MILLISECONDS_PER_SECOND / 3);
  // Check if done.
  if (userInput === text) {
    const words = Number(localStorage.getItem(`words`)) + (text.length - 1)/5;
    localStorage.setItem(`words`, words);
    const minutes = Number(localStorage.getItem(`minutes`)) + (performance.now() - startTime)/1000/60;
    localStorage.setItem(`minutes`, minutes);
    const wpm = words / minutes;
    localStorage.setItem(`wpm`, wpm);
    SPAN_AVERAGE_WPM.textContent = `Average WPM: ${Math.round(wpm)}`;
    alert(`Adjusted WPM: ${updateWPM() - errors}`);
    reset();
  }
  highlightKeys();
});

function highlightKeys() {
  // Checks if there is any text in "DIV_TEXT". Exits to avoid errors if there is no text.
  if (DIV_TEXT.childNodes.length == 0) return;
  const CURRENT_CHARACTER = DIV_TEXT.childNodes[indicatorLocation].textContent;

  const LEFT_SHIFT_CHARACTERS = `^&*()_+YUIOP{}|HJKL:"NM<>?`;
  const RIGHT_SHIFT_CHARACTERS = `~!@#$%QWERTASDFGZXCVB`;
  const STANDARD_KEY_SIZE = CANVAS_HIGHLIGHT.width/15;

  CONTEXT_HIGHLIGHT.clearRect(0, 0, CANVAS_HIGHLIGHT.width, CANVAS_HIGHLIGHT.height);
  CONTEXT_HIGHLIGHT.fillStyle = `rgb(0, 128, 128)`;
  // Loops over every key and checks if it should be highlighted.
  for (const [rowNumber, rowValue] of KEYBOARD_LAYOUT.entries()) {
    let xPosition = 0;
    for (const key of rowValue) {
      if (
        CURRENT_CHARACTER === key.value
        || CURRENT_CHARACTER === key.shiftValue
        || (LEFT_SHIFT_CHARACTERS.includes(CURRENT_CHARACTER) && key.value === `Left Shift`)
        || (RIGHT_SHIFT_CHARACTERS.includes(CURRENT_CHARACTER) && key.value === `Right Shift`)
      ) {
        CONTEXT_HIGHLIGHT.fillRect(
          xPosition,
          rowNumber*STANDARD_KEY_SIZE,
          key.size*STANDARD_KEY_SIZE,
          STANDARD_KEY_SIZE
        );
      }
      xPosition += key.size*STANDARD_KEY_SIZE;
    }
  }
}

function drawKeyboard() {
  const STANDARD_KEY_SIZE = CANVAS_KEYBOARD.width/15;

  // Settings
  CONTEXT_KEYBOARD.strokeStyle = `rgb(0, 0, 0)`;
  CONTEXT_KEYBOARD.lineWidth = `2px`;
  CONTEXT_KEYBOARD.font = `14px Verdana`;
  CONTEXT_KEYBOARD.textBaseline = `middle`;
  CONTEXT_KEYBOARD.textAlign = `center`;
  CONTEXT_KEYBOARD.fillStyle = `rgb(255, 255, 255)`;

  for (const [rowNumber, rowValue] of KEYBOARD_LAYOUT.entries()) {
    let xPosition = 0;
    for (const key of rowValue) {
      CONTEXT_KEYBOARD.strokeRect(
          xPosition,
          rowNumber*STANDARD_KEY_SIZE,
          key.size*STANDARD_KEY_SIZE,
          STANDARD_KEY_SIZE
        );
      // Render key labels.
      CONTEXT_KEYBOARD.fillText(
        key.topDisplay,
        xPosition + key.size*STANDARD_KEY_SIZE/2,
        rowNumber*STANDARD_KEY_SIZE + STANDARD_KEY_SIZE/3
      );
      CONTEXT_KEYBOARD.fillText(
        key.bottomDisplay,
        xPosition + key.size*STANDARD_KEY_SIZE/2,
        rowNumber*STANDARD_KEY_SIZE + 2*STANDARD_KEY_SIZE/3
      );

      xPosition += key.size*STANDARD_KEY_SIZE;
    }
  }
}

function scaleCanvases() {
  CANVAS_KEYBOARD.width = CANVAS_HIGHLIGHT.width = document.documentElement.clientWidth/2;
  CANVAS_KEYBOARD.height = CANVAS_HIGHLIGHT.height = CANVAS_KEYBOARD.width/3;
  drawKeyboard();
  highlightKeys();
}

window.addEventListener(`resize`, scaleCanvases);

window.addEventListener(`load`, () => {
  scaleCanvases();
  reset();
});
