/* global $, memoryCardGame */

memoryCardGame.Deck = function(params){

    'use strict';

    var CONST = {
        CSS: {
            ROOT: 'memory-cards',
            SINGLE_CARD_CLASS: 'memory-card'
        },
        CARD_COPIES: 2,
        TIME_FOR_FLIP: 500,
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

    var flippedCards = [];

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

    this.getPreviousFlippedCard = function()  {
        return flippedCards[flippedCards.length - 2];
    };

    this.addFlippedCard = function (card) {
        return flippedCards.push(card);
    };

    this.isNewHandStarted = function () {
        return self.getFlippedCardsNumber() % CONST.CARD_COPIES === 1;
    };

    this.isHandFinished = function () {
        return self.getFlippedCardsNumber() % CONST.CARD_COPIES === 0;
    };

    this.isAllCardsFlipped = function () {
        return self.getFlippedCardsNumber() === self.getCardsNumber();
    };

    this.setDiscoveredCards = function () {
        for (var i = 1; i <= CONST.CARD_COPIES; i++) {
            flippedCards[flippedCards.length - i].setDiscovered();
        }
    };

    this.getFlippedCardsNumber = function () {
        return flippedCards.length;
    };

    this.getCardsNumber = function() {
        return cards.length;
    };

    this.coverLatestHandFlippedCards = function () {
        setTimeout(function () {
            for (var i = 0; i < CONST.CARD_COPIES; i++) {
                flippedCards[self.getFlippedCardsNumber() - 1].getCardNodeAndFlip();
                flippedCards.pop();
            }
        }, CONST.TIME_FOR_FLIP);
    };

    init.call(this);

};

