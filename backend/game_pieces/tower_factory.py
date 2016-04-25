
from game_pieces.fire_tower import Fire_tower

from game_pieces.tower import Tower


class Tower_factory:

    #
    def factory(type,coordinate,id):
        if type == 0: return Tower(coordinate,100,3,2,id,1) #lazer tower
        if type == 1: return Fire_tower(id,coordinate) # fire tower
        if type == 2: return Tower(coordinate,50,5,9,id,3) #soemthing tower?

        dummy = Tower(0,0,0,0,0)
        dummy.tower_type = "failure"
        return dummy
    factory = staticmethod(factory)