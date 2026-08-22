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
//  ALL STUDENTS LIST (For Search)
// ============================================================

const allStudents = [
    { usn: '3VC25CS107', name: 'VIRESH RANJANAGI', branch: 'CSE A' },
    { usn: '3VC25CS001', name: 'A LALITHA', branch: 'CSE A' },
    { usn: '3VC25CS002', name: 'A LAVANYA', branch: 'CSE A' },
    { usn: '3VC25CS003', name: 'AHMED BASHA', branch: 'CSE A' },
    { usn: '3VC25CS004', name: 'AISHWARYA K', branch: 'CSE A' },
    { usn: '3VC25CS005', name: 'ANANYA S SHETTY', branch: 'CSE A' },
    { usn: '3VC25CS006', name: 'ANCHE HEMALATHA', branch: 'CSE A' },
    { usn: '3VC25CS007', name: 'ANIL G', branch: 'CSE A' },
    { usn: '3VC25CS008', name: 'ANUP MANVI', branch: 'CSE A' },
    { usn: '3VC25CS009', name: 'B S LINGARAJA', branch: 'CSE A' },
    { usn: '3VC25CS010', name: 'B SANTHOSH', branch: 'CSE A' },
    { usn: '3VC25CS011', name: 'B SUPRITHA', branch: 'CSE A' },
    { usn: '3VC25CS012', name: 'B V SINCHANA', branch: 'CSE A' },
    { usn: '3VC25CS013', name: 'BHAVANA B', branch: 'CSE A' },
    { usn: '3VC25CS015', name: 'CHAITRA', branch: 'CSE A' },
    { usn: '3VC25CS016', name: 'CHANDAN KUMAR K', branch: 'CSE A' },
    { usn: '3VC25CS018', name: 'DAVID RAJ', branch: 'CSE A' },
    { usn: '3VC25CS019', name: 'DEEPA', branch: 'CSE A' },
    { usn: '3VC25CS020', name: 'DIVYA', branch: 'CSE A' },
    { usn: '3VC25CS021', name: 'FATHIMA SHAGUFTA NAAZ', branch: 'CSE A' },
    { usn: '3VC25CS022', name: 'G N VENNELA', branch: 'CSE A' },
    { usn: '3VC25CS023', name: 'GEETHA K', branch: 'CSE A' },
    { usn: '3VC25CS024', name: 'H DIVYASHREE', branch: 'CSE A' },
    { usn: '3VC25CS025', name: 'H K SANIYA', branch: 'CSE A' },
    { usn: '3VC25CS026', name: 'H MAHALAKSHMI', branch: 'CSE A' },
    { usn: '3VC25CS027', name: 'H MAHAMMED KAIF', branch: 'CSE A' },
    { usn: '3VC25CS028', name: 'H UTHEJ', branch: 'CSE A' },
    { usn: '3VC25CS029', name: 'JESHWAR', branch: 'CSE A' },
    { usn: '3VC25CS030', name: 'JEEVITHA H K', branch: 'CSE A' },
    { usn: '3VC25CS031', name: 'K ANANDA', branch: 'CSE A' },
    { usn: '3VC25CS032', name: 'K BASAVARAJ', branch: 'CSE A' },
    { usn: '3VC25CS033', name: 'K BHASKAR', branch: 'CSE A' },
    { usn: '3VC25CS034', name: 'K GIRI KUMAR', branch: 'CSE A' },
    { usn: '3VC25CS035', name: 'K R GURUPRASAD', branch: 'CSE A' },
    { usn: '3VC25CS036', name: 'K R KEERTHANA', branch: 'CSE A' },
    { usn: '3VC25CS037', name: 'K RAKSHITHA', branch: 'CSE A' },
    { usn: '3VC25CS038', name: 'K YOGESH', branch: 'CSE A' },
    { usn: '3VC25CS039', name: 'KAREGOUDARU GAGAN', branch: 'CSE A' },
    { usn: '3VC25CS040', name: 'KASHINATHA', branch: 'CSE A' },
    { usn: '3VC25CS041', name: 'KAVYASHREE', branch: 'CSE A' },
    { usn: '3VC25CS042', name: 'KEERTHANA K', branch: 'CSE A' },
    { usn: '3VC25CS043', name: 'KIRAN', branch: 'CSE A' },
    { usn: '3VC25CS044', name: 'KOLIM MAHAMMAD IRFAN', branch: 'CSE A' },
    { usn: '3VC25CS045', name: 'M SAI SREEJA', branch: 'CSE A' },
    { usn: '3VC25CS046', name: 'M SAVITHA', branch: 'CSE A' },
    { usn: '3VC25CS047', name: 'M SHILPA', branch: 'CSE A' },
    { usn: '3VC25CS048', name: 'MAHESHVARI', branch: 'CSE A' },
    { usn: '3VC25CS049', name: 'MALLIKARJUN', branch: 'CSE A' },
    { usn: '3VC25CS050', name: 'MOHAMMED JELAN B', branch: 'CSE A' },
    { usn: '3VC25CS051', name: 'N H SANIKA', branch: 'CSE A' },
    { usn: '3VC25CS052', name: 'N MANASA', branch: 'CSE A' },
    { usn: '3VC25CS053', name: 'NAGALINGA', branch: 'CSE A' },
];

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
window.allStudents = allStudents;

console.log('📊 Data loaded successfully!');
console.log(`📚 ${subjectsData.length} subjects loaded.`);
console.log(`👥 ${allStudents.length} students loaded.`);