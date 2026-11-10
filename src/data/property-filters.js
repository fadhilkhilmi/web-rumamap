export const PRICE_RANGES = [
  { value: "all", label: "Semua harga" },
  { value: "under-500m", label: "Di bawah Rp500 jt", minPrice: 0, maxPrice: 499999999 },
  { value: "500m-1b", label: "Rp500 jt – Rp1 M", minPrice: 500000000, maxPrice: 999999999 },
  { value: "1-2b", label: "Rp1 M – Rp2 M", minPrice: 1000000000, maxPrice: 2000000000 },
  { value: "over-2b", label: "Di atas Rp2 M", minPrice: 2000000001 },
];

export const PROPERTY_AREA_RANGES = [
  { value: "all", label: "Semua luas" },
  { value: "under-75", label: "Di bawah 75 m²", minLandArea: 0, maxLandArea: 74 },
  { value: "75-125", label: "75–125 m²", minLandArea: 75, maxLandArea: 125 },
  { value: "over-125", label: "Di atas 125 m²", minLandArea: 126 },
];

export function filterProperties(properties, filters) {
  const location = filters.location?.trim().toLowerCase() ?? "";
  const search = filters.search?.trim().toLowerCase() ?? "";
  const type = filters.type?.toLowerCase() ?? "all";
  const minimum = filters.minPrice === "" ? null : Number(filters.minPrice);
  const maximum = filters.maxPrice === "" ? null : Number(filters.maxPrice);
  const minimumArea =
    filters.minLandArea === "" ? null : Number(filters.minLandArea);
  const maximumArea =
    filters.maxLandArea === "" ? null : Number(filters.maxLandArea);

  return properties.filter((property) => {
    if (property.verificationStatus !== "APPROVED") return false;
    const locationMatches =
      !location ||
      `${property.location} ${property.address}`.toLowerCase().includes(location);
    const searchMatches =
      !search ||
      `${property.name} ${property.type} ${property.location} ${property.address}`
        .toLowerCase()
        .includes(search);
    const typeMatches = type === "all" || property.type.toLowerCase() === type;
    const minimumMatches = minimum === null || property.price >= minimum;
    const maximumMatches = maximum === null || property.price <= maximum;
    const minimumAreaMatches =
      minimumArea === null || property.landArea >= minimumArea;
    const maximumAreaMatches =
      maximumArea === null || property.landArea <= maximumArea;

    return (
      locationMatches &&
      searchMatches &&
      typeMatches &&
      minimumMatches &&
      maximumMatches &&
      minimumAreaMatches &&
      maximumAreaMatches
    );
  });
}

export function getAvailablePropertyTypes(properties) {
  return [...new Set(
    properties
      .filter((property) => property.verificationStatus === "APPROVED")
      .map((property) => property.type),
  )];
}

export function searchParamsFromFilters(filters) {
  const params = new URLSearchParams();
  const location = filters.location.trim();

  if (location) params.set("location", location);
  if (filters.type !== "all") params.set("type", filters.type);

  const range = PRICE_RANGES.find((option) => option.value === filters.price);
  if (range?.minPrice !== undefined) {
    params.set("minPrice", String(range.minPrice));
  }
  if (range?.maxPrice !== undefined) {
    params.set("maxPrice", String(range.maxPrice));
  }

  return params;
}

export function filtersFromSearchParams(params) {
  const minPrice = params.get("minPrice") ?? "";
  const maxPrice = params.get("maxPrice") ?? "";
  const matchedRange = PRICE_RANGES.find(
    (range) =>
      range.value !== "all" &&
      String(range.minPrice ?? "") === minPrice &&
      String(range.maxPrice ?? "") === maxPrice,
  );

  return {
    location: params.get("location") ?? "",
    type: params.get("type") ?? "all",
    search: params.get("search") ?? "",
    area: "all",
    minPrice,
    maxPrice,
    minLandArea: "",
    maxLandArea: "",
    price: matchedRange?.value ?? "all",
  };
}

export function filtersFromPageParams(values) {
  const params = new URLSearchParams();

  Object.entries(values ?? {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else if (value !== undefined) {
      params.set(key, value);
    }
  });

  return filtersFromSearchParams(params);
}
