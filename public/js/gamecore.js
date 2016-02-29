// Settings
var contentWidth = 2000;
var contentHeight = 2000;
var cellWidth = 100;
var cellHeight = 100;

var content = document.getElementById('content');
var context = content.getContext('2d');
var tiling = new Tiling;

// *Temperary for demonstration* get image. This is a bad way to do this
var tile = new Image();
var imageLoaded = false;
tile.src = "img/game/tile.png"
tile.onload = function() { imageLoaded = true; };

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
        var highlightSize = 5;
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

    this.highlight = function () {
        if (this == this.Grid.focusCell) {
            // Highlight square on hover
            context.lineWidth = highlightSize;
            context.strokeStyle = "#FF0"; // yellow
            context.strokeRect(left, up, width, height);
        }
    }
}

var Grid = function (contentWidth, contentHeight, cellWidth, cellHeight) {
    // Grid size
    this.rows = Math.ceil(contentWidth / cellWidth);

    this.cols = Math.ceil(contentHeight / cellHeight);

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
            this.Cells[i][j] = new Cell(this, i, j);
        }
    }

    // Mouse move handler
    this.mouseMove = function(x, y) {
        var coords = tiling.getCell(x, y);
        this.focusCell = this.Cells[coords.row][coords.col];
    }

    this.mouseClick = function(x, y) {
        var coords = tiling.getCell(x, y);
        console.log(coords);
    }
}

var myGrid = new Grid(contentWidth, contentHeight, cellWidth, cellHeight);

// Canvas renderer (called from ui.js)
var render = function(left, up, zoom) {
    // Sync current dimensions with canvas (set in Tiling.js
    content.width = clientWidth;
    content.height = clientHeight;

    // Full clearing for updated painting
    context.clearRect(0, 0, clientWidth, clientHeight);

    // Use tiling
    tiling.setup(clientWidth, clientHeight, contentWidth, contentHeight, cellWidth, cellHeight);
    tiling.render(left, up, zoom, myGrid);
};
