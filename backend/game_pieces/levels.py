"""This file contains metadata describing the swarms in each level."""
from game_pieces.creep import CREEP_TYPES

level_one = {'creep_type': CREEP_TYPES['basic'], 'amount': 3}
level_two = {'creep_type': CREEP_TYPES['basic'], 'amount': 5}
level_three = {'creep_type': CREEP_TYPES['basic'], 'amount': 7}

class Levels:

    def __init__(self, timer, creeps):
        self.spawnTimers = timer
        self.creeps = creeps
        self.begin = 0; #position of next creep to be spawned (shouldn't have spawned yet)

    #Builds waves to spawn for tick
    def spawnWave(self,totalTime):
        spawningThisTick = {}
        for i in range(self.begin, len(self.creeps)):
            if(self.spawnTimers[i] < totalTime):
                spawningThisTick.append(self.creeps[i])
                self.begin += 1
            else:
                break
        return spawningThisTick #Returns the spawning creeps for this tick


