"""This module contains useful utility functions."""
from math import sqrt
from json import loads


def info(message, origin):
    max_len = 200
    if len(message) > max_len:
        message = message[:max_len] + '...'
    print('[{}] {}'.format(origin, message))


def distance(x1, y1, x2, y2):
    return sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)


# checks if a creep is at the edge of a 1x1 cell or not
X_COORD = 0
Y_COORD = 1


# Position is current position and direction is where it's going.
def edge(position, direction):

    if direction[X_COORD] == -1 and direction[Y_COORD] == 0: #going left
        if position[X_COORD] <= 0:  # currently at left edge of box
            return True, (1, position[Y_COORD]) # move to right edge of next box
        return False, (-1,0)

    elif direction[X_COORD] == 1 and direction[Y_COORD] == 0: #going right
        if position[X_COORD] >= 1:# right edge of box
            return True, (0, position[Y_COORD]) # move to left edge of next box
        return False, (1,0)

    elif direction[Y_COORD] == -1 and direction[X_COORD] == 0: #going down
        if position[Y_COORD] <= 0:  # bottom edge of box
            return True, (position[X_COORD], 1)  # move to top of next box
        return False, (0,-1)

    elif direction[Y_COORD] == 1 and direction[X_COORD] == 0: #going up
        if position[Y_COORD] >= 1:  # top edge of box
            return True, (position[X_COORD], 0) #move to bottom of next box
        return False, (0,1)

    elif direction[X_COORD] == -1 and direction[Y_COORD] == -1: # going top left
        if at_left(position): #current position is at left edge of box
            if at_top(position): #current position is at top left
                return True, (1,1) #move to bottom right edge of next box
            return False, (0,-1) #at left edge but not at top, move up
        if at_top(position):
            return False,(-1,0) #move left
        return False,(-1,-1) #Move top left

    elif direction[X_COORD] == 1 and direction[Y_COORD] == 1: # going bottom right
        if at_right(position): #current position is at right edge of box
            if at_bottom(position): #current position is at bottom right
                return True, (0,0) #move to top left edge of next box
            return False,(0,1)
        if at_bottom(position):
            return False,(1,0)
        return False, (1,1) #Move bottom right

    elif direction[X_COORD] == -1 and direction[Y_COORD] == 1: # going bottom left
        if at_left(position): #current position is at left edge of box
            if at_bottom(position): #current position is at bottom left
                return True, (1,0) #move to bottom right edge of next box
            return False,(0,1)
        if at_bottom(position):
            return False, (-1,0)
        return False, (-1,1)

    elif direction[X_COORD] == 1 and direction[Y_COORD] == -1: # going top right
        if at_right(position): #current position is at right edge of box
            if at_top(position): #current position is at top right
                return True, (0,1) #move to top left edge of next box
            return False, (0,-1)
        if at_top(position):
            return False, (1,0)
        return False, (1,-1)
    else:
        return False, -1

def at_top(coord):
    return coord[Y_COORD]<=0

def at_bottom(coord):
    return coord[Y_COORD]>=1

def at_left(coord):
    return coord[X_COORD]<=0

def at_right(coord):
    return coord[X_COORD]>=1


def utf(i):
    if type(i).__name__ == 'bytes':
        return i
    if not isinstance(i, str):
        print(type(i))
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
    # if isinstance(obj, type(enum)): # TODO: eventually support raw enums and not their string names
        # return obj.name
    if isinstance(obj, list):
        return [it.__dict__ for it in obj]
    else:
        return obj.__dict__
