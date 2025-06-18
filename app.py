from flask import Flask, render_template, jsonify, request, session, make_response, redirect
from datetime import datetime
import uuid
from data_manager import AnalyticsDataManager
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import json
import time

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Generate a random secret key
data_manager = AnalyticsDataManager()

# Email configuration - these should be set in environment variables
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
        # Create message
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = SENDER_EMAIL
        msg['Subject'] = f"New Contact Form Submission from {form_data['name']}"

        # Create email body
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

        # Connect to SMTP server and send email
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
    if request.endpoint and 'static' not in request.endpoint:
        if 'analytics_session_id' not in session:
            session['analytics_session_id'] = str(uuid.uuid4())
        session_id = session['analytics_session_id']
        current_page = request.path
        user_agent = request.headers.get('User-Agent', '')
        ip_address = request.remote_addr
        now = time.time()
        time_spent = None
        last_page = session.get('last_page')
        last_time = session.get('last_time')
        if last_page and last_time and last_page != current_page:
            time_spent = now - last_time
            # Optionally, you could record time spent on last_page here
            data_manager.track_page(last_page, session_id=session_id, time_spent=time_spent, user_agent=user_agent, ip_address=ip_address)
        # Always record the current page view (with no time_spent if first visit)
        session['last_page'] = current_page
        session['last_time'] = now
        data_manager.track_page(current_page, session_id=session_id, user_agent=user_agent, ip_address=ip_address)

@app.route('/')
def index():
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
    return render_template('analytics.html', data=data_manager.get_analytics())

@app.route('/skills')
def skills():
    return render_template('skills.html')

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

@app.route('/project5')
def project5():
    return render_template('project5.html')

@app.route('/project6')
def project6():
    return render_template('project6.html')

@app.route('/project7')
def project7():
    return render_template('project7.html')

@app.route('/project8')
def project8():
    return render_template('project8.html')

@app.route('/project9')
def project9():
    return render_template('project9.html')

@app.route('/project10')
def project10():
    return render_template('project10.html')

@app.route('/project11')
def project11():
    return render_template('project11.html')

@app.route('/project12')
def project12():
    return render_template('project12.html')

@app.route('/project13')
def project13():
    return render_template('project13.html')

@app.route('/project14')
def project14():
    return render_template('project14.html')

@app.route('/project15')
def project15():
    return render_template('project15.html')

@app.route('/project16')
def project16():
    return render_template('project16.html')

@app.route('/project17')
def project17():
    return render_template('project17.html')

@app.route('/project18')
def project18():
    return render_template('project18.html')

@app.route('/project19')
def project19():
    return render_template('project19.html')

@app.route('/project20')
def project20():
    return render_template('project20.html')

@app.route('/experience')
def experience():
    return render_template('experience1.html')

@app.route('/experience1')
def experience1():
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

@app.route('/api/analytics')
def get_analytics():
    try:
        return jsonify(data_manager.get_analytics())
    except Exception as e:
        print(f"Error in API analytics route: {str(e)}")
        return jsonify({
            'error': 'Failed to load analytics data',
            'details': str(e)
        }), 500

@app.route('/track', methods=['POST'])
def track_event():
    data = request.json or {}
    if data.get('type') == 'page_view':
        data_manager.track_page(data.get('path', '/'))
    # Ignore click/interactions for now (simplified analytics)
    return jsonify({'status': 'success'})

@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        form_data = request.json or {}
        
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if not form_data.get(field):
                return jsonify({'success': False, 'error': f'{field} is required'})

        # Send email
        if send_email_notification(form_data):
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'Failed to send email'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

    