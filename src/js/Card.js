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
		image: null,
		gameManager: null
	};

	// Merge incoming params with internal config
	$.extend(config, params);

	var flipped = false;

	var imageNode = $(CONST.HTML.IMAGE_NODE);

	var self = this;

	var init = function() {
	};

	this.getHtmlNode = function() {
		var cardNode = $(CONST.HTML.CARD_NODE);

		cardNode.addClass(CONST.CSS.SINGLE_CARD_CLASS).attr(CONST.DATA.CARD_ID, config.id);

		cardNode.click(function(){
			flip(cardNode);
			if(flipped) {
				var cardId = $(this).data('card-id');
				config.gameManager.onCardSelected(cardId);
			}
		});

		return cardNode;
	};

	var flip = function(card) {
		flipped = !flipped;

		if(flipped){
			card.append(getImageNode());
		}
		else {
			card.find(imageNode).remove();
		}
	};

	var getImageNode = function() {
		imageNode.attr('src', config.image);
		return imageNode;
	};

	init.call(this);
};

