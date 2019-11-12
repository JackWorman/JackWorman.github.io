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
    for (let i = 0; i < 9; i++) {
      text += ` ${words[Math.floor(Math.random() * words.length)]}`;
    }
    let count = 1;
    for (const character of text) {
      const span = document.createElement(`span`);
      span.setAttribute(`id`, `span-character-${count++}`);
      span.textContent = character;
      DIV_TEXT.appendChild(span);
    }
  }, function(error) {
    console.error("Failed!", error);
  });
}

function toggleIndicator() {
  const SPAN_CHARACTER = document.getElementById(`span-character-${userInput.length + 1}`);
  if (SPAN_CHARACTER !== null) {
    SPAN_CHARACTER.classList.toggle(`indicator`);
  }
}

function updateWPM() {
  const words = userInput.length / 5;
  const minutes = (performance.now() - startTime) / MILLISECONDS_PER_SECOND / SECONDS_PER_MINUTE;
  const wpm = words / minutes;
  SPAN_WPM.textContent = `WPM: ${Math.round(wpm)}`;
}

// TEXTAREA.addEventListener(`input`, (event) => {
//   if (!startTyping) {
//     startTyping = true;
//     startTime = performance.now();
//     updateWPMInterval = setInterval(updateWPM, MILLISECONDS_PER_SECOND / 10);
//   }
//   // Clears all classes from each span_character.
//   const SPAN_CHARACTERS = DIV_TEXT.getElementsByTagName(`span`);
//   for (const SPAN_CHARACTER of SPAN_CHARACTERS) {
//     SPAN_CHARACTER.classList.remove(`indicator`, `correct`, `incorrect`);
//   }
//   // Checks if each letter is correct or incorrect.
//   for (let i = 0; i < TEXTAREA.value.length; i++) {
//     const SPAN_CHARACTER = document.getElementById(`span-character-${i + 1}`);
//     if (TEXTAREA.value.charAt(i) === SPAN_CHARACTER.textContent) {
//       SPAN_CHARACTER.classList.add(`correct`);
//     } else {
//       SPAN_CHARACTER.classList.add(`incorrect`);
//     }
//   }
//   // Check if done.
//   if (TEXTAREA.value.length === SPAN_CHARACTERS.length) {
//     reset();
//     alert(`Done.`);
//   }
// });

function reset() {
  clearInterval(updateWPMInterval);
  clearInterval(toggleIndicatorInterval);
  DIV_TEXT.innerHTML = ``;
  userInput = ``;
  startTyping = false;
  setUpText();
  toggleIndicatorInterval = setInterval(toggleIndicator, MILLISECONDS_PER_SECOND / 3);
}

reset();


document.addEventListener(`keydown`, (event) => {
    if (event.keyCode === 8) {
      event.preventDefault();
      if (userInput.length !== 0) {
        userInput = userInput.substring(0, userInput.length - 1);
      }
      console.log(userInput);
    } else {
      userInput += String.fromCharCode(event.keyCode);
      console.log(userInput);
    }

    if (!startTyping) {
      startTyping = true;
      startTime = performance.now();
      updateWPMInterval = setInterval(updateWPM, MILLISECONDS_PER_SECOND / 10);
    }
    // Clears all classes from each span_character.
    const SPAN_CHARACTERS = DIV_TEXT.getElementsByTagName(`span`);
    for (const SPAN_CHARACTER of SPAN_CHARACTERS) {
      SPAN_CHARACTER.classList.remove(`indicator`, `correct`, `incorrect`);
    }
    // Checks if each letter is correct or incorrect.
    for (let i = 0; i < userInput.length; i++) {
      const SPAN_CHARACTER = document.getElementById(`span-character-${i + 1}`);
      if (userInput.charAt(i) === SPAN_CHARACTER.textContent) {
        SPAN_CHARACTER.classList.add(`correct`);
      } else {
        SPAN_CHARACTER.classList.add(`incorrect`);
      }
    }
    // Check if done.
    if (userInput.length === SPAN_CHARACTERS.length) {
      reset();
      alert(`Done.`);
    }
});
