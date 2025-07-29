export interface Video {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  duration: string;
  viewCount: string;
  isLive: boolean;
  searchableText?: string;
  keywords?: string;
  hash?: string;
}

export interface Channel {
  name: string;
  category: string;
  color: ChannelColor;
  lastFetched: string;
  fetchStatus: 'success' | 'error' | 'pending';
  fetchDuration?: number;
  videos: Video[];
  error?: string;
}

export interface VideoData {
  lastUpdated: string;
  metadata: {
    totalVideos: number;
    totalChannels: number;
    lastSuccessfulFetch: string;
    fetchDuration: number;
    successfulChannels?: number;
  };
  channels: Record<string, Channel>;
}

export interface ChannelConfig {
  id: string;
  name: string;
  rssUrl: string;
  category: string;
  color: ChannelColor;
  fetchPriority?: 'high' | 'medium' | 'low';
}

export interface Config {
  channels: ChannelConfig[];
  settings: {
    maxVideosPerChannel: number;
    videoCacheDuration: number;
    fetchTimeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
}

export type ChannelColor = 'green' | 'purple' | 'blue' | 'pink' | 'orange' | 'teal';

export const CHANNEL_COLORS: Record<ChannelColor, { bg: string; text: string }> = {
  green: { bg: 'bg-green-50', text: 'text-green-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600' },
};

export type FilterCategory = 'all' | 'business' | 'finance' | 'health' | 'upskilling' | 'sustainability';

export interface VideoWithChannel extends Video {
  channelName: string;
  channelColor: ChannelColor;
  channelId: string;
  channelCategory: string;
}