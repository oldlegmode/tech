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