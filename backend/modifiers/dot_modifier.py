from modifiers.modifiers import Modifiers
from game_pieces.creep import Creep


# Parent class for all types of modifiers (ie freeze, stun, burning, poison, cursed, etc)
# Each modifier holds the original values of the creep variable that it is modify. Upon the conter for the modifier reaching 0,
# the original value for the creep is restored.
class Dot_modifier (Modifiers):
    def __init__(self, id, gamestate, dotAmount):

        self.counter = 90
        self.creep_id = id
        self.poison = dotAmount/self.counter

        pass

    # Counter update for the modifier.
    def update(self, id, gamestate):

        if(self.counter == 0):
            gamestate.all_creeps[id].take_damage(self.fireDamage, gamestate)
        elif(self.counter >0):
            self.counter = self.counter-1
            gamestate.all_creeps[id].take_damage(self.poison, gamestate)

        else:
            self.counter = self.counter-1

