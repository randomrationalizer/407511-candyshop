// Модуль, работающий с каталогом товаров

'use strict';

(function () {
  var catalogContainerElement = document.querySelector('.catalog__cards-wrap');
  var catalogListElement = catalogContainerElement.querySelector('.catalog__cards');
  var catalogLoadMsgElement = catalogListElement.querySelector('.catalog__load');
  var showMoreBtnElement = catalogContainerElement.querySelector('.catalog__btn-more');

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

  // Масссив неотображенных карточек товаров
  var unshownCards = [];

  // Проверяет количество отрисованных карточек и, в зависимости от этого, отображает кнопку "Покажи ещё"
  var renderShowMoreBtn = function () {
    unshownCards = [].slice.call(catalogListElement.querySelectorAll('.catalog__card'));
    if (unshownCards.length > 6) {
      showNCards(0, 6);
      showMoreBtnElement.classList.remove('visually-hidden');
    } else {
      showNCards(0, unshownCards.length);
    }
  };

  // Добавляет на кнопку "Покажи ещё" обработчик события клик
  var addShowMoreBtnClickHandler = function () {
    showMoreBtnElement.addEventListener('click', showMoreCards);
  };

  // Обработчик события клик по кнопке "Покажи ещё"
  var showMoreCards = function () {
    var cardsElements = catalogListElement.querySelectorAll('.catalog__card');

    // Индекс карточки, с которой отображаются следующие 6
    var cardIndex = cardsElements.length - unshownCards.length;

    if (unshownCards.length >= 6) {
      showNCards(cardIndex, 6);
    } else if (unshownCards.length > 0 && unshownCards.length < 6) {
      showNCards(cardIndex, unshownCards.length);
      showMoreBtnElement.classList.add('visually-hidden');
    }
  };

  // Отображает n карточек товаров
  var showNCards = function (firstCardIndex, count) {
    var catalogCardsElements = catalogListElement.querySelectorAll('.catalog__card');
    for (var i = firstCardIndex; i < (firstCardIndex + count); i++) {
      catalogCardsElements[i].classList.remove('visually-hidden');
      unshownCards.splice(unshownCards.indexOf(catalogCardsElements[i]), 1);
    }
    if (unshownCards.length === 0) {
      showMoreBtnElement.classList.add('visually-hidden');
    } else if (unshownCards.length > 0 && unshownCards.length <= 6) {
      showMoreBtnElement.textContent = 'Покажи ещё ' + unshownCards.length;
    } else {
      showMoreBtnElement.textContent = 'Покажи ещё 6';
    }
  };

  window.catalog = {
    // Отрисовывает карточки товаров на страницу каталога
    renderCards: function (products) {
      var fragment = document.createDocumentFragment();
      products.forEach(function (product) {
        fragment.appendChild(window.card.create(product));
      });
      catalogListElement.appendChild(fragment);
      renderShowMoreBtn();
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
    addShowMoreBtnClickHandler();
    addFavoriteBtnsClickHandler();
    addInCartBtnsClickHandler();
    window.filter.setPriceRangeDefault();
    window.filter.showFilteredItemsCount();
  };

  setPageDefault();

  // Загружает с сервера данные товаров
  window.backend.download(setPageActive, window.util.showErrorMessage);

})();
