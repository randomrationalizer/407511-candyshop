// Модуль, описывающий работу формы заказа

'use strict';
(function () {
  var orderFormInputElements = document.querySelector('.order').querySelectorAll('input');
  var formSubmitBtnElement = document.querySelector('.buy__submit-btn');
  var telInputElement = document.querySelector('#contact-data__tel');
  var nameInputElement = document.querySelector('#contact-data__name');
  var paymentMethodsToggleElement = document.querySelector('.payment__method');
  var paymentCardElement = document.querySelector('.payment__card-wrap');
  var cardInputElements = paymentCardElement .querySelectorAll('input');
  var cardDataElement = paymentCardElement.querySelector('.payment__inputs');
  var cardNumberInputElement = cardDataElement.querySelector('#payment__card-number');
  var cardDateInputElement = cardDataElement.querySelector('#payment__card-date');
  var cardholderInputElement = cardDataElement.querySelector('#payment__cardholder');
  var cardCvcInputElement = cardDataElement.querySelector('#payment__card-cvc');
  var cardErrorMsgElement = cardDataElement.querySelector('.payment__error-message');
  var cardStatusElement = cardDataElement.querySelector('.payment__card-status');
  var paymentCashElement = document.querySelector('.payment__cash-wrap');
  var deliveryMethodsToggleElement = document.querySelector('.deliver__toggle');
  var storeDeliveryToggler = deliveryMethodsToggleElement.querySelector('#deliver__store');
  var courierDeliveryToggler = deliveryMethodsToggleElement.querySelector('#deliver__courie');
  var storeDeliveryElement = document.querySelector('.deliver__store');
  var storeDeliveryInputElements = storeDeliveryElement.querySelectorAll('input');
  var storeDeliveryMapImgElement = storeDeliveryElement.querySelector('.deliver__store-map-img');
  var courierDeliveryElement = document.querySelector('.deliver__courier');
  var courierDeliveryInputElements = courierDeliveryElement.querySelectorAll('input');
  var courierDeliveryDescriptonElement = courierDeliveryElement.querySelector('.deliver__textarea');
  var courierDeliveryFloorElement = courierDeliveryElement.querySelector('#deliver__floor');

  // Блокирует поля формы из коллекции
  var blockInputFileds = function (inputFields, isBlocked) {
    if (isBlocked) {
      for (var i = 0; i < inputFields.length; i++) {
        inputFields[i].setAttribute('disabled', 'true');
        inputFields[i].removeAttribute('required');
      }
    } else if (!isBlocked) {
      for (var j = 0; j < inputFields.length; j++) {
        inputFields[j].removeAttribute('disabled');
        inputFields[j].setAttribute('required', 'true');
      }
    }
  };

  // Показывает/скрывает лишние блоки полей формы при выборе способа оплаты
  var togglePaymentMethod = function (evt) {
    if (evt.target.name === 'pay-method') {
      if (evt.target.id === 'payment__card') {
        paymentCardElement.classList.remove('visually-hidden');
        paymentCashElement.classList.add('visually-hidden');
        blockInputFileds(cardInputElements, false);
      } else if (evt.target.id === 'payment__cash') {
        paymentCardElement.classList.add('visually-hidden');
        paymentCashElement.classList.remove('visually-hidden');
        blockInputFileds(cardInputElements, true);
      }
    }
  };

  // Добавляет на блок формы оплаты обработчик, регистрирующий клик по кнопке со способом оплаты
  // var addPaymentMethodToggleClickHandler = function () {
  //   paymentMethodsToggleElement.addEventListener('click', togglePaymentMethod);
  // };
  paymentMethodsToggleElement.addEventListener('click', togglePaymentMethod);

  // Показывает/скрывает лишние блоки полей формы при выборе способа доставки
  var toggleDeliveryMethod = function (evt) {
    if (evt.target.name === 'method-deliver') {
      if (evt.target.id === 'deliver__store') {
        storeDeliveryElement.classList.remove('visually-hidden');
        courierDeliveryElement.classList.add('visually-hidden');
        blockInputFileds(courierDeliveryInputElements, true);
        blockInputFileds(storeDeliveryInputElements, false);
        courierDeliveryDescriptonElement.setAttribute('disabled', 'true');
      } else if (evt.target.id === 'deliver__courier') {
        storeDeliveryElement.classList.add('visually-hidden');
        courierDeliveryElement.classList.remove('visually-hidden');
        blockInputFileds(courierDeliveryInputElements, false);
        blockInputFileds(storeDeliveryInputElements, true);
        courierDeliveryDescriptonElement.removeAttribute('disabled');
      }
    }
  };

  // Добавляет на блок выбора способа доставки обработчик, регистрирующий клик по кнопке со способом доставки
  // var addDeliveryMethodToggleClickHandler = function () {
  //   deliveryMethodsToggleElement.addEventListener('click', toggleDeliveryMethod);
  // };
  deliveryMethodsToggleElement.addEventListener('click', toggleDeliveryMethod);


  // Добавляет обработчик валидации для поля телефона
  telInputElement.addEventListener('input', function (evt) {
    if (evt.target.validity.patternMismatch) {
      evt.target.setCustomValidity('Введите номер телефона в формате +79998887766 или 89998887766');
    } else {
      evt.target.setCustomValidity('');
    }
  });

  // Добавляет обработчик валидации для поля имя пользователя
  nameInputElement.addEventListener('input', function (evt) {
    if (evt.target.validity.patternMismatch) {
      evt.target.setCustomValidity('Имя не должно содержать цифр');
    } else if (evt.target.validity.tooShort) {
      evt.target.setCustomValidity('Имя должно состоять минимум из 2-х символов');
    } else {
      evt.target.setCustomValidity('');
    }
  });

  // Проверяет валидность номера карты по Алгоритму Луна
  var checkCardNumberValidity = function (evt) {
    var field = evt.target;
    var number = evt.target.value;
    var numbers = number.split('');
    var sum = 0;
    for (var i = 0; i < numbers.length; i++) {
      numbers[i] = parseInt(numbers[i], 10);
      if (i % 2 === 0) {
        numbers[i] *= 2;
      }
      if (numbers[i] > 10) {
        numbers[i] -= 9;
      }
      sum += numbers[i];
    }

    var message = '';
    if (field.validity.patternMismatch) {
      message += 'Введите 16 цифр.';
      field.setCustomValidity(message);
    } else if (sum % 10 !== 0) {
      message += 'Номер карты введен неверно';
      field.setCustomValidity(message);
    } else {
      field.setCustomValidity('');
    }
  };

  // Добавляет обработчик валидности для поля номер карты
  cardNumberInputElement.addEventListener('input', checkCardNumberValidity);

  // Добавляет обработчик валидности для поля срок действия карты
  cardDateInputElement.addEventListener('invalid', function (evt) {
    if (evt.target.validity.patternMismatch) {
      evt.target.setCustomValidity('Введите срок действия карты в формате мм/гг');
    } else {
      evt.target.setCustomValidity('');
    }
  });

  // Добавляет обработчик валидации поля именя держателя карты
  cardholderInputElement.addEventListener('input', function (evt) {
    evt.target.value = evt.target.value.toUpperCase();
    if (evt.target.validity.patternMismatch) {
      evt.target.setCustomValidity('Введите имя держателя карты латиницей');
    } else {
      evt.target.setCustomValidity('');
    }
  });

  // Добавляет обработчик валидации поля CVC карты
  cardCvcInputElement.addEventListener('input', function (evt) {
    if (evt.target.validity.patternMismatch) {
      evt.target.setCustomValidity('Введите код из 3 цифр с обратной стороны карты');
    } else {
      evt.target.setCustomValidity('');
    }
  });

  // Показывает статус карты в зависимости от правильности заполнения полей ввода данных карты
  var checkCardStatus = function (evt) {
    if (evt.target.tagName === 'INPUT') {
      if (cardNumberInputElement.checkValidity() && cardDateInputElement.checkValidity() && cardholderInputElement.checkValidity() && cardCvcInputElement.checkValidity()) {
        cardStatusElement.textContent = 'Одобрен';
        cardStatusElement.classList.add('payment__card-status--active');
        cardStatusElement.classList.remove('payment__card-status--not-active');
        cardErrorMsgElement.classList.add('visually-hidden');
      } else {
        cardStatusElement.textContent = 'Не определён';
        cardStatusElement.classList.remove('payment__card-status--active');
        cardStatusElement.classList.add('payment__card-status--not-active');
        cardErrorMsgElement.classList.remove('visually-hidden');
      }
    }
  };

  // Добавляет обработчик события 'ввод' на блок с полями данных карты, показывающий статус карты
  cardDataElement.addEventListener('input', checkCardStatus);

  // Добавляет обработчик валидности для поля этаж в блоке курьерской доставки
  courierDeliveryFloorElement.addEventListener('input', function (evt) {
    if (evt.target.validity.patternMismatch) {
      evt.target.setCustomValidity('Номер этажа может быть только числом');
    } else {
      evt.target.setCustomValidity('');
    }
  });

  // Показывает карту, соответствующую адресу пункта самовывоза
  var showStoreMap = function (evt) {
    if (evt.target.tagName === 'INPUT') {
      storeDeliveryMapImgElement.src = 'img/map/' + evt.target.value + '.jpg';
      var inputLabel = evt.target.nextElementSibling;
      storeDeliveryMapImgElement.alt = inputLabel.textContent;
    }
  };

  // Добавляет обработчик события клик на поле выбора пункта самовывоза в блоке доставки
  storeDeliveryElement.addEventListener('change', showStoreMap);

  window.order = {
    // Блокирует/разблокирует поля формы заказа в зависимости от того, есть ли в корзине товар
    orderFormFieldsDisable: function (isCartEmpty) {
      if (isCartEmpty) {
        for (var i = 0; i < orderFormInputElements.length; i++) {
          orderFormInputElements[i].disabled = true;
        }
        window.util.disableBtn(formSubmitBtnElement, true);
      } else {
        for (var j = 0; j < orderFormInputElements.length; j++) {
          orderFormInputElements[j].disabled = false;
        }
        window.util.disableBtn(formSubmitBtnElement, false);
      }
    },

    // Устанавливает для полей доставки значения аттрибутов disabled и required по умолчанию
    setDeliveryFieldsDefault: function () {
      if (storeDeliveryToggler.checked) {
        blockInputFileds(courierDeliveryInputElements, true);
        courierDeliveryDescriptonElement.setAttribute('disabled', 'true');
      } else if (courierDeliveryToggler.checked) {
        blockInputFileds(storeDeliveryInputElements, true);
        courierDeliveryDescriptonElement.removeAttribute('disabled');
      }
    }
  };
})();
