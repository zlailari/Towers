var CellType = Object.freeze({
    EMPTY: 0,
    BLOCKED: 1,
    BASIC_TOWER: 2,
    TRAP: 3,
    ARROW: 100,
    LASER: 101,
    ICE: 102
});

var Cell = function (Grid, ctx, row, col) {
    this.row = row;
    this.col = col;

    this.hover = false;

    this.type = CellType.EMPTY;

    // What Grid this cell belongs to, so we can access its properties
    this.Grid = Grid;

    this.draw = function(ctx) {
        var size = this.Grid.distance;
        var highlightSize = Math.floor(size / 10);
        var drawSize = size - highlightSize;

        // Cell draw based on type
        switch (this.type) {
            case CellType.EMPTY:
                ctx.fillStyle = "#000000";
                break;
            case CellType.BLOCKED:
                ctx.fillStyle = "#FF0000";
                break;
            case CellType.BASIC_TOWER:
                ctx.fillStyle = "#00FF00";
                break;
            case CellType.TRAP:
                ctx.fillStyle = "#0000FF";
                break;
            case CellType.ARROW:
                ctx.fillStyle = towerColors[0];
                break;
            case CellType.LASER:
                ctx.fillStyle = towerColors[1];
                break;
            case CellType.ICE:
                ctx.fillStyle = towerColors[2];
                break;
            default:
                console.log("ERROR: Illegal CellType: " + this.type);
        }
        // Fill rectangle with color chosen above
        ctx.fillRect((this.col * size) + .5 * highlightSize,
                     (this.row * size) + .5 * highlightSize,
                     drawSize, drawSize);

        // Highlight square on hover
        if (this.hover) {
            ctx.lineWidth = highlightSize;
            if(towerButtons.getLastButton()) {
                ctx.fillStyle = towerColors[towerButtons.getLastButton()];
            } else {
                ctx.fillStyle = "rgba(255, 255, 0, 0.3)"; 
            }
            ctx.fillRect((this.col * size) + .5 * highlightSize,
                (this.row * size) + .5 * highlightSize, size, size);
        } else {
            // Temporary hack to remove highlight from past focusCells
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = highlightSize;
            ctx.strokeRect((this.col * size), (this.row * size), size, size);
        }

    }
}
