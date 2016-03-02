import asyncio
from autobahn.asyncio.websocket import WebSocketServerProtocol
from autobahn.asyncio.websocket import WebSocketServerFactory
import json


class Network(WebSocketServerProtocol):
    """Currently a mock class that will be implemented later."""

    def onMessage(self, payload, isBinary):
        as_text = payload.decode('utf8')
        print('got message: ' + as_text)

        #self.sendMessage(payload, isBinary)
    def __init__(self, game_state):
        # call super method first!!!
        self.game_state = game_state  # network needs to know what game it is attached to

        factory = WebSocketServerFactory()
        factory.protocol = Network

        loop = asyncio.get_event_loop()
        coro = loop.create_server(factory, '127.0.0.1', 9000)
        server = loop.run_until_complete(coro)

        client_info = []
        gameDelta = game_state.update(5, client_info)
        attacksMade = gameDelta[1]
        gameState = gameDelta[0]
        payload = json.dumps(attacksMade, ensure_ascii=False).encode('utf8')
        print(payload)
        self.sendMessage(payload, isBinary=False)

        try:
            loop.run_forever()
        except KeyboardInterrupt:
            pass
        finally:
            server.close()
            loop.close()

    def send(self, game_state):
        """Send game_state info over network to clients."""
        pass

    def receive(self):
        """Receive latest game_state info from clients."""
        return []
