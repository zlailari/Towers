/* Takes care of setting up the various things for the lobby.
*  This class is rather nasty right now and needs some reworking,
*  but it gets the job done
*/

var LobbyManager = function () {
    this.divs = [];
    this.buttons = [];
    this.msgs = [];
    this.searching = true;
    this.joinedID = -1;
    this.inLobby = false;
    this.newLbBtn = {hasClick: false, bt: null};
    this.canCreateLobby = true;
    this.gameFull = false;

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
        for (var id in this.divs) {
            if (this.divs.hasOwnProperty(id)) {
                this.remove(id);
            }
        }
    };

    this.enableNewLobby = function() {
        if (this.newLbBtn.bt == null ||
            this.newLbBtn.hasClick) {
            return;
        }
        this.newLbBtn.bt.click({this: this}, function(event) {
            var self = event.data.this;
            if (self.canCreateLobby) {
                var name = null;
                name = $("#lbName").val();
                if (name == null) {
                    name = "";
                }
                var msg = {
                    "lobby_name": name
                };
                ws.newLobbyRequest(userID, msg);
                self.canCreateLobby = false;
                self.newLbBtn.bt.addClass('disabled');
                setTimeout(function(self) {
                    self.canCreateLobby = true;
                    self.newLbBtn.bt.removeClass('disabled');
                }, 10000, self);
            }
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
        this.inLobby = true;
        if (!chatbox.isVisible()) {
            chatbox.toggleBox();
        }
        this.searching = true;
        $("#lobby").modal({backdrop:'static'});
    };

    this.init = function() {
        if (this.newLbBtn.bt == null) {
            this.newLbBtn.bt = $("#lbBtn");
        }
        this.enableNewLobby();
        this.searching = true;
    };

    this.exitLobby = function() {
        this.destroy();
        this.inLobby = false;
        $("#lobby").modal("hide");
        if (chatbox.isVisible()) {
            chatbox.toggleBox();
        }
        $('.overlay').fadeOut(500);
    };

    this.beginCountdown = function(time) {
        var intervalID = setInterval(function(self) {
            $('#lobby.modal-title').
                text("Game starting in: " + time);
            if ((--time == 0) && (self.gameFull == true)) {
                window.clearInterval(intervalID);
                var msg = {
                    "lobby_id" : this.joinedID
                };
                ws.requestGameStart(userID, msg);
                self.exitLobby();
            } else if (self.gameFull == false) {
                window.clearInterval(intervalID);
                $('#lobby.modal-title').
                    text("Lobby Information");
            }
        }, 1000, this);
    };

    this.updateText = function(id, name, numPlayers, maxPlayers) {
        if (this.searching) {
            this.msgs[id].remove();
            this.msgs[id] = $(
                '<p>Lobby ' + name + ' has ' + numPlayers
                + '/' + maxPlayers + ' players'
                + '</p>')
                .prependTo(this.divs[id]);
            if (numPlayers == maxPlayers && this.buttons[id].hasClick) {
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
                this.gameFull = true;
            } else {
                this.gameFull = false;
            }
        }
        $("#lobby").modal("handleUpdate");
    };

    this.joinLobby = function(id, name, numPlayers, maxPlayers) {
        this.disableNewLobby();
        this.searching = false;
        this.joinedID = id;
        this.destroy();
        this.divs[id] = $(
            '<div class="lobby-item"/>')
            .appendTo($("#lobby.modal-body"));

        this.msgs[id] = $(
            '<p>You are in lobby ' + name + ' has ' + numPlayers
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
                self.searching = true;
                self.gameFull = false;
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

    this.addNewLobby = function(id, name, numPlayers, maxPlayers) {
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
            '<p>Lobby ' + name + ' has ' + numPlayers
            + '/' + maxPlayers + ' players'
            + '</p>')
            .prependTo(this.divs[id]);

        if (numPlayers == maxPlayers && this.buttons[id].hasClick) {
            this.buttons[id].bt.addClass('disabled');
            this.buttons[id].bt.off('click');
            this.buttons[id].hasClick = false;
        }

        $("#lobby").modal("handleUpdate");
    };
    this.update = function(id, name, numPlayers, maxPlayers) {
        if (this.divs.hasOwnProperty(id)) {
            if (maxPlayers > 0) {
                this.updateText(id, name, numPlayers, maxPlayers);
            } else {
                this.remove(id);
            }
        } else if (this.searching && maxPlayers > 0) {
            this.addNewLobby(id, name, numPlayers, maxPlayers);
        }
    };
};
