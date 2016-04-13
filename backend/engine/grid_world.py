from queue import *
from engine.tile_effects import tile_effects


class GridWorld:

    def __init__(self, width, height, spawnpoint, endpoint):
        self.width = width
        self.height = height
        self.spawnpoint = spawnpoint
        self.endpoint = endpoint
        

        # this grid is a 2d array of bools, where grid[3][4] means
        # x,y position (4,3) is either obstructed (True) or traversable (False)
        self.grid = [[False for x in range(self.width)]
                     for x in range(self.height)]

        self.tilePaths = self.get_path(self.grid)

        # Creates the tile effects double array. Sets everything as a tile effect (which holds another array of effects).
        # Will need to change tile_effect later so that not everything is on fire.
        self.effects = []
        for i in range(0,width):
            new = []
            for j in range(0,height):
                new.append(tile_effects())
            self.effects.append(new)


        #self.effects[8][0] = tile_effects()


    def is_blocked(self, x, y):
        return self.grid[y][x]

    def get_width(self):
        return self.width

    def get_grid(self):
        return self.grid

    def get_height(self):
        return self.height

    def get_tiles(self):
        return self.tiles

    # returns an array of tuples that are the coordinates of the neighboring
    # tiles of the passed tile
    def get_neighbors(self, xCoord, yCoord):
        neighbors = []
        if(xCoord == 0):
            if(yCoord == 0):
                neighbors.append((xCoord + 1, yCoord))
                neighbors.append((xCoord, yCoord + 1))
            elif(yCoord == self.height - 1):
                neighbors.append((xCoord, yCoord - 1))
                neighbors.append((xCoord + 1, yCoord))
            else:
                neighbors.append((xCoord, yCoord - 1))
                neighbors.append((xCoord + 1, yCoord))
                neighbors.append((xCoord, yCoord + 1))
        elif(xCoord == self.width - 1):
            if(yCoord == 0):
                neighbors.append((xCoord, yCoord + 1))
                neighbors.append((xCoord - 1, yCoord))
            elif(yCoord == self.height - 1):
                neighbors.append((xCoord, yCoord - 1))
                neighbors.append((xCoord - 1, yCoord))
            else:
                neighbors.append((xCoord, yCoord - 1))
                neighbors.append((xCoord, yCoord + 1))
                neighbors.append((xCoord - 1, yCoord))
        else:
            if(yCoord == 0):
                neighbors.append((xCoord + 1, yCoord))
                neighbors.append((xCoord, yCoord + 1))
                neighbors.append((xCoord - 1, yCoord))
            elif(yCoord == self.height - 1):
                neighbors.append((xCoord, yCoord - 1))
                neighbors.append((xCoord + 1, yCoord))
                neighbors.append((xCoord - 1, yCoord))
            else:
                neighbors.append((xCoord, yCoord - 1))
                neighbors.append((xCoord + 1, yCoord))
                neighbors.append((xCoord, yCoord + 1))
                neighbors.append((xCoord - 1, yCoord))

        return neighbors

    # if a tower can be built in the desired location, do so. else return false
    def build_tower(self, xCoord, yCoord):

        if(xCoord >= self.width or yCoord >= self.height):
            return False

        if(self.can_build(xCoord, yCoord)):
            self.grid[yCoord][xCoord] = True
            self.tilePaths = self.get_path(self.grid)
            return True
        else:
            return False

    # return an array of that represents the tile to move to from any other
    # tile
    def get_path(self, all_tiles):
        frontier = Queue()
        frontier.put(self.endpoint)
        came_from = {}
        came_from[self.endpoint] = None

        while not frontier.empty():
            current = frontier.get()
            for next in self.get_neighbors(*current):
                # print current, "current"
                # print "next of 0", next[0]
                # print "next of 1", next[1]
                # print all_tiles
                # check to make sure the tile is empty
                if not all_tiles[next[1]][next[0]]:
                    if next not in came_from:
                        frontier.put(next)
                        came_from[next] = current
        return came_from

    def get_single_path(self, location):
        path_return = {}
        myLocation = location
        while (myLocation != None):
            path_return[myLocation] = self.tilePaths[myLocation]
            myLocation = self.tilePaths[myLocation]

        return path_return

    def can_build(self, xCoord, yCoord):
        if((xCoord, yCoord) == self.endpoint):  # cant build on the goal
            return False

        if((xCoord, yCoord) == self.spawnpoint):  # cant build on the spawnpoint
            return False

        if(self.grid[yCoord][xCoord]):  # cant build where there is already a tower
            return False

        copy_board = self.grid  # create a copy of the current came board

        # place a tower in the desired location
        copy_board[yCoord][xCoord] = True

        # calculate the paths of the new board
        copy_path = self.get_path(copy_board)

        for x in range(self.width):
            for y in range(self.height):
                # if a tile in the new board is empty but does not have a path,
                # the build does not work
                if(not copy_board[y][x] and (x, y) not in copy_path):
                    return False

        return True  # otherwise return true
