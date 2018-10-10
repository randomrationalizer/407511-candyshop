// Модуль, работающий с каталогом товаров

'use strict';

(function () {
  var catalogListElement = document.querySelector('.catalog__cards');
  var catalogLoadMsgElement = document.querySelector('.catalog__load');
  var rangeLeftBtnElement = document.querySelector('.range__btn--left');
  var rangeRightBtnElement = document.querySelector('.range__btn--right');

  // Отрисовывает карточки товаров на страницу каталога
  var renderProductCards = function (data) {
    // Записывает загруженные данные в массив товаров productsArray
    window.data.productsArray = data;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      fragment.appendChild(window.card.createCardElement(data[i]));
    }
    catalogListElement.appendChild(fragment);
    hideCardsLoadingMsg();
  };

  // Показывает сообщение о загрузке списка товаров в каталоге
  var showCardsLoadingMsg = function () {
    catalogLoadMsgElement.classList.remove('visually-hidden');
    catalogListElement.classList.add('catalog__cards--load');
  };

  // Скрывает сообщение о загрузке списка товаров в каталоге
  var hideCardsLoadingMsg = function () {
    catalogLoadMsgElement.classList.add('visually-hidden');
    catalogListElement.classList.remove('catalog__cards--load');
  };

  // Добавляет обработчик события клик на каталог товаров, регистрирующий нажатие кнопки "Добавить в избранное" на карточках товаров
  var addFavoriteBtnsClickHandler = function () {
    catalogListElement.addEventListener('click', window.card.addProductInFavorite);
  };

  // Добавляет на блок списка товаров в каталоге обработчик события клик, регистрирующий нажатие кнопки "Добавить в корзину"
  var addInCartBtnsClickHandler = function () {
    catalogListElement.addEventListener('click', window.cart.addProductInCart);
  };

  // Удаляет все карточки товров в каталоге
  var deleteProductCards = function () {
    var catalogCards = catalogListElement.querySelectorAll('.catalog__card');
    for (var i = 0; i < catalogCards.length; i++) {
      catalogListElement.removeChild(catalogCards[i]);
    }
  };

  // Переключает страницу в исходное состояние: карточки товаров не отрисованы, корзина пуста, форма неактивна
  var setPageDefault = function () {
    deleteProductCards();
    showCardsLoadingMsg();
    window.cart.showEmptyCartMsg();
    window.order.setPaymentFieldsDefault();
    window.order.setDeliveryFieldsDefault();
    window.order.deactivateOrderForm();
  };

  // Переключает страницу в активное состояние (карточки загрузились)
  var setPageActive = function () {
    window.backend.download(renderProductCards, window.util.showErrorMessage);
    addFavoriteBtnsClickHandler();
    addInCartBtnsClickHandler();
    window.filter.setPriceValue(rangeLeftBtnElement);
    window.filter.setPriceValue(rangeRightBtnElement);
  };

  setPageDefault();
  setPageActive();

})();
