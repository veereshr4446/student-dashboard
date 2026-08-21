// ============================================================
//  CHARTS - Attendance & CIE Performance
// ============================================================

let attendanceChartInstance = null;
let cieChartInstance = null;

// ============================================================
//  INITIALIZE CHARTS
// ============================================================

function initCharts() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94a3b8' : '#6b7a8f';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';

    const labels = subjectsData.map(s => s.code);

    // ---------- Attendance Chart (Line) ----------
    const ctx1 = document.getElementById('attendanceChart').getContext('2d');

    attendanceChartInstance = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: subjectsData.map(s => s.attendance),
                borderColor: '#4f7df3',
                backgroundColor: 'rgba(79, 125, 243, 0.06)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#4f7df3',
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 50,
                    max: 100,
                    ticks: {
                        font: { size: 9 },
                        color: textColor,
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: { color: gridColor }
                },
                x: {
                    ticks: {
                        font: { size: 8 },
                        maxRotation: 45,
                        minRotation: 45,
                        color: textColor
                    },
                    grid: { display: false }
                }
            },
            animation: {
                duration: 1200,
                easing: 'easeInOutQuart'
            }
        }
    });

    // ---------- CIE Chart (Bar) ----------
    const ctx2 = document.getElementById('cieChart').getContext('2d');

    cieChartInstance = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'CIE-1',
                data: subjectsData.map(s => s.cie[0]),
                backgroundColor: 'rgba(79, 125, 243, 0.6)',
                borderColor: '#4f7df3',
                borderWidth: 1,
                borderRadius: 3
            }, {
                label: 'CIE-2',
                data: subjectsData.map(s => s.cie[1]),
                backgroundColor: 'rgba(108, 99, 255, 0.6)',
                borderColor: '#6c63ff',
                borderWidth: 1,
                borderRadius: 3
            }, {
                label: 'CIE-3',
                data: subjectsData.map(s => s.cie[2]),
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: '#10b981',
                borderWidth: 1,
                borderRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '/25';
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 25,
                    ticks: {
                        font: { size: 9 },
                        color: textColor,
                        stepSize: 5
                    },
                    grid: { color: gridColor }
                },
                x: {
                    ticks: {
                        font: { size: 8 },
                        maxRotation: 45,
                        minRotation: 45,
                        color: textColor
                    },
                    grid: { display: false }
                }
            },
            animation: {
                duration: 1200,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// ============================================================
//  UPDATE CHART COLORS (For Theme Switching)
// ============================================================

function updateChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94a3b8' : '#6b7a8f';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';

    if (attendanceChartInstance) {
        attendanceChartInstance.options.scales.y.ticks.color = textColor;
        attendanceChartInstance.options.scales.x.ticks.color = textColor;
        attendanceChartInstance.options.scales.y.grid.color = gridColor;
        attendanceChartInstance.update();
    }

    if (cieChartInstance) {
        cieChartInstance.options.scales.y.ticks.color = textColor;
        cieChartInstance.options.scales.x.ticks.color = textColor;
        cieChartInstance.options.scales.y.grid.color = gridColor;
        cieChartInstance.update();
    }
}

// ============================================================
//  EXPOSE FUNCTIONS GLOBALLY
// ============================================================

window.initCharts = initCharts;
window.updateChartColors = updateChartColors;

console.log('📊 Charts loaded successfully!');