// Constants
const CANVAS_SIZE = 750;

// Globals

var board;
var nIntervId;
var canvas;
var context;

$(document).ready(function() {
  canvas = document.getElementById('myCanvas');
  context = canvas.getContext('2d');

  setUpCanvas();

  board = new Array(50);
  for (var i = 0; i < 50; i++) {
    board[i] = new Array(50);
    for (var j = 0; j < 50; j++) {
      board[i][j] = 0;
    }
  }

  nIntervId = setInterval(display, 10);
});

function setUpCanvas() {
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  // Draws a grid onto the canvas.
  for (var i = 0; i <= 50; i++) {
    var step = i * CANVAS_SIZE / 50;
    context.moveTo(0, step);
    context.lineTo(CANVAS_SIZE, step);
    context.stroke();
    context.moveTo(step, 0);
    context.lineTo(step, CANVAS_SIZE);
    context.stroke();
  }
}

function display() {
  var x = Math.floor((Math.random() * 50));
  var y = Math.floor((Math.random() * 50));
  board[x][y] = 1;
  //var context = document.getElementById('myCanvas').getContext('2d');
  context.fillStyle = "#FF0000";
  for (var i = 0; i < 50; i++) {
    for (var j = 0; j < 50; j++) {
      if (board[i][j] === 1) {
        var xStart = i * CANVAS_SIZE / 50 + 1;
        var yStart = j * CANVAS_SIZE / 50 + 1;
        var xLength = CANVAS_SIZE / 50 - 2;
        var yLength = CANVAS_SIZE / 50 - 2;
        context.fillRect(xStart, yStart, xLength, yLength);
      }
    }
  }
}




function stopTest() {
  clearInterval(nIntervId);
}
