// Copyright (C) New York Media, LLC
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential
// Written by Jason Tseng <jason.tseng@nymag.com>, 2018

'use strict';

DS.controller('cut-newsletter-sign-up', ['dom', function (dom) {
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
      var request = new XMLHttpRequest();

      dom.preventDefault(e);
      request.open('POST', this.getRequestUrl(), true);
      request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      request.addEventListener('load', this.onRequest.bind(this));
      request.addEventListener('error', this.onError.bind(this));
      request.send(JSON.stringify(this.getPayloadObject()));
      e.preventDefault();
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
    }
  };

  return Constructor;
}]);
