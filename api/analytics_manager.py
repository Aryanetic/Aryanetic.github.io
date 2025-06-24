from pymongo import MongoClient
from datetime import datetime
import os
import sys

class AnalyticsManager:
    def __init__(self):
        try:
            # Get MongoDB connection string from environment variable
            mongodb_uri = os.environ.get('MONGODB_URI')
            print(f"MONGODB_URI exists: {bool(mongodb_uri)}")
            
            if not mongodb_uri:
                raise ValueError("MONGODB_URI environment variable not set")
            
            # Initialize MongoDB connection
            print("Attempting to connect to MongoDB...")
            self.client = MongoClient(mongodb_uri)
            
            # Test the connection
            self.client.admin.command('ping')
            print("Successfully connected to MongoDB!")
            
            self.db = self.client.portfolio_analytics
            self.page_views = self.db.page_views
            print("Database and collection initialized")
            
        except Exception as e:
            print(f"Error initializing AnalyticsManager: {str(e)}")
            print(f"Python path: {sys.path}")
            raise e
        
    def track_page(self, path):
        """Track a page view"""
        try:
            view_data = {
                'path': path,
                'timestamp': datetime.utcnow(),
                'date': datetime.utcnow().strftime('%Y-%m-%d')
            }
            self.page_views.insert_one(view_data)
            print(f"Successfully tracked page view for: {path}")
        except Exception as e:
            print(f"Error tracking page view: {str(e)}")
        
    def get_analytics(self):
        """Get analytics data"""
        try:
            # Get total visits
            total_visits = self.page_views.count_documents({})
            print(f"Total visits: {total_visits}")
            
            # Get page views by path
            pipeline = [
                {"$group": {
                    "_id": "$path",
                    "count": {"$sum": 1}
                }}
            ]
            page_views = {doc["_id"]: doc["count"] 
                         for doc in self.page_views.aggregate(pipeline)}
            print(f"Page views: {page_views}")
            
            # Get views by date
            date_pipeline = [
                {"$group": {
                    "_id": "$date",
                    "count": {"$sum": 1}
                }},
                {"$sort": {"_id": -1}},
                {"$limit": 30}  # Last 30 days
            ]
            daily_views = {doc["_id"]: doc["count"] 
                         for doc in self.page_views.aggregate(date_pipeline)}
            print(f"Daily views: {daily_views}")
            
            return {
                "total_visits": total_visits,
                "page_views": page_views,
                "daily_views": daily_views
            }
        except Exception as e:
            print(f"Error getting analytics: {str(e)}")
            return {
                "total_visits": 0,
                "page_views": {},
                "daily_views": {}
            } 