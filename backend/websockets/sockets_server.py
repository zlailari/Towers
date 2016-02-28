#!/usr/bin/env python3
import asyncio
from autobahn.asyncio.websocket import WebSocketServerProtocol
from autobahn.asyncio.websocket import WebSocketServerFactory


class MyServerProtocol(WebSocketServerProtocol):
    
    def onMessage(self, payload, isBinary):
        as_text = payload.decode('utf8')
        print('got message: ' + as_text)
        self.sendMessage(payload, isBinary)


if __name__ == '__main__':
    
    factory = WebSocketServerFactory()
    factory.protocol = MyServerProtocol
    
    loop = asyncio.get_event_loop()
    coro = loop.create_server(factory, '127.0.0.1', 9000)
    server = loop.run_until_complete(coro)
    
    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
    server.close()
        loop.close()