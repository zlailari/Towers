drawShot = function(ctx, towerID, creepID) {
    ctx.beginPath();

    for (var i = 0; i < myGrid.towers.length; i++) {
        if (myGrid.towers[i].id == towerID) {
            // Start line at center of square
            ctx.moveTo(
                gridToPixel(myGrid.towers[i].loc[0] + 0.5),
                gridToPixel(myGrid.towers[i].loc[1] + 0.5)
            );
        }
    }

    for (var j = 0; j < creeps.length; j++) {
        if (creeps[j].id == creepID) {
            ctx.lineTo(
                gridToPixel(creeps[j].loc[0] + creeps[j].cellPos[0]),
                gridToPixel(creeps[j].loc[1] + creeps[j].cellPos[1])
            );
        }
    }
    ctx.stroke();
};
