// Loads all game images

assetsLoaded = 0;
assetsToLoad = 4;

loadImages = function() {
    // ADD ANY IMAGES TO LOAD HERE.
    // CAN DEFINE IMAGE VAR IN YOUR FILE JUST REFERENCE IT HERE
    // AN BE SURE TO ADD ONTO THE CONSTANT AT THE TOP WHEN YOU ADD ONE

    creepPic = new Image();
    creepPic.onload = function() {imageLoaded();};
    creepPic.src = ('img/Demon3.png');

    var towerImageNames = ["img/arrowHead.png",
        "img/fire.png", "img/ice.png"];
    for (var i = 0; i < towerImageNames.length; i++) {
        towerImages[i] = new Image();
        towerImages[i].onload = function() {imageLoaded();};
        towerImages[i].src = towerImageNames[i];
    }

    backgroundImg = new Image();
    backgroundImg.onload = function() { imageLoaded(); };
    backgroundImg.src = ('img/background.png');

};

imageLoaded = function() {
    assetsLoaded++;

    // check if all assets are loaded
    if (assetsLoaded == assetsToLoad) {
        fullyLoaded = true;
    }
};
