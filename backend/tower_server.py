#!/usr/bin/env python3
"""This file acts as the main entrance point to the server."""
import time
from creep import Creep
from clock import Clock
from main_menu import MainMenu
from gameplay_state import GameplayState
from network import Network
import levels

# Define our globals
TPS = 30  # ticks per second
TICK_LEN = 1.0 / TPS  # never update more fequently than this interval
WORLD_WIDTH = 20
WORLD_HEIGHT = 20

# game_state = GameplayState(levels.level_one, WORLD_WIDTH, WORLD_HEIGHT)
game_state = MainMenu
network = Network()


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
    main()
