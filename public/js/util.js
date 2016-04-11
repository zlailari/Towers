safeParseJSON = function(s) {
    try {
        return JSON.parse(s);
    } catch (e){
        return false;
    }
};

gridToPixel = function(gridPos) {
    return myGrid.distance * gridPos;
};

var towerButtons = null, creepButtons = null;

var towerClick = function(tid) {
    if (towerButtons.getLastButton() == tid) {
        towerButtons.clearLastButton();
    } else {
        towerButtons.setLastButton(tid);
    }
};