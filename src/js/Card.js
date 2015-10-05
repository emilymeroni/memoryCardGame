memoryCardGame.Card = function(){

	this.id = "";
	this.image = "";

	var init = function() {
	};

	this.setId = function(id){
		this.id = id;
	};

	this.setImage = function(image){
		this.image = image;
	};

	init.call(this);
};

