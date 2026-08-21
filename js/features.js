// ============================================================
//  FEATURES: WARNING, RANKING, GOALS, NOTIFICATIONS, BADGES
// ============================================================

// ============================================================
//  1. 🔥 ATTENDANCE WARNING / PREDICTION
// ============================================================

function getAttendanceWarnings() {
    const warnings = [];
    const target = 85;

    subjectsData.forEach(sub => {
        const current = sub.attendance;
        if (current >= target) {
            warnings.push({
                subject: sub,
                status: 'safe',
                message: '✅ Safe!',
                icon: '✅'
            });
        } else {
            const needed = Math.ceil((target - current) / 2);
            warnings.push({
                subject: sub,
                status: 'danger',
                message: `⚠️ Need ${needed} more classes to reach ${target}%`,
                icon: '⚠️'
            });
        }
    });

    return warnings;
}

function renderWarnings() {
    const container = document.getElementById('warningList');
    if (!container) return;

    const warnings = getAttendanceWarnings();

    if (warnings.length === 0) {
        container.innerHTML = `<p style="color: var(--text-secondary); text-align:center; padding:10px;">No warnings! 🎉</p>`;
        return;
    }

    let html = '';
    warnings.forEach(w => {
        const statusClass = w.status === 'safe' ? 'safe' : 'danger';
        html += `
            <div class="warning-item">
                <span class="warning-icon">${w.icon}</span>
                <span class="warning-text">
                    <span class="subject-code">${w.subject.code}</span>
                    ${w.subject.name} (${w.subject.attendance}%)
                </span>
                <span class="warning-status ${statusClass}">${w.message}</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ============================================================
//  2. 🏆 SUBJECT RANKING
// ============================================================

function renderRanking() {
    const container = document.getElementById('rankingList');
    if (!container) return;

    const ranked = getSubjectRanking();
    const medals = ['🥇', '🥈', '🥉'];

    let html = '';
    ranked.forEach((sub, index) => {
        const rank = index + 1;
        const medal = rank <= 3 ? medals[index] : `#${rank}`;
        const status = getStatus(sub.attendance);

        html += `
            <div class="ranking-item">
                <span class="rank-number">${medal}</span>
                <span class="rank-name">${sub.code} - ${sub.name}</span>
                <span class="rank-attendance ${status}">${sub.attendance}%</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ============================================================
//  3. 🎯 GOAL SETTING
// ============================================================

function getGoals() {
    const goals = JSON.parse(localStorage.getItem('goals')) || {};
    return goals;
}

function saveGoals(goals) {
    localStorage.setItem('goals', JSON.stringify(goals));
}

function setGoal(subjectCode, target) {
    const goals = getGoals();
    goals[subjectCode] = parseInt(target);
    saveGoals(goals);
    renderGoals();
    showToast(`🎯 Goal set for ${subjectCode}: ${target}%`);
}

function getGoalProgress(sub) {
    const goals = getGoals();
    const target = goals[sub.code] || 85;
    const current = sub.attendance;
    const progress = Math.min((current / target) * 100, 100);
    return { target, progress, current };
}

function renderGoals() {
    const container = document.getElementById('goalList');
    if (!container) return;

    let html = '';
    subjectsData.forEach(sub => {
        const { target, progress, current } = getGoalProgress(sub);
        const isComplete = progress >= 100;
        const statusText = isComplete ? '✅ Achieved!' : `${current}% → ${target}%`;

        html += `
            <div class="goal-item">
                <div class="goal-header">
                    <span class="goal-subject">${sub.code}</span>
                    <span class="goal-target">🎯 ${statusText}</span>
                </div>
                <div class="goal-progress">
                    <div class="goal-fill ${isComplete ? 'complete' : ''}" style="width: ${progress}%;"></div>
                </div>
                <div style="display:flex; gap:8px; margin-top:6px; flex-wrap:wrap;">
                    <button class="btn btn-sm btn-primary" onclick="setGoal('${sub.code}', 90)">90%</button>
                    <button class="btn btn-sm btn-secondary" onclick="setGoal('${sub.code}', 85)">85%</button>
                    <button class="btn btn-sm btn-secondary" onclick="setGoal('${sub.code}', 80)">80%</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ============================================================
//  4. 🔔 SMART NOTIFICATIONS
// ============================================================

function checkNotifications() {
    const notifications = [];

    // Check low attendance
    const below85 = getBelow85();
    below85.forEach(sub => {
        notifications.push({
            icon: '⚠️',
            text: `${sub.code}: ${sub.attendance}% - below 85%!`,
            time: 'Now'
        });
    });

    // Check upcoming exams
    const today = new Date();
    const examDates = [
        { name: 'CIE-1', date: '2026-04-06' },
        { name: 'CIE-2', date: '2026-05-07' },
        { name: 'CIE-3', date: '2026-06-08' },
        { name: 'Practical Exam', date: '2026-06-16' },
        { name: 'Theory Exam', date: '2026-06-29' }
    ];

    examDates.forEach(exam => {
        const examDate = new Date(exam.date);
        const diffTime = examDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 7 && diffDays > 0) {
            notifications.push({
                icon: '📝',
                text: `${exam.name} is in ${diffDays} days!`,
                time: `${diffDays}d left`
            });
        } else if (diffDays === 0) {
            notifications.push({
                icon: '🔴',
                text: `${exam.name} is TODAY!`,
                time: 'Today!'
            });
        }
    });

    return notifications;
}

function renderNotifications() {
    const container = document.getElementById('notificationList');
    const countEl = document.getElementById('notificationCount');
    if (!container) return;

    const notifications = checkNotifications();

    countEl.textContent = notifications.length;

    if (notifications.length === 0) {
        container.innerHTML = `<p style="color: var(--text-secondary); text-align:center; padding:10px;">🎉 No new notifications!</p>`;
        return;
    }

    let html = '';
    notifications.forEach(n => {
        html += `
            <div class="notification-item">
                <span class="notif-icon">${n.icon}</span>
                <span class="notif-text">${n.text}</span>
                <span class="notif-time">${n.time}</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ============================================================
//  5. 🏅 ACHIEVEMENT BADGES
// ============================================================

function checkBadges() {
    const badges = [];

    const facultyRatings = JSON.parse(localStorage.getItem('facultyRatings')) || {};
    const facultyList = getFacultyList();
    const ratedCount = Object.keys(facultyRatings).length;

    // Badge 1: Perfect Attendance (90%+ in all subjects)
    if (subjectsData.every(s => s.attendance >= 90)) {
        badges.push({
            icon: '🥇',
            name: 'Perfect Attendance',
            desc: '90%+ attendance in all subjects!'
        });
    }

    // Badge 2: Good Attendance (85%+ in all subjects)
    if (subjectsData.every(s => s.attendance >= 85) && !badges.find(b => b.name === 'Perfect Attendance')) {
        badges.push({
            icon: '🥈',
            name: 'Good Attendance',
            desc: '85%+ attendance in all subjects!'
        });
    }

    // Badge 3: Rated all faculties
    if (ratedCount >= facultyList.length) {
        badges.push({
            icon: '⭐',
            name: 'Feedback Pro',
            desc: 'Rated all faculties!'
        });
    } else if (ratedCount >= Math.ceil(facultyList.length / 2)) {
        badges.push({
            icon: '🌟',
            name: 'Feedback Star',
            desc: `Rated ${ratedCount}/${facultyList.length} faculties!`
        });
    }

    // Badge 4: 30-day streak
    const streak = parseInt(localStorage.getItem('streak')) || 0;
    if (streak >= 30) {
        badges.push({
            icon: '🔥',
            name: 'On Fire!',
            desc: '30-day login streak!'
        });
    } else if (streak >= 7) {
        badges.push({
            icon: '💪',
            name: 'Consistent',
            desc: '7-day login streak!'
        });
    }

    // Badge 5: Academic Excellence (A+ in any subject)
    subjectsData.forEach(sub => {
        const avgCIE = getAvgCIE(sub);
        if (avgCIE >= 24) {
            const existing = badges.find(b => b.name === 'Academic Excellence');
            if (!existing) {
                badges.push({
                    icon: '📚',
                    name: 'Academic Excellence',
                    desc: `A+ in ${sub.code}!`
                });
            }
        }
    });

    // Badge 6: First Login
    if (streak >= 1) {
        const existing = badges.find(b => b.name === 'First Login');
        if (!existing) {
            badges.push({
                icon: '👋',
                name: 'First Login',
                desc: 'Welcome to your dashboard!'
            });
        }
    }

    return badges;
}

function renderBadges() {
    const container = document.getElementById('badgeList');
    const countEl = document.getElementById('badgeCount');
    if (!container) return;

    const badges = checkBadges();

    countEl.textContent = badges.length;

    if (badges.length === 0) {
        container.innerHTML = `<p style="color: var(--text-secondary); text-align:center; padding:10px;">🏅 Keep going! Earn badges by achieving milestones.</p>`;
        return;
    }

    let html = '';
    badges.forEach(b => {
        html += `
            <div class="badge-item">
                <span class="badge-icon">${b.icon}</span>
                <div class="badge-info">
                    <div class="badge-name">${b.name}</div>
                    <div class="badge-desc">${b.desc}</div>
                </div>
                <span class="badge-status">✅ Earned!</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ============================================================
//  RENDER ALL FEATURES
// ============================================================

function renderAllFeatures() {
    renderWarnings();
    renderRanking();
    renderGoals();
    renderNotifications();
    renderBadges();
}

// ============================================================
//  EXPOSE FUNCTIONS GLOBALLY
// ============================================================

window.renderWarnings = renderWarnings;
window.renderRanking = renderRanking;
window.renderGoals = renderGoals;
window.renderNotifications = renderNotifications;
window.renderBadges = renderBadges;
window.renderAllFeatures = renderAllFeatures;
window.setGoal = setGoal;
window.getGoals = getGoals;
window.saveGoals = saveGoals;
window.getGoalProgress = getGoalProgress;
window.checkBadges = checkBadges;
window.checkNotifications = checkNotifications;
window.getAttendanceWarnings = getAttendanceWarnings;

console.log('⭐ Features loaded successfully!');
console.log('🔥 Attendance Warning, 🏆 Subject Ranking, 🎯 Goal Setting, 🔔 Notifications, 🏅 Badges');