import DashboardLayout from "../../components/dashboard/dashboard-layout";
import "./dashboard.css";

export const metadata = {
  title: "Dashboard RumaMap",
  description:
    "Dashboard RumaMap untuk pembeli, penjual, agen, dan administrator — mode demonstrasi.",
};

export default function Layout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
