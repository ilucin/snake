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
    RIGHT: 'keydown-arrow-right'
  };

  let isMenuShown = false;
  const ui = evented({UiEvent});
  const mobileControlLeftEl = document.querySelector('.js-mobile-control-left');
  const mobileControlRightEl = document.querySelector('.js-mobile-control-right');
  const mobileControlMenuEl = document.querySelector('.js-mobile-control-menu');
  const menuEl = document.querySelector('.js-menu');
  const menuInputSize = menuEl.querySelector('.js-menu-input-size');
  const menuInputSpeed = menuEl.querySelector('.js-menu-input-speed');
  const menuInputFood = menuEl.querySelector('.js-menu-input-food');

  function toggleMenu() {
    isMenuShown = !isMenuShown;
    document.body.classList[isMenuShown ? 'add' : 'remove']('is-menu-shown');
  }

  function initMenu() {
    menuInputSize.value = Consts.CELL_SIZE;
    menuInputSpeed.value = Consts.FRAME_RATE_DROP;
    menuInputFood.value = Consts.MAX_FOOD;
  }

  function triggerPause() {
    ui.trigger(UiEvent.PAUSE);
    toggleMenu();
  }

  mobileControlLeftEl.addEventListener('touchstart', () => ui.trigger(UiEvent.RELATIVE_LEFT));
  mobileControlRightEl.addEventListener('touchstart', () => ui.trigger(UiEvent.RELATIVE_RIGHT));
  mobileControlMenuEl.addEventListener('click', triggerPause);

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

  setTimeout(function() {
    ui.trigger(UiEvent.PAUSE);
    toggleMenu();
  }, 100);

  return ui;
})();
