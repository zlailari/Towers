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



function createButton (toAppend, name, sid) {
    var b = $('<input type="button" value="' 
        + name + '" class="sideButton"'
        + 'sid="' + sid + '"/>');
    b.appendTo(toAppend);
    b.click(function() {
            alert($(this).attr("sid"));
    });
    return b;
}

$(document).ready(function() {
    var towerNames = ["Archer Tower", "Laser Tower", "Ice Tower"];
    var creepNames = ["Fast", "Slow"];

    var towerButtons = [towerNames.length];
    var creepButtons = [creepNames.length];

    for (var i = 0; i < towerNames.length; i++) {
        towerButtons[i] = (createButton($("#towerButtons"), 
            towerNames[i], i));
    }

    for (var i = 0; i < creepNames.length; i++) {
        creepButtons[i] = (createButton($("#creepButtons"), 
            creepNames[i], i + towerNames.length));
    }
});