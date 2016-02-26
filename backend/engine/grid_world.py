class GridWorld:

    def __init__(self, width, height, spawnpoint, endpoint):
        self.width = width
        self.height = height
        self.spawnpoint = spawnpoint
        self.endpoint = endpoint

        # this grid is a 2d array of bools, where grid[3][4] means
        # x,y position (4,3) is either obstructed (True) or traversable (False)
        self.grid = [[False for x in range(self.width)] for y in range(self.height)]

    def is_blocked(self, x, y):
        return self.grid[y][x]
