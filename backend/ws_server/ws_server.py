"""This module acts as the server in charge of everything.

The game_loop has a client that connects to this server.

Each player has their web-browser client which connects to this server.

More details are in engin/ws_client.py."""
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
MAX_LOBBY_SIZE = 4  # how many users can be in a lobby?
lobby_count = 0  # used to determine new lobby IDs, don't decrement

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
    p = Process(target=start_server, args=(address, port))
    p.start()


def create_lobby(gameengine_client):
    """Given an engine_client connection, create a lobby for it."""
    lobby = Lobby(gameengine_client, lobby_count, MAX_LOBBY_SIZE)
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
    return None


def send_lobby_list(player_connection):
    """Send the player connection a list of available lobbies."""
    message = {
        'type': MSG.lobby_info.name,
        'lobbies': []
    }
    for lobby in lobbies:
        lobby_info = {
            'lobby_id': lobby.get_id(),
            'num_players': lobby.size(),
            'max_players': MAX_LOBBY_SIZE,
            'players': []
        }
        message['lobbies'].append(lobby_info)

    as_json = json.dumps(message)
    player_connection.sendMessage(utf(as_json), False)


def broadcast_lobby_list():
    # TODO this only sends to people already in lobbies...
    everyone = []
    for lobby in lobbies:
        everyone.extend(lobby.get_players())
    for connection in everyone:
        send_lobby_list(connection)


def get_lobby_engine(lobby):
    """Given a lobby, return its gameloop engine connection."""
    assert len(lobby) > 0
    return lobby[0]  # gameloop engine always resides in first index


def add_player(player_connection, lobby_id):
    """Add a player to the lobby which has lobby_id."""
    if lobby_id in range(len(lobbies)):
        lobby = lobbies[lobby_id]
        if not lobby.is_full():
            lobby.add_player(player_connection)
            message = format_msg(
                'joined lobby {}'.format(lobby_id),
                MSG.lobby_joined,
                {
                    'lobby_id': lobby.get_id(),
                    'max_players': lobby.get_max_size(),
                    'num_players': lobby.size()
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
        get_lobby_engine(lobbies[0]).sendMessage(format_msg(
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
        elif m_type == MSG.instance_request.name:
            self.handleInstanceRequest(as_string)
        elif m_type == MSG.lobby_request.name:
            self.handleLobbyJoinRequest(as_string)
        elif m_type == MSG.leave_lobby.name:
            self.handleLeaveLobby(as_string)
        else:
            info('warning! server does not handle message with type {}'.format(
                m_type), INFO_ID)

    def handleIdentifier(self, json_msg):
        """Handle identification messages, such as the server
        identification message."""
        unpacked = obj_from_json(json_msg)
        assert 'secret' in unpacked
        if unpacked['secret'] == GAMELOOP_CLIENT_IDENTIFIER:
            create_lobby(self)
            info("game engine client registered", INFO_ID)
        elif unpacked['secret'] == PLAYER_IDENTIFIER:
            send_lobby_list(self)
        else:
            info(
                'new connection failed to identify itself as user or gameloop client.', INFO_ID)

    def handleLobbyJoinRequest(self, json_msg):
        unpacked = obj_from_json(json_msg)
        requested_lobby_id = int(unpacked['id'])
        requested_lobby_id = int(unpacked['msg']['lobby_id'])
        add_player(self, requested_lobby_id)

    def handleInstanceRequest(self, json_msg):
        # someone wants a new game instance, so tell a game engine to spin one
        # up
        assert len(lobbies) > 0
        engine = lobbies[0].get_game_client()
        assert engine is not None
        engine.sendMessage(format_msg(
            'ws master server requesting new game instance',
            MSG.instance_request
        ))

    def handleChat(self, json_msg):
        self.broadcast_message(json_msg)

    def handleGameUpdate(self, json_msg):
        self.broadcast_message(json_msg)

    def handleTowerRequest(self, json_msg):
        lobby = get_players_lobby(self)
        get_lobby_engine(lobby).sendMessage(utf(json_msg), False)

    def handleTowerUpdate(self, json_msg):
        self.broadcast_message(json_msg)

    def handleLeaveLobby(self, json_msg):
        lobby = get_players_lobby(self)
        if lobby:
            lobby.remove_player(self)
            broadcast_lobby_list()

    def broadcast_message(self, msg):
        """Broadcast a message to rest of the sender's lobby"""
        lobby = get_players_lobby(self)
        for client in lobby.get_all():
            # Don't send to yourself
            if client != self:
                client.sendMessage(utf(msg), False)

    def onClose(self, wasClean, code, reason):
        info("WebSocket connection closed: {0}".format(reason), INFO_ID)
        lobby = get_players_lobby(self)
        if lobby:
            lobby.remove_player(self)
            broadcast_lobby_list()
