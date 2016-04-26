from modifiers.stun_modifier import *

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

    def update(self):
        self.counter = self.counter-1
        return self

    def on_move(self, creep, state):
        creep.take_damage(self.damage, state)
        return self

class stun(effects):
    def init(self, damage, counter=15):
        self.counter = counter
        self.damage = damage

    def update(self):
        self.counter = self.counter-1
        return self

    def on_move(self, creep, state):
        creep.take_damage(self.damage, state)
        creep.modify(Stun_modifier(creep))