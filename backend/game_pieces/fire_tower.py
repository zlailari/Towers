from game_pieces.tower import Tower
import engine.util
from shots.shot import shot
from shots.fire import fire
import json

# fire_tower is a subclass of tower. It sets tiles on fire but deals no damage.
class Fire_tower (Tower):
    def __init__(self,id, loc):
        # TODO, make tower_type control other values

        self.loc = loc
        self.health = 26 #?
        self.cooldown = 1
        self.fire_range = 2
        self.id = id; # we need the towers to know where they are in the array of towers.
        self.tower_type = "fire_tower"

        self.price = 40
        self.damage = 0
        self.time_since_last_fire = 0

        self.curr_level = 1; #max level is 4
        self.levels = [50, 100, 150]

        pass

    #Override for firing fire
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
                            myAttacks.append(fire(self.id, creep.loc))
        return myAttacks;

    #Override for fire tower
    def fire(self, loc, gameState):
        """Fire at a target tile."""
        self.time_since_last_fire = 0
        gameState.world.add_effect(loc,"fire")


    # Makes the fire tower attack faster
    def upgrade(self):
        self.curr_level+=1
        self.cooldown=self.cooldown*.70;

