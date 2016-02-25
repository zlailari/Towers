#!/usr/bin/env python3
import time
from creep import Creep
from clock import Clock
from main_menu import MainMenu
from network import Network

# Define our globals
TPS = 30  # ticks per second
TICK_LEN = 1.0 / TPS  # never update more fequently than this interval

game_state = MainMenu()  # when we load up, game_state begins at main_menu
network = Network()


def main():
    clock = Clock(TICK_LEN)
    clock.tick()  # tick once to initialize counter
    while True:
        dt = clock.tick()
        game_loop(dt)


def game_loop(dt):
    global game_state  # pull game_state into scope from global
    print("it's been " + str(dt * 1000) + " ms since last frame")
    client_info = network.receive()
    game_state = game_state.update(dt, client_info)
    network.send(game_state)  # psuedocode, network doesn't exist yet


if __name__ == '__main__':
    # entrance to Python program
    main()
