/* Takes care of setting up the various things for the lobby
*/

var lobbyManager = null;

var LobbyManager = function () {
    this.divs = [];
    this.buttons = [];
    this.msgs = [];
    this.searching = true;

    this.updateText = function(id, numPlayers, maxPlayers) {
    this.msgs[id].remove();

    this.msgs[id] = $(
        '<p>Lobby ' + id + ' has ' + numPlayers
        + '/' + maxPlayers + ' players'
        + '</p>')
        .prependTo(this.divs[id]);
    };

    this.remove = function(id) {
        this.divs[id].remove();
        delete this.divs[id];
        delete this.msgs[id];
        delete this.buttons[id];
        $("#lobby").modal("handleUpdate");
    };

    this.destroy = function() {
        for (var i in this.divs) {
            if (this.divs.hasOwnProperty(i)) {
                this.divs[i].remove();
                delete this.divs[i];
            }
        }

        for (var j in this.msgs) {
            if (this.msgs.hasOwnProperty(j)) {
                delete this.msgs[j];
            }
        }

        for (var k in this.buttons) {
            if (this.buttons.hasOwnProperty(k)) {
                delete this.buttons[k];
            }
        }
        $("#lobby").modal("handleUpdate");
    };

    this.joinLobby = function(id, numPlayers, maxPlayers) {
        this.searching = false;
        this.destroy();
        this.divs[id] = $(
            '<div class="lobby-item"/>')
            .appendTo($("#lobby.modal-body"));

        this.msgs[0] = $(
            '<p>You are in lobby ' + id + ' has ' + numPlayers
            + '/' + maxPlayers + ' players'
            + '</p>')
            .prependTo(this.divs[id]);

        this.divs[-1] = $(
            '<div class="lobby-item"/>')
            .appendTo($("#lobby.modal-body"));


        this.buttons[0] = $(
            '<button type="button" class="btn btn-default">'
            + 'Request Game Start'
            + '</button>')
            .click({id: id}, function(event) {
                // TODO send start of game request
                exitLobby();
            })
            .appendTo(this.divs[-1]);

        this.buttons[1] = $(
            '<button type="button" class="btn btn-default">'
            + 'Exit Lobby'
            + '</button>')
            .click({this: this}, function(event) {
                // TODO send request for lobby information
                // when user eixts
                event.data.this.destroy();
                exitLobby();
            })
            .appendTo(this.divs[-1]);

        $("#lobby").modal("handleUpdate");
    };

    this.addNewLobby = function(id, numPlayers, maxPlayers) {
        this.divs[id] = $(
            '<div class="lobby-item"/>')
            .appendTo($("#lobby.modal-body"));

        this.buttons[id] = $(
          '<button type="button" class="btn btn-default">'
          + 'Join Lobby'
          + '</button>')
            .click({id: id, this: this}, function(event) {
            var id = event.data.id;
            var msg = {
                "lobbyID" : id
            };
            ws.requestLobby(userID, msg);
            event.data.this.joinLobby(id, 0, 0);
            })
            .appendTo(this.divs[id]);

        this.msgs[id] = $(
            '<p>Lobby ' + id + ' has ' + numPlayers
            + '/' + maxPlayers + ' players'
            + '</p>')
            .prependTo(this.divs[id]);

        $("#lobby").modal("handleUpdate");
    };
};

function enterLobby () {
    $("#lobby").modal({backdrop:'static'});
    lobbyManager = new LobbyManager();
    for (var i = 0; i < 3; i++) {
        lobbyManager.addNewLobby(i, 0, 3);
    }
}

function exitLobby () {
    $("#lobby").modal("hide");
}
