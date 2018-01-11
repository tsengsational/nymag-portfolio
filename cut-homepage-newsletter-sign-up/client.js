'use strict';

DS.controller('cut-homepage-newsletter-sign-up', ['dom', '$window', function (dom, $window) {
  var Constructor,
    successClass = 'success',
    errorClass = 'error',
    ariaHidden = 'aria-hidden';

  /**
   * @param {Element} rootEl
   * @returns {string}
   */

  /**
   * @param {Element} el
   * @constructor
   * @property {Element} el
   */
  function Constructor(el) {
    this.el = el;
    this.email = dom.find(el, '.email');
    this.form = dom.find(el, '.form');
    this.newsletterId = dom.find(el, '.newsletterID').value;
    this.localStorage = $window.localStorage;
    this.count = parseInt(this.localStorage.getItem('theCut-homepage-logins'));
    /**
     * Error message DOM node
     * @type {Element}
     */
    this.errorMsg = dom.find(el, '.message.error');

    /**
     * Success message DOM node
     * @type {Element}
     */
    this.successMsg = dom.find(el, '.message.success');

    // increments login count by one.
    this.saveLogin();

    // if user has signed up already for newsletter, hides component
    this.localStorage.getItem('theCut-email-signed-up') && this.hideComponent();
  };

  Constructor.prototype = {
    events: {
      '.form submit': 'submit'
    },

    /**
     * Handles form submission and events
     * @param {Event} e
     */
    submit: function (e) {
      dom.preventDefault(e);
      this.onRequest({target: {status: 200}});
      // var request = new XMLHttpRequest();
      //
      // dom.preventDefault(e);
      // request.open('POST', this.getRequestUrl(), true);
      // request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      // request.addEventListener('load', this.onRequest.bind(this));
      // request.addEventListener('error', this.onError.bind(this));
      // request.send(JSON.stringify(this.getPayloadObject()));
      // e.preventDefault();
    },

    getRequestUrl: function () {
      return this.form.getAttribute('action');
    },

    getPayloadObject: function () {
      var payloadObject = {};
      // Payload object should match:
      // {
      //   "email":  email of user,
      //   "lists": {
      //     LIST ID: true
      //   }
      // }

      payloadObject.email = this.email.value;
      payloadObject.lists = {};
      payloadObject.lists[this.newsletterId] = true;
      return payloadObject;
    },

    /**
     * hides the component by applying .hide class
     */
    hideComponent: function () {
      this.el.classList.add('hide');
    },

    /**
     * increment localStorage login count
     * @param  {param} count number of times logged in
     * @param {param} times amount to increment count
     */
    incrementCount: function (count, times) {
      count += times;
      this.localStorage.setItem('theCut-homepage-logins', count.toString());
    },
    /**
     * Resets component to initial data
     */
    reset: function () {
      var el = this.el,
        form = dom.find(el, 'form');

      form.reset();
      el.classList.remove(errorClass);
      el.classList.remove(successClass);

      this.errorMsg.setAttribute(ariaHidden, true);
      this.successMsg.setAttribute(ariaHidden, true);
    },

    /**
     * On a request completing
     * @param {Event} e
     */
    onRequest: function (e) {
      var status = (e.currentTarget || e.target).status;

      if (status >= 200 && status < 300) {
        this.onSuccess();
      } else {
        this.onError(e);
      }
    },

    /**
     * On an unsuccessful subscription
     * @param {Event} e
     */
    onError: function (e) {
      this.reset();
      this.el.classList.add(errorClass);
      this.errorMsg.setAttribute(ariaHidden, false);
      this.errorMsg.focus();
      console.error('error', e);
    },

    animate: function () {
      this.el.classList.toggle('hiding');
    },
    /**
     * On a successful subscription
     */
    onSuccess: function () {
      // Set a pixel on successful submit
      if (window.fbq) {
        window.fbq('track', 'Lead');
      }
      this.reset();
      this.el.classList.add(successClass);
      this.successMsg.setAttribute(ariaHidden, false);
      this.successMsg.focus();
      setTimeout(this.animate.bind(this), 1500);
      setTimeout(this.hideComponent.bind(this), 2000);
      this.localStorage.setItem('theCut-email-signed-up', 'true');
    },

    // On load,
    saveLogin: function () {
      // increment login atribute on this.localStorage
      var count = this.count;

      // console.log('Logged in', count, 'time(s)');
      count >= 0 ? this.incrementCount(count, 1) : this.localStorage.setItem('theCut-homepage-logins', '1');
      count >= 4 && this.hideComponent();
    }
  };

  return Constructor;
}]);
