from game_state import GameState
from gameplay_state import GameplayState

class MainMenu(GameState):

    def __init__(self):
        print('main menu created.')

    def update(self, client_info):
        if False: # will have real logic later, the idea is to show
            # that you can switch gamestates this way
            return GameplayState()
        else:
            return self
