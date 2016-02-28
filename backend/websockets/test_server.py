#!/usr/bin/env python3
"""This file acts as the main entrance point to the server."""
import time
from game_pieces.creep import Creep
from engine.clock import Clock
from game_states.main_menu import MainMenu
from game_states.gameplay_state import GameplayState
from engine.network import Network
import game_pieces.levels
import asyncio
from autobahn.asyncio.websocket import WebSocketServerProtocol
from autobahn.asyncio.websocket import WebSocketServerFactory
from game_pieces.tower import Tower

# Define our globals
TPS = 30  # ticks per second
TICK_LEN = 1.0 / TPS  # never update more fequently than this interval
WORLD_WIDTH = 20
WORLD_HEIGHT = 20

game_state = GameplayState(game_pieces.levels.level_one, WORLD_WIDTH, WORLD_HEIGHT)
#game_state = MainMenu()

def main():
    clock = Clock(TICK_LEN)
    clock.tick()  # tick once to initialize counter
    
    try:
        while True:
            dt = clock.tick()
            game_loop(dt)
    except KeyboardInterrupt:
        pass
    finally:
        # do any cleanup you want to do here
        pass


def game_loop(dt):
    """This is the main game loop for the entire server.
        Every tick of this loop will progress the game state by
        some amount.  argument dt is the delta time since the last tick."""
    
    global game_state  # pull game_state into scope from global
    print("it's been " + str(dt * 1000) + " ms since last frame")
    client_info = network.receive()
    game_state = game_state.update(dt, client_info)
    network.send(game_state)  # psuedocode, network doesn't exist yet


if __name__ == '__main__':
    # entrance to Python program

    game_state.all_towers.append(Tower((0,0),100,1,0,0));
    game_state.all_creeps.append(Creep((0,0),None,20,20,0));
    print(len(game_state.all_towers));
    network = Network(game_state) #Define a network for every game (split off into different threads)


#    main()
#   not used for testing
