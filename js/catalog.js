// Модуль, работающий с каталогом товаров

'use strict';

(function () {
  var catalogListElement = document.querySelector('.catalog__cards');
  var catalogLoadMsgElement = document.querySelector('.catalog__load');

  // Записывает загруженные с сервера данные товаров в массив товаров productsArray
  var createProductsArray = function (productsData) {
    window.data.productsArray = productsData;
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

  // Помечает карточки товаров, добаленных в избранное
  var markFavoriteProducts = function () {
    var catalogCards = catalogListElement.querySelectorAll('.catalog__card');
    window.data.favoriteProductsArray.forEach(function (product) {
      var productCard = window.card.findRelevantCatalogCard(catalogCards, product.name);
      if (Boolean(productCard) === true) {
        productCard.querySelector('.card__btn-favorite').classList.add('card__btn-favorite--selected');
      }
    });
  };

  window.catalog = {
    // Отрисовывает карточки товаров на страницу каталога
    renderProductCards: function (products) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < products.length; i++) {
        fragment.appendChild(window.card.createCardElement(products[i]));
      }
      catalogListElement.appendChild(fragment);
      markFavoriteProducts();
      hideCardsLoadingMsg();
    },

    // Удаляет все карточки товров в каталоге
    deleteProductCards: function () {
      var catalogCards = catalogListElement.querySelectorAll('.catalog__card');
      for (var i = 0; i < catalogCards.length; i++) {
        catalogListElement.removeChild(catalogCards[i]);
      }
    }
  };

  // Переключает страницу в исходное состояние: карточки товаров не отрисованы, корзина пуста, форма неактивна
  var setPageDefault = function () {
    window.catalog.deleteProductCards();
    showCardsLoadingMsg();
    window.cart.showEmptyCartMsg();
    window.order.setPaymentFieldsDefault();
    window.order.setDeliveryFieldsDefault();
    window.order.deactivateOrderForm();
  };

  // Переключает страницу в активное состояние (карточки загрузились)
  var setPageActive = function (data) {
    createProductsArray(data);
    window.catalog.renderProductCards(window.data.productsArray);
    addFavoriteBtnsClickHandler();
    addInCartBtnsClickHandler();
    window.filter.setPriceFilterDefault();
    window.filter.showFilteredItemsCount();
  };

  setPageDefault();

  // Загружает с сервера данные товаров
  window.backend.download(setPageActive, window.util.showErrorMessage);

})();
