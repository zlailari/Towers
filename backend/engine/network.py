import ws_server.ws_server as server
import engine.ws_client as client
import time


class Network:

    def __init__(self):
        address = '127.0.0.1'
        port = '9000'
        server.start_server_process(address, port)
        time.sleep(1)
        client.start_client_process(address, port)
        print("websocket server is now running.  Try opening the socket_client.html demo to test it.")

    def receive(self):
        pass

    def send(self, gamestate):
        pass
