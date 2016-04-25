import unittest
from game_pieces.projectile import Projectile
from game_pieces.creep import Creep
from game_pieces.tower import Tower

class ProjectileTest(unittest.TestCase):

    def setUp(self):
        self.creep = Creep.factory("Default", 0)
        self.projectile = Projectile((20,20), self.creep, 5)

    def test_update(self):
        for i in range(0, 10):
            self.creep.move_to_dest((0, i))
            print self.creep
            self.projectile.update()
            print self.projectile


if __name__ == '__main__':
    unittest.main()