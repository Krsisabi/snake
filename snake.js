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
      const position = i + '_' + j;
      canvas.appendChild(pixel);
      pixels.set(position, pixel);
    }
  }
}

initializeCanvas()

const currentSnake = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4]
]

drawSnake(currentSnake)


function drawSnake(snake) {
  const snakePositions = new Set();
  for (let [top, left] of snake) {
    const position = top + '_' + left;
    snakePositions.add(position);
  }

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const position = i + '_' + j;
      const pixel = pixels.get(position);
      pixel.style.background = snakePositions.has(position) ?
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

window.addEventListener('keydown', (e) => {
  const direction = keyCodes[e.code]
  if (direction && currentDirection !== getOppositeDirection(direction)) {
    currentDirection = direction;
  }
});

function step() {
  currentSnake.shift();
  const head = currentSnake.at(-1);
  const nextHead = currentDirection(head);
  currentSnake.push(nextHead);
  drawSnake(currentSnake);
}

setInterval(() => {
  step()
}, 100);

function getOppositeDirection(direction) {
  switch (direction) {
    case moveRight:
      return moveLeft;
      break;
    case moveDown:
      return moveUp;
      break;
    case moveLeft:
      return moveRight;
      break;
    case moveRight:
      return moveLeft;
      break;
    default:
      return null;
      break;
  }
}