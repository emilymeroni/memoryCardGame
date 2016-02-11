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


/* global $, memoryCardGame */

memoryCardGame.Card = function(params){

	'use strict';

	var CONST = {
		CSS: {
			SINGLE_CARD_CLASS: 'memory-card'
		},
		DATA: {
			CARD_ID: 'data-card-id'
		},
		HTML: {
			CARD_NODE: '<li></li>',
			IMAGE_NODE: '<img>'
		}
	};

	var config = {
		id: null,
		flipped: false,
		image: null,
		gameManager: null
	};

	// Merge incoming params with internal config
	$.extend(config, params);

	var discovered = false;

	var imageNode = $(CONST.HTML.IMAGE_NODE);

	var self = this;

	 var flip = function(cardNode) {
		config.flipped = !config.flipped;

		if(config.flipped === true){
			cardNode.append(getImageNode());
		}
		else {
			cardNode.find(imageNode).remove();
		}
	};

	this.getCardNodeAndFlip = function() {
		var cardNode = $('.' + CONST.CSS.SINGLE_CARD_CLASS + '[' + CONST.DATA.CARD_ID + '=' + config.id + ']');
		flip(cardNode);
	};

	this.getImage = function() {
		return config.image;
	};

	var getImageNode = function() {
		imageNode.attr('src', config.image);
		return imageNode;
	};

	this.getNode = function() {
		var cardNode = $(CONST.HTML.CARD_NODE);
		cardNode.addClass(CONST.CSS.SINGLE_CARD_CLASS).attr(CONST.DATA.CARD_ID, config.id);
		cardNode.click(function(){
			if(config.flipped === false) {
				flip(cardNode);
				if(discovered === false) {
					config.gameManager.onCardSelected(self);
				}
			}
		});
		return cardNode;
	};

	this.setDiscovered = function() {
		discovered = true;
	};
};


/* global $, memoryCardGame */

memoryCardGame.Stats = function(params){

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
    this.container = $('<div></div>').addClass(CONST.CSS.ROOT);

    var self = this;

    var init = function () {
        draw();
    };

    var draw = function () {

        var currentMoves = $('<div></div>').addClass(CONST.CSS.ATTEMPTS);
        var attemptsText = $('<span></span>').addClass(CONST.CSS.ATTEMPTS_TEXT).text(CONST.TEXT.ATTEMPTS);
        var attemptsNumber = $('<span></span>').addClass(CONST.CSS.ATTEMPTS_NUMBER).text(config.attempts);

        currentMoves.append(attemptsText);
        currentMoves.append(attemptsNumber);

        self.container.append(currentMoves);

        if (config.bestScoreCounter !== null) {
            var bestScore = $('<div></div>').addClass(CONST.CSS.BEST_SCORE);
            var bestScoreText = $('<span></span>').addClass(CONST.CSS.BEST_SCORE_TEXT).text(CONST.TEXT.BEST_SCORE);
            var bestScoreNumber = $('<span></span>').addClass(CONST.CSS.BEST_SCORE_NUMBER).text(config.bestScoreCounter);

            bestScore.append(bestScoreText);
            bestScore.append(bestScoreNumber);
            self.container.append(bestScore);
        }
    };

    this.updateAttemptsCounter = function() {
        config.attempts++;
        $(CONST.SELECTOR.ATTEMPTS_NUMBER).text(config.attempts);
    };

    this.saveStats = function() {
        if ((config.bestScoreCounter === null || config.attempts < config.bestScoreCounter)) {
            memoryCardGame.utils.addDataInLocalStorage({bestScoreCounter: config.attempts});
        }
    };

    init.call(this);
};


/* global $, memoryCardGame */

memoryCardGame.GameManager = function (params) {

    'use strict';

    var CONST = {
        CSS: {
            ROOT: 'memory-card-game',
            BOARD_CLASS: 'memory-board'
        },
        CARD_COPIES: 2,
        TIME_FOR_FLIP: 500
    };

    var config = {
        cardsClass: CONST.CSS.CARDS_CLASS,
        gameClass: CONST.CSS.ROOT,
        singleCardClass: CONST.CSS.SINGLE_CARD_CLASS
    };

    // Merge incoming params with internal config
    $.extend(config, params);

    var discoveredSameCards = 0;

    var flippedOverCards = [];

    var deck;

    var stats;

    var timer = 0;

    var persistentData = {
        bestScoreCounter: null
    };

    this.container = $('<div></div>').addClass(config.gameClass);

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
            gameManager: self,
            cardsClass: config.cardsClass,
            singleCardClass: config.singleCardClass
        });

        self.container.append(deck.container);

        $('body').append(self.container);
        startTimer();
    };

    var setDiscoveredCards = function (flippedOverCards) {
        for (var i = 0; i < flippedOverCards.length; i++) {
            flippedOverCards[i].setDiscovered();
        }
        discoveredSameCards++;
    };

    var coverCards = function (flippedOverCards) {
        setTimeout(function () {
            for (var i = 0; i < flippedOverCards.length; i++) {
                flippedOverCards[i].getCardNodeAndFlip();
            }
        }, CONST.TIME_FOR_FLIP);
    };

    //TODO: Cleanup timer
    var endGame = function () {
        stats.saveStats();
    };

    //TODO: Change interval milliseconds to constant
    var startTimer = function () {
        setInterval(function () {
            timer++;
        }, 1000);
    };

    var getPreviousCardFromDeck = function () {
        return flippedOverCards[flippedOverCards.length - 2];
    };

    var isGameEnded = function () {
        return discoveredSameCards * CONST.CARD_COPIES === deck.getCardsNumber();
    };

    this.onCardSelected = function (card) {
        flippedOverCards.push(card);
        if (flippedOverCards.length <= 1) {
            return;
        }
        if (getPreviousCardFromDeck().getImage() === card.getImage()) {
            if (flippedOverCards.length === CONST.CARD_COPIES) {
                setDiscoveredCards(flippedOverCards);
                flippedOverCards = [];
                stats.updateAttemptsCounter();
                if (isGameEnded() === true) {
                    endGame();
                }
            }
        }
        else {
            coverCards(flippedOverCards);
            flippedOverCards = [];
            stats.updateAttemptsCounter();
        }
    };

    init.call(this);
};
/* global $, memoryCardGame */

memoryCardGame.UserOptions = function(params){

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

	var draw = function() {
		//TODO: Create utils library for dom elements
		var userOptionsPanel = $('<div></div>').addClass(CONST.CSS.OPTION_PANEL_CLASS);
		drawHeader(userOptionsPanel);
		drawOptionsForm(userOptionsPanel);
		drawFooter(userOptionsPanel);
		self.container.append(userOptionsPanel);
		//TODO: Create a global class for memoryGame and append panel to it
		$('body').append(self.container);
	};

	var drawHeader = function(rootNode) {
		var userOptionsTitle = $('<h2></h2>').text(CONST.TEXT.USER_OPTION_PANEL);
		rootNode.append(userOptionsTitle);
	};

	var drawOptionsForm = function(rootNode) {
		var howManyPicturesLabel = $('<label></label>').text(CONST.TEXT.PICTURE_NUMBER);
		var howManyPictures = $('<input type="text">');
		howManyPicturesLabel.append(howManyPictures);
		rootNode.append(howManyPicturesLabel);
	};

	var drawFooter = function(rootNode) {
		var closeButton = $('<button></button>').text(CONST.TEXT.CLOSE);
		closeButton.click(function(){
			self.container.hide();
			new memoryCardGame.GameManager();
		});
		rootNode.append(closeButton);
	};

	init.call(this);

};

