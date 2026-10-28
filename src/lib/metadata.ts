import type { Metadata } from "next";

import { APP_NAME } from "@/lib/constants/app";

const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${APP_NAME} — sistema de gestão para barbearias`,
};

// Next.js merges metadata shallowly, so a page that sets `openGraph` or
// `twitter` replaces the parent's object entirely (including the image).
// Spread these bases to keep the shared fields.
export const openGraphBase = {
  type: "website",
  locale: "pt_BR",
  siteName: APP_NAME,
  images: [ogImage],
} satisfies Metadata["openGraph"];

export const twitterBase = {
  card: "summary_large_image",
  images: [ogImage],
} satisfies Metadata["twitter"];

/**
 * Builds the metadata of a public, indexable page.
 */
export function publicPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} | ${APP_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...openGraphBase, title: fullTitle, description, url: path },
    twitter: { ...twitterBase, title: fullTitle, description },
  };
}
