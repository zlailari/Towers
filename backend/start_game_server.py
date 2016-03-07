#!/usr/bin/env python3
from engine.tower_server import GameRunner
import sys

args = sys.argv

print_gametick = True if 'print_gametick' in args else False
print_on_receive = True if 'print_on_receive' in args else False

if '-h' in args or 'help' in args:
    print("currently available options:")
    print("\tprint_gametick: print a message upon each tick of the gameloop.")
    print("\tprint_on_receive: print to terminal every time a message is received from the network to the gameloop.")
    quit()

game_runner = GameRunner(print_gametick=print_gametick, print_on_receive=print_on_receive)
game_runner.run()
