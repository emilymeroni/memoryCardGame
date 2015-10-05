'use strict';

describe('GameManager', function() {

    it('Exists', function(){
        expect(memoryCardGame.GameManager).toBeDefined();
    });

    it('Is instantiable', function() {
        var gameManager = new memoryCardGame.GameManager();
        expect(gameManager).toBeTruthy();
    });

});