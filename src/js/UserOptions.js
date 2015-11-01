/* global $, memoryCardGame */

memoryCardGame.UserOptions = function(params){

	'use strict';

	var CONST = {
		CSS: {
			USER_OPTIONS_WRAPPER: 'user-options-wrapper',
			OPTION_PANEL_CLASS: 'user-options-panel'
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
		var userOptionsTitle = $('<h2></h2>').text('User option panel');
		var closeButton = $('<button></button>').text('Close');
		closeButton.click(function(){
			self.container.hide();
		});

		userOptionsPanel.append(userOptionsTitle);
		userOptionsPanel.append(closeButton);
		self.container.append(userOptionsPanel);
		//TODO: Create a global class for memoryGame and append pannel to it
		$('body').append(self.container);
	};

	init.call(this);

};

