// setup websocket with callbacks
var ws = new WebSocket('ws://localhost:9000/');
ws.onopen = function() {
    console.log('CONNECT');
};

ws.onclose = function() {
    console.log('DISCONNECT');
};

ws.onmessage = function(event) {
    msg = safeParseJSON(event.data);
    if (msg && msg.hasOwnProperty('type')) {
        if (msg.type == 'chat') {
            if (chatbox) {
                chatbox.addMsg(msg.id, msg.msg);
            }
        }
        if (msg.type == 'game_update') {
            playerState = msg['playerState'];
            attacksMade = msg['attacksMade'];
            creeps = msg['creeps'];
        }
        if (msg.type == 'tower_update') {
            if (msg['towerAccepted'] && myGrid) {
                myGrid.towerAccepted(msg['tower']);
            } else {
                // Placeholder until I can get a popup box working
                console.log("Tower denied");
                // towerDenied();
            }
        }
    }
};

ws.sendChat = function(id, msg) {
    // msg is literally msg
    ws.send(JSON.stringify({
        type: "chat",
        id: id,
        msg: msg
    }));
};

ws.towerRequest = function(id, msg) {
    // msg format is:
    // {
    //     "towerID": 1,
    //     "x": 3,
    //     "y": 4
    // }
    ws.send(JSON.stringify({
        type: "tower_request",
        id: id,
        msg: msg
    }));
};

ws.creepRequest = function(id, msg) {
    // msg format is:
    // {
    //     "creepID": 1,
    // }
    ws.send(JSON.stringify({
        type: "creep_request",
        id: id,
        msg: msg
    }));
};

var userID = 0; // Placeholder
