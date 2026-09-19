// DadCyberTips Website - Interactive Script

// Store Integration Configuration
// Update these with your actual Payhip and Fourthwall links
const STORE_LINKS = {
    // Digital Books (Payhip)
    'Raising Privacy-Smart Kids': 'https://payhip.com/dadcybertips/raising-privacy-smart-kids',
    'Password Security Master Guide': 'https://payhip.com/dadcybertips/password-guide',
    'Home Network Security': 'https://payhip.com/dadcybertips/home-network',
    'Social Media Safety Bundle': 'https://payhip.com/dadcybertips/social-media-bundle',
    'Scam Recognition Handbook': 'https://payhip.com/dadcybertips/scam-handbook',
    'Identity Theft Prevention': 'https://payhip.com/dadcybertips/identity-theft',
    
    // Courses (Payhip)
    'Cybersecurity Masterclass': 'https://payhip.com/dadcybertips/masterclass',
    
    // Merchandise (Fourthwall)
    'Classic T-Shirt': 'https://fourthwall.com/dadcybertips/t-shirt',
    'Dad Hat': 'https://fourthwall.com/dadcybertips/dad-hat',
    'Security Sticker Pack': 'https://fourthwall.com/dadcybertips/sticker-pack',
    'Security Mindset Mug': 'https://fourthwall.com/dadcybertips/mug',
    'Password Manager Journal': 'https://fourthwall.com/dadcybertips/journal',
    'Family Safety Bundle': 'https://fourthwall.com/dadcybertips/bundle',
};

// Free Resource Downloads
const FREE_RESOURCES = {
    'password-checklist': {
        title: 'Password Security Checklist',
        url: '#' // Replace with actual PDF URL
    },
    'family-safety-plan': {
        title: 'Family Safety Plan Template',
        url: '#' // Replace with actual PDF URL
    },
    'phishing-guide': {
        title: 'Phishing Detection Guide',
        url: '#' // Replace with actual PDF URL
    },
    'quick-tips': {
        title: 'Quick Security Tips',
        url: '#' // Replace with actual PDF URL
    },
    'parental-guide': {
        title: 'Parental Internet Safety Guide',
        url: '#' // Replace with actual PDF URL
    },
    'social-media-checklist': {
        title: 'Social Media Safety Checklist',
        url: '#' // Replace with actual PDF URL
    },
};

/**
 * Handle Product Purchase
 * Redirects to appropriate store (Payhip or Fourthwall)
 */
function handlePurchase(productName) {
    const storeLink = STORE_LINKS[productName];
    
    if (!storeLink || storeLink === '#') {
        showNotification('This product link is not configured yet. Please check back soon!', 'info');
        return;
    }
    
    // Track purchase attempt (optional - for analytics)
    trackEvent('purchase_click', {
        product: productName,
        timestamp: new Date().toISOString()
    });
    
    // Open store link
    window.open(storeLink, '_blank');
}

/**
 * Handle Free Resource Download
 */
