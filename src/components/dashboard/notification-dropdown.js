"use client";

import { useState } from "react";
import Icon from "../icon";
import { demoNotifications } from "../../data/dashboard";

export default function NotificationDropdown({ open, onToggle }) {
  const [read, setRead] = useState(false);
  const unreadCount = read ? 0 : demoNotifications.length;

  return (
    <div className="dashboard-dropdown-wrap">
      <button
        className="dashboard-icon-button notification-trigger"
        type="button"
        aria-label={`Notifikasi${unreadCount ? `, ${unreadCount} belum dibaca` : ""}`}
        aria-expanded={open}
        onClick={onToggle}
      >
        <Icon name="bell" size={19} />
        {unreadCount > 0 && <span className="notification-dot" />}
      </button>
      {open && (
        <div className="dashboard-popover notification-popover">
          <div className="popover-heading">
            <div>
              <strong>Notifikasi</strong>
              <small>{unreadCount} pemberitahuan demo</small>
            </div>
            <button
              className="popover-mark-read"
              type="button"
              onClick={() => setRead(true)}
            >
              Tandai dibaca
            </button>
          </div>
          <div className="notification-list">
            {demoNotifications.map((notification, index) => (
              <article
                className={`notification-item${!read && index < 2 ? " is-unread" : ""}`}
                key={notification.id}
              >
                <span className="notification-icon">
                  <Icon name="bell" size={15} />
                </span>
                <div>
                  <strong>{notification.title}</strong>
                  <p>{notification.description}</p>
                  <small>{notification.time}</small>
                </div>
              </article>
            ))}
          </div>
          <div className="popover-demo-note">
            Notifikasi ini hanya data demonstrasi.
          </div>
        </div>
      )}
    </div>
  );
}
