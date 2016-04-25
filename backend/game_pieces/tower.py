import engine.util
from shots.shot import shot
from shots.laser import laser
import json 


class Tower:
    """Basic implementation of a tower"""


    def __init__(self, loc, health, cooldown, fire_range, id, tower_type="laser_tower"):
        # TODO, make tower_type control other values

        self.loc = loc
        self.health = health
        self.cooldown = cooldown
        self.fire_range = fire_range
        self.id = id; # we need the towers to know where they are in the array of towers.
        self.tower_type = tower_type

        self.price = 20
        self.damage = 40
        self.time_since_last_fire = 0

    def update(self, dt, living_creeps, gameState):
        self.time_since_last_fire += dt
        myAttacks = [];

        x2, y2 = self.get_position()
        for creep in living_creeps:
                if creep.live:
                    x1, y1 = creep.loc[0] , creep.loc[1]
                    if engine.util.distance(x1, y1, x2, y2) <= self.fire_range:
                        if self.can_fire():
                            self.fire(creep, gameState)
                            # adds in all the fireable creeps to an array
                            myAttacks.append(laser(self.id,creep.id))
        return myAttacks;

    def can_fire(self):
        """True if the cooldown has warn off."""
        return self.time_since_last_fire >= self.cooldown
        #return True

    def fire(self, target, gameState):
        """Fire at a target creep."""
        self.time_since_last_fire = 0
        target.take_damage(self.damage , gameState)


    def get_position(self):
        return self.loc[0], self.loc[1]
