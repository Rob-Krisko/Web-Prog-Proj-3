// this is the code for the popup

const buttonOpen = document.querySelectorAll("[data-model-target]");
const closeButton = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

buttonOpen.forEach((button) => {
  button.addEventListener("click", () => {
    const model = document.querySelector(button.dataset.modelTarget);
    openmodel(model);
  });
});

overlay.addEventListener("click", () => {
  const models = document.querySelectorAll(".model.active");
  models.forEach((model) => {
    closemodel(model);
  });
});

closeButton.forEach((button) => {
  button.addEventListener("click", () => {
    const model = button.closest(".model");
    closemodel(model);
  });
});

function openmodel(model) {
  if (model == null) return;
  model.classList.add("active");
  overlay.classList.add("active");
}

function closemodel(model) {
  if (model == null) return;
  model.classList.remove("active");
  overlay.classList.remove("active");
}
// this is the code for the popup




const padding = 15;
const cellSize = 15;
const gridWidth = Math.floor((window.innerWidth - padding * 2) / cellSize);
const gridHeight = Math.floor((window.innerHeight - padding * 2) / cellSize);

let grid = createGrid(gridWidth, gridHeight);
let intervalId = null;
let intervalSpeed = 100;

const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const nextBtn = document.getElementById('next-gen-btn');
const next23Btn = document.getElementById('next-23-gen-btn');
const populatePercentageInput = document.getElementById('populate-percentage');
const speedInput = document.getElementById('speed-input');

function createGrid(width, height) {
  return new Array(height).fill(null).map(() => new Array(width).fill(0));
}

function populateGridRandomly(grid, percentage) {
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      grid[y][x] = Math.random() < percentage / 100 ? 1 : 0;
    }
  }
}

function nextGeneration(grid) {
  const newGrid = createGrid(gridWidth, gridHeight);

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const aliveNeighbors = countAliveNeighbors(grid, x, y);
      const isAlive = grid[y][x] === 1;

      if (isAlive && (aliveNeighbors === 2 || aliveNeighbors === 3)) {
        newGrid[y][x] = 1;
      } else if (!isAlive && aliveNeighbors === 3) {
        newGrid[y][x] = 1;
      }
    }
  }

  return newGrid;
}

function countAliveNeighbors(grid, x, y) {
  let count = 0;

  for (let yOffset = -1; yOffset <= 1; yOffset++) {
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      if (xOffset === 0 && yOffset === 0) {
        continue;
      }

      const xPos = x + xOffset;
      const yPos = y + yOffset;

      if (xPos >= 0 && xPos < gridWidth && yPos >= 0 && yPos < gridHeight && grid[yPos][xPos] === 1) {
        count++;
      }
    }
  }

  return count;
}

function renderGrid(grid) {
  const canvas = document.getElementById('game-canvas');

  canvas.width = gridWidth * cellSize;
  canvas.height = gridHeight * cellSize;
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--grid-color');
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (grid[y][x]) {
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--cell-color');
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

function update() {
  grid = nextGeneration(grid);
  renderGrid(grid);
}

function runGame() {
  if (intervalId === null) {
    intervalId = setInterval(update, intervalSpeed);
  }
}

function pauseGame() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function toggleGame() {
  if (intervalId === null) {
    runGame();
    startBtn.innerText = "Pause";
  } else {
    pauseGame();
    startBtn.innerText = "Start";
  }
}
//Calculate the next generation then "draw" the grid
function nextGen(){
  if (intervalId == null){
    update();
  } else{
    pauseGame();
    update();
    startBtn.innerText = "Start";
  }
}

//Calculate the next 23 generations then "draw" the grid
function next23Gen(){
  if (intervalId !== null){
    pauseGame();
  }
  for (let i = 0; i < 23; i++){
    grid = nextGeneration(grid);
  }
  renderGrid(grid);
  startBtn.innerText = "Start";
}

function resetGame() {
  pauseGame();
  percentage = populatePercentageInput.value;
  grid = createGrid(gridWidth, gridHeight);
  populateGridRandomly(grid,percentage);
  renderGrid(grid);
  startBtn.innerText = "Start";
}

function onPopulatePercentageChange(e) {
  const percentage = e.target.value;
  populateGridRandomly(grid, percentage);
  renderGrid(grid);
}

function onSpeedChange(e) {
  const speed = e.target.value;
  intervalSpeed = 1000 - speed;
  if (intervalId !== null) {
    pauseGame();
    runGame();
  }
}

const canvas = document.getElementById('game-canvas');
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);

  grid[y][x] = grid[y][x] ? 0 : 1;
  renderGrid(grid);
});

populateGridRandomly(grid, 30);
renderGrid(grid);



resetBtn.addEventListener('click', resetGame);
startBtn.addEventListener('click', toggleGame);
nextBtn.addEventListener('click', nextGen);
next23Btn.addEventListener('click', next23Gen);
populatePercentageInput.addEventListener('input', onPopulatePercentageChange);
speedInput.addEventListener('input', onSpeedChange);

// Menu toggle
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});

// Color picker logic
const cellColorPicker = document.getElementById('cell-color-picker');
const cellColorOptions = document.querySelectorAll('.cell-color-option');

cellColorPicker.addEventListener('click', () => {
  cellColorOptions.forEach((option) => {
    option.style.display = option.style.display === 'none' ? 'block' : 'none';
  });
});

cellColorOptions.forEach((option) => {
  option.addEventListener('click', () => {
    const color = option.dataset.color;
    document.documentElement.style.setProperty('--cell-color', color);
    cellColorOptions.forEach((option) => {
      option.style.display = 'none';
    });
  });
});

const bgColorPicker = document.getElementById('bg-color-picker');
const bgColorOptions = document.querySelectorAll('.bg-color-option');

bgColorPicker.addEventListener('click', () => {
  bgColorOptions.forEach((option) => {
    option.style.display = option.style.display === 'none' ? 'block' : 'none';
  });
});

bgColorOptions.forEach((option) => {
  option.addEventListener('click', () => {
    const color = option.dataset.color;
    document.documentElement.style.setProperty('--bg-color', color);
    bgColorOptions.forEach((option) => {
      option.style.display = 'none';
    });
  });
});
