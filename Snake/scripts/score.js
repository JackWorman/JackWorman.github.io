const SPAN_SCORE = document.getElementById('span-score');
const SPAN_HIGHSCORE = document.getElementById('span-highscore');
const MILLISECONDS_PER_SECOND = 1000;
const INCREMENTS_PER_SECOND = 100;

let incrementScoreInterval;
let score = 0;
let displayedScore = 0;

export function resetScore() {
  clearInterval(incrementScoreInterval);
  score = 0;
  displayedScore = 0;
  displayScore(SPAN_SCORE, score);
}

// TODO: move score variable to this module and pass any updates to score as a parameter
export function updateScore(points) {
  clearInterval(incrementScoreInterval);
  score += points;
  updateHighscore();
  incrementScoreInterval = setInterval(incrementScore, MILLISECONDS_PER_SECOND / INCREMENTS_PER_SECOND);
}

export function incrementScore() {
  displayedScore += Math.ceil((score - displayedScore) / 100);
  // Stops the displayScore from incrementing above the score.
  if (displayedScore > score) {
    displayedScore = score;
    clearInterval(incrementScoreInterval);
  }
  displayScore(SPAN_SCORE, displayedScore);
  if (displayedScore > localStorage.highscore) {
    displayScore(SPAN_HIGHSCORE, displayedScore);
  }
}

export function updateHighscore() {
  // First time setup.
  if (typeof localStorage.highscore === 'undefined') {
    localStorage.highscore = 0;
  }
  if (localStorage.highscore < score) {
    localStorage.highscore = score;
  }
  displayScore(SPAN_HIGHSCORE, Number(localStorage.highscore));
}

export function displayScore(domElement, score) {
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
