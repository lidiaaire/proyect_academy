'use client';

import styles from '@/styles/Notifications.module.css';

export default function NotificationCard({ notification }) {
  const { title, message, type, isRead, createdAt } = notification;

  return (
    <li className={styles.card}>
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        <p className={styles.message}>{message}</p>
        <div className={styles.meta}>
          <span className={styles.badge}>{type}</span>
          <span className={styles.badge}>{isRead ? 'Leída' : 'No leída'}</span>
          <span>{new Date(createdAt).toLocaleDateString('es-ES')}</span>
        </div>
      </div>
    </li>
  );
}
