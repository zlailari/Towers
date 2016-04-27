// setup websocket with callbacks

var re = /(.*\:)(.*)/;
var hostParts = location.origin.match(re);

var host = hostParts[1].replace(/^http/, 'ws');
var port = 9000;
var ws = new WebSocket(host + port);
// var ws = new WebSocket('ws://localhost:9000/');

var userID = 0;

ws.onopen = function() {
    ws.send(JSON.stringify({
        type: 'identifier',
        secret: 'PLAYER'
    }));
    console.log('CONNECT');
};

ws.onclose = function() {
    console.log('DISCONNECT');

};

ws.onmessage = function(event) {
    var msg = safeParseJSON(event.data);
    if (msg && msg.hasOwnProperty('type')) {

        var id = msg.player_id;
        if (msg.type == 'assign_id') {
            userID = msg['user_id'];
            tabManager.addTab(userID);
            playerGrids[userID] = myGrid;
        }
        if (msg.type == 'chat') {
            if (chatbox) {
                chatbox.addMsg(msg.id, msg.msg);
            }
        }
        if (msg.type == 'game_update') {
            if (id == userID) {
                playerState = msg['playerState'];
            }

            var newShots = msg['attacksMade'];
            if (newShots && newShots.constructor == Array) {
                if (id == tabManager.getCurrentTab()) {
                    for (var j = 0; j < newShots.length; ++j) {
                        shots.push(newShots[j]);
                    }
                }
            }

            allCreeps[id] = msg['creeps'];

            allEffects[id] = msg['effects'];

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
            var lobbies = msg['lobbies'];
            for (var i = 0; i < lobbies.length; ++i) {
                var lobby = lobbies[i];
                var lbid = lobby['lobby_id'];
                var num = lobby['num_players'];
                var max = lobby['max_players'];
                var players = lobby['players'];
                lobbyManager.update(lbid, num, max);
            }
        }
        if (msg.type == 'lobby_joined') {
            var lbid2 = msg['lobby_id'];
            var num2 = msg['num_players'];
            var max2 = msg['max_players'];
            lobbyManager.joinLobby(lbid2, num2, max2);
        } else if (msg.type == 'lobby_dne') {
            // placeholder
        }

        if (msg.type == 'game_start') {
            $('.overlay').fadeOut(500);

            var players2 = msg['players'];
            for (var k = 0; k < players2.length; k++) {
                var newID = players2[k];
                tabManager.addTab(newID);
                if (!playerGrids.hasOwnProperty(newID)) {
                    var gameOffset2 = $("#gameFrame").offset();
                    playerGrids[newID] = new Grid(gameCan, gameCtx, gameOffset2);
                }
            }
            lobbyManager.exitLobby();
        }
    }
};

ws.sendChat = function(id, msg) {
    // msg is literally msg
    ws.send(JSON.stringify({
        type: "chat",
        player_id: id,
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
        player_id: id,
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
        player_id: id,
        msg: msg
    }));
};

ws.newLobbyRequest = function(id, msg) {
    // msg format is:
    // {
    // }
    ws.send(JSON.stringify({
        type: "new_lobby_request",
        player_id: id,
        msg: msg
    }));
};

ws.leaveLobby = function(id, msg) {
    // msg format is:
    // {
    //     "lobby_id": 1,
    // }
    ws.send(JSON.stringify({
        type: "leave_lobby",
        player_id: id,
        msg: msg
    }));
};

ws.requestGameStart = function(id, msg) {
    // msg format is:
    // {
    //     "lobby_id": 1,
    // }
    ws.send(JSON.stringify({
        type: "game_start_request",
        player_id: id,
        msg: msg
    }));
};

ws.requestLobby = function(id, msg) {
    // msg format is:
    // {
    //     "lobby_id": 1,
    // }
    // console.log("Requested lobby " + msg['lobby_id']);
    ws.send(JSON.stringify({
        type: "lobby_request",
        player_id: id,
        msg: msg
    }));
};
