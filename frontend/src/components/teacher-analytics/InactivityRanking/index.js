'use client';

export default function InactivityRanking({ students }) {
  const ranked = (students ?? [])
    .filter((s) => s.daysSinceLastActivity !== null)
    .sort((a, b) => b.daysSinceLastActivity - a.daysSinceLastActivity);

  if (ranked.length === 0) {
    return <p>No hay alumnos disponibles.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Posición</th>
          <th>Alumno</th>
          <th>Días sin actividad</th>
        </tr>
      </thead>
      <tbody>
        {ranked.map((student, index) => (
          <tr key={student._id ?? student.studentId}>
            <td>{index + 1}</td>
            <td>{student.firstName} {student.lastName}</td>
            <td>{student.daysSinceLastActivity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
