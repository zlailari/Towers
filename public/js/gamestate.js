/* This files manages the game state bar that lives
* above the gamegrid */

var stateManager = null;

var StateManager = function (lives, gold, en) {
    this.gold = gold;
    this.lives = lives;
    this.en = en;

    $('<div class="counter" id="livesText"> Lives: </div>')
        .appendTo($(".stateWrapper"));
    $('<div class="counter" id="lives"></div>')
        .appendTo($(".stateWrapper"))
        .text(this.lives);

    $('<div class="counter" id="goldText"> Gold: </div>')
        .appendTo($(".stateWrapper"));
     $('<div class="counter" id="gold"></div>')
        .appendTo($(".stateWrapper"))
        .text(this.gold);


    $('<div class="counter" id="enText"> Enemies Remaining: </div>')
        .appendTo($(".stateWrapper"));
    $('<div class="counter" id="en"></div>')
        .appendTo($(".stateWrapper"))
        .text(this.en);

    this.setLives = function(lives) { this.lives = lives; };
    this.setGold = function(gold) { this.gold = gold; };
    this.setEn = function(en) { this.en = en; };

    this.draw = function() {
        $("#lives").text(this.lives);
        $("#gold").text(this.gold);
        $("#en").text(this.end);
    };
};


$(document).ready(function() {
    stateManager = new StateManager(10, 30, 0);
    if(myGrid)
        myGrid.setOffset($("#gameFrame").offset());
});