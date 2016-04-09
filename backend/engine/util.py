"""This module contains useful utility functions."""
from math import sqrt
from json import loads
import enum


def info(message, origin):
    if len(message) > 150:
        message = message[:100] + '...'
    print('[{}] {}'.format(origin, message))


def distance(x1, y1, x2, y2):
    return sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)


# checks if a creep is at the edge of a 1x1 cell or not
X_COORD = 0
Y_COORD = 1


def edge(position, direction):
    if direction[X_COORD] == -1 and position[X_COORD] <= 0:  # left edge of box, going left
        # move to right edge of next box
        return True, (1, position[Y_COORD] % 1)
    elif direction[X_COORD] == 1 and position[X_COORD] >= 1:  # right edge of box, going right
        # move to left edge of next box
        return True, (0, position[Y_COORD] % 1)
    elif direction[Y_COORD] == -1 and position[Y_COORD] <= 0:  # bottom edge of box, going down
        return True, (position[X_COORD] % 1, 1)  # move to top of next box
    elif direction[Y_COORD] == 1 and position[Y_COORD] >= 1:  # top edge of box, going up
        return True, (position[X_COORD] % 1, 0)
    else:
        return False, -1


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
    # if isinstance(obj, type(enum)): # TODO: eventually support raw enums and not their string names
        # return obj.name
    if isinstance(obj, list):
        return [it.__dict__ for it in obj]
    else:
        return obj.__dict__
