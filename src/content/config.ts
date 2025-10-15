import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders"; // Not available with legacy API

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default("Admin"),
    tags: z.array(z.string()).default([]),
    lang: z.enum(["en", "ar"]),
    image: z.string().optional(),
  }),
});

const userCollections = defineCollection({
  type: "data",
  schema: z.object({
    users: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        username: z.string(),
        email: z.string(),
        address: z.object({
          street: z.string(),
          suite: z.string(),
          city: z.string(),
          zipcode: z.string(),
          geo: z.object({
            lat: z.string(),
            lng: z.string(),
          }),
        }),
        phone: z.string(),
        website: z.string(),
        company: z.object({
          name: z.string(),
          catchPhrase: z.string(),
          bs: z.string(),
        }),
      })
    ),
  }),
});

export const collections = {
  blog: blogCollection,
  users: userCollections,
};
