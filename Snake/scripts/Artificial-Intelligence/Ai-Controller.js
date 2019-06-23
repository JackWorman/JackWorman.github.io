var aiEnabled = true;
var divea;
var evolAlg;
var positions = [];

var canvasBrainsBackground;
var contextBrainsBackground;
var canvasBrainsBackground;
var contextBrainsBackground;

const BRAIN_CANVAS_SIZE = 600;
const NUM_INPUTS = 24;
const NUM_HIDDEN_LAYER = 8;
const NUM_OUTPUTS = 4;

function renderWeights() {
  contextBrainsForeground.fillStyle = BLACK;
  var max = Number.NEGATIVE_INFINITY;
  var min = 0;
  for (var row = 0; row < NUM_HIDDEN_LAYER; row++) {
    for (var col = 0; col < NUM_INPUTS; col++) {
      // if (evolAlg.nN[evolAlg.species].w1.elements[row][col] * evolAlg.nN[evolAlg.species].i.elements[col][0] < min) {
      //   min = evolAlg.nN[evolAlg.species].w1.elements[row][col];
      // }
      if (Math.abs(evolAlg.nN[evolAlg.species].w1.elements[row][col] * evolAlg.nN[evolAlg.species].i.elements[col][0]) > max) {
        max = evolAlg.nN[evolAlg.species].w1.elements[row][col];
      }
    }
  }

  for (var i = 1; i <= NUM_INPUTS; i++) {
    for (var j = 1; j <= NUM_HIDDEN_LAYER; j++) {
      var intensity = (Math.abs(evolAlg.nN[evolAlg.species].w1.elements[j-1][i-1] * evolAlg.nN[evolAlg.species].i.elements[i-1][0]) - min) / (max - min);
      contextBrainsForeground.strokeStyle = 'rgba(0,0,0,' + intensity + ')';
      contextBrainsForeground.beginPath();
      contextBrainsForeground.moveTo(BRAIN_CANVAS_SIZE/10, BRAIN_CANVAS_SIZE/(NUM_INPUTS*2 + 1)*i*2);
      contextBrainsForeground.lineTo(BRAIN_CANVAS_SIZE/2, BRAIN_CANVAS_SIZE/(NUM_HIDDEN_LAYER*2 + 1)*j*2);
      contextBrainsForeground.stroke();
    }
  }

  max = Number.NEGATIVE_INFINITY;
  min = 0;
  for (var row = 0; row < NUM_OUTPUTS; row++) {
    for (var col = 0; col < NUM_HIDDEN_LAYER; col++) {
      if (Math.abs(evolAlg.nN[evolAlg.species].w2.elements[row][col] * evolAlg.nN[evolAlg.species].hL.elements[col][0]) > max) {
        max = evolAlg.nN[evolAlg.species].w2.elements[row][col];
      }
    }
  }

  for (var i = 1; i <= NUM_HIDDEN_LAYER; i++) {
    for (var j = 1; j <= NUM_OUTPUTS; j++) {
      var intensity = (Math.abs(evolAlg.nN[evolAlg.species].w2.elements[j-1][i-1] * evolAlg.nN[evolAlg.species].hL.elements[i-1][0]) - min) / (max - min);
      contextBrainsForeground.strokeStyle = 'rgba(0,0,0,' + intensity + ')';
      contextBrainsForeground.beginPath();
      contextBrainsForeground.moveTo(BRAIN_CANVAS_SIZE/2, BRAIN_CANVAS_SIZE/(NUM_HIDDEN_LAYER*2 + 1)*i*2);
      contextBrainsForeground.lineTo(BRAIN_CANVAS_SIZE*9/10, BRAIN_CANVAS_SIZE/(NUM_OUTPUTS*2 + 1)*j*2);
      contextBrainsForeground.stroke();
    }
  }
}

