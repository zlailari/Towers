#!/usr/bin/env python3
import time
from creep import Creep
from clock import Clock

TPS = 30 # ticks per second
tick_len = 1.0/TPS # never update more fequently than this interval

def main():
    clock = Clock(tick_len)    

    while True:
        dt = clock.tick()
        game_loop(dt)

def game_loop(dt):
    # this is the game's loop
    print("it's been " + str(dt * 1000) + " since last frame")
    # enemy = Creep(10, (0,0), 100)
    # print(str(enemy))

def start_game():
    pass

if __name__ == '__main__':
    # entrance to Python program
    main()
