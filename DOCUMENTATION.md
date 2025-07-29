# Zero1 Network - Comprehensive Documentation

## Overview
Zero1 Network is a YouTube RSS aggregator designed to showcase India's best storytellers across business, finance, health, upskilling, and sustainability. Built with modern web technologies and automated content updates.

**Live Site:** https://zero1-uor.pages.dev/  
**Repository:** https://github.com/bebhuvan/zero1

## Architecture & Technology Stack

### Core Technologies
- **Framework:** Astro 5.12.4 (Static Site Generation)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4.0
- **Deployment:** Cloudflare Pages
- **Version Control:** Git + GitHub

### Key Features
- 📺 YouTube RSS aggregation from 24 curated channels
- 🏷️ 5 content categories (Health, Business, Finance, Upskilling, Sustainability)
- 🌙 Dark/Light mode toggle
- 📱 Mobile-responsive design
- 🔍 Search functionality with enhanced text matching
- 📡 RSS feed syndication
- 📋 PWA support with service worker
- ⏰ Automated RSS updates (5x daily)
- 📊 Filter system by category
- 🔗 Social sharing buttons

## Project Structure

```
zero1-network/
├── .github/
│   └── workflows/
│       └── fetch-rss.yml          # GitHub Actions for RSS updates
├── data/
│   ├── config.json                # Channel configuration
│   ├── videos.json                # Aggregated video data
│   └── fetch-log.json             # RSS fetch logs
├── scripts/
│   ├── fetch-rss.js               # RSS aggregation script
│   └── generate-icons.js          # PWA icon generator
├── src/
│   ├── components/
│   │   ├── ChannelBadge.astro     # Channel name badges
│   │   ├── DarkModeToggle.astro   # Theme switcher
│   │   ├── FilterButtons.astro    # Category filters
│   │   ├── HorizontalScroll.astro # Horizontal card sections
│   │   ├── Navigation.astro       # Main navigation
│   │   ├── PWAInstallPrompt.astro # PWA installation
│   │   ├── SearchBox.astro        # Search input (deprecated)
│   │   ├── ShareButton.astro      # Social sharing
│   │   └── VideoCard.astro        # Video display cards
│   ├── layouts/
│   │   └── Layout.astro           # Base page layout
│   ├── lib/
│   │   ├── data.ts                # Data utilities & formatting
│   │   └── types.ts               # TypeScript interfaces
│   ├── pages/
│   │   ├── index.astro            # Homepage
│   │   ├── about.astro            # About page
│   │   ├── archive.astro          # Video archive
│   │   ├── channels.astro         # Channel listing
│   │   ├── search.astro           # Search page
│   │   └── rss.xml.ts             # RSS feed endpoint
│   └── styles/
│       └── global.css             # Global styles & components
├── public/
│   ├── icons/                     # PWA icons
│   ├── zero1-logo-dark.svg        # Dark theme logo
│   ├── zero1-logo.svg             # Light theme logo
│   ├── manifest.json              # PWA manifest
│   ├── sw.js                      # Service worker
│   └── _headers                   # Cloudflare headers config
├── astro.config.mjs               # Astro configuration
├── tailwind.config.mjs            # Tailwind configuration
├── wrangler.toml                  # Cloudflare Workers config
└── package.json                   # Dependencies & scripts
```

## Data Management

### Channel Configuration (`data/config.json`)
Contains 24 curated YouTube channels organized by category:

```json
{
  "channels": [
    {
      "id": "UCXmAKxh_qFL5703W9VPgpnA",
      "name": "Food Pharmer",
      "category": "health",
      "color": "green",
      "priority": "high",
      "rssUrl": "https://www.youtube.com/feeds/videos.xml?channel_id=UCXmAKxh_qFL5703W9VPgpnA"
    }
  ],
  "categories": {
    "health": "Health & Wellness",
    "business": "Business & Entrepreneurship", 
    "finance": "Finance & Investing",
    "upskilling": "Upskilling & Learning",
    "sustainability": "Sustainability & Future"
  }
}
```