function renderBrains() {
  contextBrainsForeground.fillStyle = 'rgb(0, 155, 155)';
  contextBrainsForeground.fillRect(0, 0, BRAIN_CANVAS_SIZE, BRAIN_CANVAS_SIZE);
  renderWeights();

  // Input layer
  for (var i = 1; i <= NUM_INPUTS; i++) {
    var intensity = (1 - evolAlg.nN[evolAlg.species].i.elements[i-1][0]) * 255;
    contextBrainsForeground.beginPath();
    contextBrainsForeground.arc(BRAIN_CANVAS_SIZE/10, BRAIN_CANVAS_SIZE/(NUM_INPUTS*2 + 1)*i*2, BRAIN_CANVAS_SIZE/(NUM_INPUTS*2 + 1)/2, 0, 2*Math.PI);
    contextBrainsForeground.strokeStyle = 'rgb(' + intensity + ', ' + intensity + ', ' + intensity + ')';
    contextBrainsForeground.stroke();
    contextBrainsForeground.fillStyle = 'rgb(' + intensity + ', ' + intensity + ', ' + intensity + ')';
    contextBrainsForeground.fill();
  }
  for (var i = 1; i <= NUM_HIDDEN_LAYER; i++) {
    var intensity = (1 - evolAlg.nN[evolAlg.species].hL.elements[i-1][0]) * 255;
    contextBrainsForeground.beginPath();
    contextBrainsForeground.arc(BRAIN_CANVAS_SIZE/2, BRAIN_CANVAS_SIZE/(NUM_HIDDEN_LAYER*2 + 1)*i*2, BRAIN_CANVAS_SIZE/(NUM_HIDDEN_LAYER*2 + 1)/2, 0, 2*Math.PI);
    contextBrainsForeground.strokeStyle = 'rgb(' + intensity + ', ' + intensity + ', ' + intensity + ')';
    contextBrainsForeground.stroke();
    contextBrainsForeground.fillStyle = 'rgb(' + intensity + ', ' + intensity + ', ' + intensity + ')';
    contextBrainsForeground.fill();
  }
  for (var i = 1; i <= NUM_OUTPUTS; i++) {
    var intensity = (1 - evolAlg.nN[evolAlg.species].o.elements[i-1][0]) * 255;
    contextBrainsForeground.beginPath();
    contextBrainsForeground.arc(BRAIN_CANVAS_SIZE*9/10, BRAIN_CANVAS_SIZE/(NUM_OUTPUTS*2 + 1)*i*2, BRAIN_CANVAS_SIZE/(NUM_OUTPUTS*2 + 1)/2, 0, 2*Math.PI);
    contextBrainsForeground.strokeStyle = 'rgb(' + intensity + ', ' + intensity + ', ' + intensity + ')';
    contextBrainsForeground.stroke();
    contextBrainsForeground.fillStyle = 'rgb(' + intensity + ', ' + intensity + ', ' + intensity + ')';
    contextBrainsForeground.fill();
  }
}

function enableDisableAI() {
  aiEnabled = !aiEnabled;
  reset();
}

function nextSpecies() {
  if (aiEnabled) {
    if (typeof evolAlg === 'undefined') { // Run the first time.
      evolAlg = new EvolutionaryAlgorithm(2000, 24, 8, 4);
      evolAlg.initializeAllNeuralNetworks();
    }
    nextGeneration();

    evolAlg.species++;
    divea.textContent = 'Generation: ' + evolAlg.gen + ', Species: ' + evolAlg.species + '/2000';
    positions = [];
  }
}

function nextGeneration() {
  if (evolAlg.species === evolAlg.nN.length - 1) {
    evolAlg.sort();
    console.log('=================================');
    console.log('Best of generation ' + evolAlg.gen + ': ' + evolAlg.nN[0].fitness);
    var sum = 0;
    for (var i = 0; i < evolAlg.nN.length; i++) {
      sum += evolAlg.nN[i].fitness;
      evolAlg.nN[i].fitness = 0;
    }
    console.log('Average of generation ' + evolAlg.gen + ': ' + Math.floor(sum / evolAlg.nN.length));
    evolAlg.mutate();
    evolAlg.gen++;
    evolAlg.species = -1;
  }
}

