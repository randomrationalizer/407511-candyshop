// Модуль фильтрации товаров

'use strict';
(function () {
  var MIN_POS_X = 0;
  var MAX_POS_X = 245;
  var maxPrice = 100;

  var rangeFilterElement = document.querySelector('.range__filter');
  var rangeBtnElements = rangeFilterElement.querySelectorAll('.range__btn');
  var rangePricesElement = document.querySelector('.range__prices');
  var rangeMinPriceElement = rangePricesElement.querySelector('.range__price--min');
  var rangeMaxPriceElement = rangePricesElement.querySelector('.range__price--max');
  var rangeLeftBtnElement = rangeFilterElement.querySelector('.range__btn--left');
  var rangeRightBtnElement = rangeFilterElement.querySelector('.range__btn--right');
  var rangeLineFillElement = rangeFilterElement.querySelector('.range__fill-line');
  var rangeWidth = rangeFilterElement.offsetWidth;

  // Механизм перетаскивания ползунков фильтра по цене
  var addRangeBtnHandlers = function () {
    for (var i = 0; i < rangeBtnElements.length; i++) {
      rangeBtnElements[i].addEventListener('mousedown', function (evt) {
        evt.preventDefault();

        var startCoords = {
          x: evt.clientX,
          y: evt.target.offsetTop
        };

        var onMouseMove = function (moveEvt) {
          moveEvt.preventDefault();
          var shift = {
            x: startCoords.x - moveEvt.clientX,
            y: 0
          };

          startCoords = {
            x: moveEvt.clientX,
            y: evt.target.offsetTop
          };

          evt.target.style.left = (evt.target.offsetLeft - shift.x) + 'px';
          evt.target.style.top = evt.target.offsetTop + 'px';
          limitRangeBtnMovement(evt.target);
          window.filter.setPriceValue(evt.target);
          changeRangeLineFill();
        };

        var onMouseUp = function (upEvt) {
          upEvt.preventDefault();
          window.filter.setPriceValue(evt.target);
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    }
  };

  // Ограничивает область перетаскивания ползунков фильтра по цене
  var limitRangeBtnMovement = function (btn) {
    if (btn.offsetLeft < MIN_POS_X) {
      btn.style.left = MIN_POS_X + 'px';
    } else if (btn.offsetLeft > MAX_POS_X) {
      btn.style.left = MAX_POS_X + 'px';
    } else if (btn === rangeLeftBtnElement && btn.offsetLeft > rangeRightBtnElement.offsetLeft) {
      btn.style.left = rangeRightBtnElement.offsetLeft + 'px';
    } else if (btn === rangeRightBtnElement && btn.offsetLeft < rangeLeftBtnElement.offsetLeft) {
      btn.style.left = rangeLeftBtnElement.offsetLeft + 'px';
    }
  };

  // Задает размеры полосы заливки между ползунками фильтра по цене
  var changeRangeLineFill = function () {
    rangeLineFillElement.style.left = rangeLeftBtnElement.style.left;
    rangeLineFillElement.style.right = (rangeWidth - parseInt(rangeRightBtnElement.style.left, 10)) + 'px';
  };

  addRangeBtnHandlers();

  window.filter = {
    // Задает значение полей мминимальной и максимальной цены при перемещении ползунка фильтра по цене
    setPriceValue: function (btn) {
      var positionX = btn.offsetLeft;
      var priceValue = (positionX * maxPrice) / rangeWidth;

      if (btn === rangeLeftBtnElement) {
        rangeMinPriceElement.textContent = parseInt(priceValue, 10);
      } else if (btn === rangeRightBtnElement) {
        rangeMaxPriceElement.textContent = parseInt(priceValue, 10);
      }
    }
  };
})();