function downloadResource(resourceKey) {
    const resource = FREE_RESOURCES[resourceKey];
    
    if (!resource || resource.url === '#') {
        showNotification('This resource is being prepared. Check back soon!', 'info');
        return;
    }
    
    // Track download attempt
    trackEvent('download_click', {
        resource: resource.title,
        timestamp: new Date().toISOString()
    });
    
    // Trigger download
    const link = document.createElement('a');
    link.href = resource.url;
    link.download = resource.title + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Show Notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add notification styles dynamically (Retro Neon)
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 4px;
                font-size: 13px;
                font-weight: 700;
                z-index: 9999;
                animation: slideIn 0.3s ease-out;
                max-width: 400px;
                border: 3px solid;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-family: 'Courier New', monospace;
            }
            
            .notification-success {
                background: rgba(57, 255, 20, 0.15);
                color: #39FF14;
                border-color: #39FF14;
                box-shadow: 0 0 20px #39FF14, inset 0 0 20px rgba(57, 255, 20, 0.1);
            }
            
            .notification-error {
                background: rgba(255, 0, 110, 0.15);
                color: #FF006E;
                border-color: #FF006E;
                box-shadow: 0 0 20px #FF006E, inset 0 0 20px rgba(255, 0, 110, 0.1);
            }
            
            .notification-info {
                background: rgba(0, 240, 255, 0.15);
                color: #00F0FF;
                border-color: #00F0FF;
                box-shadow: 0 0 20px #00F0FF, inset 0 0 20px rgba(0, 240, 255, 0.1);
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 640px) {
                .notification {
                    left: 20px;
                    right: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Track Events (for analytics)
 * Logs events for tracking user interactions
 */
function trackEvent(eventName, eventData = {}) {
    // Simple console logging
    console.log(`[Analytics] Event: ${eventName}`, eventData);
    
    // Optional: Send to Google Analytics or other analytics service
    if (window.gtag) {
        gtag('event', eventName, eventData);
    }
}

/**
 * Smooth Scroll Handler
 * Handles smooth scrolling for navigation links
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Track page view
    trackEvent('page_view', {
        page: window.location.pathname,
        timestamp: new Date().toISOString()
    });
});

/**
 * Email Signup (Optional)
 * For newsletter or mailing list
 */
function handleEmailSignup(email) {
    if (!email || !isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    trackEvent('email_signup', {
        email: email.replace(/@.+/, '@***'),
        timestamp: new Date().toISOString()
    });
    
    showNotification('Thanks for signing up! Check your email.', 'success');
}

/**
 * Email Validation
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Setup Newsletter Form (if exists)
 */
function setupNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput) {
                handleEmailSignup(emailInput.value);
                emailInput.value = '';
            }
        });
    }
}

/**
 * Product Card Hover Effects
 */
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

/**
 * Mobile Menu Toggle (if needed)
 */
function toggleMobileMenu() {
    const navbar = document.querySelector('.navbar-links');
    if (navbar) {
        navbar.classList.toggle('active');
    }
}

/**
 * Initialize on page load
 */
window.addEventListener('load', function() {
    console.log('DadCyberTips website initialized');
    setupNewsletterForm();
    
    // You can add more initialization here
    // - Load user preferences
    // - Set up additional event listeners
    // - Initialize third-party libraries
});

/**
 * Quiz Functionality
 */
const quizQuestions = [
    {
        question: "Do you use the same password for multiple accounts?",
        answers: ["Yes, always", "Sometimes", "Never - unique passwords for each"],
        scores: [0, 50, 100]
    },
    {
        question: "How often do you update your home WiFi password?",
        answers: ["Never changed the default", "Once a year or less", "Every 3-6 months"],
        scores: [10, 40, 100]
    },
    {
        question: "Do you use two-factor authentication (2FA)?",
        answers: ["What's that?", "On some accounts", "On all important accounts"],
        scores: [0, 60, 100]
    },
    {
        question: "How do you handle phishing emails?",
        answers: ["Click links to verify", "Usually ignore them", "Report and delete immediately"],
        scores: [0, 40, 100]
    },
    {
        question: "Do you monitor your children's online activity?",
        answers: ["Not really", "Sometimes check", "Active parental controls + regular checks"],
        scores: [20, 60, 100]
    }
];

let quizScore = 0;

function startQuiz() {
    document.getElementById('quiz-intro').style.display = 'none';
    document.getElementById('quiz-questions').style.display = 'block';
    renderQuestions();
}

function renderQuestions() {
    const container = document.getElementById('question-container');
    container.innerHTML = '';
    
    quizQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.style.cssText = 'margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 2px solid var(--neon-purple);';
        
        let html = `<h4 style="color: var(--neon-pink); margin-bottom: 1rem; font-size: 14px; text-transform: uppercase;">${index + 1}. ${q.question}</h4>`;
        
        q.answers.forEach((answer, ansIndex) => {
            html += `
                <div style="margin-bottom: 0.75rem;">
                    <input type="radio" name="q${index}" value="${ansIndex}" id="q${index}_${ansIndex}" required>
                    <label for="q${index}_${ansIndex}" style="color: var(--neon-cyan); font-size: 13px; cursor: pointer; margin-left: 0.5rem;">${answer}</label>
                </div>
            `;
        });
        
        questionDiv.innerHTML = html;
        container.appendChild(questionDiv);
    });
}

function handleQuizSubmit(event) {
    event.preventDefault();
    
    quizScore = 0;
    quizQuestions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected) {
            quizScore += q.scores[parseInt(selected.value)];
        }
    });
    
    quizScore = Math.round(quizScore / quizQuestions.length);
    
    document.getElementById('quiz-questions').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';
    
    displayResults();
}

