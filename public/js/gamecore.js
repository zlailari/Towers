// Settings
var contentWidth = 2000;
var contentHeight = 2000;
var cellWidth = 100;
var cellHeight = 100;

var content = document.getElementById('content');
var context = content.getContext('2d');
var tiling = new Tiling;
// Canvas renderer
var render = function(left, top, zoom) {
    // Sync current dimensions with canvas
    content.width = clientWidth;
    content.height = clientHeight;

    // Full clearing
    context.clearRect(0, 0, clientWidth, clientHeight);
    // Use tiling
    tiling.setup(clientWidth, clientHeight, contentWidth, contentHeight, cellWidth, cellHeight);
    tiling.render(left, top, zoom, paint);
};


// Cell Paint Logic
var paint = function(row, col, left, top, width, height, zoom) {

    context.fillStyle = row%2 + col%2 > 0 ? "#ddd" : "#fff";
    context.fillRect(left, top, width, height);

    context.fillStyle = "black";
    context.font = (14 * zoom).toFixed(2) + 'px "Helvetica Neue", Helvetica, Arial, sans-serif';

    // Pretty primitive text positioning :)
    context.fillText(row + "," + col, left + (6 * zoom), top + (18 * zoom));

};
















var can = document.getElementById("gameFrame");
var ctx = can.getContext("2d");

var frequency = 60;

can.height = 600;
can.width = 800;

var Grid = function () {
    // Size of each cell with currect zoom
    this.distance = 50;

    // Grid draw properties
    this.gridColor = "#000000";
    this.verticalLines = true;
    this.horizontalLines = true;

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
            this.Cells[i][j] = new Cell(this, i, j);
        }
    }

    // Mouse move handler
    this.mouseMove = function(x, y) {
        var row = Math.floor(y / this.distance);
        var col = Math.floor(x / this.distance);

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

var CellType = Object.freeze({
    EMPTY: 0,
    BLOCKED: 1,
    BASIC_TOWER: 2,
    TRAP: 3
});

var Cell = function (Grid, row, col) {
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
            default:
                console.log("ERROR: Illegal CellType");
        }
        // Fill rectangle with color chosen above
        ctx.fillRect((this.col * size) + .5 * highlightSize,
                     (this.row * size) + .5 * highlightSize,
                     drawSize, drawSize);

        // Highlight square on hover
        if (this.hover) {
            ctx.lineWidth = highlightSize;
            ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
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

var myGrid = new Grid();

can.onmousemove = function (e) {
    myGrid.mouseMove(e.pageX, e.pageY);
}

can.addEventListener('click', handleMouseClick, false);

function handleMouseClick() {
    myGrid.mouseClick();
}

setInterval(gameLoop, frequency);

function gameLoop () {
    render();
}

function render () {
    myGrid.draw(ctx);
}
