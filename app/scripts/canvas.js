(window.SnakeGame = window.SnakeGame || {}).Canvas = (function() {
  'use strict';

  const SnakeGame = window.SnakeGame;
  const {CELL_SIZE, FRAME_RATE_DROP, SNAKE_CELL, EMPTY_CELL, FOOD_CELL} = SnakeGame.Consts;

  const canvasEl = document.querySelector('.canvas');
  const screenWidth = Math.floor(window.innerWidth / CELL_SIZE);
  const screenHeight = Math.floor(window.innerHeight / CELL_SIZE);
  const grid = {};
  const dirtyCells = [];
  let renderCycle = 0;

  function init() {
    canvasEl.style.width = `${screenWidth * CELL_SIZE}px`;
    canvasEl.style.height = `${screenHeight * CELL_SIZE}px`;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < screenHeight; i++) {
      const cellRowEl = document.createElement('div');
      cellRowEl.classList.add('cell-row');
      grid[i] = {};

      for (let j = 0; j < screenWidth; j++) {
        const cellEl = document.createElement('div');
        grid[i][j] = {x: j, y: i, el: cellEl, state: EMPTY_CELL};
        cellEl.classList.add('cell');
        cellEl.style.width = `${CELL_SIZE}px`;
        cellEl.style.height = `${CELL_SIZE}px`;
        cellRowEl.appendChild(cellEl);
      }

      fragment.appendChild(cellRowEl);
    }
    canvasEl.appendChild(fragment);
  }

  function startFrameLoop(frameCallback) {
    let i = 0;

    function animationFrameHandler() {
      i %= 100;

      if (++i % FRAME_RATE_DROP === 0) {
        frameCallback();
      }

      window.requestAnimationFrame(animationFrameHandler);
    }

    window.requestAnimationFrame(animationFrameHandler);
  }

  function setCellState(x, y, cellState, cellRenderCycle) {
    const cell = grid[y][x];
    cell.renderCycle = cellRenderCycle;

    if (cell.state !== cellState) {
      cell.el.classList.remove(cell.state);
      cell.state = cellState;
      cell.el.classList.add(cellState);

      if (cellState !== EMPTY_CELL) {
        dirtyCells.push(cell);
      } else {
        dirtyCells.splice(dirtyCells.indexOf(cell), 1);
      }
    }
  }

  function render(state) {
    renderCycle++;
    renderCycle %= 2;

    for (let i = 0; i < state.snake.length; i++) {
      setCellState(state.snake[i].x, state.snake[i].y, SNAKE_CELL, renderCycle);
    }

    for (let i = 0; i < state.food.length; i++) {
      setCellState(state.food[i].x, state.food[i].y, FOOD_CELL, renderCycle);
    }

    const dirtyCellsClone = dirtyCells.slice();
    for (let j = 0; j < dirtyCellsClone.length; j++) {
      if (dirtyCellsClone[j].renderCycle !== renderCycle) {
        setCellState(dirtyCellsClone[j].x, dirtyCellsClone[j].y, EMPTY_CELL, renderCycle);
      }
    }
  }

  return {
    init,
    startFrameLoop,
    render,
    screenWidth,
    screenHeight
  };
})();
