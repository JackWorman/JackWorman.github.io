// Constants
const CANVAS_SIZE = 500; // in pixels
const GRID_SIZE = 30;
const FRAMES_PER_SECOND = 15;
const MILLISECONDS_PER_SECOND = 1000;
const MILLISECONDS_PER_FRAME = 1 / FRAMES_PER_SECOND * MILLISECONDS_PER_SECOND;
const GROW_RATE = 5;

// Globals
var canvas;
var context;
var nextDirection;
var gameLoop;
var snake;
var fruit;
var score = 0;
var rainbow = [
  "rgb(255, 0 , 0)",
  "rgb(255, 127, 0)",
  "rgb(255, 255, 0)",
  "rgb(0, 255, 0)",
  "rgb(0, 0, 255)",
  "rgb(75, 0, 130)",
  "rgb(148, 0, 211)",
]
var stopWatch = new StopWatch();

if (getCookie("clear_cache") === "") {
  setCookie("clear_cache", "true", 1 / 24 / 60);
  window.location.reload(true);
}

document.addEventListener("DOMContentLoaded", function(){
  canvas = document.getElementById('board');
  context = canvas.getContext('2d');
  setUpCanvas();
  setUpBoard();
  setUpControls();
  snake = [new Vector(GRID_SIZE / 2, GRID_SIZE / 2, 'none')];
  placeFruit();
  gameLoop = setInterval(refresh, MILLISECONDS_PER_FRAME);
});

function setUpCanvas() {
  canvas.style.position = "absolute";
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  // Position the canvas in the center of the screen.
  window.onload = window.onresize = function() {
    canvas.style.top = (window.innerHeight - canvas.height) / 2 + "px";
    canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
  }
  // Draws a grid onto the canvas.
  for (var i = 0; i <= GRID_SIZE; i++) {
    var step = i * CANVAS_SIZE / GRID_SIZE;
    context.moveTo(0, step);
    context.lineTo(CANVAS_SIZE, step);
    context.stroke();
    context.moveTo(step, 0);
    context.lineTo(step, CANVAS_SIZE);
    context.stroke();
  }
}

function setUpBoard() {
  board = new Array(GRID_SIZE);
  for (var i = 0; i < GRID_SIZE; i++) {
    board[i] = new Array(GRID_SIZE);
    for (var j = 0; j < GRID_SIZE; j++) {
      board[i][j] = 0;
    }
  }
}

function setUpControls() {
  /**
   * 37 = Left Arrow
   * 38 = Up Arrow
   * 39 = Right Arrow
   * 40 = Down Arrow
  */
  document.addEventListener('keydown', function(event) {
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
    } else {
      if (event.keyCode == 37) { // Left Arrow
        nextDirection = 'left';
      } else if (event.keyCode == 38) { // Up Arrow
        nextDirection = 'up';
      } else if (event.keyCode == 39) { // Right Arrow
        nextDirection = 'right';
      } else if (event.keyCode == 40) { // Down Arrow
        nextDirection = 'down';
      }
      stopWatch.start();
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
}

function refresh() {
  moveSnake();
  // Refresh display.
  for (var i = 0; i < GRID_SIZE; i++) {
    for (var j = 0; j < GRID_SIZE; j++) {
      context.fillStyle = "rgb(255, 255, 255)"; // White
      if (i === fruit.x && j === fruit.y) {
        context.fillStyle = "rgb(0, 0, 0)"; // Green
      }
      for (var k = 0; k < snake.length; k++) {
        if (i === snake[k].x && j === snake[k].y) {
          context.fillStyle = rainbow[k % rainbow.length]; // Red
          break;
        }
      }
      var xStart = i * CANVAS_SIZE / GRID_SIZE + 1;
      var yStart = j * CANVAS_SIZE / GRID_SIZE + 1;
      var xLength = CANVAS_SIZE / GRID_SIZE - 2;
      var yLength = CANVAS_SIZE / GRID_SIZE - 2;
      context.fillRect(xStart, yStart, xLength, yLength);
    }
  }
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
  // Test if the snake hit a wall or itself.
  var hitSelf = false;
  for (var i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      hitSelf = true;
      break;
    }
  }
  if (hitSelf || snake[0].x < 0 || snake[0].y < 0 || snake[0].x >= GRID_SIZE || snake[0].y >= GRID_SIZE) {
    alert('GAME OVER!\nScore: ' + score);
    reset();
    return;
  }
  // Test if the snake ate a fruit.
  if (snake[0].x === fruit.x && snake[0].y === fruit.y) {
    // Update score.
    stopWatch.stop();
    score += Math.ceil(snake.length / stopWatch.getElapsedSeconds());
    stopWatch.start();
    divScore = document.getElementById('score');
    divScore.textContent = 'Score: ' + score;

    placeFruit();
    for (var i = 0; i < GROW_RATE; i++) {
      snake.push(new Vector(snake[snake.length - 1].x, snake[snake.length - 1].y, 'none'));
    }

  }
}

function reset() {
  nextDirection = 'none';
  snake = [new Vector(GRID_SIZE / 2, GRID_SIZE / 2, 'none')];
  placeFruit();
  divScore = document.getElementById('score');
  score = 0;
  divScore.textContent = 'Score: ' + score;
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
