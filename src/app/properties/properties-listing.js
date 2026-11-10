"use client";

import { useMemo, useState } from "react";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import PropertyCard from "../../components/property-card";
import PropertySearchFilters from "../../components/property-search-filters";
import {
  filterProperties,
  PRICE_RANGES,
  PROPERTY_AREA_RANGES,
} from "../../data/property-filters";
import { useDemoData } from "../../data/demo-store";

export default function PropertiesListing({ initialFilters }) {
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(0);
  const data = useDemoData();
  const properties = useMemo(
    () => {
      const filtered = filterProperties(data.properties, filters);

      if (sort === "price-asc") return filtered.sort((a, b) => a.price - b.price);
      if (sort === "price-desc") return filtered.sort((a, b) => b.price - a.price);
      if (sort === "area-asc") {
        return filtered.sort((a, b) => a.landArea - b.landArea);
      }

      return filtered;
    },
    [data.properties, filters, sort],
  );
  const pageSize = 4;
  const pageCount = Math.ceil(properties.length / pageSize);
  const visibleProperties = properties.slice(page * pageSize, (page + 1) * pageSize);

  function updateFilter(field, value) {
    setPage(0);
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function updatePrice(rangeValue) {
    const range = PRICE_RANGES.find((option) => option.value === rangeValue);
    setPage(0);
    setFilters((current) => ({
      ...current,
      price: rangeValue,
      minPrice: range?.minPrice === undefined ? "" : String(range.minPrice),
      maxPrice: range?.maxPrice === undefined ? "" : String(range.maxPrice),
    }));
  }

  return (
    <div className="site-shell">
      <Navbar />
      <main className="container property-results-page">
        <div className="section-heading property-results-heading">
          <p className="eyebrow">Jelajahi hunian</p>
          <h1 className="section-title">Cari properti</h1>
          <p className="section-description">
            Temukan properti demonstrasi berdasarkan lokasi, tipe, dan kisaran
            harga.
          </p>
        </div>
        <PropertySearchFilters
          properties={data.properties}
          filters={filters}
          onFilterChange={updateFilter}
          onPriceChange={updatePrice}
          includeSearch
          className="results-filters"
        />
        <div className="catalog-controls">
          <label className="catalog-area-filter">
            Luas tanah
            <select
              value={filters.area}
              onChange={(event) => {
                const range = PROPERTY_AREA_RANGES.find(
                  (option) => option.value === event.target.value,
                );
                setPage(0);
                setFilters((current) => ({
                  ...current,
                  area: event.target.value,
                  minLandArea:
                    range?.minLandArea === undefined
                      ? ""
                      : String(range.minLandArea),
                  maxLandArea:
                    range?.maxLandArea === undefined
                      ? ""
                      : String(range.maxLandArea),
                }));
              }}
            >
              {PROPERTY_AREA_RANGES.map((range) => (
                <option value={range.value} key={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </label>
          <label className="catalog-area-filter">
            Urutkan
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="relevance">Relevansi</option>
              <option value="price-asc">Harga terendah</option>
              <option value="price-desc">Harga tertinggi</option>
              <option value="area-asc">Luas terkecil</option>
            </select>
          </label>
        </div>
        <p className="search-results" role="status" aria-live="polite">
          {properties.length} properti demonstrasi ditemukan.
        </p>
        <div className="property-grid">
          {visibleProperties.length ? (
            visibleProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="empty-results">
              <strong>Properti belum ditemukan</strong>
              Ubah lokasi atau filter untuk melihat properti demonstrasi lain.
            </div>
          )}
        </div>
        {pageCount > 1 && (
          <nav className="catalog-pagination" aria-label="Halaman properti">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((current) => current - 1)}
            >
              Sebelumnya
            </button>
            <span>
              Halaman {page + 1} dari {pageCount}
            </span>
            <button
              type="button"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((current) => current + 1)}
            >
              Berikutnya
            </button>
          </nav>
        )}
      </main>
      <Footer />
    </div>
  );
}
