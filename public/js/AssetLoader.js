// Loads all game images

assetsLoaded = 0;
assetsToLoad = 0;

loadImages = function() {
    // ADD ANY IMAGES TO LOAD HERE.
    // CAN DEFINE IMAGE VAR IN YOUR FILE JUST REFERENCE IT HERE
    // AN BE SURE TO ADD ONTO THE CONSTANT AT THE TOP WHEN YOU ADD ONE

    // TODO: Get rid of this when backend creep stuff is ready

    var humanImages = [
        ["/img/towers/h_rocket_1.png", "/img/towers/h_rocket_2.png",
        "/img/towers/h_rocket_3.png"],
        ["/img/towers/h_rail_1.png", "/img/towers/h_rail_2.png",
        "/img/towers/h_rail_3.png"],
        ["/img/towers/h_laser_1.png", "/img/towers/h_laser_2.png",
        "/img/towers/h_laser_3.png"],
        "/img/towers/h_wall.png"
    ];

    towerImageNames = [];

    for (var i = 0; i < humanImages.length; ++i) {
        towerImageNames[i] = humanImages[i];
    }
    towerImageNames[towerImageNames.length] = "img/delete.png";
    towerImageNames[towerImageNames.length] = "img/upgrade.png";


    creepImageNames = ["img/Demon1.png",
        "img/Demon2.png", "img/Demon3.png"];

    for (var i = 0; i < towerImageNames.length; i++) {
        var names = towerImageNames[i];
        if (names.constructor == Array) {
            var images = [];
            for (var j = 0; j < names.length; j++) {
                assetsToLoad++;
                images[j] = new Image();
                images[j].onload = function() {imageLoaded()};
                images[j].src = names[i];
            }
            towerImages[i] = images;
        } else {
            assetsToLoad++;
            towerImages[i] = new Image();
            towerImages[i].onload = function() {imageLoaded();};
            towerImages[i].src = towerImageNames[i];
        }
    }
    assetsToLoad++;
    backgroundImg = new Image();
    backgroundImg.onload = function() { imageLoaded(); };
    backgroundImg.src = ('img/background.png');

    for (var k = 0; k < creepImageNames.length; k++) {
        assetsToLoad++;
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
