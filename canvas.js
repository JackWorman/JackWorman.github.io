// Constants
const CANVAS_SIZE = 750;
const GRID_SIZE = 50;
const REFRESH_RATE = 10; // time in milliseconds

// Globals
var board;
var nIntervId;
var canvas;
var context;

var direction = 0; // 0 = none, 1 = right, 2 = up, 3 = left, 4 = down
var xCoord = GRID_SIZE / 2;
var yCoord = GRID_SIZE / 2;

$(document).ready(function() {
  canvas = document.getElementById('myCanvas');
  context = canvas.getContext('2d');
  setUpCanvas();
  setUpBoard();

  nIntervId = setInterval(display, REFRESH_RATE);
  document.addEventListener('keydown', function(event) {
    if (event.keyCode == 37) { // Left Arrow
      direction = 3;
    } else if (event.keyCode == 38) { // Up Arrow
      direction = 2;
    } else if (event.keyCode == 39) { // Right Arrow
      direction = 1;
    } else if (event.keyCode == 40) { // Down Arrow
      direction = 4;
    }
  }, true);
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

function display() {
  if (direction === 1) {
    board[xCoord][yCoord] = 0;
    xCoord++;
  } else if (direction === 2) {
    board[xCoord][yCoord] = 0;
    yCoord--;
  } else if (direction === 3) {
    board[xCoord][yCoord] = 0;
    xCoord--;
  } else if (direction === 4) {
    board[xCoord][yCoord] = 0;
    yCoord++;
  }
  board[xCoord][yCoord] = 1;

  for (var i = 0; i < GRID_SIZE; i++) {
    for (var j = 0; j < GRID_SIZE; j++) {
      if (board[i][j] === 1) {
        context.fillStyle = "#FF0000"; // red
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

function stopDisplay() {
  clearInterval(nIntervId);
}
