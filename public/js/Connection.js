// setup websocket with callbacks

var re = /(.*\:)(.*)/;
var hostParts = location.origin.match(re);

var host = hostParts[1].replace(/^http/, 'ws');
var port = 9000;
// var ws = new WebSocket(host + port);
var ws = new WebSocket('ws://localhost:9000/')

var userID = 0;

ws.onopen = function() {
    ws.send(JSON.stringify({
        type: 'identifier',
        secret: 'PLAYER'
    }))
    console.log('CONNECT');
};

ws.onclose = function() {
    console.log('DISCONNECT');

};

ws.onmessage = function(event) {
    var msg = safeParseJSON(event.data);
    if (msg && msg.hasOwnProperty('type')) {
        // var id = msg.id; placeholder
        var id = userID;
        if (msg.type == 'chat') {
            if (chatbox) {
                chatbox.addMsg(msg.id, msg.msg);
            }
        }
        if (msg.type == 'game_update') {
            if (id == userID) {
                playerState = msg['playerState'];
            }
            allAttacks[id] = msg['attacksMade'];
            allCreeps[id] = msg['creeps'];
        }
        if (msg.type == 'tower_update') {
            if (msg['towerAccepted'] && playerGrids[id]) {
                playerGrids[id].towerAccepted(msg['tower']);
            } else if (id == userID) {
                var reason = msg['reason'];
                var reason = "Placeholder";
                towerDenied(reason);
            }
        }
        if (msg.type == 'lobby_info') {
            console.log(msg);
            if (!lobbyManager) {
                enterLobby();
            }
            var lobbies = msg['lobbies'];
            for (var lobby in lobbies) {
                console.log(lobby);
                var lbid = lobby['id'];
                var num = lobby['num_players'];
                var max = lobby['max_players'];
                if (msg['allLobbies']) {
                    lobbyManager.addNewLobby(lbid, num, max);
                } else if (msg['lobby_info']) {
                    if (max > 0) {
                        lobbyManager.updateText(lbid, num, max);
                    } else {
                        lobbyManager.remove(id);
                    }
                } else if (msg['lobbyJoined']) {
                    lobbyManager.joinLobby(lbid, num, max);
                }
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

ws.requestGameStart = function(is, msg) {
    // msg format is:
    // {
    //     "lobbyID": 1,
    // }
    /* ws.send(JSON.stringify({
        type: "game_start_request",
        id: id,
        msg: msg
    }));*/
};

ws.requestLobby = function(id, msg) {
    // msg format is:
    // {
    //     "lobbyID": 1,
    // }
    console.log("Requested lobby " + msg['lobbyID']);
    /* ws.send(JSON.stringify({
        type: "lobby_request",
        id: id,
        msg: msg
    }));*/
};
