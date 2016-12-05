SnakeGame.Game = (function() {
  'use strict';

  const {SNAKE_CELL, EMPTY_CELL, FOOD_CELL} = SnakeGame.Consts;
  const {Direction, Collision} = SnakeGame.Enums;
  const Grid = SnakeGame.Grid;
  const Snake = SnakeGame.Snake;
  const FoodController = SnakeGame.FoodController;

  let grid;
  let outerSnake;
  let outerFood;
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

  function feedSnake(snake, food) {
    const position = snake.feed();
    food.removeFoodUnitAt(position);
    stats.score++;
  }

  function processFeeding(snake) {
    snake.processFood();
  }

  function moveSnake(snake) {
    setCellState(snake.getTailPosition(), EMPTY_CELL);
    snake.moveInsideOfDimensions(grid.width, grid.height);
    return setCellState(snake.getHeadPosition(), SNAKE_CELL);
  }

  function processCollision(snake, food, collision) {
    if (collision === Collision.SNAKE_TO_FOOD) {
      feedSnake(snake, food);
    } else if (collision === Collision.SNAKE_TO_SNAKE) {
      finishGame();
    }
  }

  function processFood(food) {
    food.destroyOldFood();
    const foodUnit = food.generateNewFood(() => grid.getRandomEmptyPosition());
    if (foodUnit) {
      setCellState(foodUnit, FOOD_CELL);
    }
  }

  function onInputMove(snake, direction) {
    snake.scheduleDirectionChange(direction);
  }

  function updateSnakeDirection(snake) {
    snake.updateDirection();
  }

  function frameLoop() {
    updateSnakeDirection(outerSnake);
    processCollision(outerSnake, outerFood, moveSnake(outerSnake));
    processFeeding(outerSnake);
    processFood(outerFood);
  }

  function start(width, height, onGameEnd) {
    grid = new Grid(width, height);
    outerSnake = new Snake(grid.getRandomEmptyPosition(), Direction.RIGHT);
    outerFood = new FoodController();
    finishGame = onGameEnd;
    stats = {score: 0};

    return {
      snake: outerSnake,
      food: outerFood,
      frameLoop,
      stats,
      onInputMove(dir) {
        onInputMove(outerSnake, dir);
      }
    };
  }

  function destroy() {
    grid = null;
    outerSnake = null;
    outerFood = null;
    finishGame = null;
  }

  return {start, destroy};
})();
