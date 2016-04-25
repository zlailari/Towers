
from game_pieces.fire_tower import Fire_tower
from game_pieces.tower import Tower
from game_pieces.wall_tower import Wall_tower
from game_pieces.ice_tower import Ice_tower
from game_pieces.sniper_tower import Sniper_tower
from game_pieces.gattling_tower import Gattling_tower
from game_pieces.poison_tower import Poison_tower
from game_pieces.stun_tower import Stun_tower

class Tower_factory:

    #
    def factory(type,coordinate,id):
        if type == "laser_tower": return Tower(coordinate,100,3,2,id,1) #lazer tower
        if type == "fire_tower": return Fire_tower(id,coordinate) # fire tower
        if type == "wall_tower": return Wall_tower(id, coordinate)
        if type == "ice_tower": return Ice_tower(id, coordinate)
        if type == "sniper_tower": return Sniper_tower(id, coordinate)
        if type == "gattling_tower": return Gattling_tower(id, coordinate)
        if type == "poison_tower": return Poison_tower(id, coordinate)
        if type == "stun_tower": return Stun_tower(id, coordinate)

        dummy = Tower(0,0,0,0,0)
        dummy.tower_type = "failure"
        return dummy
    factory = staticmethod(factory)