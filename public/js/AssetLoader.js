// Loads all game images

assetsLoaded = 0;
assetsToLoad = 0;

loadImages = function() {
    // ADD ANY IMAGES TO LOAD HERE.
    // CAN DEFINE IMAGE VAR IN YOUR FILE JUST REFERENCE IT HERE
    // AN BE SURE TO ADD ONTO THE CONSTANT AT THE TOP WHEN YOU ADD ONE

    // TODO: Get rid of this when backend creep stuff is ready

    var humanImages = [
        ["/img/towers/h/laser_1.png", "/img/towers/h/laser_2.png",
        "/img/towers/h/laser_3.png"],
        ["/img/towers/h/rocket_1.png", "/img/towers/h/rocket_2.png",
        "/img/towers/h/rocket_3.png"],
        ["/img/towers/h/electric_trap.png"],
        ["/img/towers/h/sniper_1.png", "/img/towers/h/sniper_2.png",
        "/img/towers/h/sniper_3.png"],
        ["/img/towers/h/wall.png"],
        ["/img/towers/h/rail_1.png", "/img/towers/h/rail_2.png",
        "/img/towers/h/rail_3.png"],
        ["/img/towers/h/poison_1.png", "/img/towers/h/poison_2.png",
        "/img/towers/h/poison_3.png"]
    ];

    var alienImages = [
        ["/img/towers/a/laser_1.png", "/img/towers/a/laser_2.png",
        "/img/towers/a/laser_3.png"],
        ["/img/towers/a/rocket_1.png", "/img/towers/a/rocket_2.png",
        "/img/towers/a/rocket_3.png"],
        ["/img/towers/a/electric_trap.png"],
        ["/img/towers/a/sniper_1.png", "/img/towers/a/sniper_2.png",
        "/img/towers/a/sniper_3.png"],
        ["/img/towers/a/wall.png"],
        ["/img/towers/a/rail_1.png", "/img/towers/a/rail_2.png",
        "/img/towers/a/rail_3.png"],
        ["/img/towers/a/poison_1.png", "/img/towers/a/poison_2.png",
        "/img/towers/a/poison_3.png"]
    ];

    var assetPack = null;
    if (Math.random() > 0.5) {
        assetPack = alienImages;
        console.log("Alien");
    } else {
        console.log("Human");
        assetPack = humanImages;
    }

    towerImageNames = [];

    for (var i = 0; i < assetPack.length; ++i) {
        towerImageNames[i] = assetPack[i];
    }
    towerImageNames[towerImageNames.length] = ["img/delete.png"];
    towerImageNames[towerImageNames.length] = ["img/upgrade.png"];


    creepImageNames = ["img/Demon1.png",
        "img/Demon2.png", "img/Demon3.png"];

    for (var i = 0; i < towerImageNames.length; i++) {
        var names = towerImageNames[i];
        var images = [];
        for (var j = 0; j < names.length; j++) {
            assetsToLoad++;
            images[j] = new Image();
            images[j].onload = function() {imageLoaded();};
            images[j].src = names[j];
        }
        towerImages[i] = images;
    }
    console.log(towerImages);
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
