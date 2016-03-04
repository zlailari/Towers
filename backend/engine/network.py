"""This should be the only class that the gameloop cares about
when it comes to running the network.

This class spins up a process for the websocket server,
and for the gameloop's client which talks to the server.

The client and server process run in the background, and this
class acts as the interface to them, so that the gameloop
doesn't need to care about how they work or what they do."""
import ws_server.ws_server as server
import engine.ws_client as client
import time


class Network:

    def __init__(self):
        address = '127.0.0.1'
        port = '9000'
        server.start_server_process(address, port)

        # probably not necessary, but can't hurt
        time.sleep(1)
        client.start_client_process(address, port)
        print("websocket server is now running.  Try opening the socket_client.html demo to test it.")

        time.sleep(5)
        client_protocol = client.get_client_protocol()

    def receive(self):
        pass

    def send(self, gamestate):
        pass
