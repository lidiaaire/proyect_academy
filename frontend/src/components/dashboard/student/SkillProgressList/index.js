'use client';

const fmt = (value) => value !== null && value !== undefined ? `${value}%` : 'Próximamente';

export default function SkillProgressList({ skillProgress }) {
  const { listening, reading, assessmentScore, writing, speaking, _source } = skillProgress;

  return (
    <section>
      <h2>Habilidades</h2>
      <p>Listening: {fmt(listening)}</p>
      <p>Reading: {fmt(reading)}</p>
      <p>Assessment Score: {fmt(assessmentScore)}</p>
      <p>Writing: {fmt(writing)}</p>
      <p>Speaking: {fmt(speaking)}</p>
      {_source === 'preliminary' && (
        <p>Estimación preliminar basada en la actividad actual.</p>
      )}
    </section>
  );
}
