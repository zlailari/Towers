import engine.util
from shots.laser import laser


class Tower:
    """Basic implementation of a tower"""

    def __init__(self, loc, health, cooldown, fire_range, id, tower_type="laser_tower"):
        # TODO, make tower_type control other values

        self.loc = loc
        self.health = health
        self.cooldown = cooldown
        self.fire_range = fire_range
        # we need the towers to know where they are in the array of towers.
        self.id = id
        self.tower_type = tower_type

        self.price = 20
        self.damage = 40
        self.upgrade_price = 35
        self.time_since_last_fire = cooldown
        self.upgrade_level = 0
        self.max_upgrade_level = 3

    def update(self, dt, living_creeps, gameState):
        self.time_since_last_fire += dt
        myAttacks = []

        x2, y2 = self.get_position()
        for creep in living_creeps:
            if creep.live:
                x1, y1 = creep.loc[0], creep.loc[1]
                if engine.util.distance(x1, y1, x2, y2) <= self.fire_range:
                    if self.can_fire():
                        self.fire(creep, gameState)
                        # adds in all the fireable creeps to an array
                        myAttacks.append(laser(self.id, creep.id))
        return myAttacks

    def can_fire(self):
        """True if the cooldown has warn off."""
        return self.time_since_last_fire >= self.cooldown
        # return True

    def fire(self, target, gameState):
        """Fire at a target creep."""
        self.time_since_last_fire = 0
        target.take_damage(self.damage, gameState)

    def get_position(self):
        return self.loc[0], self.loc[1]

    # Upgrades the damage per shot
    def upgrade(self):
        if self.upgrade_level < self.max_upgrade_level:
            self.upgrade_level += 1
            self.upgrade_price += 5
            self.cooldown = self.cooldown * 0.80
            return True
        return False
