// Loads all game images

assetsLoaded = 0;
assetsToLoad = 10;

loadImages = function() {
    // ADD ANY IMAGES TO LOAD HERE.
    // CAN DEFINE IMAGE VAR IN YOUR FILE JUST REFERENCE IT HERE
    // AN BE SURE TO ADD ONTO THE CONSTANT AT THE TOP WHEN YOU ADD ONE

    // TODO: Get rid of this when backend creep stuff is ready
    creepPic = new Image();
    creepPic.onload = function() {imageLoaded();};
    creepPic.src = ('img/Demon3.png');

    towerImageNames = [
        "/img/towers/h_rocket_1.png",
        "/img/towers/h_rail_1.png",
        "/img/towers/h_laser_1.png",
        "img/delete.png",
        "img/upgrade.png",
    ];
    creepImageNames = ["img/Demon1.png",
        "img/Demon2.png", "img/Demon3.png"];

    for (var i = 0; i < towerImageNames.length; i++) {
        towerImages[i] = new Image();
        towerImages[i].onload = function() {imageLoaded();};
        towerImages[i].src = towerImageNames[i];
    }

    backgroundImg = new Image();
    backgroundImg.onload = function() { imageLoaded(); };
    backgroundImg.src = ('img/background.png');

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
