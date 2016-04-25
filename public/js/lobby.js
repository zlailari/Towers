/* Takes care of setting up the various things for the lobby
*/

var LobbyManager = function () {
    this.divs = [];
    this.buttons = [];
    this.msgs = [];
    this.searching = true;
    this.joinedID = -1;
    this.inLobby = false;
    this.newLbBtn = {hasClick: false, bt: null};

    this.enableNewLobby = function() {
        if (this.newLbBtn.bt == null ||
            this.newLbBtn.hasClick) {
            return;
        }
        this.newLbBtn.bt.click(function(event) {
            var msg = {};
            ws.newLobbyRequest(userID, msg);
        });
        this.newLbBtn.bt.removeClass('disabled');
        this.newLbBtn.hasClick = true;
    };

    this.disableNewLobby = function() {
        if (this.newLbBtn.hasClick == false ||
            this.newLbBtn.bt == null) {
            return;
        }
        this.newLbBtn.bt.addClass('disabled');
        this.newLbBtn.bt.off('click');
        this.newLbBtn.hasClick = false;
    };

    this.enterLobby = function() {
        if (this.inLobby) {
            return;
        }
        this.inLobby = true;
        $("#lobby").modal({backdrop:'static'});
        if (this.newLbBtn.bt == null) {
            this.newLbBtn.bt = $(
                '<button type="button" class="btn btn-default">'
                + 'Create New Lobby'
                + '</button>')
                .appendTo('#lobby.modal-footer');
        }
        this.enableNewLobby();
    };

    this.exitLobby = function() {
        if (!this.inLobby) {
            return;
        }
        this.destroy();
        this.inLobby = false;
        $("#lobby").modal("hide");
    };

    this.beginCountdown = function(time) {
        var intervalID = setInterval(function(self) {
            $('#lobby.modal-title').
            text("Game starting in: " + time);
            if (--time == 0) {
                window.clearInterval(intervalID);
                var msg = {
                    "lobby_id" : this.joinedID
                };
                ws.requestGameStart(userID, msg);
                self.exitLobby();
            }
        }, 1000, this);
    };

    this.updateText = function(id, numPlayers, maxPlayers) {
        if (this.searching) {
            this.msgs[id].remove();
            this.msgs[id] = $(
                '<p>Lobby ' + id + ' has ' + numPlayers
                + '/' + maxPlayers + ' players'
                + '</p>')
                .prependTo(this.divs[id]);
            if (numPlayers == maxPlayers &&
                this.buttons[id].hasClick) {
                this.buttons[id].bt.addClass('disabled');
                this.buttons[id].bt.off('click');
                this.buttons[id].hasClick = false;
            } else if (this.buttons[id].hasClick == false){
                this.buttons[id].bt.removeClass('disabled');
                this.buttons[id].bt.click(
                    {id: id, this: this}, function(event) {
                    var id = event.data.id;
                    var msg = {
                        "lobby_id" : id
                    };
                    ws.requestLobby(userID, msg);
                });
                this.buttons[id].hasClick = true;
            }
        } else if (id == this.joinedID) {
            this.msgs[id].remove();
            this.msgs[id] = $(
                '<p>You are in lobby ' + id + ' has ' + numPlayers
                + '/' + maxPlayers + ' players'
                + '</p>')
                .prependTo(this.divs[id]);
            if (numPlayers == maxPlayers) {
                this.beginCountdown(10);
            }
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
        this.disableNewLobby();
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
            .click({this:this, id: id}, function(event) {
                var self = event.data.this;
                var id = event.data.id;
                var msg = {
                    "lobby_id" : id
                };
                ws.requestGameStart(userID, msg);
                self.exitLobby();
            })
            .appendTo(this.divs[-1]);

        this.buttons[1] = $(
            '<button type="button" class="btn btn-default">'
            + 'Exit Lobby'
            + '</button>')
            .click({id: id, this: this}, function(event) {
                var self = event.data.this;
                // TODO send request for lobby information
                // when user eixts
                self.destroy();
                self.joinedID = -1;
                var id = event.data.id;
                var msg = {
                    "lobby_id" : id
                };
                ws.leaveLobby(userID, msg);
                self.enableNewLobby();
            })
            .appendTo(this.divs[-1]);

        $("#lobby").modal("handleUpdate");
    };

    this.addNewLobby = function(id, numPlayers, maxPlayers) {
        this.divs[id] = $(
            '<div class="lobby-item"/>')
            .appendTo($("#lobby.modal-body"));

        this.buttons[id] = {bt: $(
          '<button type="button" class="btn btn-default">'
          + 'Join Lobby'
          + '</button>')
            .click({id: id, this: this}, function(event) {
                var id = event.data.id;
                var msg = {
                    "lobby_id" : id
                };
                ws.requestLobby(userID, msg);
            })
            .appendTo(this.divs[id]),
            hasClick: true};

        this.msgs[id] = $(
            '<p>Lobby ' + id + ' has ' + numPlayers
            + '/' + maxPlayers + ' players'
            + '</p>')
            .prependTo(this.divs[id]);

        if (numPlayers == maxPlayers &&
            this.buttons[id].hasClick) {
            this.buttons[id].bt.addClass('disabled');
            this.buttons[id].bt.off('click');
            this.buttons[id].hasClick = false;
        }

        $("#lobby").modal("handleUpdate");
    };
    this.update = function(id, numPlayers, maxPlayers) {
        if (!this.inLobby) {
            return;
        }
        if (this.divs.hasOwnProperty(id)) {
            if (maxPlayers > 0) {
                this.updateText(id, numPlayers, maxPlayers);
            } else {
                this.remove(id);
            }
        } else if (this.searching) {
            this.addNewLobby(id, numPlayers, maxPlayers);
        }
    };
};

lobbyManager = new LobbyManager();
