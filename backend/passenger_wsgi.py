import os
import sys

# Add backend directory to python path
sys.path.insert(0, os.path.dirname(__file__))

# Import FastAPI app
from main import app

# Import WSGI wrapper
try:
    from a2wsgi import ASGIMiddleware
    # This wraps FastAPI (ASGI) to make it compatible with WSGI servers like Phusion Passenger
    application = ASGIMiddleware(app)
except ImportError:
    # Fallback if a2wsgi is not installed (e.g. running uvicorn directly)
    application = app
