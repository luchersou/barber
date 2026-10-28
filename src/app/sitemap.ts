import type { MetadataRoute } from "next";

import { APP_URL } from "@/lib/constants/app";

// Only public pages; everything under /dashboard requires authentication.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${APP_URL}/sign-in`,
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${APP_URL}/sign-up`,
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];
}
