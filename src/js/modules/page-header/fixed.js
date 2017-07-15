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