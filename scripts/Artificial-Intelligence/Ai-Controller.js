var aiEnabled = false;
var numMovementsSinceFruit = 0;
var divea;
var evolAlg;

function enableDisableAI() {
  aiEnabled = !aiEnabled;
  reset();
}

function snakeAI3() {
  if (numMovementsSinceFruit++ > 500) reset();
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
    {direction: 'up', val: evolAlg.nN[evolAlg.species].o.elements[1][0]},
    {direction: 'down', val: evolAlg.nN[evolAlg.species].o.elements[2][0]},
    {direction: 'left', val: evolAlg.nN[evolAlg.species].o.elements[3][0]}
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
