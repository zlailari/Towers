"""This module contains useful utility functions."""
from math import sqrt
from json import loads


def distance(x1, y1, x2, y2):
    return sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)


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
