/* global $, memoryCardGame */

memoryCardGame.Deck = function(params){

    'use strict';

    var CONST = {
        CSS: {
            ROOT: 'memory-cards',
            SINGLE_CARD_CLASS: 'memory-card'
        },
        CARD_COPIES: 2,
        DEFAULT_IMAGES: [
            'Hydrangeas.jpg',
            'Jellyfish.jpg',
            'Koala.jpg',
            'Penguins.jpg',
            'Tulips.jpg'
        ],
        IMAGE_BASE_URL: 'src\\images'
    };

    var config = {
        gameManager: null,
        cardsClass: CONST.CSS.CARDS_CLASS,
        singleCardClass: CONST.CSS.SINGLE_CARD_CLASS
    };

    // Merge incoming params with internal config
    $.extend(config, params);

    var cards = [];

    var imageMap = [];

    this.container = $('<ul></ul>').addClass(config.cardsClass);

    var self = this;

    var init = function () {
        imageMap = imageMap.concat(CONST.DEFAULT_IMAGES);
        createCards();
        shuffleCards();
        drawCards();
    };

    var createCards = function() {
        for (var i = 0; i < imageMap.length; i++) {
            for (var j = 0; j < CONST.CARD_COPIES; j++) {
                var card = new memoryCardGame.Card({
                    id: cards.length,
                    image: CONST.IMAGE_BASE_URL + '\\' + imageMap[i],
                    gameManager: config.gameManager
                });
                cards.push(card);
            }
        }
    };

    var shuffleCards = function () {
        cards = cards.sort(function () {
            return 0.5 - Math.random();
        });
    };

    var drawCards = function () {
        for (var i = 0; i < cards.length; i++) {
            var cardNode = cards[i].getNode();
            self.container.append(cardNode);
        }
    };

    this.getCardsNumber = function() {
        return cards.length;
    };

    init.call(this);

};

