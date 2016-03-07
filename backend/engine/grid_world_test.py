import unittest
from grid_world import GridWorld

class TestGridWorld(unittest.TestCase):

	def setUp(self):
		height = 6
		width = 5
		self.height = height
		self.width = width
		self.grid_world = GridWorld(width, height, (0,0), (width-1 , height-1))

	def test_grid(self):
		a = [[False for x in range(self.width)] for x in range(self.height)]
		self.assertEqual(self.grid_world.grid, a)
	
	def test_get_neighbors(self):
		a = [(1,0), (0,1)]
		self.assertEqual(self.grid_world.get_neighbors(0,0), a)
		
		a = [(1,0),(2,1),(1,2),(0,1)]
		self.assertEqual(self.grid_world.get_neighbors(1,1), a)
		
	def test_build_on_endpoint(self):
		endpoint = self.grid_world.endpoint
		self.assertFalse(self.grid_world.build_tower(endpoint[0], endpoint[1]))

	def test_build_out_of_bounds(self):
		self.assertFalse(self.grid_world.build_tower(0, self.height+1))
		self.assertFalse(self.grid_world.build_tower(self.width+1, 0))
	
	def test_build_on_spawnpoint(self):
		spawnpoint = self.grid_world.spawnpoint
		self.assertFalse(self.grid_world.build_tower(spawnpoint[0], spawnpoint[1]))

	def test_build_on_tower(self):
		self.assertTrue(self.grid_world.build_tower(2,1))
		self.assertFalse(self.grid_world.build_tower(2,1))

	def test_block_path1(self):#try to build around the endpoint
		endpoint = self.grid_world.endpoint
		self.assertTrue(self.grid_world.build_tower(endpoint[0]-1, endpoint[1]))
		self.assertTrue(self.grid_world.build_tower(endpoint[0]-1, endpoint[1]-1))	
		self.assertFalse(self.grid_world.build_tower(endpoint[0], endpoint[1]-1))

	def test_block_path2(self):#try to build through the center
		self.assertTrue(self.grid_world.build_tower(0, 1))
		self.assertTrue(self.grid_world.build_tower(1, 1))
		self.assertTrue(self.grid_world.build_tower(2, 1))
		self.assertTrue(self.grid_world.build_tower(3, 1))
		self.assertFalse(self.grid_world.build_tower(4, 1))

	def test_best_path(self):
		self.grid_world.build_tower(0, 1)
		self.grid_world.build_tower(1, 1)
		self.grid_world.build_tower(2, 1)
		self.grid_world.build_tower(3, 1)

		self.grid_world.build_tower(4, 3)
		self.grid_world.build_tower(3, 3)
		self.grid_world.build_tower(2, 3)
		self.grid_world.build_tower(1, 3)

		self.grid_world.build_tower(0, 5)
		self.grid_world.build_tower(1, 5)
		self.grid_world.build_tower(2, 5)
		self.grid_world.build_tower(3, 5)

		bestPath = {(1, 2): (0, 2), (3, 2): (2, 2), (0, 0): (1, 0), (2, 0): (3, 0), (4, 5): None, (4, 1): (4, 2), (4, 4): (4, 5), (2, 2): (1, 2), (1, 4): (2, 4), (0, 2): (0, 3), (3, 0): (4, 0), (0, 4): (1, 4), (1, 0): (2, 0), (4, 2): (3, 2), (0, 3): (0, 4), (3, 4): (4, 4), (2, 4): (3, 4), (4, 0): (4, 1)}


		self.assertEqual(self.grid_world.get_path(self.grid_world.grid), bestPath)

if __name__ == '__main__':
	unittest.main()