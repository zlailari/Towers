from game_states.game_state import GameState
from engine.grid_world import GridWorld

from game_pieces.creep import Creep
from game_pieces.tower_factory import Tower_factory
from engine.message_enum import MSG  # message type enum

LOCATION_INDEX = 0
PROGRESS_INDEX = 1
X_INDEX = 0
Y_INDEX = 1


class GameplayState(GameState):
    """This is the state the game is in during real gameplay,
    and manages all creeps, towers, scores, etc."""

    def __init__(self, level, width, height, lives, gold, player_id):
        self.cur_level = level
        self.world = GridWorld(width, height, (0, 0), (width - 1, height - 1))
        self.all_creeps = []
        self.all_towers = []
        #self.set_level(level)
        self.lives = 1
        self.gold = gold # starting gold
        self.counter = 0 #when this hits a certain number, the player gets gold payoff based on the number of creeps they've spawned that are alive.
        self.player_id = player_id

    # Calls all update methods within the game and returns dictionaries to be
    # converted to json with the player status (gold lives enemies left) and
    # other stats
    def update(self, dt, client_info):
        self.counter += dt  # the total amount of time that has elapsed

        if(self.counter % 300 == 0):
            self.gold +=self.spawned_creeps/3


        self.all_creeps.extend(self.cur_level.spawnWave(self.counter))

        creepLoc = {}  # Dicitonary of creep locations
        creepProgress = {}  # Dictionary of creep progresses
        attacksMade = []  # Dictionary of attacks made by towers

        # Update all creeps and get location location and movement progress
        bestPath = self.world.tilePaths

        for creep in self.all_creeps:
            cUpdate = creep.update(bestPath, dt, self)
            if cUpdate is not None:
                creepLoc.update(cUpdate[LOCATION_INDEX])
                creepProgress.update(cUpdate[PROGRESS_INDEX])

        # Updates the attacks made by the towers on the creeps
        for tower in self.all_towers:
            # attacksMade.update({tower.id : tower.update(dt, self.all_creeps , self)})
            attacksMade = attacksMade + tower.update(dt, self.all_creeps, self)

        enemies = 0
        for creep in self.all_creeps:
            if creep.live:
                enemies += 1

        effects_json = self.world.process_effects()

        # Dictionary of player stats
        playerState = {
            'lives': self.lives,
            'gold': self.gold,
            'enemiesLeft': enemies,
            'isDead': False if self.lives > 0 else True
        }

        update = {
            'type': MSG.game_update.name,
            'playerState': playerState,
            'creeps': self.all_creeps,
            'attacksMade': attacksMade,
            'effects': effects_json,
            'path': str(bestPath),
            'player_id': self.player_id
        }

        # Updates all effects in the world (decreases their counter by one).
        # Each gridworld holds an effects 2d array that stores a tile_effects
        # object.
        for i in range(0, self.world.width):
            for j in range(0, self.world.height):
                self.world.effects[i][j].update()

        return update

    def set_level(self, level):
        self.cur_level = level

        # should clean this up; 'amount' means amount of creeps
        for _ in range(self.cur_level['amount']):
            creep = Creep(creep_type=self.cur_level['creep_type'])
            self.all_creeps.append(creep)

    # Changed, should only take in coordinates and tower type
    def build_tower(self, coordinates, towerType):
        tower = Tower_factory.factory(
            towerType, coordinates, len(self.all_towers))

        # TODO, send why build_tower failed (money, illegal position, etc)
        if tower.tower_type == "failure":
            print(tower.tower_type)
            return False

        if tower.price > self.gold:
            return False

        if self.creep_in_loc(tower.loc):
            return False

        if not self.world.build_tower(tower.loc[X_INDEX], tower.loc[Y_INDEX]):
            return False
        else:
            self.gold -= tower.price
            self.all_towers.append(tower)
            return tower

    def lose_life(self):
        self.lives -= 60

    def is_dead(self):
        return self.lives <= 0

    # Calls upgrade for towers. Max level depends on the tower, cost per level
    # increases as per tower.
    def upgrade_tower(self, coordinates):
        for tower in self.all_towers:
            if tower.loc == coordinates:
                if tower.upgrade_price < self.gold:
                    self.gold -= tower.upgrade_price
                    return tower.upgrade()

        return False

    def delete_tower(self, coordinates):
        self.all_towers = [t for t in self.all_towers if t.loc != coordinates]
        self.world.remove_tower(coordinates[0], coordinates[1])

    # Assigns an id to spawn creep for pvp use. Hook this up to a button and
    # deal with it.
    def spawn_creep(self, creepType):
        id = len(self.all_creeps)
        self.cur_level.spawnCreep(creepType, id)
        print('Added {} creep'.format(creepType))

    def creep_in_loc(self, loc):
        for cr in self.all_creeps:
            if cr.loc == loc and cr.live:
                return True
        return False

    def apply_mod_loc(self, loc, mod):
        for cr in self.all_creeps:
            if cr.loc == loc and cr.live:
                cr.modify(mod)
