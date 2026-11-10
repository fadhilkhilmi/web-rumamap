"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Icon from "../icon";
import { useDemoData, updateDemoData } from "../../data/demo-store";
import { dashboardRoles } from "../../data/dashboard";
import {
  AVAILABILITY_STATUSES,
  VERIFICATION_STATUSES,
  applicationForDashboard,
} from "../../data/dashboard-selectors";
import { PROPERTY_TYPES } from "../../data/properties";
import ConfirmModal from "./confirm-modal";
import DataTable from "./data-table";
import {
  ChartCard,
  DemoNotice,
  EmptyState,
  InitialAvatar,
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

function PropertyForm({ initialValue, onSubmit, onCancel }) {
  const [values, setValues] = useState({
      name: "",
      type: "Rumah",
      price: "",
      location: "",
      address: "",
      landArea: "",
      buildingArea: "",
      bedrooms: "",
      bathrooms: "",
      latitude: "",
      longitude: "",
      description: "",
      ...initialValue,
    });
  const [imageName, setImageName] = useState("");

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  return (
    <form
      className="dashboard-property-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ ...values, imageName });
      }}
    >
      <div className="form-section-heading">
        <span className="form-section-number">01</span>
        <div>
          <strong>Informasi properti</strong>
          <p>Data dasar listing Anda.</p>
        </div>
      </div>
      <div className="dashboard-form-grid">
        <label className="dashboard-field">
          Nama properti <span>*</span>
          <input
            required
            maxLength={70}
            placeholder="Contoh: Taman Asri Residence"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
          />
        </label>
        <label className="dashboard-field">
          Tipe properti <span>*</span>
          <select
            required
            value={values.type}
            onChange={(event) => update("type", event.target.value)}
          >
            {PROPERTY_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <label className="dashboard-field">
          Harga (Rp) <span>*</span>
          <input
            required
            type="number"
            min="1"
            placeholder="1250000000"
            value={values.price}
            onChange={(event) => update("price", event.target.value)}
          />
        </label>
        <label className="dashboard-field">
          Lokasi <span>*</span>
          <input
            required
            placeholder="Kecamatan, kota"
            value={values.location}
            onChange={(event) => update("location", event.target.value)}
          />
        </label>
        <label className="dashboard-field">
          Alamat lengkap <span>*</span>
          <input
            required
            placeholder="Nama jalan, nomor, kecamatan, kota"
            value={values.address}
            onChange={(event) => update("address", event.target.value)}
          />
        </label>
      </div>

      <div className="form-section-heading">
        <span className="form-section-number">02</span>
        <div>
          <strong>Spesifikasi properti</strong>
          <p>Detail ukuran dan ruang.</p>
        </div>
      </div>
      <div className="dashboard-form-grid form-grid-four">
        <label className="dashboard-field">
          Luas tanah (m²) <span>*</span>
          <input
            required
            type="number"
            min="1"
            value={values.landArea}
            onChange={(event) => update("landArea", event.target.value)}
          />
        </label>
        <label className="dashboard-field">
          Luas bangunan (m²)
          <input
            type="number"
            min="0"
            value={values.buildingArea}
            onChange={(event) => update("buildingArea", event.target.value)}
          />
        </label>
        <label className="dashboard-field">
          Kamar tidur
          <input
            type="number"
            min="0"
            value={values.bedrooms}
            onChange={(event) => update("bedrooms", event.target.value)}
          />
        </label>
        <label className="dashboard-field">
          Kamar mandi
          <input
            type="number"
            min="0"
            value={values.bathrooms}
            onChange={(event) => update("bathrooms", event.target.value)}
          />
        </label>
      </div>

      <div className="form-section-heading">
        <span className="form-section-number">03</span>
        <div>
          <strong>Foto & koordinat</strong>
          <p>Tambahkan aset demo dan titik koordinat properti.</p>
        </div>
      </div>
      <label className="dashboard-upload-zone">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(event) =>
            setImageName(
              Array.from(event.target.files || [])
                .map((file) => file.name)
                .join(", "),
            )
          }
        />
        <span className="upload-zone-icon">
          <Icon name="image" size={21} />
        </span>
        <strong>{imageName || "Klik untuk memilih foto properti"}</strong>
        <small>JPG atau PNG · pemilihan file hanya untuk tampilan demo</small>
      </label>
      <div className="dashboard-form-grid form-grid-coordinates">
        <label className="dashboard-field">
          Latitude
          <input
            type="number"
            step="any"
            min="-90"
            max="90"
            required
            placeholder="-6.2607"
            value={values.latitude}
            onChange={(event) => update("latitude", event.target.value)}
          />
        </label>
        <label className="dashboard-field">
          Longitude
          <input
            type="number"
            step="any"
            min="-180"
            max="180"
            required
            placeholder="106.7816"
            value={values.longitude}
            onChange={(event) => update("longitude", event.target.value)}
          />
        </label>
      </div>
      <label className="dashboard-field">
        Deskripsi properti
        <textarea
          rows="4"
          maxLength={500}
          placeholder="Ceritakan informasi utama hunian ini."
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
        />
      </label>
      <div className="form-demo-note" role="note">
        Listing yang disimpan hanya akan ditambahkan ke daftar lokal pada sesi
        ini dan ditandai menunggu verifikasi.
      </div>
      <div className="dashboard-form-footer">
        {onCancel && (
          <button
            className="dashboard-button dashboard-button-secondary"
            type="button"
            onClick={onCancel}
          >
            Batal
          </button>
        )}
        <button className="dashboard-button dashboard-button-primary" type="submit">
          <Icon name="check" size={16} />
          {initialValue ? "Simpan perubahan demo" : "Simpan listing demo"}
        </button>
      </div>
    </form>
  );
}

