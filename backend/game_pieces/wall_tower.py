from game_pieces.tower import Tower
import engine.util
from shots.shot import shot
from shots.fire import fire
from shots.laser import laser
import json

# Wall is a subclass of tower. Wall does nothing but block creeps.
class Wall_tower (Tower):
    def __init__(self,id, loc):
        # TODO, make tower_type control other values

        self.loc = loc
        self.health = 1 #?
        self.cooldown = 0
        self.fire_range = 0
        self.id = id; # we need the towers to know where they are in the array of towers.
        self.tower_type = "wall_tower"

        self.price = 5
        self.upgrade_price = 0
        self.damage = 0
        self.time_since_last_fire = 0

        pass

    #Override for firing ice at a creep
    def update(self, dt, living_creeps, gameState):
        #   self.time_since_last_fire += dt
        myAttacks = [];

        # x2, y2 = self.get_position()
        # for creep in living_creeps:
        #         if creep.live:
        #             x1, y1 = creep.loc[0] , creep.loc[1]
        #             if engine.util.distance(x1, y1, x2, y2) <= self.fire_range:
        #                 if self.can_fire():
        #                     self.fire(creep.loc, gameState)
        #                     # adds in all the fireable creeps to an array
        #                     myAttacks.append(laser(self.id, creep.loc))
        return myAttacks;

    def upgrade(self):


    def upgrade(self):
        return False