"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "../icon";
import { demoNotifications, dashboardRoles } from "../../data/dashboard";
import { useDemoData } from "../../data/demo-store";
import {
  APPLICATION_STATUSES,
  AVAILABILITY_STATUSES,
  applicationForDashboard,
} from "../../data/dashboard-selectors";
import {
  toggleFavoriteProperty,
  useFavoritePropertyIds,
} from "../../data/favorites-store";
import DataTable from "./data-table";
import {
  DemoNotice,
  EmptyState,
  PageHeading,
  Panel,
  StatGrid,
} from "./dashboard-primitives";
import StatusBadge from "./status-badge";
import LogoutPanel from "./logout-panel";

const formatPrice = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

function getSubmissionColumns() {
  return [
    { key: "id", label: "ID Pengajuan" },
    { key: "property", label: "Properti" },
    { key: "agent", label: "Agen" },
    { key: "type", label: "Jenis" },
    { key: "date", label: "Tanggal" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge>{row.status}</StatusBadge>,
    },
  ];
}

function FavoriteGrid({ properties, onRemove }) {
  if (!properties.length) {
    return (
      <EmptyState
        title="Belum ada properti favorit"
        description="Properti yang Anda tandai sebagai favorit akan tampil di sini."
        icon="heart"
      />
    );
  }

  return (
    <div className="buyer-favorite-grid">
      {properties.map((property) => (
        <article className="buyer-favorite-card" key={property.id}>
          <div className="buyer-favorite-image">
            <Image src={property.image} alt="" fill sizes="320px" />
            <span className="favorite-status">
              <StatusBadge>
                {AVAILABILITY_STATUSES[property.availabilityStatus]}
              </StatusBadge>
            </span>
            <button
              className="dashboard-icon-button favorite-remove"
              type="button"
              aria-label={`Hapus ${property.name} dari favorit`}
              onClick={() => onRemove(property.id)}
            >
              <Icon name="heart" size={17} filled />
            </button>
          </div>
          <div className="buyer-favorite-body">
            <h3>{property.name}</h3>
            <p className="buyer-favorite-location">
              <Icon name="map-pin" size={14} />
              {property.location}
            </p>
            <strong>{formatPrice(property.price)}</strong>
            <div className="buyer-property-meta">
              <span>
                <Icon name="bed" size={14} />
                {property.bedrooms} kamar tidur
              </span>
              <span>
                <Icon name="ruler" size={14} />
                {property.landArea} m²
              </span>
            </div>
            <Link
              className="dashboard-button dashboard-button-secondary"
              href={`/properties/${property.id}`}
            >
              Lihat detail
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function BuyerDashboard({ activeSection }) {
  const data = useDemoData();
  const favoriteIds = useFavoritePropertyIds();
  const buyerId = dashboardRoles.buyer.userId;
  const favorites = useMemo(
    () =>
      data.properties.filter(
        (property) =>
          favoriteIds.includes(property.id) &&
          property.verificationStatus === "APPROVED",
      ),
    [data.properties, favoriteIds],
  );
  const buyerSubmissions = useMemo(
    () =>
      data.applications
        .filter((application) => application.buyerId === buyerId)
        .map((application) =>
          applicationForDashboard(application, data.properties),
        )
        .filter(Boolean),
    [buyerId, data.applications, data.properties],
  );
  const [profileSaved, setProfileSaved] = useState(false);
  const pendingCount = buyerSubmissions.filter(
    (item) => item.statusCode === "PENDING",
  ).length;
  const visitCount = buyerSubmissions.filter(
    (item) =>
      item.type === "Kunjungan" &&
      ["PENDING", "CONFIRMED"].includes(item.statusCode),
  ).length;

  const stats = [
    { label: "Total favorit", value: favorites.length, icon: "heart", accent: "green" },
    { label: "Total pengajuan", value: buyerSubmissions.length, icon: "file-text", accent: "blue" },
    { label: "Menunggu respons", value: pendingCount, icon: "clock", trend: "neutral", accent: "amber" },
    { label: "Kunjungan belum selesai", value: visitCount, icon: "calendar-days", trend: "neutral", accent: "purple" },
  ];

  if (activeSection === "logout") {
    return <LogoutPanel />;
  }

  if (activeSection === "profile") {
    return (
      <>
        <PageHeading
          eyebrow="Akun saya"
          title="Profil"
          description="Kelola informasi profil contoh Anda."
        />
        <Panel title="Informasi pribadi" subtitle="Data profil demonstrasi">
          {profileSaved && (
            <div className="dashboard-inline-success" role="status">
              Perubahan profil tersimpan di tampilan demo.
            </div>
          )}
          <form
            className="dashboard-form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              setProfileSaved(true);
            }}
          >
            <label className="dashboard-field">
              Nama lengkap
              <input required defaultValue="Nadia Putri" />
            </label>
            <label className="dashboard-field">
              Email
              <input required type="email" defaultValue="nadia.putri@demo.test" />
            </label>
            <label className="dashboard-field">
              Nomor telepon
              <input required type="tel" defaultValue="+62 812-3456-7890" />
            </label>
            <label className="dashboard-field">
              Kota
              <input defaultValue="Jakarta Selatan" />
            </label>
            <div className="dashboard-form-footer">
              <button className="dashboard-button dashboard-button-primary" type="submit">
                Simpan perubahan
              </button>
            </div>
          </form>
        </Panel>
      </>
    );
  }

  if (activeSection === "favorites") {
    return (
      <>
        <PageHeading
          eyebrow="Pilihan tersimpan"
          title="Properti Favorit"
          description="Hunian yang menarik perhatian Anda, tersimpan dalam satu tempat."
        />
        <DemoNotice />
        <FavoriteGrid
          properties={favorites}
          onRemove={toggleFavoriteProperty}
        />
      </>
    );
  }

  if (activeSection === "notifications") {
    return (
      <>
        <PageHeading
          eyebrow="Informasi terbaru"
          title="Notifikasi"
          description="Pembaruan aktivitas akun demonstrasi Anda."
        />
        <Panel title="Terbaru" subtitle="Notifikasi simulasi sesi">
          <div className="buyer-notifications">
            {demoNotifications.map((notification, index) => (
              <article className="buyer-notification-row" key={notification.id}>
                <span className={`activity-icon activity-icon-${index % 2 ? "blue" : "green"}`}>
                  <Icon name={index === 0 ? "calendar-days" : "info"} size={17} />
                </span>
                <div>
                  <strong>{notification.title}</strong>
                  <p>{notification.description}</p>
                </div>
                <time>{notification.time}</time>
              </article>
            ))}
          </div>
        </Panel>
        <DemoNotice>Notifikasi ini adalah data demonstrasi, bukan pemberitahuan aktual.</DemoNotice>
      </>
    );
  }

  if (activeSection === "visits" || activeSection === "interest" || activeSection === "history") {
    const type =
      activeSection === "visits"
        ? "Kunjungan"
        : activeSection === "interest"
          ? "Minat beli"
          : "";
    const rows = type
      ? buyerSubmissions.filter((submission) => submission.type === type)
      : buyerSubmissions;
    const title =
      activeSection === "visits"
        ? "Pengajuan Kunjungan"
        : activeSection === "interest"
          ? "Minat Beli"
          : "Riwayat Pengajuan";

    return (
      <>
        <PageHeading
          eyebrow="Aktivitas Anda"
          title={title}
          description="Pantau perkembangan pengajuan pada data demonstrasi."
        />
        <DemoNotice />
        <DataTable
          rows={rows}
          columns={getSubmissionColumns()}
          searchPlaceholder="Cari properti atau agen..."
          filterOptions={[
              { value: "PENDING", label: "Menunggu", key: "statusCode" },
              { value: "CONFIRMED", label: "Dikonfirmasi", key: "statusCode" },
              { value: "COMPLETED", label: "Selesai", key: "statusCode" },
          ]}
          emptyTitle="Belum ada pengajuan"
        />
      </>
    );
  }

  return (
    <>
      <PageHeading
        eyebrow="Area pembeli"
        title="Selamat pagi, Nadia"
        description="Berikut kabar terbaru dari perjalanan hunian Anda."
        actions={
          <a className="dashboard-button dashboard-button-primary" href="#buyer-favorites">
            <Icon name="search" size={16} />
            Jelajahi properti
          </a>
        }
      />
      <DemoNotice />
      <StatGrid stats={stats} />
      <div className="dashboard-content-grid buyer-overview-grid">
        <Panel
          title="Properti favorit terbaru"
          subtitle="Pilihan yang Anda simpan"
          action={
            <button
              className="dashboard-text-button"
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("dashboard:navigate", { detail: "favorites" }))}
            >
              Lihat semua <Icon name="arrow-up-right" size={15} />
            </button>
          }
        >
          <div className="buyer-overview-favorites" id="buyer-favorites">
            {favorites.slice(0, 3).map((property) => (
              <article className="buyer-overview-favorite" key={property.id}>
                <div className="buyer-overview-thumb">
                  <Image src={property.image} alt="" fill sizes="80px" />
                </div>
                <div className="buyer-overview-copy">
                  <strong>{property.name}</strong>
                  <span>
                    <Icon name="map-pin" size={12} />
                    {property.location}
                  </span>
                  <b>{formatPrice(property.price)}</b>
                </div>
                <button
                  className="dashboard-icon-button favorite-small"
                  type="button"
                  aria-label={`Hapus ${property.name} dari favorit`}
                  onClick={() => toggleFavoriteProperty(property.id)}
                >
                  <Icon name="heart" size={16} filled />
                </button>
              </article>
            ))}
            {favorites.length === 0 && (
              <EmptyState
                title="Belum ada favorit"
                description="Properti favorit Anda akan terlihat di sini."
                icon="heart"
              />
            )}
          </div>
        </Panel>

        <Panel
          title="Pengajuan terbaru"
          subtitle="Perkembangan aktivitas Anda"
          action={
            <button
              className="dashboard-text-button"
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("dashboard:navigate", { detail: "history" }))}
            >
              Riwayat <Icon name="arrow-up-right" size={15} />
            </button>
          }
        >
          <DataTable
            rows={buyerSubmissions.slice(0, 3)}
            columns={[
              { key: "property", label: "Properti" },
              { key: "type", label: "Jenis" },
              {
                key: "status",
                label: "Status",
                render: (row) => <StatusBadge>{row.status}</StatusBadge>,
              },
            ]}
            pageSize={3}
            searchPlaceholder="Cari pengajuan..."
            emptyTitle="Belum ada pengajuan"
          />
        </Panel>
      </div>
      {buyerSubmissions.find(
        (submission) =>
          submission.type === "Kunjungan" &&
          submission.statusCode === "PENDING",
      ) && (
        <div className="dashboard-activity-strip">
          <span className="dashboard-activity-icon">
            <Icon name="calendar-days" size={18} />
          </span>
          <div>
            <strong>Ada kunjungan yang menunggu konfirmasi</strong>
            <p>
              Pengajuan{" "}
              {
                buyerSubmissions.find(
                  (submission) =>
                    submission.type === "Kunjungan" &&
                    submission.statusCode === "PENDING",
                ).id
              }{" "}
              ·{" "}
              {
                buyerSubmissions.find(
                  (submission) =>
                    submission.type === "Kunjungan" &&
                    submission.statusCode === "PENDING",
                ).property
              }
            </p>
          </div>
          <StatusBadge>
            {APPLICATION_STATUSES[
              buyerSubmissions.find(
                (submission) =>
                  submission.type === "Kunjungan" &&
                  submission.statusCode === "PENDING",
              ).statusCode
            ]}
          </StatusBadge>
        </div>
      )}
      <DemoNotice>Pengajuan dan informasi properti di dashboard ini bersifat demonstrasi.</DemoNotice>
    </>
  );
}
