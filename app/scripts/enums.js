(window.SnakeGame = window.SnakeGame || {}).Enums = (function() {
  'use strict';

  return {
    Direction: {
      UP: 1,
      DOWN: 2,
      RIGHT: 3,
      LEFT: 4
    },

    Collision: {
      SNAKE_TO_FOOD: 1,
      SNAKE_TO_SNAKE: 2
    }
  };
})();