function InquiryTable({ rows, onFollowup, pageSize = 5 }) {
  return (
    <DataTable
      rows={rows}
      pageSize={pageSize}
      searchPlaceholder="Cari nama pembeli atau properti..."
      filterOptions={[
        { value: "PENDING", label: "Menunggu", key: "statusCode" },
        { value: "CONFIRMED", label: "Dikonfirmasi", key: "statusCode" },
        { value: "COMPLETED", label: "Selesai", key: "statusCode" },
      ]}
      columns={[
        {
          key: "buyer",
          label: "Calon pembeli",
          value: (row) => row.buyer,
          render: (row) => (
            <span className="table-user">
              <InitialAvatar initials={row.initials} tone="blue" />
              <span>
                <strong>{row.buyer}</strong>
                <small>{row.id}</small>
              </span>
            </span>
          ),
        },
        { key: "property", label: "Properti" },
        { key: "type", label: "Jenis pengajuan" },
        { key: "date", label: "Tanggal" },
        {
          key: "statusCode",
          label: "Status",
          render: (row) => <StatusBadge>{row.status}</StatusBadge>,
        },
        {
          key: "action",
          label: "Aksi",
          sortable: false,
          render: (row) => (
            <FollowupAction row={row} onSave={onFollowup} />
          ),
        },
      ]}
      emptyTitle="Belum ada pengajuan masuk"
    />
  );
}

function FollowupAction({ row, onSave, iconOnly = false }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");

  return (
    <>
      <button
        className={iconOnly ? "dashboard-icon-button" : "table-action-link"}
        type="button"
        aria-label={iconOnly ? `Tindak lanjuti pengajuan dari ${row.buyer}` : undefined}
        onClick={() => setOpen(true)}
      >
        {iconOnly ? (
          <Icon name="message-square" size={15} />
        ) : (
          "Tindak lanjuti"
        )}
      </button>
      <ConfirmModal
        open={open}
        title="Tindak lanjuti pengajuan"
        description={`${row.buyer} · ${row.property}`}
        confirmLabel="Simpan tindak lanjut demo"
        cancelLabel="Batal"
        tone="success"
        confirmDisabled={note.trim().length < 5}
        onCancel={() => {
          setOpen(false);
          setNote("");
        }}
        onConfirm={() => {
          onSave(row, note.trim());
          setOpen(false);
          setNote("");
        }}
      >
        <label className="dashboard-field modal-field">
          Catatan tindak lanjut <span>*</span>
          <textarea
            required
            minLength={5}
            rows="4"
            placeholder="Contoh: Jadwal kunjungan telah dikonfirmasi."
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </label>
      </ConfirmModal>
    </>
  );
}

