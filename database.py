```python
import sqlite3
from typing import List, Dict

# Database connection setup
def get_db_connection():
    conn = sqlite3.connect('blog.db')
    conn.row_factory = sqlite3.Row
    return conn

def search_posts(query: str) -> List[Dict]:
    """
    Search for blog posts by title or tag.

    :param query: The search query string.
    :return: A list of dictionaries containing the matching posts.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # Use parameterized queries to prevent SQL injection
    sql = """
    SELECT * FROM posts 
    WHERE title LIKE ? OR tags LIKE ?
    """
    # Use '%' wildcards for partial matching
    like_query = f'%{query}%'
    cursor.execute(sql, (like_query, like_query))
    
    # Fetch all matching records
    posts = cursor.fetchall()
    conn.close()

    # Convert the result to a list of dictionaries
    return [dict(post) for post in posts]
```

This code defines a `search_posts` function that queries the database for posts matching a given query in either the title or tags. It uses parameterized queries to prevent SQL injection and returns the results as a list of dictionaries.