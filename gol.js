const buttonOpen = document.querySelector("#open-popup");
const closeButton = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");
const minCellSize = 5;
const maxCellSize = 50;
const shapesFooter = document.getElementById("shapes-footer");
let cursorPosition = { x: 0, y: 0 };
seconds = 0;
minutes = 0;
generation_count = 0;
timer = null;
//score is number of alive cells
score = 0;

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
  const next23GenBtn = document.getElementById('next-23-gen-btn');
  const speedInput = document.getElementById('speed-input');
  const populatePercentageInput = document.getElementById('populate-percentage-input');
  const cellColorPicker = document.getElementById('cell-color-picker');
  const gridColorPicker = document.getElementById('grid-color-picker');
  const backgroundColorPicker = document.getElementById('background-color-picker');
  const openPopupBtn = document.getElementById('open-popup');
  const closeModalBtn = document.querySelector('[data-close-button]');
  if (buttonOpen) {
    const model = document.querySelector(buttonOpen.dataset.modalTarget);
    openModal(model);
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
    updateScore();
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
    generation_count += 1;
    document.getElementById('generation').innerHTML= generation_count.toString();
    updateScore();
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
  openPopupBtn.addEventListener('click', () => {
    const model = document.querySelector(openPopupBtn.dataset.modalTarget);
    openModal(model);
  });
  closeModalBtn.addEventListener('click', () => {
    const model = closeModalBtn.closest(".model");
    closeModal(model);
  });
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
    updateScore();
  }
  
  
  const gameOfLifeCanvas = document.getElementById("game-of-life-canvas");

  function resizeCanvas() {
    const padding = 15;
    const shapesFooterHeight = shapesFooter.clientHeight;
    const newWidth = Math.floor((window.innerWidth - padding * 2) / cellSize) * cellSize;
    const newHeight = Math.floor((window.innerHeight - shapesFooterHeight - padding * 2) / cellSize) * cellSize;
  
    gameOfLifeCanvas.width = newWidth;
    gameOfLifeCanvas.height = newHeight;
    gameOfLifeCanvas.style.top = padding + 'px'; // Add this line to set the top property of the canvas
  
    grid = resizeGrid(grid, newWidth / cellSize, newHeight / cellSize, cellSize);
    drawGrid(grid); // Pass grid parameter here
    updateScore();
  }
  
  
  
  const shapesFooter = document.getElementById("shapes-footer");
  
  // Call resizeCanvas on window load and window resize
  window.addEventListener('load', resizeCanvas);
  window.addEventListener('resize', resizeCanvas);
  
  
  
  function updateCellSize(event) {
    const newCellSize = parseInt(event.target.value);
    const newWidth = Math.floor(gameCanvas.width / newCellSize);
    const newHeight = Math.floor(gameCanvas.height / newCellSize);
    const adjustedCellSize = Math.min(gameCanvas.width / newWidth, gameCanvas.height / newHeight);
  
    grid = resizeGrid(grid, newWidth, newHeight, adjustedCellSize);
    cellSize = adjustedCellSize;
    drawGrid(grid);
    updateScore();
  }

  // shape definitions
  const shapes = {
    shape1: [ // block
      [1, 1],
      [1, 1]
    ],
    shape2: [ // behive
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 1, 0]
    ],
    shape3: [ // pulsar
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    ],
    shape4: [ // 101 by Achim Flammenkamp
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
      [1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1],
      [0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
      [1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1],
      [1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    ],
    shape5: [ // glider
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 1]
    ],
    shape6: [ // lightweight spaceship (LWSS)
      [0, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 1],
      [1, 0, 0, 1, 0]
    ],
    shape7: [ // beacon
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 1, 1]
    ],
    shape8: [ // toad
      [0, 1, 1, 1],
      [1, 1, 1, 0]
    ],
    shape9: [ // blinker
      [1, 1, 1]
    ],
    shape10: [ // glider gun (Gosper glider gun)
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    shape11: [ // penta-decathlon
      [0, 1, 0],
      [0, 1, 0],
      [1, 0, 1],
      [1, 1, 1],
      [1, 0, 1],
      [1, 0, 1],
      [1, 0, 1],
      [1, 1, 1],
      [1, 0, 1],
      [0, 1, 0],
      [0, 1, 0]
    ],
    shape12: [ // loaf
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 0, 1],
      [0, 0, 1, 0]
    ],
    shape13: [ // tub
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0]
    ],
    shape14: [ // boat
      [1, 1, 0],
      [1, 0, 1],
      [0, 1, 0]
    ],
    shape15: [ // babbling brook
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0],
      [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0],
      [0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    ]
  };
  
  // shape declarations and listeners
  const shapeBtns = document.querySelectorAll('#shapes-footer .shape-btn');
  let selectedShape = null;

  for (const shapeBtn of shapeBtns) {
    shapeBtn.addEventListener('click', (event) => {
      const shape = event.target.closest('button').dataset.shape;
      selectedShape = shapes[shape];
      drawGrid(grid); // Add this line to redraw the grid with the shape outline
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
      timer = setInterval(continueTimer,1000);
    } else {
      clearInterval(intervalId);
      clearInterval(timer);
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
    generation_count = 0;
    document.getElementById("generation").innerHTML = generation_count.toString();
    resetTimer();
    updateScore();
  
    // Get the max population from the score element
    const maxPopulation = parseInt(document.querySelector('#maxPopulation').textContent);
  
    // Calculate the elapsed time in seconds
    const elapsedTime = minutes * 60 + seconds;
  
    // Send the max population and elapsed time to the server
    sendGameDataToServer(maxPopulation, elapsedTime);
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
    updateScore();
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

  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");
  const nestedMenuButtons = document.querySelectorAll(".nested-menu-toggle");

  menuToggle.addEventListener("click", function () {
    menu.classList.toggle("menu-expanded");
  });

  nestedMenuButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      console.log('Button Clicked', button);
      event.stopPropagation(); // Add this line to prevent event bubbling
      const nestedMenuId = button.id.replace("-btn", "");
      const nestedMenu = document.getElementById(nestedMenuId);

      if (nestedMenu) {
        nestedMenu.classList.toggle("nested-menu-active");
      }
    });
  });
  
  // Draggable menu functionality
  let isDragging = false;
  let offsetX, offsetY;
  
  menu.addEventListener("mousedown", (event) => {
    if (menu.classList.contains("menu-expanded")) return;
    isDragging = true;
    offsetX = event.clientX - menu.getBoundingClientRect().left;
    offsetY = event.clientY - menu.getBoundingClientRect().top;
  });
  
  document.addEventListener("mousemove", (event) => {
    if (!isDragging) return;
    event.preventDefault();
    menu.style.left = event.clientX - offsetX + "px";
    menu.style.top = event.clientY - offsetY + "px";
    menu.style.right = "auto"; // Reset the 'right' position when dragging
  });
  
  document.addEventListener("mouseup", () => {
    isDragging = false;
  
    // Check if the menu goes off-screen and adjust its position if necessary
    const menuRect = menu.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
  
    if (menu.classList.contains("menu-expanded")) {
      if (menuRect.right > windowWidth) {
        menu.style.left = windowWidth - menuRect.width - 10 + "px";
        menu.style.right = "auto";
      }
  
      if (menuRect.top < 0) {
        menu.style.top = "10px";
      }
  
      if (menuRect.bottom > windowHeight) {
        menu.style.top = windowHeight - menuRect.height - 10 + "px";
      }
    }
  });

  //function to resume timer
  function continueTimer(){
    seconds ++;
    if (seconds >= 60){
      seconds = 0;
      minutes ++;
    }
    if (minutes >= 60){
      minutes = 0;
    }
    if (seconds <10){
      seconds_string = "0" + seconds.toString();
    } else{
      seconds_string = seconds.toString();
    }
    if (minutes <10){
      minutes_string = "0" + minutes.toString();
    } else {
      mimutes_string = minutes.toString();
    }
    time_string = minutes_string + ":" + seconds_string;
    document.getElementById('time').innerHTML=time_string;
  }

  //function to stop the timer and reset it to 00:00
  function resetTimer(){
    seconds = 0;
    minutes = 0;
    time_string = "00:00";
    document.getElementById('time').innerHTML=time_string;
    clearInterval(timer);
  }

  //function to count number of alive cells
  function updateScore() {
    alive_count = 0;
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;
  
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const isAlive = grid[y][x] === 1;
  
        if (isAlive == true) {
          alive_count++;
        }
      }
    }
  
    document.getElementById('score').innerHTML = alive_count.toString();
    localStorage.setItem('score', alive_count);
  
    // Call updateMaxPopulation function with the current alive_count
    updateMaxPopulation(alive_count);
  }
  

  // Retrieve the username from localStorage and call updateUserDisplay
  const retrievedUsername = localStorage.getItem('lastLoggedInUser');
  if (retrievedUsername) {
    updateUserDisplay(retrievedUsername);
  } else {
    updateUserDisplay(null); // Call with null if no user is logged in
  }

  // Function to update the user display
  function updateUserDisplay(username) {
    const usernameElement = document.querySelector('#Username');
    if (username) {
      usernameElement.textContent = `Welcome ${username}`;
    } else {
      usernameElement.textContent = 'User Not Logged In';
    }
  }
  

// Function to update the maximum population
function updateMaxPopulation(currentPopulation) {
  const maxPopulationElement = document.querySelector('#maxPopulation');
  let maxPopulation = parseInt(maxPopulationElement.textContent);

  if (currentPopulation > maxPopulation) {
    maxPopulationElement.textContent = currentPopulation;
    // Get the elapsed time from the timer
    const elapsedTime = minutes * 60 + seconds;
    // Send the new max population and elapsed time to the server
    sendGameDataToServer(maxPopulation, elapsedTime);
  }
}



function sendGameDataToServer(maxPopulation, elapsedTime) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "score.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      console.log("Game data sent to server.");
    }
  };

  xhr.send(`maxPopulation=${maxPopulation}&elapsedTime=${elapsedTime}`);
}


  
  // Add this block of code to detect clicks outside the menu
  document.addEventListener("click", function (event) {
    if (!menu.contains(event.target) && event.target !== menuToggle) {
      menu.classList.remove("menu-expanded");
    }
  });
  
  startGameOfLife();
});
