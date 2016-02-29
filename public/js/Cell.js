var CellType = Object.freeze({
    EMPTY: 0,
    BLOCKED: 1,
    BASIC_TOWER: 2,
    TRAP: 3
});

var Cell = function (Grid, row, col) {
    this.row = row;
    this.col = col;

    this.type = CellType.EMPTY;

    // What Grid this cell belongs to, so we can access its properties
    this.Grid = Grid;

    // Cell Paint Logic, called from tiling -> render (passed as callback)
    this.paint = function(row, col, left, up, width, height, zoom) {
        // Cell color based on type
        switch (this.type) {
            case CellType.EMPTY:
                context.fillStyle = "#000000";
                break;
            case CellType.BLOCKED:
                context.fillStyle = "#FF0000";
                break;
            case CellType.BASIC_TOWER:
                context.fillStyle = "#00FF00";
                break;
            case CellType.TRAP:
                context.fillStyle = "#0000FF";
                break;
            default:
                console.log("ERROR: Illegal CellType");
        }

        if (this.type == CellType.EMPTY && imageLoaded) {
            context.drawImage(tile, left, up, width, height);
        } else {
            context.fillRect(left, up, width, height);
        }

        context.fillStyle = "black";
        context.font = (14 * zoom).toFixed(2) + 'px "Helvetica Neue", Helvetica, Arial, sans-serif';

        // Pretty primitive text positioning :)
        context.fillText(row + "," + col, left + (6 * zoom), up + (18 * zoom));
    }
}
