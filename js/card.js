// Модуль, работающий с карточками товаров в каталоге и корзине

'use strict';
(function () {
  var cardTemplateElement = document.querySelector('#card').content.querySelector('.catalog__card');
  var productInCartTemplateElement = document.querySelector('#card-order').content.querySelector('.goods_card');

  var ratingValueToRatingClass = {
    '1': 'stars__rating--one',
    '2': 'stars__rating--two',
    '3': 'stars__rating--three',
    '4': 'stars__rating--four',
    '5': 'stars__rating--five'
  };

  window.card = {
    // Создает DOM-элемент карточки товара в каталоге
    create: function (product) {
      var cardElement = cardTemplateElement.cloneNode(true);

      var productAvailability = '';
      if (product.amount === 0) {
        productAvailability = 'card--soon';
      } else if (product.amount >= 1 && product.amount < 5) {
        productAvailability = 'card--little';
      } else {
        productAvailability = 'card--in-stock';
      }
      cardElement.classList.add(productAvailability);

      cardElement.querySelector('.card__img').src = 'img/cards/' + product.picture;
      cardElement.querySelector('.card__img').alt = product.kind + ' ' + product.name;
      cardElement.querySelector('.card__title').textContent = product.name;
      cardElement.querySelector('.card__price').insertAdjacentText('afterbegin', product.price + ' ');
      cardElement.querySelector('.card__weight').textContent = '/ ' + product.weight + ' Г';
      cardElement.querySelector('.stars__rating').classList.add(ratingValueToRatingClass[String(product.rating.value)]);
      cardElement.querySelector('.star__count').textContent = product.rating.number;

      var productSugarContent = '';
      productSugarContent = product.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';
      cardElement.querySelector('.card__characteristic').textContent = productSugarContent + '. ' + product.nutritionFacts.energy + ' ккал';
      cardElement.querySelector('.card__composition-list').textContent = product.nutritionFacts.contents + '.';

      return cardElement;
    },

    // Создает DOM-элемент карточки товара в корзине
    createItemInCart: function (productInCart) {
      var productInCartElement = productInCartTemplateElement.cloneNode(true);
      productInCartElement.querySelector('.card-order__title').textContent = productInCart.name;
      productInCartElement.querySelector('img').src = 'img/cards/' + productInCart.picture;
      productInCartElement.querySelector('img').alt = productInCart.kind + ' ' + productInCart.name;
      productInCartElement.querySelector('.card-order__count').name = productInCart.id;
      productInCartElement.querySelector('.card-order__count').value = '' + productInCart.orderedAmount;
      productInCartElement.querySelector('.card-order__count').id = 'card-order__' + productInCart.id;
      productInCartElement.querySelector('.card-order__price').textContent = productInCart.price + '  ₽';
      return productInCartElement;
    },

    // Добавляет/удаляет карточку товара из избранного
    addToFavorites: function (evt) {
      if (evt.target.classList.contains('card__btn-favorite')) {
        evt.target.classList.toggle('card__btn-favorite--selected');
        var cardElement = evt.target.closest('.catalog__card');
        var productName = cardElement.querySelector('.card__title').textContent;
        var productObj = window.data.findProductObj(window.data.products, productName);
        if (evt.target.classList.contains('card__btn-favorite--selected')) {
          window.data.favorites.push(productObj);
        } else {
          window.data.favorites.splice(window.data.favorites.indexOf(productObj), 1);
        }
        window.filter.calculateFavoriteItemsCount();
        evt.target.blur();
      }
    },

    // Проверяет количество товара, и, в зависимости от этого, добавляет карточке товара соответствующий класс
    checkAmount: function (product) {
      var cardElement = window.card.findInCatalog(product.name);
      if (product.amount === 0) {
        cardElement.classList.add('card--soon');
        cardElement.classList.remove('card--in-stock');
        cardElement.classList.remove('card--little');
      } else if (product.amount >= 1 && product.amount < 5) {
        cardElement.classList.add('card--little');
        cardElement.classList.remove('card--in-stock');
        cardElement.classList.remove('card--soon');
      } else {
        cardElement.classList.add('card--in-stock');
        cardElement.classList.remove('card--soon');
        cardElement.classList.remove('card--little');
      }
    },

    // Находит элемент карточки товара в каталоге по названию продукта
    findInCatalog: function (productName) {
      var catalogCardsElements = document.querySelectorAll('.catalog__card');
      for (var i = 0; i < catalogCardsElements.length; i++) {
        if (catalogCardsElements[i].querySelector('.card__title').textContent === productName) {
          var relevantCardElement = catalogCardsElements[i];
          break;
        }
      }
      return relevantCardElement;
    },

    // Находит элемент карточки товара в корзине по названию продукта
    findInCart: function (productName) {
      var cardsInCartElements = document.querySelectorAll('.card-order');
      for (var i = 0; i < cardsInCartElements.length; i++) {
        if (cardsInCartElements[i].querySelector('.card-order__title').textContent === productName) {
          var relevantCardElement = cardsInCartElements[i];
          break;
        }
      }
      return relevantCardElement;
    }
  };
})();
