/* Create a global for the grid */

var myGrid = null;

var playerGrids = [], allCreeps =[], shots = [];

var playerState = null, creeps = null, attacksMade = null;
var allEffects = [];

var gameCan, gameCtx;

var gameCan, gameCtx;

$(document).ready(function()  {
    lobbyManager = new LobbyManager();
    stateManager = new StateManager();
    tabManager = new TabManager();
    $(document).keydown(function(e) {
        tabManager.keypress(e);
    });
    lobbyManager.init();
    gameCan = document.getElementById("gameFrame");
    gameCtx = gameCan.getContext("2d");

    var frequency = 60;

    gameCan.height = 600;
    gameCan.width = 800;

    var gameOffset = $("#gameFrame").offset();
    myGrid = new Grid(gameCan, gameCtx, gameOffset);

    allCreeps = [];
    allAttacks = [];

    gameCan.onmousemove = function (e) {
        myGrid.mouseMove(e.pageX, e.pageY);
    };

    gameCan.addEventListener('click', handleMouseClick, false);

    function handleMouseClick() {
        myGrid.mouseClick();
    }

    loadImages();
    setInterval(gameLoop, frequency);

    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function(callback) {
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    (function animloop(){
      requestAnimFrame(animloop);
      render();
    })();

    function gameLoop () {
        processUpdate();
    }

    function processUpdate() {
        if (playerState) {
            stateManager.update(playerState);
        }
    }

    function render () {
        var currentTab = tabManager.getCurrentTab();
        if (currentTab != -1) {
            myGrid = playerGrids[currentTab];
        }
        var gameOffset = $("#gameFrame").offset();
        var effects = allEffects[currentTab];
        myGrid.setOffset(gameOffset);
        myGrid.draw(gameCtx, effects);

        creeps = allCreeps[currentTab];
        if (creeps) {
            for (var i = 0; i < creeps.length; i++) {
                drawCreep(gameCtx, creeps[i]);
            }
        }

        if (shots) {
            // Shots come in as array with creepid, towerid, type (+ extra per type)
            for (var j = shots.length - 1; j >= 0; j--) {
                drawShot(gameCtx, shots[j]);
                shots.splice(j, 1);
            }
        }
    }
});
