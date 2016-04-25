/* This files manages the game state bar that lives
* above the gamegrid */

var stateManager = null, tabManager = null;

var StateManager = function () {
    this.gold = 0;
    this.lives = 0;
    this.enemies = 0;

    $('<div class="counter" id="livesText"/>')
        .appendTo($("#gameInfo"))
        .text("Lives:");
    $('<div class="counter" id="lives"/>')
        .appendTo($("#gameInfo"))
        .text(this.lives);

    $('<div class="counter" id="goldText"/>')
        .appendTo($("#gameInfo"))
        .text("Gold: ");
     $('<div class="counter" id="gold"/>')
        .appendTo($("#gameInfo"))
        .text(this.gold);

    $('<div class="counter" id="enemiesText"/>')
        .appendTo($("#gameInfo"))
        .text("Enemies Remaining");
    $('<div class="counter" id="enemies"/>')
        .appendTo($("#gameInfo"))
        .text(this.enemies);

    this.update = function(newInfo) {
        this.lives = newInfo['lives'];
        this.enemies = newInfo['enemiesLeft'];
        this.gold = newInfo['gold'];

        $("#lives").text(this.lives);
        $("#gold").text(this.gold);
        $("#enemies").text(this.enemies);
    };
};

var TabManager = function() {
    this.tabs = [];
    this.hotKeyCodes = [];
    this.currentTab = -1;
    var keyCodeStart = 49;
    var nextIndex = 1;

    function tabClick (event) {
        var self = event.data.this;
        var id = event.data.id;
        self.currentTab = id;
        myGrid = playerGrids[id];
         console.log("Tab " + id + " clicked");
    }

    this.keypress = function(e) {
        for (var id in this.hotKeyCodes) {
            if (e.which == this.hotKeyCodes[id]) {
                this.tabs[id].click();
            }
        }
    };

    this.getCurrentTab = function() { return this.currentTab; };

    this.destroyTabs = function() {
        this.currentTab = 0;
        for (var id in this.tabs) {
            this.tabs[id].remove();
            delete this.tabs[id];
            delete this.hotKeyCodes[id];
        }
    };
    this.addTab = function(id) {
        if (this.tabs.hasOwnProperty(id)) {
            return;
        }

        var index = nextIndex;
        var tooltip = null, text = null;
        if (id == userID) {
            index = 0;
            tooltip = "Click to see your game\n"
                + "Hotkey: 1";
            text = "My Game";
        } else {
            text = "Player " + nextIndex;
            tooltip = "Click to see player " + nextIndex + "'s game\n"
            + "Hotkey: " + parseFloat(nextIndex + 1);
            ++nextIndex;
        }
        this.tabs[id] = $('<div class="tabNotClicked"'
            + 'data-toggle="tooltip"'
            + 'title="' + tooltip + '"'
            + 'data-placement="auto"'
            + '/>')
            .text(text)
            .tooltip()
            .click({id: id, this: this}, function(event) {
                var self = event.data.this;
                var id = event.data.id;
                var lastID = self.currentTab;
                self.currentTab = id;
                if (lastID != id) {
                    self.tabs[lastID].removeClass("tabClicked");
                    self.tabs[lastID].addClass("tabNotClicked");

                    self.tabs[id].removeClass("tabNotClicked");
                    self.tabs[id].addClass("tabClicked");
                }
            });
        if (id == userID) {
            this.tabs[id].prependTo($('#tabs'));
            this.tabs[id].removeClass("tabNotClicked");
            this.tabs[id].addClass("tabClicked");
            this.currentTab = id;
        } else {
            this.tabs[id].appendTo($('#tabs'));
        }
        this.hotKeyCodes[id] = keyCodeStart + nextIndex;
    };
};

$(document).ready(function () {
    stateManager = new StateManager();
    tabManager = new TabManager();
    $(document).keydown(function(e) {
        tabManager.keypress(e);
    });
});