### Video Data Structure (`data/videos.json`)
```json
{
  "lastUpdated": "2025-07-29T11:01:58.217Z",
  "channels": {
    "UCXmAKxh_qFL5703W9VPgpnA": {
      "name": "Food Pharmer",
      "category": "health",
      "color": "green",
      "lastFetched": "2025-07-29T11:01:38.851Z",
      "fetchStatus": "success",
      "videos": [
        {
          "id": "_r7OosFhADo",
          "title": "Video Title",
          "description": "Video description...",
          "publishedAt": "2025-07-23T14:58:47+00:00",
          "thumbnailUrl": "https://i4.ytimg.com/vi/_r7OosFhADo/hqdefault.jpg",
          "youtubeUrl": "https://www.youtube.com/watch?v=_r7OosFhADo",
          "duration": "PT0S",
          "viewCount": "283926",
          "isLive": false,
          "searchableText": "enhanced search text...",
          "keywords": "video keywords",
          "hash": "4d1d33f8"
        }
      ]
    }
  }
}
```

## RSS Aggregation System

### Automated Updates
- **Schedule:** 5 times daily (6 AM, 10 AM, 2 PM, 6 PM, 10 PM IST)
- **Method:** GitHub Actions workflow
- **Process:** Fetch RSS → Parse videos → Update data → Commit → Deploy

### Priority System
- **High Priority:** Core channels (Food Pharmer, Backstage with Millionaires, etc.)
- **Medium Priority:** Regular channels
- **Low Priority:** Supplementary channels

### Live Video Detection
Videos are marked as live only if:
1. Title/description contains live keywords (`live`, `🔴 live`, etc.)
2. Published within last 30 minutes
3. Explicit live indicators present

### Short Video Filtering
- Filters out YouTube Shorts (videos under 60 seconds)
- Parses ISO 8601 duration format (PT1M30S)

## Component Architecture

### VideoCard.astro
Three variants:
- **Featured:** Large hero card for homepage
- **Horizontal:** Cards for trending/category sections
- **Vertical:** List items for archive/search

### Navigation.astro
- Responsive design with mobile hamburger menu
- Dark mode toggle integration
- RSS feed link with proper icon
- Search functionality

### FilterButtons.astro
- Category-based filtering
- Active/inactive states
- Responsive padding for mobile

## Styling System

### Dark Mode Implementation
- Uses Tailwind's `class` strategy
- Comprehensive coverage across all components
- Gradient backgrounds for both themes
- Proper contrast ratios maintained

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid systems
- Touch-friendly interactive elements (44px minimum)

### Key CSS Classes
```css
.card-elevated         /* Card component with hover effects */
.magazine-section      /* Content section styling */
.section-divider       /* Visual separators */
.filter-btn-active     /* Active filter button */
.filter-btn-inactive   /* Inactive filter button */
.horizontal-scroll     /* Horizontal scrolling sections */
```

## Search Implementation

### Enhanced Search Features
- Multi-field text matching (title, description, keywords, channel)
- Case-insensitive search
- Multiple keyword support
- Real-time filtering
- Search statistics display

### Search Data Extraction
RSS parsing extracts additional searchable content:
- Video keywords from media:keywords
- Category information
- Author/channel data
- Enhanced description text

## PWA Features

### Service Worker (`public/sw.js`)
- Caches static assets for offline access
- Updates cache on new versions
- Provides install prompt

### Manifest (`public/manifest.json`)
- App metadata for installation
- Theme colors and icons
- Display mode configuration

## Deployment & CI/CD

### GitHub Actions Workflow (`.github/workflows/fetch-rss.yml`)
```yaml
name: Update RSS Data
on:
  schedule:
    - cron: '30 0,4,8,12,16 * * *'  # 5 times daily IST
  workflow_dispatch:

jobs:
  update-rss:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install
      - run: node scripts/fetch-rss.js
      - run: git add data/ && git commit -m "Update RSS data" && git push
```

