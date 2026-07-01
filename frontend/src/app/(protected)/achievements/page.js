'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { achievementService } from '@/lib/services/achievement.service';
import AchievementCard from '@/components/achievements/AchievementCard';
import styles from '@/styles/Achievements.module.css';

export default function AchievementsPage() {
  const { token } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    achievementService.getMyAchievements(token)
      .then((res) => setAchievements(res.achievements))
      .catch((err) => setError(err.message ?? 'Error desconocido'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p>Cargando logros...</p>;
  if (error)   return <p>Error cargando logros</p>;

  return (
    <div className={styles.page}>
      <h1>Mis logros</h1>

      {achievements.length === 0 && (
        <p>Todavía no has desbloqueado ningún logro. ¡Sigue aprendiendo!</p>
      )}

      <ul className={styles.list}>
        {achievements.map((a) => (
          <AchievementCard key={a.slug} achievement={a} />
        ))}
      </ul>
    </div>
  );
}
