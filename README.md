# Zero1 Network 🚀

> Supporting India's Best Storytellers

A modern YouTube RSS aggregator showcasing high-quality content from India's top creators across business, finance, health, upskilling, and sustainability.

**🌐 Live Site:** https://zero1-uor.pages.dev/

## ✨ Features

- 📺 **24 Curated Channels** - Hand-picked creators across 5 categories
- 🔄 **Auto-Updates** - RSS content refreshed 5 times daily
- 🌙 **Dark/Light Mode** - Seamless theme switching
- 📱 **Mobile-First** - Responsive design for all devices
- 🔍 **Smart Search** - Enhanced search with multi-field matching
- 📡 **RSS Syndication** - Subscribe to the full feed
- ⚡ **PWA Ready** - Install as an app
- 🎯 **Category Filters** - Browse by topic

## 🏗️ Tech Stack

- **Framework:** [Astro](https://astro.build/) 5.12.4
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Deployment:** [Cloudflare Pages](https://pages.cloudflare.com/)
- **Automation:** GitHub Actions

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/bebhuvan/zero1.git
cd zero1

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📋 Categories

- **🏥 Health & Wellness** - Food Pharmer, The Plate India
- **💼 Business & Entrepreneurship** - Backstage with Millionaires, GrowthX
- **💰 Finance & Investing** - Wint Wealth, Ditto Insurance, NRI Diaries
- **📚 Upskilling & Learning** - Think School, The Cutting Edge School
- **🌱 Sustainability & Future** - gen.E, Vyre

## 🔄 Automated Updates

RSS content is automatically updated **5 times daily** (IST):
- 6:00 AM - Morning briefing
- 10:00 AM - Mid-morning update  
- 2:00 PM - Afternoon refresh
- 6:00 PM - Evening update
- 10:00 PM - Night wrap-up

## 📖 Documentation

For comprehensive documentation including architecture, deployment, and contribution guidelines, see [DOCUMENTATION.md](./DOCUMENTATION.md).

## 🛠️ Development

### RSS Data Management
```bash
# Manually update RSS data
node scripts/fetch-rss.js

# Check fetch logs
cat data/fetch-log.json
```

### Project Structure
```
src/
├── components/     # Reusable Astro components
├── layouts/        # Page layouts
├── pages/          # Routes (index, about, search, etc.)
├── lib/            # Utilities and types
└── styles/         # Global CSS

data/
├── config.json     # Channel configuration
├── videos.json     # Aggregated video data
└── fetch-log.json  # RSS fetch logs
```

## 🎨 Design Philosophy

Zero1 Network embraces a **magazine-style aesthetic** with:
- Clean typography using Inter font
- Soft color palette for readability
- Card-based layouts with subtle elevations
- Responsive grid systems
- Thoughtful spacing and visual hierarchy

## 🔒 Privacy & Security

- No user tracking or analytics
- All external links open safely in new tabs
- Content Security Policy headers
- RSS data fetched from public YouTube feeds only

## 📊 Performance

- ⚡ Static site generation for fast loading
- 🖼️ Optimized images and assets
- 📦 Minimal JavaScript footprint
- 🌐 Global CDN distribution via Cloudflare

## 🤝 Contributing

We welcome contributions! Please see our [contributing guidelines](./DOCUMENTATION.md#contributing-guidelines) for details.

### Key Areas for Contribution:
- Channel recommendations
- UI/UX improvements  
- Performance optimizations
- Feature enhancements
- Bug fixes

## 📈 Future Roadmap

- [ ] YouTube Data API integration for better metadata
- [ ] User personalization features
- [ ] Newsletter integration
- [ ] Advanced search and filtering
- [ ] Content recommendation engine
- [ ] Regional language support

## 📄 License

This project is for educational and portfolio purposes. All YouTube content remains property of respective creators.

## 🙏 Acknowledgments

Special thanks to all the creators who inspire and educate through their content:

**Health & Wellness:** Food Pharmer, The Plate India  
**Business:** Backstage with Millionaires, GrowthX, Been There Done That, Indian Silicon Valley  
**Finance:** Wint Wealth, NRI Diaries, Ditto Insurance, Sonia Shenoy, Breakdown, Americonomics  
**Upskilling:** Think School Hindi, The Cutting Edge School, Full Disclosure, Anurag Bansal  
**Sustainability:** gen.E, Vyre  
**Multi-category:** The Other Side with Dilip, Pranay Kapoor, Vishal Bhargava, Tirthak Saha

---

**Built with ❤️ for India's creator economy**

🔗 **Links:**
- [Live Site](https://zero1-uor.pages.dev/)
- [Documentation](./DOCUMENTATION.md)
- [Issues](https://github.com/bebhuvan/zero1/issues)

*Last updated: July 29, 2025*