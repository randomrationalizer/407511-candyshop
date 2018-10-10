// Переменные и функции для общего пользования

'use strict';
(function () {
  var ESC_KEY_CODE = 27;

  var modalErrorElement = document.querySelector('.modal--error');
  var modalErrorMessageElement = modalErrorElement.querySelector('.modal__message');
  var modalCloseBtnElement = modalErrorElement.querySelector('.modal__close');

  // Закрывает модальное окно с сообщением об ошибке по нажатию Esc
  var onEscPress = function (evt) {
    window.util.isEscEvent(evt, window.util.hideErrorMessage);
  };

  window.util = {
    // Обработчик события по нажатию esc
    isEscEvent: function (evt, cb) {
      if (evt.keyCode === ESC_KEY_CODE) {
        cb();
      }
    },

    // Показывает модальное окно с сообщением об ошибке
    showErrorMessage: function (errorMessage) {
      modalErrorElement.classList.remove('modal--hidden');
      modalErrorMessageElement.textContent = errorMessage;
      modalCloseBtnElement.addEventListener('click', window.util.hideErrorMessage);
      document.addEventListener('keydown', onEscPress);
    },

    // Скрывает модальное окно с сообщением об ошибке
    hideErrorMessage: function () {
      modalErrorElement.classList.add('modal--hidden');
      modalCloseBtnElement.removeEventListener('click', window.util.hideErrorMessage);
      document.removeEventListener('keydown', onEscPress);
    }
  };
})();
