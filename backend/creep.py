class creep:
    speed = 0
    location = (0,0)
    health = 0

    def __init__(self, speed = 0, loc = (0,0), health = 0):
       self.speed = speed
       self.location = loc
       self.health = health

    def move(self, dest):
        pass

    def take_damage(self, amount):
        self.health -= amount

    def adjust_speed(self, amount):
        self.speed += amount

    def __str__(self): # like toString() in Java
        return 'speed,loc,health: ' + str(self.speed) + ',' + str(self.location) + ',' + str(self.health)

