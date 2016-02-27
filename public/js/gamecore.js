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
        console.log(this.focusCell);
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

var Cell = function (Grid, row, col) {
    this.row = row;
    this.col = col;

    this.hover = false;

    // What Grid this cell belongs to, so we can access its properties
    this.Grid = Grid;

    this.draw = function(ctx) {
        var size = this.Grid.distance;

        // Highlight square on hover
        if (this.hover) {
            ctx.lineWidth = Math.floor(size/10);
            ctx.strokeStyle = "rgba(255, 255, 0, 0.5";
            ctx.strokeRect((this.col * size), (this.row * size), size, size);
        } else {
            // Temperary hack to remove highlight from past focusCells
            ctx.fillStle = "#000000"
            ctx.fillRect((this.col * size), (this.row * size), size, size);
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 1;
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
