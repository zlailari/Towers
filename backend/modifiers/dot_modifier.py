from modifiers.modifiers import Modifiers
from game_pieces.creep import Creep


# Parent class for all types of modifiers (ie freeze, stun, burning, poison, cursed, etc)
# Each modifier holds the original values of the creep variable that it is modify. Upon the conter for the modifier reaching 0,
# the original value for the creep is restored.
class Dot_modifier (Modifiers):
    def __init__(self, creep, gameState, dotAmount):
        self.creep = creep
        self.gameState = gameState
        self.fireDamage = dotAmount/self.counter
        self.counter = 60
        pass

    # Counter update for the modifier.
    def update(self):

        if(self.counter == 0):
            self.creep.take_damage(self.fireDamage, self.gameState)
            self.creep.modifiers.remove(self)
        else:
            self.counter = self.counter-1
            self.creep.take_damage(self.fireDamage, self.gameState)

