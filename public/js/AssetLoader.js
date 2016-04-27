// Loads all game images

assetsLoaded = 0;
assetsToLoad = 18;

var shotNames;
var shotImages = {"Human": [], "Alien": []};

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
        initSideBar();
    }
};
