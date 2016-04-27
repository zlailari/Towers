from game_pieces.tower import Tower
import engine.util
from shots.shot import shot
from shots.poison import poison
from modifiers.dot_modifier import Dot_modifier
import json

# ice_tower is a subclass of tower. It fires a frozen shot at a creep that slows its speed by half.
class Stun_tower (Tower):
    def __init__(self,id, loc):
        # TODO, make tower_type control other values

        self.loc = loc
        self.health = 25 #?
        self.cooldown = 8
        self.fire_range = 2
        self.id = id; # we need the towers to know where they are in the array of towers.
        self.tower_type = "stun_tower"

        self.price = 30
        self.upgrade_price = 35
        self.damage = 10
        self.time_since_last_fire = 0
        self.upgrade_level = 0
        self.max_upgrade_level = 2

        pass

    #Override for firing a stun bolt
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
                            # myAttacks.append(stun(self.id, creep.loc))
        return myAttacks;

    #Override for stun tower fire
    def fire(self, target, gameState):
        """Apply the stun modifier to target creep."""
        self.time_since_last_fire = 0
        allNeighbors = gameState.world.get_neighbors(self.loc[0], self.loc[1]) + gameState.world.get_neighbors_diagonal(self.loc[0], self.loc[1])
        for loc in allNeighbors:
            gameState.world.add_effect(loc, "stun")


    def upgrade(self):
        if self.upgrade_level < self.max_upgrade_level:
            self.upgrade_level += 1
            self.upgrade_price += 5
            self.cooldown = self.cooldown - .5
            return True
        return False