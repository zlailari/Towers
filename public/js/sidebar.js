/* Handles the creation of the buttons to spawn towers
*   and creeps
*   http://keycode.info/ -- go here to figure out keycodes
*   http://jsfiddle.net/technotarek/L2rLE/ -- go here for boostrap stuff
*/

var towerImages = [], towerImageNames = [], creepImages = [],
    creepImageNames = [];

var TowerButtons = function (divID, towerNames, towerHotKeys,
    towerToolTips) {
    this.lastButton = -1;
    this.divs = [towerNames.length];
    this.images = [towerNames.length];
    this.toolTips = [towerNames.length];
    for (var i = 0; i < towerNames.length; i++) {
        this.divs[i] = $('<div class="side-tower"'
            + 'id="tower' + i + '"'
            + 'tid="' + i + '"/>')
            .appendTo($(divID));

        this.images[i] = $(
            '<img src="' + towerImageNames[i] + '"'
            + 'class="tower-tooltip"'
            + 'alt="' + towerNames[i] + '"'
            + 'style="width:40px;height:40px;"'
            + 'onclick="towerClick(' + parseFloat(i) + ')"'
            + 'data-toggle="tooltip"'
            + 'title="' + towerToolTips[i] +'"'
            + 'data-placement="auto"'
            + 'data-html="true"'
            + '/>')
            .appendTo($("#tower" + i))
            .tooltip();
    }

    $(document).keydown(function(e) {
        for (var i = 0; i < towerHotKeys.length; i++) {
            if (e.which == towerHotKeys[i].kc) {
                this.images[i].click();
            }
        }
    });

    this.getLastButton = function() { return this.lastButton; };
    this.clearLastButton = function() { this.lastButton = -1; };
    this.setLastButton = function(val) { this.lastButton = val; };
    this.getDivs = function() { return this.divs; };
    this.wasPressed = function() { return this.lastButton >= 0; };
};


var CreepButtons = function (divID, creepNames, creepHotKeys,
    creepToolTips) {
    this.divs = [creepNames.length];
    this.images = [creepNames.length];
    for (var i = 0; i < creepNames.length; i++) {
        this.divs[i] = $('<div class="side-creep"'
            + 'id="creep' + i + '"'
            + 'tid="' + i + '"/>')
            .appendTo($(divID));

        this.images[i] = $(
            '<img src="' + creepImageNames[i] + '"'
            + 'class="creep-tooltip"'
            + 'alt="' + creepNames[i] + '"'
            + 'style="width:40px;height:40px;"'
            + 'onclick="creepClick(' + parseFloat(i) + ')"'
            + 'data-toggle="tooltip"'
            + 'title="' + creepToolTips[i] +'"'
            + 'data-placement="auto"'
            + 'data-html="true"'
            + '/>')
            .appendTo($("#creep" + i))
            .tooltip();

    }

    $(document).keydown(function(e) {
        for (var i = 0; i < creepHotKeys.length; i++) {
            if (e.which == creepHotKeys[i].kc) {
                this.images[i].click();
            }
        }
    });

    this.getButtons = function() { return this.buttons; };
};

function towerDenied () {
    $('<div id="dialog" title="Basic dialog">'
        + '<p>Tower cannot be created</p></div>')
        .appendTo($("#gameFrame"));
    $("#dialog").dialog({
        open: function() {
            var self = $(this);
            setTimeout(function() {
                self.dialog('close');
            }, 1000);
        }
    });
}

function initSideBar() {
    var towerNames = ["Arrow Tower", "Fire Tower", "Ice Tower"];
    var towerDescriptions = ["This tower shoots arrows",
        "This tower shoots fire",
        "This tower shoots ice"];
    var towerPrices = ["10", "10", "10"];
    var towerHotKeys = [{s:"A", kc:65},
        {s:"R", kc:82},
        {s:"I", kc:73}];

    var towerToolTips = [];
    for (var i = 0; i < towerNames.length; ++i) {
        towerToolTips[i] =
        "<strong>" + towerNames[i] + "</strong>\n"
        + towerDescriptions[i] + "\n"
        + "Cost: " + towerPrices[i] + "\n"
        + "Hotkey: " + towerHotKeys[i].s;
    }

    var creepNames = ["1", "2", "3"];
    var creepDescriptions = ["Placeholder",
        "Placeholder",
        "Placeholder"];
    var creepPrices = ["10", "10", "10"];
    var creepHotKeys = [{s:"F", kc:70},
        {s:"D", kc:68},
        {s:"S ", kc:83}];

    var creepToolTips = [];
    for (var k = 0; k < creepNames.length; k++) {
        creepToolTips[k] =
        "<strong>" + creepNames[k] + "</strong>\n"
        + creepDescriptions[k] + "\n"
        + "Cost: " + creepPrices[k] + "\n"
        + "Hotkey: " + creepHotKeys[k].s;
    }

    towerButtons = new TowerButtons("#towerButtons",
        towerNames, towerHotKeys, towerToolTips);
    creepButtons = new CreepButtons("#creepButtons",
        creepNames, creepHotKeys, creepToolTips);
    if (myGrid) {
        myGrid.setOffset($("#gameFrame").offset());
    }
}
