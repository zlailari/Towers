
$(document).ready(function() {

    var gameCan = document.getElementById("gameFrame");
    var gameCtx = gameCan.getContext("2d");

    var frequency = 60;

    gameCan.height = 600;
    gameCan.width = 800;

        this.offset = offset;
                && row >= 0 && col >= 0) {
        this.setOffset = function(newOffset) {
            this.offset = newOffset;
        }


    var gameGrid = new Grid(gameCan, gameCtx, gameOffset);

    gameCan.onmousemove = function (e) {
        gameGrid.mouseMove(e.pageX, e.pageY);
    }

    gameCan.addEventListener('click', function() {
        gameGrid.mouseClick();
    }, false);

    setInterval(gameLoop, frequency);

    function gameLoop () {
        render();
    }

    function render () {
        gameGrid.setOffset($( ".canvas" ).offset());
        gameGrid.draw(gameCtx);
    }
});