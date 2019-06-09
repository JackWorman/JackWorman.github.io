var CANVAS_SIZE = 750;

$(document).ready(function() {
  var canvas = document.getElementById('myCanvas');
  canvas.style.width = CANVAS_SIZE;
  canvas.style.height = CANVAS_SIZE;
  var context = canvas.getContext('2d');
  for (var i = 1; i < 50; i++) {
    context.moveTo(0, i * CANVAS_SIZE / 50);
    context.lineTo(CANVAS_SIZE, i * CANVAS_SIZE / 50);
    context.stroke();
    context.moveTo(i * CANVAS_SIZE / 50, 0);
    context.lineTo(i * CANVAS_SIZE / 50, CANVAS_SIZE);
    context.stroke();
  }
});
