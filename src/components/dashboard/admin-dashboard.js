"use client";

import { useMemo, useState } from "react";
import Icon from "../icon";
import { demoNotifications } from "../../data/dashboard";
import { demoUsers } from "../../data/users";
import { useDemoData, updateDemoData } from "../../data/demo-store";
import { adminListingForDashboard } from "../../data/dashboard-selectors";
import { PROPERTY_TYPES } from "../../data/properties";
import ConfirmModal from "./confirm-modal";
import DataTable from "./data-table";
import {
  ChartCard,
  DemoNotice,
  InitialAvatar,
  PageHeading,
  Panel,
  StatGrid,
} from "./dashboard-primitives";
import StatusBadge from "./status-badge";
import LogoutPanel from "./logout-panel";

const listingColumns = [
  { key: "listingId", label: "ID Listing" },
  { key: "name", label: "Nama properti" },
  { key: "owner", label: "Pemilik / agen" },
  { key: "type", label: "Tipe" },
  { key: "location", label: "Lokasi" },
  { key: "verificationLabel", label: "Verifikasi" },
  { key: "availabilityLabel", label: "Ketersediaan" },
];

function ActivityList({ activities }) {
  return (
    <div className="activity-feed">
      {activities.map((item) => (
        <article className="activity-feed-row" key={item.id}>
          <InitialAvatar initials={item.initials} tone={item.tone} />
          <div className="activity-feed-copy">
            <p>
              <strong>{item.actor}</strong> {item.action}{" "}
              <span>{item.target}</span>
            </p>
            <small>{item.time}</small>
          </div>
          <span className={`activity-feed-dot dot-${item.tone}`} />
        </article>
      ))}
    </div>
  );
}

