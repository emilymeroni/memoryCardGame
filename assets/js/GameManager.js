memoryCardGame.GameManager = function(){

	'use strict';

	var CONST = {
		CARD_COPIES: 2,
		DEFAULT_IMAGES: [
			'Hydrangeas.jpg', 
			'Jellyfish.jpg', 
			'Koala.jpg', 
			'Penguins.jpg', 
			'Tulips.jpg'
		],	
		IMAGE_BASE_URL: '..\\memorycardgame_images'
	};

	var cards = [];
	var imageMap = [];
	var imagePosition = 0;
	var cardCounter = 0;

	var init = function() {
		imageMap = imageMap.concat(CONST.DEFAULT_IMAGES);
		cards = getShuffledCards();
		console.log(cards);
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
			var card = new memoryCardGame.Card();
			card.setImage(getImage());
			card.setId(imagePosition + cardCounter);
			cardCounter++;
			sameCards.push(card);
		}

		changeImagePosition();
		return sameCards;
	};

	var changeImagePosition = function(){
		imagePosition++;
	};

	var shuffleCards = function(cards){
		cards = cards.sort(function() {
			return 0.5 - Math.random();
		});
		return cards;
	};

	var getImage = function(){
		return CONST.IMAGE_BASE_URL + "\\" + imageMap[imagePosition];
	};

	init.call(this);
};

new memoryCardGame.GameManager();