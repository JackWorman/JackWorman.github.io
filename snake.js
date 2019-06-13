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
if (CANVAS_SIZE / GRID_SIZE !== Math.round(CANVAS_SIZE / GRID_SIZE)) {
  alert('CANVAS_SIZE / GRID_SIZE is not a whole number. The canvas might render incorrectly.');
}
const MILLISECONDS_PER_SECOND = 1000;
const GROW_RATE = 5;
const RAINBOW = [
  "rgb(255, 0, 0)",
  "rgb(255, 127, 0)",
  "rgb(255, 255, 0)",
  "rgb(0, 255, 0)",
  "rgb(0, 0, 255)",
  "rgb(75, 0, 130)",
  "rgb(148, 0, 211)",
]


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
var score;
var distanceTraveled;
var smallestDistancePossible;
var controlsEnabled;
var framesPerSecond;
var inputQueuing = true;
var showGrid = false;
var AI_ENABLED = false;

document.addEventListener("DOMContentLoaded", function() {
  // Get DOM elements
  canvasBackground = document.getElementById('background');
  contextBackground = canvasBackground.getContext('2d');
  canvasForeground = document.getElementById('foreground');
  contextForeground = canvasForeground.getContext('2d');
  divScore = document.getElementById('score');
  // Initialize variables
  framesPerSecond = 15;
  controlsEnabled = false;

  setUpBackgroundAndForeground();
  setUpControls();

  reset();
});
function setUpControls() {
  document.addEventListener('keydown', function(event) {
    if (!controlsEnabled) {
      return;
    }
    if (inputQueuing) {
      var dir = nextDirection.length ? nextDirection[nextDirection.length - 1] : snake[0].direction;
      if (dir === 'left' || dir === 'right') {
        if (event.keyCode == 38) {
          nextDirection.push('up');
        } else if (event.keyCode == 40) {
          nextDirection.push('down');
        }
      } else if (dir === 'up' || dir === 'down') {
        if (event.keyCode == 37) {
          nextDirection.push('left');
        } else if (event.keyCode == 39) {
          nextDirection.push('right');
        }
      } else if (dir === 'none') {
        if (event.keyCode == 37) {
          nextDirection.push('left');
        } else if (event.keyCode == 38) {
          nextDirection.push('up');
        } else if (event.keyCode == 39) {
          nextDirection.push('right');
        } else if (event.keyCode == 40) {
          nextDirection.push('down');
        }
      }
    } else {
      if (snake[0].direction === 'left' || snake[0].direction === 'right') {
        if (event.keyCode == 38) {
          nextDirection.push('up');
        } else if (event.keyCode == 40) {
          nextDirection.push('down');
        }
      } else if (snake[0].direction === 'up' || snake[0].direction === 'down') {
        if (event.keyCode == 37) {
          nextDirection.push('left');
        } else if (event.keyCode == 39) {
          nextDirection.push('right');
        }
      } else if (snake[0].direction === 'none') {
        if (event.keyCode == 37) {
          nextDirection.push('left');
        } else if (event.keyCode == 38) {
          nextDirection.push('up');
        } else if (event.keyCode == 39) {
          nextDirection.push('right');
        } else if (event.keyCode == 40) {
          nextDirection.push('down');
        }
      }
    }
  }, true);
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
  renderBackground();
}
function renderBackground() {
  if (showGrid) {
    contextBackground.fillStyle = "rgb(0, 0, 0)";
    contextBackground.beginPath();
    for (var i = 0; i <= GRID_SIZE; i++) {
      var step = i * CANVAS_SIZE / GRID_SIZE + 0.5;
      contextBackground.moveTo(0.5, step);
      contextBackground.lineTo(CANVAS_SIZE, step);
      contextBackground.moveTo(step, 0.5);
      contextBackground.lineTo(step, CANVAS_SIZE);
    }
    contextBackground.stroke();
  } else {
    contextBackground.fillStyle = "rgb(255, 255, 255)";
    contextBackground.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }
}
function reset() {
  updateHighscore();
  nextDirection = [];
  // Place objects.
  snake = [new Vector(GRID_SIZE / 2, GRID_SIZE / 2, 'none')];
  placeFruit();
  // Reset score variables.
  distanceTraveled = 0;
  score = 0;
  divScore.textContent = 'Score: ' + score;
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
  smallestDistancePossible = Math.abs(fruit.x - snake[0].x) + Math.abs(fruit.y - snake[0].y,);
}


function gameLoop() {
  if (AI_ENABLED) {
    snakeAI();
  }
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
  fillSquare(fruit.x, fruit.y, "rgb(0, 0, 0)");
  for (var i = 0; i < snake.length; i++) {
    fillSquare(snake[i].x, snake[i].y, RAINBOW[i % RAINBOW.length]);
  }
}
function moveSnake() {
  var direction =  nextDirection.shift();
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
    score += Math.ceil(snake.length * smallestDistancePossible / distanceTraveled * framesPerSecond);
    divScore.textContent = 'Score: ' + score;
    distanceTraveled = 0;
    placeFruit();
    for (var i = 0; i < GROW_RATE; i++) {
      snake.push(new Vector(snake[snake.length - 1].x, snake[snake.length - 1].y, 'none'));
    }
  }
}

