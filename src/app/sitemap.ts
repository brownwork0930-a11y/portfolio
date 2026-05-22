import { MetadataRoute } from "next";

const SITE_URL = "https://brown-portfolio-bay.vercel.app";
const LOCALES = ["en-us", "zh-tw"];

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.map((lang) => ({
    url: `${SITE_URL}/${lang}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: lang === "en-us" ? 1.0 : 0.8,
  }));
}
