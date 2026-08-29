# 🎓 Services & Coming Soon Class - Setup Guide

## What Was Added

Your website now includes **three service offerings** and a **Coming Soon Class section**, all aligned with your brand book's casual, fatherly tone and retro neon aesthetic.

---

## 📋 Services Section

### Three Service Offerings:

#### 1️⃣ **1-ON-1 COACHING** (👨‍💼)
- **What it is**: Personal security audits and custom family protection plans
- **For whom**: Parents who want personalized guidance
- **Includes**:
  - Your family's personal security audit
  - Customized protection plan (not generic advice)
  - Ongoing support when questions come up
  - Real answers to real problems
- **CTA**: "[ GET MORE INFO ]"

#### 2️⃣ **PUBLIC SPEAKING & WORKSHOPS** (🎤)
- **What it is**: Talks and training for schools, companies, and communities
- **For whom**: Organizations needing cybersecurity education
- **Includes**:
  - Customized talks for any audience
  - Parent workshops & student assemblies
  - Corporate security training
  - Story-driven, practical content
- **CTA**: "[ BOOK A TALK ]"

#### 3️⃣ **EXCLUSIVE COMMUNITY** (💬)
- **What it is**: Private chat group for ongoing support and resources
- **For whom**: Parents who want peer support + direct access to Gavin
- **Includes**:
  - Direct access to answer questions
  - Daily tips and real security updates
  - Peer support from other parents
  - Exclusive resources & content
- **CTA**: "[ JOIN NOW ]"

---

## 🎓 Coming Soon Class

### "PROTECTING YOUR FAMILY ONLINE"

**Price**: $100  
**Duration**: 6 weeks  
**Format**: Live group sessions with weekly Q&A

### Weekly Topics:
1. **Week 1**: The Real Threats (and How to Protect Against Them)
2. **Week 2**: Passwords That Actually Work
3. **Week 3**: Parental Controls That Aren't Weird or Overbearing
4. **Week 4**: Social Media Safety Without Being That Parent
5. **Week 5**: Spotting & Stopping the Bad Stuff
6. **Week 6**: Build Your Family's Custom Security Plan

### What's Included:
- Live group sessions
- Q&A with Gavin every week
- Downloadable resources
- Lifetime access to course materials
- Automatic addition to exclusive community

### CTAs:
- **"[ NOTIFY ME WHEN LIVE ]"** - Captures email for launch notification
- **"[ GET FREE PREP GUIDE ]"** - Links to free resources section

---

## 🎨 Design Alignment with Brand Book

### Colors Used:
- **Obsidian Black** (#121212) - Dark backgrounds
- **Cyan Blue** (#00E5FF) - Primary accent
- **Vivid Magenta** (#FF00FF) - Secondary accent
- **Neon Lime** (#39FF14) - Highlight color

### Aesthetic:
✅ Cyber-Neon Noir  
✅ High-Contrast Retro-Future  
✅ Dark-Mode Minimalism  
✅ Electric Security-Core  

### Tone:
✅ Friendly  
✅ Empowering  
✅ Practical  
✅ Supportive  

---

## 🔧 Customization

### Update Service Descriptions
Each service is in HTML. Find in `index.html` and update:
- Descriptions
- Bullet points
- CTAs/button text

Example:
```html
<h3 style="color: var(--neon-cyan); font-size: 20px; margin-bottom: 1rem;">
    👨‍💼 1-ON-1 COACHING
</h3>
<p style="color: var(--neon-cyan); font-size: 14px; line-height: 1.8;">
    [Edit this text]
</p>
```

### Update Coming Soon Class Details
In `index.html`, search for "PROTECTING YOUR FAMILY ONLINE" and update:
- Class name
- Price ($100)
- Duration (6 weeks)
- Weekly topics
- Description

### Change Colors
Edit `/root` CSS variables in `styles.css`:
```css
:root {
    --neon-cyan: #00E5FF;        /* Change this */
    --neon-pink: #FF006E;        /* Or this */
    --neon-purple: #BD00FF;      /* Or this */
    --neon-lime: #39FF14;        /* Or this */
}
```

---

## 💾 Data Collection

### Class Launch Notifications
When users click "[ NOTIFY ME WHEN LIVE ]", emails are stored in:

```javascript
localStorage.dadcybertips_class_notifications
```

**Structure**:
```json
[
  {
    "id": 1725070234567,
    "email": "parent@example.com",
    "classType": "protecting-family-online",
    "timestamp": "2026-08-29T15:00:34.567Z"
  }
]
```

### Export Notifications
To send emails when class launches:

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Paste this:
```javascript
copy(JSON.stringify(JSON.parse(localStorage.getItem('dadcybertips_class_notifications')), null, 2))
```
4. Paste into spreadsheet/email service

---

## 📱 Mobile Responsive

All services sections are fully responsive:
- ✅ Desktop: Full layout with descriptions side-by-side
- ✅ Tablet: Stacked layout with proper spacing
- ✅ Mobile: Single column, readable text, touch-friendly buttons

---

## 🔗 Navigation

Updated navbar includes quick links to:
- Books
- Courses
- Merch
- Free (resources)
- **Services** ← NEW
- **Class** ← NEW

---

## 📝 CTA/Button Actions

Each service button currently scrolls to the section. You can update to:

### Option 1: External Links
```html
<a href="https://example.com/coaching" class="btn btn-primary">[ GET MORE INFO ]</a>
```

### Option 2: Email
```html
<a href="mailto:contact@dadcybertips.com?subject=Coaching Inquiry" class="btn btn-primary">[ GET MORE INFO ]</a>
```

### Option 3: Contact Form Modal
Add a contact form that appears when clicked

### Option 4: Calendar/Booking
Link to Calendly or other scheduling tool

---

## 🎯 Next Steps

1. ✅ Test on desktop and mobile
2. ⭕ Update service descriptions (optional)
3. ⭕ Update class details (name, topics, price)
4. ⭕ Decide on CTA actions (links, emails, forms)
5. ⭕ Set up class notifications export process
6. ⭕ Deploy to GitHub Pages

---

## Brand Book Alignment Summary

| Element | Your Brand | Website |
|---------|-----------|---------|
| **Tagline** | "Security starts at home" | ✅ Featured in hero & used throughout |
| **Tone** | Friendly, Empowering, Practical, Supportive | ✅ All service descriptions use this voice |
| **Aesthetic** | Cyber-Neon Noir, High-Contrast Retro-Future | ✅ Neon cyan/magenta/lime on dark background |
| **Colors** | #00E5FF (cyan), #FF00FF (magenta), #121212 (black) | ✅ Used throughout all sections |
| **Values** | Digital Safety, Family Protection, Education, Accessibility | ✅ Reflected in all service descriptions |

---

**Your brand-aligned services section is ready to convert visitors into students and coaching clients! 🚀**
