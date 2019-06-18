var aiEnabled = false;
var numMovementsSinceFruit = 0;
var divea;
var evolAlg;

// AI can be moved.
function snakeAI() {
  // Default movements
  // if (snake[0].direction === 'none') return;
  if (snake[0].x < fruit.x) {
    if (snake[0].direction === 'up' || snake[0].direction === 'down') {
      directionQueue.push('right');
    } else if (snake[0].direction === 'left') {
      directionQueue.push('up');
    } else {
      directionQueue.push('right');
    }
  } else if (snake[0].x > fruit.x) {
    if (snake[0].direction === 'up' || snake[0].direction === 'down') {
      directionQueue.push('left');
    } else if (snake[0].direction === 'right') {
      directionQueue.push('up');
    } else {
      directionQueue.push('left');
    }
  } else if (snake[0].y < fruit.y) {
    if (snake[0].direction === 'left' || snake[0].direction === 'right') {
      directionQueue.push('down');
    } else if (snake[0].direction === 'up') {
      directionQueue.push('right');
    } else {
      directionQueue.push('down');
    }
  } else if (snake[0].y > fruit.y) {
    if (snake[0].direction === 'left' || snake[0].direction === 'right') {
      directionQueue.push('up');
    } else if (snake[0].direction === 'down') {
      directionQueue.push('right');
    } else {
      directionQueue.push('up');
    }
  }

  var count = 0;
  while (detectCollisonAI()) {
    if (directionQueue[0] === 'up') {
      directionQueue[0] = 'right';
    } else if (directionQueue[0] === 'right') {
      directionQueue[0] = 'down';
    } else if (directionQueue[0] === 'down') {
      directionQueue[0] = 'left';
    } else if (directionQueue[0] === 'left') {
      directionQueue[0] = 'up';
    }
    if (count++ > 5) break;
  }
}
function detectCollisonAI() {
  // Check for future collison
  var futurePosition;
  if (directionQueue[0] === 'up') {
    futurePosition = new Point(snake[0].x, snake[0].y - 1);
  } else if (directionQueue[0] === 'down') {
    futurePosition = new Point(snake[0].x, snake[0].y + 1);
  } else if (directionQueue[0] === 'left') {
    futurePosition = new Point(snake[0].x - 1, snake[0].y);
  } else if (directionQueue[0] === 'right') {
    futurePosition = new Point(snake[0].x + 1, snake[0].y);
  }
  //detect wall hit
  if (futurePosition.x < 0 || futurePosition.x >= 30 || futurePosition.y < 0 || futurePosition.y >= 30) {
    return true;
  }
  //detect self hit
  for (var i = 0; i < snake.length; i++) {
    if (futurePosition.x === snake[i].x && futurePosition.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

function enableDisableAI() {
  aiEnabled = !aiEnabled;
  reset();
}

function snakeAI2() {
  // feed input
  for (var x = 0; x < GRID_SIZE; x++) {
    for (var y = 0; y < GRID_SIZE; y++) {
      evolAlg.nN[evolAlg.species].inputs.elements[x * 30 + y][0] = -1; // fruit checker inputs
      evolAlg.nN[evolAlg.species].inputs.elements[30 * 30 + x * 30 + y][0] = -1; // snake checker inputs
    }
  }
  evolAlg.nN[evolAlg.species].inputs.elements[fruit.x * 30 + fruit.y][0] = 1;
  for (var i = 0; i < snake.length; i++) {
    evolAlg.nN[evolAlg.species].inputs.elements[30 * 30 + snake[i].x * 30 + snake[i].y][0] = 1;
  }
  // calculate outputs
  evolAlg.nN[evolAlg.species].calculateOutputs();
  // select direction
  var status = [
    {direction: 'right', val: evolAlg.nN[evolAlg.species].outputs.elements[0][0]},
    {direction: 'up', val: evolAlg.nN[evolAlg.species].outputs.elements[1][0]},
    {direction: 'down', val: evolAlg.nN[evolAlg.species].outputs.elements[2][0]},
    {direction: 'left', val: evolAlg.nN[evolAlg.species].outputs.elements[3][0]}
  ];
  status.sort(function(a, b) { return b.val - a.val; });
  if (snake[0].direction === 'right' && status[0].direction === 'left') {
    directionQueue.push(status[1].direction);
  } else if (snake[0].direction === 'left' && status[0].direction === 'right') {
    directionQueue.push(status[1].direction);
  } else if (snake[0].direction === 'up' && status[0].direction === 'down') {
    directionQueue.push(status[1].direction);
  } else if (snake[0].direction === 'down' && status[0].direction === 'up') {
    directionQueue.push(status[1].direction);
  } else {
   directionQueue.push(status[0].direction);
  }
}

function snakeAI3() {
  if (numMovementsSinceFruit++ > 500) reset();
  // Distance to fruit.
    // evolAlg.nN[evolAlg.species].inputs.elements[0][0] = Math.sqrt(Math.pow(snake[0].x - fruit.x, 2) + Math.pow(snake[0].y - fruit.y, 2));
  // Angle to fruit.
    // evolAlg.nN[evolAlg.species].inputs.elements[1][0] = Math.atan2(fruit.y - snake[0].y, fruit.x - snake[0].x);
  // 8 way obstacle detection.

  // TODO: seperate out border detection and body detection
  var count = 0;
  for (var x = -1; x <= 1; x++) {
    for (var y = -1; y <= 1; y++) {
      if (x !== 0 || y !== 0) {
        evolAlg.nN[evolAlg.species].inputs.elements[count][0] = detectWall(x, y);
        count++;
      }
    }
  }
  for (var x = -1; x <= 1; x++) {
    for (var y = -1; y <= 1; y++) {
      if (x !== 0 || y !== 0) {
        evolAlg.nN[evolAlg.species].inputs.elements[count][0] = detectBody(x, y);
        count++;
      }
    }
  }
  for (var x = -1; x <= 1; x++) {
    for (var y = -1; y <= 1; y++) {
      if (x !== 0 || y !== 0) {
        evolAlg.nN[evolAlg.species].inputs.elements[count][0] = detectFruit(x, y);
        count++;
      }
    }
  }
  // Current direction
    // evolAlg.nN[evolAlg.species].inputs.elements[10][0] = snake[0].direction === 'left' ? 1 : -1;
    // evolAlg.nN[evolAlg.species].inputs.elements[11][0] = snake[0].direction === 'right' ? 1 : -1;
    // evolAlg.nN[evolAlg.species].inputs.elements[12][0] = snake[0].direction === 'down' ? 1 : -1;
    // evolAlg.nN[evolAlg.species].inputs.elements[13][0] = snake[0].direction === 'up' ? 1 : -1;
  // calculate outputs
  evolAlg.nN[evolAlg.species].calculateOutputs();
  // sort outputs
  var status = [
    {direction: 'right', val: evolAlg.nN[evolAlg.species].outputs.elements[0][0]},
    {direction: 'up', val: evolAlg.nN[evolAlg.species].outputs.elements[1][0]},
    {direction: 'down', val: evolAlg.nN[evolAlg.species].outputs.elements[2][0]},
    {direction: 'left', val: evolAlg.nN[evolAlg.species].outputs.elements[3][0]}
  ];
  status.sort(function(a, b) { return b.val - a.val; });
  if (snake[0].direction === 'right' && status[0].direction === 'left') {
    directionQueue.push(status[1].direction);
  } else if (snake[0].direction === 'left' && status[0].direction === 'right') {
    directionQueue.push(status[1].direction);
  } else if (snake[0].direction === 'up' && status[0].direction === 'down') {
    directionQueue.push(status[1].direction);
  } else if (snake[0].direction === 'down' && status[0].direction === 'up') {
    directionQueue.push(status[1].direction);
  } else {
   directionQueue.push(status[0].direction);
  }
}

// enter -1, 0, or 1
function detectBody(horizontal, vertical) {
  var found = false;
  var xCount = 0;
  var yCount = 0;
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
  var xCount = 0;
  var yCount = 0;
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
  var xCount = 0;
  var yCount = 0;
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
