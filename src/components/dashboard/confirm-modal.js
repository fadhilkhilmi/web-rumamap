"use client";

import { useEffect, useRef } from "react";
import Icon from "../icon";

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  tone = "danger",
  confirmDisabled = false,
  onConfirm,
  onCancel,
  children,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousFocus = document.activeElement;
    dialogRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onCancel?.();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus?.();
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="dashboard-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel?.();
      }}
    >
      <section
        className="dashboard-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-modal-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <button
          className="dashboard-modal-close"
          type="button"
          aria-label="Tutup dialog"
          onClick={onCancel}
        >
          <Icon name="x" size={19} />
        </button>
        <span className={`modal-icon modal-icon-${tone}`}>
          <Icon
            name={tone === "success" ? "circle-check" : "info"}
            size={22}
          />
        </span>
        <h2 id="dashboard-modal-title">{title}</h2>
        {description && <p className="modal-description">{description}</p>}
        {children}
        <div className="dashboard-modal-actions">
          <button
            className="dashboard-button dashboard-button-secondary"
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`dashboard-button ${tone === "success" ? "dashboard-button-primary" : "dashboard-button-danger"}`}
            type="button"
            disabled={confirmDisabled}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