function AdminOverview({
  listings,
  applicationsCount,
  activities,
  onReview,
}) {
  const pendingCount = listings.filter(
    (item) => item.verificationStatus === "PENDING",
  ).length;
  const availableCount = listings.filter(
    (item) => item.availabilityStatus === "AVAILABLE",
  ).length;
  const reservedCount = listings.filter(
    (item) => item.availabilityStatus === "RESERVED",
  ).length;
  const soldCount = listings.filter(
    (item) => item.availabilityStatus === "SOLD",
  ).length;
  const stats = [
    { label: "Total pengguna", value: demoUsers.length, icon: "users", accent: "green" },
    { label: "Total properti", value: listings.length, icon: "building-2", accent: "blue" },
    { label: "Menunggu verifikasi", value: pendingCount, icon: "clock", trend: "neutral", accent: "amber" },
    { label: "Properti tersedia", value: availableCount, icon: "home", accent: "purple" },
    { label: "Properti terjual", value: soldCount, icon: "circle-check", accent: "rose" },
    { label: "Total pengajuan", value: applicationsCount, icon: "file-text", accent: "mint" },
  ];

  const columns = [
    { key: "listingId", label: "ID Listing" },
    {
      key: "name",
      label: "Listing",
      render: (row) => (
        <span className="admin-listing-name">
          <span className="listing-mini-icon">
            <Icon name="building-2" size={16} />
          </span>
          <span>
            <strong>{row.name}</strong>
            <small>{row.owner}</small>
          </span>
        </span>
      ),
    },
    { key: "location", label: "Lokasi" },
    { key: "submitted", label: "Diajukan" },
    {
      key: "verificationLabel",
      label: "Verifikasi",
      render: (row) => <StatusBadge>{row.verificationLabel}</StatusBadge>,
    },
    {
      key: "availabilityLabel",
      label: "Ketersediaan",
      render: (row) => <StatusBadge>{row.availabilityLabel}</StatusBadge>,
    },
    {
      key: "action",
      label: "Aksi",
      sortable: false,
      render: (row) => (
        <button
          className="table-action-link"
          type="button"
          onClick={() => onReview(row)}
        >
          Tinjau
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeading
        eyebrow="Administrasi RumaMap"
        title="Selamat pagi, Dimas"
        description="Ikhtisar aktivitas dan operasional RumaMap hari ini."
        actions={
          <span className="admin-secure-label">
            <Icon name="shield" size={15} />
            Panel administrasi
          </span>
        }
      />
      <DemoNotice />
      <StatGrid stats={stats} />
      <div className="dashboard-content-grid admin-chart-grid">
        <ChartCard
          title="Status listing saat ini"
          subtitle="Distribusi ketersediaan listing"
          labels={["Tersedia", "Dipesan", "Terjual"]}
          values={[availableCount, reservedCount, soldCount]}
          total={listings.length}
        />
        <Panel title="Ringkasan platform" subtitle="Snapshot data demonstrasi">
          <div className="admin-platform-summary">
            <div className="platform-summary-total">
              <span>Total listing</span>
              <strong>{listings.length}</strong>
              <span className="summary-change">
                <Icon name="building-2" size={13} /> seluruh listing demonstrasi
              </span>
            </div>
            <div className="platform-summary-row">
              <span><i className="distribution-dot dot-green" /> Tersedia</span>
              <strong>{availableCount}</strong>
              <span>{listings.length ? Math.round((availableCount / listings.length) * 100) : 0}%</span>
            </div>
            <div className="platform-summary-row">
              <span><i className="distribution-dot dot-blue" /> Dipesan</span>
              <strong>{reservedCount}</strong>
              <span>{listings.length ? Math.round((reservedCount / listings.length) * 100) : 0}%</span>
            </div>
            <div className="platform-summary-row">
              <span><i className="distribution-dot dot-blue" /> Terjual</span>
              <strong>{soldCount}</strong>
              <span>{listings.length ? Math.round((soldCount / listings.length) * 100) : 0}%</span>
            </div>
            <div className="platform-summary-row">
              <span><i className="distribution-dot dot-amber" /> Menunggu verifikasi</span>
              <strong>{pendingCount}</strong>
              <span>Verifikasi</span>
            </div>
              <p className="chart-demo-caption">Ringkasan dari sumber data demonstrasi</p>
          </div>
        </Panel>
      </div>
      <div className="dashboard-content-grid admin-lower-grid">
        <Panel
          title="Listing terbaru"
          subtitle="Pembaruan aktivitas properti"
          action={
            <button
              className="dashboard-text-button"
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("dashboard:navigate", { detail: "verification" }))}
            >
              Semua listing <Icon name="arrow-up-right" size={15} />
            </button>
          }
        >
          <DataTable
            rows={listings.slice(0, 3)}
            columns={columns}
            pageSize={3}
            searchPlaceholder="Cari listing..."
            emptyTitle="Belum ada listing"
          />
        </Panel>
        <Panel
          title="Aktivitas terbaru"
          subtitle="Jejak aktivitas demonstrasi"
          action={
            <button
              className="dashboard-text-button"
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("dashboard:navigate", { detail: "activity" }))}
            >
              Activity logs <Icon name="arrow-up-right" size={15} />
            </button>
          }
        >
          <ActivityList activities={activities.slice(0, 4)} />
        </Panel>
      </div>
    </>
  );
}

