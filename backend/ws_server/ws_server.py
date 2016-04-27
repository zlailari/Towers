"""This module acts as the server in charge of everything.
The game_loop has a client that connects to this server.

Each player has their web-browser client which connects to this server.

More details are in engin/ws_client.py."""
import random
import json
import asyncio
from multiprocessing import Process
from autobahn.asyncio.websocket import WebSocketServerProtocol, \
    WebSocketServerFactory

from engine.util import utf, obj_from_json, info
from engine.message_enum import MSG
from ws_server.identifiers import GAMELOOP_CLIENT_IDENTIFIER, PLAYER_IDENTIFIER
from ws_server import Lobby


# List of connected clients
# connected = []
lobbies = []  # lobbies are lists of users in different games
all_connections = []
user_ids = {}
MAX_LOBBY_SIZE = 4  # how many users can be in a lobby?
lobby_count = 0  # used to determine new lobby IDs, don't decrement
pending_lobby_names = []


INFO_ID = 'server'


def format_msg(text, m_type, msg=None):
    """Format the given string text to JSON for sending over the network."""
    full = {'text': text, 'type': m_type.name}
    if msg is not None:
        full.update(msg)
        return utf(json.dumps(full))
    else:
        return utf(json.dumps(full))


def start_server_process(address="0.0.0.0", port="9000"):
    # start the server running in a new process
    p = Process(target=start_server, args=(address, port), daemon=True)
    p.start()


def assign_user_id(connection):
    rand_range = 999999
    uid = random.randint(1, rand_range)
    while uid in user_ids.values():
        uid = random.randint(1, rand_range)

    user_ids[connection] = uid
    connection.sendMessage(format_msg(
        'you have been assigned a user id',
        MSG.assign_id,
        {
            'user_id': uid
        }
    ))


def create_lobby(gameengine_client):
    """Given an engine_client connection, create a lobby for it."""
    name = None
    if len(pending_lobby_names) > 0:
        name = pending_lobby_names.pop(0)
    lobby = Lobby(gameengine_client, lobby_count, MAX_LOBBY_SIZE, name)
    lobbies.append(lobby)

    global lobby_count
    lobby_count += 1
    broadcast_lobby_list()


def get_lobby(lobby_id):
    for lobby in lobbies:
        if lobby.get_id() == lobby_id:
            return lobby
    return None


def get_players_lobby(player_connection):
    """Return the lobby in which a player resides.  Assumes a player can only be in one lobby."""
    for lobby in lobbies:
        if lobby.has_player(player_connection):
            return lobby

    print('couldnt find lobby for player {}'.format(player_connection))
    return None


def send_lobby_list(player_connection):
    """Send the player connection a list of available lobbies."""
    message = {
        'type': MSG.lobby_info.name,
        'lobbies': []
    }

    for lobby in lobbies:
        max_players = MAX_LOBBY_SIZE if not lobby.is_in_game() else -1
        lobby_info = {
            'lobby_id': lobby.get_id(),
            'lobby_name': lobby.get_name(),
            'num_players': lobby.size(),
            'max_players': max_players,
            'players': [user_ids[player] for player in lobby.get_players()]
        }
        message['lobbies'].append(lobby_info)

    as_json = json.dumps(message)
    player_connection.sendMessage(utf(as_json), False)


def broadcast_lobby_list():
    for connection in all_connections:
        send_lobby_list(connection)


def game_add_player(game, player_id):
    """Tell a game instance to add this player."""
    print('sending message to gamerunner to add player {}'.format(player_id))
    message = format_msg(
        'add this player to your game',
        MSG.game_add_player,
        {
            'player_id': player_id
        }
    )
    print('message: {}'.format(message))
    game.sendMessage(message)


