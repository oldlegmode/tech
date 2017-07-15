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
