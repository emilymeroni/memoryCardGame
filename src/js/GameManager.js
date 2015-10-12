/* global $, memoryCardGame */

memoryCardGame.GameManager = function(params){

	'use strict';

	var CONST = {
		GAME_ID: 'memoryCardGame',
		CSS: {
			BOARD_CLASS: 'memory-board',
			CARDS_CLASS: 'memory-cards',
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
		gameId: CONST.GAME_ID,
		cardsClass: CONST.CSS.CARDS_CLASS,
		singleCardClass: CONST.CSS.SINGLE_CARD_CLASS
	};

	// Merge incoming params with internal config
	$.extend(config, params);

	var cards = [];
	var imageMap = [];
	var imagePosition = 0;
	var cardCounter = 0;
	var self = this;

	var init = function() {
		imageMap = imageMap.concat(CONST.DEFAULT_IMAGES);
		cards = getShuffledCards();
		draw();
	};

	var getShuffledCards = function(){
		for(var i = 0; i < CONST.DEFAULT_IMAGES.length; i++) {
			cards = cards.concat(createSameCards());
		}
		return shuffleCards(cards);
	};

	var createSameCards = function(){
		var sameCards = [];
		for(var i = 0; i < CONST.CARD_COPIES; i++){
			var card = new memoryCardGame.Card({
				id: imagePosition + cardCounter,
				image: getImage(),
				gameManager: self
			});
			cardCounter++;
			sameCards.push(card);
		}

		changeImagePosition();
		return sameCards;
	};

	var changeImagePosition = function(){
		imagePosition++;
	};

	var getImage = function(){
		return CONST.IMAGE_BASE_URL + "\\" + imageMap[imagePosition];
	};

	var draw = function(){
		var memoryCardGame = $("#" + config.gameId);

		var cardList = $('<ul></ul>').addClass(config.cardsClass);

		for (var i = 0; i < cards.length; i++) {
			var cardHtmlNode = cards[i].getHtmlNode();
			cardList.append(cardHtmlNode);
		}
		memoryCardGame.append(cardList);
	};

	var shuffleCards = function(cards){
		cards = cards.sort(function() {
			return 0.5 - Math.random();
		});
		return cards;
	};

	this.onCardSelected = function(card) {
	}

	init.call(this);
};