#!/usr/bin/env python3
import time
from creep import Creep
from clock import Clock
from main_menu import Main_Menu

# Define our globals
TPS = 30  # ticks per second
TICK_LEN = 1.0 / TPS  # never update more fequently than this interval

game_state = Main_Menu()  # when we load up, game_state begins at main_menu


def main():
    clock = Clock(TICK_LEN)

    while True:
        dt = clock.tick()
        game_loop(dt)


def game_loop(dt):
    # this is the game's loop

    print("it's been " + str(dt * 1000) + " since last frame")

    game_state.update()
    # network.send(game_state) # psuedocode, network doesn't exist yet


if __name__ == '__main__':
    # entrance to Python program
    main()
