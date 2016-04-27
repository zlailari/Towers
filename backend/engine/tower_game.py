"""This file acts as the main entrance point to the server."""
import threading
from engine.clock import Clock
# from game_states.main_menu import MainMenu
# from game_states.gameplay_state import GameplayState
from engine.network import Network
from game_pieces.levels import Levels
from game_states.gameplay_state import GameplayState
from engine.message_enum import MSG

# Define our globals
TPS = 30  # ticks per second
TICK_LEN = 1.0 / TPS  # never update more fequently than this interval
WORLD_WIDTH = 16
WORLD_HEIGHT = 12

INFO_ID = 'game engine'
creep_costs = {'Default':15, 'Fast':30, 'Slow':100}


class GameRunner:
    """This class runs the ENTIRE game backend, from the websocket server
    to the game engine loop to the websocket client that connects the
    game engine loop to the server."""

    def __init__(self, print_gametick=False, print_on_receive=False, create_server=True):
        self.network = Network(create_server)
        self.print_gametick = print_gametick
        self.print_on_receive = print_on_receive
        self.game_states = []
        self.player_states = {}

    def add_player(self, player_id):
        """Add a player to the game by giving them their own state."""

        levels = Levels.createLevel(5, 0.5, 10, 5, 3, "Default")
        state = GameplayState(levels, WORLD_WIDTH,
                              WORLD_HEIGHT, 100, 10000, player_id)

        self.game_states.append(state)
        self.player_states[player_id] = state
        print('added player, and state for player {}'.format(player_id))

    def remove_player(self, player_id):
        if player_id in self.player_states:
            state = self.player_states[player_id]
            del self.player_states[player_id]
            self.game_states.remove(state)
            print('removing player and state for player {}'.format(player_id))

        for i in range(0, 30):
            self.spawnCreeps.append(Creep.factory("Default", i))

        levels = Levels(self.level_creeps_spawn_timers, self.spawnCreeps)
        state = GameplayState(levels, WORLD_WIDTH,
                              WORLD_HEIGHT, 100, 100, player_id)

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
            elif message and message['type'] == MSG.game_remove_player.name:
                player_id = message['player_id']
                self.remove_player(player_id)

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
        if msg['type'] == MSG.tower_request.name:
            player_id = msg['player_id']
            state = self.player_states[player_id]
            x, y = msg['msg']['x'], msg['msg']['y']
            if msg['msg']['towerID'] == 'delete_tower':
                # request to delete a tower that's already present
                state.delete_tower((x, y))
                self.network.send_message(
                    {
                        'type': 'tower_update',
                        'towerDeleted': True,
                        'x': x,
                        'y': y,
                        'player_id': player_id
                    }
                )
            elif msg['msg']['towerID'] == 'upgrade_tower':
                tower_upgraded = state.upgrade_tower((x,y))
                self.network.send_message(
                    {
                        'type': 'tower_update',
                        'towerUpgraded': tower_upgraded,
                        'x': x,
                        'y': y,
                        'player_id': player_id
                    }
                )

            else:
                tower = state.build_tower((x, y), msg['msg']['towerID'])
                towerUpdate = None
                if tower:
                    towerUpdate = {
                        'type': 'tower_update',
                        'towerAccepted': True,
                        'tower': tower,
                        'player_id': player_id
                    }
                else:
                    towerUpdate = {
                        'type': 'tower_update',
                        'towerAccepted': False,
                        'reason': 'TODO',
                        'player_id': player_id
                    }
                self.network.send_message(towerUpdate)
        elif msg['type'] == MSG.instance_request.name:
            self.spawn_new_game()
        elif msg['type'] == MSG.game_add_player.name:
            player_id = msg['player_id']
            self.add_player(player_id)
        elif msg['type'] == MSG.game_remove_player.name:
            player_id = msg['player_id']
            self.remove_player(player_id)
        elif msg['type'] == MSG.creep_request.name:
            player_id = msg['player_id']
            creep_type = msg['msg']['creepID']

            if((self.player_states[player_id].gold)>= creep_costs[creep_type]):
                for player in self.player_states:
                    if player != player_id:
                        state = self.player_states[player]
                        state.spawn_creep(creep_type)
                        self.player_states[player_id].spawned_creeps +=1
                        self.player_states[player_id].gold=self.player_states[player_id].gold-creep_costs[creep_type]


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
