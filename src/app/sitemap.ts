import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.reformer.com.ar",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },

    // Add more URLs as needed
  ]
}
