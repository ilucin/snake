(function() {
  'use strict';

  const {screenWidth, screenHeight, render, init: initCanvas, startFrameLoop} = SnakeGame.Canvas;
  const {Direction} = SnakeGame.Enums;
  const startGame = SnakeGame.Game;
  const ui = SnakeGame.Ui;
  const UiEvent = ui.UiEvent;

  ui.on(UiEvent.START, function() {
    let isPaused = false;
    let isFinished = false;

    initCanvas();

    const game = startGame(screenWidth, screenHeight, function onGameEnd() {
      isFinished = true;
      isPaused = true;
      ui.off();
      const playerSnake = game.playerSnakes[0];
      ui.showGameEndPopup(playerSnake.name, playerSnake.isAlive(), playerSnake.score);
    });

    function toggleIsPaused() {
      isPaused = !isPaused;
      document.body.classList[isPaused ? 'add' : 'remove']('is-game-paused');
    }

    ui.on(UiEvent.PAUSE, () => toggleIsPaused());
    ui.on(UiEvent.RELATIVE_LEFT, () => game.inputMoveHandlers[0](Direction.RELATIVE_LEFT));
    ui.on(UiEvent.RELATIVE_RIGHT, () => game.inputMoveHandlers[0](Direction.RELATIVE_RIGHT));
    ui.on(UiEvent.DOWN, () => game.inputMoveHandlers[0](Direction.DOWN));
    ui.on(UiEvent.RIGHT, () => game.inputMoveHandlers[0](Direction.RIGHT));
    ui.on(UiEvent.UP, () => game.inputMoveHandlers[0](Direction.UP));
    ui.on(UiEvent.LEFT, () => game.inputMoveHandlers[0](Direction.LEFT));

    startFrameLoop(function() {
      if (isPaused || isFinished) {
        return;
      }

      game.frameLoop();
      ui.updateStats(game.playerSnakes[0].score);
      render(game);
    });
  });
})();
