from game_states.game_state import GameState
from game_states.gameplay_state import GameplayState


class MainMenu(GameState):

    def __init__(self):
        print('main menu created.')

    def update(self, dt, client_info):
        if False:  # will have real logic later, the idea is to show
            # that you can switch gamestates this way
            return GameplayState()
        else:
            return self
