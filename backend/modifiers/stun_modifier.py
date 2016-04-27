from modifiers.modifiers import Modifiers
from game_pieces.creep import Creep


# Parent class for all types of modifiers (ie freeze, stun, burning, poison, cursed, etc)
# Each modifier holds the original values of the creep variable that it is modify. Upon the conter for the modifier reaching 0,
# the original value for the creep is restored.
class Stun_modifier (Modifiers):
    def __init__(self, id, gamestate):
        #self.creep = creep

        self.original_speed = gamestate.all_creeps[id].base_speed
        gamestate.all_creeps[id].speed = 0
        self.counter = 60
        pass

    # Counter update for the modifier. Reverts base speed back from 0 after counter hits 0
    def update(self, id, gamestate):

        if(self.counter == 0):
            gamestate.all_creeps[id].speed = gamestate.all_creeps[id].base_speed
            self.counter = self.counter-1
        elif(self.counter >0):
            self.counter = self.counter-1
            gamestate.all_creeps[id].speed = 0
        else:
            self.counter = self.counter-1
        pass

