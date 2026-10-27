import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rackhouse",
    short_name: "Rackhouse",
    start_url: "/portal",
    display: "standalone",
    background_color: "#eceef2",
    theme_color: "#2540ff",
  };
}
