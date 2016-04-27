var CellType = Object.freeze({
    EMPTY: 0,
    BLOCKED: 1,
    BASIC_TOWER: 2,
    TRAP: 3,
    ARROW: 100,
    FIRE: 101,
    ICE: 102,
    WALL: 103
});

var CellEffect = Object.freeze({
    NONE: 0,
    FIRE: 1,
    STUN: 2
});

var Cell = function (Grid, ctx, row, col) {
    this.row = row;
    this.col = col;

    this.hover = false;

    this.type = CellType.EMPTY;
    this.effect = CellEffect.NONE;

    // What Grid this cell belongs to, so we can access its properties
    this.Grid = Grid;

    this.img = null;
    this.towerLevel = 0;

    this.draw = function(ctx) {
        var size = this.Grid.distance;
        var highlightSize = Math.floor(size / 10);
        var drawSize = size - highlightSize;

        var doDraw = false;
        // Cell draw based on type
        switch (this.type) {
            case CellType.BLOCKED:
                ctx.fillStyle = "#FF0000";
                doDraw = true;
                break;
            case CellType.EMPTY:
            case CellType.BASIC_TOWER:
            case CellType.TRAP:
                ctx.fillStyle = "#000000";
                doDraw = false;
                break;
            case CellType.ARROW:
            case CellType.FIRE:
            case CellType.ICE:
            case CellType.WALL:
                ctx.fillStyle = "#FFFFFF";
                doDraw = true;
                this.img = towerImages[parseFloat(this.type)
                    - parseFloat(CellType.ARROW)][this.towerLevel];
                break;
            default:
                console.log("ERROR: Illegal CellType: " + this.type);
        }

        switch (this.effect) {
            case CellEffect.NONE:
                break;
            case CellEffect.FIRE:
                ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
                doDraw = true;
                break;
            case CellEffect.STUN:
                ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
                doDraw = true;
                break;
            default:
                console.log("ERORR: Illegal CellEffect: " + this.effect);
        }

        if (doDraw) {
            // Fill rectangle with color chosen above
            ctx.fillRect((this.col * size) + .5 * highlightSize,
                         (this.row * size) + .5 * highlightSize,
                         drawSize, drawSize);

            if (this.img) {
                ctx.drawImage(this.img,
                    (this.col * size) + .5 * highlightSize,
                    (this.row * size) + .5 * highlightSize, drawSize, drawSize);
            }
        }
        // Highlight square on hover
        if (this.hover) {
            if (towerButtons && towerButtons.wasPressed()) {
                var type = towerButtons.getLastButton();
                var index = towerTypeToNumber[type];

                ctx.lineWidth = highlightSize;
                ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                ctx.fillRect((this.col * size) + .5 * highlightSize,
                    (this.row * size) + .5 * highlightSize, size, size);
                var img = towerImages[index][0];
                ctx.drawImage(img, (this.col * size) + .5 * highlightSize,
                    (this.row * size) + .5 * highlightSize, drawSize, drawSize);
            } else {
                ctx.lineWidth = highlightSize;
                ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
                ctx.fillRect((this.col * size) + .5 * highlightSize,
                    (this.row * size) + .5 * highlightSize, size, size);
            }
        } else {
            // Temporary hack to remove highlight from past focusCells
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = highlightSize;
            ctx.strokeRect((this.col * size), (this.row * size), size, size);
        }
    };
};
