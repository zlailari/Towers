
# this will store data about the different varieties of creeps
# I don't know if I like this way of designating types, but it works for now
CREEP_TYPES = {
    'basic': {'speed': 10, 'health': 100},
    'medium': {'speed': 10, 'health': 150},
    'advanced': {'speed': 10, 'health': 300},
}


class Creep:
    """So far this is just an example implementation"""

    def __init__(self, loc=(0, 0), creep_type=None, speed=None, health=None):
        self.loc = loc
        if creep_type:
            # callers can either pass in a predefined creep_type
            assert speed is None
            assert health is None
            self.speed = creep_type['speed']
            self.health = creep_type['health']
        else:
            # or callers can define their own
            assert creep_type is None
            self.speed = speed
            self.health = health

    def update(self, dt):
        pass

    def get_position(self):
        return self.loc[0], self.loc[1]

    def move(self, dest):
        pass

    def take_damage(self, amount):
        self.health -= amount

    def adjust_speed(self, amount):
        self.speed += amount

    def __str__(self):  # like toString() in Java
        return 'speed,loc,health: ' + str(self.speed) + ',' + str(self.loc) + ',' + str(self.health)
