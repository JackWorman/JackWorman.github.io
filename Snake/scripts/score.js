export function updateScore() {
  clearInterval(incrementScoreInterval);
  incrementScoreInterval = setInterval(incrementScore, MILLISECONDS_PER_SECOND / 100);
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
