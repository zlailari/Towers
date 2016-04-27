// Loads all game images

assetsLoaded = 0;
assetsToLoad = 0;


var shotNames;
var shotImages = {"Human": [], "Alien": []};

var race = null;

loadImages = function() {
    // ADD ANY IMAGES TO LOAD HERE.
    // CAN DEFINE IMAGE VAR IN YOUR FILE JUST REFERENCE IT HERE
    // AN BE SURE TO ADD ONTO THE CONSTANT AT THE TOP WHEN YOU ADD ONE

    // TODO: Get rid of this when backend creep stuff is ready

    var humanImages = [
        ["/img/towers/h/laser_1.jpg", "/img/towers/h/laser_2.jpg",
        "/img/towers/h/laser_3.jpg"],
        ["/img/towers/h/rocket_1.jpg", "/img/towers/h/rocket_2.jpg",
        "/img/towers/h/rocket_3.jpg"],
        ["/img/towers/h/electric_trap.jpg"],
        ["/img/towers/h/sniper_1.jpg", "/img/towers/h/sniper_2.jpg",
        "/img/towers/h/sniper_3.jpg"],
        ["/img/towers/h/wall.jpg"],
        ["/img/towers/h/rail_1.jpg", "/img/towers/h/rail_2.jpg",
        "/img/towers/h/rail_3.jpg"],
        ["/img/towers/h/poison_1.jpg", "/img/towers/h/poison_2.jpg",
        "/img/towers/h/poison_3.jpg"]
    ];

    var alienImages = [
        ["/img/towers/a/laser_1.jpg", "/img/towers/a/laser_2.jpg",
        "/img/towers/a/laser_3.jpg"],
        ["/img/towers/a/rocket_1.jpg", "/img/towers/a/rocket_2.jpg",
        "/img/towers/a/rocket_3.jpg"],
        ["/img/towers/a/electric_trap.jpg"],
        ["/img/towers/a/sniper_1.jpg", "/img/towers/a/sniper_2.jpg",
        "/img/towers/a/sniper_3.jpg"],
        ["/img/towers/a/wall.jpg"],
        ["/img/towers/a/rail_1.jpg", "/img/towers/a/rail_2.jpg",
        "/img/towers/a/rail_3.jpg"],
        ["/img/towers/a/poison_1.jpg", "/img/towers/a/poison_2.jpg",
        "/img/towers/a/poison_3.jpg"]
    ];

    var assetPack = null;
    if (Math.random() > 0.5) {
        assetPack = alienImages;
        race = "Alien";
    } else {
        race = "Human";
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

    shotNames = {
        "Human": [
            "/img/shots/h_rocket_shot.png",
            "/img/shots/h_sniper_shot.png",
            "/img/shots/h_poison_shot.png",
            "/img/shots/h_rail_shot.png",
        ],
        "Alien": [
            "/img/shots/a_rocket_shot.png",
            "/img/shots/a_sniper_shot.png",
            "/img/shots/a_poison_shot.png",
            "/img/shots/a_rail_shot.png",
        ],
    };
    for (var q = 0; q < shotNames['Human'].length; q++) {
        shotImages['Human'].push(new Image());
        shotImages['Human'][q].onload = function() {imageLoaded();};
        shotImages['Human'][q].src = shotNames['Human'][q];
    }
    for (var z = 0; z < shotNames['Alien'].length; z++) {
        shotImages['Alien'].push(new Image());
        shotImages['Alien'][z].onload = function() {imageLoaded();};
        shotImages['Alien'][z].src = shotNames['Human'][z];
    }
};

imageLoaded = function() {
    assetsLoaded++;

    // check if all assets are loaded
    if (assetsLoaded == assetsToLoad) {
        fullyLoaded = true;
    }
};