def lobby_add_player(player_connection, lobby_id):
    """Add a player to the lobby which has lobby_id."""
    if lobby_id in range(len(lobbies)):
        lobby = lobbies[lobby_id]
        if not lobby.is_full():
            lobby.add_player(player_connection)
            game_add_player(lobby.get_game_client(),
                            user_ids[player_connection])
            message = format_msg(
                'joined lobby {}'.format(lobby_id),
                MSG.lobby_joined,
                {
                    'lobby_id': lobby.get_id(),
                    'max_players': lobby.get_max_size(),
                    'num_players': lobby.size(),
                    'lobby_name': lobby.get_name()
                }
            )
            player_connection.sendMessage(message)
            # the lobby changed, so broadcast that to everyone
            broadcast_lobby_list()
        else:
            # lobby was full
            player_connection.sendMessage(format_msg(
                'lobby {} was full, could not join'.format(lobby_id),
                MSG.lobby_full
            ))
    else:
        player_connection.sendMessage(format_msg(
            'lobby {} did not exist'.format(lobby_id),
            MSG.lobby_dne
        ))


def game_remove_player(game, player_id):
    print('sending message to remove player {}'.format(player_id))
    message = format_msg(
        'remove this player from your game',
        MSG.game_remove_player,
        {
            'player_id': player_id
        }
    )
    print('message: {}'.format(message))
    game.sendMessage(message)


def remove_player(player_connection):
    """Remove a player from a lobby."""
    for lobby in lobbies:
        if lobby.has_player(player_connection):
            lobby.remove_player(player_connection)


def auto_add_player(player_connection):
    """Add the player to the lobby with the fewest players."""
    least = float('inf')
    handle = None
    for each in lobbies:
        if len(each) < least and len(each) < MAX_LOBBY_SIZE + 1:
            # + 1 since the engine resides in the list as well
            least = len(each)
            handle = each
    if handle is not None:
        handle.append(player_connection)
        handle[0].sendMessage(format_msg(
            'a user has joined your lobby.', MSG.info))
    else:
        info('ERROR! Player tried to connect, but no lobbies were available!', INFO_ID)
        # ask an existing gameloop server to spinoff another gameloop server
        lobbies[0].get_game_client().sendMessage(format_msg(
            'master ws server requesting new game instance', MSG.instance_request
        ))

        # while that's spinning up, tell the player to try connecting again
        player_connection.sendMessage(format_msg(
            'all lobbies were full, creating new lobby, try reconnecting again soon', MSG.reconnect_request
        ))
        player_connection.sendClose()


def start_server(address, port):
    # see http://autobahn.ws/python/websocket/programming.html

    # accept both string and int, since client has to accept int
    if isinstance(port, int):
        port = str(port)

    global lobby_count
    lobby_count = 0

    composite_address = 'ws://' + address + ':' + port
    info("starting websocket server at {}".format(composite_address), INFO_ID)
    factory = WebSocketServerFactory(composite_address)
    factory.protocol = GameServerProtocol

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop = asyncio.get_event_loop()

    coro = loop.create_server(factory, address, port)
    server = loop.run_until_complete(coro)

    try:
        loop.run_forever()
    except KeyboardInterrupt:
        info('cleaning up.', INFO_ID)
    finally:
        server.close()
        loop.close()


