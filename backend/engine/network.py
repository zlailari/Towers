import ws_server.ws_server as server

class Network:

    def __init__(self):
        server.start_server_threaded()
        print("websocket server is now running.  Try opening the socket_client.html demo to test it.")

    def receive(self):
        pass

    def send(self, gamestate):
        pass
