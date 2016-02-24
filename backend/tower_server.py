#!/usr/bin/env python3
import time
from creep import creep

# globally store last frame time
last_time = 0

FPS = 60
min_dt = 1.0/FPS # never update more fequently than this interval

def main():
    global last_time # brings last_time into scope

    while True:
        current_time = time.time()
        dt = current_time - last_time
        last_time = current_time
    
        if dt < min_dt:
            time.sleep(min_dt - dt)

        game_loop(dt)

def game_loop(dt):
    # this is the game's loop
    print("it's been " + str(dt * 1000) + " since last frame")
    enemy = creep(10, (0,0), 100)
    print(str(enemy))

def start_game():
    pass

if __name__ == '__main__':
    # entrance to Python program
    main()