function ListingReviewModal({ listing, onClose, onApprove, onReject }) {
  if (!listing) return null;

  return (
    <div
      className="dashboard-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="dashboard-modal listing-review-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="listing-review-title"
      >
        <button
          className="dashboard-modal-close"
          type="button"
          aria-label="Tutup detail"
          onClick={onClose}
        >
          <Icon name="x" size={19} />
        </button>
        <p className="dashboard-eyebrow">Verifikasi listing</p>
        <h2 id="listing-review-title">{listing.name}</h2>
        <p className="modal-description">
          Periksa detail listing demonstrasi sebelum menentukan statusnya.
        </p>
        <div className="review-summary-card">
          <span className="review-property-icon"><Icon name="building-2" size={23} /></span>
          <div>
            <strong>{listing.listingId}</strong>
            <span>{listing.type} · {listing.location}</span>
          </div>
          <StatusBadge>{listing.verificationLabel}</StatusBadge>
          <StatusBadge>{listing.availabilityLabel}</StatusBadge>
        </div>
        <div className="review-details-grid">
          <div><small>Pemilik / agen</small><strong>{listing.owner}</strong></div>
          <div><small>Tanggal pengajuan</small><strong>{listing.submitted}</strong></div>
          <div><small>Kategori</small><strong>{listing.type}</strong></div>
          <div><small>Lokasi</small><strong>{listing.location}</strong></div>
        </div>
        <div className="review-info-box">
          <Icon name="info" size={16} />
          Data detail, foto, dan dokumen listing di panel ini merupakan konten demonstrasi.
        </div>
        <div className="dashboard-modal-actions">
          <button
            className="dashboard-button dashboard-button-secondary"
            type="button"
            onClick={() => onReject(listing)}
          >
            <Icon name="circle-x" size={16} /> Tolak listing
          </button>
          <button
            className="dashboard-button dashboard-button-primary"
            type="button"
            onClick={() => onApprove(listing)}
          >
            <Icon name="circle-check" size={16} /> Setujui listing
          </button>
        </div>
      </section>
    </div>
  );
}

