"""This module acts as the server in charge of everything.

The game_loop has a client that connects to this server.

Each player has their web-browser client which connects to this server.

More details are in engin/ws_client.py."""
import asyncio

from engine.util import utf, obj_from_json, info
from multiprocessing import Process
from engine.message_enum import *
from ws_server.gameloop_client_identifier import GAMELOOP_CLIENT_IDENTIFIER
import json
from autobahn.asyncio.websocket import WebSocketServerProtocol, \
    WebSocketServerFactory


# List of connected clients
connected = []

# Reference to the client which is the
# game engine client.
gameloop_client = None
server_loop = None

INFO_ID = 'server'

def format_msg(text, m_type):
    """Format the given string text to JSON for sending over the network."""
    return utf(json.dumps({'text': text, 'type': m_type.name}))

def start_server_process(address="0.0.0.0", port="9000"):
    # start the server running in a new process
    p = Process(target=start_server, args=(address, port))
    p.start()


def start_server(address, port):
    # see http://autobahn.ws/python/websocket/programming.html

    # accept both string and int, since client has to accept int
    if isinstance(port, int):
        port = str(port)

    composite_address = 'ws://' + address + ':' + port
    info("starting websocket server at {}".format(composite_address), INFO_ID)
    factory = WebSocketServerFactory(composite_address)
    factory.protocol = GameServerProtocol

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop = asyncio.get_event_loop()

    global server_loop
    server_loop = loop

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
        connected.append(self)
        if gameloop_client:
            gameloop_client.sendMessage(format_msg(
                'a user has connected', MSG.info), False)
        info("connections: " + str(len(connected)), INFO_ID)
        self.sendMessage(format_msg(
            'you have joined the server.', MSG.info), False)

    def onMessage(self, payload, isBinary):
        assert isBinary is False
        as_string = payload.decode('utf8')
        # info('received raw message: {}'.format(as_string), INFO_ID)
        message = obj_from_json(as_string)
        assert 'type' in message
        m_type = message['type']
        #info('received message (type {}): {}'.format(m_type, as_string), INFO_ID)
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
        else:
            info('warning! server does not handle message with type {}'.format(
                m_type), INFO_ID)

    def handleIdentifier(self, json_msg):
        """Handle identification messages, such as the server
        identification message."""
        unpacked = obj_from_json(json_msg)
        assert 'secret' in unpacked
        if unpacked['secret'] == GAMELOOP_CLIENT_IDENTIFIER:
            global gameloop_client
            gameloop_client = self
            info("game engine client registered", INFO_ID)
        else:
            info('game client authentication failed with bad secret: {}'.format(unpacked['secret']))


    def handleChat(self, json_msg):
        self.broadcast_message(json_msg)

    def handleGameUpdate(self, json_msg):
        self.broadcast_message(json_msg)

    def handleTowerRequest(self, json_msg):
        gameloop_client.sendMessage(utf(json_msg), False)

    def handleTowerUpdate(self, json_msg):
        self.broadcast_message(json_msg)

    def broadcast_message(self, msg):
        assert len(connected) > 0
        for client in connected:
            # Don't send to yourself
            if client == self:
                continue
            client.sendMessage(utf(msg), False)

    def onClose(self, wasClean, code, reason):
        info("WebSocket connection closed: {0}".format(reason), INFO_ID)
        connected.remove(self)
