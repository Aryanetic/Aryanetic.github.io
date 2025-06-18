from app import app

@app.route('/')
def index():
    return 'Hello, World!'

# Additional routes will be moved here from app.py 