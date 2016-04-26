from modifiers.modifiers import Modifiers
from game_pieces.creep import Creep
#from game_states.gameplay_state import GameplayState


# Parent class for all types of modifiers (ie freeze, stun, burning, poison, cursed, etc)
# Each modifier holds the original values of the creep variable that it is modify. Upon the counter for the modifier reaching 0,
# the original value for the creep is restored.
class Frozen_modifier (Modifiers):
    def __init__(self, id, gamestate):
        #self.creep = creep

        self.original_speed = gamestate.all_creeps[id].base_speed
        gamestate.all_creeps[id].speed = self.original_speed/20
        self.counter = 30
        pass

    # Counter update for the modifier.
    def update(self, id, gamestate):

        if(self.counter == 0):
            gamestate.all_creeps[id].speed = gamestate.all_creeps[id].base_speed
            self.counter = self.counter-1
        elif(self.counter >0):
            self.counter = self.counter-1
            gamestate.all_creeps[id].speed = self.original_speed/20
        else:
            self.counter = self.counter-1
        pass


