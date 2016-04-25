var CellType = Object.freeze({
    EMPTY: 0,
    BLOCKED: 1,
    BASIC_TOWER: 2,
    TRAP: 3,
    ARROW: 100,
    FIRE: 101,
    ICE: 102
});

var Cell = function (Grid, ctx, row, col) {
    this.row = row;
    this.col = col;

    this.hover = false;

    this.type = CellType.EMPTY;

    // What Grid this cell belongs to, so we can access its properties
    this.Grid = Grid;

    this.img = null;

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
                break;
            case CellType.ARROW:
            case CellType.FIRE:
            case CellType.ICE:
                ctx.fillStyle = "#FFFFFF";
                doDraw = true;
                this.img = towerImages[parseFloat(this.type)
                    - parseFloat(CellType.ARROW)];
                break;
            default:
                console.log("ERROR: Illegal CellType: " + this.type);
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
                ctx.lineWidth = highlightSize;
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                ctx.fillRect((this.col * size) + .5 * highlightSize,
                    (this.row * size) + .5 * highlightSize, size, size);
                var img = towerImages[towerButtons.getLastButton()];
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
