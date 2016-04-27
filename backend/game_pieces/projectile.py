# Defines the base for a projectile class.
#This takes a speed that is used to define the max ||v||
#The update call causes the projectile to move towards it's target
#Once it has it it's target, hit == True and class to update will do nothing
#Calls to update will also do nothing if it's target is dead, and hit will be set to True

import numpy as np

class ProjectileCreep:

    def __init__(self, start, creep, speed, projectileType):
        self.loc = np.array(start).astype(float)
        self.velocity = np.array([0.0, 0.0])
        self.speed = speed
        self.creep = creep
        self.hit = False
        self.projectileType = projectileType

    def update(self):
        if self.creep.live and not self.hit:
            creepPos = np.array(self.creep.get_position()).astype(float)
            direction = creepPos - self.loc
            direction /= np.linalg.norm(direction)
            acceleration = np.copy(direction)

            acceleration *= self.speed
            self.velocity = 2.0*acceleration + self.velocity
            velocityMag = np.linalg.norm(self.velocity)
            self.velocity *= self.speed/velocityMag

            newLoc = self.loc + self.velocity
            currentDistance = np.linalg.norm(creepPos - self.loc)
            newDistance = np.linalg.norm(creepPos - newLoc)
            # checks to see if the projectile will hit with a fudge factro
            # of 3 units
            if abs(currentDistance + newDistance - self.speed) < 3.0:
                #If it will hit, change the velocity so that the
                #projectile will not overshoot the target
                self.velocity /= np.linalg.norm(self.velocity)
                self.velocity *= currentDistance
                self.hit = True

            self.loc += self.velocity
        elif not self.creep.live:
            self.hit = True

    def get_position(self):
        return self.loc[0], self.loc[1]

    def has_hit(self):
        return self.hit

    def __str__(self):
        return 'pos:' + str(self.loc) + ' velocity: ' + str(self.velocity)

class ProjectileTile:

    def __init__(self, start, tile, speed, projectileType):
        self.loc = np.array(start).astype(float)
        self.velocity = np.array([0.0, 0.0])
        self.speed = speed
        self.tile = tile
        self.hit = False
        self.type = projectileType

    def update(self):
        if not self.hit:
            tilePos = np.array(self.tile).astype(float)
            direction = tilePos - self.loc
            direction /= np.linalg.norm(direction)
            acceleration = np.copy(direction)

            acceleration *= self.speed
            self.velocity = 2.0*acceleration + self.velocity
            velocityMag = np.linalg.norm(self.velocity)
            self.velocity *= self.speed/velocityMag

            newLoc = self.loc + self.velocity
            currentDistance = np.linalg.norm(tilePos - self.loc)
            newDistance = np.linalg.norm(tilePos - newLoc)
            # checks to see if the projectile will hit with a fudge factro
            # of 3 units
            if abs(currentDistance + newDistance - self.speed) < 3.0:
                #If it will hit, change the velocity so that the
                #projectile will not overshoot the target
                self.velocity /= np.linalg.norm(self.velocity)
                self.velocity *= currentDistance
                self.hit = True

            self.loc += self.velocity

    def get_position(self):
        return self.loc[0], self.loc[1]

    def has_hit(self):
        return self.hit

    def __str__(self):
        return 'pos:' + str(self.loc) + ' velocity: ' + str(self.velocity)