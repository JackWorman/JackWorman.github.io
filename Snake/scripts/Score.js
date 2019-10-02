'use strict';

const SPAN_SCORE = document.getElementById('span-score');
const SPAN_HIGHSCORE = document.getElementById('span-highscore');
const MILLISECONDS_PER_SECOND = 1000;
const INCREMENTS_PER_SECOND = 100;
const PADDING_LENGTH = 9;

let incrementScoreInterval;
let score = 0;
let displayedScore = 0;

export function reset() {
  clearInterval(incrementScoreInterval);
  updateHighscore();
  score = 0;
  displayedScore = 0;
  displayScore(SPAN_SCORE, score);
  displayScore(SPAN_HIGHSCORE, Number(localStorage.highscore));
}

/**
 * @param  {Number} additionalPoints The points to be added to the current score.
 */
export function update(additionalPoints) {
  score += additionalPoints;
  updateHighscore();
  clearInterval(incrementScoreInterval);
  incrementScoreInterval = setInterval(incrementScore, MILLISECONDS_PER_SECOND / INCREMENTS_PER_SECOND);
}

function updateHighscore() {
  // First time setup.
  if (typeof localStorage.highscore === 'undefined') {
    localStorage.highscore = '0';
  }
  if (Number(localStorage.highscore) < score) {
    localStorage.highscore = score;
  }
}

function incrementScore() {
  displayedScore += Math.ceil((score - displayedScore) / 100);
  // Stops the displayScore from incrementing above the score.
  if (displayedScore >= score) {
    displayedScore = score;
    clearInterval(incrementScoreInterval);
  }
  window.requestAnimationFrame(() => displayScore(SPAN_SCORE, displayedScore));
  if (displayedScore > localStorage.highscore) {
    console.log('test');
    window.requestAnimationFrame(() => displayScore(SPAN_HIGHSCORE, displayedScore));
  }
}

function displayScore(domElement, score) {
  if (score === 0) {
    domElement.textContent = '0'.repeat(PADDING_LENGTH);
  } else {
    // Calculates the amount of padding-zeros needed.
    let digits = 1;
    while (score / Math.pow(10, digits) >= 1) {
      digits++
    }
    domElement.textContent = '0'.repeat(PADDING_LENGTH - digits) + score;
  }
}