function displayResults() {
    let scoreText = '';
    let recommendation = '';
    
    if (quizScore >= 85) {
        scoreText = `🛡️ SECURITY EXPERT (${quizScore}%) - You're doing an EXCELLENT job protecting your family!`;
        recommendation = 'Keep up the amazing work! Stay updated with our latest security tips and share your knowledge with others. Consider getting our Advanced Protection Bundle for even more security insights.';
    } else if (quizScore >= 70) {
        scoreText = `🟢 SECURITY CONSCIOUS (${quizScore}%) - You're on the right track!`;
        recommendation = 'You\'re doing well, but there\'s room for improvement. Focus on implementing 2FA on all accounts and regular security updates. Our Password Security Guide & Home Network Security books will help you level up.';
    } else if (quizScore >= 50) {
        scoreText = `🟡 NEEDS ATTENTION (${quizScore}%) - Time to strengthen your defenses!`;
        recommendation = 'Your family might be at risk. Start with the basics: update your passwords, enable 2FA, and set up parental controls. Get our "Raising Privacy-Smart Kids" and "Password Security Master Guide" to transform your security.';
    } else {
        scoreText = `🔴 HIGH RISK (${quizScore}%) - Urgent action needed!`;
        recommendation = 'Your family is vulnerable to cyber threats. Start immediately with password changes, WiFi security, and parental controls. We recommend getting our complete Cybersecurity Masterclass course for comprehensive protection.';
    }
    
    document.getElementById('score-text').textContent = scoreText;
    document.getElementById('recommendation').textContent = recommendation;
}

function resetQuiz() {
    quizScore = 0;
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('quiz-intro').style.display = 'block';
    document.getElementById('quizForm').reset();
}

/**
 * Mailing List Functionality
 */
function submitMailingList() {
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    
    if (!email || !isValidEmail(email) || !name) {
        showNotification('Please enter a valid name and email address', 'error');
        return;
    }
    
    // Prepare mailing list data
    const mailingListData = {
        name: name,
        email: email,
        quizScore: quizScore,
        timestamp: new Date().toISOString()
    };
    
    // Track the mailing list signup
    trackEvent('mailing_list_signup', {
        email: email.replace(/@.+/, '@***'),
        score: quizScore,
        timestamp: new Date().toISOString()
    });
    
    // Option 1: Send to your email service (Mailchimp, ConvertKit, etc.)
    // Example for Mailchimp (requires backend integration):
    // sendToMailchimp(mailingListData);
    
    // Option 2: Store locally in browser (for development)
    let subscribers = JSON.parse(localStorage.getItem('dadcybertips_subscribers') || '[]');
    subscribers.push(mailingListData);
    localStorage.setItem('dadcybertips_subscribers', JSON.stringify(subscribers));
    
    // Show success message
    showNotification(`Welcome to DadCyberTips, ${name}! Check your email for personalized recommendations.`, 'success');
    
    // Reset form
    document.getElementById('email').value = '';
    document.getElementById('name').value = '';
}

/**
 * Send to Mailchimp (requires backend API)
 * Uncomment and configure when you set up your mail service
 */
/*
async function sendToMailchimp(data) {
    try {
        const response = await fetch('YOUR_BACKEND_ENDPOINT/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Subscription failed');
        return await response.json();
    } catch (error) {
        console.error('Mailing list error:', error);
        showNotification('There was an error. Please try again.', 'error');
    }
}
*/

/**
 * Masterclass Image Upload
 */
function handleMasterclassImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showNotification('Please upload an image file', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image must be smaller than 5MB', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('masterclass-image-preview');
        preview.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover; display: block;">`;
        localStorage.setItem('masterclass_image', e.target.result);
        showNotification('Course image uploaded successfully!', 'success');
        trackEvent('masterclass_image_upload', { fileSize: file.size });
    };
    reader.readAsDataURL(file);
}

window.addEventListener('load', function() {
    const savedImage = localStorage.getItem('masterclass_image');
    if (savedImage) {
        const preview = document.getElementById('masterclass-image-preview');
        preview.innerHTML = `<img src="${savedImage}" style="width: 100%; height: 100%; object-fit: cover; display: block;">`;
    }
    updateContactsDisplay();
});

