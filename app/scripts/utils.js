SnakeGame.Utils = (function() {
  'use strict';

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function pickRandom(arr) {
    return arr[randomInt(0, arr.length)];
  }

  return {
    randomInt,
    pickRandom
  };
})();
