// Модуль, генерирющий данные товаров

'use strict';
(function () {
  window.data = {
    // Массив товаров. В него добавляются загруженные с сервера данные товаров
    productsArray: [],

    // Массив товаров в корзине
    productsInCartArray: [],

    // Массив товаров, добавленных в "Избранное"
    favoriteProductsArray: [],

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
    },

    // Находит минимальное значение цены среди товаров
    findMinPrice: function (products) {
      var minPrice = products[0].price;
      products.forEach(function (product) {
        if (product.price < minPrice) {
          minPrice = product.price;
        }
      });
      return minPrice;
    },

    // Находит максимальное значение цены среди товаров
    findMaxPrice: function (products) {
      var maxPrice = 0;
      products.forEach(function (product) {
        if (product.price > maxPrice) {
          maxPrice = product.price;
        }
      });
      return maxPrice;
    }
  };
})();
