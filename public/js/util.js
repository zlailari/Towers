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
