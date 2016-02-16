/* global $, jQuery, memoryCardGame */

window.memoryCardGame = {};

(function() {
    'use strict';

    /**
     * Offers a simple solution for inheritance among classes
     *
     * @param {function} baseFunc  Parent constructor function. Required
     * @param {function} func      Child constructor function. Required
     * @param {array}    args      An array of arguments that will be passed to the parent's constructor. Optional
     * @copyright 2015 Massimo Foti lugajs
     * @link https://lugajs.org
     */
    memoryCardGame.extend = function (baseFunc, func, args) {
        baseFunc.apply(func, args);
    };

    /**
     * Provides the base functionality necessary to maintain a list of observers and send notifications to them.
     * It's forbidden to use this class directly, it can only be used as a base class.
     * The Notifier class does not define any notification messages, so it is up to the developer to define the notifications sent via the Notifier.
     * @copyright 2015 Massimo Foti lugajs
     * @link https://lugajs.org
     * @throws
     */
    memoryCardGame.Notifier = function () {

        var CONST = {
            PREFIX: 'handle',
            ERROR_MESSAGES: {
                NOTIFIER_ABSTRACT: "It's forbidden to use luga.Notifier directly, it must be used as a base class instead",
                INVALID_OBSERVER: 'addObserver(): observer parameter must be an object',
                REQUIRED_DATA: 'notifyObserver(): data parameter is required',
                INVALID_DATA: 'notifyObserver(): data parameter must be an object'
            }
        };

        if (this.constructor === memoryCardGame.Notifier) {
            throw(CONST.ERROR_MESSAGES.NOTIFIER_ABSTRACT);
        }
        this.observers = [];
        var prefix = "on";
        var suffix = "Handler";

        // Turns "complete" into "onComplete"
        var generateMethodName = function (eventName) {
            var str = prefix;
            str += eventName.charAt(0).toUpperCase();
            str += eventName.substring(1);
            str += suffix;
            return str;
        };

        /**
         * Adds an observer object to the list of observers.
         * Observer objects should implement a method that matches a naming convention for the events they are interested in.
         * For an event named "complete" they must implement a method named: "onCompleteHandler"
         * The interface for this methods is as follows:
         * observer.onCompleteHandler = function(data){};
         * @param  {object} observer  Observer object
         * @throws
         */
        this.addObserver = function (observer) {
            if (jQuery.type(observer) !== "object") {
                throw(CONST.ERROR_MESSAGES.INVALID_OBSERVER);
            }
            this.observers.push(observer);
        };

        /**
         * Sends a notification to all interested observers registered with the notifier.
         *
         * @method
         * @param {string}  eventName  Name of the event
         * @param {object}  data       Object containing data to be passed from the point of notification to all interested observers.
         *                             If there is no relevant data to pass, use an empty object.
         * @throws
         */
        this.notifyObservers = function (eventName, data) {
            if (jQuery.type(data) !== "object") {
                throw(CONST.ERROR_MESSAGES.INVALID_DATA);
            }
            var method = generateMethodName(eventName);
            for (var i = 0; i < this.observers.length; i++) {
                var observer = this.observers[i];
                if (observer[method] && jQuery.isFunction(observer[method])) {
                    observer[method](data);
                }
            }
        };

        /**
         * Removes the given observer object.
         *
         * @method
         * @param {Object} observer
         */
        this.removeObserver = function (observer) {
            for (var i = 0; i < this.observers.length; i++) {
                if (this.observers[i] === observer) {
                    this.observers.splice(i, 1);
                    break;
                }
            }
        };

    };
}());