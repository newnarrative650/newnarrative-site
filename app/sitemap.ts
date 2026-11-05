import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newnarrative.ru';

// Главная и существующие подстраницы (их содержимое не меняется в этой задаче)
const paths = ['/', '/events', '/digital', '/futbolario', '/match3-game', '/car-simulator'];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((p) => ({
    url: `${SITE_URL}${p === '/' ? '' : p}`,
    changeFrequency: 'monthly',
    priority: p === '/' ? 1 : 0.7,
  }));
}
