$(document).ready(function() {
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');
  for (var i = 1; i < 50; i++) {
    context.moveTo(0, i * 10);
    context.lineTo(500, i * 10);
    context.stroke();
    context.moveTo(i * 10, 0);
    context.lineTo(i * 10, 500);
    context.stroke();
  }
});
