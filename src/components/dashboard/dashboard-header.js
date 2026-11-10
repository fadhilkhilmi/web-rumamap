"use client";

import { useState } from "react";
import Icon from "../icon";
import { useDashboard } from "./dashboard-context";
import NotificationDropdown from "./notification-dropdown";
import ProfileDropdown from "./profile-dropdown";

export default function DashboardHeader() {
  const { role, activeSection, sidebarOpen, onToggleSidebar, onNavigate } =
    useDashboard();
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const activeItem = role.nav.find((item) => item.id === activeSection);
  const currentLabel =
    activeItem?.label ||
    (activeSection === "edit-property" ? "Edit Properti" : "Ringkasan");
  const matchingMenus = role.nav.filter((item) =>
    item.label.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <button
          className="dashboard-icon-button dashboard-menu-toggle"
          type="button"
          aria-label={sidebarOpen ? "Tutup navigasi" : "Buka navigasi"}
          aria-expanded={sidebarOpen}
          onClick={onToggleSidebar}
        >
          <Icon name={sidebarOpen ? "x" : "menu"} size={20} />
        </button>
        <div className="dashboard-breadcrumbs">
          <span>Workspace</span>
          <Icon name="chevron-right" size={14} />
          <strong>{currentLabel}</strong>
        </div>
      </div>
      <div className="dashboard-header-actions">
        <label className="dashboard-global-search">
          <Icon name="search" size={16} />
          <input
            type="search"
            aria-label="Cari menu dashboard"
            placeholder="Cari menu..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setSearch("");
              if (event.key === "Enter" && matchingMenus[0]) {
                onNavigate(matchingMenus[0].id);
                setSearch("");
              }
            }}
          />
          {search && (
            <div className="header-search-results">
              {matchingMenus.length > 0 ? (
                matchingMenus.slice(0, 4).map((item) => (
                  <button
                    className="header-search-result"
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onNavigate(item.id);
                      setSearch("");
                      setOpenDropdown(null);
                    }}
                  >
                    <Icon name={item.icon} size={14} />
                    {item.label}
                  </button>
                ))
              ) : (
                <span>Menu tidak ditemukan</span>
              )}
            </div>
          )}
        </label>
        <div className="dashboard-header-divider" />
        <NotificationDropdown
          open={openDropdown === "notifications"}
          onToggle={() =>
            setOpenDropdown((current) =>
              current === "notifications" ? null : "notifications",
            )
          }
        />
        <ProfileDropdown
          open={openDropdown === "profile"}
          onToggle={() =>
            setOpenDropdown((current) =>
              current === "profile" ? null : "profile",
            )
          }
          onClose={() => setOpenDropdown(null)}
        />
      </div>
    </header>
  );
}
