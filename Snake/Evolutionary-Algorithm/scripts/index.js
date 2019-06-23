const CANVAS_SIZE = 600;
const GRID_SIZE = 30;

document.addEventListener("DOMContentLoaded", function() {
  if (CANVAS_SIZE / GRID_SIZE !== Math.round(CANVAS_SIZE / GRID_SIZE)) {
    alert('CANVAS_SIZE / GRID_SIZE is not a whole number. The canvas might render incorrectly.');
  }

  // canvasBrainsBackground = document.getElementById('brainsBackground')
  // contextBrainsBackground = canvasBrainsBackground.getContext('2d');
  // canvasBrainsForeground = document.getElementById('brainsForeground')
  // contextBrainsForeground = canvasBrainsForeground.getContext('2d');

  // canvasBrainsBackground.width = BRAIN_CANVAS_SIZE;
  // canvasBrainsBackground.height = BRAIN_CANVAS_SIZE;
  // canvasBrainsForeground.width = BRAIN_CANVAS_SIZE;
  // canvasBrainsForeground.height = BRAIN_CANVAS_SIZE;
});
