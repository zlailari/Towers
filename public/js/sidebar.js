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

    this.changeTower = function (ID, name, imageName, toolTip, hotKeyKC) {
        if (this.images[ID]) {
            this.removeTower(ID);
        }
        this.images[ID] = $(
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
        this.hotKeyCodes[ID] = hotKeyKC;
    };

    this.addTower = function (ID, name, imageName, toolTip, hotKeyKC) {
        var div = this.divID;
        if (ID == 'delete_tower' || ID == 'upgrade_tower') {
            div = $('#updateImages');
        }

        this.divs[ID] = $('<div class="side-tower"'
            + 'id="tower' + ID + '"'
            + '/>')
            .appendTo(div);
        this.changeTower(ID, name, imageName, toolTip, hotKeyKC);
    };

    this.getLastButton = function() { return this.lastButton; };
    this.clearLastButton = function() { this.lastButton = null; };
    this.setLastButton = function(val) { this.lastButton = val; };
    this.getDivs = function() { return this.divs; };
    this.wasPressed = function() { return this.lastButton != null; };
    this.getImages = function() { return this.images; };
    this.getHotKeyCodes = function() { return this.hotKeyCodes; };

    this.keypress = function (e) {
        for (var ID in this.hotKeyCodes) {
            if (e.which == this.hotKeyCodes[ID].kc) {
                this.images[ID].click();
            }
        }
    };
};


var CreepButtons = function (divID) {
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
                var cid = event.data.cid;
                var msg = {
                    "creepID": cid
                };
                ws.creepRequest(userID, msg);
            });
        this.hotKeyCodes[ID] = hotKeyKC;
    };

    this.addCreep = function(ID, name, imageName, toolTip, hotKeyKC) {
        this.divs[ID] = $('<div class="side-creep"'
            + 'id="creep' + ID + '"'
            + '/>')
            .appendTo(this.divID);

        this.changeCreep(ID, name, imageName, toolTip, hotKeyKC);
    };

    this.getImages = function() { return this.images; };
    this.getHotKeyCodes = function() { return this.hotKeyCodes; };

    this.keypress = function (e) {
        for (var ID in this.hotKeyCodes) {
            if (e.which == this.hotKeyCodes[ID].kc) {
                this.images[ID].click();
            }
        }
    };
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

    var towerNames = [
        "Rocket Tower",
        "Laser Tower",
        "Railgun",
        "Wall Tower",
        "Delete Tower",
        "Upgrade Tower"
    ];
    var towerTypes = [
        "fire_tower",
        "laser_tower",
        "gattling_tower",
        "wall_tower",
        "delete_tower",
        "upgrade_tower"];
    var towerDescriptions = [
        "This tower shoots rockets",
        "This tower shoots lasers",
        "This tower shoots ???",
        "Does not fire anything but blocks creeps",
        "Delete a Tower", "Upgrade a tower"];
    var towerPrices = ["10", "10", "10", "10", "-50%", "10"];
    var towerHotKeys = [{s:"A", kc:65},
        {s:"R", kc:82},
        {s:"I", kc:73},
        {s:"W", kc:87},
        {s:"L", kc:76},
        {s:"U", kc:85}];

    var towerToolTips = [];
    for (var i = 0; i < towerNames.length; ++i) {
        towerToolTips[i] =
        "<strong>" + towerNames[i] + "</strong>\n"
        + towerDescriptions[i] + "\n"
        + "Cost: " + towerPrices[i] + "\n"
        + "Hotkey: " + towerHotKeys[i].s;
    }

    towerButtons = new TowerButtons($("#towerImages"));

    var creepTypes = ["Slow", "Default", "Fast"];
    var creepNames = ["Slow", "Normal", "Fast"];
    var creepDescriptions = ["Slow creep with a lot of health",
        "Normal creep with a well rounded set of states",
        "Fast creep with a little bit of health"];
    var creepPrices = ["100", "15", "30"];
    var creepHotKeys = [{s:"S ", kc:83},
        {s:"D", kc:68},
        {s:"F", kc:70}];

    var creepToolTips = [];
    for (var k = 0; k < creepNames.length; k++) {
        creepToolTips[k] =
        "<strong>" + creepNames[k] + "</strong>\n"
        + creepDescriptions[k] + "\n"
        + "Cost: " + creepPrices[k] + "\n"
        + "Hotkey: " + creepHotKeys[k].s;
    }

    towerButtons = new TowerButtons($("#towerImages"));
    creepButtons = new CreepButtons($("#creepImages"));

    $(document).keydown(function(e) {
        towerButtons.keypress(e);
        creepButtons.keypress(e);
    });

    for (var j = 0; j < towerNames.length; j++) {
        var name = null;
        if (towerImageNames[j].constructor == Array) {
            name = towerImageNames[j][0];
        } else {
            name = towerImageNames[j];
        }
        towerButtons.addTower(towerTypes[j],
            towerNames[j], name,
            towerToolTips[j], towerHotKeys[j]);
    }

    for (var l = 0; l < creepNames.length; l++) {
        creepButtons.addCreep(creepTypes[l],
            creepNames[l], creepImageNames[l],
            creepToolTips[l], creepHotKeys[l]);
    }
}
