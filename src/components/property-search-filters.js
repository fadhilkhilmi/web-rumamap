import Icon from "./icon";
import {
  getAvailablePropertyTypes,
  PRICE_RANGES,
} from "../data/property-filters";

export default function PropertySearchFilters({
  properties,
  filters,
  onFilterChange,
  onPriceChange,
  includeSearch = false,
  className = "",
}) {
  const types = getAvailablePropertyTypes(properties);

  return (
    <div className={`property-search-filters ${className}`}>
      {includeSearch && (
        <label className="search-field">
          <span className="search-label">Cari properti</span>
          <span className="search-control">
            <Icon name="search" size={17} />
            <input
              type="search"
              placeholder="Nama atau detail properti"
              value={filters.search}
              onChange={(event) => onFilterChange("search", event.target.value)}
            />
          </span>
        </label>
      )}
      <label className="search-field">
        <span className="search-label">Lokasi</span>
        <span className="search-control">
          <Icon name="map-pin" size={18} />
          <input
            type="search"
            placeholder="Kota atau area"
            value={filters.location}
            onChange={(event) => onFilterChange("location", event.target.value)}
          />
        </span>
      </label>

      <label className="search-field">
        <span className="search-label">Tipe properti</span>
        <span className="search-control">
          <Icon name="home" size={17} />
          <select
            value={filters.type}
            onChange={(event) => onFilterChange("type", event.target.value)}
          >
            <option value="all">Semua tipe</option>
            {types.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
          <Icon name="chevron-down" size={15} />
        </span>
      </label>

      <label className="search-field">
        <span className="search-label">Rentang harga</span>
        <span className="search-control">
          <Icon name="ruler" size={17} />
          <select
            value={filters.price}
            onChange={(event) => onPriceChange(event.target.value)}
          >
            {PRICE_RANGES.map((range) => (
              <option value={range.value} key={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <Icon name="chevron-down" size={15} />
        </span>
      </label>
    </div>
  );
}
