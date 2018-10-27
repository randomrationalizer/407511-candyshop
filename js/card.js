// Модуль, работающий с карточками товаров в каталоге и корзине

'use strict';
(function () {
  var productCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
  var productInCartTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');

  window.card = {
    // Создает DOM-элемент карточки товара в каталоге
    createCardElement: function (product) {
      var cardElement = productCardTemplate.cloneNode(true);

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
      var starsRating = '';
      if (product.rating.value === 1) {
        starsRating = 'stars__rating--one';
      } else if (product.rating.value === 2) {
        starsRating = 'stars__rating--two';
      } else if (product.rating.value === 3) {
        starsRating = 'stars__rating--three';
      } else if (product.rating.value === 4) {
        starsRating = 'stars__rating--four';
      } else if (product.rating.value === 5) {
        starsRating = 'stars__rating--five';
      }
      cardElement.querySelector('.stars__rating').classList.add(starsRating);
      cardElement.querySelector('.star__count').textContent = product.rating.number;

      var producSugarContent = '';
      producSugarContent = product.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';
      cardElement.querySelector('.card__characteristic').textContent = producSugarContent + '. ' + product.nutritionFacts.energy + ' ккал';
      cardElement.querySelector('.card__composition-list').textContent = product.nutritionFacts.contents + '.';

      return cardElement;
    },

    // Создает DOM-элемент карточки товара в корзине
    createProductInCartElement: function (productInCart) {
      var productInCartElement = productInCartTemplate.cloneNode(true);
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
    addProductInFavorite: function (evt) {
      if (evt.target.classList.contains('card__btn-favorite')) {
        evt.target.classList.toggle('card__btn-favorite--selected');
        var card = evt.target.closest('.catalog__card');
        var productName = card.querySelector('.card__title').textContent;
        var productObj = window.data.findRelevantProductObj(window.data.productsArray, productName);
        if (evt.target.classList.contains('card__btn-favorite--selected')) {
          window.data.favoriteProductsArray.push(productObj);
        } else {
          window.data.favoriteProductsArray.splice(window.data.favoriteProductsArray.indexOf(productObj), 1);
        }
        evt.target.blur();
      }
    },

    // Проверяет количество товара, и, в зависимости от этого, добавляет карточке товара соответствующий класс
    checkProductAmount: function (product, productCard) {
      if (product.amount === 0) {
        productCard.classList.remove('card--in-stock');
        productCard.classList.remove('card--little');
        productCard.classList.add('card--soon');
      } else if (product.amount >= 1 && product.amount < 5) {
        productCard.classList.add('card--little');
        productCard.classList.remove('card--in-stock');
        productCard.classList.remove('card--soon');
      } else {
        productCard.classList.add('card--in-stock');
        productCard.classList.remove('card--soon');
        productCard.classList.remove('card--little');
      }
    },

    // Находит элемент карточки товара в каталоге по названию продукта
    findRelevantCatalogCard: function (elementsCollection, productName) {
      for (var i = 0; i < elementsCollection.length; i++) {
        if (elementsCollection[i].querySelector('.card__title').textContent === productName) {
          var relevantCardElem = elementsCollection[i];
        }
      }
      return relevantCardElem;
    },

    // Находит элемент карточки товара в корзине по названию продукта
    findRelevantCardInCart: function (elementsCollection, productName) {
      for (var i = 0; i < elementsCollection.length; i++) {
        if (elementsCollection[i].querySelector('.card-order__title').textContent === productName) {
          var relevantCardElem = elementsCollection[i];
        }
      }
      return relevantCardElem;
    }
  };
})();
