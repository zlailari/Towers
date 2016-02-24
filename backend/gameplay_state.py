from game_state import GameState
from creep import Creep


class GameplayState(GameState):

    def __init__(self):
        self.all_creeps = []

    def update(self, client_info):
        return self
