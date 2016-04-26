# Parent class for all types of modifiers (ie freeze, stun, burning, poison, cursed, etc)
# Each modifier holds the original values of the creep variable that it is modify. Upon the conter for the modifier reaching 0,
# the original value for the creep is restored.
class Modifiers ():
    def __init__(self, creep):
        self.creep = creep
        pass

    def update(self):
        pass