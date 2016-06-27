/**
 * Card widget
 *
 * The card widget creates cards with an image
 *
 * @param {number} id       The id of the card
 * @param {boolean} flipped The state indicating wether the card is flipped or not
 * @param {string} image    the path to the image
 *
 * @constructor
 * @extends luga.Notifier
 *
 * @fires selectedCard
 */

memoryCardGame.Card = function (params) {
    'use strict';

    luga.extend(luga.Notifier, this);

    var CONST = {
        CSS: {
            ROOT: 'memory-card'
        },
        DATA: {
            CARD_ID: 'data-card-id'
        },
        HTML: {
            CARD_NODE: '<li></li>',
            IMAGE_NODE: '<img>'
        },
        EVENT: {
            SELECTED_CARD: 'selectedCard'
        }
    };

    var config = {
        id: null,
        flipped: false,
        image: null
    };

    // Merge incoming params with internal config
    $.extend(config, params);

    /**
     * @type {boolean}
     */
    var discovered = false;

    /**
     * @type {HTMLElement}
     */
    var imageNode = $(CONST.HTML.IMAGE_NODE);

    /**
     * @type {jQuery}
     */
    this.container = $(CONST.HTML.CARD_NODE).addClass(CONST.CSS.ROOT);

    /**
     * @type {memoryCardGame.Card}
     */
    var self = this;

    var init = function () {
        self.container.attr(CONST.DATA.CARD_ID, config.id);
        attachEvents();
    };

    /**
     * @fires selectedCard
     */
    var attachEvents = function () {
        self.container.click(function () {
            if (config.flipped === false) {
                flip(self.container);
                self.notifyObservers(CONST.EVENT.SELECTED_CARD, {
                    card: self
                });
            }
        });
    };

    /**
     * When the card is facing upwards it must show the associated image to it
     * @param {HTMLElement}
     */
    var flip = function (cardNode) {
        config.flipped = !config.flipped;

        if (config.flipped === true) {
            cardNode.append(getImageNode());
        }
        else {
            cardNode.find(imageNode).remove();
        }
    };

    var getImageNode = function () {
        imageNode.attr('src', config.image);
        return imageNode;
    };

    this.getCardNodeAndFlip = function () {
        var cardNode = $('.' + CONST.CSS.ROOT + '[' + CONST.DATA.CARD_ID + '=' + config.id + ']');
        flip(cardNode);
    };

    this.getImage = function () {
        return config.image;
    };

    this.setDiscovered = function () {
        discovered = true;
    };

    init.call(this);
};

