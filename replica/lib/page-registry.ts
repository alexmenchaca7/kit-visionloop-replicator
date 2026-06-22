import type { ComponentType } from "react";
import Hero from "@/components/sections/pages/home/Hero";
import ExpertiseGrid from "@/components/sections/pages/home/ExpertiseGrid";
import Stats from "@/components/sections/pages/home/Stats";
import BrandPromise from "@/components/sections/pages/home/BrandPromise";
import Worldwide from "@/components/sections/pages/home/Worldwide";
import SolutionsLandowners from "@/components/sections/pages/home/SolutionsLandowners";
import SolutionsManufacturing from "@/components/sections/pages/home/SolutionsManufacturing";
import FeaturedProjects from "@/components/sections/pages/home/FeaturedProjects";
import LatestNews from "@/components/sections/pages/home/LatestNews";
import FinalCta from "@/components/sections/pages/home/FinalCta";

type Section = ComponentType;

export const pageRegistry: Record<string, { route: string; sections: Section[] }> = {
  home: {
    route: "/",
    sections: [
      Hero,
      ExpertiseGrid,
      Stats,
      BrandPromise,
      Worldwide,
      SolutionsLandowners,
      SolutionsManufacturing,
      FeaturedProjects,
      LatestNews,
      FinalCta,
    ],
  },
};

export function getPageSections(slug: string) {
  return pageRegistry[slug]?.sections ?? [];
}
