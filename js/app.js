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
    closeSidebar();
}

function showFacultyPage() {
    document.getElementById('dashboardPage').style.display = 'none';
    document.getElementById('facultyPage').style.display = 'block';
    renderFacultyPage();
    closeSidebar();
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
//  TIMETABLE GALLERY
// ============================================================

const timetables = {
    'cse_a': 'images/cse_a_timetable.jpg',
    'cse_b': 'images/cse_b_timetable.jpg',
    'ece': 'images/ece_timetable.jpg',
    'mech': 'images/mech_timetable.jpg'
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
//  INITIALIZATION
// ============================================================

function init() {
    loadTheme();

    const isLoggedIn = checkLoginStatus();

    if (isLoggedIn) {
        renderDashboard();

        setTimeout(() => {
            const firstBtn = document.querySelector('.timetable-btn.active');
            if (firstBtn) showTimetable('cse_a', firstBtn);
        }, 600);
    }

    setDate();

    console.log('🚀 Student Dashboard v11.0 - Optimized! 😆🔥');
    console.log('📊 No lag, smooth performance!');
}

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
window.openFacultyDetail = openFacultyDetail;
window.closeFacultyDetail = closeFacultyDetail;
window.submitFacultyRating = submitFacultyRating;
window.getStarHTML = getStarHTML;
window.facultyData = facultyData;