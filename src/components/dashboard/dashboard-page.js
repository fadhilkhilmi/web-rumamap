"use client";

import BuyerDashboard from "./buyer-dashboard";
import SellerDashboard from "./seller-dashboard";
import AdminDashboard from "./admin-dashboard";
import { useDashboard } from "./dashboard-context";

export default function DashboardPage({ role: expectedRole }) {
  const { roleKey, activeSection } = useDashboard();

  if (roleKey !== expectedRole) {
    return null;
  }

  if (roleKey === "seller") {
    return <SellerDashboard activeSection={activeSection} />;
  }

  if (roleKey === "admin") {
    return <AdminDashboard activeSection={activeSection} />;
  }

  return <BuyerDashboard activeSection={activeSection} />;
}
