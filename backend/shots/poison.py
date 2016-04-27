from shots.shot import shot
from engine.grid_world import GridWorld

# Laser is a subclass of shot.
class poison (shot):
    def __init__(self, towerID, loc):
        self.ID = towerID
        self.loc = loc
        self.type = "poison"
        pass

