// Модуль, генерирющий данные товаров

'use strict';
(function () {
  window.data = {
    // Массив товаров. В него добавляются загруженные с сервера данные товаров
    products: [],

    // Массив товаров в корзине
    productsInCart: [],

    // Массив товаров, добавленных в "Избранное"
    favorites: [],

    // Создает объект товара, добавленного в корзину
    createOrderedProduct: function (product) {
      var orderedProduct = {};
      Object.assign(orderedProduct, product);
      orderedProduct.orderedAmount = 0;
      orderedProduct.id = orderedProduct.picture.slice(0, -4);
      delete orderedProduct.amount;
      delete orderedProduct.nutritionFacts;
      delete orderedProduct.weight;
      delete orderedProduct.rating;
      return orderedProduct;
    },

    // Находит объект товара в массиве товаров по имени
    findProductObj: function (products, productName) {
      for (var i = 0; i < products.length; i++) {
        if (products[i].name === productName) {
          var relevantObj = products[i];
          break;
        }
      }
      return relevantObj;
    }
  };
})();
