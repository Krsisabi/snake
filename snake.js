const canvas = document.getElementById('canvas');

const ROWS = 30;
const COLS = 50;
const PIXEL = 10;

const pixels = new Map();

function initializeCanvas() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let pixel = document.createElement('div');
      pixel.style.position = 'absolute';
      pixel.style.border = '1px solid #aaa';
      pixel.style.left = j * PIXEL + 'px';
      pixel.style.top = i * PIXEL + 'px';
      pixel.style.width = PIXEL + 'px';
      pixel.style.height = PIXEL + 'px';
      const posKey = toKey([i, j]);
      canvas.appendChild(pixel);
      pixels.set(posKey, pixel);
    }
  }
}

initializeCanvas();

const currentSnake = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4]
]

let snakePositions = getPositionsSet(currentSnake);

drawSnake();

function drawSnake() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const key = toKey([i, j]);
      const pixel = pixels.get(key);
      pixel.style.background = snakePositions.has(key) ?
        'black' :
        'white';
    }
  }
}

const moveRight = ([t, l]) => [t, l + 1];
const moveLeft = ([t, l]) => [t, l - 1];
const moveUp = ([t, l]) => [t - 1, l];
const moveDown = ([t, l]) => [t + 1, l];
let currentDirection = moveRight;

const keyCodes = {
  'KeyW': moveUp,
  'KeyA': moveLeft,
  'KeyS': moveDown,
  'KeyD': moveRight,
  'ArrowUp': moveUp,
  'ArrowLeft': moveLeft,
  'ArrowRight': moveRight,
  'ArrowDown': moveDown
};

const directionQueue = [];

window.addEventListener('keydown', (e) => {
  const direction = keyCodes[e.code];
  if (direction && directionQueue.length <= 3) directionQueue.push(direction);
});

function step() {
  currentSnake.shift();
  const head = currentSnake.at(-1);

  while (directionQueue.length > 0) {
    const candidateDirection = directionQueue.shift();
    if (!areOpposite(currentDirection, candidateDirection)) currentDirection = candidateDirection;
    break;
  }

  const nextHead = currentDirection(head);

  if (!isValidHead(snakePositions, nextHead)) {
    stopGame();
    return;
  }

  currentSnake.push(nextHead);
  snakePositions = getPositionsSet(currentSnake);
  drawSnake(currentSnake);
}

const stepIntervalId = setInterval(() => {
  step();
}, 100);

function getPositionsSet(snake) {
  const set = new Set();
  for (let cell of snake) {
    const key = toKey(cell);
    set.add(key);
  }
  return set;
}

function getOppositeDirection(direction) {
  switch (direction) {
    case moveRight:
      return moveLeft;
    case moveDown:
      return moveUp;
    case moveLeft:
      return moveRight;
    case moveUp:
      return moveDown;
    default:
      console.error('no such direction');
      return null;
  }
}

const areOpposite = (currentDirection, nextDirection) => currentDirection === getOppositeDirection(nextDirection);

const isValidHead = (snakePositions, [t, l]) => !(t < 0 || l < 0 || t >= ROWS || l >= COLS || snakePositions.has(toKey([t, l])));

const stopGame = () => {
  canvas.style.border = '5px solid red';
  clearInterval(stepIntervalId);
}

function toKey([t, l]) {
  return t + '_' + l;
}

function bump(obj) {
  let debug = document.getElementById('debug');
  if (!debug) {
    debug = document.createElement('div');
    debug.id = 'debug';
    debug.style.cssText = 'color: red; font-size: 30px;';
    document.body.appendChild(debug);
  }

  switch (true) {
    case obj === null:
    case obj === undefined:
      debug.textContent = 'Object is null or undefined';
      break;
    case Array.isArray(obj) && obj.every(item => typeof item === 'function'):
      debug.textContent = obj.reduce((acc, { name }) => acc + name + ', ', '');
      break;
    default:
      debug.textContent = JSON.stringify(obj);
      break;
  }
}
