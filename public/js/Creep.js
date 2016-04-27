var creepPic;

// This is placeholder for now. Creeps are only drawn at the moment, and the
// draw information is pulled straight from the server updates
var Creep = function(gridX, gridY, width, height, progress) {
    this.gridX = gridX;
    this.gridY = gridY;

    this.width = width;
    this.height = height;

    this.progress = progress;
};

// DONT REPLICATE THIS, just trying to get something to work for MVP
drawCreep = function(ctx, creep) {
    if (!creep.live) {
        return;
    }
    var type = creep.type;
    var index = creepTypeToNumber[type];
    creepPic = creepImages[index];
    var width = 32;
    var height = 50;

    var xpos = gridToPixel(creep.loc[0] + creep.cellPos[0]) - 0.5 * width;
    var ypos = gridToPixel(creep.loc[1] + creep.cellPos[1]) - 0.5 * height;

    ctx.drawImage(creepPic, xpos, ypos,
                      width, height);
};
