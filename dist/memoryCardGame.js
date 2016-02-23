window.memoryCardGame = {};
/* global $, memoryCardGame */

window.memoryCardGame.utils = {};

(function () {
    'use strict';

    memoryCardGame.utils.persistInLocalStorage = function (data) {
        localStorage.setItem('memoryCardGame', JSON.stringify(data));
    };

    memoryCardGame.utils.addDataInLocalStorage = function (data) {
        var persistedData = memoryCardGame.utils.retrieveFromLocalStorage();
        var mergedData = $.extend({}, persistedData, data);
        memoryCardGame.utils.persistInLocalStorage(mergedData);
    };

    memoryCardGame.utils.retrieveFromLocalStorage = function () {
        return JSON.parse(localStorage.getItem('memoryCardGame'));
    };
})();

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
        DEFAULT_IMAGES: [
            'Hydrangeas.jpg',
            'Jellyfish.jpg',
            'Koala.jpg',
            'Penguins.jpg',
            'Tulips.jpg'
        ],
        IMAGE_BASE_URL: 'src\\images',
        EVENT: {
            HAND_FINISHED: 'handFinished',
            HAND_INVALID: 'handInvalid',
            CARDS_ALL_FLIPPED: 'cardsAllFlipped'
        },
        HTML: {
            DECK: '<ul></ul>'
        }
    };

    var config = {};

    // Merge incoming params with internal config
    $.extend(config, params);

    var cards = [];

    var flippedCards = [];

    var imageMap = [];

    this.container = $(CONST.HTML.DECK).addClass(CONST.CSS.ROOT);

    var self = this;

    var init = function () {
        imageMap = imageMap.concat(CONST.DEFAULT_IMAGES);
        createCards();
        shuffleCards();
        drawCards();
    };

    var createCards = function () {
        for (var i = 0; i < imageMap.length; i++) {
            for (var j = 0; j < CONST.CARD_COPIES; j++) {
                var card = new memoryCardGame.Card({
                    id: cards.length,
                    image: CONST.IMAGE_BASE_URL + '\\' + imageMap[i]
                });
                card.addObserver(self);
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
            self.container.append(cards[i].container);
        }
    };

    var getPreviousFlippedCard = function () {
        return flippedCards[flippedCards.length - 2];
    };

    var isNewHandStarted = function () {
        return flippedCards.length % CONST.CARD_COPIES === 1;
    };

    var isHandFinished = function () {
        return flippedCards.length % CONST.CARD_COPIES === 0;
    };

    var isAllCardsFlipped = function () {
        return flippedCards.length === cards.length;
    };

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

    this.onSelectedCardHandler = function (data) {
        var card = data.card;
        flippedCards.push(card);
        if (isNewHandStarted()) {
            return;
        }
        if (getPreviousFlippedCard().getImage() === card.getImage()) {
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

    var discovered = false;

    var imageNode = $(CONST.HTML.IMAGE_NODE);

    this.container = $(CONST.HTML.CARD_NODE).addClass(CONST.CSS.ROOT);

    var self = this;

    var init = function () {
        self.container.attr(CONST.DATA.CARD_ID, config.id);
        attachEvents();
    };

    var attachEvents = function () {
        self.container.click(function () {
            if (config.flipped === false) {
                flip(self.container);
                if (discovered === false) {
                    self.notifyObservers(CONST.EVENT.SELECTED_CARD, {
                        card: self
                    });
                }
            }
        });
    };

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


memoryCardGame.Stats = function (params) {

    'use strict';

    var CONST = {
        CSS: {
            ROOT: 'current-stats-container',
            BEST_SCORE: 'best-score',
            BEST_SCORE_TEXT: 'best-score-text',
            BEST_SCORE_NUMBER: 'best-score-number',
            ATTEMPTS: 'attempts',
            ATTEMPTS_TEXT: 'attempts-text',
            ATTEMPTS_NUMBER: 'attempts-number'
        },
        SELECTOR: {
            ATTEMPTS_NUMBER: '.attempts-number'
        },
        TEXT: {
            ATTEMPTS: 'Attempts: ',
            BEST_SCORE: 'Best score: '
        }
    };

    var config = {
        bestScoreCounter: null,
        attempts: 0

    };

    // Merge incoming params with internal config
    $.extend(config, params);

    /**
     * @type {jQuery}
     */
    var attemptsNumber = $('<span></span>').addClass(CONST.CSS.ATTEMPTS_NUMBER);

    /**
     * @type {jQuery}
     */
    var bestScoreNumber = $('<span></span>').addClass(CONST.CSS.BEST_SCORE_NUMBER);

    /**
     * @type {jQuery}
     */
    this.container = $('<div></div>').addClass(CONST.CSS.ROOT);

    var self = this;

    var init = function () {
        draw();
    };

    var draw = function () {

        var currentMoves = $('<div></div>').addClass(CONST.CSS.ATTEMPTS);
        var attemptsText = $('<span></span>').addClass(CONST.CSS.ATTEMPTS_TEXT).text(CONST.TEXT.ATTEMPTS);
       attemptsNumber.text(config.attempts);

        currentMoves.append(attemptsText);
        currentMoves.append(attemptsNumber);

        self.container.append(currentMoves);

        if (config.bestScoreCounter !== null) {
            var bestScore = $('<div></div>').addClass(CONST.CSS.BEST_SCORE);
            var bestScoreText = $('<span></span>').addClass(CONST.CSS.BEST_SCORE_TEXT).text(CONST.TEXT.BEST_SCORE);
            bestScoreNumber.text(config.bestScoreCounter);

            bestScore.append(bestScoreText);
            bestScore.append(bestScoreNumber);
            self.container.append(bestScore);
        }
    };

    this.updateAttemptsCounter = function () {
        config.attempts++;
        attemptsNumber.text(config.attempts);
    };

    this.saveStats = function () {
        if ((config.bestScoreCounter === null || config.attempts < config.bestScoreCounter)) {
            memoryCardGame.utils.addDataInLocalStorage({bestScoreCounter: config.attempts});
        }
    };

    init.call(this);
};


memoryCardGame.GameManager = function (params) {

    'use strict';

    var CONST = {
        CSS: {
            ROOT: 'memory-card-game',
            BOARD_CLASS: 'memory-board',
            TIMER_CLASS: 'timer'
        },
        SELECTOR: {
            CONTAINER: 'body',
            TIMER_SELECTOR: '.timer'
        },
        TIMER: 1000
    };

    var config = {
        gameContainer: CONST.SELECTOR.CONTAINER
    };

    // Merge incoming params with internal config
    $.extend(config, params);

    var deck;

    var stats;

    var timer = 0;

    var timerInterval;

    var persistentData = {
        bestScoreCounter: null
    };

    this.container = $('<div></div>').addClass(CONST.CSS.ROOT);

    var self = this;

    var init = function () {
        var memoryLocalStorage = memoryCardGame.utils.retrieveFromLocalStorage();
        if (memoryLocalStorage !== null) {
            persistentData = memoryLocalStorage;
        }

        stats = new memoryCardGame.Stats({
            bestScoreCounter: persistentData.bestScoreCounter
        });
        self.container.append(stats.container);

        deck = new memoryCardGame.Deck({
            cardsClass: config.cardsClass,
            singleCardClass: config.singleCardClass
        });
        deck.addObserver(self);
        self.container.append(deck.container);

        startTimer();

        $(config.gameContainer).append(self.container);
    };

    var endGame = function () {
        stats.saveStats();
        clearInterval(timerInterval);
    };

    var startTimer = function () {
        self.container.append($('<div></div>').addClass(CONST.CSS.TIMER_CLASS).text(timer));
        timerInterval = setInterval(function () {
            $(CONST.SELECTOR.TIMER_SELECTOR).text(++timer);
        }, CONST.TIMER);
    };

    this.onHandFinishedHandler = function () {
        stats.updateAttemptsCounter();
    };

    this.onHandInvalidHandler = function () {
        stats.updateAttemptsCounter();
    };

    this.onCardsAllFlippedHandler = function () {
        endGame();
    };

    init.call(this);
};
memoryCardGame.UserOptions = function (params) {

    'use strict';

    var CONST = {
        CSS: {
            USER_OPTIONS_WRAPPER: 'user-options-wrapper',
            OPTION_PANEL_CLASS: 'user-options-panel'
        },
        TEXT: {
            PICTURE_NUMBER: 'Number of pictures:',
            USER_OPTION_PANEL: 'User option panel',
            CLOSE: 'Close'
        }
    };

    var config = {
        cardCopies: null
    };

    // Merge incoming params with internal config
    $.extend(config, params);

    var self = this;

    self.container = $('<div></div>').addClass(CONST.CSS.USER_OPTIONS_WRAPPER);

    var init = function () {
        draw();
    };

    var draw = function () {
        //TODO: Create utils library for dom elements
        var userOptionsPanel = $('<div></div>').addClass(CONST.CSS.OPTION_PANEL_CLASS);
        drawHeader(userOptionsPanel);
        drawOptionsForm(userOptionsPanel);
        drawFooter(userOptionsPanel);
        self.container.append(userOptionsPanel);
        //TODO: Create a global class for memoryGame and append panel to it
        $('body').append(self.container);
    };

    var drawHeader = function (rootNode) {
        var userOptionsTitle = $('<h2></h2>').text(CONST.TEXT.USER_OPTION_PANEL);
        rootNode.append(userOptionsTitle);
    };

    var drawOptionsForm = function (rootNode) {
        var howManyPicturesLabel = $('<label></label>').text(CONST.TEXT.PICTURE_NUMBER);
        var howManyPictures = $('<input type="text">');
        howManyPicturesLabel.append(howManyPictures);
        rootNode.append(howManyPicturesLabel);
    };

    var drawFooter = function (rootNode) {
        var closeButton = $('<button></button>').text(CONST.TEXT.CLOSE);
        closeButton.click(function () {
            self.container.hide();
            new memoryCardGame.GameManager();
        });
        rootNode.append(closeButton);
    };

    init.call(this);

};

