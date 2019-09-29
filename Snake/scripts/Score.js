'use strict';

const SPAN_SCORE = document.getElementById('span-score');
const SPAN_HIGHSCORE = document.getElementById('span-highscore');
const MILLISECONDS_PER_SECOND = 1000;
const INCREMENTS_PER_SECOND = 100;

let incrementScoreInterval;
let score = 0;
let displayedScore = 0;

export function reset() {
  clearInterval(incrementScoreInterval);
  updateHighscore();
  score = 0;
  displayedScore = 0;
  displayScore(SPAN_SCORE, score);
}

export function update(points) {
  clearInterval(incrementScoreInterval);
  score += points;
  updateHighscore();
  incrementScoreInterval = setInterval(incrementScore, MILLISECONDS_PER_SECOND / INCREMENTS_PER_SECOND);
}

function incrementScore() {
  displayedScore += Math.ceil((score - displayedScore) / 100);
  // Stops the displayScore from incrementing above the score.
  if (displayedScore > score) {
    displayedScore = score;
    clearInterval(incrementScoreInterval);
  }
  window.requestAnimationFrame(() => displayScore(SPAN_SCORE, displayedScore));
  // displayScore(SPAN_SCORE, displayedScore);
  if (displayedScore > localStorage.highscore) {
    window.requestAnimationFrame(() => displayScore(SPAN_HIGHSCORE, displayedScore));
    // displayScore(SPAN_HIGHSCORE, displayedScore);
  }
}

function updateHighscore() {
  // First time setup.
  if (typeof localStorage.highscore === 'undefined') {
    localStorage.highscore = 0;
  }
  if (localStorage.highscore < score) {
    localStorage.highscore = score;
  }
  displayScore(SPAN_HIGHSCORE, Number(localStorage.highscore));
}

function displayScore(domElement, score) {
  if (score === 0) {
    domElement.textContent = '0'.repeat(9);
  } else {
    // Calculates the amount of padding-zeros needed.
    let digits = 2;
    while (score / Math.pow(10, digits) >= 1) {
      digits++
    }
    domElement.textContent = '0'.repeat(9 - digits) + score;
  }
}
