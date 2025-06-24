from flask import Flask, render_template, jsonify, request, session, make_response, redirect
from datetime import datetime
import uuid
import os
import json
from data_manager import AnalyticsDataManager
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from http.server import BaseHTTPRequestHandler
import sys
import traceback
from pathlib import Path

# Add the api directory to Python path
current_dir = Path(__file__).parent
if current_dir not in sys.path:
    sys.path.insert(0, str(current_dir))

# Now we can import the analytics manager
from analytics_manager import AnalyticsManager

# Initialize Flask app with absolute paths
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
template_dir = os.path.join(root_dir, 'templates')
static_dir = os.path.join(root_dir, 'static')

app = Flask(__name__, 
           template_folder=template_dir,
           static_folder=static_dir,
           static_url_path='')

# Set a fixed secret key for Vercel environment
app.secret_key = 'your-fixed-secret-key-here'  # Replace with your secret key

data_manager = AnalyticsDataManager()

# Initialize analytics manager with error handling
try:
    analytics_manager = AnalyticsManager()
    print("Analytics manager initialized successfully")
except Exception as e:
    print(f"Failed to initialize analytics: {str(e)}")
    analytics_manager = None

# Email configuration
SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "")
SENDER_PASSWORD = os.environ.get("EMAIL_PASSWORD", "")

def get_session_id():
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())
    return session['session_id']

def send_email_notification(form_data):
    if not all([SENDER_EMAIL, SENDER_PASSWORD]):
        print("Email configuration not set")
        return False
        
    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = SENDER_EMAIL
        msg['Subject'] = f"New Contact Form Submission from {form_data['name']}"

        body = f"""
        New contact form submission received:

        Name: {form_data['name']}
        Email: {form_data['email']}
        Phone: {form_data['phone']}
        Company: {form_data['company']}
        Message: {form_data['message']}

        Submitted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """

        msg.attach(MIMEText(body, 'plain'))
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

@app.before_request
def track_page_view():
    if analytics_manager and request.endpoint != 'static':
        try:
            analytics_manager.track_page(request.path)
            print(f"Tracked page view for: {request.path}")
        except Exception as e:
            print(f"Failed to track page view: {str(e)}")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/analytics')
def analytics():
    if not analytics_manager:
        return jsonify({"error": "Analytics not configured"}), 503
    try:
        data = analytics_manager.get_analytics()
        return render_template('analytics.html', data=data)
    except Exception as e:
        print(f"Error in analytics route: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/skills')
def skills():
    return render_template('skills.html')

@app.route('/experience')
def experience():
    return render_template('experience1.html')

@app.route('/internship1')
def internship1():
    return render_template('internship1.html')

@app.route('/internship2')
def internship2():
    return render_template('internship2.html')

@app.route('/internship3')
def internship3():
    return render_template('internship3.html')

@app.route('/internship4')
def internship4():
    return render_template('internship4.html')

@app.route('/internship5')
def internship5():
    return render_template('internship5.html')

@app.route('/project1')
def project1():
    return render_template('project1.html')

@app.route('/project2')
def project2():
    return render_template('project2.html')

@app.route('/project3')
def project3():
    return render_template('project3.html')

@app.route('/project4')
def project4():
    return render_template('project4.html')

@app.route('/api/analytics')
def get_analytics():
    if not analytics_manager:
        return jsonify({"error": "Analytics not configured"}), 503
    try:
        return jsonify(analytics_manager.get_analytics())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/track', methods=['POST'])
def track_event():
    data = request.json or {}
    if data.get('type') == 'page_view':
        data_manager.track_page(data.get('path', '/'))
    return jsonify({'status': 'success'})

@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        form_data = request.json or {}
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if not form_data.get(field):
                return jsonify({'success': False, 'error': f'{field} is required'})

        if send_email_notification(form_data):
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'Failed to send email'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

def handle_error(error):
    print(f"Error: {str(error)}")
    print("Traceback:")
    traceback.print_exc()
    return json.dumps({
        "statusCode": 500,
        "body": json.dumps({
            "error": str(error),
            "traceback": traceback.format_exc()
        })
    }).encode()

def app_handler(event, context):
    try:
        print("Received event:", event)
        return app.wsgi_app
    except Exception as e:
        return handle_error(e)

# Vercel serverless handler
class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        with app.test_client() as test_client:
            response = test_client.get(self.path)
            self.wfile.write(response.data)
            
    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        with app.test_client() as test_client:
            response = test_client.post(self.path, data=post_data)
            self.wfile.write(response.data)

    