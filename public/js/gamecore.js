/* Create a global for the grid */

var myGrid = null;

var playerState = null, creeps = null, shots = null;

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
            for (var i = 0; i < creeps.length; i++) {
                drawCreep(gameCtx, creeps[i]);
            }
        }

        if (shots) {
            // Shots come in as array with creepid, towerid, type (+ extra per type)
            for (var i = 0; i < shots.length; i++) {
                drawShot(gameCtx, shots[i]);
            }
        }
    }
});
