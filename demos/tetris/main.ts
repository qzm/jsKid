/**
 * 俄罗斯方块游戏
 */

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const BLOCK_SIZE = 30;
const COLS = 10;
const ROWS = 20;
const CANVAS_WIDTH = COLS * BLOCK_SIZE;
const CANVAS_HEIGHT = ROWS * BLOCK_SIZE;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// 方块形状定义
const SHAPES = [
  [[1,1,1,1]], // I
  [[1,1],[1,1]], // O
  [[1,1,1],[0,1,0]], // T
  [[1,1,1],[1,0,0]], // L
  [[1,1,1],[0,0,1]], // J
  [[1,1,0],[0,1,1]], // S
  [[0,1,1],[1,1,0]]  // Z
];

const COLORS = ['#00f0f0', '#f0f000', '#a000f0', '#f0a000', '#0000f0', '#00f000', '#f00000'];

interface Piece {
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

let board: number[][] = [];
let currentPiece: Piece | null = null;
let nextPiece: Piece | null = null;
let score = 0;
let lines = 0;
let level = 1;
let gameRunning = false;
let dropTime = 0;
let dropInterval = 1000;

function createBoard(): void {
  board = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));
}

function createPiece(): Piece {
  const index = Math.floor(Math.random() * SHAPES.length);
  return {
    shape: SHAPES[index],
    color: COLORS[index],
    x: Math.floor(COLS / 2) - Math.floor(SHAPES[index][0].length / 2),
    y: 0
  };
}

function drawBlock(x: number, y: number, color: string): void {
  ctx.fillStyle = color;
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard(): void {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (board[y][x]) {
        drawBlock(x, y, COLORS[board[y][x] - 1]);
      }
    }
  }
}

function drawPiece(piece: Piece): void {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        drawBlock(piece.x + x, piece.y + y, piece.color);
      }
    });
  });
}

function collide(piece: Piece): boolean {
  return piece.shape.some((row, dy) => {
    return row.some((value, dx) => {
      if (!value) return false;
      const x = piece.x + dx;
      const y = piece.y + dy;
      return x < 0 || x >= COLS || y >= ROWS || (y >= 0 && board[y][x]);
    });
  });
}

function merge(): void {
  currentPiece!.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        board[currentPiece!.y + y][currentPiece!.x + x] = COLORS.indexOf(currentPiece!.color) + 1;
      }
    });
  });
}

function clearLines(): void {
  let linesCleared = 0;
  for (let y = ROWS - 1; y >= 0; y--) {
    if (board[y].every(cell => cell !== 0)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(0));
      linesCleared++;
      y++;
    }
  }
  if (linesCleared > 0) {
    lines += linesCleared;
    score += [0, 100, 300, 500, 800][linesCleared] * level;
    level = Math.floor(lines / 10) + 1;
    dropInterval = Math.max(100, 1000 - (level - 1) * 100);
    updateUI();
  }
}

function rotate(piece: Piece): number[][] {
  const newShape = piece.shape[0].map((_, i) =>
    piece.shape.map(row => row[i]).reverse()
  );
  return newShape;
}

function move(dx: number): void {
  if (!currentPiece) return;
  currentPiece.x += dx;
  if (collide(currentPiece)) {
    currentPiece.x -= dx;
  }
}

function drop(): void {
  if (!currentPiece) return;
  currentPiece.y++;
  if (collide(currentPiece)) {
    currentPiece.y--;
    merge();
    clearLines();
    currentPiece = nextPiece;
    nextPiece = createPiece();
    if (collide(currentPiece!)) {
      gameOver();
    }
  }
}

function hardDrop(): void {
  if (!currentPiece) return;
  while (!collide(currentPiece)) {
    currentPiece.y++;
  }
  currentPiece.y--;
  drop();
}

function rotatePiece(): void {
  if (!currentPiece) return;
  const originalShape = currentPiece.shape;
  currentPiece.shape = rotate(currentPiece);
  if (collide(currentPiece)) {
    currentPiece.shape = originalShape;
  }
}

function render(): void {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawBoard();
  if (currentPiece) {
    drawPiece(currentPiece);
  }
}

function update(time: number): void {
  if (!gameRunning) return;

  const deltaTime = time - dropTime;
  if (deltaTime > dropInterval) {
    drop();
    dropTime = time;
  }
}

function gameLoop(time: number): void {
  update(time);
  render();
  requestAnimationFrame(gameLoop);
}

function gameOver(): void {
  gameRunning = false;
  document.getElementById('game-over')!.classList.add('active');
  document.getElementById('final-score')!.textContent = score.toString();
}

function startGame(): void {
  createBoard();
  currentPiece = createPiece();
  nextPiece = createPiece();
  score = 0;
  lines = 0;
  level = 1;
  dropInterval = 1000;
  gameRunning = true;
  dropTime = performance.now();
  document.getElementById('game-over')!.classList.remove('active');
  updateUI();
}

function updateUI(): void {
  document.getElementById('score')!.textContent = score.toString();
  document.getElementById('lines')!.textContent = lines.toString();
  document.getElementById('level')!.textContent = level.toString();
}

document.addEventListener('keydown', (e) => {
  if (!gameRunning) {
    if (e.code === 'Space') {
      e.preventDefault();
      startGame();
    }
    return;
  }

  switch (e.code) {
    case 'ArrowLeft': move(-1); break;
    case 'ArrowRight': move(1); break;
    case 'ArrowDown': drop(); break;
    case 'ArrowUp': case 'KeyX': rotatePiece(); break;
    case 'Space': hardDrop(); break;
  }
  render();
});

document.getElementById('restart-btn')?.addEventListener('click', startGame);

render();
console.log('🧩 俄罗斯方块加载完成！');
