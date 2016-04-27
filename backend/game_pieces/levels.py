"""This file contains metadata describing the swarms in each level."""
from game_pieces.creep import Creep

class Levels:

    #Method to spawn creeps used for pvp
    def spawnCreep(self, creepType, creepID):
        #spawn_timers = []
        self.spawnTimers.insert(self.begin,0)
        #spawn_creeps = []
        self.creeps.insert(self.begin,Creep.factory(creepType, creepID))


    #Auto generates leveled based on parameters
    def createLevel(initialDelay, delayBetweenCreeps, delayBetweenWaves, numCreeps, numWaves, creepType):
        level_creep_spawn_timers =[]
        spawnCreeps = []
        spawn = initialDelay

        for k in range (0,numWaves):
            for i in range (0,numCreeps):
                level_creep_spawn_timers.append(spawn)
                spawn += delayBetweenCreeps
                spawnCreeps.append(Creep.factory(creepType,k*numCreeps + i))
            spawn += delayBetweenWaves

        return Levels(level_creep_spawn_timers,spawnCreeps)

    def __init__(self, timer, creeps):
        self.spawnTimers = timer
        self.creeps = creeps
        self.begin = 0; #position of next creep to be spawned (shouldn't have spawned yet)

    #Builds waves to spawn for tick
    def spawnWave(self,totalTime):
        spawningThisTick = []
        for i in range(self.begin, len(self.creeps)):
            if(self.spawnTimers[i] < totalTime):
                spawningThisTick.append(self.creeps[i])
                self.begin += 1
            else:
                break
        return spawningThisTick #Returns the spawning creeps for this tick
