"""This module contains useful utility functions."""
from math import sqrt


def distance(x1, y1, x2, y2):
    return sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)

def utf(i):
    assert isinstance(i, str)
    return i.encode('utf-8')
