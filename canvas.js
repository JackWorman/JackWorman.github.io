// Constants
const CANVAS_SIZE = 750;

// Globals

var board;
var nIntervId;

$(document).ready(function() {



  setUpCanvas();

  var board = new Array(50);
  for (var i = 0; i < 50; i++) {
    board[i] = new Array(50);
    for (var j = 0; j < 50; j++) {
      board[i][j] = 0;
    }
  }
  board[3][10] = 1;

  nIntervId = setInterval(test, 1000);
});

function setUpCanvas() {
  var canvas = document.getElementById('myCanvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  // Draws a grid onto the canvas.
  var context = canvas.getContext('2d');
  for (var i = 1; i < 50; i++) {
    var step = i * CANVAS_SIZE / 50;
    context.moveTo(0, step);
    context.lineTo(CANVAS_SIZE, step);
    context.stroke();
    context.moveTo(step, 0);
    context.lineTo(step, CANVAS_SIZE);
    context.stroke();
  }
}

function test() {
  var context = document.getElementById('myCanvas').getContext('2d');
  context.fillStyle = "#FF0000";
  for (var i = 0; i < 50; i++) {
    for (var j = 0; j < 50; j++) {
      if (board[i][j] === 1) {
        var xStart = i * CANVAS_SIZE / 50
        var yStart = j * CANVAS_SIZE / 50
        var xEnd = xStart + CANVAS_SIZE / 50 - 1;
        var yEnd = yStart + CANVAS_SIZE / 50 - 1
        context.fillRect(xStart, yStart, xEnd, yEnd);
      }
    }

  }
}




function stopTest() {
  clearInterval(nIntervId);
}
