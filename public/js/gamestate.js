/* This files manages the game state bar that lives
* above the gamegrid */

var stateManager = null;

var StateManager = function (lives, gold, enemies) {
    this.gold = gold;
    this.lives = lives;
    this.enemies = enemies;

    $('<div class="counter" id="livesText">Lives:</div>')
        .appendTo($(".stateWrapper"));
    $('<div class="counter" id="lives"></div>')
        .appendTo($(".stateWrapper"))
        .text(this.lives);

    $('<div class="counter" id="goldText">Gold:</div>')
        .appendTo($(".stateWrapper"));
     $('<div class="counter" id="gold"></div>')
        .appendTo($(".stateWrapper"))
        .text(this.gold);


    $('<div class="counter" id="enemiesText">Enemies Remaining:</div>')
        .appendTo($(".stateWrapper"));
    $('<div class="counter" id="enemies"></div>')
        .appendTo($(".stateWrapper"))
        .text(this.enemies);

    this.setLives = function(lives) { this.lives = lives; };
    this.setGold = function(gold) { this.gold = gold; };
    this.setEnemies = function(enemies) { this.enemies = enemies; };

    this.draw = function() {
        $("#lives").text(this.lives);
        $("#gold").text(this.gold);
        $("#enemies").text(this.enemies);
    };

    this.update = function(newInfo) {
        this.lives = newInfo['lives'];
        this.enemies = newInfo['enemiesLeft'];
        this.gold = newInfo['gold'];
    };
};


$(document).ready(function() {
    stateManager = new StateManager(10, 30, 0);
    if (myGrid)
        myGrid.setOffset($("#gameFrame").offset());
});
