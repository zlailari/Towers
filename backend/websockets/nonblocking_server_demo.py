#!/usr/bin/env python3
import asyncio
from autobahn.asyncio.websocket import WebSocketServerProtocol
from autobahn.asyncio.websocket import WebSocketServerFactory

UPDATE_INTERVAL = 0.1 # how long (in seconds) to wait before updateing info

class GameServerFactory(WebSocketServerFactory):

    def __init__(self, url):
        WebSocketServerFactory.__init__(self, url)

    def set_gamestate(gamestate):
        self.gamestate = gamestate

    def onMessage(self, payload, isBinary):
        as_text = payload.decode('utf8')
        print('got message: ' + as_text)
        self.sendMessage(payload, isBinary)

async def say_slow():
    print("slow!!")
    # "await" keyword gives up processing time
    # to other async methods
    # so while this await sleep is happening,
    # other funcitons (like say_fas()) are free to run
    await asyncio.sleep(5)

    # recursively calling function seems kind of ugly,
    # but apparently this is how Python 3.5 likes to repeat async
    # methods?
    await say_slow()

async def say_fast():
    print("fast!!")
    await asyncio.sleep(1)
    await say_fast()

async def receive_updates_from_game():
    print("")
    await asyncio.sleep(UPDATE_INTERVAL)
    await receive_updates_from_game()

if __name__ == '__main__':
    # this part is just like before
    #factory = WebSocketServerFactory()
    #factory.protocol = MyServerProtocol

    game_factory = GameServerFactory(u"ws://127.0.0.1:9000")

    loop = asyncio.get_event_loop()
    coro = loop.create_server(game_factory, port=9000)

    # here, however, we make a list of async future tasks
    # which the loop will run concurrently
    tasks = [
            asyncio.ensure_future(say_slow()),
            asyncio.ensure_future(say_fast()),
            asyncio.ensure_future(coro)
            ]
    loop.run_until_complete(asyncio.wait(tasks))
    # loop.run_forever()
