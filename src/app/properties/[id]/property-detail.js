"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "../../../components/footer";
import Navbar from "../../../components/navbar";
import { useDemoData } from "../../../data/demo-store";

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

export default function PropertyDetail({ propertyId }) {
  const data = useDemoData();
  const property = data.properties.find(
    (item) =>
      item.id === propertyId && item.verificationStatus === "APPROVED",
  );

  if (!property) {
    return (
      <div className="site-shell">
        <Navbar />
        <main className="container placeholder-page">
          <p className="eyebrow">Properti tidak tersedia</p>
          <h1 className="section-title">Listing tidak ditemukan</h1>
          <p className="section-description">
            Properti ini belum disetujui untuk ditampilkan atau tidak tersedia.
          </p>
          <Link className="button button-primary" href="/properties">
            Kembali ke katalog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="site-shell">
      <Navbar />
      <main className="container property-detail-page">
        <Link className="text-link detail-back-link" href="/properties">
          Kembali ke properti
        </Link>
        <article className="property-detail-layout">
          <div className="property-detail-image">
            <Image
              src={property.image}
              alt={property.imageAlt}
              fill
              sizes="(max-width: 720px) 100vw, 56vw"
              priority
            />
          </div>
          <div className="property-detail-content">
            <span
              className={`property-badge property-detail-status property-badge-${property.availabilityStatus.toLowerCase()}`}
            >
              {STATUS_LABELS[property.availabilityStatus]}
            </span>
            <p className="property-type">{property.type}</p>
            <h1 className="section-title">{property.name}</h1>
            <p className="property-location">{property.location}</p>
            <p className="property-price">{formatPrice(property.price)}</p>
            <p className="property-detail-address">{property.address}</p>
            <p className="dialog-description">{property.description}</p>
            <div className="property-features">
              <span className="property-feature">
                Luas tanah {property.landArea} m²
              </span>
              <span className="property-feature">
                Luas bangunan {property.buildingArea} m²
              </span>
              <span className="property-feature">
                {property.bedrooms} kamar tidur
              </span>
              <span className="property-feature">
                {property.bathrooms} kamar mandi
              </span>
            </div>
            <p className="demo-caption detail-demo-caption">
              Data demonstrasi, bukan penawaran atau ketersediaan aktual.
            </p>
            <Link className="button button-primary detail-map-link" href="/map">
              Lihat lokasi di peta
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
