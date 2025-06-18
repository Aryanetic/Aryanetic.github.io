import json
import os
import datetime
from flask import session

class AnalyticsDataManager:
    def __init__(self):
        self.data_file = 'data/analytics_data.json'
        self.data = self.load_data()

    def load_data(self):
        if not os.path.exists(self.data_file):
            return {
                "total_visits": 0,
                "page_views": {},
                "unique_visitors": set(),
                "todays_visits": {},
                "last_visit_time": None,
                "page_time_spent": {},
                "user_agents": {},
                "ip_addresses": set()
            }
        with open(self.data_file, 'r') as f:
            data = json.load(f)
            if 'unique_visitors' in data and isinstance(data['unique_visitors'], list):
                data['unique_visitors'] = set(data['unique_visitors'])
            if 'ip_addresses' in data and isinstance(data['ip_addresses'], list):
                data['ip_addresses'] = set(data['ip_addresses'])
            return data

    def save_data(self):
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
        data_to_save = self.data.copy()
        if 'unique_visitors' in data_to_save and isinstance(data_to_save['unique_visitors'], set):
            data_to_save['unique_visitors'] = list(data_to_save['unique_visitors'])
        if 'ip_addresses' in data_to_save and isinstance(data_to_save['ip_addresses'], set):
            data_to_save['ip_addresses'] = list(data_to_save['ip_addresses'])
        with open(self.data_file, 'w') as f:
            json.dump(data_to_save, f, indent=2, default=str)

    def track_page(self, page, session_id=None, time_spent=None, user_agent=None, ip_address=None):
        # Ensure keys exist
        if "total_visits" not in self.data or not isinstance(self.data["total_visits"], int):
            self.data["total_visits"] = 0
        if "page_views" not in self.data or not isinstance(self.data["page_views"], dict):
            self.data["page_views"] = {}
        if "unique_visitors" not in self.data or not isinstance(self.data["unique_visitors"], set):
            self.data["unique_visitors"] = set()
        if "todays_visits" not in self.data or not isinstance(self.data["todays_visits"], dict):
            self.data["todays_visits"] = {}
        if "last_visit_time" not in self.data:
            self.data["last_visit_time"] = None
        if "page_time_spent" not in self.data or not isinstance(self.data["page_time_spent"], dict):
            self.data["page_time_spent"] = {}
        if "user_agents" not in self.data or not isinstance(self.data["user_agents"], dict):
            self.data["user_agents"] = {}
        if "ip_addresses" not in self.data or not isinstance(self.data["ip_addresses"], set):
            self.data["ip_addresses"] = set()

        self.data["total_visits"] += 1
        if page not in self.data["page_views"]:
            self.data["page_views"][page] = 0
        self.data["page_views"][page] += 1

        # Unique visitors by session_id
        if session_id:
            self.data["unique_visitors"].add(session_id)

        # Today's visits
        today = datetime.date.today().isoformat()
        if today not in self.data["todays_visits"]:
            self.data["todays_visits"][today] = 0
        self.data["todays_visits"][today] += 1

        # Last visit time
        self.data["last_visit_time"] = datetime.datetime.now().isoformat()

        # Time spent per page
        if time_spent is not None:
            if page not in self.data["page_time_spent"]:
                self.data["page_time_spent"][page] = {"total": 0, "count": 0}
            self.data["page_time_spent"][page]["total"] += float(time_spent)
            self.data["page_time_spent"][page]["count"] += 1

        # User agent tracking
        if user_agent:
            if user_agent not in self.data["user_agents"]:
                self.data["user_agents"][user_agent] = 0
            self.data["user_agents"][user_agent] += 1

        # IP address tracking
        if ip_address:
            self.data["ip_addresses"].add(ip_address)

        self.save_data()

    def get_analytics(self):
        top_pages = sorted(self.data["page_views"].items(), key=lambda x: x[1], reverse=True)[:3]
        today = datetime.date.today().isoformat()
        # Average time spent per page
        avg_time_per_page = {
            page: (v["total"] / v["count"] if v["count"] > 0 else 0)
            for page, v in self.data.get("page_time_spent", {}).items()
        }
        # Most common user agents
        user_agents_sorted = sorted(self.data["user_agents"].items(), key=lambda x: x[1], reverse=True)[:3]
        return {
            "total_visits": self.data["total_visits"],
            "page_views": self.data["page_views"],
            "unique_visitors": len(self.data["unique_visitors"]),
            "todays_visits": self.data["todays_visits"].get(today, 0),
            "last_visit_time": self.data["last_visit_time"],
            "top_pages": top_pages,
            "avg_time_per_page": avg_time_per_page,
            "user_agents": user_agents_sorted,
            "unique_ips": len(self.data["ip_addresses"])
        }