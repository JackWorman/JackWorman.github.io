const CANVAS_SIZE = 600;
const GRID_SIZE = 30;

document.addEventListener("DOMContentLoaded", function() {
  if (CANVAS_SIZE / GRID_SIZE !== Math.round(CANVAS_SIZE / GRID_SIZE)) {
    alert('CANVAS_SIZE / GRID_SIZE is not a whole number. The canvas might render incorrectly.');
  }

  canvasBoardBackground = document.getElementById('brainsBackground')
  contextBrainsBackground = canvasBrainsBackground.getContext('2d');
  canvasBrainsForeground = document.getElementById('brainsForeground')
  contextBrainsForeground = canvasBrainsForeground.getContext('2d');

  canvasBrainsBackground.width = CANVAS_SIZE;
  canvasBrainsBackground.height = CANVAS_SIZE;
  canvasBrainsForeground.width = CANVAS_SIZE;
  canvasBrainsForeground.height = CANVAS_SIZE;
});
