SnakeGame.Game = (function() {
  'use strict';

  const {SNAKE_CELL, EMPTY_CELL, FOOD_CELL} = SnakeGame.Consts;
  const {Direction, Collision} = SnakeGame.Enums;
  const Grid = SnakeGame.Grid;
  const Snake = SnakeGame.Snake;
  const FoodController = SnakeGame.FoodController;

  let grid;
  let snake;
  let food;
  let feedingProcessors;
  let frameCycle;
  let finishGame;
  let stats;

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

  function feedSnake() {
    const position = snake.getHeadPosition();
    feedingProcessors.push({
      processOnCycle: frameCycle + snake.getLength(),
      position: position.clone()
    });
    food.removeFoodUnitAt(position);
    stats.score++;
  }

  function processFeeding() {
    feedingProcessors.forEach(function(feeding) {
      if (feeding.processOnCycle === frameCycle) {
        snake.addCellAt(feeding.position);
        feedingProcessors.splice(feedingProcessors.indexOf(feeding), 1);
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
      finishGame();
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
        return grid.getRandomEmptyPosition() || finishGame();
      },
      function processFoodAddPosition(position) {
        setCellState(position, FOOD_CELL);
      }
    );
  }

  function onInputMove(direction) {
    snake.scheduleDirectionChange(direction);
  }

  function frameLoop() {
    frameCycle++;
    if (frameCycle === Number.MAX_SAFE_INTEGER) {
      frameCycle = 0;
    }

    snake.updateDirection();
    processCollision(moveSnake());
    processFeeding();
    processFood();
  }

  function start(width, height, onGameEnd) {
    grid = new Grid(width, height);
    snake = new Snake(grid.getRandomEmptyPosition(), Direction.RIGHT);
    food = new FoodController();
    feedingProcessors = [];
    frameCycle = 4;
    finishGame = onGameEnd;
    stats = {score: 0};

    return {snake, food, frameLoop, onInputMove, stats};
  }

  function destroy() {
    grid = null;
    snake = null;
    food = null;
    feedingProcessors = null;
    frameCycle = null;
    finishGame = null;
  }

  return {start, destroy};
})();
