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
if (CANVAS_SIZE / GRID_SIZE !== Math.round(CANVAS_SIZE / GRID_SIZE)) {
  alert('CANVAS_SIZE / GRID_SIZE is not a whole number. The canvas might render incorrectly.');
}
var FRAMES_PER_SECOND = 20;
const MILLISECONDS_PER_SECOND = 1000;
var MILLISECONDS_PER_FRAME = 1 / FRAMES_PER_SECOND * MILLISECONDS_PER_SECOND;
const GROW_RATE = 5;

// Globals
var canvasBackground;
var contextBackground;
var canvasForeground;
var contextForeground;
var divScore;
var nextDirection;
var gameLoop;
var snake;
var fruit;
var score = 0;
var rainbow = [
  "rgb(255, 0, 0)",
  "rgb(255, 127, 0)",
  "rgb(255, 255, 0)",
  "rgb(0, 255, 0)",
  "rgb(0, 0, 255)",
  "rgb(75, 0, 130)",
  "rgb(148, 0, 211)",
]
var distanceTraveled = 0;
var smallestDistancePossible;
var controlsEnabled = false;
var slider;

document.addEventListener("DOMContentLoaded", function() {
  canvasBackground = document.getElementById('background');
  contextBackground = canvasBackground.getContext('2d');
  canvasForeground = document.getElementById('foreground');
  contextForeground = canvasForeground.getContext('2d');
  divScore = document.getElementById('score');
  slider = document.getElementById("inputDifficulty");
  slider.onchange = function() {
    clearInterval(loop);
    loop = setInterval(gameLoop, 1 / this.value * MILLISECONDS_PER_SECOND);
  }

  setUpBackgroundAndForeground();
  setUpControls();

  reset();
});

function reset() {
  FRAMES_PER_SECOND = slider.value;
  updateHighscore();
  nextDirection = 'none';
  snake = [new Vector(GRID_SIZE / 2, GRID_SIZE / 2, 'none')];
  placeFruit();
  score = 0;
  divScore.textContent = 'Score: ' + score;
  renderForeground();
  loop = setInterval(gameLoop, 1 / FRAMES_PER_SECOND * MILLISECONDS_PER_SECOND);
  controlsEnabled = true;
}

function setUpBackgroundAndForeground() {
  // Set canvas's size.
  canvasBackground.width = CANVAS_SIZE;
  canvasBackground.height = CANVAS_SIZE;
  canvasForeground.width = CANVAS_SIZE;
  canvasForeground.height = CANVAS_SIZE;
  // Draws a white background.
  contextBackground.fillStyle = "rgb(255, 255, 255)";
  contextBackground.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  // Draws a grid onto the canvas.
  contextBackground.fillStyle = "rgb(0, 0, 0)";
  contextBackground.beginPath();
  for (var i = 0; i <= GRID_SIZE; i++) {
    var step = i * CANVAS_SIZE / GRID_SIZE + 0.5;
    contextBackground.moveTo(0.5, step);
    contextBackground.lineTo(CANVAS_SIZE, step);
    contextBackground.stroke();
    contextBackground.moveTo(step, 0.5);
    contextBackground.lineTo(step, CANVAS_SIZE);

  }
  contextBackground.stroke();
}

function setUpControls() {
  document.addEventListener('keydown', function(event) {
    if (controlsEnabled) {
      if (snake[0].direction === 'left' || snake[0].direction === 'right') {
        if (event.keyCode == 38) {
          nextDirection = 'up';
        } else if (event.keyCode == 40) {
          nextDirection = 'down';
        }
      } else if (snake[0].direction === 'up' || snake[0].direction === 'down') {
        if (event.keyCode == 37) {
          nextDirection = 'left';
        } else if (event.keyCode == 39) {
          nextDirection = 'right';
        }
      } else if (snake[0].direction === 'none') {
        if (event.keyCode == 37) { // Left Arrow
          nextDirection = 'left';
        } else if (event.keyCode == 38) { // Up Arrow
          nextDirection = 'up';
        } else if (event.keyCode == 39) { // Right Arrow
          nextDirection = 'right';
        } else if (event.keyCode == 40) { // Down Arrow
          nextDirection = 'down';
        }
      }
    }
  }, true);
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
  smallestDistancePossible = Math.abs(fruit.x - snake[0].x) + Math.abs(fruit.y - snake[0].y,);
}

function renderForeground() {
  contextForeground.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  fillSquare(fruit.x, fruit.y, "rgb(0, 0, 0)");
  for (var i = 0; i < snake.length; i++) {
    fillSquare(snake[i].x, snake[i].y, rainbow[i % rainbow.length]);
  }
}

function fillSquare(x, y, color) {
  contextForeground.fillStyle = color;
  var xStart = x * CANVAS_SIZE / GRID_SIZE + 0.5;
  var yStart = y * CANVAS_SIZE / GRID_SIZE + 0.5;
  var xLength = CANVAS_SIZE / GRID_SIZE;
  var yLength = CANVAS_SIZE / GRID_SIZE;
  contextForeground.fillRect(xStart, yStart, xLength, yLength);
}

function moveSnake() {
  snake[0].direction = nextDirection;
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
    await Swal.fire({text: 'Game Over', showConfirmButton: false, timer: 1000});
    reset();
  }
}

function detectFruitEaten() {
  if (snake[0].x === fruit.x && snake[0].y === fruit.y) {
    score += Math.ceil(snake.length / (distanceTraveled / smallestDistancePossible));
    divScore.textContent = 'Score: ' + score;
    distanceTraveled = 0;
    placeFruit();
    for (var i = 0; i < GROW_RATE; i++) {
      snake.push(new Vector(snake[snake.length - 1].x, snake[snake.length - 1].y, 'none'));
    }
  }
}

function updateHighscore() {
  for (var i = 1; i <= 5; i++) {
    if (Number(getCookie('highscore' + i)) < score) {
      for (var j = 5; j > i; j--) { // move scores down
        setCookie('highscore' + j, getCookie('highscore' + (j - 1)), 1000);
      }
      setCookie('highscore' + i, score, 1000);
      break;
    }
  }
  for (var i = 1; i <= 5; i++) {
    highscoreX = document.getElementById('highscore' + i);
    highscoreX.textContent = i + '. ' + getCookie('highscore' + i);
  }
}

function gameLoop() {
  moveSnake();
  detectCollison();
  detectFruitEaten();
  renderForeground();
}
