import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

const staticRoutes = [
  '/',
  '/faq',
  '/sobre',
  '/contacto',
  '/legal/privacidad',
  '/legal/cookies',
  '/legal/terminos',
];

function normalizeCartaSlug(entry: any): string {
  const data = entry.data ?? {};

  if (data.slug) return String(data.slug).replace(/_/g, '-');
  if (data.clave) return String(data.clave).replace(/_/g, '-');

  const id = entry.id ?? '';
  return id.replace(/\.md$/, '').split('/').pop() ?? id;
}

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.href ?? 'https://cartasrapidas.es';
  const cartas = await getCollection('cartas', (entry) => entry.data.activo !== false);
  const cartaRoutes = cartas.map((entry) => `/cartas/${normalizeCartaSlug(entry)}`);

  const allRoutes = [...staticRoutes, ...cartaRoutes];

  const urls = allRoutes
    .map((path) => {
      const loc = new URL(path, baseUrl).href;
      return `<url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
    })
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};