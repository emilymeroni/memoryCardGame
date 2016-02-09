describe('GameManager', function() {

    'use strict';

    var CONST;
    var gameManager;

    beforeEach(function() {

        CONST = {
            CSS: {
                ROOT: 'memory-card-game',
                CARDS_CLASS: 'memory-cards'
            },
            SELECTOR: {
                CARDS_CLASS: '.memory-cards'
            }
        };

        gameManager = new memoryCardGame.GameManager();

    });

    xit('is the class that I need to instantiate to play a new memory game', function() {
        expect(gameManager).toBeDefined();
    });

    xdescribe('it\'s container property:', function() {

        it('is a jQuery object holding the HTML node that contains all the elements for you to play', function() {
            expect(gameManager.container).toExist();
        });

        it('is associated to the "memory-board" CSS class', function() {
            expect(gameManager.container).toHaveClass(CONST.CSS.ROOT);
        });
    });

});