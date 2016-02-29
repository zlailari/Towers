/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 */

/**
 * Helper class for doing tile distribution and paint callbacks on a predefined area when
 * location to render is being modified.
 */
Tiling = function() {

};


/**
 * This method is required to being called every time the tile, outer or inner dimensions are being modified.
 *
 * @param clientWidth {Number} Inner width of container
 * @param clientHeight {Number} Inner height of container
 * @param contentWidth {Number} Outer width of content
 * @param contentHeight {Number} Outer height of content
 * @param tileWidth {Number} Width of each tile to render
 * @param tileHeight {Number} Height of each tile to render
 */
Tiling.prototype.setup = function(clientWidth, clientHeight, contentWidth, contentHeight, tileWidth, tileHeight) {

    this.__clientWidth = clientWidth;
    this.__clientHeight = clientHeight;
    this.__contentWidth = contentWidth;
    this.__contentHeight = contentHeight;
    this.__tileWidth = tileWidth;
    this.__tileHeight = tileHeight;

};


/**
 * Renders the given location on the area defined by {@link #setup} by calling
 * `paint(row, column, left, up, width, height, zoom)` as needed.
 *
 * @param left {Number} Left position to render
 * @param up {Number} Top position to render
 * @param zoom {Number} Current zoom level (should be applied to `left` and `up` already)
 * @param paint {Function} Callback method for every tile to paint.
 */
Tiling.prototype.render = function(left, up, zoom, myGrid) {

    var clientHeight = this.__clientHeight;
    var clientWidth = this.__clientWidth;

    // Respect zooming
    var tileHeight = this.__tileHeight * zoom;
    var tileWidth = this.__tileWidth * zoom;

    // Compute starting rows/columns and support out of range scroll positions
    var startRow = Math.max(Math.floor(up / tileHeight), 0);
    var startCol = Math.max(Math.floor(left / tileWidth), 0);

    // Compute maximum rows/columns to render for content size
    var maxRows = (this.__contentHeight * zoom) / tileHeight;
    var maxCols = (this.__contentWidth * zoom) / tileWidth;

    // Compute initial render offsets
    // 1. Positive scroll position: We match the starting rows/tile first so we
    //    just need to take care that the half-visible tile is fully rendered
    //    and placed partly outside.
    // 2. Negative scroll position: We shift the whole render context
    //    (ignoring the tile dimensions) and effectively reduce the render
    //    dimensions by the scroll amount.
    var startTop = up >= 0 ? -up % tileHeight : -up;
    var startLeft = left >= 0 ? -left % tileWidth : -left;

    // Compute number of rows to render
    var rows = Math.floor(clientHeight / tileHeight);

    if ((up % tileHeight) > 0) {
        rows += 1;
    }

    if ((startTop + (rows * tileHeight)) < clientHeight) {
        rows += 1;
    }

    // Compute number of columns to render
    var cols = Math.floor(clientWidth / tileWidth);

    if ((left % tileWidth) > 0) {
        cols += 1;
    }

    if ((startLeft + (cols * tileWidth)) < clientWidth) {
        cols += 1;
    }

    // Limit rows/columns to maximum numbers
    rows = Math.min(rows, maxRows - startRow);
    cols = Math.min(cols, maxCols - startCol);

    // Initialize looping variables
    var currentTop = startTop;
    var currentLeft = startLeft;

    // Render new squares
    for (var row = startRow; row < (rows + startRow); row++) {
        for (var col = startCol; col < (cols + startCol); col++) {
            if (myGrid.Cells[row][col]) {
                myGrid.Cells[row][col].paint(row, col, currentLeft, currentTop, tileWidth, tileHeight, zoom);
            } else {
                console.log("ERROR: Grid cell index does not exist: " + row + ", " + col);
            }
            currentLeft += tileWidth;
        }

        currentLeft = startLeft;
        currentTop += tileHeight;
    }
};

// Gives the row and col of the entered x and y pixel values
Tiling.prototype.getCell = function(x, y) {
    var positions = scroller.getValues();

    // Respect zooming
    var tileHeight = this.__tileHeight * positions.zoom;
    var tileWidth = this.__tileWidth * positions.zoom;

    // Compute starting rows/columns and support out of range scroll positions
    var startRow = Math.max(Math.floor(positions.top / tileHeight), 0);
    var startCol = Math.max(Math.floor(positions.left / tileWidth), 0);

    var rowOffset = Math.floor(y / tileHeight);
    var colOffset = Math.floor(x / tileWidth);

    return {
        row: startRow + rowOffset,
        col: startCol + colOffset
    };
};

// Gives x, y, height, and width for given cell index
Tiling.prototype.getCellDimensions = function(row, col) {
    var positions = scroller.getValues();

    // Respect zooming
    var tileHeight = this.__tileHeight * positions.zoom;
    var tileWidth = this.__tileWidth * positions.zoom;

    // Compute starting rows/columns and support out of range scroll positions
    var startRow = Math.max(Math.floor(positions.top / tileHeight), 0);
    var startCol = Math.max(Math.floor(positions.left / tileWidth), 0);

    return {
        height: tileHeight,
        width: tileWidth,
        x: col * tileWidth - startCol * tileWidth,
        y: row * tileHeight - startRow * tileHeight
    };
}
