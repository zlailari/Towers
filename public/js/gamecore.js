// Grid/Canvas Settings
var contentWidth = 2000;
var contentHeight = 2000;
var cellWidth = 100;
var cellHeight = 100;

// Important declarations for grid/canvas
var content = document.getElementById('content');
var context = content.getContext('2d');
var tiling = new Tiling;

// *Temperary for demonstration* get image. This is a bad way to do this
var tile = new Image();
var imageLoaded = false;
tile.src = "img/game/tile.png"
tile.onload = function() { imageLoaded = true; };

var myGrid = new Grid(contentWidth, contentHeight, cellWidth, cellHeight);
