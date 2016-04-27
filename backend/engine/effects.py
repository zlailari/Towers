from modifiers.stun_modifier import Stun_modifier

#This class is stores all the effects in the game.
# Tile_effects.py holds an array that stores multiple effects (there can be more than 1 effect on a tile at a given time.
class effects ():
    def __init__(self):
        pass

#fire sublcass. Contains a counter that decrements when update is called.
class fire(effects):
    def __init__(self, damage, counter=60):
        self.counter = counter;
        self.damage = damage;
        self.type = 'fire';

    def update(self):
        self.counter = self.counter-1
        return self

    def on_move(self, creep, state):
        creep.take_damage(self.damage, state)
        return self

class stun(effects):
    def __init__(self, damage, counter=30):
        self.counter = counter
        self.damage = damage
        self.type = 'stun';

    def update(self):
        self.counter = self.counter-1
        return self

    def on_move(self, creep, state):
        creep.modify(Stun_modifier(creep))