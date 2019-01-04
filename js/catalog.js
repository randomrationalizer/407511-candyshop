// Модуль, работающий с каталогом товаров

'use strict';

(function () {
  var catalogListElement = document.querySelector('.catalog__cards');
  var catalogLoadMsgElement = catalogListElement.querySelector('.catalog__load');

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
    catalogListElement.addEventListener('click', window.card.addToFavorites);
  };

  // Добавляет на блок списка товаров в каталоге обработчик события клик, регистрирующий нажатие кнопки "Добавить в корзину"
  var addInCartBtnsClickHandler = function () {
    catalogListElement.addEventListener('click', window.cart.addProduct);
  };

  // Помечает карточки товаров, добаленных в избранное
  var markFavoriteProducts = function () {
    window.data.favorites.forEach(function (product) {
      var productCard = window.card.findInCatalog(product.name);
      if (Boolean(productCard) === true) {
        productCard.querySelector('.card__btn-favorite').classList.add('card__btn-favorite--selected');
      }
    });
  };

  window.catalog = {
    // Отрисовывает карточки товаров на страницу каталога
    renderCards: function (products) {
      var fragment = document.createDocumentFragment();
      products.forEach(function (product) {
        fragment.appendChild(window.card.create(product));
      });
      catalogListElement.appendChild(fragment);
      markFavoriteProducts();
      hideCardsLoadingMsg();
    },

    // Удаляет все карточки товров в каталоге
    deleteCards: function () {
      var catalogCardsElements = [].slice.call(catalogListElement.querySelectorAll('.catalog__card'));
      catalogCardsElements.forEach(function (card) {
        catalogListElement.removeChild(card);
      });
    }
  };

  // Переключает страницу в исходное состояние: карточки товаров не отрисованы, корзина пуста, форма неактивна
  var setPageDefault = function () {
    window.catalog.deleteCards();
    showCardsLoadingMsg();
    window.cart.showMsgEmpty();
    window.order.setPaymentFieldsDefault();
    window.order.setDeliveryFieldsDefault();
    window.order.deactivateForm();
  };

  // Переключает страницу в активное состояние (карточки загрузились)
  var setPageActive = function (downloadedProducts) {
    window.data.products = downloadedProducts;
    window.catalog.renderCards(window.data.products);
    addFavoriteBtnsClickHandler();
    addInCartBtnsClickHandler();
    window.filter.setPriceRangeDefault();
    window.filter.showFilteredItemsCount();
  };

  setPageDefault();

  // Загружает с сервера данные товаров
  window.backend.download(setPageActive, window.util.showErrorMessage);

})();
