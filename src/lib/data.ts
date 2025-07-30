import type { VideoData, Video, Channel, VideoWithChannel, FilterCategory } from './types';
import videosData from '../../data/videos.json';

const typedVideosData = videosData as VideoData;

export function getAllVideos(): VideoWithChannel[] {
  const allVideos: VideoWithChannel[] = [];
  
  Object.entries(typedVideosData.channels).forEach(([channelId, channel]) => {
    channel.videos.forEach(video => {
      allVideos.push({
        ...video,
        channelName: channel.name,
        channelColor: channel.color,
        channelId,
        channelCategory: channel.category
      });
    });
  });

  return allVideos.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getVideosByCategory(category: FilterCategory): VideoWithChannel[] {
  if (category === 'all') return getAllVideos();
  
  if (category === 'live') {
    return getAllVideos().filter(video => video.isLive);
  }
  
  const allVideos: VideoWithChannel[] = [];
  
  Object.entries(typedVideosData.channels).forEach(([channelId, channel]) => {
    if (channel.category === category) {
      channel.videos.forEach(video => {
        allVideos.push({
          ...video,
          channelName: channel.name,
          channelColor: channel.color,
          channelId,
          channelCategory: channel.category
        });
      });
    }
  });

  return allVideos.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getTrendingVideos(limit = 10): VideoWithChannel[] {
  return getAllVideos()
    .filter(video => !video.isLive)
    .sort((a, b) => {
      const viewsA = parseInt(a.viewCount) || 0;
      const viewsB = parseInt(b.viewCount) || 0;
      
      const hoursAgoA = (Date.now() - new Date(a.publishedAt).getTime()) / (1000 * 60 * 60);
      const hoursAgoB = (Date.now() - new Date(b.publishedAt).getTime()) / (1000 * 60 * 60);
      
      const scoreA = viewsA / Math.max(hoursAgoA, 1);
      const scoreB = viewsB / Math.max(hoursAgoB, 1);
      
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

export function getFeaturedVideo(): VideoWithChannel | null {
  const recentVideos = getAllVideos()
    .filter(video => !video.isLive);
  
  if (recentVideos.length === 0) return null;
  
  return recentVideos[0];
}

export function getLatestVideos(limit = 20): VideoWithChannel[] {
  return getAllVideos().slice(0, limit);
}

export function getLiveVideos(): VideoWithChannel[] {
  return getAllVideos().filter(video => video.isLive);
}

export function getChannels(): Record<string, Channel> {
  return typedVideosData.channels;
}

export function getChannelById(channelId: string): Channel | null {
  return typedVideosData.channels[channelId] || null;
}

export function getVideosByChannel(channelId: string): VideoWithChannel[] {
  const channel = typedVideosData.channels[channelId];
  if (!channel) return [];
  
  return channel.videos.map(video => ({
    ...video,
    channelName: channel.name,
    channelColor: channel.color,
    channelId,
    channelCategory: channel.category
  }));
}

export function getLastUpdated(): string {
  return typedVideosData.lastUpdated;
}

export function getMetadata() {
  return typedVideosData.metadata;
}

export function formatViewCount(count: string): string {
  const num = parseInt(count) || 0;
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  
  return num.toString();
}

export function formatDuration(duration: string): string {
  if (!duration || duration === 'PT0S') return '';
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  
  // If total duration is 0, return empty string
  if (hours === 0 && minutes === 0 && seconds === 0) return '';
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 2629800) return `${Math.floor(seconds / 604800)} weeks ago`;
  if (seconds < 31557600) return `${Math.floor(seconds / 2629800)} months ago`;
  
  return `${Math.floor(seconds / 31557600)} years ago`;
}