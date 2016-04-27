// setup websocket with callbacks

var prod_re = /(.*\:)(.*)/;
var test_re = /(.*)(:\d+$)/;
var prodParts = location.origin.match(prod_re);
var testParts = location.origin.match(test_re);

var host, ws, port = 9000;

if (testParts) {
     host = testParts[1].replace(/^http/, 'ws');
     ws = new WebSocket(host + ':' + port);
} else {
     host = prodParts[1].replace(/^http/, 'ws');
     ws = new WebSocket(host + prodParts[2] + ':' + port);
}

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
                if (playerState['isDead']) {
                    allCreeps[id] = [];
                    var gameOffset = $("#gameFrame").offset();
                    playerGrids[id] = new Grid(gameCan, gameCtx, gameOffset);
                    $('<button type="button" class="btn btn-default">'
                        + 'Rejoin Lobby System'
                        + '</button>')
                        .appendTo($("#rejoinLbBtn"))
                        .click(function(event) {
                            destroySideBar();
                            $('.overlay').fadeIn(500);
                            setTimeout(lobbyManager.enterLobby, 500);
                            $(this).remove();
                        });
                }
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
            } else if (msg['towerDeleted'] && playerGrids[id]){
                playerGrids[id].deleteTower(msg['x'],
                    msg['y']);
            } else if (msg['towerUpgraded'] && playerGrids[id]) {
                playerGrids[id].upgradeTower(msg['x'],
                    msg['y']);
            } else if (id == userID) {
                var reason = msg['reason'];
                towerDenied(reason);
            }

        }
        if (msg.type == 'lobby_info') {
            var lobbies = msg['lobbies'];
            for (var i = 0; i < lobbies.length; ++i) {
                var lobby = lobbies[i];
                var lbid = lobby['lobby_id'];
                var lbname = lobby['lobby_name'];
                var num = lobby['num_players'];
                var max = lobby['max_players'];
                var players = lobby['players'];
                lobbyManager.update(lbid, lbname, num, max);
            }
        }
        if (msg.type == 'lobby_joined') {
            var lbid2 = msg['lobby_id'];
            var lbname2 = msg['lobby_name'];
            var num2 = msg['num_players'];
            var max2 = msg['max_players'];
            lobbyManager.joinLobby(lbid2, lbname2, num2, max2);
        } else if (msg.type == 'lobby_dne') {
            // placeholder
        }

        if (msg.type == 'game_start') {
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
            initSideBar();
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
    console.log(msg);
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
