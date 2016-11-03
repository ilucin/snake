(function() {
  'use strict';

  const SnakeGame = window.SnakeGame;
  const {screenWidth, screenHeight, render, init: initCanvas, startFrameLoop} = SnakeGame.Canvas;
  const {randomInt} = SnakeGame.Utils;
  const {SNAKE_CELL, EMPTY_CELL, FOOD_CELL, MAX_CYCLE_BETWEEN_FOOD, MAX_FOOD, MAX_FOOD_DURATION, MIN_FOOD_DURATION} = SnakeGame.Consts;
  const {Direction, Collision} = SnakeGame.Enums;
  const {Grid} = SnakeGame.Classes;

  const grid = new Grid(screenWidth, screenHeight);

  const snake = [];
  const food = [];
  const feedingProcessors = [];
  const scheduledDirectionChanges = [];
  let frameCycle = 0;
  let nextFoodCycle;
  let isPaused = false;

  const state = window.state = {
    snakeDirection: Direction.RIGHT,
    snake,
    food
  };

  function scheduleDirectionChange(dir) {
    if (!isPaused) {
      scheduledDirectionChanges.push(dir);
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

  function normalizePosition(pos) {
    pos.x %= screenWidth;
    pos.y %= screenHeight;

    if (pos.x < 0) {
      pos.x = screenWidth + pos.x;
    }

    if (pos.y < 0) {
      pos.y = screenHeight + pos.y;
    }

    return pos;
  }

  function initSnake() {
    snake.push(grid.getRandomEmptyPosition());
  }

  function feedSnake() {
    const pos = {x: snake[0].x, y: snake[0].y};
    feedingProcessors.push({cycle: frameCycle + snake.length, pos});
    food.forEach((foodUnit) => {
      if (foodUnit.x === pos.x && foodUnit.y === pos.y) {
        food.splice(food.indexOf(foodUnit), 1);
      }
    });
  }

  function processFeeding() {
    feedingProcessors.forEach(function(feeding) {
      if (feeding.cycle === frameCycle) {
        snake.push(feeding.pos);
        feedingProcessors.splice(feedingProcessors.indexOf(feeding, 1));
      }
    });
  }

  function isValidDirectionChange(newDir) {
    const dir = state.snakeDirection;
    return newDir && (
      (newDir === Direction.UP && dir !== Direction.DOWN) ||
      (newDir === Direction.DOWN && dir !== Direction.UP) ||
      (newDir === Direction.RIGHT && dir !== Direction.LEFT) ||
      (newDir === Direction.LEFT && dir !== Direction.RIGHT)
    );
  }

  function updateSnakeDirection() {
    let newDir;
    let isValid;

    do {
      newDir = scheduledDirectionChanges.shift();
      isValid = isValidDirectionChange(newDir);
    } while (!isValid && scheduledDirectionChanges.length > 0);

    if (isValid) {
      state.snakeDirection = newDir;
    }
  }

  function moveSnake() {
    setCellState(snake[snake.length - 1], EMPTY_CELL);
    for (let i = snake.length - 1; i > 0; i--) {
      snake[i].x = snake[i - 1].x;
      snake[i].y = snake[i - 1].y;
    }

    if (state.snakeDirection === Direction.RIGHT) {
      snake[0].x++;
    } else if (state.snakeDirection === Direction.LEFT) {
      snake[0].x--;
    } else if (state.snakeDirection === Direction.UP) {
      snake[0].y--;
    } else if (state.snakeDirection === Direction.DOWN) {
      snake[0].y++;
    }

    normalizePosition(snake[0]);
    const collision = setCellState(snake[0], SNAKE_CELL);
    if (collision === Collision.SNAKE_TO_FOOD) {
      feedSnake();
    } else if (collision === Collision.SNAKE_TO_SNAKE) {
      die();
    }
  }

  function processFood() {
    food.forEach(function(foodUnit) {
      if (foodUnit.cycle + foodUnit.duration < frameCycle) {
        food.splice(food.indexOf(foodUnit), 1);
        setCellState(foodUnit, EMPTY_CELL);
      }
    });

    if (frameCycle % MAX_CYCLE_BETWEEN_FOOD === nextFoodCycle && food.length < MAX_FOOD) {
      const foodUnit = grid.getRandomEmptyPosition();
      foodUnit.cycle = frameCycle;
      foodUnit.duration = randomInt(MIN_FOOD_DURATION, MAX_FOOD_DURATION);
      food.push(foodUnit);
      setCellState(foodUnit, FOOD_CELL);
    }

    nextFoodCycle = randomInt(0, MAX_CYCLE_BETWEEN_FOOD);
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
  initSnake();

  startFrameLoop(function() {
    if (isPaused) {
      return;
    }

    frameCycle++;
    if (frameCycle === Number.MAX_SAFE_INTEGER) {
      frameCycle = 0;
    }

    updateSnakeDirection();
    moveSnake();
    processFeeding();
    processFood();
    render(state);
  });
})();
