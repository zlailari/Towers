from game_states.game_state import GameState
from engine.grid_world import GridWorld
from game_pieces.creep import Creep
from game_pieces.tower import Tower

LOCATION_INDEX = 0;
PROGRESS_INDEX = 1;
X_INDEX = 0
Y_INDEX = 1

class GameplayState(GameState):
    """This is the state the game is in during real gameplay,
    and manages all creeps, towers, scores, etc."""




    def __init__(self, level, width, height, lives, gold):
        self.cur_level = level
        self.world = GridWorld(width, height, (0, 0), (width-1, height-1))
        self.all_creeps = []
        self.all_towers = []
        #self.set_level(level)
        self.lives = lives;
        self.gold = gold; # starting gold
        self.counter = 0;

        #bill.kill(yanming);


    # Calls all update methods within the game and returns dictionaries to be converted to json with the player status (gold lives enemies left) and other stats
    def update(self, dt, client_info):
        self.counter+= dt; #the total amount of time that has elapsed

        self.all_creeps.extend(self.cur_level.spawnWave(self.counter))

        creepLoc = {} # Dicitonary of creep locations
        creepProgress = {} # Dictionary of creep progresses
        attacksMade = {} # Dictionary of attacks made by towers

        #Update all creeps and get location location and movement progress
        bestPath = self.world.get_path(self.world.grid);

        for creep in self.all_creeps:
            cUpdate = creep.update(bestPath, dt)
            creepLoc.update(cUpdate[LOCATION_INDEX])
            creepProgress.update(cUpdate[PROGRESS_INDEX])

        #Updates the attacks made by the towers on the creeps
        for tower in self.all_towers:
            attacksMade.update({tower.id : tower.update(dt, self.all_creeps)})

        #Dictionary of player stats
        playerState = {
            'lives' : self.lives,
            'gold' : self.gold,
            'enemiesLeft' : len(self.all_creeps)
        }

        return playerState, creepLoc, creepProgress, attacksMade # Giant tuple of jsons

    def set_level(self, level):
        self.cur_level = level

        # should clean this up; 'amount' means amount of creeps
        for _ in range(self.cur_level['amount']):
            creep = Creep(creep_type=self.cur_level['creep_type'])
            self.all_creeps.append(creep)

    def build_tower(self, tower):
        #rocket science
        if self.world.build_tower(tower.loc[X_INDEX], tower.loc[Y_INDEX]):
            self.all_towers.append(tower)