function Overview({ properties, inquiries, onEdit, onFollowup }) {
  const stats = [
    { label: "Total properti", value: properties.length, icon: "building-2", accent: "green" },
    { label: "Properti tersedia", value: properties.filter((item) => item.availabilityStatus === "AVAILABLE").length, icon: "home", accent: "blue" },
    { label: "Properti dipesan", value: properties.filter((item) => item.availabilityStatus === "RESERVED").length, icon: "clock", accent: "amber" },
    { label: "Properti terjual", value: properties.filter((item) => item.availabilityStatus === "SOLD").length, icon: "circle-check", trend: "neutral", accent: "purple" },
    { label: "Menunggu verifikasi", value: properties.filter((item) => item.verificationStatus === "PENDING").length, icon: "shield", trend: "neutral", accent: "rose" },
  ];

  return (
    <>
      <PageHeading
        eyebrow="Area penjual / agen"
        title="Selamat pagi, Arif"
        description="Pantau listing dan aktivitas calon pembeli Anda."
        actions={
          <button
            className="dashboard-button dashboard-button-primary"
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("dashboard:navigate", { detail: "add-property" }))}
          >
            <Icon name="plus" size={16} /> Tambah properti
          </button>
        }
      />
      <DemoNotice />
      <StatGrid stats={stats} />
      <div className="dashboard-content-grid seller-chart-grid">
        <ChartCard
          title="Status listing Anda"
          subtitle="Distribusi ketersediaan properti"
          labels={["Tersedia", "Dipesan", "Terjual"]}
          values={[
            properties.filter((item) => item.availabilityStatus === "AVAILABLE")
              .length,
            properties.filter((item) => item.availabilityStatus === "RESERVED")
              .length,
            properties.filter((item) => item.availabilityStatus === "SOLD").length,
          ]}
          total={properties.length}
        />
        <Panel
          title="Status properti"
          subtitle="Distribusi listing demo"
          className="distribution-panel"
        >
          <div className="status-distribution">
            {[
              ["Tersedia", properties.filter((item) => item.availabilityStatus === "AVAILABLE").length, "green"],
              ["Dipesan", properties.filter((item) => item.availabilityStatus === "RESERVED").length, "blue"],
              ["Terjual", properties.filter((item) => item.availabilityStatus === "SOLD").length, "neutral"],
              ["Menunggu verifikasi", properties.filter((item) => item.verificationStatus === "PENDING").length, "amber"],
            ].map(([label, count, tone]) => (
              <div className="distribution-row" key={label}>
                <span className={`distribution-dot dot-${tone}`} />
                <span>{label}</span>
                <strong>{count}</strong>
                <div className="distribution-track">
                  <i style={{ width: `${Math.max(Number(count) * 18, 8)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="chart-demo-caption">Ringkasan dari listing demonstrasi Anda</p>
        </Panel>
      </div>
      <div className="dashboard-content-grid seller-lower-grid">
        <Panel
          title="Properti terbaru"
          subtitle="Listing terakhir diperbarui"
          action={
            <button
              className="dashboard-text-button"
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("dashboard:navigate", { detail: "properties" }))}
            >
              Kelola semua <Icon name="arrow-up-right" size={15} />
            </button>
          }
        >
          <div className="seller-mini-list">
            {properties.slice(0, 3).map((property) => (
              <article className="seller-mini-row" key={property.id}>
                <span className="seller-mini-thumb">
                  <Image src={property.image} alt="" fill sizes="64px" />
                </span>
                <div className="seller-mini-info">
                  <strong>{property.name}</strong>
                  <small>
                    <Icon name="map-pin" size={12} /> {property.location}
                  </small>
                </div>
                <div className="seller-mini-end">
                  <strong>{formatPrice(property.price)}</strong>
                  <StatusBadge>{property.availabilityLabel}</StatusBadge>
                  <StatusBadge>{property.verificationLabel}</StatusBadge>
                </div>
                <button
                  type="button"
                  className="dashboard-icon-button"
                  aria-label={`Edit ${property.name}`}
                  onClick={() => onEdit(property)}
                >
                  <Icon name="pencil" size={15} />
                </button>
              </article>
            ))}
          </div>
        </Panel>
        <Panel
          title="Pengajuan pembeli"
          subtitle="Permintaan terbaru"
          action={
            <button
              className="dashboard-text-button"
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("dashboard:navigate", { detail: "inquiries" }))}
            >
              Lihat semua <Icon name="arrow-up-right" size={15} />
            </button>
          }
        >
          <div className="seller-inquiry-list">
            {inquiries.slice(0, 3).map((inquiry) => (
              <article className="seller-inquiry-row" key={inquiry.id}>
                <InitialAvatar initials={inquiry.initials} tone="blue" />
                <div className="seller-inquiry-copy">
                  <strong>{inquiry.buyer}</strong>
                  <small>{inquiry.property}</small>
                </div>
                <FollowupAction row={inquiry} onSave={onFollowup} iconOnly />
              </article>
            ))}
            {inquiries.length === 0 && (
              <EmptyState
                title="Belum ada pengajuan"
                description="Pengajuan pembeli akan muncul di sini."
              />
            )}
          </div>
        </Panel>
      </div>
    </>
  );
}

export default function SellerDashboard({ activeSection }) {
  const data = useDemoData();
  const sellerId = dashboardRoles.seller.userId;
  const properties = useMemo(
    () =>
      data.properties
        .filter((property) => property.sellerId === sellerId)
        .map((property) => ({
          ...property,
          availabilityLabel:
            AVAILABILITY_STATUSES[property.availabilityStatus],
          verificationLabel:
            VERIFICATION_STATUSES[property.verificationStatus],
        })),
    [data.properties, sellerId],
  );
  const inquiries = useMemo(
    () =>
      data.applications
        .filter((application) => application.sellerId === sellerId)
        .map((application) =>
          applicationForDashboard(application, data.properties),
        )
        .filter(Boolean),
    [data.applications, data.properties, sellerId],
  );
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");

  function saveProperty(values) {
    const savedProperty = {
      ...editing,
      ...values,
      id: editing?.id || `demo-${Date.now()}`,
      listingCode: editing?.listingCode || `RM-${Date.now().toString().slice(-5)}`,
      sellerId,
      name: values.name.trim(),
      price: Number(values.price),
      landArea: Number(values.landArea),
      buildingArea: Number(values.buildingArea || 0),
      bedrooms: Number(values.bedrooms || 0),
      bathrooms: Number(values.bathrooms || 0),
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      location: values.location.trim(),
      address: values.address.trim(),
      verificationStatus: editing?.verificationStatus || "PENDING",
      availabilityStatus: editing?.availabilityStatus || "AVAILABLE",
      updated: "Baru saja",
      image: editing?.image || "/images/rumah-utama.jpg",
      imageAlt: editing?.imageAlt || `Foto ${values.type} demonstrasi`,
      description: values.description.trim(),
    };

    updateDemoData((current) => ({
      ...current,
      properties: editing
        ? current.properties.map((property) =>
            property.id === editing.id ? savedProperty : property,
          )
        : [...current.properties, savedProperty],
    }));
    setEditing(null);
    setNotice(
      editing
        ? "Perubahan listing disimpan di sesi demo."
        : "Listing demo baru ditambahkan dan berstatus menunggu verifikasi.",
    );
    window.dispatchEvent(new CustomEvent("dashboard:navigate", { detail: "properties" }));
  }

  function saveFollowup(followup, note) {
    updateDemoData((current) => ({
      ...current,
      applications: current.applications.map((application) =>
        application.id === followup.id
          ? {
              ...application,
              status: "CONFIRMED",
              followupNote: note,
            }
          : application,
      ),
    }));
    setNotice("Tindak lanjut disimpan pada data demonstrasi.");
  }

  if (activeSection === "logout") {
    return <LogoutPanel />;
  }

  if (activeSection === "add-property") {
    return (
      <>
        <PageHeading
          eyebrow="Listing baru"
          title="Tambah Properti"
          description="Lengkapi informasi properti untuk membuat listing demonstrasi."
        />
        <DemoNotice />
        <Panel title="Informasi listing" subtitle="Tanda * menunjukkan isian wajib">
          <PropertyForm
            onSubmit={(values) => saveProperty(values)}
          />
        </Panel>
      </>
    );
  }

  if (activeSection === "properties") {
    return (
      <>
        <PageHeading
          eyebrow="Portofolio Anda"
          title="Properti Saya"
          description="Kelola informasi listing demonstrasi dalam satu tabel."
          actions={
            <button
              className="dashboard-button dashboard-button-primary"
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("dashboard:navigate", { detail: "add-property" }))}
            >
              <Icon name="plus" size={16} /> Tambah properti
            </button>
          }
        />
        {notice && <div className="dashboard-inline-success" role="status">{notice}</div>}
        <DemoNotice />
        <DataTable
          rows={properties}
          searchPlaceholder="Cari nama, lokasi, atau ID listing..."
          filterOptions={[
            { value: "AVAILABLE", label: "Tersedia", key: "availabilityStatus" },
            { value: "RESERVED", label: "Dipesan", key: "availabilityStatus" },
            { value: "SOLD", label: "Terjual", key: "availabilityStatus" },
            { value: "PENDING", label: "Menunggu verifikasi", key: "verificationStatus" },
            { value: "APPROVED", label: "Disetujui", key: "verificationStatus" },
            { value: "REJECTED", label: "Ditolak", key: "verificationStatus" },
          ]}
          columns={[
            { key: "listingCode", label: "ID Listing" },
            {
              key: "name",
              label: "Properti",
              render: (row) => (
                <span className="table-property">
                  <span className="table-property-thumb">
                    <Image src={row.image} alt="" fill sizes="48px" />
                  </span>
                  <span>
                    <strong>{row.name}</strong>
                    <small>{row.type}</small>
                  </span>
                </span>
              ),
            },
            { key: "location", label: "Lokasi" },
            {
              key: "price",
              label: "Harga",
              value: (row) => row.price,
              render: (row) => formatPrice(row.price),
            },
            {
              key: "availabilityStatus",
              label: "Ketersediaan",
              render: (row) => (
                <StatusBadge>{row.availabilityLabel}</StatusBadge>
              ),
            },
            {
              key: "verificationStatus",
              label: "Verifikasi",
              render: (row) => <StatusBadge>{row.verificationLabel}</StatusBadge>,
            },
            {
              key: "action",
              label: "Aksi",
              sortable: false,
              render: (row) => (
                <button
                  className="table-icon-action"
                  type="button"
                  aria-label={`Edit ${row.name}`}
                  onClick={() => {
                    setEditing(row);
                    window.dispatchEvent(new CustomEvent("dashboard:navigate", { detail: "edit-property" }));
                  }}
                >
                  <Icon name="pencil" size={16} />
                </button>
              ),
            },
          ]}
          emptyTitle="Listing belum tersedia"
        />
      </>
    );
  }

  if (activeSection === "edit-property" || editing) {
    return (
      <>
        <PageHeading
          eyebrow="Perbarui listing"
          title="Edit Properti"
          description={`Perbarui informasi contoh ${editing?.name || "properti"}.`}
        />
        <Panel title="Informasi listing" subtitle="Perubahan disimpan untuk sesi demonstrasi">
          <PropertyForm
            initialValue={editing}
            onSubmit={(values) => saveProperty(values)}
            onCancel={() => {
              setEditing(null);
              window.dispatchEvent(new CustomEvent("dashboard:navigate", { detail: "properties" }));
            }}
          />
        </Panel>
      </>
    );
  }

  if (activeSection === "inquiries" || activeSection === "followup") {
    const rows =
      activeSection === "followup"
        ? inquiries.filter((inquiry) => inquiry.statusCode === "PENDING")
        : inquiries;
    return (
      <>
        <PageHeading
          eyebrow="Aktivitas pembeli"
          title={activeSection === "followup" ? "Tindak Lanjut" : "Pengajuan Masuk"}
          description="Pantau dan tindak lanjuti pengajuan pembeli demonstrasi."
        />
        {notice && <div className="dashboard-inline-success" role="status">{notice}</div>}
        <DemoNotice />
        <InquiryTable rows={rows} onFollowup={saveFollowup} />
      </>
    );
  }

  if (activeSection === "notifications" || activeSection === "profile") {
    return (
      <>
        <PageHeading
          eyebrow={activeSection === "profile" ? "Akun saya" : "Informasi terbaru"}
          title={activeSection === "profile" ? "Profil" : "Notifikasi"}
          description={
            activeSection === "profile"
              ? "Informasi akun agen demonstrasi."
              : "Pembaruan aktivitas listing dan calon pembeli."
          }
        />
        <Panel title={activeSection === "profile" ? "Arif Setiawan" : "Pemberitahuan terbaru"}>
          {activeSection === "profile" ? (
            <div className="profile-summary">
              <InitialAvatar initials="AS" />
              <div>
                <strong>Agen properti · Akun demonstrasi</strong>
                <p>arif.setiawan@demo.test</p>
                <p>+62 812-3456-7890</p>
              </div>
            </div>
          ) : (
            <div className="dashboard-inline-list">
              {inquiries.slice(0, 3).map((item) => (
                <div className="dashboard-inline-list-row" key={item.id}>
                  <Icon name="message-square" size={17} />
                  <span>{item.buyer} mengirim pengajuan untuk {item.property}.</span>
                  <StatusBadge>{item.status}</StatusBadge>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </>
    );
  }

  return (
    <>
      <Overview
        properties={properties}
        inquiries={inquiries}
        onEdit={(property) => {
          setEditing(property);
          window.dispatchEvent(new CustomEvent("dashboard:navigate", { detail: "edit-property" }));
        }}
        onFollowup={saveFollowup}
      />
      {notice && <div className="dashboard-inline-success" role="status">{notice}</div>}
      <DemoNotice />
    </>
  );
}