### Cloudflare Pages Configuration
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Framework:** Astro (auto-detected)
- **Node Version:** 18+
- **Auto-deployment:** On every push to main branch

### Headers Configuration (`public/_headers`)
```
/*.svg
  Content-Type: image/svg+xml

/*.xml
  Content-Type: application/xml

/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

## Development Workflow

### Local Development
```bash
npm install        # Install dependencies
npm run dev       # Start dev server (localhost:4321)
npm run build     # Production build
npm run preview   # Preview production build
```

### RSS Data Management
```bash
node scripts/fetch-rss.js  # Manual RSS update
```

### Git Workflow
- **main** branch for production
- Direct commits to main (automated via GitHub Actions)
- Cloudflare Pages auto-deploys on push

## Key Algorithms & Logic

### Video Deduplication
- Uses hash of video ID + published date
- Prevents duplicate entries across fetches
- Maintains data consistency

### Trending Algorithm
Currently uses most recent videos as "trending" - could be enhanced with:
- View count velocity
- Engagement metrics
- Time-weighted scoring

### Category Assignment
- Manual assignment in `data/config.json`
- Each channel belongs to one primary category
- Filters work by channel category

## Performance Optimizations

### Build Optimizations
- Static site generation (no server-side rendering)
- Image optimization via Astro
- CSS/JS minification
- Tree shaking for unused code

### Runtime Optimizations
- Lazy loading for images
- Intersection Observer for scroll effects
- Efficient DOM manipulation in search
- Minimal JavaScript payload

### Caching Strategy
- Static assets cached by Cloudflare CDN
- RSS data updated via scheduled jobs
- Browser caching for fonts and images

## Security Considerations

### Content Security
- All external links open in new tabs with `noopener noreferrer`
- XSS prevention via proper escaping
- CSRF protection via SameSite cookies (if implemented)

### Headers Security
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### Data Validation
- RSS parsing with error handling
- Input sanitization for search queries
- Type safety via TypeScript

## Monitoring & Analytics

### Error Tracking
- RSS fetch errors logged to `data/fetch-log.json`
- Build failures visible in Cloudflare Pages dashboard
- GitHub Actions failure notifications

### Performance Monitoring
- Cloudflare Analytics (if enabled)
- Core Web Vitals tracking via CF
- Build time monitoring

## Content Strategy

### Channel Selection Criteria
- High-quality content creators
- India-focused perspectives
- Educational/informational content
- Regular upload schedules
- Established audience

### Category Distribution
- **Health:** 4 channels (Food Pharmer, The Plate India, etc.)
- **Business:** 6 channels (Backstage with Millionaires, GrowthX, etc.)
- **Finance:** 8 channels (Wint Wealth, Ditto Insurance, etc.)
- **Upskilling:** 4 channels (Think School, The Cutting Edge School, etc.)
- **Sustainability:** 2 channels (gen.E, Vyre)

## Known Issues & Limitations

### Current Limitations
1. **Duration Data:** YouTube RSS doesn't provide video duration (all show "PT0S")
2. **View Count Accuracy:** RSS view counts may be outdated
3. **Live Detection:** Relies on keywords, not real-time status
4. **Thumbnails:** Uses default quality (hqdefault.jpg)

### Resolved Issues
- ✅ Live labels showing on all videos (formatDuration bug)
- ✅ Dark mode incomplete coverage
- ✅ Mobile responsiveness issues
- ✅ Logo display on Cloudflare Pages
- ✅ Navigation layout problems

## Future Enhancement Opportunities

### Technical Improvements
1. **YouTube Data API Integration**
   - Accurate video duration
   - Real-time view counts
   - Better thumbnail quality options
   - Actual live status detection

2. **Search Enhancements**
   - Fuzzy search implementation
   - Search result ranking
   - Search history/suggestions
   - Advanced filtering options

3. **Performance Optimizations**
   - Image lazy loading improvements
   - Service worker caching strategy
   - Bundle size optimization
   - Core Web Vitals improvements

### Feature Additions
1. **User Personalization**
   - Favorite channels
   - Watch later functionality
   - Personalized recommendations
   - User preferences storage

2. **Social Features**
   - Comment integration (if applicable)
   - Social media sharing enhancements
   - Newsletter subscription
   - Community features

3. **Analytics & Insights**
   - Popular content tracking
   - Channel performance metrics
   - User engagement analytics
   - Content discovery improvements

### Content Expansion
1. **More Channels**
   - Additional creator categories
   - Regional language content
   - Niche topic channels
   - Guest creator features

2. **Content Types**
   - Podcast integration
   - Blog post aggregation
   - Newsletter content
   - Event listings

## Troubleshooting Guide

### Common Issues

#### RSS Fetch Failures
**Symptoms:** Missing or outdated content
**Diagnosis:** Check `data/fetch-log.json` for errors
**Solutions:**
- Verify channel IDs in `data/config.json`
- Check network connectivity in GitHub Actions
- Validate RSS URL accessibility

#### Build Failures
**Symptoms:** Deployment fails on Cloudflare Pages
**Diagnosis:** Check build logs in CF dashboard
**Solutions:**
- Verify Node.js compatibility
- Check for TypeScript errors
- Validate Astro configuration

#### Logo/Asset Issues
**Symptoms:** Missing images or assets
**Diagnosis:** Check browser network tab for 404s
**Solutions:**
- Verify files exist in `public/` directory
- Check `_headers` file configuration
- Ensure proper git commit of assets

#### Dark Mode Issues
**Symptoms:** Inconsistent theming
**Diagnosis:** Inspect elements for missing dark: classes
**Solutions:**
- Add dark mode variants to Tailwind classes
- Check global CSS for hard-coded colors
- Verify DarkModeToggle functionality

#### Mobile Responsiveness
**Symptoms:** Poor mobile experience
**Diagnosis:** Test on various screen sizes
**Solutions:**
- Add responsive breakpoint classes
- Verify touch target sizes (44px minimum)
- Test horizontal scrolling on mobile

### Development Setup Issues

#### Node.js Version Conflicts
```bash
nvm use 18  # Use Node.js 18
npm install # Reinstall dependencies
```

#### Port Conflicts
```bash
npx astro dev --port 3000  # Use different port
```

#### Build Cache Issues
```bash
rm -rf .astro dist node_modules/.cache
npm install
npm run build
```

## API Reference

### RSS Feed Endpoint
**URL:** `/rss.xml`
**Format:** RSS 2.0 with custom extensions
**Updates:** Every time RSS data is refreshed
**Content:** Latest 50 videos across all channels

### Data Files
- `GET /data/videos.json` - All video data (if exposed)
- `GET /data/config.json` - Channel configuration (if exposed)

## Contributing Guidelines

### Code Style
- Use TypeScript for type safety
- Follow Astro component conventions
- Use Tailwind CSS for styling
- Maintain responsive design principles

### Git Workflow
1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Test locally with `npm run build`
4. Push and create pull request
5. Automated deployment after merge

### Testing Checklist
- [ ] All pages load without errors
- [ ] Dark/light mode works across all components
- [ ] Mobile responsiveness on all breakpoints
- [ ] Search functionality works correctly
- [ ] RSS data updates properly
- [ ] Build succeeds without warnings

## Configuration Reference

### Environment Variables
- `NODE_VERSION`: Node.js version (18+)
- `CLOUDFLARE_API_TOKEN`: For Wrangler CLI (if used)

### Build Configuration
```javascript
// astro.config.mjs
export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  adapter: cloudflare()
});
```

### Tailwind Configuration
```javascript
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
};
```

## License & Legal

This project is for educational and portfolio purposes. All YouTube content remains property of respective creators. RSS feeds are publicly available and used in accordance with YouTube's terms of service.

---

**Last Updated:** July 29, 2025  
**Version:** 1.0.0  
**Maintainer:** Bhuvanesh (@bebhuvan)

For questions or issues, please refer to the GitHub repository or create an issue at https://github.com/bebhuvan/zero1/issues