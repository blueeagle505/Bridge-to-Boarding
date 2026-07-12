import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXTAUTH_URL || "https://bridgetoboarding.org";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/dashboard", "/mentor", "/admin", "/api"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
