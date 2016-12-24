SnakeGame.PlayerSnake = (function() {
  'use strict';

  class PlayerSnake extends SnakeGame.Snake {
    constructor(name, position, direction) {
      super(position, direction);
      this.name = name;
    }

    getInputHandler() {
      return (direction) => this.scheduleDirectionChange(direction);
    }
  }

  return PlayerSnake;
})();
