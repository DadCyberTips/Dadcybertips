# DadCyberTips Website

A modern, responsive e-commerce website for DadCyberTips by Gavin Marlowe. Built with HTML, CSS, and vanilla JavaScript—ready to deploy on GitHub Pages.

## 🚀 Features

- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **Product Showcase**: Display digital books, courses, and merchandise with REAL IMAGES
- **Free Resources**: Offer downloadable guides with actual cover images
- **Security Quiz**: 5-question quiz that assesses family security level
- **Mailing List Integration**: Capture leads from quiz results
- **Store Integration**: Seamless links to Payhip (digital products) and Fourthwall (merchandise)
- **Modern UI**: Clean, retro 90s neon design with smooth interactions
- **Analytics Ready**: Built-in event tracking for user interactions
- **SEO Optimized**: Meta tags and semantic HTML for search engines
- **No Dependencies**: Pure HTML/CSS/JavaScript—no build tools needed

## 📋 NEW: Product & Guide Images

This version includes **full image support**:
- 📚 Real book cover images for digital products
- 🎁 Actual product photos for merchandise
- 📖 Cover images for free downloadable guides
- ✨ Neon-styled image containers with hover effects
- 🔄 Fallback placeholders if images don't load

**See `SETUP_IMAGES.md` for complete image setup instructions.**

## 📁 File Structure

```
dadcybertips-website/
├── index.html          # Main HTML page
├── styles.css          # All styling and responsive design
├── script.js           # Interactive features and store integration
├── README.md           # This file
└── .gitignore          # Git ignore file (optional)
```

## ⚙️ Setup Instructions

### 1. **Clone or Fork the Repository**

```bash
git clone https://github.com/yourusername/dadcybertips-website.git
cd dadcybertips-website
```

### 2. **Configure Store Links**

Edit `script.js` and update the store links:

```javascript
const STORE_LINKS = {
    'Raising Privacy-Smart Kids': 'https://payhip.com/dadcybertips/your-product-link',
    'Password Security Master Guide': 'https://payhip.com/dadcybertips/your-product-link',
    // ... and so on
};
```

#### For Payhip Products:
- Go to your Payhip dashboard
- Copy your product links
- Paste them in the corresponding sections

#### For Fourthwall Merchandise:
- Go to your Fourthwall store
- Copy your product links
- Add them to the merchandise section

### 3. **Configure Free Resources**

Update the free resource download links in `script.js`:

```javascript
const FREE_RESOURCES = {
    'password-checklist': {
        title: 'Password Security Checklist',
        url: 'https://example.com/downloads/checklist.pdf' // Add your PDF URL
    },
    // ... add your other resources
};
```

## 🌐 Deploy to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it: `dadcybertips-website` (or your preferred name)
3. Make it **public**
4. Click "Create repository"

### Step 2: Push Your Code

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: DadCyberTips website"

# Add remote
git remote add origin https://github.com/yourusername/dadcybertips-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source," select **Deploy from a branch**
4. Select the `main` branch
5. Select the root folder `/`
6. Click **Save**

Your site will be live at: `https://yourusername.github.io/dadcybertips-website/`

## 🎓 Services & Coming Soon Class

### Services Section
Your website now includes three service offerings:

1. **1-on-1 Coaching** - Personal security audits and custom family plans
2. **Public Speaking & Workshops** - Talks for schools, companies, and community groups
3. **Exclusive Community** - Private chat group with ongoing support and daily tips

Each service section includes:
- Clear, casual-but-authoritative description
- Key benefits in easy-to-scan format
- Call-to-action buttons (placeholder links)

### Coming Soon Class: "Protecting Your Family Online"
- **Duration**: 6 weeks
- **Price**: $100
- **Format**: Live group sessions with weekly Q&A
- **Includes**: Downloadable resources, lifetime access, community membership

The section features:
- Eye-catching gradient border with neon glow
- Weekly breakdown of topics
- "Notify Me" button that captures emails for launch notifications
- Free prep guide link

#### Email Notifications
When users click "Notify Me When Live," their email is stored locally in:
```javascript
localStorage.dadcybertips_class_notifications
```

You can export these and send emails when the class is ready.

## 🎨 Customization

### Change Neon Colors

Edit the neon color variables at the top of `styles.css`:

```css
:root {
    --neon-cyan: #00F0FF;           /* Main cyan */
    --neon-pink: #FF006E;           /* Hot pink */
    --neon-purple: #BD00FF;         /* Electric purple */
    --neon-lime: #39FF14;           /* Neon lime */
    --neon-orange: #FF6600;         /* Neon orange */
    --neon-yellow: #FFFF00;         /* Neon yellow */
    --neon-blue: #0080FF;           /* Neon blue */
}
```

### Update Branding

- **Logo/Name**: Edit in `index.html` navbar section
- **Meta Description**: Update the `<meta>` tags in `<head>`
- **Social Links**: Update footer social media links

### Add New Products with Images

In `index.html`, duplicate a product card and update:

