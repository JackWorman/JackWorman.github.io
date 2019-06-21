var aiEnabled = true;
var divea;
var evolAlg;
var positions = [];

function enableDisableAI() {
  aiEnabled = !aiEnabled;
  reset();
}

function nextSpecies() {
  if (aiEnabled) {
    if (typeof evolAlg === 'undefined') { // Run the first time.
      evolAlg = new EvolutionaryAlgorithm(2000, 24, Math.ceil(Math.sqrt(Math.pow(24, 2) + Math.pow(4, 2))), 4);
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
    var sum = 0;
    for (var i = 0; i < evolAlg.nN.length; i++) {
      sum += evolAlg.nN[i].fitness;
    }
    console.log('=================================');
    console.log('Best of generation ' + evolAlg.gen + ': ' + evolAlg.nN[0].fitness);
    console.log('Average of generation ' + evolAlg.gen + ': ' + Math.floor(sum / evolAlg.nN.length));
    evolAlg.mutate();
    evolAlg.gen++;
    evolAlg.species = -1;
  }
}

function aiGameLoop() {
    snakeAI3();
    moveSnake();
    detectCollison();
    detectFruitEaten();
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
  return GRID_SIZE - count;
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
  return GRID_SIZE - count;
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
  return GRID_SIZE - count;
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
