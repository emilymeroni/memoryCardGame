/* global $, memoryCardGame */

memoryCardGame.Card = function(params){

	'use strict';

	var config = {
		id: null,
		image: null
	};

	// Merge incoming params with internal config
	$.extend(config, params);

	var init = function() {
	};

	init.call(this);
};

