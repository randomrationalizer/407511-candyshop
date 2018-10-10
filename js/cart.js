// Модуль, описывающий работу корзины

'use strict';
(function () {
  var catalogListElement = document.querySelector('.catalog__cards');
  var cartListElement = document.querySelector('.goods__cards');
  var emptyCartMsgElement = document.querySelector('.goods__card-empty');
  var mainHeaderBasketTotalElement = document.querySelector('.main-header__basket');
  var cartTotalElement = document.querySelector('.goods__total');
  var cartTotalCountElement = cartTotalElement.querySelector('.goods__total-count');

  // Отрисовывает карточку товара, добавленного в корзину
  var renderProductInCart = function (productInCart) {
    var cardElement = window.card.createProductInCartElement(productInCart);
    cartListElement.appendChild(cardElement);
    var closeBtn = cardElement.querySelector('.card-order__close');
    closeBtn.addEventListener('click', onDeleteBtnClick);
    var arrowBtns = cardElement.querySelectorAll('.card-order__btn');
    for (var i = 0; i < arrowBtns.length; i++) {
      arrowBtns[i].addEventListener('click', onArrowBtnClick);
    }
    var inputProductCount = cardElement.querySelector('.card-order__count');
    inputProductCount.addEventListener('change', onInputValueChange);
  };

  // Показывает или скрывает сообщение о количестве товаров в корзине и итоговой сумме заказа
  var showCartTotal = function () {
    cartTotalElement.classList.remove('visually-hidden');
  };

  // Показывает или скрывает сообщение о количестве товаров в корзине и итоговой сумме заказа
  var hideCartTotal = function () {
    cartTotalElement.classList.add('visually-hidden');
  };

  // Обновляет информацию о количестве товаров в корзине и сумме заказа
  var changeCartTotal = function () {
    var inCartAmount = 0;
    var orderTotal = 0;
    for (var i = 0; i < window.data.productsInCartArray.length; i++) {
      inCartAmount += window.data.productsInCartArray[i].orderedAmount;
      orderTotal += window.data.productsInCartArray[i].price * window.data.productsInCartArray[i].orderedAmount;
    }

    var ending = '';
    var amount = inCartAmount.toString().split('');
    var lastNumber = parseInt(amount[amount.length - 1], 10);
    var penultimateNumber = parseInt(amount[amount.length - 2], 10);
    if (lastNumber === 1 && penultimateNumber !== 1) {
      ending = '';
    } else if (lastNumber >= 2 && lastNumber <= 4 && penultimateNumber !== 1) {
      ending = 'а';
    } else if (penultimateNumber === 1) {
      ending = 'ов';
    } else {
      ending = 'ов';
    }
    mainHeaderBasketTotalElement.textContent = 'В корзине ' + inCartAmount + ' товар' + ending + ' на ' + orderTotal + ' ₽';
    cartTotalCountElement.textContent = 'Итого за ' + inCartAmount + ' товар' + ending + ': ';
    var totalPrice = '<span class="goods__price"></span>';
    cartTotalCountElement.insertAdjacentHTML('beforeEnd', totalPrice);
    document.querySelector('.goods__price').textContent = orderTotal + ' ₽';
  };

  // Обработчик события клик на кнопке с крестиком в карточке товара в корзине
  var onDeleteBtnClick = function (evt) {
    if (evt.target.classList.contains('card-order__close')) {
      var card = evt.target.closest('.goods_card');
      deleteProductInCart(card);
    }
  };

  // Удаляет товар из корзины
  var deleteProductInCart = function (productCard) {
    var cardName = productCard.querySelector('.card-order__title').textContent;

    var orderedProduct = window.data.findRelevantProductObj(window.data.productsInCartArray, cardName);
    var productAmount = orderedProduct.orderedAmount;
    window.data.productsInCartArray.splice(window.data.productsInCartArray.indexOf(orderedProduct), 1);
    cartListElement.removeChild(productCard);

    var productObj = window.data.findRelevantProductObj(window.data.productsArray, cardName);
    productObj.amount += productAmount;
    var catalogCards = catalogListElement.querySelectorAll('.catalog__card');
    var productCatalogCard = window.card.findRelevantCatalogCard(catalogCards, cardName);
    window.card.checkProductAmount(productObj, productCatalogCard);

    if (window.data.productsInCartArray.length === 0) {
      window.cart.showEmptyCartMsg();
      hideCartTotal();
      window.order.deactivateOrderForm();
    } else {
      changeCartTotal();
    }
  };

  // Изменяет количество товара в корзине при нажатии на кнопки со стрелками
  var onArrowBtnClick = function (evt) {
    var btn = evt.target;
    var card = btn.closest('.goods_card');
    var cardName = card.querySelector('.card-order__title').textContent;
    var productObj = window.data.findRelevantProductObj(window.data.productsArray, cardName);
    var orderedProductObj = window.data.findRelevantProductObj(window.data.productsInCartArray, cardName);
    var catalogCards = catalogListElement.querySelectorAll('.catalog__card');
    var productCatalogCard = window.card.findRelevantCatalogCard(catalogCards, cardName);
    var productAmount = card.querySelector('.card-order__count').value;

    if (btn.classList.contains('card-order__btn--decrease')) {
      productObj.amount++;
      productAmount--;

      if (productAmount === 0) {
        window.data.productsInCartArray.splice(window.data.productsInCartArray.indexOf(orderedProductObj), 1);
        cartListElement.removeChild(card);
      }

      var increaseBtn = card.querySelector('.card-order__btn--increase');
      if (increaseBtn.hasAttribute('disabled')) {
        increaseBtn.removeAttribute('disabled');
      }

      if (window.data.productsInCartArray.length === 0) {
        window.cart.showEmptyCartMsg();
        hideCartTotal();
        window.order.deactivateOrderForm();
      }
    } else if (evt.target.classList.contains('card-order__btn--increase')) {
      if (productObj.amount > 0) {
        productObj.amount--;
        if (productObj.amount === 0) {
          btn.setAttribute('disabled', 'true');
        }

        productAmount++;
      }
    }
    card.querySelector('.card-order__count').value = productAmount;
    orderedProductObj.orderedAmount = productAmount;
    window.card.checkProductAmount(productObj, productCatalogCard);
    changeCartTotal();
  };

  // Обработчик события изменения значения поля input с количеством товара в корзине
  // При изменении значения поля меняет количество товара в основном массиве продуктов и массиве продуктов в корзине
  // Ограничивает количество товара, которое можно добавить в корзину
  var onInputValueChange = function (evt) {
    var input = evt.target;
    var card = input.closest('.goods_card');
    var cardName = card.querySelector('.card-order__title').textContent;
    var productObj = window.data.findRelevantProductObj(window.data.productsArray, cardName);
    var orderedProductObj = window.data.findRelevantProductObj(window.data.productsInCartArray, cardName);
    var catalogCards = catalogListElement.querySelectorAll('.catalog__card');
    var productCatalogCard = window.card.findRelevantCatalogCard(catalogCards, cardName);

    var productAmount = parseInt(input.value, 10);
    var amountDiff = productAmount - orderedProductObj.orderedAmount;

    if (productAmount > 0) {
      if (amountDiff > 0) {
        if (productObj.amount >= amountDiff) {
          orderedProductObj.orderedAmount = productAmount;
          productObj.amount -= amountDiff;
        } else if (productObj.amount < amountDiff) {
          orderedProductObj.orderedAmount = productAmount - amountDiff + productObj.amount;
          productObj.amount = 0;
          input.value = orderedProductObj.orderedAmount;
        }
      } else if (amountDiff < 0) {
        orderedProductObj.orderedAmount = productAmount;
        productObj.amount -= amountDiff;
      }
      window.card.checkProductAmount(productObj, productCatalogCard);
      changeCartTotal();
    } else if (productAmount === 0) {
      productObj.amount += orderedProductObj.orderedAmount;
      window.data.productsInCartArray.splice(window.data.productsInCartArray.indexOf(orderedProductObj), 1);
      cartListElement.removeChild(card);
      window.card.checkProductAmount(productObj, productCatalogCard);
      changeCartTotal();
      if (window.data.productsInCartArray.length === 0) {
        window.cart.showEmptyCartMsg();
        hideCartTotal();
      }
    } else if (productAmount < 0) {
      input.value = 1;
      productAmount = 1;
      productObj.amount += orderedProductObj.orderedAmount - productAmount;
      orderedProductObj.orderedAmount = productAmount;
      window.card.checkProductAmount(productObj, productCatalogCard);
      changeCartTotal();
    }
  };

  window.cart = {
    // Показывает или скрывает сообщение о пустой корзине
    showEmptyCartMsg: function () {
      emptyCartMsgElement.classList.remove('visually-hidden');
      cartListElement.classList.add('goods__cards--empty');
      mainHeaderBasketTotalElement.textContent = 'В корзине ничего нет';
    },

    // Cкрывает сообщение о пустой корзине
    hideEmptyCartMsg: function () {
      emptyCartMsgElement.classList.add('visually-hidden');
      cartListElement.classList.remove('goods__cards--empty');
    },

    // Добавляет товар в корзину
    addProductInCart: function (evt) {
      if (evt.target.classList.contains('card__btn')) {
        var inCartBtn = evt.target;
        var card = inCartBtn.closest('.catalog__card');
        var cardName = card.querySelector('.card__title').textContent;
        var productObj = window.data.findRelevantProductObj(window.data.productsArray, cardName);
        var orderedProductObj = window.data.findRelevantProductObj(window.data.productsInCartArray, cardName);

        if (window.data.productsInCartArray.length === 0 && productObj.amount > 0) {
          window.cart.hideEmptyCartMsg();
          showCartTotal();
          window.order.activateORderForm();
        }

        inCartBtn.blur();

        if (productObj.amount > 0) {
          productObj.amount--;
          window.card.checkProductAmount(productObj, card);
          // Проверяет, есть ли уже такой товар в корзине
          if (Boolean(orderedProductObj) === false) {
            orderedProductObj = window.data.createOrderedProduct(productObj);
            orderedProductObj.orderedAmount++;
            window.data.productsInCartArray.push(orderedProductObj);
            renderProductInCart(orderedProductObj);
          } else {
            orderedProductObj.orderedAmount++;
            var cartCards = document.querySelectorAll('.card-order');
            var productInCartCard = window.card.findRelevantCardInCart(cartCards, cardName);
            productInCartCard.querySelector('.card-order__count').value++;
          }
          changeCartTotal();
        }
      }
    },

    // Удаляет карточки товаров из корзины при успешной отправке заказа
    clearCart: function () {
      var cartCardsElements = cartListElement.querySelectorAll('.card-order');
      for (var i = 0; i < cartCardsElements.length; i++) {
        cartListElement.removeChild(cartCardsElements[i]);
      }
      window.data.productsInCartArray.length = 0;
      window.cart.showEmptyCartMsg();
      hideCartTotal();
    }
  };
})();
