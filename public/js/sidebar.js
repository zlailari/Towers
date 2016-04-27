/* Handles the creation of the buttons to spawn towers
*   and creeps
*   http://keycode.info/ -- go here to figure out keycodes
*   http://jsfiddle.net/technotarek/L2rLE/ -- go here for boostrap stuff
*/

var towerImages = [], towerImageNames = [], creepImages = [],
    creepImageNames = [];
var towerButtons = null, creepButtons = null;

var deleteImage = null;

var TowerButtons = function (divID) {
    this.lastButton = null;
    this.divID = divID;
    this.divs = [];
    this.images = [];
    this.hotKeyCodes = [];

    this.removeTower = function(ID) {
        this.images[ID].remove();
    };

    this.changeTower = function (index, ID, name, imageName, toolTip, hotKeyKC) {
        if (this.images[index]) {
            this.removeTower(index);
        }
        this.images[index] = $(
            '<img src="' + imageName + '"'
            + 'class="tower-tooltip"'
            + 'alt="' + name + '"'
            + 'style="width:40px;height:40px;"'
            + 'data-toggle="tooltip"'
            + 'data-title="' + toolTip +'"'
            + 'data-placement="auto"'
            + 'data-html="true"'
            + '/>')
            .appendTo($("#tower" + ID))
            .tooltip()
            .click({tid: ID, this: this}, function(event) {
                var self = event.data.this;
                var tid = event.data.tid;
                if (self.getLastButton() == tid) {
                    self.clearLastButton();
                } else {
                    self.setLastButton(tid);
                }
            });
        this.hotKeyCodes[index] = hotKeyKC;
    };

    this.addTower = function (ID, name, imageName, toolTip, hotKeyKC) {
        var index = this.divs.length;
        this.divs[index] = $('<div class="side-tower"'
            + 'id="tower' + ID + '"'
            + '/>')
            .appendTo(this.divID);
        this.changeTower(index, ID, name, imageName, toolTip, hotKeyKC);
    };

    this.getLastButton = function() { return this.lastButton; };
    this.clearLastButton = function() { this.lastButton = null; };
    this.setLastButton = function(val) { this.lastButton = val; };
    this.getDivs = function() { return this.divs; };
    this.wasPressed = function() { return this.lastButton != null; };
    this.getImages = function() { return this.images; };
    this.getHotKeyCodes = function() { return this.hotKeyCodes; };

    this.keypress = function (e) {
        for (var i = 0; i < this.hotKeyCodes.length; ++i) {
            if (e.which == this.hotKeyCodes[i].kc) {
                this.images[i].click();
            }
        }
    };
};


var CreepButtons = function (divID, creepNames, creepImageNames,
    creepToolTips, creepHotKeys) {
    this.divID = divID;
    this.divs = [];
    this.images = [];
    this.hotKeyCodes = [];

    this.removeCreep = function(ID) {
        this.image[ID].remove();
    };

    this.changeCreep = function(ID, name, imageName, toolTip, hotKeyKC) {
        if (this.images[ID]) {
            this.removeCreep(ID);
        }

        this.images[ID] = $(
            '<img src="' + imageName + '"'
            + 'class="creep-tooltip"'
            + 'alt="' + name + '"'
            + 'style="width:40px;height:40px;"'
            + 'data-toggle="tooltip"'
            + 'data-title="' + toolTip +'"'
            + 'data-placement="auto"'
            + 'data-html="true"'
            + '/>')
            .appendTo($("#creep" + ID))
            .tooltip()
            .click({cid: ID}, function(event) {
                var cid = "Default";
                var msg = {
                    "creepID": cid
                };
                ws.creepRequest(userID, msg);
            });
        this.hotKeyCodes[ID] = hotKeyKC;
    };

    this.addCreep = function(name, imageName, toolTip, hotKeyKC) {
        var ID = this.divs.length;

        this.divs[ID] = $('<div class="side-creep"'
            + 'id="creep' + ID + '"'
            + '/>')
            .appendTo(this.divID);

        this.changeCreep(ID, name, imageName, toolTip, hotKeyKC);
    };

    this.getImages = function() { return this.images; };
    this.getHotKeyCodes = function() { return this.hotKeyCodes; };

    this.keypress = function (e) {
        for (var i = 0; i < this.hotKeyCodes.length; i++) {
            if (e.which == this.hotKeyCodes[i]) {
                this.images[i].click();
            }
        }
    };

    for (var i = 0; i < creepNames.length; i++) {
        this.addCreep(creepNames[i], creepImageNames[i],
            creepToolTips[i], creepHotKeys[i].kc);
    }
};

function towerDenied (reason) {
    $('#denied').attr('data-original-title',
        "Tower denied:\n"
        + reason)
        .tooltip('fixTitle');

    $('#denied').tooltip('show');
    setTimeout(function() {
        $('#denied').tooltip('hide');
    }, 3000);
}

function initSideBar() {
    $('<div class="sideBarTitle"'
        + 'id="denied"'
        + 'data-toggle="tooltip"'
        + 'data-title="Tower could not be created"'
        + 'data-trigger="manual"'
        + 'data-placement="auto"'
        + 'data-html="true"'
        + '/>')
        .tooltip()
        .html('<p align="center"><strong>Towers</strong></p>')
        .prependTo($('#towerButtons'));

    var towerNames = ["Arrow Tower", "Rocket Tower", "Ice Tower"];
    var towerTypes = ["laser_tower", "fire_tower", "ice_tower"];

    var towerDescriptions = ["This tower shoots arrows",
        "This tower shoots rockets",
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

    towerButtons = new TowerButtons($("#towerImages"));

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

    towerButtons = new TowerButtons($("#towerImages"),
        towerNames, towerImageNames, towerToolTips, towerHotKeys);
    creepButtons = new CreepButtons($("#creepImages"),
        creepNames, creepImageNames, creepToolTips, creepHotKeys);

    $(document).keydown(function(e) {
        towerButtons.keypress(e);
        creepButtons.keypress(e);
    });

    for (var j = 0; j < towerNames.length; j++) {
        towerButtons.addTower(towerTypes[j],
            towerNames[j], towerImageNames[j],
            towerToolTips[j], towerHotKeys[j]);
    }
}
