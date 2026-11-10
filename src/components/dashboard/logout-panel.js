"use client";

import { useState } from "react";
import Icon from "../icon";
import { useDashboard } from "./dashboard-context";
import ConfirmModal from "./confirm-modal";
import { DemoNotice, PageHeading } from "./dashboard-primitives";

export default function LogoutPanel() {
  const { onNavigate } = useDashboard();
  const [dialogOpen, setDialogOpen] = useState(true);
  const [message, setMessage] = useState("");

  return (
    <>
      <PageHeading
        eyebrow="Sesi demonstrasi"
        title="Keluar dari dashboard?"
        description="Aksi keluar akun belum tersedia karena autentikasi belum diimplementasikan."
        actions={
          <button
            className="dashboard-button dashboard-button-secondary"
            type="button"
            onClick={() => onNavigate("overview")}
          >
            <Icon name="chevron-left" size={15} /> Kembali ke ringkasan
          </button>
        }
      />
      {message && <div className="dashboard-inline-success" role="status">{message}</div>}
      <DemoNotice>Akun ini hanya sesi demonstrasi; tidak ada autentikasi atau sesi database.</DemoNotice>
      <ConfirmModal
        open={dialogOpen}
        title="Keluar dari dashboard demo?"
        description="Belum ada sesi autentikasi yang dapat diakhiri. Anda dapat kembali ke ringkasan demonstrasi."
        confirmLabel="Tetap di dashboard"
        cancelLabel="Kembali ke ringkasan"
        tone="success"
        onCancel={() => {
          setDialogOpen(false);
          onNavigate("overview");
        }}
        onConfirm={() => {
          setDialogOpen(false);
          setMessage("Aksi logout tidak dijalankan karena autentikasi belum tersedia.");
        }}
      />
    </>
  );
}
