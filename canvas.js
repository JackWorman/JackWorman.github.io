// Constants
const CANVAS_SIZE = 750;
const GRID_SIZE = 50;
const REFRESH_RATE = 125; // time in milliseconds

// Globals
var gameLoop;
var canvas;
var context;

var snake = [];
var fruit;

$(document).ready(function() {
  canvas = document.getElementById('myCanvas');
  context = canvas.getContext('2d');
  setUpCanvas();
  setUpBoard();
  setUpControls();

  snake.push(new Vector(GRID_SIZE / 2, GRID_SIZE / 2, 'none'));
  var fruitX;
  var fruitY;
  do {
    fruitX = Math.floor(Math.random() * 50);
    fruitY = Math.floor(Math.random() * 50);
  } while (fruitX === GRID_SIZE / 2 && fruitY === GRID_SIZE / 2);
  fruit = new Point(fruitX, fruitY);

  gameLoop = setInterval(display, REFRESH_RATE);
});

function setUpCanvas() {
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
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
  document.addEventListener('keydown', function(event) {
    if (event.keyCode == 37) { // Left Arrow
      snake[0].direction = 'left';
    } else if (event.keyCode == 38) { // Up Arrow
      snake[0].direction = 'up';
    } else if (event.keyCode == 39) { // Right Arrow
      snake[0].direction = 'right';
    } else if (event.keyCode == 40) { // Down Arrow
      snake[0].direction = 'down';
    }
  }, true);
}

function display() {


  for (var i = 0; i < GRID_SIZE; i++) {
    for (var j = 0; j < GRID_SIZE; j++) {
      if (i === snake[0].x && j === snake[0].y) {
        context.fillStyle = "#FF0000"; // red
      } else if (i === fruit.x && j === fruit.y) {
        context.fillStyle = "#0000FF"; // ???
      } else {
        context.fillStyle = "#FFFFFF"; // white
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
  // Test if the snake ate a fruit.
  if (snake[0].x === fruit.x && snake[0].y === fruit.y) {
    // TODO: move fruit
    for (var i = 0; i < 5; i++) {
      snake.push(new Vector(snake[snake.length - 1].x, snake[snake.length - 1].y, 'none'));
    }
  }
  // Test if the snake hit a wall.
  if (snake[0].x < 0 || snake[0].y < 0 || snake[0].x >= GRID_SIZE || snake[0].y >= GRID_SIZE) {
    clearInterval(gameLoop);
    alert('GAME OVER!');
    return;
  }
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
