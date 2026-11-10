"use client";

import { useFavoritePropertyIds, toggleFavoriteProperty } from "../data/favorites-store";
import Image from "next/image";
import Link from "next/link";
import Icon from "./icon";

const STATUS_LABELS = {
  AVAILABLE: "Tersedia",
  RESERVED: "Dipesan",
  SOLD: "Terjual",
};

const formatPrice = (price) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export default function PropertyCard({ property }) {
  const isFavorite = useFavoritePropertyIds().includes(property.id);

  return (
    <article className="property-card">
      <div className="property-image-wrap">
        <Image
          className="property-photo"
          src={property.image}
          alt={property.imageAlt}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 960px) 50vw, 33vw"
        />
        <span
          className={`property-badge property-badge-${property.availabilityStatus.toLowerCase()}`}
        >
          {STATUS_LABELS[property.availabilityStatus]}
        </span>
        <button
          className={`favorite-button${isFavorite ? " is-favorite" : ""}`}
          type="button"
          aria-label={
            isFavorite
              ? `Hapus ${property.name} dari favorit`
              : `Tambahkan ${property.name} ke favorit`
          }
          aria-pressed={isFavorite}
          onClick={() => toggleFavoriteProperty(property.id)}
        >
          <Icon name="heart" size={17} filled={isFavorite} />
        </button>
      </div>

      <div className="property-body">
        <p className="property-type">{property.type}</p>
        <h3 className="property-title">{property.name}</h3>
        <p className="property-location">
          <Icon name="map-pin" size={14} />
          {property.location}
        </p>
        <p className="property-price">
          {formatPrice(property.price)} <span>/ unit</span>
        </p>

        <div className="property-features" aria-label="Spesifikasi properti">
          <span className="property-feature">
            <Icon name="ruler" size={14} />
            {property.buildingArea} m² bangunan
          </span>
          <span className="property-feature">
            <Icon name="bed" size={15} />
            {property.bedrooms} KT
          </span>
          <span className="property-feature">
            <Icon name="bath" size={15} />
            {property.bathrooms} KM
          </span>
        </div>

        <div className="property-card-footer">
          <span className="property-plot">
            Luas tanah {property.landArea} m²
          </span>
          <Link
            className="button button-outline property-detail-button"
            href={`/properties/${property.id}`}
          >
            Lihat detail
          </Link>
        </div>
      </div>
    </article>
  );
}
