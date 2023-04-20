const buttonOpen = document.querySelector("#open-popup");
const closeButton = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");
const minCellSize = 5;
const maxCellSize = 50;
let cursorPosition = { x: 0, y: 0 };

// part of troubleshooting, will likely end up removed
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

window.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');
  const nextBtn = document.getElementById('next-btn');
  const next23GenBtn = document.getElementById('next23-btn');
  const speedInput = document.getElementById('speed-input');
  const populatePercentageInput = document.getElementById('populate-percentage-input');
  const cellColorPicker = document.getElementById('cell-color-picker');
  const gridColorPicker = document.getElementById('grid-color-picker');
  const backgroundColorPicker = document.getElementById('background-color-picker');
  const openPopupBtn = document.getElementById('open-popup');
  const closeModalBtn = document.querySelector('[data-close-button]');
  if (buttonOpen) {
    const model = document.querySelector(buttonOpen.dataset.modalTarget);
    openmodel(model);
  }
  const cellSizeSlider = document.getElementById('cell-size-slider');

  let isResizing = false;
  let startX;
  let startY;

  if (buttonOpen) {
    const model = document.querySelector(buttonOpen.dataset.modalTarget);
    openModal();
  }
  

  if (overlay) {
    overlay.addEventListener("click", () => {
      const models = document.querySelectorAll(".model.active");
      models.forEach((model) => {
        closemodel(model);
      });
    });
  }

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

  const gameCanvas = document.getElementById('game-of-life-canvas');
  const gameCtx = gameCanvas.getContext('2d');
  let cellSize = 15;
  let grid = [];
  let intervalId = null;
  let intervalSpeed = 100;
  let cellColor = '#000000';
  let gridColor = '#333333';
  let backgroundColor = '#f0f0f0';

  function toggleCellState(event) {
    const x = Math.floor(event.offsetX / cellSize);
    const y = Math.floor(event.offsetY / cellSize);
  
    if (selectedShape) {
      for (let i = 0; i < selectedShape.length; i++) {
        for (let j = 0; j < selectedShape[i].length; j++) {
          if (y + i < grid.length && x + j < grid[y + i].length) {
            grid[y + i][x + j] = selectedShape[i][j];
          }
        }
      }
      selectedShape = null;
    } else {
      grid[y][x] = grid[y][x] === 1 ? 0 : 1;
    }
  
    drawGrid(grid);
  }
  

  function drawGrid(grid) {
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;
  
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameCtx.fillStyle = backgroundColor;
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (grid[y][x] === 1) {
          gameCtx.fillStyle = cellColor;
          gameCtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
  
    // Draw the selected shape's outline
    if (selectedShape) {
      gameCtx.strokeStyle = 'red';
      const shapeX = Math.floor(cursorPosition.x / cellSize) * cellSize;
      const shapeY = Math.floor(cursorPosition.y / cellSize) * cellSize;
      for (let i = 0; i < selectedShape.length; i++) {
        for (let j = 0; j < selectedShape[i].length; j++) {
          if (selectedShape[i][j] === 1) {
            gameCtx.strokeRect(shapeX + j * cellSize, shapeY + i * cellSize, cellSize, cellSize);
          }
        }
      }
    }
  
    drawGridLines();
  }
  

  function createGrid() {
    const gridWidth = Math.floor(gameCanvas.width / cellSize);
    const gridHeight = Math.floor(gameCanvas.height / cellSize);
  
    const grid = new Array(gridHeight).fill(null).map(() => new Array(gridWidth).fill(0));
  
    return grid;
  }
  

  function resizeGrid(grid, newWidth, newHeight, newCellSize) {
    const newGrid = new Array(newHeight).fill(null).map(() => new Array(newWidth).fill(0));
  
    const copyWidth = Math.min(grid[0].length, newWidth);
    const copyHeight = Math.min(grid.length, newHeight);
  
    for (let y = 0; y < copyHeight; y++) {
      for (let x = 0; x < copyWidth; x++) {
        newGrid[y][x] = grid[y][x];
      }
    }
  
    return newGrid;
  }
  

  function populateGridRandomly(grid, percentage) {
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        grid[y][x] = Math.random() < percentage / 100 ? 1 : 0;
      }
    }
  }

  // game logic
  function nextGeneration(grid) {
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;

    const newGrid = createGrid();

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
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;

    let count = 0;

    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      for (let xOffset = -1; xOffset <= 1; xOffset++) {
        if (xOffset === 0 && yOffset === 0) {
          continue;
        }

        const neighborX = x + xOffset;
        const neighborY = y + yOffset;

        if (
          neighborX >= 0 &&
          neighborX < gridWidth &&
          neighborY >= 0 &&
          neighborY < gridHeight &&
          grid[neighborY][neighborX] === 1
        ) {
          count++;
        }
      }
    }

    return count;
  }

  function drawGridLines() {
    gameCtx.strokeStyle = gridColor;
    gameCtx.lineWidth = 1;

    for (let x = 0; x <= gameCanvas.width; x += cellSize) {
      gameCtx.beginPath();
      gameCtx.moveTo(x, 0);
      gameCtx.lineTo(x, gameCanvas.height);
      gameCtx.stroke();
    }

    for (let y = 0; y <= gameCanvas.height; y += cellSize) {
      gameCtx.beginPath();
      gameCtx.moveTo(0, y);
      gameCtx.lineTo(gameCanvas.width, y);
      gameCtx.stroke();
    }
  }

  // Add event listeners
  startBtn.addEventListener('click', () => {
    console.log('Start button clicked');
    toggleGame();
  });

  resetBtn.addEventListener('click', resetGame);
  nextBtn.addEventListener('click', advanceGeneration);
  next23GenBtn.addEventListener('click', next23Generations);
  speedInput.addEventListener('input', debounce(updateSpeed, 200));
  populatePercentageInput.addEventListener('input', debounce(updatePopulationPercentage, 200));
  cellColorPicker.addEventListener('input', updateCellColor);
  gridColorPicker.addEventListener('input', updateGridColor);
  backgroundColorPicker.addEventListener('input', updateBackgroundColor);
  openPopupBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  cellSizeSlider.addEventListener('input', updateCellSize);
  gameCanvas.addEventListener("click", toggleCellState);
  gameCanvas.addEventListener('mousemove', (event) => {
    cursorPosition = { x: event.offsetX, y: event.offsetY };
    drawGrid(grid);
  });


  let gridInitialized = false;

  // to start the game after things are all loaded
  function startGameOfLife() {
    if (!gridInitialized) {
      grid = createGrid();
      gridInitialized = true;
    }
    resizeCanvas();
    populateGridRandomly(grid, 30);
    drawGrid(grid);
  }
  
  
  function resizeCanvas() {
    const padding = 15;
    const newWidth = Math.floor((window.innerWidth - padding * 2) / cellSize) * cellSize;
    const newHeight = Math.floor((window.innerHeight - padding * 2) / cellSize) * cellSize;
  
    gameCanvas.width = newWidth;
    gameCanvas.height = newHeight;
    grid = resizeGrid(grid, newWidth / cellSize, newHeight / cellSize, cellSize);
    drawGrid(grid); // Pass grid parameter here
  }
  
  
  function updateCellSize(event) {
    const newCellSize = parseInt(event.target.value);
    const newWidth = Math.floor(gameCanvas.width / newCellSize);
    const newHeight = Math.floor(gameCanvas.height / newCellSize);
    const adjustedCellSize = Math.min(gameCanvas.width / newWidth, gameCanvas.height / newHeight);
  
    grid = resizeGrid(grid, newWidth, newHeight, adjustedCellSize);
    cellSize = adjustedCellSize;
    drawGrid(grid);
  }

  // shape definitions
  const shapes = {
    shape1: [
      [1, 1],
      [1, 1]
    ],
    shape2: [
      [1, 1, 1],
      [0, 1, 0],
      [1, 1, 1]
    ]
    // Add more shapes later
  };
  
  // shape declarations and listeners
  const shapesBtn = document.getElementById('shapes-btn');
  const shapeBtns = document.getElementsByClassName('shape-btn');
  let selectedShape = null;

  shapesBtn.addEventListener('click', () => {
    const shapesMenu = document.getElementById('shapes-menu');
    shapesMenu.style.display = shapesMenu.style.display === 'none' ? 'block' : 'none';
  });

  for (const shapeBtn of shapeBtns) {
    shapeBtn.addEventListener('click', (event) => {
      const shape = event.target.closest('button').dataset.shape;
      selectedShape = shapes[shape];
    });
  }

  
  // button functionality
  function toggleGame() {
    if (intervalId === null) {
      intervalId = setInterval(() => {
        grid = nextGeneration(grid);
        drawGrid(grid);
      }, intervalSpeed);
      startBtn.textContent = 'Stop';
    } else {
      clearInterval(intervalId);
      intervalId = null;
      startBtn.textContent = 'Start';
    }
  }

  function resetGame() {
    clearInterval(intervalId);
    intervalId = null;
    startBtn.textContent = 'Start';
    populateGridRandomly(grid, 30);
    drawGrid(grid);
  }

  function advanceGeneration() {
    grid = nextGeneration(grid);
    drawGrid(grid);
  }

  function next23Generations() {
    for (let i = 0; i < 23; i++) {
      grid = nextGeneration(grid);
    }
    drawGrid(grid);
  }

  function updateSpeed(event) {
    intervalSpeed = event.target.value;
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        grid = nextGeneration(grid);
        drawGrid(grid);
      }, intervalSpeed);
    }
  }

  function updatePopulationPercentage(event) {
    const percentage = event.target.value;
    populateGridRandomly(grid, percentage);
    drawGrid(grid);
  }

  function updateCellColor(event) {
    cellColor = event.target.value;
    drawGrid(grid);
  }

  function updateGridColor(event) {
    gridColor = event.target.value;
    drawGrid(grid);
  }

  function updateBackgroundColor(event) {
    backgroundColor = event.target.value;
    drawGrid(grid);
  }

  function openModal() {
    document.getElementById('modal').classList.add('active');
  }

  function closeModal() {
    document.getElementById('modal').classList.remove('active');
  }
  
  startGameOfLife();
});
