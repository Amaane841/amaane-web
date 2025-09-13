// Smooth Scroll
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        if (section) section.scrollIntoView({ behavior: 'smooth' });
        if (window.innerWidth <= 768 && section.id !== 'admin') {
            document.querySelector('.nav-menu').classList.remove('active');
        }
    });
});

// Form Submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Message sent! Amaane will get back to you soon.');
    this.reset();
});

// One-time Welcome Animation
let hasVisited = localStorage.getItem('hasVisited');
if (!hasVisited) {
    const welcomeTexts = document.querySelectorAll('.welcome-text');
    welcomeTexts.forEach((text, index) => {
        text.style.opacity = '0';
        setTimeout(() => {
            text.style.transition = 'opacity 1s ease';
            text.style.opacity = '1';
        }, index * 300);
    });
    localStorage.setItem('hasVisited', 'true');
}

// Toggle Mobile Menu
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-menu').classList.toggle('active');
});

// Google Sign-In
function handleCredentialResponse(response) {
    const userData = JSON.parse(atob(response.credential.split('.')[1]));
    const email = userData.email;
    const name = userData.name;
    logVisit(email, 'Signup/Login');
    alert(`Welcome ${name}! You are signed up/logged in with ${email}.`);
    localStorage.setUserData = JSON.stringify({ email, name, isAdmin: email === 'Ad847240@gmail.com' });
    updateAdminLink();
}

// Admin Panel Authentication
document.getElementById('admin-link').addEventListener('click', function(e) {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getUserData || '{}');
    if (userData.isAdmin && prompt('Enter Admin Password:') === 'craftyamaane@gmail.com') {
        document.getElementById('admin').classList.remove('hidden');
        loadLogs();
    } else {
        alert('Access denied. Only admin can view this panel.');
    }
});

function updateAdminLink() {
    const userData = JSON.parse(localStorage.getUserData || '{}');
    const adminLink = document.getElementById('admin-link');
    if (userData.isAdmin) {
        adminLink.style.display = 'block';
    } else {
        adminLink.style.display = 'none';
    }
}

// Tracking Logs
function logVisit(email, action) {
    const log = {
        timestamp: new Date().toLocaleString(),
        email: email || 'Anonymous',
        action: action
    };
    let logs = JSON.parse(localStorage.getItem('logs') || '[]');
    logs.push(log);
    localStorage.setItem('logs', JSON.stringify(logs.slice(-50))); // Limit to last 50 logs
}

function loadLogs() {
    const logs = JSON.parse(localStorage.getItem('logs') || '[]');
    const visitLogs = logs.filter(log => log.action === 'Visit');
    const loginLogs = logs.filter(log => log.action === 'Signup/Login');
    document.getElementById('visit-logs').innerHTML = visitLogs.map(log => `<li>${log.timestamp} - ${log.email} visited</li>`).join('');
    document.getElementById('login-logs').innerHTML = loginLogs.map(log => `<li>${log.timestamp} - ${log.email} logged in</li>`).join('');
}

// Track Page Visits
window.addEventListener('load', () => {
    logVisit(null, 'Visit');
    updateAdminLink();
});

// Initialize Google Sign-In (Replace YOUR_GOOGLE_CLIENT_ID with your actual Client ID)
function initGoogleSignIn() {
    google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(document.querySelector(".g_id_signup"), { theme: "outline", size: "large" });
    google.accounts.id.prompt();
}
window.onload = initGoogleSignIn;