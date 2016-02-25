import util


class Tower:
    """Basic implementation of a tower"""

    def __init__(self, loc, health, cooldown, fire_range):
        self.loc = loc
        self.health = health
        self.cooldown = cooldown
        self.fire_range = fire_range

        self.time_since_last_fire = 0

    def update(self, dt, living_creeps):
        self.time_since_last_fire += dt

        if self.can_fire():
            for creep in living_creeps:
                x1, y1 = creep.get_position()
                x2, y2 = self.get_position()
                if util.distance(x1, y1, x2, y2) < self.fire_range:
                    self.fire(creep)

    def can_fire(self):
        """True if the cooldown has warn off."""
        return self.time_since_last_fire < self.cooldown

    def fire(self, target):
        """Fire at a target creep."""
        self.time_since_last_fire = 0

    def get_position(self):
        return self.loc[0], self.loc[1]
