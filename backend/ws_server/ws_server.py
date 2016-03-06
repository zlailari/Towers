"""This module acts as the server in charge of everything.

The game_loop has a client that connects to this server.

Each player has their web-browser client which connects to this server.

More details are in engin/ws_client.py."""
import asyncio
from engine.util import utf
from multiprocessing import Process
from ws_server.gameloop_client_identifier import GAMELOOP_CLIENT_IDENTIFIER
from autobahn.asyncio.websocket import WebSocketServerProtocol, \
    WebSocketServerFactory


connected = []

# this will refer to the connection
# to the gameloop client, which will have
# special priviledges and behave differently
# from regular player clients
gameloop_client = None


def get_server_loop():
    assert server_loop is not None
    return server_loop


def start_server_process(address="127.0.0.1", port="9000"):
    # start the server running in a new process
    p = Process(target=start_server, args=(address, port))
    p.start()


def start_server(address, port):
    # see http://autobahn.ws/python/websocket/programming.html

    # accept both string and int, since client has to accept int
    if isinstance(port, int):
        port = str(port)

    composite_address = 'ws://' + address + ':' + port
    print("starting websocket server at {}".format(composite_address))
    factory = WebSocketServerFactory(composite_address, debug=False)
    factory.protocol = MyServerProtocol

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
        pass
    finally:
        server.close()
        loop.close()


class MyServerProtocol(WebSocketServerProtocol):

    def onConnect(self, request):
        # onConnect happens before onOpen().  It isn't as useful
        # because onConnect() happens before the connection has succeeded.
        # if you want to do something when a client connects, you probably
        # want to do it in onOpne().  This is more like "onAttempt()".
        print("Client connecting: {0}".format(request.peer))

    def onOpen(self):
        connected.append(self)
        if gameloop_client is not None:
            gameloop_client.sendMessage(utf("player connected!"), False)
        print("connections: " + str(len(connected)))
        self.sendMessage(utf("welcome to the club!"), False)

        if len(connected) == 1:
            self.sendMessage(utf("you're the first one here! welcome!"), False)
        elif len(connected) > 1:
            connected[0].sendMessage(
                utf("hey, first guy! someone else connected!"), False)

    def onMessage(self, payload, isBinary):
        # for now, only send text messages, no binary yes
        assert isBinary == False
        if isBinary:
            # but keep this check in for future reference
            print("Binary message received: {0} bytes".format(len(payload)))
        else:
            print("Text message received: {0}".format(payload.decode('utf8')))

        as_string = payload.decode('utf8')
        if as_string == GAMELOOP_CLIENT_IDENTIFIER:
            gameloop_client = self
            print("game engine client regisetered!!")

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {0}".format(reason))
