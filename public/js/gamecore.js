/* Create a global for the grid */

var myGrid = null;

var playerGrids = [], allCreeps =[], allShots = [];
var playerState = null, creeps = null, attacksMade = null;


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
        var currentTab = tabManager.getCurrentTab();
        if (currentTab != -1) {
            myGrid = playerGrids[currentTab];
        }
        var gameOffset = $("#gameFrame").offset();
        myGrid.setOffset(gameOffset);
        myGrid.draw(gameCtx);
        creeps = allCreeps[currentTab];
        if (creeps) {
            for (var i = 0; i < creeps.length; i++) {
                drawCreep(gameCtx, creeps[i]);
            }
        }
        var shots = allShots[currentTab];
        if (shots) {
            // Shots come in as array with creepid, towerid, type (+ extra per type)
            for (var j = 0; j < shots.length; j++) {
                drawShot(gameCtx, shots[j]);
            }
        }
        /* attacksMade = allShots[currentTab];
        // this is also temp for demo
        if (attacksMade) {
            console.log(attacksMade);
            // attacks come in as a dictionary like-> towerID: [creepIDs, ...]
            // which is why this is a bit funky
            for (var attack in attacksMade) {
                if (attacksMade[attack].length > 0) {
                    // a lot funky
                    for (var shot in attacksMade[attack]) {
                        // getting each towerID, creepID pair
                        // this is why we must send stuff as array of objects...
                        drawShot(gameCtx, attack, attacksMade[attack][shot]);
                    }
                }
            }
        }*/
    }
});
