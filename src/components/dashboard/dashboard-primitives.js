import Icon from "../icon";
import StatCard from "./stat-card";

export function PageHeading({ eyebrow, title, description, actions }) {
  return (
    <div className="dashboard-page-heading">
      <div>
        {eyebrow && <p className="dashboard-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="dashboard-page-description">{description}</p>}
      </div>
      {actions && <div className="page-heading-actions">{actions}</div>}
    </div>
  );
}

export function DemoNotice({ children = "Semua angka dan informasi di bawah merupakan data demonstrasi." }) {
  return (
    <p className="dashboard-demo-notice">
      <Icon name="info" size={14} />
      {children}
    </p>
  );
}

export function StatGrid({ stats }) {
  return (
    <div className="dashboard-stat-grid">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

export function ChartCard({
  title = "Aktivitas properti",
  subtitle = "Ringkasan data saat ini",
  tone = "green",
  values = [],
  labels = [],
  total,
}) {
  const maxValue = Math.max(...values, 1);
  const points = values.map((value, index) => {
    const x = values.length < 2 ? 204 : 48 + (index * 304) / (values.length - 1);
    const y = 128 - (value / maxValue) * 80;
    return `${x},${y}`;
  });
  const line = points.join(" ");
  const area = points.length ? `38,139 ${line} 370,139` : "";
  const totalValue = total ?? values.reduce((sum, value) => sum + value, 0);
  const axisValues = [maxValue, Math.round(maxValue * 0.66), Math.round(maxValue * 0.33), 0];

  return (
    <section className="dashboard-panel chart-card">
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="chart-legend-row">
        <span className="chart-legend">
          <span className={`chart-legend-dot chart-dot-${tone}`} />
          Data
        </span>
        <span className="chart-total">
          {totalValue}
          <small>total saat ini</small>
        </span>
      </div>
      <div
        className="chart-visual"
        role="img"
        aria-label={`Grafik ${title.toLowerCase()} berdasarkan data demonstrasi saat ini`}
      >
        <svg viewBox="0 0 408 178" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`chart-fill-${tone}`} x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="0%"
                stopColor={tone === "blue" ? "#6e9db6" : tone === "amber" ? "#d6ac68" : "#6b9b80"}
                stopOpacity=".23"
              />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[35, 67, 99, 131].map((y) => (
            <line
              className="chart-grid-line"
              key={y}
              x1="38"
              x2="370"
              y1={y}
              y2={y}
            />
          ))}
          {points.length > 1 && (
            <polygon points={area} fill={`url(#chart-fill-${tone})`} />
          )}
          {points.length > 1 && (
            <polyline
              points={line}
              fill="none"
              stroke={tone === "blue" ? "#638ca8" : tone === "amber" ? "#c99951" : "#4d8968"}
              strokeWidth="2.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {points.map((point) => {
            const [cx, cy] = point.split(",");
            return (
              <circle
                className={`chart-point chart-point-${tone}`}
                key={point}
                cx={cx}
                cy={cy}
                r="3.3"
              />
            );
          })}
          {labels.map((label, index) => (
            <text
              className="chart-month-label"
              key={label}
              x={values.length < 2 ? 204 : 48 + (index * 304) / (values.length - 1)}
              y="164"
              textAnchor="middle"
            >
              {label}
            </text>
          ))}
          {[35, 67, 99, 131].map((y, index) => (
            <text className="chart-axis-label" key={y} x="2" y={y + 3}>
              {axisValues[index]}
            </text>
          ))}
        </svg>
      </div>
      <p className="chart-demo-caption">
        Nilai dihitung dari sumber data demonstrasi saat ini.
      </p>
    </section>
  );
}

export function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`dashboard-panel ${className}`}>
      {(title || action) && (
        <div className="panel-heading">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function InitialAvatar({ initials, tone = "green" }) {
  return <span className={`user-avatar avatar-${tone}`}>{initials}</span>;
}

export function EmptyState({ title, description, icon = "file-text" }) {
  return (
    <div className="dashboard-empty-state">
      <span className="dashboard-empty-icon">
        <Icon name={icon} size={22} />
      </span>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}
