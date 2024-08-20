import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { createClient } from "@/utils/supabase/server";
import regions from "@/constants/regions";

const addPathToBaseURL = (path: string) => `${siteConfig.url}/${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const { data: models, error } = await supabase.from("models").select("slug");
  if (error) {
    throw Error(error.message);
  }

  const { data: trims, error: trimError } = await supabase
    .from("trims")
    .select("slug");
  if (trimError) {
    throw Error(trimError.message);
  }

  const priceUrls = models.map((model) => ({
    url: addPathToBaseURL(`prices/${model.slug}`),
    lastModified: new Date("2024-08-12"),
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const trimUrls = trims
    .map((trim) => {
      return [
        {
          url: addPathToBaseURL(`cars/${trim.slug}`),
          lastModified: new Date("2024-08-12"),
          priority: 0.8,
          changeFrequency: "monthly" as const,
        },
      ];
    })
    .flat();

  const trimWithRegionUrls = regions
    .map((region) => {
      return trimUrls.map((trimUrl) => ({
        url: `${trimUrl.url}?region=${region.code}`,
        lastModified: new Date(),
        priority: trimUrl.priority,
        changeFrequency: trimUrl.changeFrequency,
      }));
    })
    .flat();

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: "daily",
    },
    ...priceUrls,
    ...trimUrls,
    ...trimWithRegionUrls,
  ];
}
