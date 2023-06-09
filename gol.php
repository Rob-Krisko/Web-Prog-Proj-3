<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Conway's Game of Life</title>
  <link rel="stylesheet" href="gol.css">
  <link rel="stylesheet" href="menu.css">
</head>
<body>
  <div class="modal" id="modal">
    <div class="modal-head">
      <div class="title">Welcome to Conway's Game of Life!</div>
      <button data-close-button class="close">X</button>
    </div>
    <!-- this is the instructions portion of the pop up-->
    <div class="modal-body">
      <b>Object of the game:</b> <br> Find and create unpredictable patterns that are created over generations.
      <div class="row">
        <div class="column">
          <b>Rules:</b><br><br>
          - If a live cell has less than two live neighbors it dies.<br><br><br><br>
          - If a live cell has three or more live neighbors it dies.<br><br><br><br>
          - If a live cell has two or three live neighbors it lives to the next generation.<br><br><br>
          - Any dead cell with three live neighbors comes alive.<br>
          <br><a href="http://pi.math.cornell.edu/~lipa/mec/lesson6.html">More Instructions</a>
        </div>
        <div class="column">
          <b>Examples:</b><br>
          <img src="one.png" alt="example 1" display: block><br>
          <img src="two.png" alt="example 2" display: block><br>
          <img src="three.png" alt="example 3" display: block><br>
          <img src="four.png" alt="example 4" display: block><br>
          Please <a href="modal.html">Login/Register</a>
        </div>
      </div>
    </div>
  </div>
  <div id="overlay"></div>
  <header>
    <div class="header-row">
        <div id="scores">
        <span id="Username"><?php echo isset($_SESSION['user_id']) ? $_SESSION['username'] : ''; ?></span> Time: <h1 id="time">00:00  </h1> Current generation: <h1 id="generation">0</h1>  Current Population: <h1 id="score">0</h1> Maximum Population: <h1 id="maxPopulation">0</h1>
        </div>
        <div id="menu-buttons" style="display: flex; justify-content: flex-end;">
        <button class="menu-btn" id="start-btn">Start</button>
        <button class="menu-btn" id="reset-btn">Reset</button>
        <button class="menu-btn" id="next-btn">Next Generation</button>
        <button class="menu-btn" id="next-23-gen-btn">Next 23 Generations</button>

        <div class="dropdown">
        <button class="menu-btn dropdown-toggle" id="settings-dropdown">Settings</button>
        <div class="dropdown-menu" id="settings-menu">
            <label class="menu-label" for="populate-percentage-input">Population Percentage:</label>
            <input class="menu-input" type="range" id="populate-percentage-input" min="0" max="100" step="1" value="30">
            <label class="menu-label" for="speed-input">Speed:</label>
            <input class="menu-input" type="range" id="speed-input" min="0" max="1000" step="10" value="100">
            <label class="menu-label" for="cell-size-slider">Resize cells:</label>
            <input class="menu-input" type="range" min="5" max="50" value="15" class="slider" id="cell-size-slider">
        </div>
        </div>

        <div class="dropdown">
        <button class="menu-btn dropdown-toggle" id="color-dropdown">Color</button>
        <div class="dropdown-menu" id="color-menu">
            <label class="menu-label" for="cell-color-picker">Cell Color:</label>
            <input class="menu-input" type="color" id="cell-color-picker">
            <label class="menu-label" for="grid-color-picker">Grid Color:</label>
            <input class="menu-input" type="color" id="grid-color-picker">
            <label class="menu-label" for="background-color-picker">Background Color:</label>
            <input class="menu-input" type="color" id="background-color-picker">
        </div>
        </div>

        <button class="menu-btn" id="open-popup" data-modal-target="#modal">Open Popup</button>
        </div>
    </div>
    </header>


  
  <div id="game-container">
    
    <canvas id="game-of-life-canvas"></canvas>
  </div>
  <footer id="shapes-footer">
    <div class="shapes-container">
      <button class="shape-btn" data-shape="shape1"><img src="shape1.png" alt="Block" /></button>
      <button class="shape-btn" data-shape="shape2"><img src="shape2.png" alt="Beehive" /></button>
      <button class="shape-btn" data-shape="shape3"><img src="shape3.png" alt="Pulsar" /></button>
      <button class="shape-btn" data-shape="shape4"><img src="shape4.png" alt="101" /></button>
      <button class="shape-btn" data-shape="shape5"><img src="shape5.png" alt="Glider" /></button>
      <button class="shape-btn" data-shape="shape6"><img src="shape6.png" alt="LWSS" /></button>
      <button class="shape-btn" data-shape="shape7"><img src="shape7.png" alt="Beacon" /></button>
      <button class="shape-btn" data-shape="shape8"><img src="shape8.png" alt="Toad" /></button>
      <button class="shape-btn" data-shape="shape9"><img src="shape9.png" alt="Blinker" /></button>
      <button class="shape-btn" data-shape="shape10"><img src="shape10.png" alt="Gosper Gun" /></button>
      <button class="shape-btn" data-shape="shape11"><img src="shape11.png" alt="Penta-Decathlon" /></button>
      <button class="shape-btn" data-shape="shape12"><img src="shape12.png" alt="Loaf" /></button>
      <button class="shape-btn" data-shape="shape13"><img src="shape13.png" alt="Tub" /></button>
      <button class="shape-btn" data-shape="shape14"><img src="shape14.png" alt="Boat" /></button>
      <button class="shape-btn" data-shape="shape15"><img src="shape15.png" alt="Babbling Brook" /></button>
    </div>
  </footer>
  <script src="gol.js" defer></script>
</body>
</html>
