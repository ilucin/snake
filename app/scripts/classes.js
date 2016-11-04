(window.SnakeGame = window.SnakeGame || {}).Classes = (function() {
  'use strict';

  const SnakeGame = window.SnakeGame;
  const {Direction} = SnakeGame.Enums;
  const {EMPTY_CELL, MAX_CYCLE_BETWEEN_FOOD, MAX_FOOD, MAX_FOOD_DURATION, MIN_FOOD_DURATION} = SnakeGame.Consts;
  const {randomInt, pickRandom} = SnakeGame.Utils;

  class Position {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    normalizeForDimensions(width, height) {
      this.x %= width;
      this.y %= height;

      if (this.x < 0) {
        this.x = width + this.x;
      }

      if (this.y < 0) {
        this.y = height + this.y;
      }
    }

    clone() {
      return new Position(this.x, this.y);
    }
  }

  // class Cell extends Position {}

  // class EmptyCell extends Position {
  //   constructor() {
  //     super(...arguments);
  //     this.className = 'empty';
  //   }
  // }

  class CellCollection {
    constructor() {
      this._cells = [];
    }
  }

  class FoodUnit extends Position {
    constructor() {
      super(...arguments);
      this.className = 'food';
    }
  }

  class SnakeCell extends Position {
    constructor() {
      super(...arguments);
      this.className = 'snake';
    }
  }

  class Snake extends CellCollection {
    constructor(position, direction) {
      super();
      this._cells.push(new SnakeCell(position.x, position.y));
      this._direction = direction;
      this._scheduledDirectionChanges = [];
    }

    isValidDirectionChange(newDir) {
      const dir = this._direction;
      return newDir && (
        (newDir === Direction.UP && dir !== Direction.DOWN) ||
        (newDir === Direction.DOWN && dir !== Direction.UP) ||
        (newDir === Direction.RIGHT && dir !== Direction.LEFT) ||
        (newDir === Direction.LEFT && dir !== Direction.RIGHT)
      );
    }

    updateDirection() {
      const scheduledDirectionChanges = this._scheduledDirectionChanges;
      let newDirection;
      let isValid;

      do {
        newDirection = scheduledDirectionChanges.shift();
        isValid = this.isValidDirectionChange(newDirection);
      } while (!isValid && scheduledDirectionChanges.length > 0);

      if (isValid) {
        this._direction = newDirection;
      }
    }

    scheduleDirectionChange(direction) {
      this._scheduledDirectionChanges.push(direction);
    }

    getTailPosition() {
      return this._cells[this._cells.length - 1];
    }

    getHeadPosition() {
      return this._cells[0];
    }

    getPositions() {
      return this._cells;
    }

    getLength() {
      return this._cells.length;
    }

    moveInsideOfDimensions(width, height) {
      const cells = this._cells;
      const direction = this._direction;

      for (let i = cells.length - 1; i > 0; i--) {
        cells[i].x = cells[i - 1].x;
        cells[i].y = cells[i - 1].y;
      }

      const headCell = cells[0];

      if (direction === Direction.RIGHT) {
        headCell.x++;
      } else if (direction === Direction.LEFT) {
        headCell.x--;
      } else if (direction === Direction.UP) {
        headCell.y--;
      } else if (direction === Direction.DOWN) {
        headCell.y++;
      }

      headCell.normalizeForDimensions(width, height);
    }

    addCellAt(position) {
      this._cells.push(new SnakeCell(position.x, position.y));
    }
  }

  class Grid {
    constructor(width, height) {
      this.width = width;
      this.height = height;

      const _grid = {};

      for (let i = 0; i < height; i++) {
        _grid[i] = {};

        for (let j = 0; j < width; j++) {
          _grid[i][j] = EMPTY_CELL;
        }
      }

      this._grid = _grid;
    }

    setCell(pos, cellType) {
      this._grid[pos.y][pos.x] = cellType;
    }

    getCell(pos) {
      return this._grid[pos.y][pos.x];
    }

    getRandomEmptyPosition() {
      let pos;

      for (let i = 0; i < 5; i++) {
        pos = new Position(randomInt(0, this.width), randomInt(0, this.height));
        if (this.getCell(pos) === EMPTY_CELL) {
          return pos;
        }
      }

      const grid = this._grid;
      return pickRandom(Object.keys(grid).reduce(function(arr, key1) {
        const positions = [];

        Object.keys(grid[key1]).forEach((key2) => {
          if (grid[key1][key2] === EMPTY_CELL) {
            positions.push(new Position(key2, key1));
          }
        });

        return arr.concat(positions);
      }, []));
    }
  }

  class FoodController {
    constructor() {
      this._food = [];
      this._generateNextFoodCycle();
    }

    destroyFood(frameCycle, onFoodRemove) {
      const food = this._food;
      food.forEach(function(foodUnit) {
        if (foodUnit.cycle + foodUnit.duration < frameCycle) {
          food.splice(food.indexOf(foodUnit), 1);
          onFoodRemove(foodUnit);
        }
      });
    }

    generateFood(frameCycle, getNewFoodPosition, onFoodAdd) {
      const food = this._food;
      if (frameCycle % MAX_CYCLE_BETWEEN_FOOD === this._nextFoodCycle && food.length < MAX_FOOD) {
        const newFoodPosition = getNewFoodPosition();
        const foodUnit = new FoodUnit(newFoodPosition.x, newFoodPosition.y);
        foodUnit.cycle = frameCycle;
        foodUnit.duration = randomInt(MIN_FOOD_DURATION, MAX_FOOD_DURATION);
        food.push(foodUnit);
        onFoodAdd(foodUnit);
      }

      this._generateNextFoodCycle();
    }

    removeFoodUnitAt(position) {
      const food = this._food;
      for (let i = 0; i < food.length; i++) {
        if (food[i].x === position.x && food[i].y === position.y) {
          food.splice(food.indexOf(food[i]), 1);
          return true;
        }
      }
      return false;
    }

    getPositions() {
      return this._food;
    }

    _generateNextFoodCycle() {
      this._nextFoodCycle = randomInt(0, MAX_CYCLE_BETWEEN_FOOD);
    }
  }

  return {
    Snake,
    FoodController,
    Grid
  };
})();
