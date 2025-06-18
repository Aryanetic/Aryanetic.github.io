import json
from datetime import datetime
from collections import defaultdict
import os
import time
from urllib.parse import urlparse, parse_qs

class AnalyticsDataManager:
    def __init__(self):
        self.data_file = 'data/analytics_data.json'
        self.sessions = {}
        self.page_views = {}
        self.page_engagement = {}
        self.real_time_data = {}
        self.load_data()

    def _get_traffic_source(self, referrer):
        if not referrer:
            return 'direct'
        
        try:
            referrer_domain = urlparse(referrer).netloc
            
            if 'google' in referrer_domain:
                parsed_qs = parse_qs(urlparse(referrer).query)
                query = parsed_qs.get('q', [None])[0]
                if query:
                    st_visits = self.real_time_data['search_visibility']['search_term_visits']
                    st_visits[query] = st_visits.get(query, 0) + 1
                return 'google_search'
            if 'linkedin.com' in referrer_domain:
                return 'linkedin'
            if 'instagram.com' in referrer_domain:
                return 'instagram'
            if 'wa.me' in referrer_domain or 'api.whatsapp.com' in referrer_domain:
                return 'whatsapp'
            
            return 'other'
        except Exception:
            return 'other'

    def track_visit(self, source='direct'):
        """Tracks a new visit by updating traffic source and active time counters."""
        if source in self.real_time_data['traffic_sources']:
            self.real_time_data['traffic_sources'][source] += 1
        else:
            self.real_time_data['traffic_sources'][source] = 1
        
        current_hour = datetime.now().hour
        self.real_time_data['active_times']['values'][current_hour] += 1

    def track_page_view(self, session_id, page, time_spent=None, user_agent=None, referrer=None):
        current_time = time.time()
        
        if session_id not in self.sessions:
            source = self._get_traffic_source(referrer)
            self.track_visit(source=source)

            self.sessions[session_id] = {
                'start_time': current_time,
                'last_activity': current_time,
                'pages': [],
                'total_time': 0,
                'page_times': {},
                'user_agent': user_agent,
                'referrer': referrer,
                'device_type': self._get_device_type(user_agent) if user_agent else 'unknown',
                'country': self._get_country_from_ip(),
                'traffic_source': source
            }
        
        session = self.sessions[session_id]
        
        if session['pages'] and time_spent is not None:
            session['total_time'] += time_spent
            last_page = session['pages'][-1]
            if last_page not in session['page_times']:
                session['page_times'][last_page] = 0
            session['page_times'][last_page] += time_spent
        
        session['last_activity'] = current_time
        if page not in session['pages']:
            session['pages'].append(page)
        
        self.page_views[page] = self.page_views.get(page, 0) + 1
        
        if page not in self.page_engagement:
            self.page_engagement[page] = {
                'views': 0,
                'total_time': 0,
                'avg_time': 0,
                'bounce_rate': 0,
                'unique_visitors': [],
                'interactions': 0
            }
        
        page_data = self.page_engagement[page]
        page_data['views'] += 1
        if session_id not in page_data['unique_visitors']:
            page_data['unique_visitors'].append(session_id)
        
        if time_spent is not None:
            page_data['total_time'] += time_spent
            if page_data['views'] > 0:
                page_data['avg_time'] = page_data['total_time'] / page_data['views']

        self._update_real_time_data(session_id, page)
        
        self.save_data()

    def _get_device_type(self, user_agent):
        if not user_agent:
            return 'unknown'
        ua = user_agent.lower()
        if 'mobile' in ua or 'android' in ua or 'iphone' in ua:
            return 'mobile'
        elif 'tablet' in ua or 'ipad' in ua:
            return 'tablet'
        return 'desktop'

    def _get_country_from_ip(self):
        # Placeholder for IP geolocation
        return 'Unknown'

    def track_click(self, element_id, page_path):
        self.real_time_data['current_clicks'][element_id] = self.real_time_data['current_clicks'].get(element_id, 0) + 1
        self.save_data()

    def get_analytics(self):
        try:
            active_users = len([
                s for s in self.sessions.values()
                if time.time() - s['last_activity'] < 300
            ])
            
            total_visits = len(self.sessions)
            
            total_time = sum(s['total_time'] for s in self.sessions.values())
            average_time = total_time / total_visits if total_visits > 0 else 0
            
            bounce_count = sum(1 for s in self.sessions.values() if len(s['pages']) == 1)
            bounce_rate = (bounce_count / total_visits * 100) if total_visits > 0 else 0

            page_engagement_summary = {}
            for page, stats in self.page_engagement.items():
                page_engagement_summary[page] = {
                    'views': stats['views'],
                    'avg_time': stats['avg_time'],
                    'unique_visitors': len(stats['unique_visitors']),
                    'interaction_rate': (stats['interactions'] / stats['views'] * 100) if stats['views'] > 0 else 0
                }

            self.real_time_data['active_users'] = active_users
            
            return {
                'active_users': active_users,
                'total_visits': total_visits,
                'average_time': round(average_time, 2),
                'bounce_rate': round(bounce_rate, 2),
                'page_engagement': page_engagement_summary,
                'realtime': self.real_time_data
            }
        except Exception as e:
            print(f"Error in get_analytics: {str(e)}")
            return self._get_default_analytics()

    def load_data(self):
        try:
            if os.path.exists(self.data_file):
                with open(self.data_file, 'r') as f:
                    data = json.load(f)
                    self.sessions = data.get('sessions', {})
                    self.page_views = data.get('page_views', {})
                    self.page_engagement = data.get('page_engagement', {})
                    self.real_time_data = data.get('real_time_data', {})
                    self._ensure_real_time_data_structure()
            else:
                self._initialize_default_data()
        except (json.JSONDecodeError, IOError) as e:
            print(f"Error loading data: {str(e)}. Initializing fresh data.")
            self._initialize_default_data()

    def _ensure_real_time_data_structure(self):
        """Ensures the loaded real_time_data has all the necessary keys."""
        defaults = self._get_default_real_time_data()
        for key, default_value in defaults.items():
            if key not in self.real_time_data:
                self.real_time_data[key] = default_value
            elif isinstance(default_value, dict):
                for nested_key, nested_default in default_value.items():
                    if nested_key not in self.real_time_data.get(key, {}):
                        self.real_time_data[key][nested_key] = nested_default

    def _get_default_real_time_data(self):
        return {
            'active_users': 0,
            'current_page_views': {},
            'current_clicks': {},
            'active_times': {
                'labels': [f"{hour:02d}:00" for hour in range(24)],
                'values': [0] * 24
            },
            'geographic_data': {},
            'traffic_sources': {
                'google_search': 0, 'linkedin': 0, 'instagram': 0,
                'direct': 0, 'whatsapp': 0, 'other': 0
            },
            'search_visibility': {
                'search_term_visits': {},
                'total_impressions': 0,
                'total_clicks': 0,
                'average_position': 0
            },
            'device_types': {'desktop': 0, 'mobile': 0, 'tablet': 0, 'unknown': 0},
            'bounce_rates': {},
            'time_spent': {},
            'events': []
        }

    def _initialize_default_data(self):
        self.sessions = {}
        self.page_views = {}
        self.page_engagement = {}
        self.real_time_data = self._get_default_real_time_data()
        self.save_data()

    def save_data(self):
        try:
            os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
            data = {
                'sessions': self.sessions,
                'page_views': self.page_views,
                'page_engagement': self.page_engagement,
                'real_time_data': self.real_time_data
            }
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=4)
        except IOError as e:
            print(f"Error saving data: {str(e)}")

    def _update_real_time_data(self, session_id, page):
        current_time = time.time()
        
        self.real_time_data['active_users'] = len([
            s for s in self.sessions.values()
            if current_time - s['last_activity'] < 300
        ])
        
        self.real_time_data['current_page_views'][page] = self.page_views.get(page, 0)
        
        if session_id in self.sessions:
            session_data = self.sessions[session_id]
            country = session_data.get('country', 'Unknown')
            if country not in self.real_time_data['geographic_data']:
                self.real_time_data['geographic_data'][country] = 0
            self.real_time_data['geographic_data'][country] += 1
            
            device_type = session_data.get('device_type', 'unknown')
            if device_type not in self.real_time_data['device_types']:
                self.real_time_data['device_types'][device_type] = 0
            self.real_time_data['device_types'][device_type] += 1

    def track_interaction(self, session_id, page, interaction_type):
        if page in self.page_engagement:
            self.page_engagement[page]['interactions'] += 1
            self.save_data()

    def _get_default_analytics(self):
        return {
            'active_users': 0, 'total_visits': 0, 'average_time': 0, 'bounce_rate': 0,
            'page_engagement': {}, 'realtime': self._get_default_real_time_data()
        }