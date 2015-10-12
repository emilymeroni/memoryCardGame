/* global $, memoryCardGame */

memoryCardGame.Card = function(params){

	'use strict';

	var CONST = {
		DATA: {
			CARD_ID: 'data-card-id'
		},
		CSS: {
			SINGLE_CARD_CLASS: 'memory-card'
		}
	};

	var config = {
		id: null,
		image: null,
		gameManager: null
	};

	// Merge incoming params with internal config
	$.extend(config, params);

	var self = this;

	var flipped = false;

	var init = function() {
	};

	this.getHtmlNode = function() {
		var cardNode = $('<li></li>');

		cardNode.addClass(CONST.CSS.SINGLE_CARD_CLASS);
		cardNode.attr(CONST.DATA.CARD_ID, config.id);

		cardNode.click(function(){
			flip();
			var image = getImage();
			cardNode.append(image);

		});

		return cardNode;
	};

	var flip = function() {
		flipped = !flipped;
	};

	var getImage = function() {
		if(flipped){
			var imageNode = $('<img>');
			imageNode.attr('src', config.image);
			return imageNode;
		}

	};

	init.call(this);
};

