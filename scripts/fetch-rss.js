import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import xml2js from 'xml2js';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG_PATH = path.join(__dirname, '../data/config.json');
const VIDEOS_PATH = path.join(__dirname, '../data/videos.json');
const BACKUP_PATH = path.join(__dirname, '../data/videos.backup.json');
const LOG_PATH = path.join(__dirname, '../data/fetch-log.json');

// Utilities
class Logger {
  constructor() {
    this.logs = [];
  }

  info(message, data = {}) {
    this.log('info', message, data);
    console.log(`[INFO] ${message}`, data);
  }

  error(message, error = {}) {
    this.log('error', message, { error: error.message || error });
    console.error(`[ERROR] ${message}`, error);
  }

  warn(message, data = {}) {
    this.log('warn', message, data);
    console.warn(`[WARN] ${message}`, data);
  }

  log(level, message, data) {
    this.logs.push({
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    });
  }

  async save() {
    try {
      await fs.writeFile(LOG_PATH, JSON.stringify(this.logs, null, 2));
    } catch (error) {
      console.error('Failed to save logs:', error);
    }
  }
}

// Retry mechanism with exponential backoff
async function withRetry(fn, options = {}) {
  const {
    retries = 3,
    delay = 1000,
    backoff = 2,
    onRetry = () => {}
  } = options;

  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        const waitTime = delay * Math.pow(backoff, i);
        onRetry(i + 1, waitTime, error);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError;
}

