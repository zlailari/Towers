#Tester for projectile class.  Needs to be moved into backend/ to work


import unittest
from game_pieces.projectile import Projectile
from game_pieces.creep import Creep
from game_pieces.tower import Tower

class ProjectileTest(unittest.TestCase):

    def setUp(self):
        self.creep = Creep.factory("Default", 0)
        self.projectile = Projectile((20,20), self.creep, 5)

    def test_update(self):
        for i in range(0, 7):
            self.creep.move_to_dest((i, 0))
            print self.creep
            self.projectile.update()
            print self.projectile
            if self.projectile.has_hit():
                print "HIT"


if __name__ == '__main__':
    unittest.main()