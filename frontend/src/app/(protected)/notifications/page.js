'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { notificationService } from '@/lib/services/notification.service';
import NotificationCard from '@/components/notifications/NotificationCard';
import styles from '@/styles/Notifications.module.css';

export default function NotificationsPage() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);

  useEffect(() => {
    notificationService.getMyNotifications(token)
      .then((res) => setNotifications(res.notifications))
      .catch((err) => setError(err.message ?? 'Error desconocido'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p>Cargando notificaciones...</p>;
  if (error)   return <p>Error cargando notificaciones</p>;

  return (
    <div className={styles.page}>
      <h1>Mis notificaciones</h1>

      {notifications.length === 0 && (
        <p>No tienes notificaciones.</p>
      )}

      <ul className={styles.list}>
        {notifications.map((n) => (
          <NotificationCard key={n._id} notification={n} />
        ))}
      </ul>
    </div>
  );
}
