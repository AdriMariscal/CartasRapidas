// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cartas = defineCollection({
  // Cargamos todos los .md de src/content/cartas
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/cartas',
  }),
  // Esquema de frontmatter para cada carta
  schema: z.object({
    // Campos básicos
    titulo: z.string(),        // "Baja de gimnasio"
    descripcion: z.string(),   // Para usar en listados / SEO interno
    clave: z.string(),         // Identificador interno: "baja-gimnasio"
    orden: z.number().optional(),
    activo: z.boolean().default(true),

    // Campos de contenido para la página de detalle
    intro: z.string().optional(),

    puntos_clave: z.array(z.string()).optional(),

    // Puede ser un objeto { clave: "texto" } o un array de objetos
    que_revisar: z
      .record(z.string())
      .or(
        z.array(
          z.object({
            titulo: z.string().optional(),
            descripcion: z.string().optional(),
          }),
        ),
      )
      .optional(),

    pasos: z.array(z.string()).optional(),

    consejos_envio: z.array(z.string()).optional(),

    faq: z
      .array(
        z.object({
          pregunta: z.string(),
          respuesta: z.string(),
        }),
      )
      .optional(),
  }),
});

export const collections = { cartas };
