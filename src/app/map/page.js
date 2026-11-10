import MapPageClient from "./map-page-client";
import { filtersFromPageParams } from "../../data/property-filters";

export default async function MapPage({ searchParams }) {
  const initialFilters = filtersFromPageParams(await searchParams);
  return <MapPageClient initialFilters={initialFilters} />;
}
