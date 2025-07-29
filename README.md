# Zero1 Network

A modern YouTube RSS aggregator built with Astro, TypeScript, and Tailwind CSS. Automatically fetches and displays videos from multiple YouTube channels using GitHub Actions.

## Features

- 🚀 Static site generation with Astro
- 📺 Automatic RSS feed fetching via GitHub Actions
- 🎨 Clean, minimal design with Tailwind CSS
- ⚡ Fast performance with Cloudflare Pages
- 📱 Fully responsive design
- 🔄 Updates every 30 minutes
- 🏷️ Category filtering
- 🔴 Live video indicators

## Tech Stack

- **Framework:** Astro with TypeScript
- **Styling:** Tailwind CSS
- **Font:** Inter (Google Fonts)
- **RSS Processing:** Node.js with xml2js
- **Automation:** GitHub Actions
- **Deployment:** Cloudflare Pages
- **Data Storage:** Static JSON files

## Project Structure

```
zero1-network/
├── src/
│   ├── components/       # Reusable Astro components
│   ├── layouts/         # Page layouts
│   ├── pages/           # Site pages
│   ├── lib/             # TypeScript utilities
│   └── styles/          # Global styles
├── data/
│   ├── config.json      # Channel configuration
│   └── videos.json      # Aggregated video data
├── scripts/
│   └── fetch-rss.js     # RSS fetching script
└── .github/workflows/
    └── fetch-rss.yml    # GitHub Actions workflow
```

## Configuration

### Adding YouTube Channels

Edit `data/config.json` to add or modify channels:

```json
{
  "channels": [
    {
      "id": "UC_channel_id",
      "name": "Channel Name",
      "rssUrl": "https://www.youtube.com/feeds/videos.xml?channel_id=UC_channel_id",
      "category": "tech",
      "color": "blue",
      "fetchPriority": "high"
    }
  ]
}
```

### Available Colors

- green
- purple
- blue
- pink
- orange
- teal

### Categories

- tech
- gaming
- tutorials
- reviews

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

### Environment Variables

No environment variables required for basic operation.

## GitHub Actions

The RSS fetching runs automatically:
- Every 30 minutes
- When `config.json` is updated
- Manual trigger via GitHub Actions UI

## RSS Fetching Script Features

- **Retry Logic:** Automatic retries with exponential backoff
- **Error Handling:** Graceful failure handling
- **Logging:** Detailed logs for debugging
- **Backup:** Automatic backup before updates
- **Atomic Updates:** Safe file writing
- **Priority Fetching:** High-priority channels fetched first
- **Concurrency Control:** Batched fetching to avoid rate limits

## License

MIT