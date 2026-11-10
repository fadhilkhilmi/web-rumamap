"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { demoUsers } from "../data/users";
import { useDemoData } from "../data/demo-store";
import { searchParamsFromFilters } from "../data/property-filters";
import Footer from "./footer";
import HeroSection from "./hero-section";
import Icon from "./icon";
import PropertyMap from "./maps/PropertyMap";
import Navbar from "./navbar";
import PropertyCard from "./property-card";

const benefits = [
  {
    icon: "search",
    title: "Pencarian lebih mudah",
    description:
      "Temukan pilihan hunian dengan menyaring lokasi, tipe, dan kisaran harga.",
  },
  {
    icon: "compass",
    title: "Lokasi berbasis peta",
    description:
      "Kenali area sekitar properti melalui konteks lokasi dalam satu tampilan.",
  },
  {
    icon: "list",
    title: "Informasi terperinci",
    description:
      "Bandingkan harga, luas, dan spesifikasi hunian dengan lebih nyaman.",
  },
  {
    icon: "calendar",
    title: "Rencana kunjungan mudah",
    description:
      "Temukan informasi properti sebagai langkah awal merencanakan kunjungan.",
  },
];

function Statistics({ properties }) {
  const stats = [
    { value: properties.length, label: "Pilihan hunian demo" },
    {
      value: new Set(properties.map((property) => property.location)).size,
      label: "Area pencarian",
    },
    {
      value: demoUsers.filter((user) => user.role === "seller").length,
      label: "Penjual demo",
    },
  ];

  return (
    <section className="container stats-section" aria-label="Statistik demo">
      <div className="stats-card">
        {stats.map((stat) => (
          <div className="stat-item" key={stat.label}>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
      <p className="demo-caption">
        Angka di atas merupakan data demonstrasi, bukan data aktual RumaMap.
      </p>
    </section>
  );
}

function MapSection({ properties }) {
  return (
    <section
      className="map-section"
      id="peta-properti"
      aria-labelledby="map-title"
    >
      <div className="container map-layout">
        <div className="map-copy">
          <p className="eyebrow">Lokasi lebih dekat</p>
          <h2 className="section-title" id="map-title">
            Kenali lingkungan sebelum memilih hunian
          </h2>
          <p className="section-description">
            Jelajahi properti berdasarkan lokasi dan pahami lingkungan
            sekitarnya melalui peta interaktif RumaMap.
          </p>
          <ul className="map-points">
            <li className="map-point">
              <span className="map-point-mark">
                <Icon name="check" size={13} />
              </span>
              Jelajahi area hunian berdasarkan lokasi
            </li>
            <li className="map-point">
              <span className="map-point-mark">
                <Icon name="check" size={13} />
              </span>
              Pahami konteks lingkungan sekitar
            </li>
          </ul>
          <a className="button button-primary" href="/map">
            Jelajahi Peta
            <Icon name="arrow" size={17} />
          </a>
        </div>

        <PropertyMap
          properties={properties}
          className="landing-map"
          zoom={11}
        />
      </div>
    </section>
  );
}

function Advantages() {
  return (
    <section
      className="container section"
      id="keunggulan"
      aria-labelledby="advantages-title"
    >
      <div className="section-heading">
        <p className="eyebrow">Pengalaman yang lebih baik</p>
        <h2 className="section-title" id="advantages-title">
          Cari hunian dengan lebih yakin
        </h2>
        <p className="section-description">
          RumaMap membantu menyederhanakan langkah awal pencarian rumah Anda.
        </p>
      </div>

      <div className="advantages-grid">
        {benefits.map((benefit) => (
          <article className="advantage-card" key={benefit.title}>
            <span className="advantage-icon">
              <Icon name={benefit.icon} size={20} />
            </span>
            <h3 className="advantage-title">{benefit.title}</h3>
            <p className="advantage-description">{benefit.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="container cta-section" aria-labelledby="cta-title">
      <div className="cta-card">
        <div className="cta-copy">
          <p className="eyebrow">Langkah pertama dimulai di sini</p>
          <h2 className="cta-title" id="cta-title">
            Siap menemukan tempat pulang Anda?
          </h2>
          <p className="cta-description">
            Mulai jelajahi pilihan properti demonstrasi dan temukan informasi
            lokasi yang Anda perlukan.
          </p>
        </div>
        <a className="button cta-action" href="#cari-properti">
          Mulai cari hunian
          <Icon name="arrow" size={17} />
        </a>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const data = useDemoData();
  const properties = useMemo(
    () =>
      data.properties.filter(
        (property) => property.verificationStatus === "APPROVED",
      ),
    [data.properties],
  );
  const [filters, setFilters] = useState({
    location: "",
    type: "all",
    price: "all",
  });

  function updateFilter(field, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }));
  }

  function handleSearch(event) {
    event.preventDefault();
    const params = searchParamsFromFilters(filters);
    router.push(`/properties${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <HeroSection
          filters={filters}
          properties={properties}
          onFilterChange={updateFilter}
          onSearch={handleSearch}
        />
        <Statistics properties={properties} />

        <section
          className="container section properties-section"
          id="properti-unggulan"
          aria-labelledby="properties-title"
        >
          <div className="properties-heading">
            <div className="section-heading">
              <p className="eyebrow">Pilihan untuk Anda</p>
              <h2 className="section-title" id="properties-title">
                Properti unggulan
              </h2>
              <p className="section-description">
                Kenali beberapa contoh hunian dan detailnya sebelum menentukan
                pilihan.
              </p>
            </div>
            <a className="text-link" href="#cari-properti">
              Sesuaikan pencarian
              <Icon name="arrow" size={16} />
            </a>
          </div>

          <div className="property-grid">
            {properties.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <p className="demo-caption">
            Foto dan detail properti ditampilkan sebagai data demonstrasi.
          </p>
        </section>

        <MapSection properties={properties} />
        <Advantages />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
