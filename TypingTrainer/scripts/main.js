"use strict";

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const DIV_TEXT = document.getElementById(`div-text-container`);
const SPAN_WPM = document.getElementById(`span-wpm`);
const SPAN_AVERAGE_WPM = document.getElementById(`span-average-wpm`);

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
    while (text.length <= Math.max(50, Number(localStorage.getItem(`wpm`)) / 2)) {
      text += ` ${words[Math.floor(Math.random() * words.length)]}`;
    }
    for (const character of text) {
      const spanCharacter = document.createElement(`span`);
      spanCharacter.textContent = character;
      DIV_TEXT.appendChild(spanCharacter);
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
      DIV_TEXT.childNodes[indicatorLocation].classList.remove(`correct`, `incorrect`);
      DIV_TEXT.childNodes[indicatorLocation + 1].classList.remove(`indicator`);
    }
  } else {
    userInput += event.key;
    indicatorLocation++;
    spanIndicatedCharacter.classList.remove(`indicator`);
    if (event.key === spanIndicatedCharacter.textContent) {
      spanIndicatedCharacter.classList.add(`correct`);
    } else {
      spanIndicatedCharacter.classList.add(`incorrect`);
    }
  }
  // Check if done.
  if (userInput === text) {
    alert(`WPM: ${updateWPM()}`);
    const words = Number(localStorage.getItem(`words`)) + ((text.length - 1)/5);
    localStorage.setItem(`words`, words);
    const minutes = Number(localStorage.getItem(`minutes`)) + ((performance.now() - startTime) / 1000 / 60);
    localStorage.setItem(`minutes`, minutes);
    const wpm = words / minutes;
    localStorage.setItem(`wpm`, wpm);
    SPAN_AVERAGE_WPM.textContent = `Average WPM: ${Math.round(wpm)}`;
    reset();
  }
});