class GameServerProtocol(WebSocketServerProtocol):

    def onConnect(self, request):
        # onConnect happens before onOpen().  It isn't as useful
        # because onConnect() happens before the connection has succeeded.
        # if you want to do something when a client connects, you probably
        # want to do it in onOpen().  This is more like "onAttempt()".
        info("Client connecting: {0}".format(request.peer), INFO_ID)

    def onOpen(self):
        # connected.append(self)
        # if gameloop_client:
        #    gameloop_client.sendMessage(format_msg(
        #        'a user has connected', MSG.info), False)
        # info("connections: " + str(len(connected)), INFO_ID)
        # self.sendMessage(format_msg(
        #    'you have joined the server.', MSG.info), False)
        pass  # nothing really happens until the new connection identifies itself

    def onMessage(self, payload, isBinary):
        assert isBinary is False
        as_string = payload.decode('utf8')
        # info('received raw message: {}'.format(as_string), INFO_ID)
        message = obj_from_json(as_string)
        assert 'type' in message
        m_type = message['type']

        # info('received message (type {}): {}'.format(m_type, as_string), INFO_ID)
        if m_type == MSG.chat.name:
            self.handleChat(as_string)
        elif m_type == MSG.tower_request.name:
            self.handleTowerRequest(as_string)
        elif m_type == MSG.tower_update.name:
            self.handleTowerUpdate(as_string)
        elif m_type == MSG.game_update.name:
            self.handleTowerUpdate(as_string)
        elif m_type == MSG.identifier.name:
            self.handleIdentifier(as_string)
        elif m_type == MSG.instance_request.name or m_type == MSG.new_lobby_request.name:
            self.handleInstanceRequest(as_string)
        elif m_type == MSG.lobby_request.name:
            self.handleLobbyJoinRequest(as_string)
        elif m_type == MSG.leave_lobby.name:
            self.handleLeaveLobby(as_string)
        elif m_type == MSG.game_start_request.name:
            self.handleStartGame(as_string)
        elif m_type == MSG.creep_request.name:
            self.handleCreepRequest(as_string)
        else:
            info('warning! server does not handle message with type {}'.format(
                m_type), INFO_ID)

    def handleDeleteTower(self, json_msg):
        """A client has requested that a tower be deleted."""
        lobby = get_players_lobby(self)
        assert lobby is not None
        game = lobby.get_game_client()
        game.sendMessage(utf(json_msg))

    def handleStartGame(self, json_msg):
        # start the sender's game
        lobby = get_players_lobby(self)
        if lobby is not None:
            lobby.game_is_running()
            game = lobby.get_game_client()
            game.sendMessage(format_msg(
                'start running the game',
                MSG.game_start_request
            ))
            self.broadcast_to_lobby(format_msg(
                'the game is starting, get ready',
                MSG.game_start,
                {
                    'players': [user_ids[player] for player in lobby.get_players()]
                }
            ), send_self=True)
            broadcast_lobby_list()

    def handleIdentifier(self, json_msg):
        """Handle identification messages, such as the server
        identification message."""
        unpacked = obj_from_json(json_msg)
        assert 'secret' in unpacked
        if unpacked['secret'] == GAMELOOP_CLIENT_IDENTIFIER:
            create_lobby(self)
            info("game engine client registered", INFO_ID)
        elif unpacked['secret'] == PLAYER_IDENTIFIER:
            assign_user_id(self)
            all_connections.append(self)
            send_lobby_list(self)
        else:
            info(
                'new connection failed to identify itself as user or gameloop client.', INFO_ID)

    def handleLobbyJoinRequest(self, json_msg):
        unpacked = obj_from_json(json_msg)
        requested_lobby_id = int(unpacked['msg']['lobby_id'])
        lobby_add_player(self, requested_lobby_id)

    def handleInstanceRequest(self, json_msg):
        # someone wants a new game instance, so tell a game engine to spin one
        # up
        assert len(lobbies) > 0
        message = obj_from_json(json_msg)

        assert 'lobby_name' in message
        lobby_name = message['lobby_name']
        pending_lobby_names.append(lobby_name)

        engine = lobbies[0].get_game_client()
        assert engine is not None
        engine.sendMessage(format_msg(
            'ws master server requesting new game instance',
            MSG.instance_request
        ))

    def handleChat(self, json_msg):
        self.broadcast_to_lobby(json_msg)

    def handleGameUpdate(self, json_msg):
        self.broadcast_to_lobby(json_msg)

    def handleTowerRequest(self, json_msg):
        lobby = get_players_lobby(self)
        lobby.get_game_client().sendMessage(utf(json_msg), False)

    def handleTowerUpdate(self, json_msg):
        self.broadcast_to_lobby(json_msg)

    def handleLeaveLobby(self, json_msg):
        lobby = get_players_lobby(self)
        if lobby:
            lobby.remove_player(self)
            game_remove_player(lobby.get_game_client(),
                               user_ids[self])
        broadcast_lobby_list()

    def handleCreepRequest(self, json_msg):
        lobby = get_players_lobby(self)
        lobby.get_game_client().sendMessage(utf(json_msg), False)

    def broadcast_to_lobby(self, msg, send_self=False):
        """Broadcast a message to rest of the sender's lobby"""
        lobby = get_players_lobby(self)
        for client in lobby.get_all():
            if send_self or client != self:
                client.sendMessage(utf(msg), False)

    def onClose(self, wasClean, code, reason):
        info("WebSocket connection closed: {0}".format(reason), INFO_ID)
        if self in all_connections:
            all_connections.remove(self)
        lobby = get_players_lobby(self)
        if lobby:
            lobby.remove_player(self)
        broadcast_lobby_list()
