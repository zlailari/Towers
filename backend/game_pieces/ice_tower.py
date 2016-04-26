from game_pieces.tower import Tower
import engine.util
from shots.shot import shot
from shots.fire import fire
from shots.laser import laser
from modifiers.frozen_modifier import Frozen_modifier
import json

# ice_tower is a subclass of tower. It fires a frozen shot at a creep that slows its speed by half.
class Ice_tower (Tower):
    def __init__(self,id, loc):
        # TODO, make tower_type control other values

        self.loc = loc
        self.health = 25 #?
        self.cooldown = 1
        self.fire_range = 2
        self.id = id; # we need the towers to know where they are in the array of towers.
        self.tower_type = "ice_tower"

        self.price = 30
        self.upgrade_price = 10
        self.damage = 10
        self.time_since_last_fire = 0
        self.upgrade_level = 0
        self.max_upgrade_level = 3

        pass

    #Override for firing ice at a creep
    def update(self, dt, living_creeps, gameState):
        self.time_since_last_fire += dt
        myAttacks = [];

        x2, y2 = self.get_position()
        for creep in living_creeps:
                if creep.live:
                    x1, y1 = creep.loc[0] , creep.loc[1]
                    if engine.util.distance(x1, y1, x2, y2) <= self.fire_range:
                        if self.can_fire():
                            self.fire(creep.loc, gameState)
                            # adds in all the fireable creeps to an array
                            myAttacks.append(laser(self.id, creep.loc))
        return myAttacks;

    #Override for ice_tower
    def fire(self, target, gameState):
        """Fire at a target creep."""
        self.time_since_last_fire = 0
        target.take_damage(self.damage , gameState)
        target.modify(Frozen_modifier(target))

    def upgrade(self):
        if self.upgrade_level < max_upgrade_level:
            self.upgrade_level += 1
            self.upgrade_price += 5
            self.cooldown = self.cooldown - .1
            self.damage += 3
            return True
        return False