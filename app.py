```python
from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Database connection function
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# Function to search posts by title or tag
def search_posts(query):
    conn = get_db_connection()
    cursor = conn.cursor()
    # Use parameterized query to prevent SQL injection
    sql = "SELECT * FROM posts WHERE title LIKE ? OR tags LIKE ?"
    like_query = f"%{query}%"
    cursor.execute(sql, (like_query, like_query))
    posts = cursor.fetchall()
    conn.close()
    return posts

# Search endpoint
@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q', '')
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    posts = search_posts(query)
    results = [dict(post) for post in posts]
    return jsonify(results)

# Main entry point
if __name__ == '__main__':
    app.run(debug=True)
```

In this implementation:
- We use Flask to create a web application with a `/search` endpoint.
- The `search_posts` function uses a parameterized query to safely search for posts by title or tags.
- The `/search` endpoint accepts a query parameter `q` and returns matching posts in JSON format.
- The database connection is managed using SQLite, and connections are properly closed after use.