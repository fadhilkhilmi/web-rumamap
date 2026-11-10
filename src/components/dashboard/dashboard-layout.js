"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Icon from "../icon";
import { dashboardRoles } from "../../data/dashboard";
import { useDemoData } from "../../data/demo-store";
import DashboardHeader from "./dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";
import { DashboardContext } from "./dashboard-context";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const roleKey = useMemo(() => {
    const segment = pathname.split("/")[2];
    return dashboardRoles[segment] ? segment : "buyer";
  }, [pathname]);
  const role = dashboardRoles[roleKey];
  const data = useDemoData();
  const roleWithCounts = useMemo(
    () => ({
      ...role,
      nav: role.nav.map((item) => {
        let count;
        if (roleKey === "admin" && item.id === "verification") {
          count = data.properties.filter(
            (property) => property.verificationStatus === "PENDING",
          ).length;
        }
        if (roleKey === "seller" && item.id === "inquiries") {
          count = data.applications.filter(
            (application) =>
              application.sellerId === role.userId &&
              application.status === "PENDING",
          ).length;
        }
        if (roleKey === "buyer" && item.id === "visits") {
          count = data.applications.filter(
            (application) =>
              application.buyerId === role.userId &&
              application.status === "PENDING",
          ).length;
        }

        return { ...item, count };
      }),
    }),
    [data.applications, data.properties, role, roleKey],
  );
  const [activeSections, setActiveSections] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeSection =
    activeSections[roleKey] || roleWithCounts.nav[0]?.id || "overview";

  useEffect(() => {
    function handleDashboardNavigation(event) {
      if (typeof event.detail === "string") {
        setActiveSections((current) => ({
          ...current,
          [roleKey]: event.detail,
        }));
        setSidebarOpen(false);
      }
    }

    window.addEventListener("dashboard:navigate", handleDashboardNavigation);
    return () =>
      window.removeEventListener(
        "dashboard:navigate",
        handleDashboardNavigation,
      );
  }, [roleKey]);

  function onNavigate(section) {
    setActiveSections((current) => ({ ...current, [roleKey]: section }));
    setSidebarOpen(false);
  }

  const context = {
    role: roleWithCounts,
    roleKey,
    activeSection,
    onNavigate,
    sidebarOpen,
    onToggleSidebar: () => setSidebarOpen((open) => !open),
    onCloseSidebar: () => setSidebarOpen(false),
  };

  return (
    <DashboardContext.Provider value={context}>
      <div className="dashboard-app">
        <DashboardSidebar />
        <div className="dashboard-main">
          <DashboardHeader />
          <main className="dashboard-content">{children}</main>
          <footer className="dashboard-footer">
            <span>© 2025 RumaMap</span>
            <span>
              <Icon name="info" size={13} />
              Tampilan dan informasi menggunakan data demonstrasi.
            </span>
          </footer>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
