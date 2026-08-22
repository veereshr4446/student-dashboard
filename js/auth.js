// ============================================================
//  AUTHENTICATION SYSTEM WITH AUTO-REFRESH
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
//  K SIGN AUTO-REFRESH SYSTEM
// ============================================================

const K_SIGN_EXPIRY = 3600000; // 1 hour in milliseconds
const REFRESH_INTERVAL = 300000; // 5 minutes in milliseconds

// Save ksign with expiry
function saveKsign(ksign) {
    if (ksign) {
        localStorage.setItem('ksign', ksign);
        localStorage.setItem('ksign_expiry', Date.now() + K_SIGN_EXPIRY);
        console.log('✅ ksign saved, expires in 1 hour');
    }
}

// Get valid ksign (auto-refresh if expired)
async function getValidKsign() {
    const ksign = localStorage.getItem('ksign');
    const expiry = parseInt(localStorage.getItem('ksign_expiry')) || 0;
    
    // If ksign exists and not expired, return it
    if (ksign && Date.now() < expiry) {
        return ksign;
    }
    
    // ksign expired or missing - refresh it
    console.log('🔄 ksign expired, refreshing...');
    const newKsign = await refreshKsign();
    
    if (newKsign) {
        saveKsign(newKsign);
        console.log('✅ ksign refreshed successfully!');
        return newKsign;
    }
    
    // Could not refresh - need student to login
    console.log('❌ Could not refresh ksign, need login');
    return null;
}

// Refresh ksign using saved credentials
async function refreshKsign() {
    const usn = localStorage.getItem('userUSN');
    const dob = localStorage.getItem('userDOB');
    
    if (!usn || !dob) {
        console.log('No saved credentials found');
        return null;
    }
    
    try {
        // First, get the CSRF token
        const initPage = await fetch('https://rymec-students.contineo.in/parents/index.php');
        const html = await initPage.text();
        const tokenMatch = html.match(/name="([a-f0-9]{32})" value="1"/);
        const csrfToken = tokenMatch ? tokenMatch[1] : null;
        
        // Build login form data
        const formData = new URLSearchParams({
            username: usn,
            passwd: dob,
            option: 'com_user',
            task: 'login',
            return: 'aW5kZXgucGhw'
        });
        
        if (csrfToken) {
            formData.append(csrfToken, '1');
        }
        
        // Send login request
        const response = await fetch('https://rymec-students.contineo.in/parents/index.php?option=com_user&task=login', {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        });
        
        // Extract ksign from redirect URL
        const url = new URL(response.url);
        const ksign = url.searchParams.get('ksign');
        
        return ksign;
    } catch (error) {
        console.error('Refresh failed:', error);
        return null;
    }
}

// Check and refresh ksign periodically
function startAutoRefresh() {
    setInterval(async () => {
        const ksign = await getValidKsign();
        if (ksign) {
            console.log('✅ ksign is valid');
        } else {
            console.log('⚠️ ksign refresh failed, will try again');
        }
    }, REFRESH_INTERVAL);
}

// Check ksign on page load
async function checkKsignOnLoad() {
    const ksign = await getValidKsign();
    if (ksign) {
        console.log('✅ ksign ready on page load');
        return ksign;
    } else {
        console.log('⚠️ Need to login');
        // Show login prompt if not already showing
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            showToast('⏳ Session expired. Please reconnect to Contineo.');
        }
        return null;
    }
}

// ============================================================
//  LOGIN FUNCTIONS
// ============================================================

async function handleLogin() {
    const usn = document.getElementById('loginUSN').value.trim().toUpperCase();
    const dob = document.getElementById('loginDOB').value.trim();
    const errorEl = document.getElementById('loginError');

    if (!usn || !dob) {
        errorEl.textContent = '⚠️ Please fill in all fields';
        errorEl.classList.add('show');
        return;
    }

    // Check if student exists
    const student = validStudents.find(s => s.usn === usn && s.dob === dob);

    if (!student) {
        errorEl.textContent = '❌ Invalid USN or DOB. Please try again.';
        errorEl.classList.add('show');
        return;
    }

    errorEl.classList.remove('show');

    // Save credentials for auto-refresh
    localStorage.setItem('userUSN', student.usn);
    localStorage.setItem('userDOB', student.dob);
    localStorage.setItem('userName', student.name);
    localStorage.setItem('isLoggedIn', 'true');

    // Login to Contineo to get ksign
    try {
        const ksign = await loginToContineo(student.usn, student.dob);
        if (ksign) {
            saveKsign(ksign);
            console.log('✅ Login successful, ksign saved');
        } else {
            console.log('⚠️ Could not get ksign, but proceeding with demo data');
        }
    } catch (error) {
        console.error('Login error:', error);
    }

    // Update UI
    document.getElementById('loginOverlay').classList.add('hidden');
    updateUserUI(student.name, student.usn);

    // Update streak
    updateStreak();

    // Refresh dashboard
    if (typeof renderDashboard === 'function') {
        renderDashboard();
    }

    showToast(`👋 Welcome back, ${student.name}!`);
}

// Login to Contineo and get ksign
async function loginToContineo(usn, dob) {
    try {
        // Get CSRF token
        const initPage = await fetch('https://rymec-students.contineo.in/parents/index.php');
        const html = await initPage.text();
        const tokenMatch = html.match(/name="([a-f0-9]{32})" value="1"/);
        const csrfToken = tokenMatch ? tokenMatch[1] : null;

        // Build login form
        const formData = new URLSearchParams({
            username: usn,
            passwd: dob,
            option: 'com_user',
            task: 'login',
            return: 'aW5kZXgucGhw'
        });
        
        if (csrfToken) {
            formData.append(csrfToken, '1');
        }

        // Send login request
        const response = await fetch('https://rymec-students.contineo.in/parents/index.php?option=com_user&task=login', {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        });

        // Extract ksign
        const url = new URL(response.url);
        const ksign = url.searchParams.get('ksign');
        return ksign;
    } catch (error) {
        console.error('Login error:', error);
        return null;
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
    // Clear all user data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userUSN');
    localStorage.removeItem('userDOB');
    localStorage.removeItem('ksign');
    localStorage.removeItem('ksign_expiry');

    // Show login screen
    document.getElementById('loginOverlay').classList.remove('hidden');

    // Reset UI
    document.getElementById('sidebarAvatar').textContent = 'V';
    document.getElementById('sidebarName').textContent = 'VIRESH RANJANAGI';
    document.getElementById('sidebarUSN').textContent = '3VC25CS107 · II Sem CSE A';
    document.getElementById('displayName').innerHTML = 'VIRESH <span>RANJANAGI</span>';
    document.getElementById('displayUSN').textContent = '3VC25CS107';

    // Clear login fields
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
window.getValidKsign = getValidKsign;
window.saveKsign = saveKsign;
window.refreshKsign = refreshKsign;
window.startAutoRefresh = startAutoRefresh;
window.checkKsignOnLoad = checkKsignOnLoad;
window.loginToContineo = loginToContineo;

console.log('🔐 Auth system with auto-refresh loaded!');
console.log(`👥 ${validStudents.length} students registered.`);
console.log('⏰ ksign will auto-refresh every 5 minutes');