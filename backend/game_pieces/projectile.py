# Defines the base for a projectile class.  This takes a speed in pixels
# per second.  The update call causes the projectile to move.

import numpy as np

class Projectile:

    def __init__(self, start, creep, speed):
        self.pos = np.array(start).astype(float)
        self.velocity = np.array([0.0, 0.0])
        self.speed = speed
        self.creep = creep
        self.hit = False

    def update(self):
        if self.creep.live and not self.hit:
            direction = np.array(self.creep.get_position()).astype(float) - self.pos
            distance = np.linalg.norm(direction)
            direction /= distance
            acceleration = np.copy(direction)

            acceleration *= self.speed
            self.velocity = 2.0*acceleration + self.velocity
            velocityMag = np.linalg.norm(self.velocity)
            self.velocity *= self.speed/velocityMag
            velocityMag = np.linalg.norm(self.velocity)

            dot = np.dot(self.velocity, direction)
            print dot
            print velocityMag

            if 0.9*velocityMag < dot and distance < self.speed:
                self.velocity /= velocityMag
                self.velocity *= distance
                self.hit = True


            self.pos += self.velocity

    def get_position(self):
        return self.pos[0], self.pos[1]

    def has_hit(self):
        return self.hit

    def __str__(self):
        return 'pos:' + str(self.pos) + ' velocity: ' + str(self.velocity)

