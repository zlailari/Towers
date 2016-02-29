var Grid = function (contentWidth, contentHeight, cellWidth, cellHeight) {
    // Grid size
    this.rows = Math.ceil(contentWidth / cellWidth);

    this.cols = Math.ceil(contentHeight / cellHeight);

    // Cell which user is currently hovering over
    this.focusCell = {};
    this.currentX = -1;
    this.currentY = -1;

    // Initialize Cells array
    this.Cells = new Array(this.rows);
    for (var i = 0; i < this.rows; i++) {
        this.Cells[i] = new Array(this.cols);
    }

    // Fill Cells array with Cell Objects
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
            this.Cells[i][j] = new Cell(this, i, j);
        }
    }

    // Mouse move handler
    this.mouseMove = function(x, y) {
        this.currentX = x;
        this.currentY = y;

        var coords = tiling.getCell(x, y);

        this.focusCell = this.Cells[coords.row][coords.col];
    }

    this.mouseClick = function(x, y) {
        var coords = tiling.getCell(x, y);
        console.log(coords);
    }
}
