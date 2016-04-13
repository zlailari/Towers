// Loads all game images

assetsLoaded = 0;
assetsToLoad = 7;

loadImages = function() {
    // ADD ANY IMAGES TO LOAD HERE.
    // CAN DEFINE IMAGE VAR IN YOUR FILE JUST REFERENCE IT HERE
    // AN BE SURE TO ADD ONTO THE CONSTANT AT THE TOP WHEN YOU ADD ONE

    creepPic = new Image();
    creepPic.onload = function() {imageLoaded();};
    creepPic.src = ('img/Demon3.png');

    towerImageNames = ["img/arrowHead.png",
        "img/fire.png", "img/ice.png"];
    creepImageNames = ["img/Demon1.png",
        "img/Demon2.png", "img/Demon3.png"];

    for (var i = 0; i < towerImageNames.length; i++) {
        towerImages[i] = new Image();
        towerImages[i].onload = function() {imageLoaded();};
        towerImages[i].src = towerImageNames[i];
    }
    for (var k = 0; k < creepImageNames.length; k++) {
        creepImages[k] = new Image();
        creepImages[k].onload = function() {imageLoaded();};
        creepImages[k].src = creepImageNames[k];
    }
};

imageLoaded = function() {
    assetsLoaded++;

    // check if all assets are loaded
    if (assetsLoaded == assetsToLoad) {
        fullyLoaded = true;
        initSideBar();
    }
};
