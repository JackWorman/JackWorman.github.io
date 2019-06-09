$(document).ready(function() {
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');
  for (var i = 1; i < 10; i++) {
    context.moveTo(0, i * 10);
    context.lineTo(1000, i * 10);
    context.stroke();
  }
});
