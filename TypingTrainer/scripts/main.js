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

toggleIndicatorInterval = setInterval(toggleIndicator, MILLISECONDS_PER_SECOND / 2);

function toggleIndicator() {
  document.getElementById(`div-text-${document.getElementById(`textarea`).value.length + 1}`).classList.toggle(`indicator`);
}





// obj = document.createElement('prop');
//     document.body.appendChild(obj);
// DIV_TEXT.textContent = text;

// const lines = loadFile(`https://jackworman.com/TypingTrainer/NextLetterCounts.txt`).split(/\n/);
// const letterCounts = {};
// let allLetterCount = 0;
//
// for (const line of lines) {
//   const letter = line.charAt(0);
//   const words = line.split(/\s/);
//   if (typeof letterCounts[letter] === `undefined`) {
//     letterCounts[letter] = Number(words[2]);
//   } else {
//     letterCounts[letter] += Number(words[2]);
//   }
//   allLetterCount += Number(words[2]);
// }
//
// let text = ``;
// for (let i = 0; i < 1000; i++) {
//   if (text === `` || text.charAt(text.length - 1) === ` `) {
//     const rand = Math.floor(Math.random() * allLetterCount);
//     let count = 0;
//     for (const letter in letterCounts) {
//       count += letterCounts[letter];
//       if (rand < count) {
//         text += letter;
//         break;
//       }
//     }
//   } else {
//     const previousLetter = text.charAt(text.length - 1);
//     const rand = Math.floor(Math.random() * letterCounts[previousLetter]);
//     let count = 0;
//     for (const line of lines) {
//       if (line.charAt(0) === previousLetter) {
//         const words = line.split(/\s/);
//         count += Number(words[2]);
//         if (rand < count) {
//           if (words[1] === `space`) {
//             text += ` `;
//           } else {
//             text += words[1];
//           }
//           break;
//         }
//       }
//     }
//   }
// }
// DIV_TEXT.textContent = text;
//
// // console.log(letterCounts);
