import unittest
from creep import Creep


class CreepTest(unittest.TestCase):
	
    def setUp(self):
        self.creep = Creep((0,0), 'basic', 10, 100)
	
    def test_creep(self):
        self.assertEqual(self.creep.loc, (0,0))
        self.assertEqual(self.creep.type, 'basic')
        self.assertEqual(self.creep.speed, 10)
        self.assertEqual(self.creep.health, 100)
        
    def test_move_to_dest(self):
        self.creep.move_to_dest((1,1))
        self.assertEqual(self.creep.loc, (1,1))
    
    def test_move_on_path(self):
        bestPath = {(1, 2): (0, 2), (3, 2): (2, 2), (0, 0): (1, 0), (2, 0): (3, 0), (4, 5): None, (4, 1): (4, 2), (4, 4): (4, 5), (2, 2): (1, 2), (1, 4): (2, 4), (0, 2): (0, 3), (3, 0): (4, 0), (0, 4): (1, 4), (1, 0): (2, 0), (4, 2): (3, 2), (0, 3): (0, 4), (3, 4): (4, 4), (2, 4): (3, 4), (4, 0): (4, 1)}
        
	
	
	
	
if __name__ == '__main__':
    unittest.main()