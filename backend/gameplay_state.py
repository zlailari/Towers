from game_state import GameState
from creep import Creep
from tower import Tower


class GameplayState(GameState):
    """This is the state the game is in during real gameplay,
    and manages all creeps, towers, scores, etc."""

    def __init__(self):
        self.all_creeps = []
        self.all_towers = []

    def update(self, dt, client_info):
        for creep in self.all_creeps:
            creep.update(dt)
        for tower in self.all_towers:
            tower.update(dt, self.all_creeps)
        return self