/**
 * Marketing Contacts Management
 */
function getMarketingContacts() {
    return JSON.parse(localStorage.getItem('dadcybertips_marketing_contacts') || '[]');
}

function saveMarketingContacts(contacts) {
    localStorage.setItem('dadcybertips_marketing_contacts', JSON.stringify(contacts));
    updateContactsDisplay();
}

function addMarketingContact(event) {
    event.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const source = document.getElementById('contact-source').value;
    const notes = document.getElementById('contact-notes').value.trim();

    if (!name || !email) {
        showNotification('Please fill in name and email', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    const contact = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        source: source,
        notes: notes,
        dateAdded: new Date().toISOString()
    };

    let contacts = getMarketingContacts();
    contacts.push(contact);
    saveMarketingContacts(contacts);

    document.getElementById('marketing-form').reset();
    showNotification(`${name} added to marketing list!`, 'success');
    trackEvent('marketing_contact_added', { source: source });
}

function updateContactsDisplay() {
    const contacts = getMarketingContacts();
    const container = document.getElementById('contacts-list');
    const countEl = document.getElementById('contact-count');

    if (!container || !countEl) return;

    countEl.textContent = contacts.length;

    if (contacts.length === 0) {
        container.innerHTML = '<p style="color: var(--neon-cyan); text-align: center; font-size: 12px;">No contacts yet. Add one to get started!</p>';
        return;
    }

    let html = '';
    contacts.forEach(contact => {
        const dateAdded = new Date(contact.dateAdded).toLocaleDateString();
        html += `
            <div class="contact-card">
                <div class="contact-card-name">${escapeHtml(contact.name)}</div>
                <div class="contact-card-email">📧 ${escapeHtml(contact.email)}</div>
                ${contact.phone ? `<div class="contact-card-email">📱 ${escapeHtml(contact.phone)}</div>` : ''}
                <div class="contact-card-meta">Source: ${contact.source} | Added: ${dateAdded}</div>
                ${contact.notes ? `<div class="contact-card-meta" style="font-style: italic;">Notes: ${escapeHtml(contact.notes)}</div>` : ''}
                <button type="button" class="contact-card-delete" onclick="deleteContact(${contact.id})">DELETE</button>
            </div>
        `;
    });

    container.innerHTML = html;
}

function deleteContact(contactId) {
    if (!confirm('Are you sure you want to delete this contact?')) {
        return;
    }

    let contacts = getMarketingContacts();
    contacts = contacts.filter(c => c.id !== contactId);
    saveMarketingContacts(contacts);

    showNotification('Contact deleted', 'success');
}

function clearAllContacts() {
    if (!confirm('Are you REALLY sure? This will delete all contacts!')) {
        return;
    }

    if (!confirm('This action cannot be undone. Clear all contacts?')) {
        return;
    }

    localStorage.removeItem('dadcybertips_marketing_contacts');
    updateContactsDisplay();
    showNotification('All contacts cleared', 'success');
}

function exportContacts() {
    const contacts = getMarketingContacts();

    if (contacts.length === 0) {
        showNotification('No contacts to export', 'error');
        return;
    }

    let csv = 'Name,Email,Phone,Source,Notes,Date Added\n';
    contacts.forEach(contact => {
        csv += `"${contact.name}","${contact.email}","${contact.phone}","${contact.source}","${contact.notes}","${contact.dateAdded}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dadcybertips_marketing_contacts_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showNotification(`Exported ${contacts.length} contacts!`, 'success');
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Coming Soon Class Notification
 */
function notifyClassLaunch() {
    const email = prompt('Enter your email to be notified when the class goes live:');
    
    if (!email) {
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    const notification = {
        id: Date.now(),
        email: email,
        classType: 'protecting-family-online',
        timestamp: new Date().toISOString()
    };

    let notifications = JSON.parse(localStorage.getItem('dadcybertips_class_notifications') || '[]');
    notifications.push(notification);
    localStorage.setItem('dadcybertips_class_notifications', JSON.stringify(notifications));

    showNotification(`Got it! We'll let you know as soon as "Protecting Your Family Online" is live. 🎓`, 'success');
    trackEvent('class_notification_signup', { class: 'protecting-family-online' });
}

/**
 * Scroll to sections with smooth behavior
 */
function scrollToContact(type) {
    const element = document.getElementById('services');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToFreebies() {
    const element = document.getElementById('resources');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============= INLINE QUIZ FUNCTIONALITY =============

const quizData = [
    {
        question: "How many passwords do you reuse across multiple accounts?",
        options: ["None — every password is unique", "1-2 passwords reused occasionally", "Several accounts share the same password", "Most of my passwords are identical"],
        correct: 0,
        weight: 3,
        tip: "Use a password manager to generate unique passwords for each account."
    },
    {
        question: "Which method do you primarily use to protect your online accounts?",
        options: ["Two-Factor Authentication (2FA) on all important accounts", "2FA on some accounts, mostly email and banking", "Only SMS verification or security questions", "No additional protection beyond passwords"],
        correct: 0,
        weight: 3,
        tip: "Enable authenticator apps (Google Authenticator, Authy) over SMS for 2FA."
    },
    {
        question: "How frequently do you update your operating systems and software?",
        options: ["Within 24 hours of security updates being released", "Within a week of release", "Every few months or when it's convenient", "Rarely or never — I ignore update notifications"],
        correct: 0,
        weight: 3,
        tip: "Enable automatic updates on all devices. Updates patch critical security vulnerabilities."
    },
    {
        question: "How secure is your home WiFi network?",
        options: ["WPA2/WPA3 encryption with a strong, unique password", "WPA encryption with a decent password", "WEP or shared with neighbors unsecured", "No password set — open network"],
        correct: 0,
        weight: 3,
        tip: "Change your WiFi password from default and use WPA3 if available."
    },
    {
        question: "How do you handle backups of your important data?",
        options: ["Automated daily backups to cloud storage and external device", "Weekly backups to external storage", "Occasional backups when I remember", "No regular backups — I rely on cloud services"],
        correct: 0,
        weight: 2,
        tip: "Implement 3-2-1 backup rule: 3 copies, 2 different media, 1 offsite."
    },
    {
        question: "How cautious are you about phishing emails and suspicious links?",
        options: ["Very cautious — I verify sender and never click suspicious links", "Somewhat cautious — check if it seems legitimate", "Rarely check the sender — mostly click if needed", "No — I click on anything that looks interesting"],
        correct: 0,
        weight: 2,
        tip: "Hover over links before clicking. Legitimate companies never ask for passwords via email."
    },
    {
        question: "Where do you download software from?",
        options: ["Official app stores and verified developer websites", "Official stores with occasional third-party downloads", "Random websites and sources I find online", "Torrent sites and file-sharing platforms"],
        correct: 0,
        weight: 2,
        tip: "Stick to official app stores and developer websites; verify download integrity."
    },
    {
        question: "How many connected smart devices do you have, and how are they configured?",
        options: ["Minimal devices, all updated with unique passwords and network segmentation", "Moderate number, most have changed passwords and regular updates", "Several with default settings and shared networks", "Many IoT devices with factory settings"],
        correct: 0,
        weight: 2,
        tip: "Isolate IoT devices on a separate VLAN/guest network with unique credentials."
    },
    {
        question: "How often do you review your privacy settings on social media and online accounts?",
        options: ["Quarterly or whenever major updates occur", "Annually or when prompted", "Occasionally — maybe once a year", "Never — I don't check privacy settings"],
        correct: 0,
        weight: 1,
        tip: "Audit privacy settings annually and after platform updates."
    },
    {
        question: "Do you use any browser extensions or ad blockers?",
        options: ["Yes, essential privacy extensions + uBlock Origin or similar", "Some basic ad blocking and privacy tools", "A few random extensions installed years ago", "None — I browse with default browser settings"],
        correct: 0,
        weight: 1,
        tip: "Install reputable privacy extensions: uBlock Origin, Privacy Badger, ClearURLs."
    },
    {
        question: "Have you checked if your email has been compromised in known data breaches?",
        options: ["Yes, regularly using breach monitoring services", "Yes, once or twice using HaveIBeenPwned or similar", "I've heard about it but haven't checked", "No, I'm not aware of this service"],
        correct: 0,
        weight: 1,
        tip: "Check haveibeenpwned.com and set up breach alerts for your email addresses."
    },
    {
        question: "How do you handle public WiFi networks?",
        options: ["Never use public WiFi for sensitive activities; use VPN if necessary", "Avoid sensitive tasks on public WiFi", "Use public WiFi for anything, minimal concerns", "Freely bank and shop on any public WiFi"],
        correct: 0,
        weight: 1,
        tip: "Always use a VPN on public WiFi. Avoid logging into sensitive accounts without protection."
    }
];

const levels = [
    { min: 22, max: 25, scoreMin: 9, scoreMax: 10, name: "Cyber Fortress", emoji: "🏰", 
      desc: "Elite security posture. Your digital defenses are excellent!",
      recs: ["Maintain current practices", "Stay updated on emerging threats", "Share best practices with family/friends"] },
    { min: 18, max: 21, scoreMin: 7, scoreMax: 8, name: "Fortified Home", emoji: "🔒", 
      desc: "Strong protections with minor gaps to seal.",
      recs: ["Review weak areas identified above", "Consider upgrading 2FA to authenticator apps", "Set automated backup schedules"] },
    { min: 13, max: 17, scoreMin: 5, scoreMax: 6, name: "Basic Lock", emoji: "🚪", 
      desc: "Moderate security. Several improvements needed urgently.",
      recs: ["Enable 2FA on all critical accounts immediately", "Update all device firmware and software", "Change default router credentials", "Set up regular backups"] },
    { min: 8, max: 12, scoreMin: 3, scoreMax: 4, name: "Vulnerable House", emoji: "⚠️", 
      desc: "Gaps exposed. Your digital home needs immediate attention.",
      recs: ["Start with password manager setup", "Enable WPA2/WPA3 on your router", "Install firewall software", "Begin backing up important data"] },
    { min: 0, max: 7, scoreMin: 1, scoreMax: 2, name: "Digital Door Open Wide", emoji: "🏚️", 
      desc: "Critical risk. Multiple vulnerabilities require urgent action.",
      recs: ["Change ALL passwords immediately", "Enable 2FA everywhere possible", "Run full antivirus/malware scans", "Reset router to factory and reconfigure securely"] }
];

let currentQuestionIndex = 0;
let userAnswers = null; // Will be initialized when quiz starts

// Initialize userAnswers when quizData is ready
if (typeof quizData !== 'undefined' && quizData && quizData.length > 0) {
    userAnswers = new Array(quizData.length).fill(null);
    console.log('✅ quizData and userAnswers initialized at load time');
    window.quizDataReady = true;
}

function initializeQuiz() {
    // Initialize userAnswers if not already done
    if (!userAnswers || userAnswers.length !== quizData.length) {
        userAnswers = new Array(quizData.length).fill(null);
    }
    
    // Reset quiz state
    currentQuestionIndex = 0;
    userAnswers = new Array(quizData.length).fill(null);
    
    // Reset display
    const emailSection = document.getElementById('email-section');
    const resultSection = document.getElementById('result-section');
    
    if (emailSection) emailSection.style.display = 'none';
    if (resultSection) resultSection.style.display = 'none';
    
    // Set question counts
    const totalQEl = document.getElementById('total-questions');
    if (totalQEl) {
        totalQEl.textContent = quizData.length;
        console.log('✅ Set total questions to:', quizData.length);
    } else {
        console.error('❌ total-questions element not found');
    }
    
    const currentQEl = document.getElementById('current-question');
    if (currentQEl) {
        currentQEl.textContent = '1';
        console.log('✅ Set current question to 1');
    }
    
    const progressEl = document.getElementById('progress-text');
    if (progressEl) {
        progressEl.textContent = `1/${quizData.length}`;
        console.log('✅ Set progress text');
    }
    
    // Display first question
    console.log('📝 Calling displayQuestion()...');
    displayQuestion();
}

function displayQuestion() {
    if (!quizData || quizData.length === 0) {
        return;
    }
    
    const q = quizData[currentQuestionIndex];
    
    // Update progress
    const currentQEl = document.getElementById('current-question');
    if (currentQEl) currentQEl.textContent = currentQuestionIndex + 1;
    
    const progressTxt = document.getElementById('progress-text');
    if (progressTxt) progressTxt.textContent = `${currentQuestionIndex + 1}/${quizData.length}`;
    
    const progressBar = document.getElementById('progress');
    if (progressBar) {
        const pct = ((currentQuestionIndex + 1) / quizData.length) * 100;
        progressBar.style.width = pct + '%';
    }
    
    // Update question text
    const qTextEl = document.getElementById('question-text');
    if (qTextEl) {
        qTextEl.textContent = q.question;
    }
    
    // Generate options
    const optionsHTML = q.options.map((opt, i) => `
        <label style="display: flex; align-items: center; padding: 12px 16px; margin: 10px 0; cursor: pointer; border-radius: 4px; border: 2px solid var(--text-secondary); background: transparent; transition: all 0.3s ease; color: var(--text-secondary);">
            <input type="radio" name="answer" value="${i}" ${userAnswers[currentQuestionIndex] === i ? 'checked' : ''} onchange="recordAnswer(${i})" style="margin-right: 12px; cursor: pointer; accent-color: var(--neon-cyan); width: 18px; height: 18px;">
            <span>${opt}</span>
        </label>
    `).join('');
    
    const optionsEl = document.getElementById('options-container');
    if (optionsEl) {
        optionsEl.innerHTML = optionsHTML;
    }
    
    // Update tip
    const tipEl = document.getElementById('tip');
    if (tipEl) {
        tipEl.textContent = '💡 ' + q.tip;
    }
    
    // Update button states
    const backBtn = document.getElementById('back-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (backBtn) {
        backBtn.disabled = currentQuestionIndex === 0;
        backBtn.style.opacity = currentQuestionIndex === 0 ? '0.3' : '1';
    }
    
    if (nextBtn) {
        nextBtn.disabled = userAnswers[currentQuestionIndex] === null;
        nextBtn.style.opacity = userAnswers[currentQuestionIndex] === null ? '0.3' : '1';
    }
}

function recordAnswer(answerIndex) {
    userAnswers[currentQuestionIndex] = answerIndex;
    document.getElementById('next-btn').disabled = false;
    document.getElementById('next-btn').style.opacity = '1';
}

function nextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        // Show email input section
        document.getElementById('email-section').style.display = 'block';
        // Hide questions section
        const qSection = document.querySelector('[id*="question"]')?.parentElement;
        if (qSection) qSection.style.display = 'none';
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function goBackToQuiz() {
    currentQuestionIndex = quizData.length - 1; // Go to last question
    document.getElementById('email-section').style.display = 'none';
    displayQuestion();
}

function calculateAndShowResults() {
    const email = document.getElementById('email-input').value;
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }
    
    let rawScore = 0;
    quizData.forEach((q, i) => {
        if (userAnswers[i] === q.correct) {
            rawScore += q.weight;
        }
    });
    
    const maxScore = quizData.reduce((sum, q) => sum + q.weight, 0);
    const finalScore = Math.round((rawScore / maxScore) * 10);
    const clampedScore = Math.max(1, Math.min(10, finalScore));
    
    const level = levels.find(l => clampedScore >= l.scoreMin && clampedScore <= l.scoreMax) || levels[4];
    
    // Send submission to Make.com webhook for Notion database
    submitQuizToMake(email, clampedScore, level.name);
    
    document.getElementById('email-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';
    
    document.getElementById('final-score').textContent = `${clampedScore}/10`;
    document.getElementById('level-name').innerHTML = `${level.emoji} ${level.name}`;
    document.getElementById('level-desc').textContent = level.desc;
    
    const recList = document.getElementById('recommendations');
    recList.innerHTML = level.recs.map(rec => `<li style="margin: 12px 0; padding-left: 24px; position: relative; line-height: 1.6;"><span style="position: absolute; left: 0; color: var(--neon-magenta);">→</span>${rec}</li>`).join('');
    
    localStorage.setItem('quiz_score', clampedScore);
    localStorage.setItem('quiz_level', level.name);
    localStorage.setItem('quiz_email', email);
    localStorage.setItem('quiz_timestamp', new Date().toISOString());
}

// Submit quiz data to Make.com webhook for Notion integration
function submitQuizToMake(email, score, level) {
    const webhookUrl = 'https://hook.us2.make.com/bsksqjoatho6opxrxhmzpj5t5jmc5dgi';
    
    const payload = {
        email: email,
        score: score,
        level: level,
        timestamp: new Date().toISOString()
    };
    
    // Send data to Make webhook (non-blocking)
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).catch(err => {
        // Silently fail - submission shows results regardless
        console.log('Webhook submission sent');
    });
}
