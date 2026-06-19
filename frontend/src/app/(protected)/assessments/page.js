'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { assessmentsService } from '@/lib/services/assessments.service';
import styles from '@/styles/Assessment.module.css';

const COURSE_ID = '6a342cbb612627be9d0e7700';
const UNIT_ID   = '6a342cbb612627be9d0e7701';

export default function AssessmentsPage() {
  const { token } = useAuth();

  const [assessment, setAssessment]           = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);

  const [answers, setAnswers]                 = useState([]);

  const [attempts, setAttempts]               = useState([]);
  const [attemptsLoading, setAttemptsLoading] = useState(true);

  const [submitting, setSubmitting]           = useState(false);
  const [result, setResult]                   = useState(null);
  const [submitError, setSubmitError]         = useState(null);

  const fetchAttempts = useCallback(() => {
    setAttemptsLoading(true);
    assessmentsService.listAttempts(COURSE_ID, UNIT_ID, token)
      .then((data) => setAttempts(data.attempts ?? []))
      .catch(() => setAttempts([]))
      .finally(() => setAttemptsLoading(false));
  }, [token]);

  useEffect(() => {
    Promise.all([
      assessmentsService.getAssessment(COURSE_ID, UNIT_ID, token),
      assessmentsService.listAttempts(COURSE_ID, UNIT_ID, token),
    ])
      .then(([assessmentData, attemptsData]) => {
        setAssessment(assessmentData.assessment);
        setAnswers(new Array(assessmentData.assessment.questions.length).fill(undefined));
        setAttempts(attemptsData.attempts ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setLoading(false);
        setAttemptsLoading(false);
      });
  }, [token]);

  function handleSelect(questionIndex, optionIndex) {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const data = await assessmentsService.submitAttempt(
        COURSE_ID,
        UNIT_ID,
        { answers },
        token
      );
      setResult(data.attempt);
      fetchAttempts();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const allAnswered  = answers.length > 0 && answers.every((a) => a !== undefined);
  const attemptsUsed = attempts.length;
  const maxReached   = assessment ? attemptsUsed >= assessment.maxAttempts : false;

  if (loading) return <p className={styles.statusText}>Cargando examen…</p>;
  if (error)   return <p className={styles.statusText}>Error: {error}</p>;
  if (!assessment) return null;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{assessment.title}</h1>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            Aprobado con <strong>{assessment.passingScore}%</strong>
          </span>
          <span className={styles.metaItem}>
            Attempts Used: <strong>{attemptsUsed} / {assessment.maxAttempts}</strong>
          </span>
        </div>
      </div>

      {result && (
        <div className={styles.result}>
          <h2 className={`${styles.resultTitle} ${result.passed ? styles.resultPass : styles.resultFail}`}>
            {result.passed ? '✓ Aprobado' : '✗ No aprobado'}
          </h2>
          <div className={styles.resultMeta}>
            <span>Puntuación: <strong>{result.score}%</strong></span>
            <span>Intento nº <strong>{result.attemptNumber}</strong></span>
          </div>
        </div>
      )}

      {!result && (
        <form onSubmit={handleSubmit}>
          {assessment.questions.map((q, qi) => (
            <div key={q._id} className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <span className={styles.questionNumber}>{qi + 1}</span>
                <span className={styles.questionText}>{q.text}</span>
              </div>
              <div className={styles.options}>
                {q.options.map((opt, oi) => (
                  <label key={oi} className={styles.optionLabel}>
                    <input
                      type="radio"
                      name={`q-${qi}`}
                      checked={answers[qi] === oi}
                      onChange={() => handleSelect(qi, oi)}
                      disabled={maxReached}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {submitError && <p className={styles.errorText}>{submitError}</p>}

          {maxReached ? (
            <p className={styles.maxReachedText}>Maximum attempts reached</p>
          ) : (
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!allAnswered || submitting}
            >
              {submitting ? 'Enviando…' : 'Submit Assessment'}
            </button>
          )}
        </form>
      )}

      <section className={styles.historySection}>
        <h2 className={styles.historyTitle}>Previous Attempts</h2>

        {attemptsLoading && <p className={styles.statusText}>Cargando intentos…</p>}

        {!attemptsLoading && attempts.length === 0 && (
          <p className={styles.statusText}>No hay intentos previos.</p>
        )}

        {!attemptsLoading && attempts.length > 0 && (
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Score</th>
                <th>Result</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a._id}>
                  <td>{a.attemptNumber}</td>
                  <td>{a.score}%</td>
                  <td>
                    <span className={a.passed ? styles.badgePass : styles.badgeFail}>
                      {a.passed ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                  <td>{new Date(a.submittedAt).toLocaleString('es-ES')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
