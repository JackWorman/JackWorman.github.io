var aiEnabled = true;
var numMovementsSinceFruit = 0;
var divea;
var evAlgor;

// AI can be moved.
function snakeAI() {
  // Default movements
  // if (snake[0].direction === 'none') return;
  if (snake[0].x < fruit.x) {
    if (snake[0].direction === 'up' || snake[0].direction === 'down') {
      nextDirectionQueue.push('right');
    } else if (snake[0].direction === 'left') {
      nextDirectionQueue.push('up');
    } else {
      nextDirectionQueue.push('right');
    }
  } else if (snake[0].x > fruit.x) {
    if (snake[0].direction === 'up' || snake[0].direction === 'down') {
      nextDirectionQueue.push('left');
    } else if (snake[0].direction === 'right') {
      nextDirectionQueue.push('up');
    } else {
      nextDirectionQueue.push('left');
    }
  } else if (snake[0].y < fruit.y) {
    if (snake[0].direction === 'left' || snake[0].direction === 'right') {
      nextDirectionQueue.push('down');
    } else if (snake[0].direction === 'up') {
      nextDirectionQueue.push('right');
    } else {
      nextDirectionQueue.push('down');
    }
  } else if (snake[0].y > fruit.y) {
    if (snake[0].direction === 'left' || snake[0].direction === 'right') {
      nextDirectionQueue.push('up');
    } else if (snake[0].direction === 'down') {
      nextDirectionQueue.push('right');
    } else {
      nextDirectionQueue.push('up');
    }
  }

  var count = 0;
  while (detectCollisonAI()) {
    if (nextDirectionQueue[0] === 'up') {
      nextDirectionQueue[0] = 'right';
    } else if (nextDirectionQueue[0] === 'right') {
      nextDirectionQueue[0] = 'down';
    } else if (nextDirectionQueue[0] === 'down') {
      nextDirectionQueue[0] = 'left';
    } else if (nextDirectionQueue[0] === 'left') {
      nextDirectionQueue[0] = 'up';
    }
    if (count++ > 5) break;
  }
}
function detectCollisonAI() {
  // Check for future collison
  var futurePosition;
  if (nextDirectionQueue[0] === 'up') {
    futurePosition = new Point(snake[0].x, snake[0].y - 1);
  } else if (nextDirectionQueue[0] === 'down') {
    futurePosition = new Point(snake[0].x, snake[0].y + 1);
  } else if (nextDirectionQueue[0] === 'left') {
    futurePosition = new Point(snake[0].x - 1, snake[0].y);
  } else if (nextDirectionQueue[0] === 'right') {
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
}

function snakeAI2() {
  if (numMovementsSinceFruit++ > 2000) reset();
  // feed input
  for (var x = 0; x < GRID_SIZE; x++) {
    for (var y = 0; y < GRID_SIZE; y++) {
      evAlgor.neuralNetworks[evAlgor.activeSpecies].inputs.elements[x * 30 + y][0] = 0; // fruit checker inputs
      evAlgor.neuralNetworks[evAlgor.activeSpecies].inputs.elements[30 * 30 + x * 30 + y][0] = 0; // snake checker inputs
    }
  }
  evAlgor.neuralNetworks[evAlgor.activeSpecies].inputs.elements[fruit.x * 30 + fruit.y][0] = 1;
  for (var i = 0; i < snake.length; i++) {
    evAlgor.neuralNetworks[evAlgor.activeSpecies].inputs.elements[30 * 30 + snake[i].x * 30 + snake[i].y][0] = 1;
  }
  // calculate outputs
  evAlgor.neuralNetworks[evAlgor.activeSpecies].calculateOutputs();
  // select direction
  var status = new Array();
  status.push({direction: 'right', val: evAlgor.neuralNetworks[evAlgor.activeSpecies].outputs.elements[0][0]});
  status.push({direction: 'up', val: evAlgor.neuralNetworks[evAlgor.activeSpecies].outputs.elements[1][0]});
  status.push({direction: 'down', val: evAlgor.neuralNetworks[evAlgor.activeSpecies].outputs.elements[2][0]});
  status.push({direction: 'left', val: evAlgor.neuralNetworks[evAlgor.activeSpecies].outputs.elements[3][0]});
  status.sort(function(a, b) { return b.val - a.val; });

  if (snake[0].direction === 'right' && status[0].direction === 'left') {
    nextDirectionQueue.push(status[1].direction);
  } else if (snake[0].direction === 'left' && status[0].direction === 'right') {
    nextDirectionQueue.push(status[1].direction);
  } else if (snake[0].direction === 'up' && status[0].direction === 'down') {
    nextDirectionQueue.push(status[1].direction);
  } else if (snake[0].direction === 'down' && status[0].direction === 'up') {
    nextDirectionQueue.push(status[1].direction);
  } else {
   nextDirectionQueue.push(status[0].direction);
  }
}
