(function() {
  'use strict';

  const Snake = window.Snake;
  const {canvas, utils} = Snake;
  const {screenWidth, screenHeight, render, init: initCanvas, startFrameLoop} = canvas;
  const {randomInt, pickRandom} = utils;
  const {SNAKE_CELL, EMPTY_CELL, FOOD_CELL, MAX_CYCLE_BETWEEN_FOOD, MAX_FOOD, MAX_FOOD_DURATION, MIN_FOOD_DURATION} = Snake.consts;

  const LEFT = 1;
  const RIGHT = 2;
  const UP = 3;
  const DOWN = 4;

  const COLLISION_SNAKE_TO_FOOD = 1;
  const COLLISION_SNAKE_TO_SNAKE = 2;

  const grid = {};
  const snake = [];
  const food = [];
  const feedingProcessors = [];
  const scheduledDirectionChanges = [];
  let frameCycle = 0;
  let nextFoodCycle;

  for (let i = 0; i < screenHeight; i++) {
    grid[i] = {};

    for (let j = 0; j < screenWidth; j++) {
      grid[i][j] = EMPTY_CELL;
    }
  }

  const state = window.state = {
    snakeDirection: RIGHT,
    snake,
    food
  };

  function setCellState(pos, cellState) {
    if (cellState === SNAKE_CELL) {
      if (grid[pos.y][pos.x] === FOOD_CELL) {
        return COLLISION_SNAKE_TO_FOOD;
      } else if (grid[pos.y][pos.x] === SNAKE_CELL) {
        return COLLISION_SNAKE_TO_SNAKE;
      }
    }
    grid[pos.y][pos.x] = cellState;
    return null;
  }

  function die() {
    location.reload();
  }

  function getCellState(pos) {
    return grid[pos.y][pos.x];
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

  function getRandomEmptyCellPosition() {
    let pos;

    for (let i = 0; i < 5; i++) {
      pos = {x: randomInt(0, screenWidth), y: randomInt(0, screenHeight)};
      if (getCellState(pos) === EMPTY_CELL) {
        return pos;
      }
    }

    return pickRandom(Object.keys(grid).reduce(function(arr, key1) {
      const positions = [];

      Object.keys(grid[key1]).forEach((key2) => {
        if (grid[key1][key2] === EMPTY_CELL) {
          positions.push({x: key2, y: key1});
        }
      });

      return arr.concat(positions);
    }, []));
  }

  function initSnake() {
    snake.push(getRandomEmptyCellPosition());
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
    return newDir && ((newDir === UP && dir !== DOWN) || (newDir === DOWN && dir !== UP) || (newDir === RIGHT && dir !== LEFT) || (newDir === LEFT && dir !== RIGHT));
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

    if (state.snakeDirection === RIGHT) {
      snake[0].x++;
    } else if (state.snakeDirection === LEFT) {
      snake[0].x--;
    } else if (state.snakeDirection === UP) {
      snake[0].y--;
    } else if (state.snakeDirection === DOWN) {
      snake[0].y++;
    }

    normalizePosition(snake[0]);
    const collision = setCellState(snake[0], SNAKE_CELL);
    if (collision === COLLISION_SNAKE_TO_FOOD) {
      feedSnake();
    } else if (collision === COLLISION_SNAKE_TO_SNAKE) {
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
      const foodUnit = getRandomEmptyCellPosition();
      foodUnit.cycle = frameCycle;
      foodUnit.duration = randomInt(MIN_FOOD_DURATION, MAX_FOOD_DURATION);
      food.push(foodUnit);
      setCellState(foodUnit, FOOD_CELL);
    }

    nextFoodCycle = randomInt(0, MAX_CYCLE_BETWEEN_FOOD);
  }

  document.addEventListener('keydown', function(ev) {
    if (ev.which === 40) {
      scheduledDirectionChanges.push(DOWN);
    } else if (ev.which === 39) {
      scheduledDirectionChanges.push(RIGHT);
    } else if (ev.which === 38) {
      scheduledDirectionChanges.push(UP);
    } else if (ev.which === 37) {
      scheduledDirectionChanges.push(LEFT);
    }
  });

  initCanvas();
  initSnake();

  startFrameLoop(function() {
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
