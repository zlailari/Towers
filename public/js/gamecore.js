/* Create a global for the grid */

var myGrid = null;
var playerGrids = null, allCreeps, allAttacks = null;
var playerState = null, creeps = null, attacksMade = null;

$(document).ready(function()  {
    lobbyManager.enterLobby();
    initTabs();
    var gameCan = document.getElementById("gameFrame");
    var gameCtx = gameCan.getContext("2d");

    var frequency = 60;

    gameCan.height = 600;
    gameCan.width = 800;

    var gameOffset = $("#gameFrame").offset();
    playerGrids = [];
    playerGrids[0] = new Grid(gameCan, gameCtx, gameOffset);
    playerGrids[1] = new Grid(gameCan, gameCtx, gameOffset);
    myGrid = playerGrids[0];

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

    function gameLoop () {
        processUpdate();
        render();
    }

    function processUpdate() {
        if (playerState) {
            stateManager.update(playerState);
        }
    }

    var projectiles = [];

    function render () {
        var currentTab = tabManager.getCurrentTab();
        myGrid = playerGrids[currentTab];
        var gameOffset = $("#gameFrame").offset();
        myGrid.setOffset(gameOffset);
        myGrid.draw(gameCtx);
        creeps = allCreeps[currentTab];
        if (creeps) {
            // DONT REPLICATE THIS, just trying to get something to work for MVP
            for (var i = 0; i < creeps.length; i++) {
                drawCreep(gameCtx, creeps[i]);
            }
        }
        attacksMade = allAttacks[currentTab];
        // this is also temp for demo
        if (attacksMade) {
            // attacks come in as a dictionary like-> towerID: [creepIDs, ...]
            // which is why this is a bit funky
            for (var attack in attacksMade) {
                if (attacksMade[attack].length > 0) {
                    // a lot funky
                    for (var shot in attacksMade[attack]) {
                        // getting each towerID, creepID pair
                        // this is why we must send stuff as array of objects...
                        // drawShot(gameCtx, attack, attacksMade[attack][shot]);

                        projectiles.push(
                            new Projectile(
                            gameCtx, attack,
                            attacksMade[attack][shot], 15)
                            );
                    }
                }
            }
        }
        for (var k = projectiles.length - 1; k >= 0; k--) {
            if (projectiles[k].hit) {
                projectiles.splice(k, 1);
            } else {
                projectiles[k].draw();
            }
        }
    }
});
