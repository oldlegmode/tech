;(function (window, document) {
  'use strict'

  var toggle = document.getElementById('dropDown');
  var list =document.querySelector('.site-nav__list');


  toggle.addEventListener('click', handler);

  function handler(e) {
    e.preventDefault();

//list-nav
    var removeListAnimate = removeAnimation(700);
    var removeToggleAnimate = removeAnimation(700);

.site-nav__burger--active-bottom
    list.classList('');
    //this.previousElementSibling.classList.toggle('animated');
    //this.previousElementSibling.classList.toggle('fadeInRight--site-nav');
    //removeListAnimate(this.previousElementSibling,'fadeInRight--site-nav');
  // toggle
    //this.classList.toggle('animated');
    //this.classList.toggle('pulse--site-nav');
    //this.classList.toggle('site-nav__toggle--active');
    //removeDivAnimate(this,'pulse--site-nav');

    function removeAnimation(timer) {
      return function (arg, str) {
        var saveThis = this;
          var saveArg = arguments;
        setTimeout (function () {
          
          f.apply(saveThis, saveArg)
        }, timer);
      };
      function f(arg, str) {
       arg.classList.remove('animated');
       arg.classList.remove( str );
      }; 
    }
  }
})(window, document);