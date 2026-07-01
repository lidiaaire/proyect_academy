'use client';

const fmt = (value) => (value !== null && value !== undefined ? `${value}%` : 'Sin datos');

export default function SkillRadarLegend({ skillProgress }) {
  const { listening, reading, assessmentScore, writing, speaking, _source } = skillProgress;

  return (
    <section>
      <p>Listening: {fmt(listening)}</p>
      <p>Reading: {fmt(reading)}</p>
      <p>Assessment: {fmt(assessmentScore)}</p>
      <p>Writing: {fmt(writing)}</p>
      <p>Speaking: {fmt(speaking)}</p>
      {_source === 'preliminary' && (
        <p>Estimación preliminar basada en la actividad actual.</p>
      )}
    </section>
  );
}
