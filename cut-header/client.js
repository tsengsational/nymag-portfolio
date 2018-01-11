'use strict';

DS.controller('cut-header', ['dom', '$window', '_', function (dom, $window, _) {
  function Constructor(el) {
    this.el = el;
    this.menubtn = dom.findAll(el, '.menu-btn')[1];
    this.menu = dom.find(el, '.right');
    this.logo = dom.find(el, '.left');
    this.expandedNav = dom.find(el, '#expanded-nav');
    this.menuBtnMobile = dom.find(el, '.menu-btn.mobile');
    this.sections = dom.findAll('main, footer, section:not(.search)');
    this.scrolling = false;
    this.scrollDetect = scrollDetect.bind(this);
    this.scrollHandler = _.throttle(this.scrollDetect, 200);
    this.maxWidth = el.classList.contains('homepage-breakpoints') ? 767 : 600;

    const nav = dom.find(el, '.nav'),
      body = dom.find('body');

    $window.innerWidth < this.maxWidth && $window.addEventListener('scroll', this.scrollHandler);

    function closeNav() {
      this.menu.classList.toggle('is-active');
      this.logo.classList.toggle('menu-open');
      this.menubtn.classList.toggle('nav-open');
      this.menubtn.setAttribute('aria-expanded', 'false');
      this.menuBtnMobile.setAttribute('aria-expanded', 'false');
    }

    closeNav = closeNav.bind(this);

    function scrollDetect() {
      $window.scrollY > 0 ? this.scrolling = true : this.scrolling = false;
      this.scrolling ? nav.classList.add('scrolling') : nav.classList.remove('scrolling');
    }

    function toggleHomePage() {
      this.sections.forEach(function (component) {component.classList.toggle('hidden-component');});
    }

    this.toggleHomePage = toggleHomePage.bind(this);

    body.addEventListener('click', function (e) {

      if (!nav.contains(e.target) && e.target !== this.menuBtnMobile && this.menu.classList.contains('is-active')) {
        closeNav();
      }
    }.bind(this));

    document.onkeydown = function (e) {
      const event = e || window.event;

      if (event.keyCode === 27 && this.menu.classList.contains('is-active')) {
        closeNav();
      }
    }.bind(this);
  }


  Constructor.prototype = {
    events: {
      '.menu-btn click': 'chevronClickHandler'
    },
    chevronClickHandler: function () {
      this.menu.classList.toggle('is-active');
      this.logo.classList.toggle('menu-open');
      this.menubtn.classList.toggle('nav-open');

      if (this.menu.classList.contains('is-active')) {
        this.menubtn.setAttribute('aria-expanded', 'true');
        this.menuBtnMobile.setAttribute('aria-expanded', 'true');
        $window.innerWidth <= this.maxWidth && this.toggleHomePage();
      } else {
        this.menubtn.setAttribute('aria-expanded', 'false');
        this.menuBtnMobile.setAttribute('aria-expanded', 'false');
        $window.innerWidth <= this.maxWidth && this.toggleHomePage();
      }
    }
  };

  return Constructor;
}]);
