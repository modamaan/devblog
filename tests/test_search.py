```python
import unittest
from unittest.mock import patch, MagicMock
from app import app, search_posts

class TestSearchFunctionality(unittest.TestCase):

    def setUp(self):
        # Set up test client for the Flask app
        self.app = app.test_client()
        self.app.testing = True

    @patch('app.cursor')
    def test_search_posts_function(self, mock_cursor):
        # Mock the database cursor and its fetchall method
        mock_cursor.fetchall.return_value = [
            {'id': 1, 'title': 'Python Tips', 'tags': 'python, programming'},
            {'id': 2, 'title': 'Flask Tutorial', 'tags': 'flask, web'}
        ]

        # Call the search_posts function with a query
        result = search_posts('Python')

        # Assert that the cursor's execute method was called with the correct SQL
        mock_cursor.execute.assert_called_with(
            "SELECT * FROM posts WHERE title LIKE %s OR tags LIKE %s", ('%Python%', '%Python%')
        )

        # Assert that the result is as expected
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['title'], 'Python Tips')

    @patch('app.search_posts')
    def test_search_endpoint(self, mock_search_posts):
        # Mock the search_posts function to return specific data
        mock_search_posts.return_value = [
            {'id': 1, 'title': 'Python Tips', 'tags': 'python, programming'}
        ]

        # Make a GET request to the /search endpoint with a query parameter
        response = self.app.get('/search?q=Python')

        # Assert that the response is 200 OK
        self.assertEqual(response.status_code, 200)

        # Assert that the response data is as expected
        self.assertIn(b'Python Tips', response.data)

        # Assert that the search_posts function was called with the correct query
        mock_search_posts.assert_called_with('Python')

if __name__ == '__main__':
    unittest.main()
```
