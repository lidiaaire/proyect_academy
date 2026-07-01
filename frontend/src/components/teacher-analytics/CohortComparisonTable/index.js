'use client';

export default function CohortComparisonTable({ students, cohortProgressAvg, onSelectStudent }) {
  if (!students || students.length === 0) {
    return <p>No hay alumnos en el cohort.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Alumno</th>
          <th>Progreso</th>
          <th>Diferencia vs Cohorte</th>
          <th>Días sin actividad</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => {
          const diff      = Math.round(student.overallProgressAvg - cohortProgressAvg);
          const diffLabel = diff > 0 ? `+${diff}%` : diff < 0 ? `${diff}%` : '0%';

          return (
            <tr key={student._id}>
              <td>{student.firstName} {student.lastName}</td>
              <td>{student.overallProgressAvg}%</td>
              <td>{diffLabel}</td>
              <td>{student.daysSinceLastActivity ?? '—'}</td>
              <td>
                <button onClick={() => onSelectStudent(student._id)}>
                  Ver tendencia
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
