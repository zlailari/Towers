class GameState:
    """This class will be the base abstract class for all the possible states
    the game can be in.  A Game_State's most important methos is update(), which
    each subclass will implement.  Every game tick, the game state's update will
    be called. For example, the game state during active gameplay will update all
    the positions/damage/etc of creeps.  The game state during the main menu will
    wait for commands to go to other game states, like "settings" or "start game"."""

    def update(self, client_info):
        # subclass game states MUST implement this, so throw exception
        # if they don't
        raise NotImplementedError