// Enhanced RSS fetcher with better error handling
class RSSFetcher {
  constructor(logger) {
    this.logger = logger;
    this.parser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true
    });
  }

  async fetchFeed(channel, settings) {
    const startTime = Date.now();
    
    try {
      this.logger.info(`Fetching RSS feed for ${channel.name}`);
      
      const response = await withRetry(
        () => this.fetchWithTimeout(channel.rssUrl, settings.fetchTimeout),
        {
          retries: settings.retryAttempts,
          delay: settings.retryDelay,
          onRetry: (attempt, delay, error) => {
            this.logger.warn(`Retry ${attempt} for ${channel.name} after ${delay}ms`, {
              error: error.message
            });
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xmlData = await response.text();
      const result = await this.parser.parseStringPromise(xmlData);
      
      const videos = this.extractVideos(result, channel, settings);
      const fetchDuration = Date.now() - startTime;
      
      // Extract channel name from RSS feed
      const channelName = result.feed?.title || channel.name;
      
      this.logger.info(`Successfully fetched ${videos.length} videos for ${channelName}`, {
        duration: fetchDuration
      });

      return {
        videos,
        channelName,
        fetchStatus: 'success',
        lastFetched: new Date().toISOString(),
        fetchDuration
      };
    } catch (error) {
      const fetchDuration = Date.now() - startTime;
      this.logger.error(`Failed to fetch ${channel.name}`, error);
      
      return {
        videos: [],
        fetchStatus: 'error',
        lastFetched: new Date().toISOString(),
        fetchDuration,
        error: error.message
      };
    }
  }

  async fetchWithTimeout(url, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Zero1-Network-RSS-Aggregator/1.0',
          'Accept': 'application/rss+xml, application/xml, text/xml',
          'Cache-Control': 'no-cache'
        }
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  extractVideos(feedData, channel, settings) {
    const videos = [];
    
    try {
      const entries = this.ensureArray(feedData?.feed?.entry || []);
      
      for (const entry of entries.slice(0, settings.maxVideosPerChannel)) {
        try {
          const video = this.parseVideoEntry(entry);
          if (video) {
            videos.push(video);
          }
        } catch (error) {
          this.logger.warn(`Failed to parse video entry for ${channel.name}`, {
            error: error.message,
            entry: JSON.stringify(entry).slice(0, 200)
          });
        }
      }
    } catch (error) {
      this.logger.error(`Failed to extract videos for ${channel.name}`, error);
    }
    
    return videos;
  }

  parseVideoEntry(entry) {
    const videoId = this.extractVideoId(entry?.link?.href || entry?.link);
    if (!videoId) return null;

    const mediaGroup = entry['media:group'] || {};
    const mediaContent = mediaGroup['media:content'] || {};
    const mediaThumbnail = this.ensureArray(mediaGroup['media:thumbnail'] || [])[0] || {};
    const mediaDescription = mediaGroup['media:description'] || '';
    const duration = mediaContent.duration || 'PT0S';
    
    // Filter out YouTube Shorts (videos under 60 seconds)
    if (this.isShort(duration)) {
      return null;
    }

    // Extract additional searchable content
    const mediaKeywords = mediaGroup['media:keywords'] || '';
    const mediaCategory = mediaGroup['media:category'] || '';
    const author = entry.author?.name || '';
    
    // Create searchable text combining multiple fields
    const searchableText = [
      entry.title || '',
      this.cleanDescription(mediaDescription),
      mediaKeywords,
      mediaCategory,
      author
    ].join(' ').toLowerCase();

    return {
      id: videoId,
      title: entry.title || 'Untitled',
      description: this.cleanDescription(mediaDescription),
      publishedAt: entry.published || entry.updated || new Date().toISOString(),
      thumbnailUrl: mediaThumbnail.url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      duration: duration,
      viewCount: this.extractViewCount(entry),
      isLive: this.checkIfLive(entry),
      searchableText: searchableText, // New field for enhanced search
      keywords: mediaKeywords, // Store keywords separately if available
      hash: this.generateHash(videoId + entry.published)
    };
  }

  extractVideoId(link) {
    if (!link) return null;
    const match = link.match(/watch\?v=([^&]+)/);
    return match ? match[1] : null;
  }

  extractViewCount(entry) {
    try {
      const stats = entry['media:group']?.['media:community']?.['media:statistics'];
      return stats?.views || '0';
    } catch {
      return '0';
    }
  }

  checkIfLive(entry) {
    const title = (entry.title || '').toLowerCase();
    const description = (entry['media:group']?.['media:description'] || '').toLowerCase();
    
    // Only consider live if explicit live indicators are present
    const hasLiveKeywords = 
      title.includes('🔴 live') ||
      title.includes('live now') ||
      title.includes('live stream') ||
      title.includes('[live]') ||
      description.includes('live streaming now') ||
      description.includes('currently live') ||
      description.includes('streaming live');
    
    // Additional check: if published very recently (within last 30 minutes) AND has live keywords
    const publishedTime = new Date(entry.published || entry.updated);
    const now = new Date();
    const timeDiff = now.getTime() - publishedTime.getTime();
    const thirtyMinutes = 30 * 60 * 1000;
    
    return hasLiveKeywords && (timeDiff < thirtyMinutes);
  }

  isShort(duration) {
    if (!duration || duration === 'PT0S') return false;
    
    // Parse ISO 8601 duration (PT1M30S = 1 minute 30 seconds)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return false;
    
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    // Consider videos under 60 seconds as Shorts
    return totalSeconds > 0 && totalSeconds < 60;
  }

  cleanDescription(description) {
    if (!description) return '';
    return description
      .replace(/\r\n/g, ' ')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 500);
  }

  ensureArray(item) {
    if (!item) return [];
    return Array.isArray(item) ? item : [item];
  }

  generateHash(input) {
    return crypto.createHash('md5').update(input).digest('hex').slice(0, 8);
  }
}

// Main orchestrator
class RSSAggregator {
  constructor() {
    this.logger = new Logger();
    this.fetcher = new RSSFetcher(this.logger);
  }

  async run() {
    const startTime = Date.now();
    
    try {
      this.logger.info('Starting RSS aggregation');
      
      // Load configuration
      const config = await this.loadConfig();
      const settings = config.settings;
      
      // Load existing data
      const existingData = await this.loadExistingData();
      
      // Create backup
      await this.createBackup(existingData);
      
      // Fetch feeds in parallel with concurrency limit
      const results = await this.fetchAllFeeds(config.channels, settings);
      
      // Merge with existing data
      const updatedData = this.mergeData(existingData, results, config.channels);
      
      // Calculate metadata
      updatedData.metadata = this.calculateMetadata(updatedData, startTime);
      
      // Save updated data
      await this.saveData(updatedData);
      
      // Clean up old backups
      await this.cleanupBackups();
      
      this.logger.info('RSS aggregation completed successfully', {
        duration: Date.now() - startTime,
        totalVideos: updatedData.metadata.totalVideos
      });
      
    } catch (error) {
      this.logger.error('RSS aggregation failed', error);
      throw error;
    } finally {
      await this.logger.save();
    }
  }

  async loadConfig() {
    try {
      const data = await fs.readFile(CONFIG_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      this.logger.error('Failed to load config', error);
      throw new Error('Configuration file not found or invalid');
    }
  }

  async loadExistingData() {
    try {
      const data = await fs.readFile(VIDEOS_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      this.logger.info('No existing data found, starting fresh');
      return {
        lastUpdated: new Date().toISOString(),
        metadata: {},
        channels: {}
      };
    }
  }

  async createBackup(data) {
    try {
      await fs.writeFile(BACKUP_PATH, JSON.stringify(data, null, 2));
      this.logger.info('Backup created');
    } catch (error) {
      this.logger.warn('Failed to create backup', error);
    }
  }

  async fetchAllFeeds(channels, settings) {
    const concurrencyLimit = 5;
    const results = new Map();
    
    // Group channels by priority
    const priorityGroups = this.groupByPriority(channels);
    
    // Fetch high priority first, then medium, then low
    for (const [priority, group] of Object.entries(priorityGroups)) {
      this.logger.info(`Fetching ${priority} priority channels`);
      
      // Process in batches
      for (let i = 0; i < group.length; i += concurrencyLimit) {
        const batch = group.slice(i, i + concurrencyLimit);
        const batchResults = await Promise.all(
          batch.map(channel => 
            this.fetcher.fetchFeed(channel, settings)
              .then(result => ({ channel, result }))
          )
        );
        
        batchResults.forEach(({ channel, result }) => {
          results.set(channel.id, { channel, result });
        });
      }
    }
    
    return results;
  }

  groupByPriority(channels) {
    const groups = {
      high: [],
      medium: [],
      low: []
    };
    
    channels.forEach(channel => {
      const priority = channel.fetchPriority || 'medium';
      groups[priority].push(channel);
    });
    
    return groups;
  }

  mergeData(existingData, fetchResults, channels) {
    const updatedData = {
      lastUpdated: new Date().toISOString(),
      channels: {}
    };
    
    // Process each channel
    for (const channel of channels) {
      const fetchData = fetchResults.get(channel.id);
      const existingChannel = existingData.channels?.[channel.id];
      
      if (fetchData?.result.fetchStatus === 'success') {
        // Successful fetch - use new data with actual channel name from RSS
        updatedData.channels[channel.id] = {
          name: fetchData.result.channelName || channel.name,
          category: channel.category,
          color: channel.color,
          lastFetched: fetchData.result.lastFetched,
          fetchStatus: fetchData.result.fetchStatus,
          fetchDuration: fetchData.result.fetchDuration,
          videos: this.deduplicateVideos(fetchData.result.videos)
        };
      } else if (existingChannel) {
        // Failed fetch - keep existing data but update status
        updatedData.channels[channel.id] = {
          ...existingChannel,
          fetchStatus: fetchData?.result.fetchStatus || 'error',
          lastAttemptedFetch: new Date().toISOString(),
          error: fetchData?.result.error
        };
      } else {
        // No existing data and failed fetch
        updatedData.channels[channel.id] = {
          name: channel.name,
          category: channel.category,
          color: channel.color,
          lastFetched: new Date().toISOString(),
          fetchStatus: 'error',
          videos: [],
          error: fetchData?.result.error || 'Unknown error'
        };
      }
    }
    
    return updatedData;
  }

  deduplicateVideos(videos) {
    const seen = new Set();
    return videos.filter(video => {
      if (seen.has(video.id)) {
        return false;
      }
      seen.add(video.id);
      return true;
    });
  }

  calculateMetadata(data, startTime) {
    let totalVideos = 0;
    let successfulChannels = 0;
    
    Object.values(data.channels).forEach(channel => {
      totalVideos += channel.videos?.length || 0;
      if (channel.fetchStatus === 'success') {
        successfulChannels++;
      }
    });
    
    return {
      totalVideos,
      totalChannels: Object.keys(data.channels).length,
      successfulChannels,
      lastSuccessfulFetch: new Date().toISOString(),
      fetchDuration: Date.now() - startTime
    };
  }

  async saveData(data) {
    const tempPath = VIDEOS_PATH + '.tmp';
    
    try {
      // Write to temp file first
      await fs.writeFile(tempPath, JSON.stringify(data, null, 2));
      
      // Atomic rename
      await fs.rename(tempPath, VIDEOS_PATH);
      
      this.logger.info('Data saved successfully');
    } catch (error) {
      // Clean up temp file if exists
      try {
        await fs.unlink(tempPath);
      } catch {}
      
      throw error;
    }
  }

  async cleanupBackups() {
    // Keep only the latest backup
    // In a real implementation, you might want to keep multiple backups
    this.logger.info('Backup cleanup completed');
  }
}

// Run the aggregator
if (import.meta.url === `file://${__filename}`) {
  const aggregator = new RSSAggregator();
  aggregator.run()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { RSSAggregator, RSSFetcher, Logger };