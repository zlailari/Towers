
from game_pieces.fire_tower import Fire_tower
from game_pieces.tower import Tower
from game_pieces.wall_tower import Wall_tower
from game_pieces.ice_tower import Ice_tower
from game_pieces.sniper_tower import Sniper_tower
from game_pieces.gattling_tower import Gattling_tower
from game_pieces.poison_tower import Poison_tower

class Tower_factory:

    #
    def factory(type,coordinate,id):
        if type == 0: return Tower(coordinate,100,3,2,id,1) #lazer tower
        if type == 1: return Fire_tower(id,coordinate) # fire tower
        if type == 2: return Tower(coordinate,50,5,9,id,3) #soemthing tower?
        if type == 3: return Wall_tower(id, coordinate) 
        if type == 4: return Ice_tower(id, coordinate)
        if type == 5: return Sniper_tower(id, coordinate)
        if type == 6: return Gattling_tower(id, coordinate)
        if type == 7: return Poison_tower(id, coordinate)

        dummy = Tower(0,0,0,0,0)
        dummy.tower_type = "failure"
        return dummy
    factory = staticmethod(factory)