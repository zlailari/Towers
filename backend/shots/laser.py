from shots.shot import shot

# Laser is a subclass of shot.
class laser (shot):
    def __init__(self,towerid, creepid):
        self.towerid = towerid
        self.creepid = creepid
        self.type = "laser"
        pass
