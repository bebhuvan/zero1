import rss from '@astrojs/rss';
import { getAllVideos } from '@/lib/data';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const allVideos = getAllVideos();
  const latestVideos = allVideos.slice(0, 50); // Latest 50 stories

  return rss({
    title: 'Zero1 Network | India\'s Best Storytellers',
    description: 'Latest stories from India\'s best storytellers across business, finance, health, upskilling, and sustainability. Quality stories that inspire, educate, and transform.',
    site: context.site || 'http://localhost:4321',
    items: latestVideos.map((video) => ({
      title: video.title,
      pubDate: new Date(video.publishedAt),
      description: video.description || `New story from ${video.channelName} in the ${video.channelCategory} category.`,
      link: video.youtubeUrl,
      author: video.channelName,
      categories: [video.channelCategory],
      customData: `
        <media:thumbnail url="${video.thumbnailUrl}" />
        <media:content url="${video.youtubeUrl}" type="video/mp4" />
        <dc:creator>${video.channelName}</dc:creator>
        <content:encoded><![CDATA[
          <p><strong>${video.channelName}</strong> - ${video.channelCategory}</p>
          <p><img src="${video.thumbnailUrl}" alt="${video.title}" style="max-width: 100%; height: auto;" /></p>
          <p>${video.description || 'Watch this story on YouTube'}</p>
          <p><a href="${video.youtubeUrl}" target="_blank">Watch on YouTube →</a></p>
        ]]></content:encoded>
      `,
    })),
    customData: `
      <language>en-us</language>
      <managingEditor>noreply@zero1network.com (Zero1 Network)</managingEditor>
      <webMaster>noreply@zero1network.com (Zero1 Network)</webMaster>
      <docs>https://www.rssboard.org/rss-specification</docs>
      <generator>Zero1 Network RSS Generator</generator>
      <category>Business</category>
      <category>Finance</category>
      <category>Health</category>
      <category>Education</category>
      <category>Sustainability</category>
      <ttl>360</ttl>
      <atom:link href="${context.site || 'http://localhost:4321'}/rss.xml" rel="self" type="application/rss+xml" />
    `,
  });
}