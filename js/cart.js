// Модуль, описывающий работу корзины

'use strict';
(function () {
  var cartListElement = document.querySelector('.goods__cards');
  var emptyCartMsgElement = cartListElement.querySelector('.goods__card-empty');
  var mainHeaderBasketTotalElement = document.querySelector('.main-header__basket');
  var cartTotalElement = document.querySelector('.goods__total');
  var cartTotalCountElement = cartTotalElement.querySelector('.goods__total-count');

  // Отрисовывает карточку товара, добавленного в корзину
  var renderProductInCart = function (productInCart) {
    var cardElement = window.card.createItemInCart(productInCart);
    cartListElement.appendChild(cardElement);
    var closeBtnElement = cardElement.querySelector('.card-order__close');
    closeBtnElement.addEventListener('click', onDeleteBtnClick);
    var arrowBtnsElements = [].slice.call(cardElement.querySelectorAll('.card-order__btn'));
    arrowBtnsElements.forEach(function (button) {
      button.addEventListener('click', onArrowBtnClick);
    });
    var inputProductCountElement = cardElement.querySelector('.card-order__count');
    inputProductCountElement.addEventListener('change', onInputValueChange);
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
    window.data.productsInCart.forEach(function (product) {
      inCartAmount += product.orderedAmount;
      orderTotal += product.price * product.orderedAmount;
    });

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
    cartTotalCountElement.querySelector('.goods__price').textContent = orderTotal + ' ₽';
  };

  // Обработчик события клик на кнопке с крестиком в карточке товара в корзине
  var onDeleteBtnClick = function (evt) {
    if (evt.target.classList.contains('card-order__close')) {
      var cardElement = evt.target.closest('.goods_card');
      deleteProductInCart(cardElement);
    }
  };

  // Удаляет товар из корзины
  var deleteProductInCart = function (productCard) {
    var cardName = productCard.querySelector('.card-order__title').textContent;
    var orderedProductObj = window.data.findProductObj(window.data.productsInCart, cardName);
    var productObj = window.data.findProductObj(window.data.products, cardName);

    window.data.productsInCart.splice(window.data.productsInCart.indexOf(orderedProductObj), 1);
    cartListElement.removeChild(productCard);
    productObj.amount += orderedProductObj.orderedAmount;
    window.card.checkAmount(productObj);

    if (window.data.productsInCart.length === 0) {
      window.cart.showMsgEmpty();
      hideCartTotal();
      window.order.deactivateForm();
    } else {
      changeCartTotal();
    }
  };

  // Изменяет количество товара в корзине при нажатии на кнопки со стрелками
  var onArrowBtnClick = function (evt) {
    var btn = evt.target;
    var cardElement = btn.closest('.goods_card');
    var cardName = cardElement.querySelector('.card-order__title').textContent;
    var productObj = window.data.findProductObj(window.data.products, cardName);
    var orderedProductObj = window.data.findProductObj(window.data.productsInCart, cardName);

    if (btn.classList.contains('card-order__btn--decrease')) {
      productObj.amount++;
      orderedProductObj.orderedAmount--;

      if (orderedProductObj.orderedAmount === 0) {
        window.data.productsInCart.splice(window.data.productsInCart.indexOf(orderedProductObj), 1);
        cartListElement.removeChild(cardElement);
      }

      var increaseBtnElement = cardElement.querySelector('.card-order__btn--increase');
      if (increaseBtnElement.hasAttribute('disabled')) {
        increaseBtnElement.removeAttribute('disabled');
      }

      if (window.data.productsInCart.length === 0) {
        window.cart.showMsgEmpty();
        hideCartTotal();
        window.order.deactivateForm();
      }
    } else if (btn.classList.contains('card-order__btn--increase')) {
      if (productObj.amount > 0) {
        productObj.amount--;
        if (productObj.amount === 0) {
          btn.setAttribute('disabled', 'true');
        }

        orderedProductObj.orderedAmount++;
      }
    }
    cardElement.querySelector('.card-order__count').value = orderedProductObj.orderedAmount;
    window.card.checkAmount(productObj);
    changeCartTotal();
  };

  // Обработчик события изменения значения поля input с количеством товара в корзине
  // При изменении значения поля меняет количество товара в основном массиве продуктов и массиве продуктов в корзине
  // Ограничивает количество товара, которое можно добавить в корзину
  var onInputValueChange = function (evt) {
    var inputField = evt.target;
    var cardElement = inputField.closest('.goods_card');
    var cardName = cardElement.querySelector('.card-order__title').textContent;
    var productObj = window.data.findProductObj(window.data.products, cardName);
    var orderedProductObj = window.data.findProductObj(window.data.productsInCart, cardName);

    var productAmount = parseInt(inputField.value, 10);
    var amountDiff = productAmount - orderedProductObj.orderedAmount;

    if (productAmount > 0) {
      if (amountDiff > 0) {
        if (productObj.amount >= amountDiff) {
          orderedProductObj.orderedAmount = productAmount;
          productObj.amount -= amountDiff;
        } else if (productObj.amount < amountDiff) {
          orderedProductObj.orderedAmount = productAmount - amountDiff + productObj.amount;
          productObj.amount = 0;
          inputField.value = orderedProductObj.orderedAmount;
        }
      } else if (amountDiff < 0) {
        orderedProductObj.orderedAmount = productAmount;
        productObj.amount -= amountDiff;
      }
    } else if (productAmount === 0) {
      productObj.amount += orderedProductObj.orderedAmount;
      window.data.productsInCart.splice(window.data.productsInCart.indexOf(orderedProductObj), 1);
      cartListElement.removeChild(cardElement);
      if (window.data.productsInCart.length === 0) {
        window.cart.showMsgEmpty();
        hideCartTotal();
      }
    } else if (productAmount < 0) {
      inputField.value = 1;
      productAmount = 1;
      productObj.amount += orderedProductObj.orderedAmount - productAmount;
      orderedProductObj.orderedAmount = productAmount;
    }
    window.card.checkAmount(productObj);
    changeCartTotal();
  };

  // Cкрывает сообщение о пустой корзине
  var hideEmptyCartMsg = function () {
    emptyCartMsgElement.classList.add('visually-hidden');
    cartListElement.classList.remove('goods__cards--empty');
  };

  // Находит элемент карточки товара в корзине по названию продукта
  var findCardInCart = function (productName) {
    var cardsInCartElements = document.querySelectorAll('.card-order');
    for (var i = 0; i < cardsInCartElements.length; i++) {
      if (cardsInCartElements[i].querySelector('.card-order__title').textContent === productName) {
        var relevantCardElement = cardsInCartElements[i];
        break;
      }
    }
    return relevantCardElement;
  };

  window.cart = {
    // Показывает сообщение о пустой корзине
    showMsgEmpty: function () {
      emptyCartMsgElement.classList.remove('visually-hidden');
      cartListElement.classList.add('goods__cards--empty');
      mainHeaderBasketTotalElement.textContent = 'В корзине ничего нет';
    },

    // Добавляет товар в корзину
    addProduct: function (evt) {
      if (evt.target.classList.contains('card__btn')) {
        var inCartBtn = evt.target;
        var cardElement = inCartBtn.closest('.catalog__card');
        var cardName = cardElement.querySelector('.card__title').textContent;
        var productObj = window.data.findProductObj(window.data.products, cardName);
        var orderedProductObj = window.data.findProductObj(window.data.productsInCart, cardName);

        if (window.data.productsInCart.length === 0 && productObj.amount > 0) {
          hideEmptyCartMsg();
          showCartTotal();
          window.order.activateForm();
        }

        inCartBtn.blur();

        if (productObj.amount > 0) {
          productObj.amount--;
          window.card.checkAmount(productObj);
          // Проверяет, есть ли уже такой товар в корзине
          if (Boolean(orderedProductObj) === false) {
            orderedProductObj = window.data.createOrderedProduct(productObj);
            orderedProductObj.orderedAmount++;
            window.data.productsInCart.push(orderedProductObj);
            renderProductInCart(orderedProductObj);
          } else {
            orderedProductObj.orderedAmount++;
            var orderedProductCardElement = findCardInCart(cardName);
            orderedProductCardElement.querySelector('.card-order__count').value++;
          }
          changeCartTotal();
        }
      }
    },

    // Удаляет карточки товаров из корзины при успешной отправке заказа
    clear: function () {
      var cartCardsElements = [].slice.call(cartListElement.querySelectorAll('.card-order'));
      cartCardsElements.forEach(function (card) {
        cartListElement.removeChild(card);
      });
      window.data.productsInCart.length = 0;
      window.cart.showMsgEmpty();
      hideCartTotal();
    }
  };
})();
