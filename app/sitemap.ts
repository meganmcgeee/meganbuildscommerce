import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const routes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
  }[] = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    {
      path: "/employers/thrive-causemetics",
      priority: 0.85,
      changeFrequency: "monthly"
    },
    { path: "/employers/birdy-grey", priority: 0.85, changeFrequency: "monthly" },
    { path: "/employers/datumix", priority: 0.85, changeFrequency: "monthly" },
    {
      path: "/employers/the-good-agency",
      priority: 0.85,
      changeFrequency: "monthly"
    },
    { path: "/brands/trellis", priority: 0.85, changeFrequency: "monthly" },
    { path: "/and-also-other-stuff", priority: 0.7, changeFrequency: "monthly" }
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority
  }));
}
