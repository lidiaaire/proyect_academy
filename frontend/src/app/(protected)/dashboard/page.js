'use client';

import { useAuth } from '@/hooks/useAuth';
import styles from '@/styles/Dashboard.module.css';

export default function DashboardPage() {
  const { user } = useAuth();

  const firstName = user?.firstName ?? '';

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.greeting}>Welcome back, {firstName}.</h1>
        <span className={styles.subtitle}>{user?.email}</span>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Overview</h2>

        <div className={styles.grid}>
          <div className={`${styles.card} ${styles.cardAccent}`}>
            <span className={styles.cardLabel}>Role</span>
            <span className={styles.cardValue}>{user?.role ?? '—'}</span>
          </div>

          <div className={styles.card}>
            <span className={styles.cardLabel}>Session</span>
            <span className={`${styles.cardValue} ${styles.statusDot}`}>Active</span>
          </div>

          <div className={styles.card}>
            <span className={styles.cardLabel}>Courses</span>
            <span className={styles.cardValue}>0</span>
            <span className={styles.cardSub}>enrolled courses</span>
          </div>

          <div className={styles.card}>
            <span className={styles.cardLabel}>Progress</span>
            <span className={styles.cardValue}>0%</span>
            <span className={styles.cardSub}>overall completion</span>
          </div>
        </div>
      </section>
    </div>
  );
}
