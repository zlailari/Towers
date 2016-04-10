
class effects ():
    def __init__(self):
        pass

#fire sublcass
class fire(effects):
    def __init__(self, damage, counter=500):
        self.counter = counter;
        self.damage = damage;

    def update(self):
        self.counter = self.counter-1
        return self

    def on_move(self, creep, state):
        creep.take_damage(self.damage, state)
        return self

