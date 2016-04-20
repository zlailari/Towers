
from game_pieces.fire_tower import Fire_tower

from game_pieces.tower import Tower


class Tower_factory:

    #
    def factory(type,coordinate,id):
        if type == "arrow": return Tower(coordinate,100,3,2,id,1)
        if type == "fire": return Fire_tower(id,coordinate)
        if type == "ice": return Tower(coordinate,50,5,9,id,3)
    factory = staticmethod(factory)