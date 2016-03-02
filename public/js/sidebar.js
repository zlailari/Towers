var sideCans = new Array(2);
var sideOffsets = new Array(2);
var sideCtxs = new Array(2);
var sideGrids = new Array(2);
for (var i = 0; i < sideCtxs.length; i++) {
    sideCans[i] = document.getElementById("sideBarItem" + i);
    sideCans[i].height = 300;
    sideCans[i].width = 250;

    sideOffsets[i] = $( ".sideBarItem"  + i ).offset();

    sideCtxs[i] = sideCans[i].getContext("2d");

    sideGrids[i] = new Grid(sideCans[i], sideCtxs[i], sideOffsets[i]);   
}

var freq = 60;


for (var i = 0; i < sideCans.length; i++) {
    sideCans[i]
    sideCans[i].onmousemove = function (e) {
        myGrids[i].mouseMove(e.pageX, e.pageY);
    }

    sideCans[i].addEventListener('click', handleMouseClick, false);

    function handleMouseClick() {
        myGrids[i].mouseClick();
    }
}


setInterval(sideLoop, freq);

function sideLoop () {
    sideRender();
}

function sideRender () {
    for (var i = 0; i < sideGrids.length; i++) {
        sideGrids[i].draw(sideCtxs[i]);
    }
}
