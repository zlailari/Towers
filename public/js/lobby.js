/* Takes care of setting up the various things for the lobby
*/

var LobbyManager = function () {
    this.divs = [];
    this.buttons = [];
    this.msgs = [];
    this.searching = true;
    this.joinedID = -1;
    this.inLobby = false;

    this.enterLobby = function() {
        if (this.inLobby) {
            return;
        }
        this.inLobby = true;
        $("#lobby").modal({backdrop:'static'});
    };

    this.exitLobby = function() {
        if (!this.inLobby) {
            return;
        }
        this.inLobby = false;
        $("#lobby").modal("hide");
    };

    this.updateText = function(id, numPlayers, maxPlayers) {
        if (this.searching) {
            this.msgs[id].remove();
            this.msgs[id] = $(
                '<p>Lobby ' + id + ' has ' + numPlayers
                + '/' + maxPlayers + ' players'
                + '</p>')
                .prependTo(this.divs[id]);
            if (numPlayers == maxPlayers) {
                this.buttons[id].addClass('disabled');
                this.buttons[id].off('click');
            } else {
                this.buttons[id].removeClass('disabled');
                this.buttons[id].click(
                    {id: id, this: this}, function(event) {
                    var id = event.data.id;
                    var msg = {
                        "lobbyID" : id
                    };
                    ws.requestLobby(userID, msg);
                });
            }
        } else if (id == this.joinedID) {
            this.msgs[id].remove();
            this.msgs[id] = $(
                '<p>You are in lobby ' + id + ' has ' + numPlayers
                + '/' + maxPlayers + ' players'
                + '</p>')
                .prependTo(this.divs[id]);
        }
        $("#lobby").modal("handleUpdate");
    };

    this.remove = function(id) {
        if (this.divs.hasOwnProperty(id)) {
            this.divs[id].remove();
            delete this.divs[id];
            delete this.msgs[id];
            delete this.buttons[id];
            $("#lobby").modal("handleUpdate");
        }
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
        this.joinedID = id;
        this.destroy();
        this.divs[id] = $(
            '<div class="lobby-item"/>')
            .appendTo($("#lobby.modal-body"));

        this.msgs[id] = $(
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
                var self = event.data.this;
                // TODO send request for lobby information
                // when user eixts
                self.destroy();
                self.joinedID = -1;
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
            })
            .appendTo(this.divs[id]);

        this.msgs[id] = $(
            '<p>Lobby ' + id + ' has ' + numPlayers
            + '/' + maxPlayers + ' players'
            + '</p>')
            .prependTo(this.divs[id]);

        if (numPlayers == maxPlayers) {
            this.buttons[id].addClass('disabled');
            this.buttons[id].off('click');
        }

        $("#lobby").modal("handleUpdate");
    };
    this.update = function(id, numPlayers, maxPlayers) {
        if (this.divs.hasOwnProperty(id)) {
            if (maxPlayers > 0) {
                this.updateText(id, numPlayers, maxPlayers);
            } else {
                this.remove(id);
            }
        } else {
            this.addNewLobby(id, numPlayers, maxPlayers);
        }
    };
};

lobbyManager = new LobbyManager();
