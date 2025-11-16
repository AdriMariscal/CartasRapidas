// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cartas = defineCollection({
  // Cargamos todos los .md de src/content/md/cartas
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/cartas',
  }),
  // Esquema mínimo de frontmatter para cada carta
  schema: z.object({
    titulo: z.string(),        // "Baja de gimnasio"
    descripcion: z.string(),   // Para usar en listados / SEO interno
    clave: z.string(),         // Identificador interno: "baja_gimnasio"
    orden: z.number().optional(),
    activo: z.boolean().default(true),
  }),
});

export const collections = { cartas };
