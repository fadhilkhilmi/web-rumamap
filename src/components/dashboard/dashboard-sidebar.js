"use client";

import Link from "next/link";
import Icon from "../icon";
import { useDashboard } from "./dashboard-context";

export default function DashboardSidebar() {
  const { role, activeSection, onNavigate, sidebarOpen, onCloseSidebar } =
    useDashboard();

  return (
    <>
      {sidebarOpen && (
        <button
          className="dashboard-mobile-backdrop"
          type="button"
          aria-label="Tutup menu navigasi"
          onClick={onCloseSidebar}
        />
      )}
      <aside
        className={`dashboard-sidebar${sidebarOpen ? " is-open" : ""}`}
        aria-label={`Navigasi ${role.label}`}
      >
        <Link className="dashboard-brand" href="/" onClick={onCloseSidebar}>
          <span className="dashboard-brand-mark">
            <Icon name="map-pin" size={20} />
          </span>
          <span className="dashboard-brand-copy">
            <strong>
              Ruma<span>Map</span>
            </strong>
            <small>PROPERTY PLATFORM</small>
          </span>
        </Link>

        <div className="dashboard-workspace-label">
          WORKSPACE
          <span className="dashboard-role-pill">{role.label}</span>
        </div>

        <nav className="dashboard-nav" aria-label="Menu dashboard">
          {role.nav.map((item) => (
            <button
              className={`dashboard-nav-link${activeSection === item.id ? " is-active" : ""}${item.separator ? " has-separator" : ""}`}
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={activeSection === item.id ? "page" : undefined}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
              {item.count && (
                <span className="dashboard-nav-count">{item.count}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help-card">
            <span className="sidebar-help-icon">
              <Icon name="info" size={16} />
            </span>
            <strong>Mode demonstrasi</strong>
            <p>Data dan aksi hanya berlaku selama sesi ini.</p>
          </div>
          <div className="sidebar-copyright">© 2025 RumaMap</div>
        </div>
      </aside>
    </>
  );
}
