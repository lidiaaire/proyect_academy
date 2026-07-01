'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { certificateService } from '@/lib/services/certificate.service';
import CertificateCard from '@/components/certificates/CertificateCard';
import styles from '@/styles/Certificates.module.css';

export default function CertificatesPage() {
  const { token } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    certificateService.getMyCertificates(token)
      .then((res) => setCertificates(res.certificates))
      .catch((err) => setError(err.message ?? 'Error desconocido'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p>Cargando certificados...</p>;
  if (error)   return <p>Error cargando certificados</p>;

  return (
    <div className={styles.page}>
      <h1>Mis certificados</h1>

      {certificates.length === 0 && (
        <p>Todavía no tienes certificados. ¡Completa un curso para obtener el tuyo!</p>
      )}

      <ul className={styles.list}>
        {certificates.map((c) => (
          <CertificateCard key={c.certificateNumber} certificate={c} />
        ))}
      </ul>
    </div>
  );
}
