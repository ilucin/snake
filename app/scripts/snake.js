SnakeGame.Snake = (function() {
  'use strict';

  const SnakeGame = window.SnakeGame;
  const {Direction} = SnakeGame.Enums;
  const {Position, CellCollection} = SnakeGame.Classes;

  const RelativeLeftDirectionMap = {};
  RelativeLeftDirectionMap[Direction.UP] = Direction.LEFT;
  RelativeLeftDirectionMap[Direction.LEFT] = Direction.DOWN;
  RelativeLeftDirectionMap[Direction.DOWN] = Direction.RIGHT;
  RelativeLeftDirectionMap[Direction.RIGHT] = Direction.UP;

  const RelativeRightDirectionMap = {};
  RelativeRightDirectionMap[Direction.UP] = Direction.RIGHT;
  RelativeRightDirectionMap[Direction.RIGHT] = Direction.DOWN;
  RelativeRightDirectionMap[Direction.DOWN] = Direction.LEFT;
  RelativeRightDirectionMap[Direction.LEFT] = Direction.UP;

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
      let newDirection = direction;
      if (direction === Direction.RELATIVE_LEFT) {
        newDirection = RelativeLeftDirectionMap[this._direction];
      } else if (direction === Direction.RELATIVE_RIGHT) {
        newDirection = RelativeRightDirectionMap[this._direction];
      }

      this._scheduledDirectionChanges.push(newDirection);
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
        cells[i] = cells[i - 1].clone();
      }

      const headCell = cells[0].clone();

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
      cells[0] = headCell;
    }

    addCellAt(position) {
      this._cells.push(new SnakeCell(position.x, position.y));
    }
  }

  return Snake;
})();
