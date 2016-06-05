describe('UserOptions', function() {

    'use strict';
    var CONST,
        userOptions;

    beforeEach(function () {

        CONST = {
            CSS: {
                ROOT: 'user-options-wrapper'
            }
        };

        userOptions = new memoryCardGame.UserOptions();
    });

    it('is the class that needs to be instantiated when I want to allow the user to select his options for a new game', function(){
        expect(memoryCardGame.UserOptions).toBeDefined();
    });

    describe('it\'s container property:', function () {

        it('is a jQuery object holding the HTML node that contains all the configurable options by the user', function () {
            expect(userOptions.container).toExist();
        });

        it('is associated to the "user-options-wrapper" CSS class', function () {
            expect(userOptions.container).toHaveClass(CONST.CSS.ROOT);
        });
    });
});