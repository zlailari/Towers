from shot import shot

class laser (shot):
    def __init__(self,towerid, creepid):
        self.towerid = towerid
        self.creepid = creepid
        self.type = "laser"
        pass
