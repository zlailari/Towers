"""This file acts as the main entrance point to the server."""
import threading
from game_pieces.creep import Creep
from engine.clock import Clock
# from game_states.main_menu import MainMenu
# from game_states.gameplay_state import GameplayState
from engine.network import Network
from game_pieces.levels import Levels
from game_states.gameplay_state import GameplayState
from game_pieces.tower import Tower
from engine.message_enum import MSG
from engine.util import info

# Define our globals
TPS = 30  # ticks per second
TICK_LEN = 1.0 / TPS  # never update more fequently than this interval
WORLD_WIDTH = 16
WORLD_HEIGHT = 12

INFO_ID = 'game engine'


class GameRunner:
    """This class runs the ENTIRE game backend, from the websocket server
    to the game engine loop to the websocket client that connects the
    game engine loop to the server."""

    def __init__(self, print_gametick=False, print_on_receive=False, create_server=True):

        #self.level_creeps_spawn_timers = [1,2,3,4,5]
        #self.spawnCreeps = []

        # for i in range(0, 5):
        #    self.spawnCreeps.append(Creep.factory("Default",i))

        # game_state = MainMenu()

        self.network = Network(create_server)
        self.print_gametick = print_gametick
        self.print_on_receive = print_on_receive

        self.game_states = []
        self.player_states = {}

    def add_player(self, player_id):
        """Add a player to the game by giving them their own state."""

        self.level_creeps_spawn_timers = [5]
        self.spawnCreeps = [Creep.factory("Default", 0)]
        initialSpawn = 0

        # 3 sets of spawns
        # Separated by initialSpawn time.
        for _ in range(0, 5):
            self.level_creeps_spawn_timers.append(initialSpawn)
            initialSpawn += 0.3

        initialSpawn += 3

        for _ in range(0, 10):
            self.level_creeps_spawn_timers.append(initialSpawn)
            initialSpawn += 0.3

        initialSpawn += 3

        for _ in range(0, 15):
            self.level_creeps_spawn_timers.append(initialSpawn)
            initialSpawn += 0.3

        for i in range(0, 30):
            self.spawnCreeps.append(Creep.factory("Default", i))

        levels = Levels(self.level_creeps_spawn_timers, self.spawnCreeps)
        state = GameplayState(levels, WORLD_WIDTH,
                              WORLD_HEIGHT, 100, 100, player_id)
        state.build_tower(Tower((8, 8), 1, 1, 1, 0))

        self.game_states.append(state)
        self.player_states[player_id] = state
        print('added player, and state for player {}'.format(player_id))

    def run(self):
        # wait until a request comes in to start the game, then start the game
        while True:
            message = self.network.receive()
            if message:
                print('game received message: {}'.format(message))
            if message and message['type'] == MSG.game_start_request.name:
                self.start_game()
                break
            elif message and message['type'] == MSG.instance_request.name:
                self.spawn_new_game()
            elif message and message['type'] == MSG.game_add_player.name:
                player_id = message['player_id']
                self.add_player(player_id)

    def spawn_new_game(self):
        print('spawning new game instance')
        new_game = GameRunner(create_server=False)
        t = threading.Thread(target=new_game.run)
        t.daemon = True
        t.start()

    def start_game(self):
        print('starting game.')
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
        if msg['type'] == MSG.instance_request.name:
            self.spawn_new_game()
        elif msg['type'] == MSG.game_add_player.name:
            player_id = msg['player_id']
            self.add_player(player_id)
        elif msg['type'] == MSG.tower_request.name:
            # Make a new tower TODO, don't hardcode stuff
            player_id = msg['player_id']
            state = self.player_states[player_id]
            tower = Tower(
                (msg['msg']['x'], msg['msg']['y']),
                1000,
                1,
                3,
                len(state.all_towers),
                msg['msg']['towerID']
            )
            success = state.build_tower(tower)
            towerUpdate = None
            if success:
                towerUpdate = {
                    'type': 'tower_update',
                    'towerAccepted': 'true',
                    'tower': tower,
                    'player_id': player_id
                }
            else:
                towerUpdate = {
                    'type': 'tower_update',
                    'towerAccepted': 'false',
                    'reason': 'TODO',
                    'player_id': player_id
                }
            self.network.send_message(towerUpdate)

    def game_loop(self, dt):
        # Receive and process messages from clients
        message = self.network.receive()
        if message:
            self.process_message(message)

        # Update game 1 tick and pass to clients
        for player in self.player_states:
            state = self.player_states[player]
            data = state.update(dt, [])
            self.network.send_message(data)

        # if self.print_gametick:
        #     print("it's been " + str(dt * 1000) + " ms since last frame")

        # message = self.network.receive()
        # if message is not False and self.print_on_receive:
        #     print("gameloop got message: {}".format(message))
