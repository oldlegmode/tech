
;(function (window, document) {

  function CustomValidation() { }

  CustomValidation.prototype = {
    // Установим пустой массив сообщений об ошибках
    invalidities: [],

    // Метод, проверяющий валидность
    checkValidity: function(input) {

      var validity = input.validity;

      if (validity.patternMismatch) {
        this.addInvalidity('This is the wrong pattern for this field');
      }

      if (validity.rangeOverflow) {
        var max = getAttributeValue(input, 'max');
        this.addInvalidity('The maximum value should be ' + max);
      }

      if (validity.rangeUnderflow) {
        var min = getAttributeValue(input, 'min');
        this.addInvalidity('The minimum value should be ' + min);
      }

      if (validity.stepMismatch) {
        var step = getAttributeValue(input, 'step');
        this.addInvalidity('This number needs to be a multiple of ' + step);
      }

      // И остальные проверки валидности...
    },

    // Добавляем сообщение об ошибке в массив ошибок
    addInvalidity: function(message) {
      this.invalidities.push(message);
    },

    // Получаем общий текст сообщений об ошибках
    getInvalidities: function() {
      return this.invalidities.join('. \n');
    },

    // Сбросим общий текст сообщений об ошибках
    resetInvalidity: function() {
      return this.invalidities.length = 0;
    }
  };

  CustomValidation.prototype.getInvaliditiesForHTML = function() {
  return this.invalidities.join('. <br>');
  }



  var submit = document.getElementById('input-submit');

  // Добавляем обработчик клика на кнопку отправки формы
  submit.addEventListener('click', formValidation);

  // Добавляем обработчик поднятия клавиши на каждое поле
  var inputs = [];
  for (var i = 0; i < submit.parentElement.length; i++) {
    if(submit.parentElement[i].id === 'input-submit') {
      continue;
    }
    inputs.push(submit.parentElement[i]);
  }
  // Пройдёмся по всем полям
  for (var i = 0; i < inputs.length; i++) {

    var input = inputs[i];

    if (!input.required) {
      continue;
    }
    input.addEventListener('keyup', inputValidation);
    input.addEventListener('change', inputValidation);
  }

  function formValidation(e) {
    e.preventDefault();
    var formData  = new FormData(this.form);
    var inputs = [];

    for (var i = 0; i < this.parentElement.length; i++) {
      if(this.parentElement[i] == this) {
        continue;
      }
      inputs.push(this.parentElement[i]);
    }
    // Пройдёмся по всем полям
    for (var i = 0; i < inputs.length; i++) {

      var input = inputs[i];

      if (!input.required) {
        continue;
      }
      // Проверим валидность поля, используя встроенную в JavaScript функцию checkValidity()
      if (!input.checkValidity()) {
        input.parentElement.classList.remove('page-main__label--correct');// Удаляем метку валидности поля, используя заранее подготовленный классы в less
        input.parentElement.classList.add('page-main__label--wrong');// Добаляем метку НЕ валидности поля, используя заранее подготовленный классы в less
        var inputCustomValidation = new CustomValidation(); // Создадим объект CustomValidation
        inputCustomValidation.checkValidity(input); // Выявим ошибки
        var customValidityMessage = inputCustomValidation.getInvalidities(); // Получим все сообщения об ошибках
        input.setCustomValidity(customValidityMessage); // Установим специальное сообщение об ошибке

        // Удалим существующие ошибки (надо будет переделать на replace)
        if(input.parentElement.children.length > 1) {
          if (input.parentElement.id = 'input-captcha') {
            input.parentElement.removeChild(input.parentElement.children[2]);
          }
          input.parentElement.removeChild(input.parentElement.children[1]);
        }

        // Добавим ошибки в документ

        //  Строка сообщения
        var customValidityMessageForHTML = inputCustomValidation.getInvaliditiesForHTML();
        // Если поле пустое, то ничего не делаем
        if (!customValidityMessageForHTML) {
          customValidityMessageForHTML ='Required field';
        }

        input.parentElement.insertAdjacentHTML('beforeEnd', '<span class="page-main__label--help">' + customValidityMessageForHTML + '</span>');
        inputCustomValidation.resetInvalidity();

        var stopSubmit = true;

        continue;
      } // закончился if
      // Удалим существующие ошибки (надо будет переделать на replace)
      if(input.parentElement.children.length > 1) {
        input.parentElement.removeChild(input.parentElement.children[1]);
      }
      input.parentElement.classList.remove('page-main__feedback-label--wrong');// Добаляем метку НЕ валидности поля, используя заранее подготовленный классы в less
      input.parentElement.classList.add('page-main__feedback-label--correct');// Удаляем метку валидности поля, используя заранее подготовленный классы в less
    } // закончился цикл

    if (stopSubmit) {
      e.preventDefault();
      this.classList.add('page-main__contact-btn--disable');
    } else  {
      e.preventDefault();
      console.log(formData);
      this.classList.remove('page-main__contact-btn--disable');
      request(formData );
    }
  }

  function inputValidation(e) {
    console.log(this.checkValidity(this));
    console.log(this.willValidate);
    console.log(this.valid);
    // Проверим валидность поля, используя встроенную в JavaScript функцию checkValidity()
    if (this.value.length < 2) return;
    if (this.checkValidity() == false) {
      this.parentElement.classList.remove('page-main__feedback-label--wrong');
      this.parentElement.classList.remove('page-main__feedback-label--correct');// Удаляем метку валидности поля, используя заранее подготовленный классы в less
      this.parentElement.classList.add('page-main__feedback-label--wrong');// Добаляем метку НЕ валидности поля, используя заранее подготовленный классы в less
      var inputCustomValidation = new CustomValidation(); // Создадим объект CustomValidation
      inputCustomValidation.checkValidity(this); // Выявим ошибки
      var customValidityMessage = inputCustomValidation.getInvalidities(); // Получим все сообщения об ошибках
      this.setCustomValidity(customValidityMessage); // Установим специальное сообщение об ошибке

      // Удалим существующие ошибки (надо будет переделать на replace)
      if(this.parentElement.children.length > 1) {
        if (input.parentElement.id = 'input-captcha') {
          input.parentElement.removeChild(input.parentElement.children[2]);
        }
        this.parentElement.removeChild(this.parentElement.children[1]);
      }

      // Добавим ошибки в документ

      //  Строка сообщения
      var customValidityMessageForHTML = inputCustomValidation.getInvaliditiesForHTML();
      // Если поле пустое, то ничего не делаем
      if (!customValidityMessageForHTML) {
        customValidityMessageForHTML ='Required field';
      }

      this.parentElement.insertAdjacentHTML('beforeEnd', '<span class="page-main__label--help">' + customValidityMessageForHTML + '</span>');
      inputCustomValidation.resetInvalidity();

      var stopSubmit = true;
      
      return;
    } // закончился if
    // Удалим существующие ошибки (надо будет переделать на replace)
    if(this.parentElement.children.length > 1) {
      this.parentElement.removeChild(this.parentElement.children[1]);
    }
    this.parentElement.classList.remove('page-main__feedback-label--wrong');// Добаляем метку НЕ валидности поля, используя заранее подготовленный классы в less
    this.parentElement.classList.add('page-main__feedback-label--correct');// Удаляем метку валидности поля, используя заранее подготовленный классы в less
    
  }

  function request(argument) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', '/send', true);

    xhr.send(argument);

    xhr.onreadystatechange = function() {
      if (this.readyState != 4) {
        return;// по окончании запроса доступны:
      }
      // status, statusText
      // responseText, responseXML (при content-type: text/xml)
      if (this.status != 200) {
        // обработать ошибку
        alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
        return;
      }
    }
  }

})(window, document);
;(function(window, document) {
  var arrow = document.querySelector('.page-main__arrow'),
      speed = 0.2;  // скорость, может иметь дробное значение через точку


    arrow.addEventListener('click', function(e) {
      e.preventDefault();

      if ( e.target.tagName != 'A') {
        var target = e.target.children[0];
      }

      var link = target || e.target,
          scroll = window.pageYOffset;  // прокрутка
          console.log(link.href);
      var hash = link.href.replace(/[^#]*(.*)/, '$1'),  // id элемента, к которому нужно перейти
          distanceFromWindow = document.querySelector(hash).getBoundingClientRect().top - 80,  // отступ от окна браузера до id
          start = null;
      requestAnimationFrame(step);  // подробнее про функцию анимации [developer.mozilla.org]
      
      function step(time) {
        if (start === null) start = time;
        var progress = time - start,
            endCoords = (distanceFromWindow < 0 ? Math.max(scroll - progress/speed, scroll + distanceFromWindow) : 
              Math.min(scroll + progress/speed, scroll + distanceFromWindow));
        window.scrollTo(0,endCoords);
        if (endCoords != scroll + distanceFromWindow) {
          requestAnimationFrame(step);
        }
      }
    }
  )
}(window, document));
;(function (window, document) {
  var bid = document.querySelector('.page-header__contact-phone-bid');
  window.addEventListener('scroll', handler);
  window.addEventListener('load', handler);

  function handler(e) {
    var header = document.querySelector('.page-header__inner');
    var top = getDocCoords();

    if ( top < 40 && header.classList.contains('page-header__inner--fixed')) {
      document.body.style.paddingTop = '0px';
      getStaticHeader(header);
      return;
    } else if (top >= 40 && !header.classList.contains('page-header__inner--fixed')) {
      document.body.style.paddingTop = '121px';
      getFixedHeader(header);
      return;
    } 
  }

  function getDocCoords() {
    return window.pageYOffset;
  }

  function getFixedHeader(header) { // кроме IE8-
    var links = document.querySelectorAll('.site-nav__link');
    var bid = document.querySelector('.page-header__contact-phone-bid');
    var tellList = document.querySelector('.page-header__contact-number-list');
    
    tellList.classList.add('hidden');
    bid.classList.remove('hidden');
    //bid.style.display = 'inline-block';
    header.classList.add('page-header__inner--fixed');
    header.classList.add('page-header__animate');
    for (var i = 0; i < links.length; i++) {
      if (links[i].classList.contains('site-nav__link--active')) {
        links[i].classList.add('site-nav__link--active-fixed');
      }
      links[i].classList.add('site-nav__link--fixed');
    }


  }
  function getStaticHeader(header) { // кроме IE8-
    var links = document.querySelectorAll('.site-nav__link');
    var bid = document.querySelector('.page-header__contact-phone-bid');
    var tellList = document.querySelector('.page-header__contact-number-list');
    
    tellList.classList.remove('hidden');
    bid.classList.add('hidden');
    header.classList.remove('page-header__inner--fixed');
    header.classList.remove('page-header__animate');
    for (var i = 0; i < links.length; i++) {
      links[i].classList.remove('site-nav__link--fixed');
      if (links[i].classList.contains('site-nav__link--active')) {
        links[i].classList.remove('site-nav__link--active-fixed');
      }
    }

  }

})(window, document)
;(function(window, document) {
  var nav = document.querySelector('.site-nav'),
      speed = 2;  // скорость, может иметь дробное значение через точку


    nav.addEventListener('click', function(e) {
      e.preventDefault();

      if ( !e.target.classList.contains('site-nav__link-js') ) {
        return;
      }

      var link = e.target,
          scroll = window.pageYOffset,  // прокрутка
          hash = link.href.replace(/[^#]*(.*)/, '$1'),  // id элемента, к которому нужно перейти
          distanceFromWindow = document.querySelector(hash).getBoundingClientRect().top - 80,  // отступ от окна браузера до id
          start = null;
      requestAnimationFrame(step);  // подробнее про функцию анимации [developer.mozilla.org]
      
      function step(time) {
        if (start === null) start = time;
        var progress = time - start,
            endCoords = (distanceFromWindow < 0 ? Math.max(scroll - progress/speed, scroll + distanceFromWindow) : 
              Math.min(scroll + progress/speed, scroll + distanceFromWindow));
        window.scrollTo(0,endCoords);
        if (endCoords != scroll + distanceFromWindow) {
          requestAnimationFrame(step);
        }
      }
    }
  )
}(window, document));
;(function (window, document) {
  'use strict'
  // Events statements on contentLoaded
  var liBtn = document.querySelectorAll('.page-main__portfolio-indication-li'),
      slidies = document.querySelectorAll('.page-main__portfolio-slide'),
      listIndicator = document.querySelector('.page-main__portfolio-indication-list');

  listIndicator.addEventListener('click', function (e) {
    if (e.target.tagName != 'LI') {
      return;
    }
    var numberSlide = +e.target.getAttribute('data-number') - 1;

    for (var i = 0; i < liBtn.length; i++) {
      if ( liBtn[i].classList.contains('page-main__portfolio-indication-li--active') ) {
        liBtn[i].classList.remove('page-main__portfolio-indication-li--active');
        slidies[i].classList.add('hidden');
        break;
      }
    }
    e.target.classList.add('page-main__portfolio-indication-li--active');
    slidies[numberSlide].classList.remove('hidden');
  });
})(window, document);
;(function (window, document) {
  'use strict'
  // Events statements on contentLoaded
  var sliderHeader = document.querySelectorAll('.page-main__slider-header'),
      sliderText = document.querySelectorAll('.page-main__slider-text'),
      sliderBtnCall = document.querySelectorAll('.page-main__slider-btn'),
      sliderToggle = document.querySelectorAll('.page-main__slider-toggle'),
      arrContentElements = document.querySelectorAll('.page-main__slider-content'),
      indicator = document.querySelectorAll('.page-main__slider-indicator-li'),
      divider = document.querySelectorAll('.page-main__slider-divider');

  document.addEventListener('DOMContentLoaded', function () {
    for (var i = 0; i < sliderToggle.length; i++) {
      sliderToggle[i].classList.add('animated');
      sliderToggle[i].classList.add('fadeInDownBig');
      sliderToggle[i].addEventListener('click', contentPrevNextToggle);
      sliderToggle[i].addEventListener('mouseover', function (e) {
        this.classList.remove('fadeInDownBig'); 
      });
    }
  });
  document.addEventListener('DOMContentLoaded', function () {
    for (var i = 0; i < sliderHeader.length; i++) {
      sliderHeader[i].classList.add('animated');
      sliderHeader[i].classList.add('fadeInDown'); 
    } 
  });
  document.addEventListener('DOMContentLoaded', function () {
     for (var i = 0; i < sliderText.length; i++) {
      sliderText[i].classList.add('animated');
      sliderText[i].classList.add('fadeInUp'); 
    } 
  });
  document.addEventListener('DOMContentLoaded', function () {
    for (var i = 0; i < sliderBtnCall.length; i++) {
      sliderBtnCall[i].classList.add('animated');
      sliderBtnCall[i].classList.add('fadeInUp'); 
    } 
  });
  document.addEventListener('DOMContentLoaded', function () {
    for (var i = 0; i < divider.length; i++) {
      divider[i].classList.add('animated');
      divider[i].classList.add('rotateIn'); 
    } 
  });

  document.querySelector('.page-main__slider-scroll').addEventListener('click', function(e) {
      e.preventDefault();

      var link = e.target,
          speed = 2,  // скорость, может иметь дробное значение через точку
          scroll = window.pageYOffset,  // прокрутка
          hash = link.href.replace(/[^#]*(.*)/, '$1'),  // id элемента, к которому нужно перейти
          distanceFromWindow = document.querySelector(hash).getBoundingClientRect().top - 80,  // отступ от окна браузера до id
          start = null;
      requestAnimationFrame(step);  // подробнее про функцию анимации [developer.mozilla.org]
      
      function step(time) {
        if (start === null) start = time;
        var progress = time - start,
            endCoords = (distanceFromWindow < 0 ? Math.max(scroll - progress/speed, scroll + distanceFromWindow) : 
              Math.min(scroll + progress/speed, scroll + distanceFromWindow));
        window.scrollTo(0,endCoords);
        if (endCoords != scroll + distanceFromWindow) {
          requestAnimationFrame(step);
        }
      }
    })



  function contentPrevNextToggle(event) {

    event.preventDefault();

    if (this.classList.contains('page-main__slider-toggle--next')) {
      for (var i = 0; i < arrContentElements.length; i++) {
        if ( !arrContentElements[i].classList.contains('page-main__slider-content-hidden') && (i === arrContentElements.length - 1) ) {
          arrContentElements[i].classList.add('page-main__slider-content-hidden');
          arrContentElements[0].classList.remove('page-main__slider-content-hidden');
          indicator[i].classList.remove('page-main__slider-indicator-li--active');
          indicator[0].classList.add('page-main__slider-indicator-li--active');
          return
        } else if (!arrContentElements[i].classList.contains('page-main__slider-content-hidden')) {
          arrContentElements[i].classList.add('page-main__slider-content-hidden');
          indicator[i].classList.remove('page-main__slider-indicator-li--active');
          arrContentElements[++i].classList.remove('page-main__slider-content-hidden');
          indicator[i].classList.add('page-main__slider-indicator-li--active');
          return
        }
      }
    };
    if (this.classList.contains('page-main__slider-toggle--prev')) {
      for (var i = arrContentElements.length - 1; i >= 0; i--) {
        if ( !arrContentElements[i].classList.contains('page-main__slider-content-hidden') && (i === 0) ) {
          arrContentElements[i].classList.add('page-main__slider-content-hidden');
          arrContentElements[arrContentElements.length - 1].classList.remove('page-main__slider-content-hidden');
          indicator[arrContentElements.length - 1].classList.add('page-main__slider-indicator-li--active');
          indicator[0].classList.remove('page-main__slider-indicator-li--active');
          return;
        } else if (!(arrContentElements[i].classList.contains('page-main__slider-content-hidden'))) {
          arrContentElements[i].classList.add('page-main__slider-content-hidden');
          indicator[i].classList.remove('page-main__slider-indicator-li--active');
          arrContentElements[--i].classList.remove('page-main__slider-content-hidden');
          indicator[i].classList.add('page-main__slider-indicator-li--active');
          return;
        }
      }
    };
  }

})(window, document);

;(function(window, document) {
  'use strict';
  var file = '../img/sprite/page-sprite.svg', // путь к файлу спрайта на сервере
      revision = 1;            // версия спрайта
  if (!document.createElementNS || !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect) return true;
  var isLocalStorage = 'localStorage' in window && window['localStorage'] !== null,
    request,
    data,
    insertIT = function() {
      document.body.insertAdjacentHTML('afterbegin', data);
    },
    insert = function() {
      if (document.body) insertIT();
      else document.addEventListener('DOMContentLoaded', insertIT);
    };
  if (isLocalStorage && localStorage.getItem('inlineSVGrev') == revision) {
    data = localStorage.getItem('inlineSVGdata');
    if (data) {
      insert();
      return true;
    }
  }
  try {
    request = new XMLHttpRequest();
    request.open('GET', file, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        data = request.responseText;
        insert();
        if (isLocalStorage) {
          localStorage.setItem('inlineSVGdata', data);
          localStorage.setItem('inlineSVGrev', revision);
        }
      }
    }
    request.send();
  } catch (e) {
    console.log("ecть ошибка в спрайте SVG");
  }
}(window, document));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi5qcyIsIm1vZHVsZXMvZmVlZGJhY2svZm9ybS5qcyIsIm1vZHVsZXMvbWFpbi1hcnJvdy9fbWFpbi1hcnJvdy5qcyIsIm1vZHVsZXMvcGFnZS1oZWFkZXIvZml4ZWQuanMiLCJtb2R1bGVzL3BhZ2UtaGVhZGVyL3Njcm9sbC5qcyIsIm1vZHVsZXMvcG9ydGZvbGlvL3NsaWRlci5qcyIsIm1vZHVsZXMvc2xpZGVyL3NsaWRlci5qcyIsIm1vZHVsZXMvc3ByaXRlL3Nwcml0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIiwiOyhmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCkge1xyXG5cclxuICBmdW5jdGlvbiBDdXN0b21WYWxpZGF0aW9uKCkgeyB9XHJcblxyXG4gIEN1c3RvbVZhbGlkYXRpb24ucHJvdG90eXBlID0ge1xyXG4gICAgLy8g0KPRgdGC0LDQvdC+0LLQuNC8INC/0YPRgdGC0L7QuSDQvNCw0YHRgdC40LIg0YHQvtC+0LHRidC10L3QuNC5INC+0LEg0L7RiNC40LHQutCw0YVcclxuICAgIGludmFsaWRpdGllczogW10sXHJcblxyXG4gICAgLy8g0JzQtdGC0L7QtCwg0L/RgNC+0LLQtdGA0Y/RjtGJ0LjQuSDQstCw0LvQuNC00L3QvtGB0YLRjFxyXG4gICAgY2hlY2tWYWxpZGl0eTogZnVuY3Rpb24oaW5wdXQpIHtcclxuXHJcbiAgICAgIHZhciB2YWxpZGl0eSA9IGlucHV0LnZhbGlkaXR5O1xyXG5cclxuICAgICAgaWYgKHZhbGlkaXR5LnBhdHRlcm5NaXNtYXRjaCkge1xyXG4gICAgICAgIHRoaXMuYWRkSW52YWxpZGl0eSgnVGhpcyBpcyB0aGUgd3JvbmcgcGF0dGVybiBmb3IgdGhpcyBmaWVsZCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodmFsaWRpdHkucmFuZ2VPdmVyZmxvdykge1xyXG4gICAgICAgIHZhciBtYXggPSBnZXRBdHRyaWJ1dGVWYWx1ZShpbnB1dCwgJ21heCcpO1xyXG4gICAgICAgIHRoaXMuYWRkSW52YWxpZGl0eSgnVGhlIG1heGltdW0gdmFsdWUgc2hvdWxkIGJlICcgKyBtYXgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodmFsaWRpdHkucmFuZ2VVbmRlcmZsb3cpIHtcclxuICAgICAgICB2YXIgbWluID0gZ2V0QXR0cmlidXRlVmFsdWUoaW5wdXQsICdtaW4nKTtcclxuICAgICAgICB0aGlzLmFkZEludmFsaWRpdHkoJ1RoZSBtaW5pbXVtIHZhbHVlIHNob3VsZCBiZSAnICsgbWluKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHZhbGlkaXR5LnN0ZXBNaXNtYXRjaCkge1xyXG4gICAgICAgIHZhciBzdGVwID0gZ2V0QXR0cmlidXRlVmFsdWUoaW5wdXQsICdzdGVwJyk7XHJcbiAgICAgICAgdGhpcy5hZGRJbnZhbGlkaXR5KCdUaGlzIG51bWJlciBuZWVkcyB0byBiZSBhIG11bHRpcGxlIG9mICcgKyBzdGVwKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8g0Jgg0L7RgdGC0LDQu9GM0L3Ri9C1INC/0YDQvtCy0LXRgNC60Lgg0LLQsNC70LjQtNC90L7RgdGC0LguLi5cclxuICAgIH0sXHJcblxyXG4gICAgLy8g0JTQvtCx0LDQstC70Y/QtdC8INGB0L7QvtCx0YnQtdC90LjQtSDQvtCxINC+0YjQuNCx0LrQtSDQsiDQvNCw0YHRgdC40LIg0L7RiNC40LHQvtC6XHJcbiAgICBhZGRJbnZhbGlkaXR5OiBmdW5jdGlvbihtZXNzYWdlKSB7XHJcbiAgICAgIHRoaXMuaW52YWxpZGl0aWVzLnB1c2gobWVzc2FnZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vINCf0L7Qu9GD0YfQsNC10Lwg0L7QsdGJ0LjQuSDRgtC10LrRgdGCINGB0L7QvtCx0YnQtdC90LjQuSDQvtCxINC+0YjQuNCx0LrQsNGFXHJcbiAgICBnZXRJbnZhbGlkaXRpZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5pbnZhbGlkaXRpZXMuam9pbignLiBcXG4nKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8g0KHQsdGA0L7RgdC40Lwg0L7QsdGJ0LjQuSDRgtC10LrRgdGCINGB0L7QvtCx0YnQtdC90LjQuSDQvtCxINC+0YjQuNCx0LrQsNGFXHJcbiAgICByZXNldEludmFsaWRpdHk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5pbnZhbGlkaXRpZXMubGVuZ3RoID0gMDtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBDdXN0b21WYWxpZGF0aW9uLnByb3RvdHlwZS5nZXRJbnZhbGlkaXRpZXNGb3JIVE1MID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuaW52YWxpZGl0aWVzLmpvaW4oJy4gPGJyPicpO1xyXG4gIH1cclxuXHJcblxyXG5cclxuICB2YXIgc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0LXN1Ym1pdCcpO1xyXG5cclxuICAvLyDQlNC+0LHQsNCy0LvRj9C10Lwg0L7QsdGA0LDQsdC+0YLRh9C40Log0LrQu9C40LrQsCDQvdCwINC60L3QvtC/0LrRgyDQvtGC0L/RgNCw0LLQutC4INGE0L7RgNC80YtcclxuICBzdWJtaXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmb3JtVmFsaWRhdGlvbik7XHJcblxyXG4gIC8vINCU0L7QsdCw0LLQu9GP0LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQuiDQv9C+0LTQvdGP0YLQuNGPINC60LvQsNCy0LjRiNC4INC90LAg0LrQsNC20LTQvtC1INC/0L7Qu9C1XHJcbiAgdmFyIGlucHV0cyA9IFtdO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3VibWl0LnBhcmVudEVsZW1lbnQubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmKHN1Ym1pdC5wYXJlbnRFbGVtZW50W2ldLmlkID09PSAnaW5wdXQtc3VibWl0Jykge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuICAgIGlucHV0cy5wdXNoKHN1Ym1pdC5wYXJlbnRFbGVtZW50W2ldKTtcclxuICB9XHJcbiAgLy8g0J/RgNC+0LnQtNGR0LzRgdGPINC/0L4g0LLRgdC10Lwg0L/QvtC70Y/QvFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgdmFyIGlucHV0ID0gaW5wdXRzW2ldO1xyXG5cclxuICAgIGlmICghaW5wdXQucmVxdWlyZWQpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGlucHV0VmFsaWRhdGlvbik7XHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBpbnB1dFZhbGlkYXRpb24pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZm9ybVZhbGlkYXRpb24oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdmFyIGZvcm1EYXRhICA9IG5ldyBGb3JtRGF0YSh0aGlzLmZvcm0pO1xyXG4gICAgdmFyIGlucHV0cyA9IFtdO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYXJlbnRFbGVtZW50Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmKHRoaXMucGFyZW50RWxlbWVudFtpXSA9PSB0aGlzKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuICAgICAgaW5wdXRzLnB1c2godGhpcy5wYXJlbnRFbGVtZW50W2ldKTtcclxuICAgIH1cclxuICAgIC8vINCf0YDQvtC50LTRkdC80YHRjyDQv9C+INCy0YHQtdC8INC/0L7Qu9GP0LxcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICB2YXIgaW5wdXQgPSBpbnB1dHNbaV07XHJcblxyXG4gICAgICBpZiAoIWlucHV0LnJlcXVpcmVkKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuICAgICAgLy8g0J/RgNC+0LLQtdGA0LjQvCDQstCw0LvQuNC00L3QvtGB0YLRjCDQv9C+0LvRjywg0LjRgdC/0L7Qu9GM0LfRg9GPINCy0YHRgtGA0L7QtdC90L3Rg9GOINCyIEphdmFTY3JpcHQg0YTRg9C90LrRhtC40Y4gY2hlY2tWYWxpZGl0eSgpXHJcbiAgICAgIGlmICghaW5wdXQuY2hlY2tWYWxpZGl0eSgpKSB7XHJcbiAgICAgICAgaW5wdXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLW1haW5fX2xhYmVsLS1jb3JyZWN0Jyk7Ly8g0KPQtNCw0LvRj9C10Lwg0LzQtdGC0LrRgyDQstCw0LvQuNC00L3QvtGB0YLQuCDQv9C+0LvRjywg0LjRgdC/0L7Qu9GM0LfRg9GPINC30LDRgNCw0L3QtdC1INC/0L7QtNCz0L7RgtC+0LLQu9C10L3QvdGL0Lkg0LrQu9Cw0YHRgdGLINCyIGxlc3NcclxuICAgICAgICBpbnB1dC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3BhZ2UtbWFpbl9fbGFiZWwtLXdyb25nJyk7Ly8g0JTQvtCx0LDQu9GP0LXQvCDQvNC10YLQutGDINCd0JUg0LLQsNC70LjQtNC90L7RgdGC0Lgg0L/QvtC70Y8sINC40YHQv9C+0LvRjNC30YPRjyDQt9Cw0YDQsNC90LXQtSDQv9C+0LTQs9C+0YLQvtCy0LvQtdC90L3Ri9C5INC60LvQsNGB0YHRiyDQsiBsZXNzXHJcbiAgICAgICAgdmFyIGlucHV0Q3VzdG9tVmFsaWRhdGlvbiA9IG5ldyBDdXN0b21WYWxpZGF0aW9uKCk7IC8vINCh0L7Qt9C00LDQtNC40Lwg0L7QsdGK0LXQutGCIEN1c3RvbVZhbGlkYXRpb25cclxuICAgICAgICBpbnB1dEN1c3RvbVZhbGlkYXRpb24uY2hlY2tWYWxpZGl0eShpbnB1dCk7IC8vINCS0YvRj9Cy0LjQvCDQvtGI0LjQsdC60LhcclxuICAgICAgICB2YXIgY3VzdG9tVmFsaWRpdHlNZXNzYWdlID0gaW5wdXRDdXN0b21WYWxpZGF0aW9uLmdldEludmFsaWRpdGllcygpOyAvLyDQn9C+0LvRg9GH0LjQvCDQstGB0LUg0YHQvtC+0LHRidC10L3QuNGPINC+0LEg0L7RiNC40LHQutCw0YVcclxuICAgICAgICBpbnB1dC5zZXRDdXN0b21WYWxpZGl0eShjdXN0b21WYWxpZGl0eU1lc3NhZ2UpOyAvLyDQo9GB0YLQsNC90L7QstC40Lwg0YHQv9C10YbQuNCw0LvRjNC90L7QtSDRgdC+0L7QsdGJ0LXQvdC40LUg0L7QsSDQvtGI0LjQsdC60LVcclxuXHJcbiAgICAgICAgLy8g0KPQtNCw0LvQuNC8INGB0YPRidC10YHRgtCy0YPRjtGJ0LjQtSDQvtGI0LjQsdC60LggKNC90LDQtNC+INCx0YPQtNC10YIg0L/QtdGA0LXQtNC10LvQsNGC0Ywg0L3QsCByZXBsYWNlKVxyXG4gICAgICAgIGlmKGlucHV0LnBhcmVudEVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgaWYgKGlucHV0LnBhcmVudEVsZW1lbnQuaWQgPSAnaW5wdXQtY2FwdGNoYScpIHtcclxuICAgICAgICAgICAgaW5wdXQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChpbnB1dC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzJdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlucHV0LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoaW5wdXQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQlNC+0LHQsNCy0LjQvCDQvtGI0LjQsdC60Lgg0LIg0LTQvtC60YPQvNC10L3RglxyXG5cclxuICAgICAgICAvLyAg0KHRgtGA0L7QutCwINGB0L7QvtCx0YnQtdC90LjRj1xyXG4gICAgICAgIHZhciBjdXN0b21WYWxpZGl0eU1lc3NhZ2VGb3JIVE1MID0gaW5wdXRDdXN0b21WYWxpZGF0aW9uLmdldEludmFsaWRpdGllc0ZvckhUTUwoKTtcclxuICAgICAgICAvLyDQldGB0LvQuCDQv9C+0LvQtSDQv9GD0YHRgtC+0LUsINGC0L4g0L3QuNGH0LXQs9C+INC90LUg0LTQtdC70LDQtdC8XHJcbiAgICAgICAgaWYgKCFjdXN0b21WYWxpZGl0eU1lc3NhZ2VGb3JIVE1MKSB7XHJcbiAgICAgICAgICBjdXN0b21WYWxpZGl0eU1lc3NhZ2VGb3JIVE1MID0nUmVxdWlyZWQgZmllbGQnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5wdXQucGFyZW50RWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZUVuZCcsICc8c3BhbiBjbGFzcz1cInBhZ2UtbWFpbl9fbGFiZWwtLWhlbHBcIj4nICsgY3VzdG9tVmFsaWRpdHlNZXNzYWdlRm9ySFRNTCArICc8L3NwYW4+Jyk7XHJcbiAgICAgICAgaW5wdXRDdXN0b21WYWxpZGF0aW9uLnJlc2V0SW52YWxpZGl0eSgpO1xyXG5cclxuICAgICAgICB2YXIgc3RvcFN1Ym1pdCA9IHRydWU7XHJcblxyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9IC8vINC30LDQutC+0L3Rh9C40LvRgdGPIGlmXHJcbiAgICAgIC8vINCj0LTQsNC70LjQvCDRgdGD0YnQtdGB0YLQstGD0Y7RidC40LUg0L7RiNC40LHQutC4ICjQvdCw0LTQviDQsdGD0LTQtdGCINC/0LXRgNC10LTQtdC70LDRgtGMINC90LAgcmVwbGFjZSlcclxuICAgICAgaWYoaW5wdXQucGFyZW50RWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgaW5wdXQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChpbnB1dC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdKTtcclxuICAgICAgfVxyXG4gICAgICBpbnB1dC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtbWFpbl9fZmVlZGJhY2stbGFiZWwtLXdyb25nJyk7Ly8g0JTQvtCx0LDQu9GP0LXQvCDQvNC10YLQutGDINCd0JUg0LLQsNC70LjQtNC90L7RgdGC0Lgg0L/QvtC70Y8sINC40YHQv9C+0LvRjNC30YPRjyDQt9Cw0YDQsNC90LXQtSDQv9C+0LTQs9C+0YLQvtCy0LvQtdC90L3Ri9C5INC60LvQsNGB0YHRiyDQsiBsZXNzXHJcbiAgICAgIGlucHV0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgncGFnZS1tYWluX19mZWVkYmFjay1sYWJlbC0tY29ycmVjdCcpOy8vINCj0LTQsNC70Y/QtdC8INC80LXRgtC60YMg0LLQsNC70LjQtNC90L7RgdGC0Lgg0L/QvtC70Y8sINC40YHQv9C+0LvRjNC30YPRjyDQt9Cw0YDQsNC90LXQtSDQv9C+0LTQs9C+0YLQvtCy0LvQtdC90L3Ri9C5INC60LvQsNGB0YHRiyDQsiBsZXNzXHJcbiAgICB9IC8vINC30LDQutC+0L3Rh9C40LvRgdGPINGG0LjQutC7XHJcblxyXG4gICAgaWYgKHN0b3BTdWJtaXQpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ3BhZ2UtbWFpbl9fY29udGFjdC1idG4tLWRpc2FibGUnKTtcclxuICAgIH0gZWxzZSAge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGZvcm1EYXRhKTtcclxuICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLW1haW5fX2NvbnRhY3QtYnRuLS1kaXNhYmxlJyk7XHJcbiAgICAgIHJlcXVlc3QoZm9ybURhdGEgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGlucHV0VmFsaWRhdGlvbihlKSB7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLmNoZWNrVmFsaWRpdHkodGhpcykpO1xyXG4gICAgY29uc29sZS5sb2codGhpcy53aWxsVmFsaWRhdGUpO1xyXG4gICAgY29uc29sZS5sb2codGhpcy52YWxpZCk7XHJcbiAgICAvLyDQn9GA0L7QstC10YDQuNC8INCy0LDQu9C40LTQvdC+0YHRgtGMINC/0L7Qu9GPLCDQuNGB0L/QvtC70YzQt9GD0Y8g0LLRgdGC0YDQvtC10L3QvdGD0Y4g0LIgSmF2YVNjcmlwdCDRhNGD0L3QutGG0LjRjiBjaGVja1ZhbGlkaXR5KClcclxuICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA8IDIpIHJldHVybjtcclxuICAgIGlmICh0aGlzLmNoZWNrVmFsaWRpdHkoKSA9PSBmYWxzZSkge1xyXG4gICAgICB0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1tYWluX19mZWVkYmFjay1sYWJlbC0td3JvbmcnKTtcclxuICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtbWFpbl9fZmVlZGJhY2stbGFiZWwtLWNvcnJlY3QnKTsvLyDQo9C00LDQu9GP0LXQvCDQvNC10YLQutGDINCy0LDQu9C40LTQvdC+0YHRgtC4INC/0L7Qu9GPLCDQuNGB0L/QvtC70YzQt9GD0Y8g0LfQsNGA0LDQvdC10LUg0L/QvtC00LPQvtGC0L7QstC70LXQvdC90YvQuSDQutC70LDRgdGB0Ysg0LIgbGVzc1xyXG4gICAgICB0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgncGFnZS1tYWluX19mZWVkYmFjay1sYWJlbC0td3JvbmcnKTsvLyDQlNC+0LHQsNC70Y/QtdC8INC80LXRgtC60YMg0J3QlSDQstCw0LvQuNC00L3QvtGB0YLQuCDQv9C+0LvRjywg0LjRgdC/0L7Qu9GM0LfRg9GPINC30LDRgNCw0L3QtdC1INC/0L7QtNCz0L7RgtC+0LLQu9C10L3QvdGL0Lkg0LrQu9Cw0YHRgdGLINCyIGxlc3NcclxuICAgICAgdmFyIGlucHV0Q3VzdG9tVmFsaWRhdGlvbiA9IG5ldyBDdXN0b21WYWxpZGF0aW9uKCk7IC8vINCh0L7Qt9C00LDQtNC40Lwg0L7QsdGK0LXQutGCIEN1c3RvbVZhbGlkYXRpb25cclxuICAgICAgaW5wdXRDdXN0b21WYWxpZGF0aW9uLmNoZWNrVmFsaWRpdHkodGhpcyk7IC8vINCS0YvRj9Cy0LjQvCDQvtGI0LjQsdC60LhcclxuICAgICAgdmFyIGN1c3RvbVZhbGlkaXR5TWVzc2FnZSA9IGlucHV0Q3VzdG9tVmFsaWRhdGlvbi5nZXRJbnZhbGlkaXRpZXMoKTsgLy8g0J/QvtC70YPRh9C40Lwg0LLRgdC1INGB0L7QvtCx0YnQtdC90LjRjyDQvtCxINC+0YjQuNCx0LrQsNGFXHJcbiAgICAgIHRoaXMuc2V0Q3VzdG9tVmFsaWRpdHkoY3VzdG9tVmFsaWRpdHlNZXNzYWdlKTsgLy8g0KPRgdGC0LDQvdC+0LLQuNC8INGB0L/QtdGG0LjQsNC70YzQvdC+0LUg0YHQvtC+0LHRidC10L3QuNC1INC+0LEg0L7RiNC40LHQutC1XHJcblxyXG4gICAgICAvLyDQo9C00LDQu9C40Lwg0YHRg9GJ0LXRgdGC0LLRg9GO0YnQuNC1INC+0YjQuNCx0LrQuCAo0L3QsNC00L4g0LHRg9C00LXRgiDQv9C10YDQtdC00LXQu9Cw0YLRjCDQvdCwIHJlcGxhY2UpXHJcbiAgICAgIGlmKHRoaXMucGFyZW50RWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgaWYgKGlucHV0LnBhcmVudEVsZW1lbnQuaWQgPSAnaW5wdXQtY2FwdGNoYScpIHtcclxuICAgICAgICAgIGlucHV0LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoaW5wdXQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyDQlNC+0LHQsNCy0LjQvCDQvtGI0LjQsdC60Lgg0LIg0LTQvtC60YPQvNC10L3RglxyXG5cclxuICAgICAgLy8gINCh0YLRgNC+0LrQsCDRgdC+0L7QsdGJ0LXQvdC40Y9cclxuICAgICAgdmFyIGN1c3RvbVZhbGlkaXR5TWVzc2FnZUZvckhUTUwgPSBpbnB1dEN1c3RvbVZhbGlkYXRpb24uZ2V0SW52YWxpZGl0aWVzRm9ySFRNTCgpO1xyXG4gICAgICAvLyDQldGB0LvQuCDQv9C+0LvQtSDQv9GD0YHRgtC+0LUsINGC0L4g0L3QuNGH0LXQs9C+INC90LUg0LTQtdC70LDQtdC8XHJcbiAgICAgIGlmICghY3VzdG9tVmFsaWRpdHlNZXNzYWdlRm9ySFRNTCkge1xyXG4gICAgICAgIGN1c3RvbVZhbGlkaXR5TWVzc2FnZUZvckhUTUwgPSdSZXF1aXJlZCBmaWVsZCc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMucGFyZW50RWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZUVuZCcsICc8c3BhbiBjbGFzcz1cInBhZ2UtbWFpbl9fbGFiZWwtLWhlbHBcIj4nICsgY3VzdG9tVmFsaWRpdHlNZXNzYWdlRm9ySFRNTCArICc8L3NwYW4+Jyk7XHJcbiAgICAgIGlucHV0Q3VzdG9tVmFsaWRhdGlvbi5yZXNldEludmFsaWRpdHkoKTtcclxuXHJcbiAgICAgIHZhciBzdG9wU3VibWl0ID0gdHJ1ZTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybjtcclxuICAgIH0gLy8g0LfQsNC60L7QvdGH0LjQu9GB0Y8gaWZcclxuICAgIC8vINCj0LTQsNC70LjQvCDRgdGD0YnQtdGB0YLQstGD0Y7RidC40LUg0L7RiNC40LHQutC4ICjQvdCw0LTQviDQsdGD0LTQtdGCINC/0LXRgNC10LTQtdC70LDRgtGMINC90LAgcmVwbGFjZSlcclxuICAgIGlmKHRoaXMucGFyZW50RWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPiAxKSB7XHJcbiAgICAgIHRoaXMucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtbWFpbl9fZmVlZGJhY2stbGFiZWwtLXdyb25nJyk7Ly8g0JTQvtCx0LDQu9GP0LXQvCDQvNC10YLQutGDINCd0JUg0LLQsNC70LjQtNC90L7RgdGC0Lgg0L/QvtC70Y8sINC40YHQv9C+0LvRjNC30YPRjyDQt9Cw0YDQsNC90LXQtSDQv9C+0LTQs9C+0YLQvtCy0LvQtdC90L3Ri9C5INC60LvQsNGB0YHRiyDQsiBsZXNzXHJcbiAgICB0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgncGFnZS1tYWluX19mZWVkYmFjay1sYWJlbC0tY29ycmVjdCcpOy8vINCj0LTQsNC70Y/QtdC8INC80LXRgtC60YMg0LLQsNC70LjQtNC90L7RgdGC0Lgg0L/QvtC70Y8sINC40YHQv9C+0LvRjNC30YPRjyDQt9Cw0YDQsNC90LXQtSDQv9C+0LTQs9C+0YLQvtCy0LvQtdC90L3Ri9C5INC60LvQsNGB0YHRiyDQsiBsZXNzXHJcbiAgICBcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlcXVlc3QoYXJndW1lbnQpIHtcclxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICB4aHIub3BlbignUE9TVCcsICcvc2VuZCcsIHRydWUpO1xyXG5cclxuICAgIHhoci5zZW5kKGFyZ3VtZW50KTtcclxuXHJcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgIT0gNCkge1xyXG4gICAgICAgIHJldHVybjsvLyDQv9C+INC+0LrQvtC90YfQsNC90LjQuCDQt9Cw0L/RgNC+0YHQsCDQtNC+0YHRgtGD0L/QvdGLOlxyXG4gICAgICB9XHJcbiAgICAgIC8vIHN0YXR1cywgc3RhdHVzVGV4dFxyXG4gICAgICAvLyByZXNwb25zZVRleHQsIHJlc3BvbnNlWE1MICjQv9GA0LggY29udGVudC10eXBlOiB0ZXh0L3htbClcclxuICAgICAgaWYgKHRoaXMuc3RhdHVzICE9IDIwMCkge1xyXG4gICAgICAgIC8vINC+0LHRgNCw0LHQvtGC0LDRgtGMINC+0YjQuNCx0LrRg1xyXG4gICAgICAgIGFsZXJ0KCAn0L7RiNC40LHQutCwOiAnICsgKHRoaXMuc3RhdHVzID8gdGhpcy5zdGF0dXNUZXh0IDogJ9C30LDQv9GA0L7RgSDQvdC1INGD0LTQsNC70YHRjycpICk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSkod2luZG93LCBkb2N1bWVudCk7IiwiOyhmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50KSB7XHJcbiAgdmFyIGFycm93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtbWFpbl9fYXJyb3cnKSxcclxuICAgICAgc3BlZWQgPSAwLjI7ICAvLyDRgdC60L7RgNC+0YHRgtGMLCDQvNC+0LbQtdGCINC40LzQtdGC0Ywg0LTRgNC+0LHQvdC+0LUg0LfQvdCw0YfQtdC90LjQtSDRh9C10YDQtdC3INGC0L7Rh9C60YNcclxuXHJcblxyXG4gICAgYXJyb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIGlmICggZS50YXJnZXQudGFnTmFtZSAhPSAnQScpIHtcclxuICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQuY2hpbGRyZW5bMF07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBsaW5rID0gdGFyZ2V0IHx8IGUudGFyZ2V0LFxyXG4gICAgICAgICAgc2Nyb2xsID0gd2luZG93LnBhZ2VZT2Zmc2V0OyAgLy8g0L/RgNC+0LrRgNGD0YLQutCwXHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhsaW5rLmhyZWYpO1xyXG4gICAgICB2YXIgaGFzaCA9IGxpbmsuaHJlZi5yZXBsYWNlKC9bXiNdKiguKikvLCAnJDEnKSwgIC8vIGlkINGN0LvQtdC80LXQvdGC0LAsINC6INC60L7RgtC+0YDQvtC80YMg0L3Rg9C20L3QviDQv9C10YDQtdC50YLQuFxyXG4gICAgICAgICAgZGlzdGFuY2VGcm9tV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihoYXNoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLSA4MCwgIC8vINC+0YLRgdGC0YPQvyDQvtGCINC+0LrQvdCwINCx0YDQsNGD0LfQtdGA0LAg0LTQviBpZFxyXG4gICAgICAgICAgc3RhcnQgPSBudWxsO1xyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7ICAvLyDQv9C+0LTRgNC+0LHQvdC10LUg0L/RgNC+INGE0YPQvdC60YbQuNGOINCw0L3QuNC80LDRhtC40LggW2RldmVsb3Blci5tb3ppbGxhLm9yZ11cclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIHN0ZXAodGltZSkge1xyXG4gICAgICAgIGlmIChzdGFydCA9PT0gbnVsbCkgc3RhcnQgPSB0aW1lO1xyXG4gICAgICAgIHZhciBwcm9ncmVzcyA9IHRpbWUgLSBzdGFydCxcclxuICAgICAgICAgICAgZW5kQ29vcmRzID0gKGRpc3RhbmNlRnJvbVdpbmRvdyA8IDAgPyBNYXRoLm1heChzY3JvbGwgLSBwcm9ncmVzcy9zcGVlZCwgc2Nyb2xsICsgZGlzdGFuY2VGcm9tV2luZG93KSA6IFxyXG4gICAgICAgICAgICAgIE1hdGgubWluKHNjcm9sbCArIHByb2dyZXNzL3NwZWVkLCBzY3JvbGwgKyBkaXN0YW5jZUZyb21XaW5kb3cpKTtcclxuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCxlbmRDb29yZHMpO1xyXG4gICAgICAgIGlmIChlbmRDb29yZHMgIT0gc2Nyb2xsICsgZGlzdGFuY2VGcm9tV2luZG93KSB7XHJcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgKVxyXG59KHdpbmRvdywgZG9jdW1lbnQpKTsiLCI7KGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50KSB7XHJcbiAgdmFyIGJpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWhlYWRlcl9fY29udGFjdC1waG9uZS1iaWQnKTtcclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgaGFuZGxlcik7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBoYW5kbGVyKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlcihlKSB7XHJcbiAgICB2YXIgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtaGVhZGVyX19pbm5lcicpO1xyXG4gICAgdmFyIHRvcCA9IGdldERvY0Nvb3JkcygpO1xyXG5cclxuICAgIGlmICggdG9wIDwgNDAgJiYgaGVhZGVyLmNsYXNzTGlzdC5jb250YWlucygncGFnZS1oZWFkZXJfX2lubmVyLS1maXhlZCcpKSB7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1RvcCA9ICcwcHgnO1xyXG4gICAgICBnZXRTdGF0aWNIZWFkZXIoaGVhZGVyKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfSBlbHNlIGlmICh0b3AgPj0gNDAgJiYgIWhlYWRlci5jbGFzc0xpc3QuY29udGFpbnMoJ3BhZ2UtaGVhZGVyX19pbm5lci0tZml4ZWQnKSkge1xyXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdUb3AgPSAnMTIxcHgnO1xyXG4gICAgICBnZXRGaXhlZEhlYWRlcihoZWFkZXIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9IFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0RG9jQ29vcmRzKCkge1xyXG4gICAgcmV0dXJuIHdpbmRvdy5wYWdlWU9mZnNldDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldEZpeGVkSGVhZGVyKGhlYWRlcikgeyAvLyDQutGA0L7QvNC1IElFOC1cclxuICAgIHZhciBsaW5rcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaXRlLW5hdl9fbGluaycpO1xyXG4gICAgdmFyIGJpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWhlYWRlcl9fY29udGFjdC1waG9uZS1iaWQnKTtcclxuICAgIHZhciB0ZWxsTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWhlYWRlcl9fY29udGFjdC1udW1iZXItbGlzdCcpO1xyXG4gICAgXHJcbiAgICB0ZWxsTGlzdC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuICAgIGJpZC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuICAgIC8vYmlkLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcclxuICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdwYWdlLWhlYWRlcl9faW5uZXItLWZpeGVkJyk7XHJcbiAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgncGFnZS1oZWFkZXJfX2FuaW1hdGUnKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlua3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKGxpbmtzW2ldLmNsYXNzTGlzdC5jb250YWlucygnc2l0ZS1uYXZfX2xpbmstLWFjdGl2ZScpKSB7XHJcbiAgICAgICAgbGlua3NbaV0uY2xhc3NMaXN0LmFkZCgnc2l0ZS1uYXZfX2xpbmstLWFjdGl2ZS1maXhlZCcpO1xyXG4gICAgICB9XHJcbiAgICAgIGxpbmtzW2ldLmNsYXNzTGlzdC5hZGQoJ3NpdGUtbmF2X19saW5rLS1maXhlZCcpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGdldFN0YXRpY0hlYWRlcihoZWFkZXIpIHsgLy8g0LrRgNC+0LzQtSBJRTgtXHJcbiAgICB2YXIgbGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2l0ZS1uYXZfX2xpbmsnKTtcclxuICAgIHZhciBiaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1oZWFkZXJfX2NvbnRhY3QtcGhvbmUtYmlkJyk7XHJcbiAgICB2YXIgdGVsbExpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1oZWFkZXJfX2NvbnRhY3QtbnVtYmVyLWxpc3QnKTtcclxuICAgIFxyXG4gICAgdGVsbExpc3QuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XHJcbiAgICBiaWQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcbiAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1oZWFkZXJfX2lubmVyLS1maXhlZCcpO1xyXG4gICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtaGVhZGVyX19hbmltYXRlJyk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmtzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxpbmtzW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ3NpdGUtbmF2X19saW5rLS1maXhlZCcpO1xyXG4gICAgICBpZiAobGlua3NbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdzaXRlLW5hdl9fbGluay0tYWN0aXZlJykpIHtcclxuICAgICAgICBsaW5rc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdzaXRlLW5hdl9fbGluay0tYWN0aXZlLWZpeGVkJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxufSkod2luZG93LCBkb2N1bWVudCkiLCI7KGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQpIHtcclxuICB2YXIgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNpdGUtbmF2JyksXHJcbiAgICAgIHNwZWVkID0gMjsgIC8vINGB0LrQvtGA0L7RgdGC0YwsINC80L7QttC10YIg0LjQvNC10YLRjCDQtNGA0L7QsdC90L7QtSDQt9C90LDRh9C10L3QuNC1INGH0LXRgNC10Lcg0YLQvtGH0LrRg1xyXG5cclxuXHJcbiAgICBuYXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIGlmICggIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnc2l0ZS1uYXZfX2xpbmstanMnKSApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBsaW5rID0gZS50YXJnZXQsXHJcbiAgICAgICAgICBzY3JvbGwgPSB3aW5kb3cucGFnZVlPZmZzZXQsICAvLyDQv9GA0L7QutGA0YPRgtC60LBcclxuICAgICAgICAgIGhhc2ggPSBsaW5rLmhyZWYucmVwbGFjZSgvW14jXSooLiopLywgJyQxJyksICAvLyBpZCDRjdC70LXQvNC10L3RgtCwLCDQuiDQutC+0YLQvtGA0L7QvNGDINC90YPQttC90L4g0L/QtdGA0LXQudGC0LhcclxuICAgICAgICAgIGRpc3RhbmNlRnJvbVdpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaGFzaCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gODAsICAvLyDQvtGC0YHRgtGD0L8g0L7RgiDQvtC60L3QsCDQsdGA0LDRg9C30LXRgNCwINC00L4gaWRcclxuICAgICAgICAgIHN0YXJ0ID0gbnVsbDtcclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApOyAgLy8g0L/QvtC00YDQvtCx0L3QtdC1INC/0YDQviDRhNGD0L3QutGG0LjRjiDQsNC90LjQvNCw0YbQuNC4IFtkZXZlbG9wZXIubW96aWxsYS5vcmddXHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiBzdGVwKHRpbWUpIHtcclxuICAgICAgICBpZiAoc3RhcnQgPT09IG51bGwpIHN0YXJ0ID0gdGltZTtcclxuICAgICAgICB2YXIgcHJvZ3Jlc3MgPSB0aW1lIC0gc3RhcnQsXHJcbiAgICAgICAgICAgIGVuZENvb3JkcyA9IChkaXN0YW5jZUZyb21XaW5kb3cgPCAwID8gTWF0aC5tYXgoc2Nyb2xsIC0gcHJvZ3Jlc3Mvc3BlZWQsIHNjcm9sbCArIGRpc3RhbmNlRnJvbVdpbmRvdykgOiBcclxuICAgICAgICAgICAgICBNYXRoLm1pbihzY3JvbGwgKyBwcm9ncmVzcy9zcGVlZCwgc2Nyb2xsICsgZGlzdGFuY2VGcm9tV2luZG93KSk7XHJcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsZW5kQ29vcmRzKTtcclxuICAgICAgICBpZiAoZW5kQ29vcmRzICE9IHNjcm9sbCArIGRpc3RhbmNlRnJvbVdpbmRvdykge1xyXG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIClcclxufSh3aW5kb3csIGRvY3VtZW50KSk7IiwiOyhmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCkge1xyXG4gICd1c2Ugc3RyaWN0J1xyXG4gIC8vIEV2ZW50cyBzdGF0ZW1lbnRzIG9uIGNvbnRlbnRMb2FkZWRcclxuICB2YXIgbGlCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnZS1tYWluX19wb3J0Zm9saW8taW5kaWNhdGlvbi1saScpLFxyXG4gICAgICBzbGlkaWVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhZ2UtbWFpbl9fcG9ydGZvbGlvLXNsaWRlJyksXHJcbiAgICAgIGxpc3RJbmRpY2F0b3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1tYWluX19wb3J0Zm9saW8taW5kaWNhdGlvbi1saXN0Jyk7XHJcblxyXG4gIGxpc3RJbmRpY2F0b3IuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgaWYgKGUudGFyZ2V0LnRhZ05hbWUgIT0gJ0xJJykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB2YXIgbnVtYmVyU2xpZGUgPSArZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLW51bWJlcicpIC0gMTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpQnRuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmICggbGlCdG5baV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdwYWdlLW1haW5fX3BvcnRmb2xpby1pbmRpY2F0aW9uLWxpLS1hY3RpdmUnKSApIHtcclxuICAgICAgICBsaUJ0bltpXS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLW1haW5fX3BvcnRmb2xpby1pbmRpY2F0aW9uLWxpLS1hY3RpdmUnKTtcclxuICAgICAgICBzbGlkaWVzW2ldLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdwYWdlLW1haW5fX3BvcnRmb2xpby1pbmRpY2F0aW9uLWxpLS1hY3RpdmUnKTtcclxuICAgIHNsaWRpZXNbbnVtYmVyU2xpZGVdLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xyXG4gIH0pO1xyXG59KSh3aW5kb3csIGRvY3VtZW50KTsiLCI7KGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50KSB7XHJcbiAgJ3VzZSBzdHJpY3QnXHJcbiAgLy8gRXZlbnRzIHN0YXRlbWVudHMgb24gY29udGVudExvYWRlZFxyXG4gIHZhciBzbGlkZXJIZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnZS1tYWluX19zbGlkZXItaGVhZGVyJyksXHJcbiAgICAgIHNsaWRlclRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnZS1tYWluX19zbGlkZXItdGV4dCcpLFxyXG4gICAgICBzbGlkZXJCdG5DYWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhZ2UtbWFpbl9fc2xpZGVyLWJ0bicpLFxyXG4gICAgICBzbGlkZXJUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnZS1tYWluX19zbGlkZXItdG9nZ2xlJyksXHJcbiAgICAgIGFyckNvbnRlbnRFbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYWdlLW1haW5fX3NsaWRlci1jb250ZW50JyksXHJcbiAgICAgIGluZGljYXRvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYWdlLW1haW5fX3NsaWRlci1pbmRpY2F0b3ItbGknKSxcclxuICAgICAgZGl2aWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYWdlLW1haW5fX3NsaWRlci1kaXZpZGVyJyk7XHJcblxyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWRlclRvZ2dsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBzbGlkZXJUb2dnbGVbaV0uY2xhc3NMaXN0LmFkZCgnYW5pbWF0ZWQnKTtcclxuICAgICAgc2xpZGVyVG9nZ2xlW2ldLmNsYXNzTGlzdC5hZGQoJ2ZhZGVJbkRvd25CaWcnKTtcclxuICAgICAgc2xpZGVyVG9nZ2xlW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY29udGVudFByZXZOZXh0VG9nZ2xlKTtcclxuICAgICAgc2xpZGVyVG9nZ2xlW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlSW5Eb3duQmlnJyk7IFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGlkZXJIZWFkZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgc2xpZGVySGVhZGVyW2ldLmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGVkJyk7XHJcbiAgICAgIHNsaWRlckhlYWRlcltpXS5jbGFzc0xpc3QuYWRkKCdmYWRlSW5Eb3duJyk7IFxyXG4gICAgfSBcclxuICB9KTtcclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpZGVyVGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBzbGlkZXJUZXh0W2ldLmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGVkJyk7XHJcbiAgICAgIHNsaWRlclRleHRbaV0uY2xhc3NMaXN0LmFkZCgnZmFkZUluVXAnKTsgXHJcbiAgICB9IFxyXG4gIH0pO1xyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWRlckJ0bkNhbGwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgc2xpZGVyQnRuQ2FsbFtpXS5jbGFzc0xpc3QuYWRkKCdhbmltYXRlZCcpO1xyXG4gICAgICBzbGlkZXJCdG5DYWxsW2ldLmNsYXNzTGlzdC5hZGQoJ2ZhZGVJblVwJyk7IFxyXG4gICAgfSBcclxuICB9KTtcclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXZpZGVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGRpdmlkZXJbaV0uY2xhc3NMaXN0LmFkZCgnYW5pbWF0ZWQnKTtcclxuICAgICAgZGl2aWRlcltpXS5jbGFzc0xpc3QuYWRkKCdyb3RhdGVJbicpOyBcclxuICAgIH0gXHJcbiAgfSk7XHJcblxyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLW1haW5fX3NsaWRlci1zY3JvbGwnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgdmFyIGxpbmsgPSBlLnRhcmdldCxcclxuICAgICAgICAgIHNwZWVkID0gMiwgIC8vINGB0LrQvtGA0L7RgdGC0YwsINC80L7QttC10YIg0LjQvNC10YLRjCDQtNGA0L7QsdC90L7QtSDQt9C90LDRh9C10L3QuNC1INGH0LXRgNC10Lcg0YLQvtGH0LrRg1xyXG4gICAgICAgICAgc2Nyb2xsID0gd2luZG93LnBhZ2VZT2Zmc2V0LCAgLy8g0L/RgNC+0LrRgNGD0YLQutCwXHJcbiAgICAgICAgICBoYXNoID0gbGluay5ocmVmLnJlcGxhY2UoL1teI10qKC4qKS8sICckMScpLCAgLy8gaWQg0Y3Qu9C10LzQtdC90YLQsCwg0Log0LrQvtGC0L7RgNC+0LzRgyDQvdGD0LbQvdC+INC/0LXRgNC10LnRgtC4XHJcbiAgICAgICAgICBkaXN0YW5jZUZyb21XaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGhhc2gpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIDgwLCAgLy8g0L7RgtGB0YLRg9C/INC+0YIg0L7QutC90LAg0LHRgNCw0YPQt9C10YDQsCDQtNC+IGlkXHJcbiAgICAgICAgICBzdGFydCA9IG51bGw7XHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTsgIC8vINC/0L7QtNGA0L7QsdC90LXQtSDQv9GA0L4g0YTRg9C90LrRhtC40Y4g0LDQvdC40LzQsNGG0LjQuCBbZGV2ZWxvcGVyLm1vemlsbGEub3JnXVxyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gc3RlcCh0aW1lKSB7XHJcbiAgICAgICAgaWYgKHN0YXJ0ID09PSBudWxsKSBzdGFydCA9IHRpbWU7XHJcbiAgICAgICAgdmFyIHByb2dyZXNzID0gdGltZSAtIHN0YXJ0LFxyXG4gICAgICAgICAgICBlbmRDb29yZHMgPSAoZGlzdGFuY2VGcm9tV2luZG93IDwgMCA/IE1hdGgubWF4KHNjcm9sbCAtIHByb2dyZXNzL3NwZWVkLCBzY3JvbGwgKyBkaXN0YW5jZUZyb21XaW5kb3cpIDogXHJcbiAgICAgICAgICAgICAgTWF0aC5taW4oc2Nyb2xsICsgcHJvZ3Jlc3Mvc3BlZWQsIHNjcm9sbCArIGRpc3RhbmNlRnJvbVdpbmRvdykpO1xyXG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLGVuZENvb3Jkcyk7XHJcbiAgICAgICAgaWYgKGVuZENvb3JkcyAhPSBzY3JvbGwgKyBkaXN0YW5jZUZyb21XaW5kb3cpIHtcclxuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG5cclxuXHJcbiAgZnVuY3Rpb24gY29udGVudFByZXZOZXh0VG9nZ2xlKGV2ZW50KSB7XHJcblxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBpZiAodGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ3BhZ2UtbWFpbl9fc2xpZGVyLXRvZ2dsZS0tbmV4dCcpKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyQ29udGVudEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKCAhYXJyQ29udGVudEVsZW1lbnRzW2ldLmNsYXNzTGlzdC5jb250YWlucygncGFnZS1tYWluX19zbGlkZXItY29udGVudC1oaWRkZW4nKSAmJiAoaSA9PT0gYXJyQ29udGVudEVsZW1lbnRzLmxlbmd0aCAtIDEpICkge1xyXG4gICAgICAgICAgYXJyQ29udGVudEVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQoJ3BhZ2UtbWFpbl9fc2xpZGVyLWNvbnRlbnQtaGlkZGVuJyk7XHJcbiAgICAgICAgICBhcnJDb250ZW50RWxlbWVudHNbMF0uY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1tYWluX19zbGlkZXItY29udGVudC1oaWRkZW4nKTtcclxuICAgICAgICAgIGluZGljYXRvcltpXS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLW1haW5fX3NsaWRlci1pbmRpY2F0b3ItbGktLWFjdGl2ZScpO1xyXG4gICAgICAgICAgaW5kaWNhdG9yWzBdLmNsYXNzTGlzdC5hZGQoJ3BhZ2UtbWFpbl9fc2xpZGVyLWluZGljYXRvci1saS0tYWN0aXZlJyk7XHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9IGVsc2UgaWYgKCFhcnJDb250ZW50RWxlbWVudHNbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdwYWdlLW1haW5fX3NsaWRlci1jb250ZW50LWhpZGRlbicpKSB7XHJcbiAgICAgICAgICBhcnJDb250ZW50RWxlbWVudHNbaV0uY2xhc3NMaXN0LmFkZCgncGFnZS1tYWluX19zbGlkZXItY29udGVudC1oaWRkZW4nKTtcclxuICAgICAgICAgIGluZGljYXRvcltpXS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLW1haW5fX3NsaWRlci1pbmRpY2F0b3ItbGktLWFjdGl2ZScpO1xyXG4gICAgICAgICAgYXJyQ29udGVudEVsZW1lbnRzWysraV0uY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1tYWluX19zbGlkZXItY29udGVudC1oaWRkZW4nKTtcclxuICAgICAgICAgIGluZGljYXRvcltpXS5jbGFzc0xpc3QuYWRkKCdwYWdlLW1haW5fX3NsaWRlci1pbmRpY2F0b3ItbGktLWFjdGl2ZScpO1xyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgaWYgKHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYWdlLW1haW5fX3NsaWRlci10b2dnbGUtLXByZXYnKSkge1xyXG4gICAgICBmb3IgKHZhciBpID0gYXJyQ29udGVudEVsZW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgaWYgKCAhYXJyQ29udGVudEVsZW1lbnRzW2ldLmNsYXNzTGlzdC5jb250YWlucygncGFnZS1tYWluX19zbGlkZXItY29udGVudC1oaWRkZW4nKSAmJiAoaSA9PT0gMCkgKSB7XHJcbiAgICAgICAgICBhcnJDb250ZW50RWxlbWVudHNbaV0uY2xhc3NMaXN0LmFkZCgncGFnZS1tYWluX19zbGlkZXItY29udGVudC1oaWRkZW4nKTtcclxuICAgICAgICAgIGFyckNvbnRlbnRFbGVtZW50c1thcnJDb250ZW50RWxlbWVudHMubGVuZ3RoIC0gMV0uY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1tYWluX19zbGlkZXItY29udGVudC1oaWRkZW4nKTtcclxuICAgICAgICAgIGluZGljYXRvclthcnJDb250ZW50RWxlbWVudHMubGVuZ3RoIC0gMV0uY2xhc3NMaXN0LmFkZCgncGFnZS1tYWluX19zbGlkZXItaW5kaWNhdG9yLWxpLS1hY3RpdmUnKTtcclxuICAgICAgICAgIGluZGljYXRvclswXS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLW1haW5fX3NsaWRlci1pbmRpY2F0b3ItbGktLWFjdGl2ZScpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIShhcnJDb250ZW50RWxlbWVudHNbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdwYWdlLW1haW5fX3NsaWRlci1jb250ZW50LWhpZGRlbicpKSkge1xyXG4gICAgICAgICAgYXJyQ29udGVudEVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQoJ3BhZ2UtbWFpbl9fc2xpZGVyLWNvbnRlbnQtaGlkZGVuJyk7XHJcbiAgICAgICAgICBpbmRpY2F0b3JbaV0uY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1tYWluX19zbGlkZXItaW5kaWNhdG9yLWxpLS1hY3RpdmUnKTtcclxuICAgICAgICAgIGFyckNvbnRlbnRFbGVtZW50c1stLWldLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtbWFpbl9fc2xpZGVyLWNvbnRlbnQtaGlkZGVuJyk7XHJcbiAgICAgICAgICBpbmRpY2F0b3JbaV0uY2xhc3NMaXN0LmFkZCgncGFnZS1tYWluX19zbGlkZXItaW5kaWNhdG9yLWxpLS1hY3RpdmUnKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxufSkod2luZG93LCBkb2N1bWVudCk7XHJcbiIsIjsoZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuICB2YXIgZmlsZSA9ICcuLi9pbWcvc3ByaXRlL3BhZ2Utc3ByaXRlLnN2ZycsIC8vINC/0YPRgtGMINC6INGE0LDQudC70YMg0YHQv9GA0LDQudGC0LAg0L3QsCDRgdC10YDQstC10YDQtVxyXG4gICAgICByZXZpc2lvbiA9IDE7ICAgICAgICAgICAgLy8g0LLQtdGA0YHQuNGPINGB0L/RgNCw0LnRgtCwXHJcbiAgaWYgKCFkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMgfHwgIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJykuY3JlYXRlU1ZHUmVjdCkgcmV0dXJuIHRydWU7XHJcbiAgdmFyIGlzTG9jYWxTdG9yYWdlID0gJ2xvY2FsU3RvcmFnZScgaW4gd2luZG93ICYmIHdpbmRvd1snbG9jYWxTdG9yYWdlJ10gIT09IG51bGwsXHJcbiAgICByZXF1ZXN0LFxyXG4gICAgZGF0YSxcclxuICAgIGluc2VydElUID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgZGF0YSk7XHJcbiAgICB9LFxyXG4gICAgaW5zZXJ0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmIChkb2N1bWVudC5ib2R5KSBpbnNlcnRJVCgpO1xyXG4gICAgICBlbHNlIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbnNlcnRJVCk7XHJcbiAgICB9O1xyXG4gIGlmIChpc0xvY2FsU3RvcmFnZSAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaW5saW5lU1ZHcmV2JykgPT0gcmV2aXNpb24pIHtcclxuICAgIGRhdGEgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaW5saW5lU1ZHZGF0YScpO1xyXG4gICAgaWYgKGRhdGEpIHtcclxuICAgICAgaW5zZXJ0KCk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICB0cnkge1xyXG4gICAgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgcmVxdWVzdC5vcGVuKCdHRVQnLCBmaWxlLCB0cnVlKTtcclxuICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA+PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgPCA0MDApIHtcclxuICAgICAgICBkYXRhID0gcmVxdWVzdC5yZXNwb25zZVRleHQ7XHJcbiAgICAgICAgaW5zZXJ0KCk7XHJcbiAgICAgICAgaWYgKGlzTG9jYWxTdG9yYWdlKSB7XHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnaW5saW5lU1ZHZGF0YScsIGRhdGEpO1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2lubGluZVNWR3JldicsIHJldmlzaW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJlcXVlc3Quc2VuZCgpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiZWPRgtGMINC+0YjQuNCx0LrQsCDQsiDRgdC/0YDQsNC50YLQtSBTVkdcIik7XHJcbiAgfVxyXG59KHdpbmRvdywgZG9jdW1lbnQpKTsiXX0=
