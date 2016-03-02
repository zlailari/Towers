var gameOffset = $( ".canvas" ).offset();

var Grid = function (can, ctx, offset) {
    // Size of each cell with currect zoom
    this.distance = 50;

    // Grid draw properties
    this.gridColor = "#000000";

    // Grid size
    this.rows = 12;
    this.cols = 16;

    // Cell which user is currently hovering over
    this.focusCell = {};

    // Initialize Cells array
    this.Cells = new Array(this.rows);
    for (var i = 0; i < this.rows; i++) {
        this.Cells[i] = new Array(this.cols);
    }

    // Fill Cells array with Cell Objects
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
            this.Cells[i][j] = new Cell(this, ctx, i, j);
        }
    }

    // Mouse move handler
    this.mouseMove = function(x, y) {
        var row = Math.floor((y - offset.top) / this.distance);
        var col = Math.floor((x - offset.left) / this.distance);

        // Check if user if hovered over a cell
        if (row < this.rows && col < this.cols) {

            // If the focus has changed to a new cell
            if (this.Cells[row][col] != this.focusCell) {
                this.focusCell.hover = false;
            }

            this.focusCell = this.Cells[row][col];
            this.Cells[row][col].hover = true;
        }
    }

    this.mouseClick = function() {
        this.focusCell.type = (this.focusCell.type + 1) % 4
    }

    this.draw = function(ctx) {
        if (!ctx) {
            console.log("ERROR: Canvas context not defined");
            return;
        }

        for (var i = 0; i < this.Cells.length; i++) {
            for (var j = 0; j < this.Cells[0].length; j++) {
                this.Cells[i][j].draw(ctx);
            }
        }
    }
}
