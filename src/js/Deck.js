/**
 * Deck widget
 *
 * The deck widget creates a deck of shuffled cars.
 *
 * @param {json} cardList   The cards of a selected theme
 * @constructor
 * @extends luga.notifier
 *
 * @fires handFinished
 * @fires handInvalid
 * @fires cardsAllFlipped
 *
 * @listens selectedCard
 */

memoryCardGame.Deck = function (params) {

    'use strict';

    luga.extend(luga.Notifier, this);

    var CONST = {
        CSS: {
            ROOT: 'memory-cards',
            SINGLE_CARD_CLASS: 'memory-card'
        },
        CARD_COPIES: 2,
        TIME_FOR_FLIP: 500,
        IMAGE_BASE_URL: 'src\\cardthemes',
        EVENT: {
            HAND_FINISHED: 'handFinished',
            HAND_INVALID: 'handInvalid',
            CARDS_ALL_FLIPPED: 'cardsAllFlipped'
        },
        HTML: {
            DECK: '<ul></ul>'
        }
    };

    var config = {
        cardList: null
    };

    // Merge incoming params with internal config
    $.extend(config, params);

    /**
     * @type {Array}
     */
    var cards = [];

    /**
     * @type {Array}
     */
    var flippedCards = [];

    /**
     * @type {jQuery}
     */
    this.container = $(CONST.HTML.DECK).addClass(CONST.CSS.ROOT);

    /**
     * @type {memoryCardGame.Deck}
     */
    var self = this;

    var init = function () {
        setupCards();
        shuffleCards();
        drawCards();
    };

    /**
     * Creates all the cards that are part of the deck by also creating the correct amount of duplicates.
     */
    var setupCards = function () {
        $.each(config.cardList, function (key, val) {
            for (var j = 0; j < CONST.CARD_COPIES; j++) {

                var card = new memoryCardGame.Card({
                    id: cards.length,
                    image: CONST.IMAGE_BASE_URL + '\\' + val
                });
                card.addObserver(self);
                cards.push(card);
            }
        });
    };

    var shuffleCards = function () {
        cards = cards.sort(function () {
            return 0.5 - Math.random();
        });
    };

    var drawCards = function () {
        for (var i = 0; i < cards.length; i++) {
            self.container.append(cards[i].container);
        }
    };

    /**
     * Gets the card that has previously been flipped
     * @returns {memoryCardGame.Card}
     */
    var getPreviousFlippedCard = function () {
        return flippedCards[flippedCards.length - 2];
    };

    /**
     * Detects when the user has just started a new hand. There is only one card flipped, thus there are no cards
     * to be compared with it.
     * @returns {boolean}
     */
    var isNewHandStarted = function () {
        return flippedCards.length % CONST.CARD_COPIES === 1;
    };

    /**
     * Detects when the the user has selected the correct amount of cards to finish a hand of the game
     * @returns {boolean}
     */
    var isHandFinished = function () {
        return flippedCards.length % CONST.CARD_COPIES === 0;
    };

    /**
     * Detects when all the cards on the board have been discovered and flipped
     * @returns {boolean}
     */
    var isAllCardsFlipped = function () {
        return flippedCards.length === cards.length;
    };

    /**
     * Sets all the cards of the current hand as discovered
     */
    var setDiscoveredCards = function () {
        for (var i = 1; i <= CONST.CARD_COPIES; i++) {
            flippedCards[flippedCards.length - i].setDiscovered();
        }
    };

    var coverLatestHandFlippedCards = function () {
        setTimeout(function () {
            for (var i = 0; i < CONST.CARD_COPIES; i++) {
                flippedCards[flippedCards.length - 1].getCardNodeAndFlip();
                flippedCards.pop();
            }
        }, CONST.TIME_FOR_FLIP);
    };

    /**
     * Listens to the "selectedCard" event notifications broadcast by the Card
     * @param {memoryCardGame.Card} data.card
     *
     * @fires handFinished
     * @fires handInvalid
     * @fires cardsAllFlipped
     */
    this.onSelectedCardHandler = function (data) {
        var currentCard = data.card;
        flippedCards.push(currentCard);
        if (isNewHandStarted()) {
            return;
        }
        if (getPreviousFlippedCard().getImage() === currentCard.getImage()) {
            if (isHandFinished()) {
                setDiscoveredCards();
                self.notifyObservers(CONST.EVENT.HAND_FINISHED, {});
                if (isAllCardsFlipped()) {
                    self.notifyObservers(CONST.EVENT.CARDS_ALL_FLIPPED, {});
                }
            }
        }
        else {
            coverLatestHandFlippedCards();
            self.notifyObservers(CONST.EVENT.HAND_INVALID, {});
        }
    };

    init.call(this);

};

