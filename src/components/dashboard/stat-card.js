import Icon from "../icon";

const trends = {
  up: "stat-trend-up",
  down: "stat-trend-down",
  neutral: "stat-trend-neutral",
};

export default function StatCard({
  label,
  value,
  icon,
  change,
  trend = "neutral",
  helper = "Data demonstrasi saat ini",
  accent = "green",
}) {
  return (
    <article className={`dashboard-stat-card accent-${accent}`}>
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-icon">
          <Icon name={icon} size={18} />
        </span>
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-bottom">
        {change && (
          <span className={`stat-trend ${trends[trend]}`}>
            <Icon
              name={trend === "down" ? "arrow-down-right" : "arrow-up-right"}
              size={13}
            />
            {change}
          </span>
        )}
        {helper && <span className="stat-card-helper">{helper}</span>}
      </div>
    </article>
  );
}
