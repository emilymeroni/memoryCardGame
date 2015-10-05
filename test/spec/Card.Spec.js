'use strict';

describe('Card', function() {

    it('Exists', function(){
        expect(memoryCardGame.Card).toBeDefined();
    });

    it('Is instantiable', function() {
        var card = new memoryCardGame.Card();
        expect(card).toBeTruthy();
    });
});