function snakeAI3() {
  checkRepeat();
  evolAlg.nN[evolAlg.species].fitness++;
  // 8 way detection.
  var count = 0;
  for (var x = -1; x <= 1; x++) {
    for (var y = -1; y <= 1; y++) {
      if (x !== 0 || y !== 0) {
        evolAlg.nN[evolAlg.species].i.elements[count++][0] = detectWall(x, y);
        evolAlg.nN[evolAlg.species].i.elements[count++][0] = detectBody(x, y);
        evolAlg.nN[evolAlg.species].i.elements[count++][0] = detectFruit(x, y);
      }
    }
  }
  // Calculate and sort o.
  evolAlg.nN[evolAlg.species].calculateOutputs();
  var status = [
    {direction: 'right', val: evolAlg.nN[evolAlg.species].o.elements[0][0]},
    {direction: 'up',    val: evolAlg.nN[evolAlg.species].o.elements[1][0]},
    {direction: 'down',  val: evolAlg.nN[evolAlg.species].o.elements[2][0]},
    {direction: 'left',  val: evolAlg.nN[evolAlg.species].o.elements[3][0]}
  ];
  status.sort(function(a, b) { return b.val - a.val; });
  // TODO: make it check for valid movements in moveSnake()
  if (snake[0].direction === 'right' && status[0].direction === 'left') {
    snake[0].direction = status[1].direction;
  } else if (snake[0].direction === 'left' && status[0].direction === 'right') {
    snake[0].direction = status[1].direction;
  } else if (snake[0].direction === 'up' && status[0].direction === 'down') {
    snake[0].direction = status[1].direction;
  } else if (snake[0].direction === 'down' && status[0].direction === 'up') {
    snake[0].direction = status[1].direction;
  } else {
    snake[0].direction = status[0].direction;
  }

  renderBrains();
}

// enter -1, 0, or 1
function detectBody(horizontal, vertical) {
  var found = false;
  var count = 0;
  while (!found) {
    count++;
    var testPoint = new Point(snake[0].x + count * horizontal, snake[0].y + count * vertical);
    // Check for wall.
    if (testPoint.x < 0 || testPoint.x >= 30 || testPoint.y < 0 || testPoint.y >= 30) {
      count = GRID_SIZE;
      found = true;
    }
    // Check for snake body.
    for (var i = 0; i < snake.length; i++) {
      if (testPoint.x === snake[i].x && testPoint.y === snake[i].y) {
        found = true;
      }
    }
  }
  return 1 - count / GRID_SIZE;
}

function detectWall(horizontal, vertical) {
  var found = false;
  var count = 0;
  while (!found) {
    count++;
    var testPoint = new Point(snake[0].x + count * horizontal, snake[0].y + count * vertical);
    // Check for wall.
    if (testPoint.x < 0 || testPoint.x >= 30 || testPoint.y < 0 || testPoint.y >= 30) {
      found = true;
    }
  }
  return 1 - count / GRID_SIZE;
}

function detectFruit(horizontal, vertical) {
  var found = false;
  var count = 0;
  while (!found) {
    count++;
    var testPoint = new Point(snake[0].x + count * horizontal, snake[0].y + count * vertical);
    // Check for wall.
    if (testPoint.x < 0 || testPoint.x >= 30 || testPoint.y < 0 || testPoint.y >= 30) {
      count = GRID_SIZE;
      found = true;
    }
    // Check for fruit.
    if (testPoint.x === fruit.x && testPoint.y === fruit.y) {
      found = true;
    }
  }
  return 1 - count / GRID_SIZE;
}

class PositionTracker {
  constructor(fruit, snake) {
    this.fruit = fruit;
    this.snake = snake;
  }
}

function checkRepeat() {
  // Add position to tracker.
  var snakeCopy = [];
  for (var i = 0; i < snake.length; i++) {
    snakeCopy.push(new Point(snake[i].x, snake[i].y));
  }
  var fruitCopy = new Point(fruit.x, fruit.y);
  positions.push(new PositionTracker(fruitCopy, snakeCopy));
  // check if this position has occured before
  for (var i = 0; i < positions.length - 1; i++) {
    if (fruit.x !== positions[i].fruit.x || fruit.y !== positions[i].fruit.y) {
      continue;
    }
    if (snake.length !== positions[i].snake.length) {
      continue;
    }
    var isSnakeSame = true;
    for (var j = 0; j < snake.length; j++) {
      if (snake[j].x !== positions[i].snake[j].x || snake[j].y !== positions[i].snake[j].y) {
        isSnakeSame = false;
        break;
      }
    }
    if (!isSnakeSame) continue;
    // It has repeated if it gets here.
    reset();
  }
}
