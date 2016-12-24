SnakeGame.Utils = (function() {
  'use strict';

  const {Direction} = SnakeGame.Enums;
  const nonRelativeDirections = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
  const names = ['Xandra', 'Xavier', 'Xeus', 'Xenia', 'Xenon', 'Xena', 'Xerxes', 'Xexilia', 'Xadrian', 'Xiu'];

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function pickRandom(arr) {
    return arr[randomInt(0, arr.length)];
  }

  function getRandomNonRelativeDirection() {
    return pickRandom(nonRelativeDirections);
  }

  function getRandomName() {
    return pickRandom(names);
  }

  return {
    randomInt,
    pickRandom,
    getRandomNonRelativeDirection,
    getRandomName
  };
})();
