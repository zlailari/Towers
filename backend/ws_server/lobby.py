class Lobby:

    def __init__(self, game_client, lobby_id, max_size=4):
        self.max_size = max_size
        self.players = []  # list of player connections
        self.game_client = game_client
        self.lobby_id = lobby_id

    def add_player(self, player_connection):
        self.players.append(player_connection)

    def get_id(self):
        return self.lobby_id

    def get_players(self):
        return self.players

    def get_all(self):
        """Get all the participants of this lobby, including the game engine."""
        return self.players + [self.game_client]

    def get_game_client(self):
        return self.game_client

    def size(self):
        return len(self.players)

    def is_full(self):
        return self.size() >= self.max_size

    def has_player(self, player_connection):
        return player_connection in self.players or player_connection == self.game_client

    def remove_player(self, player_connection):
        if self.has_player(player_connection):
            self.players.remove(player_connection)
