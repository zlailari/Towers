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

var useridToArrayPos = null;
mapUseridToArrayPos = function(idsInLobby) {
  useridToArray = [];
  var next = 1;
  for (var id in idsInLobby) {
    if (id == userID) {
      useridToArrayPos[id] = 0;
    } else {
      useridToArrayPos[id] = next++;
    }
  }
  tabManager.destroyTabs();
  tabManager.addTabs(next - 2);
};