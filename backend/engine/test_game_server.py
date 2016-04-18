"""This file acts as the main entrance point to the server."""
from game_pieces.creep import Creep
from engine.clock import Clock
# from game_states.main_menu import MainMenu
# from game_states.gameplay_state import GameplayState
from engine.network import Network
from game_pieces.levels import Levels
from game_states.gameplay_state import GameplayState
from game_pieces.tower import Tower
from engine.message_enum import MSG

# Define our globals
TPS = 30  # ticks per second
TICK_LEN = 1.0 / TPS  # never update more fequently than this interval
WORLD_WIDTH = 16
WORLD_HEIGHT = 12


class GameRunner:
    """This class runs the ENTIRE game backend, from the websocket server
    to the game engine loop to the websocket client that connects the
    game engine loop to the server."""

    def __init__(self, print_gametick=False, print_on_receive=False):

        #self.level_creeps_spawn_timers = [1,2,3,4,5]
        #self.spawnCreeps = []

        # for i in range(0, 5):
        #    self.spawnCreeps.append(Creep.factory("Default",i))

        # game_state = MainMenu()

        self.network = Network()
        self.print_gametick = print_gametick
        self.print_on_receive = print_on_receive

        self.level_creeps_spawn_timers = [5]
        self.spawnCreeps = [Creep.factory("Default", 0)]
        initialSpawn = 0

        # 3 sets of spawns
        # Separated by initialSpawn time.
      #  for _ in range(0, 5):
      #      self.level_creeps_spawn_timers.append(initialSpawn)
      #      initialSpawn += 0.3

      #  initialSpawn += 3

      #  for _ in range(0, 10):
      #      self.level_creeps_spawn_timers.append(initialSpawn)
      #      initialSpawn += 0.3

      #  initialSpawn += 3

      #  for _ in range(0, 15):
      #      self.level_creeps_spawn_timers.append(initialSpawn)
      #      initialSpawn += 0.3

      #  for i in range(0, 30):
      #      self.spawnCreeps.append(Creep.factory("Default", i))

        levels = Levels(self.level_creeps_spawn_timers, self.spawnCreeps)
        self.game_state = GameplayState(
            levels, WORLD_WIDTH, WORLD_HEIGHT, 100, 100)
        self.game_state.build_tower(Tower((8, 8), 1, 1, 1, 0))

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

    def process_message(self, msg):
        if msg['type'] == MSG.tower_request.name:
            # Make a new tower TODO, don't hardcode stuff
            tower = Tower(
                (msg['msg']['x'], msg['msg']['y']),
                1000,
                1,
                3,
                len(self.game_state.all_towers),
                msg['msg']['towerID']
            )
            success = self.game_state.build_tower(tower)
            if success:
                towerUpdate = {
                    'type': 'tower_update',
                    'towerAccepted': 'true',
                    'tower': tower
                }
                self.network.send_message(towerUpdate)
            else:
                # TODO, tell client request failed and why
                pass

    def game_loop(self, dt):
        # Receive and process messages from clients
        message = self.network.receive()
        if message:
            self.process_message(message)

        # Update game 1 tick and pass to clients
        tupleReturned = self.game_state.update(dt, [])

        # tupleReturned is: playerState, creepLoc, creepProgress, attacksMade
        self.network.send_message(tupleReturned)

        # if self.print_gametick:
        #     print("it's been " + str(dt * 1000) + " ms since last frame")

        # message = self.network.receive()
        # if message is not False and self.print_on_receive:
        #     print("gameloop got message: {}".format(message))
