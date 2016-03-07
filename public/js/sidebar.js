/*var numSidePanels = 2;
var sideCans = [];
var sideOffsets = [];
var sideCtxs = [];
var sideGrids = [];
for (var i = 0; i < numSidePanels; i++) {
    sideCans.push(document.getElementById("sideBarItem" + i));
    sideCans[i].height = 300;
    sideCans[i].width = 250;

    sideOffsets.push( $( "#sideBarItem"  + i ).offset());

    sideCtxs.push(sideCans[i].getContext("2d"));

    sideGrids.push( new Grid(sideCans[i], sideCtxs[i], sideOffsets[i])); 
}

var freq = 60;

var handleMouse = []
for (var i = 0; i < sideCans.length; i++) {
    sideCans[i].onmousemove = function (e) {
        sideGrids[i].mouseMove(e.pageX, e.pageY);
    }

    sideCans[i].addEventListener('click', function() {
        sideGrids[i].mouseClick();
    }, false);
}


setInterval(sideLoop, freq);

function sideLoop () {
    sideRender();
}

function sideRender () {
    for (var i = 0; i < sideGrids.length; i++) {
        sideGrids[i].setOffset($( "#sideBarItem"  + i ).offset());
        sideGrids[i].draw(sideCtxs[i]);
    }
}*/

/* Handles the creation of the buttons to spawn towers
    and creeps */

function createTowerButton (name, tid) {
    var b = $('<input type="button" value="' 
        + name + '" class="sideButton"'
        + 'tid="' + tid + '"/>');
    b.appendTo($("#towerButtons"));
    b.click(function() {
        this.tid = $(this).attr("tid")
        var lastClick = myGrid.getLastClick();
        alert("Tower Please: " + this.tid + "  " + lastClick.col + "  " + lastClick.row);
        ws.towerRequest(this.tid, lastClick, "Tower please");
    });
    return b;
}

function createCreepButton (name, cid) {
    var b = $('<input type="button" value="' 
        + name + '" class="sideButton"'
        + 'cid="' + cid + '"/>');
    b.appendTo($("#creepButtons"));
    b.click(function() {
        this.cid = $(this).attr("cid");
        alert("Creep Please: " + this.cid);
        ws.creepRequest(this.cid, "Creep please");
    });
    return b;
}

$(document).ready(function() {
    var towerNames = ["Archer Tower", "Laser Tower", "Ice Tower"];
    var creepNames = ["Fast", "Slow"];

    var towerButtons = [towerNames.length];
    var creepButtons = [creepNames.length];

    for (var i = 0; i < towerNames.length; i++) {
        towerButtons[i] = (createTowerButton(towerNames[i], i));
    }

    for (var i = 0; i < creepNames.length; i++) {
        creepButtons[i] = (createCreepButton(creepNames[i], 1000 + i));
    }

    myGrid.setOffset($( "#gameFrame" ).offset());
});