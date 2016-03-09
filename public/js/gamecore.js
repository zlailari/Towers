/* Create a global for the grid */

var myGrid = null;

var playerState = null, creeps = null, attacksMade = null;

$(document).ready(function()  {
    var gameCan = document.getElementById("gameFrame");
    var gameCtx = gameCan.getContext("2d");

    var frequency = 60;

    gameCan.height = 600;
    gameCan.width = 800;

    var gameOffset = $("#gameFrame").offset();

    myGrid = new Grid(gameCan, gameCtx, gameOffset);

    gameCan.onmousemove = function (e) {
        myGrid.mouseMove(e.pageX, e.pageY);
    };

    gameCan.addEventListener('click', handleMouseClick, false);

    function handleMouseClick() {
        myGrid.mouseClick();
    }

    loadImages();
    setInterval(gameLoop, frequency);

    function gameLoop () {
        processUpdate();
        render();
    }

    function processUpdate() {
        if (playerState) {
            stateManager.update(playerState);
        }
    }

    function render () {
        stateManager.draw();
        myGrid.draw(gameCtx);

        if (creeps) {
            // DONT REPLICATE THIS, just trying to get something to work for MVP
            for (var i = 0; i < creeps.length; i++) {
                drawCreep(gameCtx, creeps[i]);
            }
        }
    }
});
