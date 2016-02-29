import unittest
from grid_world import GridWorld

class TestGridWorld(unittest.TestCase):

	def setUp(self):
		height = 6
		width = 5
		self.height = height
		self.width = width
		self.grid_world = GridWorld(height, width, (0,0), (width-1 , height-1))

	def test_grid(self):
		a = [[False in range(self.width)] in range(self.height)]
		self.assertEqual(self.grid_world.grid, a)
	
	def test_get_neighbors(self):
		a = [(1,0), (0,1)]
		self.assertEqual(self.grid_world.get_neighbors(0,0), a)
		
		a = [(1,0),(2,1),(1,2),(0,1)]
		self.assertEqual(self.grid_world.get_neighbors(1,1), a)
		
	def test_build_on_endpoint(self):
		endpoint = self.grid_world.endpoint
		self.assertFalse(self.grid_world.build_tower(endpoint[0], endpoint[1]))
		
	def test_build_on_tower(self):
		self.assertTrue(self.grid_world.build_tower(1,1))
		self.assertFalse(self.grid_world.build_tower(1,1))
		
if __name__ == '__main__':
	unittest.main()