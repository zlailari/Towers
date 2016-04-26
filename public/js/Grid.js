var gameOffset = $(".canvas").offset();
var backgroundImg;

var Grid = function (can, ctx, offset) {
    // Size of each cell with currect zoom
    this.distance = 50;
    this.offset = offset;

    // Grid draw properties
    this.gridColor = "#000000";

    // Grid size
    this.rows = 12;
    this.cols = 16;

    // Cell which user is currently hovering over
    this.focusCell = {};

    // Initialize Cells array
    this.Cells = new Array(this.rows);
    for (var k = 0; k < this.rows; k++) {
        this.Cells[k] = new Array(this.cols);
    }

    // Fill Cells array with Cell Objects
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
            this.Cells[i][j] = new Cell(this, ctx, i, j);
        }
    }

    // Keep track of all towers on grid
    this.towers = [];

    // Mouse move handler
    this.mouseMove = function(x, y) {
        var row = Math.floor((y - this.offset.top) / this.distance);
        var col = Math.floor((x - this.offset.left) / this.distance);

        // Check if user if hovered over a cell
        if (row < this.rows && col < this.cols) {

            // If the focus has changed to a new cell
            if (this.Cells[row][col] != this.focusCell) {
                this.focusCell.hover = false;
            }

            this.focusCell = this.Cells[row][col];
            this.Cells[row][col].hover = true;
        }
    };

    this.mouseClick = function() {
        if (tabManager && tabManager.getCurrentTab() == userID) {
           if (towerButtons && towerButtons.wasPressed()) {
               var last = towerButtons.getLastButton();
               var msg = {
                   "towerID": last,
                   "x": this.focusCell.col,
                   "y": this.focusCell.row
               };
               ws.towerRequest(userID, msg);
           } else {
               this.focusCell.type = (this.focusCell.type + 1) % 2;
           }
        }
    };

    this.draw = function(ctx) {
        if (!ctx) {
            console.log("ERROR: Canvas context not defined");
            return;
        }

        ctx.drawImage(backgroundImg, 0, 0, ctx.canvas.clientWidth,
            ctx.canvas.clientHeight);

        for (var i = 0; i < this.Cells.length; i++) {
            for (var j = 0; j < this.Cells[0].length; j++) {
                this.Cells[i][j].draw(ctx);
            }
        }
    };

    this.setOffset = function(newOffset) {
        this.offset = newOffset;
    };

    this.towerAccepted = function(tower) {
        var x = tower['loc'][0];
        var y = tower['loc'][1];
        var type = tower['tower_type'];
        var index = typeToNumber[type];
        this.Cells[y][x].type = parseFloat(CellType.ARROW) +
                parseFloat(index);

        this.towers.push(tower);
    };
};
