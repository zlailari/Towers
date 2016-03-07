# this will store data about the different varieties of creeps
# I don't know if I like this way of designating types, but it works for now
CREEP_TYPES = {
    'basic': {'speed': 10, 'health': 100},
    'medium': {'speed': 10, 'health': 150},
    'advanced': {'speed': 10, 'health': 300},
}


class Creep:
    """So far this is just an example implementation"""

    def factory(type,id):
        if type == "Default": return Creep((0,0),"default",1,100,id)
    factory = staticmethod(factory)

    def __init__(self, loc, creep_type, speed, health,id):
        self.loc = loc
        self.type = creep_type
        self.speed = speed # Gotta go fast
        self.health = health
        self.progress = 0 # Amount traveled through a square
        self.id = id # The unique ID of the creep

    # We generate a json for movement. Passed up to the gameplay_state
    def update(self, path, dt):
        self.progress += dt
        if self.progress>=self.speed:
            self.progress = 0
            pos = self.move_on_path(path)
        return {self.id : self.loc} , {self.id : (self.progress/self.speed)}

    def move_to_dest(self, dest):
        self.loc = dest
        return self.loc

    def move_on_path(self, path):
        self.loc = path[self.loc]
        return self.loc

    def take_damage(self, amount):
        self.health -= amount
        if (self.health <= 0):
            return 0
        else:
            return self.health

    def adjust_speed(self, amount):
        self.speed += amount

    def __str__(self):  # like toString() in Java
        return 'speed,loc,health: ' + str(self.speed) + ',' + str(self.loc) + ',' + str(self.health)
