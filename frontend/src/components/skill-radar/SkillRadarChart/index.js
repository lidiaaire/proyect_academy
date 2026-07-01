'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const toValue = (v) => (v !== null && v !== undefined ? v : 0);

export default function SkillRadarChart({ skillProgress }) {
  const { listening, reading, assessmentScore, writing, speaking } = skillProgress;

  const chartData = [
    { skill: 'Listening',  value: toValue(listening) },
    { skill: 'Reading',    value: toValue(reading) },
    { skill: 'Assessment', value: toValue(assessmentScore) },
    { skill: 'Writing',    value: toValue(writing) },
    { skill: 'Speaking',   value: toValue(speaking) },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="skill" />
        <PolarRadiusAxis domain={[0, 100]} tickCount={6} />
        <Radar dataKey="value" isAnimationActive={false} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
