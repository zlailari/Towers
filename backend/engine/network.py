"""This should be the only class that the gameloop cares about
when it comes to running the network.

This class spins up a process for the websocket server,
and for the gameloop's client which talks to the server.

The client and server process run in the background, and this
class acts as the interface to them, so that the gameloop
doesn't need to care about how they work or what they do."""
from ws_server import ws_server as server
from ws_server.gameloop_client_identifier import GAMELOOP_CLIENT_IDENTIFIER
import engine.ws_client as client
import time
from engine.util import utf


class Network:

    def __init__(self):
        address = '127.0.0.1'
        port = '9000'

        # start the websocket server running on a different process
        server.start_server_process(address, port)

        # sleeping probably not necessary, but can't hurt
        time.sleep(1)

        # set the gameloops client running on a different thread.
        client.start_client_thread(address, port)

        time.sleep(3)

        # this is the main handle for communicating with the server.
        # this Network class will abstract it into accessible methods like
        # send(), receive(), etc
        self.client_protocol = client.get_client_protocol()
        assert self.client_protocol is not None

        # identify this client as the gameloop server
        self.send_message(GAMELOOP_CLIENT_IDENTIFIER)

    def receive(self):
        pass

    def send(self, gamestate):
        pass

    def send_message(self, message):
        self.client_protocol.sendMessage(utf(message), isBinary=False)
