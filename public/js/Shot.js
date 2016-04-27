race = "Human";
drawShot = function(ctx, shot) {
    var xpos, ypos;
    if (shot.type == "laser") {
        ctx.beginPath();

        for (var i = 0; i < myGrid.towers.length; i++) {
            if (myGrid.towers[i].id == shot.towerid) {
                // Start line at center of square
                ctx.moveTo(
                    gridToPixel(myGrid.towers[i].loc[0] + 0.5),
                    gridToPixel(myGrid.towers[i].loc[1] + 0.5)
                );
            }
        }

        for (var j = 0; j < creeps.length; j++) {
            if (creeps[j].id == shot.creepid) {
                ctx.lineTo(
                    gridToPixel(creeps[j].loc[0] + creeps[j].cellPos[0]),
                    gridToPixel(creeps[j].loc[1] + creeps[j].cellPos[1])
                );
            }
        }
        ctx.stroke();
    } else if (shot.type == "fire") {
        xpos = gridToPixel(shot.loc[0]);
        ypos = gridToPixel(shot.loc[1]);

        ctx.drawImage(shotImages[race][0], xpos, ypos, 10, 20);
    } else if (shot.type == "sniper") {
        xpos = gridToPixel(shot.loc[0]);
        ypos = gridToPixel(shot.loc[1]);

        ctx.drawImage(shotImages[race][1], xpos, ypos, 10, 20);
    } else if (shot.type == "gattling") {
        xpos = gridToPixel(shot.loc[0]);
        ypos = gridToPixel(shot.loc[1]);

        ctx.drawImage(shotImages[race][2], xpos, ypos, 10, 20);
    } else if (shot.type == "poison") {
        xpos = gridToPixel(shot.loc[0]);
        ypos = gridToPixel(shot.loc[1]);

        ctx.drawImage(shotImages[race][3], xpos, ypos, 10, 20);
    } else {
        console.log("WOWO what it this shot???");
        console.log(shot);
    }
};
