'use client';

import styles from '@/styles/Certificates.module.css';

export default function CertificateCard({ certificate }) {
  const { course, certificateNumber, finalScore, issueDate, pdfUrl } = certificate;

  return (
    <li className={styles.card}>
      <div className={styles.header}>
        <p className={styles.title}>{course.title}</p>
        <span className={styles.level}>{course.level}</span>
      </div>
      <div className={styles.meta}>
        <span>Nº {certificateNumber}</span>
        <span>Nota: {finalScore}%</span>
        <span>Emitido: {new Date(issueDate).toLocaleDateString('es-ES')}</span>
        <span className={pdfUrl ? styles.pdfAvailable : styles.pdfPending}>
          PDF: {pdfUrl ? 'Disponible' : 'Pendiente'}
        </span>
      </div>
    </li>
  );
}
