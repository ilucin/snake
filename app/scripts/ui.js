SnakeGame.Ui = (function() {
  'use strict';

  const document = window.document;
  const evented = SnakeGame.Evented;
  const Consts = SnakeGame.Consts;

  const UiEvent = {
    RELATIVE_LEFT: 'relative-left',
    RELATIVE_RIGHT: 'relative-right',
    PAUSE: 'pause',
    UP: 'keydown-arrow-up',
    DOWN: 'keydown-arrow-down',
    LEFT: 'keydown-arrow-left',
    RIGHT: 'keydown-arrow-right',
    START: 'start'
  };

  let score;
  const ui = evented({});
  const elMap = Array.prototype.slice.call(document.querySelectorAll('[js]')).reduce(function(obj, el) {
    obj[el.getAttribute('js')] = el;
    return obj;
  }, {});

  function toggleClass(el, klass, val) {
    el.classList[val ? 'add' : 'remove'](klass);
  }

  const popup = (function() {
    let activePopupEl = null;

    function show(el) {
      if (!activePopupEl) {
        toggleClass(el, 'is-shown', true);
        toggleClass(elMap.body, 'is-popup-shown', true);
        activePopupEl = el;
      }
    }

    function hide() {
      if (activePopupEl) {
        toggleClass(activePopupEl, 'is-shown', false);
        toggleClass(elMap.body, 'is-popup-shown', false);
        activePopupEl = null;
      }
    }

    function toggle(el) {
      return activePopupEl ? hide() : show(el);
    }

    function isShown(el) {
      return activePopupEl === el;
    }

    return {show, hide, toggle, isShown};
  })();

  function initMenu() {
    elMap.menuInputSize.value = Consts.CELL_SIZE;
    elMap.menuInputSpeed.value = Consts.FRAME_RATE_DROP;
    elMap.menuInputFood.value = Consts.MAX_FOOD;
  }

  function updateStats(newScore) {
    if (score !== newScore) {
      score = newScore;
      elMap.statsScore.textContent = score;
    }
  }

  function triggerPause() {
    ui.trigger(UiEvent.PAUSE);
    popup.toggle(elMap.menu);
  }

  function reload() {
    window.location.reload();
  }

  function start() {
    elMap.body.removeEventListener('keydown', start);
    popup.hide(elMap.gameStartPopup);
    ui.trigger(UiEvent.START);
  }

  function showGameEndPopup(playerName, isAlive, playerScore) {
    elMap.gameEndPopupScoreValue.textContent = playerScore;
    elMap.gameEndPopupTitle.textContent = `${playerName}, you ${isAlive ? 'rule' : 'suck'}!`;
    popup.show(elMap.gameEndPopup);
  }

  elMap.body.addEventListener('keydown', start);
  elMap.mobileControlLeft.addEventListener('touchstart', () => ui.trigger(UiEvent.RELATIVE_LEFT));
  elMap.mobileControlRight.addEventListener('touchstart', () => ui.trigger(UiEvent.RELATIVE_RIGHT));
  elMap.mobileControlMenu.addEventListener('click', triggerPause);
  elMap.gameEndPopupNewGameButton.addEventListener('click', reload);
  elMap.gameStartPopupStartGameButton.addEventListener('click', start);

  document.addEventListener('keydown', function(ev) {
    if (ev.which === 40) { // arrow down
      ui.trigger(UiEvent.DOWN);
    } else if (ev.which === 39) { // arrow right
      ui.trigger(UiEvent.RIGHT);
    } else if (ev.which === 38) { // arrow up
      ui.trigger(UiEvent.UP);
    } else if (ev.which === 37) { // arrow left
      ui.trigger(UiEvent.LEFT);
    } else if (ev.which === 80) { // p
      triggerPause();
    }
  });

  initMenu();

  popup.show(elMap.gameStartPopup);

  return Object.assign(ui, {UiEvent, updateStats, showGameEndPopup});
})();
