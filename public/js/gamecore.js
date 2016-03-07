/* Create a global for the grid */
var myGrid = null;

$(document).ready(function()  {
    var gameCan = document.getElementById("gameFrame");
    var gameCtx = gameCan.getContext("2d");

    var frequency = 60;

    gameCan.height = 600;
    gameCan.width = 800;

    var gameOffset = $( "#gameFrame" ).offset();

    myGrid = new Grid(gameCan, gameCtx, gameOffset);

    gameCan.onmousemove = function (e) {
        myGrid.mouseMove(e.pageX, e.pageY);
    }

    gameCan.addEventListener('click', handleMouseClick, false);

    function handleMouseClick() {
        myGrid.mouseClick();
    }

    setInterval(gameLoop, frequency);

    function gameLoop () {
        render();
    }

    function render () {
        myGrid.draw(gameCtx);
    }
});

