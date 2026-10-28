import type { MetadataRoute } from "next";

import { APP_URL } from "@/lib/constants/app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/sign-in", "/sign-up"],
      disallow: ["/dashboard", "/api"],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
