SnakeGame.Game = (function() {
  'use strict';

  const {SNAKE_CELL, EMPTY_CELL, FOOD_CELL} = SnakeGame.Consts;
  const {Collision} = SnakeGame.Enums;
  const {getRandomNonRelativeDirection, getRandomName} = SnakeGame.Utils;
  const Grid = SnakeGame.Grid;
  const PlayerSnake = SnakeGame.PlayerSnake;
  const BotSnake = SnakeGame.BotSnake;
  const FoodController = SnakeGame.FoodController;

  function setCellState(grid, pos, cellState) {
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
    snake.score++;
  }

  function processFeeding(snake) {
    snake.processFood();
  }

  function moveSnake(grid, snake) {
    setCellState(grid, snake.getTailPosition(), EMPTY_CELL);
    snake.moveInsideOfDimensions(grid.width, grid.height);
    snake.setCollision(setCellState(grid, snake.getHeadPosition(), SNAKE_CELL));
  }

  function killSnake(snake) {
    snake.kill();
  }

  function processCollision(snake, food) {
    const collision = snake.getCollision();
    if (collision === Collision.SNAKE_TO_FOOD) {
      feedSnake(snake, food);
    } else if (collision === Collision.SNAKE_TO_SNAKE) {
      killSnake(snake);
    }
  }

  function processFood(grid, food) {
    food.destroyOldFood();
    const foodUnit = food.generateNewFood(() => grid.getRandomEmptyPosition());
    if (foodUnit) {
      setCellState(grid, foodUnit, FOOD_CELL);
    }
  }

  function updateSnakeDirection(snake) {
    snake.updateDirection();
  }

  function decideOnNextMove(snake, grid, food) {
    snake.decideOnNextMove(grid, food);
  }

  function checkForFinishCondition(snakes, finishGame) {
    const aliveSnakes = snakes.filter((snake) => snake.isAlive());
    if (aliveSnakes.length <= 1) {
      finishGame();
    }
  }

  function start(width, height, onGameEnd) {
    const grid = new Grid(width, height);
    const food = new FoodController();
    const snakes = [
      new PlayerSnake(getRandomName(), grid.getRandomEmptyPosition(), getRandomNonRelativeDirection()),
      new BotSnake(grid.getRandomEmptyPosition(), getRandomNonRelativeDirection())
    ];

    const botSnakes = snakes.filter((snake) => snake instanceof BotSnake);
    const playerSnakes = snakes.filter((snake) => snake instanceof PlayerSnake);
    const inputMoveHandlers = playerSnakes.map((snake) => snake.getInputHandler());

    function frameLoop() {
      botSnakes.forEach((snake) => decideOnNextMove(snake, grid, food));
      snakes.forEach((snake) => updateSnakeDirection(snake));
      snakes.forEach((snake) => moveSnake(grid, snake));
      snakes.forEach((snake) => processCollision(snake, food));
      snakes.forEach((snake) => processFeeding(snake));
      checkForFinishCondition(snakes, onGameEnd);
      processFood(grid, food);
    }

    return {snakes, botSnakes, playerSnakes, food, frameLoop, inputMoveHandlers};
  }

  return start;
})();
