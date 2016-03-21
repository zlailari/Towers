"""This module contains useful utility functions."""
from math import sqrt
from json import loads



def distance(x1, y1, x2, y2):
    return sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)


#checks if a creep is at the edge of a 1x1 cell or not
X_COORD = 0
Y_COORD = 1
def edge(position, direction):
        if direction[X_COORD]== -1 and position[X_COORD] <= 0: # left edge of box, going left
            return True , (1, position[Y_COORD]%1)                #move to right edge of next box
        elif direction[X_COORD]== 1 and position[X_COORD] >= 1: # right edge of box, going right
            return True , (0,position[Y_COORD]%1)                 #move to left edge of next box
        elif direction[Y_COORD]== -1 and position[Y_COORD] <= 0: #bottom edge of box, going down
            return True , (position[X_COORD]%1, 1)                #move to top of next box
        elif direction[Y_COORD]== 1 and position[Y_COORD] >= 1: #top edge of box, going up
            return True , (position[X_COORD]%1, 0)
        else:
            return False , -1



def utf(i):
    assert isinstance(i, str)
    return i.encode('utf-8')


def obj_from_json(s):
    """
    Tries to convert a JSON string to a python object.
    Returns python object if successfull
    Returns False if string isn't valid JSON
    """
    try:
        return loads(s)
    except:
        return False

def dump_obj_dict(obj):
    return obj.__dict__
