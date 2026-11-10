import PropertiesListing from "./properties-listing";
import { filtersFromPageParams } from "../../data/property-filters";

export default async function PropertiesPage({ searchParams }) {
  const initialFilters = filtersFromPageParams(await searchParams);
  return <PropertiesListing initialFilters={initialFilters} />;
}
