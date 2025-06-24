// Chart.js default configuration
Chart.defaults.font.family = "'Poppins', sans-serif";
Chart.defaults.color = '#2d3436';

// Function to update the overview metrics
function updateOverviewMetrics(data) {
    document.getElementById('total-visits').textContent = data.total_visits;
    document.getElementById('average-time').textContent = data.average_time;
    document.getElementById('bounce-rate').textContent = data.bounce_rate;
    document.getElementById('mobile-friendly').textContent = data.seo_metrics.mobile_friendly ? 'Yes' : 'No';
    document.getElementById('page-load-time').textContent = data.seo_metrics.page_load_time;
}

// Function to create the page views chart
function createPageViewsChart(data) {
    const ctx = document.getElementById('pageViewsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(data.page_views),
            datasets: [{
                label: 'Page Views',
                data: Object.values(data.page_views),
                backgroundColor: '#0984e3',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Function to create the popular times chart
function createPopularTimesChart(data) {
    const ctx = document.getElementById('popularTimesChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'],
            datasets: Object.entries(data.popular_times).map(([day, values]) => ({
                label: day,
                data: values,
                borderColor: getRandomColor(),
                fill: false,
                tension: 0.4
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Function to update SEO metrics circular progress bars
function updateSEOMetrics(data) {
    updateProgressCircle('meta-score', data.seo_metrics.meta_score);
    updateProgressCircle('accessibility-score', data.seo_metrics.accessibility_score);
}

// Helper function to update circular progress bars
function updateProgressCircle(elementId, score) {
    const circle = document.querySelector(`#${elementId} .progress-bar`);
    const scoreText = document.querySelector(`#${elementId} .score`);
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (score / 100) * circumference;
    
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = offset;
    scoreText.textContent = score;
}

// Helper function to generate random colors for the chart
function getRandomColor() {
    const colors = [
        '#0984e3',
        '#00b894',
        '#fdcb6e',
        '#e17055',
        '#6c5ce7'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Function to fetch and update analytics data
function fetchAnalytics() {
    fetch('/api/analytics')
        .then(response => response.json())
        .then(data => {
            updateOverviewMetrics(data);
            createPageViewsChart(data);
            createPopularTimesChart(data);
            updateSEOMetrics(data);
        })
        .catch(error => console.error('Error fetching analytics:', error));
}

// Update analytics data every 30 seconds
fetchAnalytics();
setInterval(fetchAnalytics, 30000); 