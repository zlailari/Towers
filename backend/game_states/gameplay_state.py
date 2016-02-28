from game_states.game_state import GameState
from engine.grid_world import GridWorld
from game_pieces.creep import Creep
from game_pieces.tower import Tower


class GameplayState(GameState):
    """This is the state the game is in during real gameplay,
    and manages all creeps, towers, scores, etc."""

    def __init__(self, level, width, height):
        self.cur_level = None
        self.world = GridWorld(width, height, (0, 0), (width, 0))
        self.all_creeps = []
        self.all_towers = []

        self.set_level(level)

    def update(self, dt, client_info):
        for creep in self.all_creeps:
            creep.update(dt)

        attacksMade = {}
        for tower in self.all_towers:
            attacksMade.update({tower.id : tower.update(dt, self.all_creeps)}) 

        return (self ,attacksMade)

    def set_level(self, level):
        self.cur_level = level

        # should clean this up; 'amount' means amount of creeps
        for _ in range(self.cur_level['amount']):
            creep = Creep(creep_type=self.cur_level['creep_type'])
            self.all_creeps.append(creep)
