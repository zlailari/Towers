#!/usr/bin/env python3
import asyncio
import threading
from multiprocessing import Process
from autobahn.asyncio.websocket import WebSocketServerProtocol, \
    WebSocketServerFactory


connected = []

def start_server_threaded():
    p = Process(target=start_server)
    p.start()

def start_server():
    factory = WebSocketServerFactory(u"ws://127.0.0.1:9000", debug=False)
    factory.protocol = MyServerProtocol

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop = asyncio.get_event_loop()
    
    coro = loop.create_server(factory, '0.0.0.0', 9000)
    server = loop.run_until_complete(coro)

    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.close()
        loop.close()


def utf(i):
    return i.encode('utf8')


class MyServerProtocol(WebSocketServerProtocol):

    def onConnect(self, request):
        print("Client connecting: {0}".format(request.peer))

    def onOpen(self):
        connected.append(self)
        print("connections: " + str(len(connected)))
        self.sendMessage(utf("welcome to the club!"), False)

        if len(connected) == 1:
            self.sendMessage(utf("you're the first one here! welcome!"), False)
        elif len(connected) > 1:
            connected[0].sendMessage(
                utf("hey, first guy! someone else connected!"), False)

    def onMessage(self, payload, isBinary):
        if isBinary:
            print("Binary message received: {0} bytes".format(len(payload)))
        else:
            print("Text message received: {0}".format(payload.decode('utf8')))

        # echo back message verbatim
        self.sendMessage(payload, isBinary)

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {0}".format(reason))


if __name__ == '__main__':
    start_server()
