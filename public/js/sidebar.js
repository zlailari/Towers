/* Handles the creation of the buttons to spawn towers
*   and creeps
*   http://keycode.info/ -- go here to figure out keycodes
*/

var towerImages = [], towerImageNames = [];

var TowerButtons = function (divID, towerNames, towerHotKeys,
    towerToolTips) {
    this.lastButton = -1;
    this.divs = [towerNames.length];
    this.images = [towerNames.length];
    this.toolTips = [towerNames.length];
    for (var i = 0; i < towerNames.length; i++) {
        this.divs[i] = $('<div class="sideTower"'
            + 'id="tower' + i + '"'
            + 'tid="' + i + '"/>')
            .appendTo($(divID));

        this.images[i] = $('<img src="' + towerImageNames[i] + '"'
            + 'alt="' + towerNames[i] + '"'
            + 'style="width:40px;height:40px;"'
            + 'onclick="towerClick(' + parseFloat(i) + ')"'
            + 'data-toggle="tooltip"'
            + 'title="' + towerToolTips[i] +'"'
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


var CreepButtons = function (divID, creepNames, creepHotKeys) {
    var buttons = [creepNames.length];
    for (var i = 0; i < creepNames.length; i++) {
        buttons[i] = $('<input type="button" value="'
            + creepNames[i]+ ' (' + creepHotKeys[i].s
            + ')" class="sideButton"'
            + 'cid="' + i + '"/>')
            .appendTo($(divID))
            .click(function() {
                var cid = $(this).attr("cid");
                // alert("Creep Please: " + this.cid);
                var msg = {
                    "creepID": this.cid
                };
                ws.creepRequest(userID, msg);
            });
    }

    $(document).keydown(function(e) {
        for (var i = 0; i < creepHotKeys.length; i++) {
            if (e.which == creepHotKeys[i].kc) {
                buttons[i].click();
            }
        }
    });

    this.getButtons = function() { return buttons; };
};

function towerDenied () {
    $('<div id="dialog" title="Basic dialog">'
        + '<p>Tower cannot be created</p></div>')
        .appendTo(document.body);
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
    var towerHotKeys = [{s:"A", kc:65},
        {s:"R", kc:82},
        {s:"I", kc:73}];
    var  towerToolTips = [];
    for (var i = 0; i < towerNames.length; ++ i) {
        towerToolTips[i] = towerNames[i] + " Shortcut: "
            + towerHotKeys[i].s;
    }

    var creepNames = ["Fast", "Slow"];
    var creepHotKeys = [{s:"F", kc:70},
        {s:"S ", kc:83}];

    towerButtons = new TowerButtons("#towerButtons",
        towerNames, towerHotKeys, towerToolTips);
    creepButtons = new CreepButtons("#creepButtons",
        creepNames, creepHotKeys);
    if (myGrid) {
        myGrid.setOffset($("#gameFrame").offset());
    }
}
