// ============================================================
//  AUTHENTICATION SYSTEM
// ============================================================

// Student credentials (for demo - in production, this would be server-side)
const validStudents = [
    { usn: '3VC25CS107', name: 'VIRESH RANJANAGI', dob: '15/08/2006' },
    { usn: '3VC25CS001', name: 'A LALITHA', dob: '15/08/2006' },
    { usn: '3VC25CS002', name: 'A LAVANYA', dob: '15/08/2006' },
    { usn: '3VC25CS003', name: 'AHMED BASHA', dob: '15/08/2006' },
    { usn: '3VC25CS004', name: 'AISHWARYA K', dob: '15/08/2006' },
    { usn: '3VC25CS005', name: 'ANANYA S SHETTY', dob: '15/08/2006' },
    { usn: '3VC25CS006', name: 'ANCHE HEMALATHA', dob: '15/08/2006' },
    { usn: '3VC25CS007', name: 'ANIL G', dob: '15/08/2006' },
    { usn: '3VC25CS008', name: 'ANUP MANVI', dob: '15/08/2006' },
    { usn: '3VC25CS009', name: 'B S LINGARAJA', dob: '15/08/2006' },
    { usn: '3VC25CS010', name: 'B SANTHOSH', dob: '15/08/2006' },
];

// ============================================================
//  LOGIN FUNCTIONS
// ============================================================

function handleLogin() {
    const usn = document.getElementById('loginUSN').value.trim().toUpperCase();
    const dob = document.getElementById('loginDOB').value.trim();
    const errorEl = document.getElementById('loginError');

    if (!usn || !dob) {
        errorEl.textContent = '⚠️ Please fill in all fields';
        errorEl.classList.add('show');
        return;
    }

    const student = validStudents.find(s => s.usn === usn && s.dob === dob);

    if (!student) {
        errorEl.textContent = '❌ Invalid USN or DOB. Please try again.';
        errorEl.classList.add('show');
        return;
    }

    errorEl.classList.remove('show');

    localStorage.setItem('userUSN', student.usn);
    localStorage.setItem('userName', student.name);
    localStorage.setItem('userDOB', student.dob);
    localStorage.setItem('isLoggedIn', 'true');

    document.getElementById('loginOverlay').classList.add('hidden');
    updateUserUI(student.name, student.usn);

    showToast(`👋 Welcome back, ${student.name}!`);
    updateStreak();

    if (typeof renderDashboard === 'function') {
        renderDashboard();
    }
}

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');
    const userUSN = localStorage.getItem('userUSN');

    if (isLoggedIn === 'true' && userName) {
        document.getElementById('loginOverlay').classList.add('hidden');
        updateUserUI(userName, userUSN || '3VC25CS107');
        return true;
    }
    return false;
}

function updateUserUI(name, usn) {
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(' ') || '';

    document.getElementById('displayName').innerHTML = `${firstName} <span>${lastName}</span>`;
    document.getElementById('displayUSN').textContent = usn;

    document.getElementById('sidebarName').textContent = name;
    document.getElementById('sidebarUSN').textContent = `${usn} · II Sem CSE A`;
    document.getElementById('sidebarAvatar').textContent = firstName.charAt(0).toUpperCase();
}

// ============================================================
//  LOGOUT FUNCTION
// ============================================================

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userUSN');
    localStorage.removeItem('userDOB');

    document.getElementById('loginOverlay').classList.remove('hidden');

    document.getElementById('sidebarAvatar').textContent = 'V';
    document.getElementById('sidebarName').textContent = 'VIRESH RANJANAGI';
    document.getElementById('sidebarUSN').textContent = '3VC25CS107 · II Sem CSE A';
    document.getElementById('displayName').innerHTML = 'VIRESH <span>RANJANAGI</span>';
    document.getElementById('displayUSN').textContent = '3VC25CS107';

    document.getElementById('loginUSN').value = '';
    document.getElementById('loginDOB').value = '';
    document.getElementById('loginError').classList.remove('show');

    showToast('👋 Logged out successfully!');
}

// ============================================================
//  STREAK TRACKER
// ============================================================

function updateStreak() {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('lastVisit');
    const streak = parseInt(localStorage.getItem('streak')) || 0;

    if (!lastVisit) {
        localStorage.setItem('streak', '1');
        localStorage.setItem('lastVisit', today);
        document.getElementById('streakCount').textContent = '1';
        return;
    }

    if (lastVisit === today) {
        document.getElementById('streakCount').textContent = streak;
        return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastVisit === yesterdayStr) {
        const newStreak = streak + 1;
        localStorage.setItem('streak', newStreak.toString());
        localStorage.setItem('lastVisit', today);
        document.getElementById('streakCount').textContent = newStreak;
    } else {
        localStorage.setItem('streak', '1');
        localStorage.setItem('lastVisit', today);
        document.getElementById('streakCount').textContent = '1';
    }
}

// ============================================================
//  KEYBOARD SHORTCUTS
// ============================================================

document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const loginOverlay = document.getElementById('loginOverlay');
        if (!loginOverlay.classList.contains('hidden')) {
            handleLogin();
        }
    }
});

// ============================================================
//  EXPOSE FUNCTIONS GLOBALLY
// ============================================================

window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.checkLoginStatus = checkLoginStatus;
window.updateUserUI = updateUserUI;
window.updateStreak = updateStreak;

console.log('🔐 Auth system loaded successfully!');
console.log(`👥 ${validStudents.length} students registered.`);