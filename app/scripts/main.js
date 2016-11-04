(function() {
  'use strict';

  const SnakeGame = window.SnakeGame;
  const {screenWidth, screenHeight, render, init: initCanvas, startFrameLoop} = SnakeGame.Canvas;
  const {SNAKE_CELL, EMPTY_CELL, FOOD_CELL} = SnakeGame.Consts;
  const {Direction, Collision} = SnakeGame.Enums;
  const {Grid, Snake, FoodController} = SnakeGame.Classes;

  const grid = new Grid(screenWidth, screenHeight);
  const snake = new Snake(grid.getRandomEmptyPosition(), Direction.RIGHT);
  const food = new FoodController();

  const feedingProcessors = [];
  let frameCycle = 0;
  let isPaused = false;

  const state = window.state = {snake, food};

  function scheduleDirectionChange(dir) {
    if (!isPaused) {
      snake.scheduleDirectionChange(dir);
    }
  }

  function setCellState(pos, cellState) {
    if (cellState === SNAKE_CELL) {
      const cell = grid.getCell(pos);

      if (cell === FOOD_CELL) {
        return Collision.SNAKE_TO_FOOD;
      } else if (cell === SNAKE_CELL) {
        return Collision.SNAKE_TO_SNAKE;
      }
    }

    grid.setCell(pos, cellState);
    return null;
  }

  function die() {
    location.reload();
  }

  function feedSnake() {
    const position = snake.getHeadPosition();
    feedingProcessors.push({
      processOnCycle: frameCycle + snake.getLength(),
      position
    });
    food.removeFoodUnitAt(position);
  }

  function processFeeding() {
    feedingProcessors.forEach(function(feeding) {
      if (feeding.processOnCycle === frameCycle) {
        snake.addCellAt(feeding.position);
        feedingProcessors.splice(feedingProcessors.indexOf(feeding, 1));
      }
    });
  }

  function moveSnake() {
    setCellState(snake.getTailPosition(), EMPTY_CELL);
    snake.moveInsideOfDimensions(grid.width, grid.height);
    return setCellState(snake.getHeadPosition(), SNAKE_CELL);
  }

  function processCollision(collision) {
    if (collision === Collision.SNAKE_TO_FOOD) {
      feedSnake();
    } else if (collision === Collision.SNAKE_TO_SNAKE) {
      die();
    }
  }

  function processFood() {
    food.destroyFood(frameCycle,
      function processFoodRemovePosition(position) {
        setCellState(position, EMPTY_CELL);
      }
    );

    food.generateFood(frameCycle,
      function getNewFoodPosition() {
        return grid.getRandomEmptyPosition();
      },
      function processFoodAddPosition(position) {
        setCellState(position, FOOD_CELL);
      }
    );
  }

  function toggleIsPaused() {
    isPaused = !isPaused;
    document.body.classList[isPaused ? 'add' : 'remove']('is-game-paused');
  }

  document.addEventListener('keydown', function(ev) {
    if (ev.which === 40) { // arrow down
      scheduleDirectionChange(Direction.DOWN);
    } else if (ev.which === 39) { // arrow right
      scheduleDirectionChange(Direction.RIGHT);
    } else if (ev.which === 38) { // arrow up
      scheduleDirectionChange(Direction.UP);
    } else if (ev.which === 37) { // arrow left
      scheduleDirectionChange(Direction.LEFT);
    } else if (ev.which === 80) { // p
      toggleIsPaused();
    }
  });

  initCanvas();

  startFrameLoop(function() {
    if (isPaused) {
      return;
    }

    frameCycle++;
    if (frameCycle === Number.MAX_SAFE_INTEGER) {
      frameCycle = 0;
    }

    snake.updateDirection();
    processCollision(moveSnake());
    processFeeding();
    processFood();
    render(state);
  });
})();
