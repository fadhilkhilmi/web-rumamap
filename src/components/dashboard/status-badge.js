const statusClassNames = {
  Tersedia: "success",
  Aktif: "success",
  Terverifikasi: "success",
  Disetujui: "success",
  Dikonfirmasi: "info",
  Menunggu: "warning",
  "Menunggu verifikasi": "warning",
  Dipesan: "info",
  "Dalam tindak lanjut": "info",
  "Perlu ditindaklanjuti": "warning",
  Terjual: "neutral",
  Selesai: "neutral",
  Ditolak: "danger",
  "Tidak aktif": "neutral",
  Baru: "accent",
  Rumah: "neutral",
  Apartemen: "info",
  Villa: "accent",
  Tanah: "success",
  Agen: "info",
  Pembeli: "neutral",
};

export default function StatusBadge({ children }) {
  const status = String(children ?? "—");
  const tone = statusClassNames[status] || "neutral";

  return <span className={`status-badge status-${tone}`}>{status}</span>;
}