```html
<div class="product-card">
    <div class="product-image-container">
        <img src="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/images/your-product.jpg" alt="Product Name" class="product-image">
    </div>
    <h3 class="product-name">Your Product Name</h3>
    <p class="product-desc">Your product description</p>
    <div class="product-price">$19.99</div>
    <button class="btn btn-primary" onclick="handlePurchase('Your Product Name')">Buy Now</button>
</div>
```

Then add the store link to `script.js`:

```javascript
const STORE_LINKS = {
    'Your Product Name': 'https://payhip.com/your-product-url',
};
```

## 📸 Product Images Setup

**CRITICAL**: Your website displays product and guide images hosted on GitHub. Follow these steps:

### Quick Summary
1. ✅ Create `images/` folder in your GitHub repo
2. ✅ Upload product photos with exact filenames
3. ✅ Replace `YOUR_USERNAME` and `YOUR_REPO` in image URLs in HTML
4. ✅ Deploy and verify images load

**DETAILED GUIDE**: See `SETUP_IMAGES.md` for complete step-by-step instructions

### Image Dimensions & Names

**Digital Books** (150×200px):
- `privacy-smart-kids.jpg`, `password-guide.jpg`, `home-network.jpg`
- `social-media-bundle.jpg`, `scam-handbook.jpg`, `identity-theft.jpg`

**Merchandise** (200×200px):
- `tshirt.jpg`, `dad-hat.jpg`, `sticker-pack.jpg`
- `mug.jpg`, `journal.jpg`, `bundle.jpg`

**Free Guides** (140×180px):
- `password-checklist.jpg`, `family-plan.jpg`, `phishing-guide.jpg`
- `quick-tips.jpg`, `parental-guide.jpg`, `social-media-checklist.jpg`

### Update Image URLs

Find and replace in `index.html`:
- `YOUR_USERNAME` → Your GitHub username
- `YOUR_REPO` → Your repository name

Example: `https://raw.githubusercontent.com/dadcybertips/website/main/images/`

## 🎯 Security Quiz & Mailing List

Your site includes a built-in security assessment quiz that captures leads for your mailing list!

### How It Works
1. Users click "START QUIZ"
2. Answer 5 quick security questions
3. Get personalized recommendations (0-100 score)
4. Optional: Join mailing list with name/email
5. Data captured for your marketing

### Quiz Features
- ✅ 5 targeted security questions
- ✅ Instant scoring with recommendations
- ✅ Email capture for mailing list
- ✅ Local data storage (no backend needed)
- ✅ Easy integration with Mailchimp/ConvertKit

**DETAILED GUIDE**: See `QUIZ_MAILING_LIST_SETUP.md` for:
- Customizing questions & scoring
- Integrating with email services
- Setting up automated follow-up emails
- Exporting subscriber data

## 📊 Analytics Setup (Optional)

### Google Analytics

Add this to the `<head>` section of `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Replace `GA_MEASUREMENT_ID` with your actual measurement ID.

## 🔧 Advanced Customization

### Add Email Signup Form

Add this to `index.html` in any section:

```html
<form class="newsletter-form" style="max-width: 400px; margin: 2rem auto;">
    <input type="email" placeholder="Enter your email" required>
    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Subscribe</button>
</form>
```

The form is automatically handled by the JavaScript.

### Custom Fonts

Edit `styles.css` and add Google Fonts:

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

body {
    font-family: 'Poppins', sans-serif;
}
```

## 📱 Mobile Optimization

The site is fully responsive with breakpoints at:
- **Mobile**: 480px and below
- **Tablet**: 768px and below
- **Desktop**: 1200px and above

Test on real devices or use Chrome DevTools (F12 → Toggle device toolbar).

## 🚀 Performance Tips

1. **Optimize Images**: Use compressed, web-friendly formats
2. **Lazy Load**: Add `loading="lazy"` to images
3. **Cache**: GitHub Pages automatically caches static files
4. **Minify CSS/JS**: Optional—use [CSS Minifier](https://cssminifier.com/) for production

## 🐛 Troubleshooting

### Site Not Showing?
- Check that GitHub Pages is enabled in Settings → Pages
- Wait 5-10 minutes for initial deployment
- Check the repository name in your GitHub URL

### Links Not Working?
- Verify Payhip/Fourthwall links in `script.js`
- Test links in a new tab to ensure they're correct

### Styling Issues?
- Clear browser cache (Ctrl+Shift+Del)
- Check that `styles.css` is in the root folder
- Verify CSS file name in `index.html`

## 📈 Next Steps

1. **Add Analytics**: Set up Google Analytics for traffic tracking
2. **Email Marketing**: Connect to Mailchimp or ConvertKit for newsletters
3. **Social Integration**: Add social media feeds or share buttons
4. **Blog Section**: Add a blog to share cybersecurity tips
5. **Custom Domain**: Point a custom domain to your GitHub Pages site

## 🤝 Contributing

Have ideas for improvements? 
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This website template is provided as-is for DadCyberTips. Feel free to modify and customize.

## 📞 Support

For questions or issues:
- Check the [GitHub Issues](https://github.com/yourusername/dadcybertips-website/issues)
- Visit [DadCyberTips](https://linktr.ee/dadcybertips)

---

**Happy coding! Stay safe online. 🛡️**
