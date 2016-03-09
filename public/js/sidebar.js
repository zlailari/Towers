/* Handles the creation of the buttons to spawn towers
*   and creeps
*   http://keycode.info/ -- go here to figure out keycodes
*/

var towerButtons = null, creepButtons = null, towerImages = null;
var towerImages = [];

var TowerButtons = function (divID, towerNames, towerHotKeys) {
    var lastButton = null;
    var buttons = [towerNames.length];
    for (var i = 0; i < towerNames.length; i++) {
        buttons[i] = $('<input type="button" value="'
            + towerNames[i] + ' (' + towerHotKeys[i].s
            + ')" class="sideButton"'
            + 'tid="' + i + '"/>')
            .appendTo($(divID))
            .click(function() {
                var tid = $(this).attr("tid");
                // alert("Button: " + tid);
                if (lastButton == tid) {
                    lastButton = null;
                } else {
                    lastButton = tid;
                }
            });
    }

    $(document).keydown(function(e) {
        for (var i = 0; i < towerHotKeys.length; i++) {
            if (e.which == towerHotKeys[i].kc) {
                buttons[i].click();
            }
        }
    });

    this.getLastButton = function() { return lastButton; };
    this.clearLastButton = function() { lastButton = null; };
    this.getButtons = function() { return buttons; };
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
                this.cid = $(this).attr("cid");
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



$(document).ready(function() {
    var towerNames = ["Arrow Tower", "Fire Tower", "Ice Tower"];
    var towerHotKeys = [{s:"A", kc:65},
        {s:"R", kc:82},
        {s:"I", kc:73}];

    var creepNames = ["Fast", "Slow"];
    var creepHotKeys = [{s:"F", kc:70},
        {s:"S ", kc:83}];

    towerButtons = new TowerButtons("#towerButtons",
        towerNames, towerHotKeys);
    creepButtons = new CreepButtons("#creepButtons",
        creepNames, creepHotKeys);
    if (myGrid) {
        myGrid.setOffset($("#gameFrame").offset());
    }
});

