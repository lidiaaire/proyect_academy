'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { dashboardService } from '@/lib/services/dashboard.service';
import SkillRadarChart from '@/components/skill-radar/SkillRadarChart';
import SkillRadarLegend from '@/components/skill-radar/SkillRadarLegend';
import styles from '@/styles/SkillRadar.module.css';

export default function SkillRadarPage() {
  const { token } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    dashboardService.getStudentDashboard(token)
      .then((res) => setData(res))
      .catch((err) => setError(err.message ?? 'Error desconocido'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p>Cargando Skill Radar...</p>;
  if (error)   return <p>Error cargando Skill Radar</p>;

  const { profile, skillProgress } = data;

  return (
    <div className={styles.container}>
      <h1>English Skill Radar</h1>
      <p>{profile.firstName} {profile.lastName}</p>
      <div className={styles.chartWrapper}>
        <SkillRadarChart skillProgress={skillProgress} />
      </div>
      <SkillRadarLegend skillProgress={skillProgress} />

      <section className={styles.infoSection}>
        <h2 className={styles.infoTitle}>¿Cómo se calcula este radar?</h2>
        <ul className={styles.infoList}>
          <li>Listening se estima a partir de las lecciones de escucha completadas.</li>
          <li>Reading se estima a partir de las lecciones de lectura completadas.</li>
          <li>Assessment representa la media de las mejores puntuaciones obtenidas en los assessments.</li>
          <li>Writing y Speaking todavía no disponen de datos suficientes y aparecerán cuando existan actividades específicas.</li>
        </ul>
        <p className={styles.infoNote}>
          Esta es una estimación preliminar basada en tu actividad dentro de la plataforma. No representa una certificación oficial de tu nivel de inglés.
        </p>
      </section>
    </div>
  );
}
