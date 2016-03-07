"""This file acts as the main entrance point to the server."""
import time
from game_pieces.creep import Creep
from engine.clock import Clock
# from game_states.main_menu import MainMenu
# from game_states.gameplay_state import GameplayState
from engine.network import Network
import game_pieces.levels

# Define our globals
TPS = 30  # ticks per second
TICK_LEN = 1.0 / TPS  # never update more fequently than this interval
WORLD_WIDTH = 20
WORLD_HEIGHT = 20


class GameRunner:
    """This class runs the ENTIRE game backend, from the websocket server
    to the game engine loop to the websocket client that connects the
    game engine loop to the server."""

    def __init__(self, print_gametick=False, print_on_receive=False):
        # game_state = GameplayState(levels.level_one, WORLD_WIDTH, WORLD_HEIGHT)
        # game_state = MainMenu()
        self.network = Network()
        self.print_gametick = print_gametick
        self.print_on_receive = print_on_receive

    def run(self):
        """Run this game, along with all its network requirements, like the websocket server.
        Runs in a blocking infinite loop."""
        clock = Clock(TICK_LEN)
        clock.tick()  # tick once to initialize counter

        try:
            while True:
                dt = clock.tick()
                self.game_loop(dt)
        except KeyboardInterrupt:
            pass
        finally:
            # do any cleanup you want to do here
            pass

    def game_loop(self, dt):
        """This is the main game loop for the entire server.
        Every tick of this loop will progress the game state by
        some amount.  argument dt is the delta time since the last tick."""

        # global game_state  # pull game_state into scope from global
        if self.print_gametick:
            print("it's been " + str(dt * 1000) + " ms since last frame")
        # game_state = game_state.update(dt, client_info)
        # network.send(game_state)  # psuedocode, network doesn't exist yet

        message = self.network.receive()
        if message is not False and self.print_on_receive:
            print("gameloop got message: {}".format(message))