function showDirections() {
  Swal.fire('Use the arrow keys to turn.\nThe score increases each time you eat a fruit.\nHigher FPS = more points\nInefficent Route = less points');
}
async function chooseDifficulty() {
  clearInterval(loop);
  const {value: value} = await Swal.fire({
    title: 'Frames per Second',
    input: 'range',
    inputAttributes: {
      min: 5,
      max: 60,
      step: 5
    },
    inputValue: framesPerSecond
  });
  if (value) {
    framesPerSecond = value;
  }
  loop = setInterval(gameLoop, MILLISECONDS_PER_SECOND / framesPerSecond);
}
async function changeSettings() {
  function isChecked(setting) {
    return setting ? 'checked' : '';
  }
  const {value: settings} = await Swal.fire({
    title: 'Settings',
    html:
      '<div class="form-check">' +
        '<input class="form-check-input" type="checkbox" ' + isChecked(showGrid) + ' id="inputShowGrid">' +
        '<label class="form-check-label" for="checkbox1">Show Grid</label>' +
      '</div>' +
      '<div class="form-check">' +
        '<input class="form-check-input" type="checkbox" ' + isChecked(inputQueuing) + ' id="inputInputQueuing">' +
        '<label class="form-check-label" for="checkbox2">Input Queuing</label>' +
      '</div>',
    focusConfirm: true,
    preConfirm: () => {
      return {
        showGrid: document.getElementById('inputShowGrid').checked,
        inputQueuing: document.getElementById('inputInputQueuing').checked
      }
    }
  });
  if (settings !== undefined) {
    inputQueuing = settings.inputQueuing;
    showGrid = settings.showGrid;
    renderBackground();
  }
}

function snakeAI() {
  // Default movements
  // if (snake[0].direction === 'none') return;
  if (snake[0].x < fruit.x) {
    if (snake[0].direction === 'up' || snake[0].direction === 'down') {
      nextDirection.push('right');
    } else if (snake[0].direction === 'left') {
      nextDirection.push('up');
    } else {
      nextDirection.push('right');
    }
  } else if (snake[0].x > fruit.x) {
    if (snake[0].direction === 'up' || snake[0].direction === 'down') {
      nextDirection.push('left');
    } else if (snake[0].direction === 'right') {
      nextDirection.push('up');
    } else {
      nextDirection.push('left');
    }
  } else if (snake[0].y < fruit.y) {
    if (snake[0].direction === 'left' || snake[0].direction === 'right') {
      nextDirection.push('down');
    } else if (snake[0].direction === 'up') {
      nextDirection.push('right');
    } else {
      nextDirection.push('down');
    }
  } else if (snake[0].y > fruit.y) {
    if (snake[0].direction === 'left' || snake[0].direction === 'right') {
      nextDirection.push('up');
    } else if (snake[0].direction === 'down') {
      nextDirection.push('right');
    } else {
      nextDirection.push('up');
    }
  }

  var count = 0;
  while (detectCollisonAI()) {
    if (nextDirection[0] === 'up') {
      nextDirection[0] = 'right';
    } else if (nextDirection[0] === 'right') {
      nextDirection[0] = 'down';
    } else if (nextDirection[0] === 'down') {
      nextDirection[0] = 'left';
    } else if (nextDirection[0] === 'left') {
      nextDirection[0] = 'up';
    }
    if (count++ > 5) break;
  }
}

function detectCollisonAI() {
  // Check for future collison
  var futurePosition;
  if (nextDirection[0] === 'up') {
    futurePosition = new Point(snake[0].x, snake[0].y - 1);
  } else if (nextDirection[0] === 'down') {
    futurePosition = new Point(snake[0].x, snake[0].y + 1);
  } else if (nextDirection[0] === 'left') {
    futurePosition = new Point(snake[0].x - 1, snake[0].y);
  } else if (nextDirection[0] === 'right') {
    futurePosition = new Point(snake[0].x + 1, snake[0].y);
  }
  //detect wall hit
  if (futurePosition.x < 0 || futurePosition.x >= 30 || futurePosition.y < 0 || futurePosition.y >= 30) {
    return true;
  }
  //detect hit hit
  for (var i = 0; i < snake.length; i++) {
    if (futurePosition.x === snake[i].x && futurePosition.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

function enableDisableAI() {
  AI_ENABLED = !AI_ENABLED;
}

// MACHINE LEARNING
// INPUTS: 30 by 30 grid, head location, food location
// OUTPUTS: up, down, left, or right
