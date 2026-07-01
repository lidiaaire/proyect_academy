'use client';

export default function AssessmentBreakdownTable({ assessments }) {
  if (!assessments || assessments.length === 0) {
    return <p>No hay datos de assessments disponibles.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Unidad</th>
          <th>Curso</th>
          <th>Pass Rate</th>
          <th>Average Score</th>
          <th>Average Attempts</th>
          <th>Students Tried</th>
        </tr>
      </thead>
      <tbody>
        {assessments.map((item) => (
          <tr key={item.assessmentId}>
            <td>{item.unitTitle}</td>
            <td>{item.courseTitle}</td>
            <td>{item.passRate}%</td>
            <td>{item.avgScore}</td>
            <td>{item.avgAttempts}</td>
            <td>{item.totalStudentsTried}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
