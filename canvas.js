// Constants
const CANVAS_SIZE = 750;
const GRID_SIZE = 50;
const REFRESH_RATE = 250; // time in milliseconds

// Globals
var board;
var nIntervId;
var canvas;
var context;

var direction = 'none';
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
      direction = 'left';
    } else if (event.keyCode == 38) { // Up Arrow
      direction = 'up';
    } else if (event.keyCode == 39) { // Right Arrow
      direction = 'right';
    } else if (event.keyCode == 40) { // Down Arrow
      direction = 'down';
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
  if (direction === 'right') {
    board[xCoord][yCoord] = 0;
    xCoord++;
  } else if (direction === 'up') {
    board[xCoord][yCoord] = 0;
    yCoord--;
  } else if (direction === 'left') {
    board[xCoord][yCoord] = 0;
    xCoord--;
  } else if (direction === 'down') {
    board[xCoord][yCoord] = 0;
    yCoord++;
  }
  if (xCoord < 0 || yCoord < 0 || xCoord >= GRID_SIZE || yCoord >= GRID_SIZE) {
    stopDisplay();
    alert('GAME OVER!');
    return;
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
