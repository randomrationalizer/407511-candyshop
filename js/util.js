// Переменные и функции для общего пользования

'use strict';
(function () {
  window.util = {
    // Возвращает случайное целое число от min до maх (включительно)
    getRandomInt: function (min, max) {
      var randomInt = min + Math.ceil(Math.random() * (max - min));
      return randomInt;
    },

    // Возвращает случайный элемент массива
    getRandomItem: function (arr) {
      var randomItem = arr[this.getRandomInt(0, arr.length - 1)];
      return randomItem;
    },

    // Возвращает массив произвольной длины
    getRandomLengthArr: function (arr) {
      var randomLength = this.getRandomInt(1, arr.length);
      var randomLengthArr = arr.slice(this.getRandomInt(0, randomLength - 1), randomLength);
      return randomLengthArr;
    },

    // Блокирует или разблокирует кнопку
    disableBtn: function (button, isDisabled) {
      if (isDisabled) {
        button.setAttribute('disabled', 'true');
      } else {
        button.removeAttribute('disabled');
      }
    }
  };
})();