export default function AdminDashboard({ activeSection }) {
  const data = useDemoData();
  const [usersDisabled, setUsersDisabled] = useState({});
  const listings = useMemo(
    () => data.properties.map(adminListingForDashboard),
    [data.properties],
  );
  const users = useMemo(
    () =>
      demoUsers.map((user) => ({
        ...user,
        role:
          user.role === "seller"
            ? "Agen"
            : user.role === "buyer"
              ? "Pembeli"
              : "Administrator",
        status: usersDisabled[user.id]
          ? user.status === "Aktif"
            ? "Tidak aktif"
            : "Aktif"
          : user.status,
      })),
    [usersDisabled],
  );
  const activities = useMemo(
    () =>
      data.applications.map((application) => {
        const property = data.properties.find(
          (item) => item.id === application.propertyId,
        );
        const buyer = demoUsers.find((item) => item.id === application.buyerId);

        return {
          id: application.id,
          initials: buyer?.name
            .split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join(""),
          actor: buyer?.name ?? "Pembeli tidak ditemukan",
          action: "mengajukan aktivitas properti",
          target: property?.name ?? "Properti tidak ditemukan",
          time: application.date,
          tone: application.status === "PENDING" ? "amber" : "green",
        };
      }),
    [data.applications, data.properties],
  );
  const [customCategories, setCustomCategories] = useState([]);
  const [categoryStatuses, setCategoryStatuses] = useState({});
  const categories = useMemo(() => {
    const typeCounts = data.properties.reduce((counts, property) => {
      counts[property.type] = (counts[property.type] ?? 0) + 1;
      return counts;
    }, {});

    return [
      ...PROPERTY_TYPES.map((name, index) => ({
        id: `CAT-${String(index + 1).padStart(2, "0")}`,
        name,
        slug: name.toLowerCase(),
        properties: typeCounts[name] ?? 0,
        status: categoryStatuses[name] ?? "Aktif",
      })),
      ...customCategories.map((category) => ({
        ...category,
        status: categoryStatuses[category.name] ?? "Aktif",
      })),
    ];
  }, [categoryStatuses, customCategories, data.properties]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [rejectingListing, setRejectingListing] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [notice, setNotice] = useState("");
  const [reportFilter, setReportFilter] = useState("semua");
  const [appliedReportFilter, setAppliedReportFilter] = useState("semua");

  function updateListingStatus(listing, status, reason = "") {
    updateDemoData((current) => ({
      ...current,
      properties: current.properties.map((property) =>
        property.id === listing.id
          ? {
              ...property,
              verificationStatus: status,
              rejectionReason: reason,
              updated: "Baru saja",
            }
          : property,
      ),
    }));
    setNotice(
      status === "APPROVED"
        ? `${listing.name} disetujui di data demonstrasi.`
        : `${listing.name} ditolak di data demonstrasi.`,
    );
    setSelectedListing(null);
    setRejectingListing(null);
    setRejectionReason("");
  }

  function saveCategory(event) {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name) {
      setCategoryError("Nama kategori wajib diisi.");
      return;
    }
    if (categories.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      setCategoryError("Kategori dengan nama tersebut sudah ada.");
      return;
    }

    setCustomCategories((current) => [
      ...current,
      {
        id: `CAT-${String(current.length + 1).padStart(2, "0")}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        properties: 0,
        status: "Aktif",
      },
    ]);
    setCategoryName("");
    setCategoryError("");
    setCategoryOpen(false);
    setNotice("Kategori demo ditambahkan untuk sesi ini.");
  }

  function updateUserStatus(user) {
    setUsersDisabled((current) => ({
      ...current,
      [user.id]: !current[user.id],
    }));
    setNotice(`Status akun ${user.name} diperbarui pada sesi demo.`);
  }

  if (activeSection === "logout") {
    return <LogoutPanel />;
  }

  if (activeSection === "users") {
    return (
      <>
        <PageHeading
          eyebrow="Direktori platform"
          title="Manajemen Pengguna"
          description="Tinjau dan kelola akun pengguna demonstrasi."
        />
        {notice && <div className="dashboard-inline-success" role="status">{notice}</div>}
        <DemoNotice />
        <DataTable
          rows={users}
          searchPlaceholder="Cari nama, email, atau ID..."
          filterOptions={[
            { value: "Pembeli", label: "Pembeli", key: "role" },
            { value: "Agen", label: "Agen", key: "role" },
            { value: "Aktif", label: "Aktif", key: "status" },
            { value: "Menunggu", label: "Menunggu", key: "status" },
          ]}
          columns={[
            { key: "id", label: "ID Pengguna" },
            {
              key: "name",
              label: "Pengguna",
              render: (row) => (
                <span className="table-user">
                  <InitialAvatar initials={row.name.split(" ").map((word) => word[0]).slice(0, 2).join("")} />
                  <span><strong>{row.name}</strong><small>{row.email}</small></span>
                </span>
              ),
            },
            { key: "role", label: "Role", render: (row) => <StatusBadge>{row.role}</StatusBadge> },
            { key: "joined", label: "Bergabung" },
            { key: "status", label: "Status", render: (row) => <StatusBadge>{row.status}</StatusBadge> },
            {
              key: "action",
              label: "Aksi",
              sortable: false,
              render: (row) => (
                <button
                  type="button"
                  className="table-action-link"
                  onClick={() => updateUserStatus(row)}
                >
                  {row.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                </button>
              ),
            },
          ]}
          emptyTitle="Pengguna tidak ditemukan"
        />
      </>
    );
  }

  if (activeSection === "categories") {
    return (
      <>
        <PageHeading
          eyebrow="Taksonomi listing"
          title="Kategori Properti"
          description="Atur kategori pada data demonstrasi RumaMap."
          actions={
            <button
              className="dashboard-button dashboard-button-primary"
              type="button"
              onClick={() => setCategoryOpen(true)}
            >
              <Icon name="plus" size={16} /> Tambah kategori
            </button>
          }
        />
        {notice && <div className="dashboard-inline-success" role="status">{notice}</div>}
        <DemoNotice />
        <DataTable
          rows={categories}
          searchPlaceholder="Cari nama kategori..."
          columns={[
            { key: "id", label: "ID Kategori" },
            { key: "name", label: "Nama kategori", render: (row) => <strong className="table-primary-text">{row.name}</strong> },
            { key: "slug", label: "Slug" },
            { key: "properties", label: "Jumlah listing" },
            { key: "status", label: "Status", render: (row) => <StatusBadge>{row.status}</StatusBadge> },
            {
              key: "action",
              label: "Aksi",
              sortable: false,
              render: (row) => (
                <button
                  type="button"
                  className="table-icon-action"
                  aria-label={`Ubah status kategori ${row.name}`}
                  onClick={() =>
                    setCategoryStatuses((current) => ({
                      ...current,
                      [row.name]:
                        row.status === "Aktif" ? "Tidak aktif" : "Aktif",
                    }))
                  }
                >
                  <Icon name="pencil" size={15} />
                </button>
              ),
            },
          ]}
          emptyTitle="Kategori belum tersedia"
        />
        {categoryOpen && (
          <div className="dashboard-modal-backdrop" role="presentation" onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCategoryOpen(false);
          }}>
            <section className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="category-title">
              <button className="dashboard-modal-close" type="button" aria-label="Tutup" onClick={() => setCategoryOpen(false)}>
                <Icon name="x" size={19} />
              </button>
              <span className="modal-icon modal-icon-success"><Icon name="list" size={21} /></span>
              <h2 id="category-title">Tambah kategori</h2>
              <p className="modal-description">Kategori baru hanya disimpan pada sesi demonstrasi.</p>
              <form onSubmit={saveCategory}>
                <label className="dashboard-field modal-field">
                  Nama kategori <span>*</span>
                  <input
                    autoFocus
                    required
                    maxLength={50}
                    value={categoryName}
                    onChange={(event) => {
                      setCategoryName(event.target.value);
                      setCategoryError("");
                    }}
                    placeholder="Contoh: Townhouse"
                  />
                </label>
                {categoryError && <p className="field-error" role="alert">{categoryError}</p>}
                <div className="dashboard-modal-actions">
                  <button className="dashboard-button dashboard-button-secondary" type="button" onClick={() => setCategoryOpen(false)}>Batal</button>
                  <button className="dashboard-button dashboard-button-primary" type="submit">Simpan demo</button>
                </div>
              </form>
            </section>
          </div>
        )}
      </>
    );
  }

  if (activeSection === "verification" || activeSection === "moderation") {
    const pending = activeSection === "verification"
      ? listings.filter((listing) => listing.verificationStatus === "PENDING")
      : listings;
    const columns = [
      ...listingColumns.map((column) =>
        column.key === "verificationLabel" || column.key === "availabilityLabel"
          ? {
              ...column,
              render: (row) => <StatusBadge>{row[column.key]}</StatusBadge>,
            }
          : column.key === "name"
            ? {
                ...column,
                render: (row) => (
                  <span className="listing-table-name">
                    <span className="listing-mini-icon"><Icon name="building-2" size={15} /></span>
                    <span><strong>{row.name}</strong><small>{row.listingId}</small></span>
                  </span>
                ),
              }
            : column,
      ),
      {
        key: "action",
        label: "Aksi",
        sortable: false,
        render: (row) => (
          <button className="table-action-link" type="button" onClick={() => setSelectedListing(row)}>
            <Icon name="eye" size={14} /> Tinjau detail
          </button>
        ),
      },
    ];
    return (
      <>
        <PageHeading
          eyebrow={activeSection === "verification" ? "Antrian moderasi" : "Kualitas platform"}
          title={activeSection === "verification" ? "Verifikasi Listing" : "Moderasi Properti"}
          description={
            activeSection === "verification"
              ? "Periksa pengajuan listing sebelum ditampilkan."
              : "Pantau status dan tinjau seluruh listing demonstrasi."
          }
        />
        {notice && <div className="dashboard-inline-success" role="status">{notice}</div>}
        <div className="review-queue-banner">
          <span className="review-queue-icon"><Icon name="clock" size={18} /></span>
          <div>
            <strong>{listings.filter((item) => item.verificationStatus === "PENDING").length} listing menunggu pemeriksaan</strong>
            <p>Data pada antrean ini merupakan contoh, bukan permintaan aktual.</p>
          </div>
          <span className="review-queue-tag">Antrian demo</span>
        </div>
        <DataTable
          rows={pending}
          searchPlaceholder="Cari nama listing, pemilik, atau lokasi..."
          filterOptions={activeSection === "moderation" ? [
            { value: "PENDING", label: "Menunggu verifikasi", key: "verificationStatus" },
            { value: "APPROVED", label: "Disetujui", key: "verificationStatus" },
            { value: "REJECTED", label: "Ditolak", key: "verificationStatus" },
          ] : []}
          columns={columns}
          emptyTitle={activeSection === "verification" ? "Antrean verifikasi kosong" : "Listing belum tersedia"}
          emptyDescription="Coba ubah pencarian atau filter yang dipilih."
        />
        <ListingReviewModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onApprove={(listing) => updateListingStatus(listing, "APPROVED")}
          onReject={(listing) => {
            setSelectedListing(null);
            setRejectingListing(listing);
          }}
        />
        <ConfirmModal
          open={Boolean(rejectingListing)}
          title="Tolak pengajuan listing?"
          description={rejectingListing ? `${rejectingListing.name} · ${rejectingListing.owner}` : ""}
          confirmLabel="Konfirmasi penolakan demo"
          cancelLabel="Kembali"
          onCancel={() => {
            setRejectingListing(null);
            setRejectionReason("");
          }}
          onConfirm={() => {
            if (rejectionReason.trim()) {
              updateListingStatus(rejectingListing, "REJECTED", rejectionReason.trim());
            }
          }}
          confirmDisabled={rejectionReason.trim().length < 8}
        >
          <label className="dashboard-field modal-field">
            Alasan penolakan <span>*</span>
            <textarea
              required
              rows="3"
              minLength={8}
              placeholder="Jelaskan alasan penolakan listing."
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
            />
          </label>
        </ConfirmModal>
        <DemoNotice>Keputusan setujui dan tolak hanya memperbarui status lokal pada sesi ini.</DemoNotice>
      </>
    );
  }

  if (activeSection === "recap") {
    return (
      <>
        <PageHeading
          eyebrow="Direktori properti"
          title="Rekap Properti"
          description="Tinjau listing demonstrasi berdasarkan status dan kategori."
        />
        <DemoNotice />
        <DataTable
          rows={listings}
          searchPlaceholder="Cari listing atau pemilik..."
          filterOptions={[
            { value: "PENDING", label: "Menunggu verifikasi", key: "verificationStatus" },
            { value: "APPROVED", label: "Disetujui", key: "verificationStatus" },
            { value: "REJECTED", label: "Ditolak", key: "verificationStatus" },
          ]}
          columns={listingColumns.map((column) =>
            column.key === "verificationLabel" || column.key === "availabilityLabel"
              ? { ...column, render: (row) => <StatusBadge>{row[column.key]}</StatusBadge> }
              : column,
          )}
          emptyTitle="Listing tidak ditemukan"
        />
      </>
    );
  }

  if (activeSection === "reports") {
    const reportMetrics = [
      {
        label: "Total listing",
        value: listings.length,
        icon: "building-2",
        category: "listing",
      },
      {
        label: "Listing disetujui",
        value: listings.filter((item) => item.verificationStatus === "APPROVED").length,
        icon: "circle-check",
        category: "listing",
      },
      {
        label: "Menunggu verifikasi",
        value: listings.filter((item) => item.verificationStatus === "PENDING").length,
        icon: "clock",
        category: "listing",
      },
      {
        label: "Pengguna demo",
        value: demoUsers.length,
        icon: "users",
        category: "pengguna",
      },
      {
        label: "Pengajuan pembeli",
        value: data.applications.length,
        icon: "file-text",
        category: "pengajuan",
      },
      {
        label: "Pengajuan menunggu",
        value: data.applications.filter((item) => item.status === "PENDING").length,
        icon: "clock",
        category: "pengajuan",
      },
    ];
    const reportCategories = {
      semua: reportMetrics,
      listing: reportMetrics.filter((metric) => metric.category === "listing"),
      pengguna: reportMetrics.filter((metric) => metric.category === "pengguna"),
      pengajuan: reportMetrics.filter((metric) => metric.category === "pengajuan"),
    };
    const reportCategoryLabels = {
      semua: "Semua kategori",
      listing: "Listing properti",
      pengguna: "Pengguna",
      pengajuan: "Pengajuan",
    };

    return (
      <>
        <PageHeading
          eyebrow="Analitik platform"
          title="Laporan"
          description="Pantau ringkasan operasional dari metrik demonstrasi."
        />
        {notice && <div className="dashboard-inline-success" role="status">{notice}</div>}
        <div className="report-filters">
          <label className="dashboard-field">
            Kategori
            <select value={reportFilter} onChange={(event) => setReportFilter(event.target.value)}>
              <option value="semua">Semua kategori</option>
              <option value="listing">Listing properti</option>
              <option value="pengguna">Pengguna</option>
              <option value="pengajuan">Pengajuan</option>
            </select>
          </label>
          <button
            className="dashboard-button dashboard-button-secondary"
            type="button"
            onClick={() => {
              setAppliedReportFilter(reportFilter);
              setNotice(
                `Filter ${reportCategoryLabels[reportFilter]} diterapkan pada ringkasan demo.`,
              );
            }}
          >
            <Icon name="sliders-horizontal" size={16} /> Terapkan filter
          </button>
        </div>
        <div className="report-metrics-grid">
          {reportCategories[appliedReportFilter].map((metric) => (
            <article className="report-metric-card" key={metric.label}>
              <span className="stat-card-icon"><Icon name={metric.icon} size={18} /></span>
              <small>{metric.label}</small>
              <strong>{metric.value}</strong>
              <span className="summary-change">Data demonstrasi</span>
            </article>
          ))}
        </div>
        <ChartCard
          title={`Ringkasan ${appliedReportFilter === "semua" ? "platform" : reportCategoryLabels[appliedReportFilter].toLowerCase()}`}
          subtitle={`Snapshot ${reportCategoryLabels[appliedReportFilter].toLowerCase()}`}
          tone="blue"
          labels={reportCategories[appliedReportFilter].map((metric) => metric.label)}
          values={reportCategories[appliedReportFilter].map((metric) => metric.value)}
        />
        <DemoNotice>
          Grafik dan indikator hanya menggambarkan data demonstrasi, bukan data operasional aktual.
        </DemoNotice>
      </>
    );
  }

  if (activeSection === "activity") {
    return (
      <>
        <PageHeading
          eyebrow="Audit aktivitas demo"
          title="Activity Logs"
          description="Lihat jejak aktivitas yang dibuat pada data demonstrasi."
        />
        <DemoNotice />
        <Panel title="Aktivitas terbaru" subtitle="Simulasi aktivitas administrator dan pengguna">
          <ActivityList activities={activities} />
        </Panel>
      </>
    );
  }

  if (activeSection === "profile" || activeSection === "notifications") {
    return (
      <>
        <PageHeading
          eyebrow={activeSection === "profile" ? "Akun administrator" : "Informasi terbaru"}
          title={activeSection === "profile" ? "Profil" : "Notifikasi"}
          description="Data akun administrator demonstrasi."
        />
        <Panel title={activeSection === "profile" ? "Dimas Pratama" : "Pemberitahuan sistem"}>
          {activeSection === "profile" ? (
            <div className="profile-summary">
              <InitialAvatar initials="DP" tone="blue" />
              <div>
                <strong>Administrator · Akun demonstrasi</strong>
                <p>dimas.pratama@demo.test</p>
                <p>Akses dan autentikasi belum diimplementasikan.</p>
              </div>
            </div>
          ) : (
            <div className="buyer-notifications">
              {demoNotifications.map((notification) => (
                <article className="buyer-notification-row" key={notification.id}>
                  <span className="activity-icon activity-icon-green">
                    <Icon name="bell" size={16} />
                  </span>
                  <div>
                    <strong>{notification.title}</strong>
                    <p>{notification.description}</p>
                  </div>
                  <time>{notification.time}</time>
                </article>
              ))}
            </div>
          )}
        </Panel>
      </>
    );
  }

  return (
    <>
      <AdminOverview
        listings={listings}
        applicationsCount={data.applications.length}
        activities={activities}
        onReview={(listing) => {
          setSelectedListing(listing);
          window.dispatchEvent(
            new CustomEvent("dashboard:navigate", { detail: "verification" }),
          );
        }}
      />
      {notice && <div className="dashboard-inline-success" role="status">{notice}</div>}
      <DemoNotice />
    </>
  );
}
