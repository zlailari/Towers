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

var TabManager = function(numTabs) {
    this.tabs = [];
    this.hotKeyCodes = [];
    this.currentTab = 0;
    var keyCodeStart = 49;

    function tabClick (event) {
        var self = event.data.this;
        var id = event.data.id;
        self.currentTab = id;
        myGrid = playerGrids[id];
         console.log("Tab " + id + " clicked");
    }

    this.keypress = function(e) {
        for (var i = 0; i < this.hotKeyCodes.length; ++i) {
            if (e.which == this.hotKeyCodes[i]) {
                this.tabs[i].click();
            }
        }
    };

    this.getCurrentTab = function() { return this.currentTab; };

    this.destroyTabs = function() {
        this.currentTab = 0;
        for (var i = 1; i < this.tabs.length; ++i) {
            this.tabs[i].remove();
        }
        this.tabs.length = 1;
        this.hotKeyCodes.length = 1;
    };
    this.addTabs = function(numTabs) {
        var currentNumTabs = this.tabs.length;
        for (var i = currentNumTabs; i < numTabs + currentNumTabs; ++i) {
            var tooltip = "Click to see player " + i + "'s game\n"
                + "Hotkey: " + parseFloat(i + 1);
            this.tabs[i] = $('<div class="tabNotClicked"'
                + 'data-toggle="tooltip"'
                + 'title="' + tooltip + '"'
                + 'data-placement="auto"'
                + '/>')
                .appendTo($("#tabs"))
                .text("Player " + i)
                .tooltip()
                .click({id: i, this: this}, function(event) {
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
            this.hotKeyCodes[i] = keyCodeStart + i;
        }
    };

    var tooltip = "Click to see your game\n"
        + "Hotkey: 1";
    this.tabs[0] = $(
        '<div class="tabClicked"'
        + 'data-toggle="tooltip"'
        + 'title="' + tooltip + '"'
        + 'data-placement="auto"'
        + '/>')
        .appendTo($("#tabs"))
        .text("My Game")
        .tooltip()
        .click({id: 0, this: this}, function(event) {
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
    this.hotKeyCodes[0] = keyCodeStart + 0;
    this.addTabs(numTabs);
};


function initTabs () {
    stateManager = new StateManager();
    tabManager = new TabManager(1);
    $(document).keydown(function(e) {
        tabManager.keypress(e);
    });
}
