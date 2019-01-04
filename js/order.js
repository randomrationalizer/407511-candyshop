// Модуль, описывающий работу формы заказа

'use strict';
(function () {
  var orderFormElement = document.querySelector('.buy').querySelector('form');
  var formSubmitBtnElement = orderFormElement.querySelector('.buy__submit-btn');
  var orderDetailsElement = orderFormElement.querySelector('.order');
  var orderFormInputElements = [].slice.call(orderDetailsElement.querySelectorAll('input'));
  var telInputElement = orderDetailsElement.querySelector('#contact-data__tel');
  var nameInputElement = orderDetailsElement.querySelector('#contact-data__name');
  var paymentMethodsToggleElement = orderDetailsElement.querySelector('.payment__method');
  var cardPaymentTogglerElement = paymentMethodsToggleElement.querySelector('#payment__card');
  var cashPaymentTogglerElement = paymentMethodsToggleElement.querySelector('#payment__cash');
  var paymentMethodToggleBtnsElements = [].slice.call(paymentMethodsToggleElement.querySelectorAll('input'));
  var paymentCardElement = orderDetailsElement.querySelector('.payment__card-wrap');
  var cardInputElements = [].slice.call(paymentCardElement .querySelectorAll('input'));
  var cardDataElement = paymentCardElement.querySelector('.payment__inputs');
  var cardNumberInputElement = cardDataElement.querySelector('#payment__card-number');
  var cardDateInputElement = cardDataElement.querySelector('#payment__card-date');
  var cardholderInputElement = cardDataElement.querySelector('#payment__cardholder');
  var cardCvcInputElement = cardDataElement.querySelector('#payment__card-cvc');
  var cardErrorMsgElement = cardDataElement.querySelector('.payment__error-message');
  var cardStatusElement = cardDataElement.querySelector('.payment__card-status');
  var paymentCashElement = orderDetailsElement.querySelector('.payment__cash-wrap');
  var deliveryDetailsElement = orderDetailsElement.querySelector('.deliver');
  var deliveryMethodsToggleElement = deliveryDetailsElement.querySelector('.deliver__toggle');
  var deliveryMethodToggleBtnsElements = [].slice.call(deliveryMethodsToggleElement.querySelectorAll('input'));
  var storeDeliveryTogglerElement = deliveryMethodsToggleElement.querySelector('#deliver__store');
  var courierDeliveryTogglerElement = deliveryMethodsToggleElement.querySelector('#deliver__courier');
  var storeDeliveryElement = deliveryDetailsElement.querySelector('.deliver__store');
  var storeDeliveryInputElements = [].slice.call(storeDeliveryElement.querySelectorAll('input'));
  var storeDeliveryMapImgElement = storeDeliveryElement.querySelector('.deliver__store-map-img');
  var courierDeliveryElement = deliveryDetailsElement.querySelector('.deliver__courier');
  var courierDeliveryInputElements = [].slice.call(courierDeliveryElement.querySelectorAll('input'));
  var courierDeliveryDescriptonElement = courierDeliveryElement.querySelector('.deliver__textarea');
  var courierDeliveryFloorElement = courierDeliveryElement.querySelector('#deliver__floor');
  var modalSuccessElement = document.querySelector('.modal--success');
  var modalCloseBtnElement = modalSuccessElement.querySelector('.modal__close');

  // Блокирует поля формы из коллекции
  var blockInputFileds = function (inputFields) {
    inputFields.forEach(function (field) {
      field.setAttribute('disabled', 'true');
      field.removeAttribute('required');
    });
  };

  // Разблокирует поля формы из коллекции
  var unlockInputFileds = function (inputFields) {
    inputFields.forEach(function (field) {
      field.removeAttribute('disabled');
      field.setAttribute('required', 'true');
    });
  };

  // Показывает/скрывает лишние блоки полей формы при выборе способа оплаты
  var togglePaymentMethod = function () {
    if (cardPaymentTogglerElement.checked) {
      paymentCardElement.classList.remove('visually-hidden');
      paymentCashElement.classList.add('visually-hidden');
      unlockInputFileds(cardInputElements);
    } else if (cashPaymentTogglerElement.checked) {
      paymentCardElement.classList.add('visually-hidden');
      paymentCashElement.classList.remove('visually-hidden');
      blockInputFileds(cardInputElements);
    }
  };

  // Добавляет на кнопки выбора формы оплаты обработчик события клик
  var addPaymentMethodToggleClickHandlers = function () {
    paymentMethodToggleBtnsElements.forEach(function (element) {
      element.addEventListener('click', togglePaymentMethod);
    });
  };

  // Показывает/скрывает лишние блоки полей формы при выборе способа доставки
  var toggleDeliveryMethod = function () {
    if (storeDeliveryTogglerElement.checked) {
      storeDeliveryElement.classList.remove('visually-hidden');
      courierDeliveryElement.classList.add('visually-hidden');
      blockInputFileds(courierDeliveryInputElements);
      unlockInputFileds(storeDeliveryInputElements);
      courierDeliveryDescriptonElement.setAttribute('disabled', 'true');
    } else if (courierDeliveryTogglerElement.checked) {
      storeDeliveryElement.classList.add('visually-hidden');
      courierDeliveryElement.classList.remove('visually-hidden');
      unlockInputFileds(courierDeliveryInputElements);
      blockInputFileds(storeDeliveryInputElements);
      courierDeliveryDescriptonElement.removeAttribute('disabled');
    }
  };

  // Добавляет на кнопки выбора способа доставки обработчик события клик
  var addDeliveryMethodToggleClickHandlers = function () {
    deliveryMethodToggleBtnsElements.forEach(function (button) {
      button.addEventListener('click', toggleDeliveryMethod);
    });
  };

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
  cardDateInputElement.addEventListener('input', function (evt) {
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

  // Задает для блока 'Статус карты' значения по умолчанию
  var setCardStatusDefault = function () {
    cardStatusElement.textContent = 'Не определён';
    cardStatusElement.classList.remove('payment__card-status--active');
    cardStatusElement.classList.remove('payment__card-status--not-active');
    cardErrorMsgElement.classList.add('visually-hidden');
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

  // Сбрасывает значения полей формы на значения по умолчанию
  var resetOrderForm = function () {
    orderFormInputElements.forEach(function (element) {
      element.value = '';
    });
    window.order.setPaymentFieldsDefault();
    setCardStatusDefault();
    window.order.setDeliveryFieldsDefault();
    courierDeliveryDescriptonElement.value = '';
  };

  // Показывает модальное окно с сообщением об успешной отправке формы
  var showSuccessMsg = function () {
    modalSuccessElement.classList.remove('modal--hidden');
    modalCloseBtnElement.addEventListener('click', hideSuccessMsg);
    document.addEventListener('keydown', onEscPress);
  };

  // Скрывает модальное окно с сообщением об успешной отправке формы
  // При закрытии окна удаляются все товары из корзины, сбрасываются значения полей формы заказа, форма блокируется
  var hideSuccessMsg = function () {
    modalSuccessElement.classList.add('modal--hidden');
    window.cart.clear();
    resetOrderForm();
    window.order.deactivateForm();
    modalCloseBtnElement.removeEventListener('click', hideSuccessMsg);
    document.removeEventListener('keydown', onEscPress);
  };

  // Закрывает модальное окно по нажатию Esc
  var onEscPress = function (evt) {
    window.util.isEscEvent(evt, hideSuccessMsg);
  };

  // Отправляет данные формы на сервер
  var onOrderFormSubmit = function (evt) {
    window.backend.upload(new FormData(orderFormElement), showSuccessMsg, window.util.showErrorMessage);
    evt.preventDefault();
  };

  // Добавляет обработчик события отправки формы
  orderFormElement.addEventListener('submit', onOrderFormSubmit);
  addPaymentMethodToggleClickHandlers();
  addDeliveryMethodToggleClickHandlers();

  window.order = {
    // Блокирует форму заказа
    deactivateForm: function () {
      orderFormInputElements.forEach(function (element) {
        element.setAttribute('disabled', 'true');
      });
      courierDeliveryDescriptonElement.setAttribute('disabled', 'true');
      formSubmitBtnElement.setAttribute('disabled', 'true');
    },

    // Активирует форму заказа
    activateForm: function () {
      orderFormInputElements.forEach(function (element) {
        element.removeAttribute('disabled');
      });
      courierDeliveryDescriptonElement.removeAttribute('disabled');
      formSubmitBtnElement.removeAttribute('disabled');
    },

    // Устанавливает для полей доставки значения по умолчанию
    setDeliveryFieldsDefault: function () {
      storeDeliveryTogglerElement.checked = true;
      storeDeliveryElement.querySelector('#store-academicheskaya').checked = true;
      toggleDeliveryMethod();
    },

    // Устанавливает для полей способа оплаты значения по умолчанию
    setPaymentFieldsDefault: function () {
      paymentMethodsToggleElement.querySelector('#payment__card').checked = true;
      togglePaymentMethod();
    }
  };
})();
