'use client';

export default function StudentWeeklyTrendPanel({ weeklyTrend }) {
  if (!weeklyTrend || weeklyTrend.length === 0) {
    return <p>No hay actividad registrada.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Semana</th>
          <th>Lecciones completadas</th>
          <th>Progreso acumulado</th>
        </tr>
      </thead>
      <tbody>
        {weeklyTrend.map((row) => (
          <tr key={row.weekLabel}>
            <td>{row.weekLabel}</td>
            <td>{row.lessonsCompleted}</td>
            <td>{row.cumulativeProgress}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
