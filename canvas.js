// Constants
const CANVAS_SIZE = 750;
const GRID_SIZE = 50;
// Globals

var board;
var nIntervId;
var canvas;
var context;

$(document).ready(function() {
  canvas = document.getElementById('myCanvas');
  context = canvas.getContext('2d');

  setUpCanvas();

  board = new Array(GRID_SIZE);
  for (var i = 0; i < GRID_SIZE; i++) {
    board[i] = new Array(GRID_SIZE);
    for (var j = 0; j < GRID_SIZE; j++) {
      board[i][j] = 0;
    }
  }

  nIntervId = setInterval(display, 10);
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

function display() {
  var x = Math.floor((Math.random() * GRID_SIZE));
  var y = Math.floor((Math.random() * GRID_SIZE));
  board[x][y] = 1;
  //var context = document.getElementById('myCanvas').getContext('2d');
  context.fillStyle = "#FF0000";
  for (var i = 0; i < GRID_SIZE; i++) {
    for (var j = 0; j < GRID_SIZE; j++) {
      if (board[i][j] === 1) {
        var xStart = i * CANVAS_SIZE / GRID_SIZE + 1;
        var yStart = j * CANVAS_SIZE / GRID_SIZE + 1;
        var xLength = CANVAS_SIZE / GRID_SIZE - 2;
        var yLength = CANVAS_SIZE / GRID_SIZE - 2;
        context.fillRect(xStart, yStart, xLength, yLength);
      }
    }
  }
}




function stopTest() {
  clearInterval(nIntervId);
}
