from modifiers.modifiers import Modifiers
from game_pieces.creep import Creep


# Parent class for all types of modifiers (ie freeze, stun, burning, poison, cursed, etc)
# Each modifier holds the original values of the creep variable that it is modify. Upon the conter for the modifier reaching 0,
# the original value for the creep is restored.
class frozen_modifier (Modifiers):
    def __init__(self, creep):
        self.creep = creep
        self.original_speed = creep.speed
        creep.speed = creep.speed/2
        self.counter = 60
        pass

    # Counter update for the modifier.
    def update(self):

        if(self.counter == 0):
            self.creep.speed = self.original_speed
            self.creep.modifiers.remove(self)
        else:
            self.counter = self.counter-1



