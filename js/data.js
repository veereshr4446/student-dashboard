// ============================================================
//  DATA - All Subjects, Faculty, CIE Marks
// ============================================================

const subjectsData = [
    {
        code: '1BMATS201',
        name: 'APPLIED MATHEMATICS-II',
        attendance: 84,
        cie: [25, 10, 15],
        faculty: 'Mrs. GANGAMMA G'
    },
    {
        code: '1BCHES202',
        name: 'APPLIED CHEMISTRY',
        attendance: 90,
        cie: [24, 23, 22],
        faculty: 'Dr. N M KOTTURESHWARA'
    },
    {
        code: '1BAIA203',
        name: 'INTRODUCTION TO AI',
        attendance: 88,
        cie: [23, 25, 24],
        faculty: 'Dr. PUNEETH GJ'
    },
    {
        code: '1BESC204B',
        name: 'INTRO TO ELECTRICAL ENGG',
        attendance: 85,
        cie: [20, 22, 21],
        faculty: 'Mrs. MEENAKSHI'
    },
    {
        code: '1BPLC205B',
        name: 'PYTHON PROGRAMMING',
        attendance: 82,
        cie: [22, 24, 23],
        faculty: 'Dr. PAMPAPATHI BM'
    },
    {
        code: '1BENG206',
        name: 'COMMUNICATION SKILLS',
        attendance: 83,
        cie: [21, 23, 22],
        faculty: 'Mr. RAJISHEKAR D'
    },
    {
        code: '1BICO207',
        name: 'INDIAN CONSTITUTION & ETHICS',
        attendance: 78,
        cie: [18, 20, 19],
        faculty: 'Mr. MANOHAR P'
    },
    {
        code: '1BPRJ258',
        name: 'INTERDISCIPLINARY PROJECT',
        attendance: 92,
        cie: [24, 25, 25],
        faculty: 'Dr. PUNEETH GJ'
    }
];

// ============================================================
//  HELPER FUNCTIONS
// ============================================================

// Get attendance status (good, warning, danger)
function getStatus(att) {
    if (att >= 85) return 'good';
    if (att >= 70) return 'warning';
    return 'danger';
}

// Get CIE status (high, medium, low)
function getCIEStatus(marks) {
    if (marks >= 20) return 'high';
    if (marks >= 15) return 'medium';
    return 'low';
}

// Calculate average CIE for a subject
function getAvgCIE(sub) {
    return (sub.cie[0] + sub.cie[1] + sub.cie[2]) / 3;
}

// Get best 2 CIE scores
function getBestTwo(sub) {
    const sorted = [...sub.cie].sort((a, b) => b - a);
    return sorted[0] + sorted[1];
}

// Get total subjects count
function getTotalSubjects() {
    return subjectsData.length;
}

// Get overall attendance average
function getOverallAttendance() {
    const total = subjectsData.reduce((sum, sub) => sum + sub.attendance, 0);
    return total / subjectsData.length;
}

// Get subjects below 85%
function getBelow85() {
    return subjectsData.filter(sub => sub.attendance < 85);
}

// Get overall CIE average
function getOverallCIE() {
    const total = subjectsData.reduce((sum, sub) => sum + getAvgCIE(sub), 0);
    return total / subjectsData.length;
}

// Get subject ranking (best to worst by attendance)
function getSubjectRanking() {
    return [...subjectsData].sort((a, b) => b.attendance - a.attendance);
}

// Get unique faculty list
function getFacultyList() {
    return [...new Set(subjectsData.map(s => s.faculty))];
}

// ============================================================
//  EXPOSE DATA GLOBALLY
// ============================================================

window.subjectsData = subjectsData;
window.getStatus = getStatus;
window.getCIEStatus = getCIEStatus;
window.getAvgCIE = getAvgCIE;
window.getBestTwo = getBestTwo;
window.getTotalSubjects = getTotalSubjects;
window.getOverallAttendance = getOverallAttendance;
window.getBelow85 = getBelow85;
window.getOverallCIE = getOverallCIE;
window.getSubjectRanking = getSubjectRanking;
window.getFacultyList = getFacultyList;

console.log('📊 Data loaded successfully!');
console.log(`📚 ${subjectsData.length} subjects loaded.`);