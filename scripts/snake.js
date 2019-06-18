// Force a refresh from server.
if (getCookie("clear_cache") === "") {
  setCookie("clear_cache", "true", 1 / 24 / 60);
  window.location.reload(true);
}

class Vector {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Constants
const CANVAS_SIZE = 600; // in pixels
const GRID_SIZE = 30;
const MILLISECONDS_PER_SECOND = 1000;
const GROW_RATE = 5;
const BLACK = 'rgb(0, 0, 0)';
const WHITE = 'rgb(255, 255, 255)';
const RAINBOW = [
  "rgb(255, 0, 0)",
  "rgb(255, 127, 0)",
  "rgb(255, 255, 0)",
  "rgb(0, 255, 0)",
  "rgb(0, 0, 255)",
  "rgb(75, 0, 130)",
  "rgb(148, 0, 211)",
]
const DIRECTIONS = ['left', 'up', 'right', 'down'];

// DOM Elements
var canvasBackground;
var contextBackground;
var canvasForeground;
var contextForeground;
var scoreBoard;

// Globals
var directionQueue;
var gameLoop;
var snake;
var fruit;
var score = 0;
var distanceTraveled;
var smallestDistancePossible;
var controlsEnabled = false;

document.addEventListener("DOMContentLoaded", function() {
  if (CANVAS_SIZE / GRID_SIZE !== Math.round(CANVAS_SIZE / GRID_SIZE)) {
    alert('CANVAS_SIZE / GRID_SIZE is not a whole number. The canvas might render incorrectly.');
  }
  // Get DOM elements
  canvasBackground = document.getElementById('background');
  contextBackground = canvasBackground.getContext('2d');
  canvasForeground = document.getElementById('foreground');
  contextForeground = canvasForeground.getContext('2d');
  scoreBoard = document.getElementById('scoreBoard');
  divea = document.getElementById('ea');

  setUpBackgroundAndForeground();
  setUpControls();

  evolAlg = new EvolutionaryAlgorithm(2000, 14, 8, 4);
  evolAlg.initializeAllNeuralNetworks();

  reset();
});

function setUpBackgroundAndForeground() {
  // Set canvas's size.
  canvasBackground.width = CANVAS_SIZE;
  canvasBackground.height = CANVAS_SIZE;
  canvasForeground.width = CANVAS_SIZE;
  canvasForeground.height = CANVAS_SIZE;
  // Draws a white background.
  renderBackground();
}

function renderBackground() {
  contextBackground.fillStyle = WHITE;
  contextBackground.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  if (showGrid) {
    contextBackground.fillStyle = BLACK;
    contextBackground.beginPath();
    for (var i = 0; i <= GRID_SIZE; i++) {
      var step = i * CANVAS_SIZE / GRID_SIZE + 0.5;
      contextBackground.moveTo(0.5, step);
      contextBackground.lineTo(CANVAS_SIZE, step);
      contextBackground.moveTo(step, 0.5);
      contextBackground.lineTo(step, CANVAS_SIZE);
    }
    contextBackground.stroke();
  }
}

function setUpControls() {
  document.addEventListener('keydown', function(event) {
    if (!controlsEnabled || (event.keyCode !== 37 && event.keyCode !== 38 && event.keyCode !== 39 && event.keyCode !== 40)) {
      return;
    }
    if (inputQueuing) {
      var dir = directionQueue.length ? directionQueue[directionQueue.length - 1] : snake[0].direction;
      if (dir === 'left' || dir === 'right') {
        if (event.keyCode === 38) {
          directionQueue.push('up');
        } else if (event.keyCode === 40) {
          directionQueue.push('down');
        }
      } else if (dir === 'up' || dir === 'down') {
        if (event.keyCode === 37) {
          directionQueue.push('left');
        } else if (event.keyCode === 39) {
          directionQueue.push('right');
        }
      } else if (dir === 'none') {
        directionQueue.push(DIRECTIONS[event.keyCode - 37]);
      }
    } else {
      if (snake[0].direction === 'left' || snake[0].direction === 'right') {
        if (event.keyCode === 38) {
          directionQueue.push('up');
        } else if (event.keyCode === 40) {
          directionQueue.push('down');
        }
      } else if (snake[0].direction === 'up' || snake[0].direction === 'down') {
        if (event.keyCode === 37) {
          directionQueue.push('left');
        } else if (event.keyCode === 39) {
          directionQueue.push('right');
        }
      } else if (snake[0].direction === 'none') {
        directionQueue.push(DIRECTIONS[event.keyCode - 37]);
      }
    }
  }, true);
}

function reset() {
  if (aiEnabled) { // move to ai controller
    if (evolAlg.species < 0) {

    } else {
      evolAlg.nN[evolAlg.species].fitness = score;
    }
    numMovementsSinceFruit = 0;
    // End of generation.
    if (evolAlg.species === evolAlg.nN.length - 1) {
      evolAlg.sort();
      var sum = 0;
      for (var i = 0; i < evolAlg.nN.length; i++) {
        sum += evolAlg.nN[i].fitness;
      }
      console.log('Best of generation ' + evolAlg.gen + ': ' + evolAlg.nN[0].fitness);
      console.log('Average of generation ' + evolAlg.gen + ': ' + sum / evolAlg.nN.length);
      evolAlg.mutate();
      evolAlg.gen++;
      evolAlg.species = -1;
    }
    evolAlg.species++;
    divea.textContent = 'Generation: ' + evolAlg.gen + ', Species: ' + evolAlg.species;
  }

  updateHighscore();
  directionQueue = [];
  // Place objects.
  snake = [new Vector(GRID_SIZE / 2, GRID_SIZE / 2, 'none')];
  placeFruit();
  // Reset score variables.
  distanceTraveled = 0;
  score = 0;
  scoreBoard.textContent = 'Score: ' + score;
  //
  renderForeground();
  loop = setInterval(gameLoop, MILLISECONDS_PER_SECOND / framesPerSecond);
  controlsEnabled = true;
}

function updateHighscore() {
  for (var i = 1; i <= 5; i++) {
    if (Number(getCookie('highscore' + i)) < score) {
      for (var j = 5; j > i; j--) { // move scores down
        setCookie('highscore' + j, getCookie('highscore' + (j - 1)), 1000);
        setCookie('highscoreFPS' + j, getCookie('highscoreFPS' + (j - 1)), 1000);
      }
      setCookie('highscore' + i, score, 1000);
      setCookie('highscoreFPS' + i, framesPerSecond, 1000);
      break;
    }
  }
  for (var i = 1; i <= 5; i++) {
    if (Number(getCookie('highscore' + i))) {
      highscoreX = document.getElementById('highscore' + i);
      highscoreX.textContent = i + '. ' + getCookie('highscore' + i) + ' - ' + getCookie('highscoreFPS' + i) + 'FPS';
    }
  }
}

function placeFruit() {
  var fruitX;
  var fruitY;
  do {
    fruitX = Math.floor(Math.random() * GRID_SIZE);
    fruitY = Math.floor(Math.random() * GRID_SIZE);
    var collison = false;
    for (var i = 0; i < snake.length; i++) {
      if (fruitX === snake[i].x && fruitY === snake[i].y) {
        collison = true;
      }
    }
  } while (collison);
  fruit = new Point(fruitX, fruitY);
  smallestDistancePossible = Math.abs(fruit.x - snake[0].x) + Math.abs(fruit.y - snake[0].y);

  numMovementsSinceFruit = 0; // ai var
}

function gameLoop() {
  if (aiEnabled) snakeAI3();
  moveSnake();
  detectCollison();
  detectFruitEaten();
  renderForeground();
}

function renderForeground() {
  function fillSquare(x, y, color) {
    contextForeground.fillStyle = color;
    var xStart = x * CANVAS_SIZE / GRID_SIZE + 0.5;
    var yStart = y * CANVAS_SIZE / GRID_SIZE + 0.5;
    var xLength = CANVAS_SIZE / GRID_SIZE;
    var yLength = CANVAS_SIZE / GRID_SIZE;
    contextForeground.fillRect(xStart, yStart, xLength, yLength);
  }
  contextForeground.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  fillSquare(fruit.x, fruit.y, BLACK);
  for (var i = 0; i < snake.length; i++) {
    fillSquare(snake[i].x, snake[i].y, RAINBOW[i % RAINBOW.length]);
  }
}

function moveSnake() {
  // var startingDistance = calcDistance();
  var direction =  directionQueue.shift();
  if (direction) {
    snake[0].direction = direction;
  }
  // Move the snake from tail to head.
  for (var i = snake.length - 1; i >= 0; i--) {
    if (snake[i].direction === 'right') {
      snake[i].x++;
    } else if (snake[i].direction === 'up') {
      snake[i].y--;
    } else if (snake[i].direction === 'left') {
      snake[i].x--;
    } else if (snake[i].direction === 'down') {
      snake[i].y++;
    }
    if (i !== 0) {
      snake[i].direction = snake[i - 1].direction;
    }
  }
  distanceTraveled++;

  if (aiEnabled) {
    score++;
    if (numMovementsSinceFruit++ > 500) {
      clearInterval(loop);
      reset();
    }
  }
  // var endingDistance = calcDistance();
  // if (endingDistance < startingDistance) score++;
}

async function detectCollison() {
  // Test if it hit itself.
  var hitSelf = false;
  for (var i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      hitSelf = true;
      break;
    }
  }
  // Test if hit a wall.
  if (hitSelf || snake[0].x < 0 || snake[0].y < 0 || snake[0].x >= GRID_SIZE || snake[0].y >= GRID_SIZE) {
    clearInterval(loop);
    controlsEnabled = false;
    if (!aiEnabled) {
      await Swal.fire({text: 'Game Over', showConfirmButton: false, timer: 1000});
    }
    reset();
  }
}

function detectFruitEaten() {
  if (snake[0].x === fruit.x && snake[0].y === fruit.y) {
    if (aiEnabled) {
      score += 1000;
    } else {
      score += Math.ceil(snake.length * smallestDistancePossible / distanceTraveled * framesPerSecond);
    }
    scoreBoard.textContent = 'Score: ' + score;
    distanceTraveled = 0;
    placeFruit();
    for (var i = 0; i < GROW_RATE; i++) {
      snake.push(new Vector(snake[snake.length - 1].x, snake[snake.length - 1].y, 'none'));
    }
  }
}
