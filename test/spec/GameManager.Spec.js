'use strict';

describe('GameManager', function() {

    it('is the class that I need to instantiate to play a new memory game', function() {
        var gameManager = new memoryCardGame.GameManager();
        expect(gameManager).toBeDefined();
    });

});