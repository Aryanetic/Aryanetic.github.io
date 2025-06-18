# Real-Time Analytics Dashboard

A powerful real-time analytics dashboard built with Streamlit that provides comprehensive insights into website traffic and user behavior.

## Features

- Real-time user tracking and analytics
- Traffic source analysis
- Geographic distribution of visitors
- Device type breakdown
- Page engagement metrics
- Search visibility tracking
- Bounce rate analysis
- Time spent on pages
- Active user monitoring
- Event tracking

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

1. Start the dashboard:
```bash
streamlit run analytics_dashboard.py
```

2. Open your web browser and navigate to the URL shown in the terminal (typically http://localhost:8501)

## Data Structure

The analytics data is stored in `data/analytics_data.json` with the following structure:

- `sessions`: User session data including start time, pages visited, and time spent
- `page_views`: Page view counts
- `page_engagement`: Detailed page engagement metrics
- `real_time_data`: Real-time analytics including:
  - Active users
  - Current page views
  - Traffic sources
  - Geographic data
  - Device types
  - Search visibility
  - Bounce rates
  - Time spent
  - Events

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 