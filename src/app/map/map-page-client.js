"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import PropertyMap from "../../components/maps/PropertyMap";
import PropertySearchFilters from "../../components/property-search-filters";
import { filterProperties, PRICE_RANGES } from "../../data/property-filters";
import { useDemoData } from "../../data/demo-store";

const formatPrice = (price) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export default function MapPageClient({ initialFilters }) {
  const [filters, setFilters] = useState(initialFilters);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const data = useDemoData();
  const visibleProperties = useMemo(
    () => filterProperties(data.properties, filters),
    [data.properties, filters],
  );

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function updatePrice(rangeValue) {
    const range = PRICE_RANGES.find((option) => option.value === rangeValue);
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
      <main className="container map-page">
        <div className="map-page-heading">
          <div>
            <p className="eyebrow">Jelajahi berdasarkan lokasi</p>
            <h1 className="section-title">Peta properti</h1>
            <p className="section-description">
              Temukan hunian demonstrasi di Semarang dan jelajahi lingkungan
              sekitarnya.
            </p>
          </div>
          <span className="map-demo-label">Peta OpenStreetMap · Data demo</span>
        </div>

        <PropertySearchFilters
          properties={data.properties}
          filters={filters}
          onFilterChange={updateFilter}
          onPriceChange={updatePrice}
          className="map-page-filters"
        />

        <div className="map-page-layout">
          <PropertyMap
            properties={visibleProperties}
            selectedPropertyId={selectedPropertyId}
            onSelectProperty={setSelectedPropertyId}
            className="full-map"
            zoom={12}
          />

          <aside className="map-property-list" aria-label="Daftar properti">
            <div className="map-list-heading">
              <h2>Properti sekitar</h2>
              <span>{visibleProperties.length} properti</span>
            </div>
            <div className="map-list-items">
              {visibleProperties.length ? (
                visibleProperties.map((property) => (
                  <article
                    className={`map-list-item${selectedPropertyId === property.id ? " is-selected" : ""}`}
                    key={property.id}
                  >
                    <button
                      className="map-list-select"
                      type="button"
                      onClick={() => setSelectedPropertyId(property.id)}
                      aria-label={`Tampilkan ${property.name} pada peta`}
                    >
                      <Image
                        src={property.image}
                        alt={property.imageAlt}
                        width={88}
                        height={82}
                      />
                      <span className="map-list-copy">
                        <strong>{property.name}</strong>
                        <span>{property.location}</span>
                        <b>{formatPrice(property.price)}</b>
                      </span>
                    </button>
                    <Link
                      href={`/properties/${property.id}`}
                      className="map-list-detail"
                    >
                      Detail
                    </Link>
                  </article>
                ))
              ) : (
                <p className="map-list-empty">
                  Tidak ada properti yang sesuai dengan filter.
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
