// Модуль, генерирющий данные товаров

'use strict';
(function () {
  window.data = {
    // Массив товаров. В него добавляются загруженные с сервера данные товаров
    productsArray: [],

    // Массив товаров в корзине
    productsInCartArray: [],

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
    findRelevantProductObj: function (arr, productName) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].name === productName) {
          var relevantObj = arr[i];
        }
      }
      return relevantObj;
    }
  };
})();
