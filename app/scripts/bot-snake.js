SnakeGame.BotSnake = (function() {
  'use strict';

  const {getRandomNonRelativeDirection} = SnakeGame.Utils;

  class BotSnake extends SnakeGame.Snake {
    constructor() {
      super(...arguments);
      this.name = 'BOT';
    }

    decideOnNextMove() {
      if (Math.random() > 0.8) {
        this.scheduleDirectionChange(getRandomNonRelativeDirection());
      }
    }
  }

  return BotSnake;
})();
