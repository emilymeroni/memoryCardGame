describe('UserOptions', function() {

    'use strict';

    it('Exists', function(){
        expect(memoryCardGame.UserOptions).toBeDefined();
    });

    it('Is instantiable', function() {
        var userOptions = new memoryCardGame.UserOptions();
        expect(userOptions).toBeTruthy();
    });
});