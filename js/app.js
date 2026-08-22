// ============================================================
//  MAIN APPLICATION - Renders Everything
// ============================================================

// ============================================================
//  RENDER SUBJECTS TABLE
// ============================================================

function renderSubjects() {
    const container = document.getElementById('subjectList');
    if (!container) return;
    container.innerHTML = '';

    subjectsData.forEach((sub, index) => {
        const status = getStatus(sub.attendance);
        const row = document.createElement('div');
        row.className = 'subject-row';
        row.style.animationDelay = (index * 0.05) + 's';

        row.innerHTML = `
            <div class="subject-info">
                <div class="name">${sub.code} — ${sub.name}</div>
                <div class="faculty"><i class="fas fa-user-tie"></i> ${sub.faculty}</div>
            </div>
            <div class="subject-stats">
                <div class="top-row">
                    <span class="attendance ${status}">${sub.attendance}%</span>
                    <button class="rating-btn" onclick="openRatingModal('${sub.faculty}')">
                        <i class="fas fa-star"></i>
                    </button>
                </div>
                <div class="progress-wrapper">
                    <div class="progress-bar">
                        <div class="fill ${status}" style="width: 0%;" data-target="${sub.attendance}"></div>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(row);
    });

    setTimeout(() => {
        document.querySelectorAll('.progress-bar .fill').forEach(bar => {
            const target = parseFloat(bar.dataset.target);
            bar.style.width = target + '%';
        });
    }, 300);
}

// ============================================================
//  RENDER FACULTY SUMMARY (Home Page)
// ============================================================

function renderFacultySummary() {
    const container = document.getElementById('facultySummary');
    if (!container) return;

    const ratings = JSON.parse(localStorage.getItem('facultyRatings')) || {};
    const facultySet = getFacultyList();
    let html = '';
    let rated = 0;

    facultySet.forEach(f => {
        const rating = ratings[f] || 0;
        if (rating > 0) rated++;
        const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
        const count = subjectsData.filter(s => s.faculty === f).length;

        html += `
            <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid var(--border-color); font-size:13px;">
                <span>${f} <span style="font-size:10px; color:var(--text-secondary);">(${count})</span></span>
                <span style="font-size:13px;">${stars}</span>
            </div>
        `;
    });

    container.innerHTML = html;
    document.getElementById('ratedCount').textContent = rated;
}

// ============================================================
//  RENDER QUICK STATS
// ============================================================

function renderQuickStats() {
    const container = document.getElementById('quickStats');
    if (!container) return;

    const avg = getOverallAttendance().toFixed(1);
    const avgCIE = getOverallCIE().toFixed(1);
    const ratings = JSON.parse(localStorage.getItem('facultyRatings')) || {};
    const ratedCount = Object.keys(ratings).length;

    let highest = { code: '', avg: 0 };
    subjectsData.forEach(sub => {
        const avg = getAvgCIE(sub);
        if (avg > highest.avg) {
            highest = { code: sub.code, avg: avg };
        }
    });

    container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 8px; font-size:14px;">
            <div><span style="font-weight:600;">📖 Theory:</span> 6</div>
            <div><span style="font-weight:600;">🧪 Lab:</span> 2</div>
            <div><span style="font-weight:600;">👨‍🏫 Rated:</span> ${ratedCount}/${getFacultyList().length}</div>
            <div><span style="font-weight:600;">📊 Avg Attendance:</span> ${avg}%</div>
            <div><span style="font-weight:600;">🏆 Highest CIE:</span> ${highest.avg.toFixed(1)}/25 (${highest.code})</div>
            <div><span style="font-weight:600;">🔥 Streak:</span> <span style="color:#f59e0b;">${localStorage.getItem('streak') || 0} days</span></div>
        </div>
    `;
}

// ============================================================
//  FACULTY DATA
// ============================================================

const facultyData = [
    { name: 'Mrs. GANGAMMA G', subject: 'Applied Mathematics-II', dept: 'Mathematics', photo: '👩‍🏫' },
    { name: 'Dr. N M KOTTURESHWARA', subject: 'Applied Chemistry', dept: 'Chemistry', photo: '👨‍🏫' },
    { name: 'Dr. PUNEETH GJ', subject: 'Introduction to AI', dept: 'CSE', photo: '👨‍🏫' },
    { name: 'Mrs. MEENAKSHI', subject: 'Intro to Electrical Engg', dept: 'EEE', photo: '👩‍🏫' },
    { name: 'Dr. PAMPAPATHI BM', subject: 'Python Programming', dept: 'CSE', photo: '👨‍🏫' },
    { name: 'Mr. RAJISHEKAR D', subject: 'Communication Skills', dept: 'English', photo: '👨‍🏫' },
    { name: 'Mr. MANOHAR P', subject: 'Indian Constitution & Ethics', dept: 'Social Science', photo: '👨‍🏫' }
];

// ============================================================
//  FACULTY PAGE
// ============================================================

function renderFacultyPage() {
    const container = document.getElementById('facultyPageContent');
    if (!container) return;

    const ratings = JSON.parse(localStorage.getItem('facultyRatings')) || {};

    let html = `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
    `;

    facultyData.forEach(f => {
        const rating = ratings[f.name] || 0;
        const stars = getStarHTML(rating);
        html += `
            <div class="faculty-card" style="background:var(--bg-card); border-radius:var(--radius); padding:20px; text-align:center; border:1px solid var(--border-color); transition:all var(--transition); cursor:pointer;" onclick="openFacultyDetail('${f.name}')">
                <div style="font-size:64px; margin-bottom:10px;">${f.photo}</div>
                <h4 style="font-size:16px; font-weight:700;">${f.name}</h4>
                <p style="font-size:13px; color:var(--text-secondary);">${f.subject}</p>
                <p style="font-size:12px; color:var(--text-secondary);">${f.dept}</p>
                <div style="margin-top:8px; font-size:20px;">${stars}</div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function getStarHTML(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '⭐' : '☆';
    }
    return stars;
}

// ============================================================
//  FACULTY RATING - FIXED (NO LAG)
// ============================================================

let currentFacultyName = '';
let facultyRatingStar = 0;

function openFacultyDetail(facultyName) {
    const faculty = facultyData.find(f => f.name === facultyName);
    if (!faculty) return;

    const ratings = JSON.parse(localStorage.getItem('facultyRatings')) || {};
    currentFacultyName = facultyName;
    facultyRatingStar = ratings[facultyName] || 0;

    document.getElementById('modalFacultyName').textContent = facultyName;
    document.getElementById('modalFacultySubject').textContent = faculty.subject;
    document.getElementById('modalFacultyDept').textContent = faculty.dept;
    document.getElementById('modalFacultyPhoto').textContent = faculty.photo;

    // Clear and reset stars
    const stars = document.querySelectorAll('#starContainer2 .star');
    stars.forEach(s => {
        const val = parseInt(s.dataset.value);
        if (val <= facultyRatingStar) {
            s.classList.add('active');
            s.textContent = '⭐';
        } else {
            s.classList.remove('active');
            s.textContent = '☆';
        }
    });

    document.getElementById('facultyDetailModal').classList.add('active');
}

function closeFacultyDetail() {
    document.getElementById('facultyDetailModal').classList.remove('active');
}

function submitFacultyRating() {
    if (facultyRatingStar === 0) {
        showToast('⚠️ Please select a rating');
        return;
    }

    const ratings = JSON.parse(localStorage.getItem('facultyRatings')) || {};
    ratings[currentFacultyName] = facultyRatingStar;
    localStorage.setItem('facultyRatings', JSON.stringify(ratings));

    // Close modal FIRST
    document.getElementById('facultyDetailModal').classList.remove('active');

    // Then update UI
    setTimeout(() => {
        renderFacultyPage();
        renderFacultySummary();
        renderQuickStats();
        showToast(`⭐ Rated ${currentFacultyName} with ${facultyRatingStar} stars!`);
    }, 200);
}

// ============================================================
//  HOME RATING - FIXED (NO LAG)
// ============================================================

let currentFaculty = '';
let homeRatingStar = 0;

function openRatingModal(facultyName) {
    const ratings = JSON.parse(localStorage.getItem('facultyRatings')) || {};
    currentFaculty = facultyName;
    homeRatingStar = ratings[facultyName] || 0;

    document.getElementById('modalFacultyName').textContent = facultyName;

    // Clear and reset stars
    const stars = document.querySelectorAll('#starContainer .star');
    stars.forEach(s => {
        const val = parseInt(s.dataset.value);
        if (val <= homeRatingStar) {
            s.classList.add('active');
            s.textContent = '⭐';
        } else {
            s.classList.remove('active');
            s.textContent = '☆';
        }
    });

    document.getElementById('ratingModal').classList.add('active');
}

function closeRatingModal() {
    document.getElementById('ratingModal').classList.remove('active');
}

function submitRating() {
    if (homeRatingStar === 0) {
        showToast('⚠️ Please select a rating');
        return;
    }

    const ratings = JSON.parse(localStorage.getItem('facultyRatings')) || {};
    ratings[currentFaculty] = homeRatingStar;
    localStorage.setItem('facultyRatings', JSON.stringify(ratings));

    // Close modal FIRST
    document.getElementById('ratingModal').classList.remove('active');

    // Then update UI
    setTimeout(() => {
        renderFacultySummary();
        renderQuickStats();
        showToast(`⭐ Rated ${currentFaculty} with ${homeRatingStar} stars!`);
    }, 200);
}

// ============================================================
//  STAR CLICK HANDLER - CLEAN VERSION
// ============================================================

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('star')) {
        const container = e.target.closest('.stars');
        if (!container) return;
        
        const value = parseInt(e.target.dataset.value);
        const stars = container.querySelectorAll('.star');
        
        // Update stars visually with ⭐ and ☆
        stars.forEach(s => {
            const val = parseInt(s.dataset.value);
            if (val <= value) {
                s.classList.add('active');
                s.textContent = '⭐';
            } else {
                s.classList.remove('active');
                s.textContent = '☆';
            }
        });

        // Update the correct variable based on which modal
        if (container.id === 'starContainer' || container.closest('#ratingModal')) {
            homeRatingStar = value;
        } else if (container.id === 'starContainer2' || container.closest('#facultyDetailModal')) {
            facultyRatingStar = value;
        }
    }
});

// ============================================================
//  PAGE NAVIGATION
// ============================================================

function showDashboard() {
    document.getElementById('dashboardPage').style.display = 'block';
    document.getElementById('facultyPage').style.display = 'none';
    document.getElementById('settingsPage').style.display = 'none';
    closeSidebar();
}

function showFacultyPage() {
    document.getElementById('dashboardPage').style.display = 'none';
    document.getElementById('facultyPage').style.display = 'block';
    document.getElementById('settingsPage').style.display = 'none';
    renderFacultyPage();
    closeSidebar();
}

function showSettings() {
    document.getElementById('dashboardPage').style.display = 'none';
    document.getElementById('facultyPage').style.display = 'none';
    document.getElementById('settingsPage').style.display = 'block';
    closeSidebar();
    updateNotifButton();
}

// ============================================================
//  MODAL FUNCTIONS
// ============================================================

function closeModal() {
    document.getElementById('detailModal').classList.remove('active');
}

function openModal(title, subtitle, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalSubtitle').textContent = subtitle;
    document.getElementById('modalContent').innerHTML = content;
    document.getElementById('detailModal').classList.add('active');
}

// ============================================================
//  STATS CARD CLICK HANDLERS
// ============================================================

function showAllSubjects() {
    let html = '<div style="max-height:400px; overflow-y:auto;">';
    subjectsData.forEach((sub, i) => {
        html += `
            <div class="modal-item">
                <span class="label">${i+1}. ${sub.code}</span>
                <span class="value">${sub.name}</span>
            </div>
        `;
    });
    html += '</div>';
    openModal('📚 All Subjects', `Total: ${getTotalSubjects()} subjects`, html);
}

function showAttendanceDetails() {
    const avg = getOverallAttendance().toFixed(1);
    let html = `
        <div style="margin-bottom:12px;">
            <strong>Overall: ${avg}%</strong>
            <div style="font-size:12px; color:var(--text-secondary);">
                ${subjectsData.filter(s => s.attendance >= 85).length} above 85%
            </div>
        </div>
        <div style="max-height:350px; overflow-y:auto;">
    `;

    subjectsData.forEach((sub) => {
        const status = getStatus(sub.attendance);
        const emoji = status === 'good' ? '✅' : status === 'warning' ? '⚠️' : '❌';
        const color = status === 'good' ? '#10b981' : status === 'warning' ? '#f59e0b' : '#ef4444';

        html += `
            <div class="modal-item">
                <span class="label">${emoji} ${sub.code}</span>
                <span class="value" style="font-weight:700; color:${color}">
                    ${sub.attendance}%
                </span>
            </div>
        `;
    });

    html += '</div>';
    openModal('📊 Attendance Details', 'Subject-wise breakdown', html);
}

function showCIEDetails() {
    let html = `
        <div style="margin-bottom:10px; font-size:12px; color:var(--text-secondary);">
            Best 2 of 3 CIE exams are considered
        </div>
        <div style="max-height:400px; overflow-y:auto;">
    `;

    subjectsData.forEach((sub) => {
        const avgCIE = getAvgCIE(sub).toFixed(1);
        const bestTwo = getBestTwo(sub);

        html += `
            <div style="margin-bottom:14px; padding:12px; background:var(--bg-primary); border-radius:12px;">
                <div style="font-weight:600; font-size:13px; margin-bottom:4px;">${sub.code}</div>
                <div class="modal-grid">
                    <div class="cie-cell">
                        <div class="cie-label">CIE-1</div>
                        <div class="cie-value ${getCIEStatus(sub.cie[0])}">${sub.cie[0]}</div>
                    </div>
                    <div class="cie-cell">
                        <div class="cie-label">CIE-2</div>
                        <div class="cie-value ${getCIEStatus(sub.cie[1])}">${sub.cie[1]}</div>
                    </div>
                    <div class="cie-cell">
                        <div class="cie-label">CIE-3</div>
                        <div class="cie-value ${getCIEStatus(sub.cie[2])}">${sub.cie[2]}</div>
                    </div>
                </div>
                <div style="text-align:center; margin-top:4px; font-size:11px; color:var(--text-secondary);">
                    Avg: ${avgCIE}/25 · Best 2: ${bestTwo}/50
                </div>
            </div>
        `;
    });

    html += '</div>';
    openModal('📝 CIE Marks', 'CIE-1, CIE-2, CIE-3 for each subject', html);
}

function showBelow85() {
    const below = getBelow85();

    if (below.length === 0) {
        openModal('🎉 Great Job!', 'All subjects above 85%!',
            '<div style="text-align:center; padding:20px; font-size:48px;">🎉</div><p style="text-align:center;">Keep it up! 💪</p>'
        );
        return;
    }

    let html = `
        <div style="margin-bottom:10px; color:#ef4444; font-weight:600;">
            ⚠️ ${below.length} subject(s) below 85%
        </div>
        <div style="max-height:350px; overflow-y:auto;">
    `;

    below.forEach((sub) => {
        html += `
            <div class="modal-item">
                <span class="label">${sub.code}</span>
                <span class="value" style="color:#ef4444; font-weight:700;">${sub.attendance}%</span>
            </div>
        `;
    });

    html += '</div>';
    openModal('⚠️ Below 85%', 'Subjects that need attention', html);
}

// ============================================================
//  TIMETABLE GALLERY - ALL 10 BRANCHES
// ============================================================

const timetables = {
    'cse_a': 'images/cse_a_timetable.jpg',
    'cse_b': 'images/cse_b_timetable.jpg',
    'cs_ds': 'images/cs_ds_timetable.jpg',
    'cs_cb': 'images/cs_cb_timetable.jpg',
    'cs_aiml': 'images/cs_aiml_timetable.jpg',
    'ise': 'images/ise_timetable.jpg',
    'ece': 'images/ece_timetable.jpg',
    'eee': 'images/eee_timetable.jpg',
    'ce': 'images/ce_timetable.jpg',
    'me': 'images/me_timetable.jpg'
};

function showTimetable(branch, btn) {
    document.querySelectorAll('.timetable-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const container = document.getElementById('timetableContainer');
    const imgPath = timetables[branch];

    fetch(imgPath)
        .then(response => {
            if (!response.ok) throw new Error('Image not found');
            container.innerHTML = `<img src="${imgPath}" alt="Timetable - ${branch.toUpperCase()}">`;
        })
        .catch(() => {
            container.innerHTML = `
                <div class="placeholder-text">
                    <i class="fas fa-image"></i>
                    <p>No timetable image yet</p>
                    <p style="font-size:12px; opacity:0.5;">Add <strong>${branch}_timetable.jpg</strong></p>
                </div>
            `;
        });
}

// ============================================================
//  RENDER DASHBOARD
// ============================================================

function renderDashboard() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') return;

    renderSubjects();
    renderFacultySummary();
    renderQuickStats();
    renderAllFeatures();

    // Update stats numbers
    updateStatsNumbers();

    // Initialize charts
    setTimeout(initCharts, 400);
}

function updateStatsNumbers() {
    animateNumber('totalSubjects', getTotalSubjects());
    animateNumber('overallAttendance', getOverallAttendance(), 1);
    animateNumber('cieAverage', getOverallCIE(), 1);
    animateNumber('below85', getBelow85().length);

    // Update streak card
    const streak = parseInt(localStorage.getItem('streak')) || 0;
    const streakCard = document.getElementById('streakCardCount');
    if (streakCard) {
        streakCard.textContent = streak;
    }
}

function animateNumber(id, target, decimals = 0) {
    const el = document.getElementById(id);
    if (!el) return;

    const start = 0;
    const duration = 1000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + (target - start) * eased;

        if (id === 'overallAttendance') {
            el.textContent = current.toFixed(decimals) + '%';
        } else if (id === 'cieAverage') {
            el.textContent = current.toFixed(decimals);
        } else {
            el.textContent = Math.round(current);
        }

        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ============================================================
//  SIDEBAR FUNCTIONS
// ============================================================

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('active');
    document.body.style.overflow = document.getElementById('sidebar').classList.contains('open') ? 'hidden' : '';
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
//  ABOUT DEVELOPER
// ============================================================

function showAboutDeveloper() {
    document.getElementById('aboutModal').classList.add('active');
}

function closeAboutModal() {
    document.getElementById('aboutModal').classList.remove('active');
}

// ============================================================
//  THEME
// ============================================================

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    const icon = document.getElementById('themeIcon');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    updateChartColors();
}

function loadTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    const icon = document.getElementById('themeIcon');
    icon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ============================================================
//  TOAST
// ============================================================

let toastTimeout;

function showToast(msg) {
    const toast = document.getElementById('toast');
    const message = document.getElementById('toastMessage');
    message.textContent = msg;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================================================
//  DATE
// ============================================================

function setDate() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    document.getElementById('currentDate').textContent = dateStr;
    document.getElementById('lastUpdated').textContent = 'Last updated: ' + dateStr;
}

// ============================================================
//  CLOSE MODALS ON OVERLAY CLICK
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Close modals on overlay click
    document.getElementById('detailModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    document.getElementById('ratingModal').addEventListener('click', function(e) {
        if (e.target === this) closeRatingModal();
    });

    document.getElementById('aboutModal').addEventListener('click', function(e) {
        if (e.target === this) closeAboutModal();
    });

    document.getElementById('facultyDetailModal').addEventListener('click', function(e) {
        if (e.target === this) closeFacultyDetail();
    });

    // Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSidebar();
            closeAboutModal();
            closeFacultyDetail();
        }
    });
});

// ============================================================
//  SETTINGS FUNCTIONS
// ============================================================

function updateNotifButton() {
    const notifEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
    const btn = document.getElementById('notifToggleBtn');
    if (btn) {
        btn.textContent = notifEnabled ? 'Disable' : 'Enable';
        btn.className = notifEnabled ? 'btn btn-danger btn-sm' : 'btn btn-primary btn-sm';
    }
}

function setDefaultGoal(goal) {
    localStorage.setItem('defaultGoal', goal);
    showToast(`🎯 Default goal set to ${goal}%`);
}

function toggleNotifications() {
    const current = localStorage.getItem('notificationsEnabled');
    const newState = current === 'false' ? 'true' : 'false';
    localStorage.setItem('notificationsEnabled', newState);
    updateNotifButton();
    showToast(`🔔 Notifications ${newState === 'true' ? 'enabled' : 'disabled'}`);
}

function refreshData() {
    showToast('🔄 Refreshing data...');
    setTimeout(() => {
        renderDashboard();
        showToast('✅ Data refreshed!');
    }, 1000);
}

// ============================================================
//  EXPORT PDF FUNCTION
// ============================================================

function exportPDF() {
    showToast('📄 Generating report...');

    // Get student info
    const name = localStorage.getItem('userName') || 'VIRESH RANJANAGI';
    const usn = localStorage.getItem('userUSN') || '3VC25CS107';
    const branch = 'Computer Science & Engineering';
    const semester = 'II (2nd Semester)';
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    // Calculate stats
    const overallAtt = getOverallAttendance().toFixed(1);
    const avgCIE = getOverallCIE().toFixed(1);
    const below85 = getBelow85().length;
    const streak = localStorage.getItem('streak') || 0;

    // Get faculty ratings
    const ratings = JSON.parse(localStorage.getItem('facultyRatings')) || {};

    // Build HTML content for PDF
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Academic Report - ${usn}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Segoe UI', Arial, sans-serif;
                background: #fff;
                padding: 40px;
                max-width: 900px;
                margin: 0 auto;
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #4f7df3;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header .title {
                font-size: 32px;
                font-weight: 800;
                color: #1a2332;
                letter-spacing: 1px;
            }
            .header .title span { color: #4f7df3; }
            .section { margin-bottom: 30px; }
            .section-title {
                font-size: 18px;
                font-weight: 700;
                color: #1a2332;
                border-bottom: 2px solid #eaedf2;
                padding-bottom: 8px;
                margin-bottom: 16px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                background: #f5f7fa;
                padding: 16px 20px;
                border-radius: 12px;
            }
            .info-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
            }
            .info-item .label { font-weight: 600; color: #1a2332; }
            .info-item .value { color: #4f7df3; font-weight: 600; }
            .stats-grid {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr;
                gap: 12px;
            }
            .stat-box {
                background: #f5f7fa;
                padding: 14px;
                border-radius: 10px;
                text-align: center;
            }
            .stat-box .number {
                font-size: 24px;
                font-weight: 800;
                color: #1a2332;
            }
            .stat-box .label {
                font-size: 12px;
                color: #6b7a8f;
                margin-top: 2px;
            }
            .stat-box.good .number { color: #10b981; }
            .stat-box.warning .number { color: #f59e0b; }
            .stat-box.danger .number { color: #ef4444; }
            .stat-box.accent .number { color: #4f7df3; }
            table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
            }
            table th {
                background: #4f7df3;
                color: #fff;
                padding: 10px 12px;
                text-align: left;
            }
            table td {
                padding: 8px 12px;
                border-bottom: 1px solid #eaedf2;
            }
            table tr:hover { background: #f5f7fa; }
            table .att-good { color: #10b981; font-weight: 700; }
            table .att-warning { color: #f59e0b; font-weight: 700; }
            table .att-danger { color: #ef4444; font-weight: 700; }
            .footer {
                text-align: center;
                border-top: 2px solid #eaedf2;
                padding-top: 20px;
                margin-top: 30px;
                font-size: 12px;
                color: #6b7a8f;
            }
            .footer .brand { color: #4f7df3; font-weight: 600; }
            @media print {
                body { padding: 20px; }
                .stat-box { background: #f5f7fa; }
            }
        </style>
    </head>
    <body>

        <!-- HEADER -->
        <div class="header">
            <div class="title">📊 <span>Academic</span> Report</div>
        </div>

        <!-- STUDENT INFO -->
        <div class="section">
            <div class="section-title">👤 Student Information</div>
            <div class="info-grid">
                <div class="info-item"><span class="label">Name:</span> <span class="value">${name}</span></div>
                <div class="info-item"><span class="label">USN:</span> <span class="value">${usn}</span></div>
                <div class="info-item"><span class="label">Branch:</span> <span class="value">${branch}</span></div>
                <div class="info-item"><span class="label">Semester:</span> <span class="value">${semester}</span></div>
                <div class="info-item"><span class="label">Report Date:</span> <span class="value">${date}</span></div>
                <div class="info-item"><span class="label">🔥 Streak:</span> <span class="value">${streak} days</span></div>
            </div>
        </div>

        <!-- PERFORMANCE SUMMARY -->
        <div class="section">
            <div class="section-title">📊 Performance Summary</div>
            <div class="stats-grid">
                <div class="stat-box accent">
                    <div class="number">${overallAtt}%</div>
                    <div class="label">Overall Attendance</div>
                </div>
                <div class="stat-box accent">
                    <div class="number">${avgCIE}/25</div>
                    <div class="label">Avg CIE Marks</div>
                </div>
                <div class="stat-box ${below85 > 0 ? 'danger' : 'good'}">
                    <div class="number">${below85}</div>
                    <div class="label">Subjects Below 85%</div>
                </div>
                <div class="stat-box good">
                    <div class="number">${subjectsData.filter(s => s.attendance >= 85).length}</div>
                    <div class="label">Subjects Above 85%</div>
                </div>
            </div>
        </div>

        <!-- SUBJECT-WISE REPORT -->
        <div class="section">
            <div class="section-title">📚 Subject-Wise Report</div>
            <table>
                <thead>
                    <tr><th>#</th><th>Subject Code</th><th>Subject Name</th><th>Attendance</th><th>CIE (Best 2)</th></tr>
                </thead>
                <tbody>
                    ${subjectsData.map((sub, i) => {
                        const status = getStatus(sub.attendance);
                        const attClass = status === 'good' ? 'att-good' : status === 'warning' ? 'att-warning' : 'att-danger';
                        const bestTwo = getBestTwo(sub);
                        return `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${sub.code}</td>
                                <td>${sub.name}</td>
                                <td class="${attClass}">${sub.attendance}%</td>
                                <td>${bestTwo}/50</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <!-- CIE MARKS BREAKDOWN -->
        <div class="section">
            <div class="section-title">📝 CIE Marks Breakdown</div>
            <table>
                <thead>
                    <tr><th>Subject</th><th>CIE-1</th><th>CIE-2</th><th>CIE-3</th><th>Best 2</th></tr>
                </thead>
                <tbody>
                    ${subjectsData.map(sub => {
                        const bestTwo = getBestTwo(sub);
                        return `
                            <tr>
                                <td>${sub.code}</td>
                                <td>${sub.cie[0]}/25</td>
                                <td>${sub.cie[1]}/25</td>
                                <td>${sub.cie[2]}/25</td>
                                <td><strong>${bestTwo}/50</strong></td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <!-- FACULTY RATINGS -->
        <div class="section">
            <div class="section-title">⭐ Faculty Ratings</div>
            <table>
                <thead>
                    <tr><th>Faculty Name</th><th>Subject</th><th>Rating</th></tr>
                </thead>
                <tbody>
                    ${facultyData.map(f => {
                        const rating = ratings[f.name] || 0;
                        const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
                        return `
                            <tr>
                                <td>${f.name}</td>
                                <td>${f.subject}</td>
                                <td>${stars}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <!-- IMPORTANT DATES -->
        <div class="section">
            <div class="section-title">📌 Important Dates</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; background:#f5f7fa; padding:16px 20px; border-radius:12px; font-size:14px;">
                <div>📝 CIE-1: 06-04-2026</div>
                <div>📝 CIE-2: 07-05-2026</div>
                <div>📝 CIE-3: 08-06-2026</div>
                <div>🔬 Practical Exam: 16-06-2026</div>
                <div>📖 Theory Exam: 29-06-2026</div>
                <div>🚀 85% attendance needed for eligibility</div>
            </div>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <p>✨ Generated by <span class="brand">Student Dashboard</span></p>
            <p style="margin-top:4px;">© 2026 · Built with ❤️ by Viresh</p>
        </div>

    </body>
    </html>
    `;

    // Open in new window for printing/saving as PDF
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();

    setTimeout(() => {
        win.print();
        showToast('📄 Report ready!');
    }, 500);
}

// ============================================================
//  INITIALIZATION
// ============================================================

function init() {
    loadTheme();

    const isLoggedIn = checkLoginStatus();

    if (isLoggedIn) {
        // Start auto-refresh for ksign
        if (typeof startAutoRefresh === 'function') {
            startAutoRefresh();
        }
        
        // Check ksign on load
        if (typeof checkKsignOnLoad === 'function') {
            checkKsignOnLoad().then(ksign => {
                if (ksign) {
                    console.log('✅ Session ready');
                }
            });
        }
        
        renderDashboard();

        setTimeout(() => {
            const firstBtn = document.querySelector('.timetable-btn.active');
            if (firstBtn) showTimetable('cse_a', firstBtn);
        }, 600);
    }

    setDate();

    console.log('🚀 Student Dashboard v13.0 - Complete! 😆🔥');
    console.log('📊 Settings page with export, notifications, goals');
    console.log('💫 Auto-refresh system ready');
}
// ============================================================
//  COLLEGE EVENTS
// ============================================================

function showCollegeEvents() {
    openModal(
        '📅 College Events',
        'Stay tuned for upcoming events!',
        `
        <div style="text-align:center; padding:30px 20px;">
            <div style="font-size:64px; margin-bottom:16px;">📅</div>
            <h3 style="font-size:20px; font-weight:700; color:var(--text-primary); margin-bottom:8px;">
                🚀 Coming Soon!
            </h3>
            <p style="color:var(--text-secondary); font-size:14px; max-width:300px; margin:0 auto;">
                We're working on bringing you all the latest college events, workshops, and important dates in one place!
            </p>
            <div style="margin-top:20px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                <span style="background:var(--bg-primary); padding:6px 16px; border-radius:20px; font-size:12px; color:var(--text-secondary);">🎯 Workshops</span>
                <span style="background:var(--bg-primary); padding:6px 16px; border-radius:20px; font-size:12px; color:var(--text-secondary);">🏆 Competitions</span>
                <span style="background:var(--bg-primary); padding:6px 16px; border-radius:20px; font-size:12px; color:var(--text-secondary);">🎓 Guest Lectures</span>
                <span style="background:var(--bg-primary); padding:6px 16px; border-radius:20px; font-size:12px; color:var(--text-secondary);">🎉 Festivals</span>
            </div>
            <div style="margin-top:16px; padding:12px; background:var(--accent-light); border-radius:10px; border:1px dashed var(--accent);">
                <p style="font-size:13px; color:var(--text-secondary);">
                    💡 <strong>Pro Tip:</strong> Check back here for upcoming events!
                </p>
            </div>
        </div>
        `
    );
}
// Initialize when page loads
init();

// ============================================================
//  EXPOSE FUNCTIONS GLOBALLY
// ============================================================

window.renderDashboard = renderDashboard;
window.renderSubjects = renderSubjects;
window.renderFacultySummary = renderFacultySummary;
window.renderQuickStats = renderQuickStats;
window.renderFacultyPage = renderFacultyPage;
window.updateStatsNumbers = updateStatsNumbers;
window.animateNumber = animateNumber;
window.closeModal = closeModal;
window.openModal = openModal;
window.showAllSubjects = showAllSubjects;
window.showAttendanceDetails = showAttendanceDetails;
window.showCIEDetails = showCIEDetails;
window.showBelow85 = showBelow85;
window.showTimetable = showTimetable;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.scrollToTop = scrollToTop;
window.showAboutDeveloper = showAboutDeveloper;
window.closeAboutModal = closeAboutModal;
window.toggleTheme = toggleTheme;
window.loadTheme = loadTheme;
window.showToast = showToast;
window.openRatingModal = openRatingModal;
window.closeRatingModal = closeRatingModal;
window.submitRating = submitRating;
window.setDate = setDate;
window.showDashboard = showDashboard;
window.showFacultyPage = showFacultyPage;
window.showSettings = showSettings;
window.openFacultyDetail = openFacultyDetail;
window.closeFacultyDetail = closeFacultyDetail;
window.submitFacultyRating = submitFacultyRating;
window.getStarHTML = getStarHTML;
window.facultyData = facultyData;
window.setDefaultGoal = setDefaultGoal;
window.toggleNotifications = toggleNotifications;
window.refreshData = refreshData;
window.exportPDF = exportPDF;
window.updateNotifButton = updateNotifButton;