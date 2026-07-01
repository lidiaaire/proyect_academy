'use client';

import styles from '@/styles/Achievements.module.css';

export default function AchievementCard({ achievement }) {
  const { icon, name, description, category, rarity, points, unlockedAt } = achievement;

  return (
    <li className={styles.card}>
      <span className={styles.icon}>{icon}</span>
      <div className={styles.body}>
        <p className={styles.name}>{name}</p>
        <p className={styles.description}>{description}</p>
        <div className={styles.meta}>
          <span className={styles.badge}>{category}</span>
          <span className={styles.badge}>{rarity}</span>
          <span className={styles.badge}>{points} pts</span>
          <span>Desbloqueado: {new Date(unlockedAt).toLocaleDateString('es-ES')}</span>
        </div>
      </div>
    </li>
  );
}
