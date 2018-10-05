// Модуль, работающий с каталогом товаров

'use strict';

var catalogListElement = document.querySelector('.catalog__cards');
var catalogLoadMsgElement = document.querySelector('.catalog__load');
var rangeLeftBtnElement = document.querySelector('.range__btn--left');
var rangeRightBtnElement = document.querySelector('.range__btn--right');

// Отрисовывает карточки товаров на страницу каталога
var renderProductCards = function (products) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < products.length; i++) {
    fragment.appendChild(window.card.createCardElement(products[i]));
  }
  catalogListElement.appendChild(fragment);
};

// Показывает или скрывает сообщение о загрузке списка товаров в каталоге
var showCardsLoadingMsg = function (isLoading) {
  if (isLoading) {
    catalogLoadMsgElement.classList.remove('visually-hidden');
    catalogListElement.classList.add('catalog__cards--load');
  } else {
    catalogLoadMsgElement.classList.add('visually-hidden');
    catalogListElement.classList.remove('catalog__cards--load');
  }
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
  showCardsLoadingMsg(true);
  window.cart.showEmptyCartMsg(true);
  window.order.orderFormFieldsDisable(true);
};

// Переключает страницу в активное состояние (карточки загрузились)
var setPageActive = function () {
  showCardsLoadingMsg(false);
  renderProductCards(window.data.productsArray);
  addFavoriteBtnsClickHandler();
  addInCartBtnsClickHandler();
  // addPaymentMethodToggleClickHandler();
  // addDeliveryMethodToggleClickHandler();
  window.filter.setPriceValue(rangeLeftBtnElement);
  window.filter.setPriceValue(rangeRightBtnElement);
};

setPageDefault();
setPageActive();
