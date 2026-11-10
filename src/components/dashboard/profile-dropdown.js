"use client";

import Icon from "../icon";
import { useDashboard } from "./dashboard-context";

export default function ProfileDropdown({ open, onToggle, onClose }) {
  const { role, onNavigate } = useDashboard();

  return (
    <div className="dashboard-dropdown-wrap">
      <button
        className="dashboard-profile-trigger"
        type="button"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="user-avatar user-avatar-primary">{role.initials}</span>
        <span className="dashboard-profile-copy">
          <strong>{role.name}</strong>
          <small>{role.label}</small>
        </span>
        <Icon name="chevron-down" size={15} />
      </button>
      {open && (
        <div className="dashboard-popover profile-popover">
          <div className="popover-user">
            <span className="user-avatar user-avatar-primary">
              {role.initials}
            </span>
            <div>
              <strong>{role.name}</strong>
              <small>{role.label} · Akun demo</small>
            </div>
          </div>
          <button
            type="button"
            className="popover-link"
            onClick={() => {
              onNavigate("profile");
              onClose();
            }}
          >
            <Icon name="user-round" size={16} />
            Profil saya
          </button>
          <button
            type="button"
            className="popover-link popover-logout"
            onClick={() => {
              onNavigate("logout");
              onClose();
            }}
          >
            <Icon name="log-out" size={16} />
            Keluar dari demo
          </button>
        </div>
      )}
    </div>
  );
}
