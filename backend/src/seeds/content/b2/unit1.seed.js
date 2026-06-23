'use strict';

const { LESSON_TYPES }     = require('../../../config/constants');
const { upsert }           = require('../../helpers');
const UnitRepository       = require('../../../repositories/unit.repository');
const LessonRepository     = require('../../../repositories/lesson.repository');
const AssessmentRepository = require('../../../repositories/assessment.repository');

const Unit       = UnitRepository.model;
const Lesson     = LessonRepository.model;
const Assessment = AssessmentRepository.model;

// ─────────────────────────────────────────────────────────────────────────────
// L1.1 — What Could Have Been — The Third Conditional
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L11 = `En B1 aprendiste los condicionales Type 1 y Type 2. Esta lección introduce el Type 3: la herramienta para hablar de situaciones hipotéticas en el pasado — lo que podría haber ocurrido pero no ocurrió.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REPASO RÁPIDO — TYPE 1 Y TYPE 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TYPE 1 — Condición real en el futuro:
If + present simple  →  will + infinitivo
"If you apply early, you will get a better offer."

TYPE 2 — Condición hipotética en el presente:
If + past simple  →  would + infinitivo
"If I were the manager, I would change this process."

Ambos hablan de situaciones posibles o imaginadas ahora o en el futuro.
El TYPE 3 habla del PASADO — de algo que ya no se puede cambiar.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EL TYPE 3 — ESTRUCTURA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If + past perfect  →  would have + participio pasado

"If I had applied earlier, I would have got the job."
→  Si hubiera solicitado antes, habría conseguido el trabajo.
(No lo solicité. No conseguí el trabajo. Dos hechos pasados.)

"If she had read the report, she would have noticed the error."
→  Si hubiera leído el informe, habría notado el error.
(No lo leyó. No notó el error.)

"If they had invested in that project, they would have made a fortune."
→  Si hubieran invertido en ese proyecto, habrían ganado una fortuna.
(No invirtieron. No ganaron la fortuna.)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMA NEGATIVA Y INTERROGATIVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEGATIVA en la condición:
"If the project hadn't been delayed, we would have met the deadline."
→  Si el proyecto no se hubiera retrasado, habríamos cumplido el plazo.

NEGATIVA en el resultado:
"If I had checked my emails, I wouldn't have missed the meeting."
→  Si hubiera revisado mis correos, no me habría perdido la reunión.

INTERROGATIVA:
"Would you have accepted the offer if they had paid you more?"
→  ¿Habrías aceptado la oferta si te hubieran pagado más?


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VARIANTES MODALES — COULD HAVE / MIGHT HAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En el resultado, "would have" expresa certeza. Hay variantes para matizar:

COULD HAVE — posibilidad, no certeza:
"If she had studied law, she could have become a partner by now."
→  podría haber llegado a socia (era posible, no seguro)

MIGHT HAVE — posibilidad más débil:
"If we had marketed it differently, it might have sold better."
→  podría haberse vendido mejor (no estamos seguros)

SHOULD HAVE — lo correcto que no ocurrió:
"If you had told me earlier, I should have warned the team."
→  debería haber avisado al equipo (obligación moral sobre el pasado)

Estas variantes son muy frecuentes en inglés profesional y añaden precisión a tus argumentos.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EL TYPE 3 EN CONTEXTO PROFESIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El Type 3 aparece constantemente en el entorno laboral:

— En reuniones de análisis post-proyecto (post-mortem):
"If we had identified the risk earlier, we could have avoided the delay."

— En entrevistas de trabajo al hablar de experiencias:
"If I hadn't taken that role, I wouldn't have developed those skills."

— En negociaciones al revisar acuerdos anteriores:
"If both parties had communicated more clearly, the contract wouldn't have fallen through."

— En informes de gestión al evaluar decisiones pasadas:
"If the board had approved the budget in Q1, the launch would have happened on schedule."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — MEZCLAR TIEMPOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El error más frecuente: usar past simple en la condición o infinitivo en el resultado.

❌ "If I studied harder, I would have passed."
✅ "If I had studied harder, I would have passed."
(La condición necesita PAST PERFECT, no past simple.)

❌ "If she had applied, she would get the job."
✅ "If she had applied, she would have got the job."
(El resultado necesita WOULD HAVE + participio, no would + infinitivo.)

❌ "If they invested earlier, they would have made more profit."
✅ "If they had invested earlier, they would have made more profit."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con la forma correcta del Type 3:

1. If the client _______ (inform) us earlier, we _______ (prepare) a better proposal.
2. She _______ (get) the promotion if she _______ (ask) for it.
3. If they _______ (not / miss) the deadline, the project _______ (be) a success.
4. _______ you _______ (accept) the offer if the salary _______ (be) higher?

Respuestas:
1. had informed / would have prepared
2. would have got / had asked
3. hadn't missed / would have been
4. Would / have accepted / had been`;

// ─────────────────────────────────────────────────────────────────────────────
// L1.3 — When Past Meets Present — Mixed Conditionals
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L13 = `Los condicionales mixtos combinan elementos de dos tipos distintos. Son la forma más sofisticada del sistema condicional en inglés y aparecen constantemente en conversaciones de nivel avanzado.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿QUÉ ES UN CONDICIONAL MIXTO?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Un condicional mixto mezcla tiempos de dos tipos diferentes porque la condición y el resultado pertenecen a momentos distintos: uno al pasado y otro al presente (o futuro).

Hay dos combinaciones principales:


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MIXTO TIPO A — CONDICIÓN PASADA, RESULTADO PRESENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ESTRUCTURA:
If + past perfect  →  would + infinitivo

Esta combinación describe una condición que no ocurrió en el pasado y cuyo efecto todavía se siente en el presente.

"If I had studied medicine, I would be a doctor now."
→  Si hubiera estudiado medicina (no lo hice), ahora sería médico (pero no lo soy).

"If she hadn't taken that job in London, she wouldn't be earning so much now."
→  Si no hubiera aceptado ese trabajo (sí lo aceptó), ahora no ganaría tanto (pero gana más).

"If he had learned to code ten years ago, he would be much further in his career now."
→  No aprendió a programar. Hoy su carrera no ha avanzado tanto como podría haber avanzado.

FÓRMULA PARA RECORDARLO:
  Condición → Type 3 (pasado que no ocurrió)
  Resultado → Type 2 (hipótesis actual)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MIXTO TIPO B — CONDICIÓN PRESENTE, RESULTADO PASADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ESTRUCTURA:
If + past simple  →  would have + participio pasado

Esta combinación describe cómo una característica o situación actual (real o hipotética) habría afectado un resultado pasado.

"If I were more organised, I would have finished this months ago."
→  No soy muy organizado (condición presente real), por eso no terminé antes (resultado pasado real).

"If she spoke better English, she would have got the promotion."
→  Su nivel de inglés es limitado (condición presente), por eso no obtuvo el ascenso (resultado pasado).

"If he weren't so risk-averse, he would have invested in that startup."
→  Es muy conservador (condición presente), por eso no invirtió cuando tuvo la oportunidad (resultado pasado).

FÓRMULA PARA RECORDARLO:
  Condición → Type 2 (estado o característica actual)
  Resultado → Type 3 (consecuencia en el pasado que no ocurrió)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPARACIÓN DIRECTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TYPE 3 puro (todo en el pasado):
"If I had applied, I would have got the job."
→  No apliqué. No conseguí el trabajo. Ambos en el pasado.

MIXTO TIPO A (pasado → presente):
"If I had applied, I would have the job now."
→  No apliqué. Ahora mismo no tengo el trabajo. El efecto es presente.

MIXTO TIPO B (presente → pasado):
"If I were more confident, I would have applied."
→  No soy muy seguro de mí mismo. Por eso no apliqué. La causa es presente, la consecuencia pasada.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN EL ENTORNO PROFESIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los mixtos son frecuentes en análisis de decisiones, evaluaciones de rendimiento y conversaciones estratégicas:

"If we had diversified earlier, we wouldn't be in this difficult position now."
→  Mixto A: consecuencia presente de una decisión pasada.

"If our infrastructure were more scalable, we would have handled the traffic spike without any issues."
→  Mixto B: una limitación presente que causó un problema pasado.

"If the team had better communication skills, we would have closed that deal last year."
→  Mixto B: estado presente → consecuencia en el pasado.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — CONFUNDIR LOS DOS MIXTOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La clave es identificar CUÁNDO ocurre cada parte (condición y resultado):

¿La condición es pasada y el resultado es presente?  →  Mixto A
¿La condición es presente y el resultado es pasado?  →  Mixto B

Pregúntate: "¿De qué momento hablo en la condición? ¿Y en el resultado?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Clasifica cada frase: ¿Type 3 puro, Mixto A o Mixto B?

1. "If she had taken the course, she would speak better now."
2. "If he were more proactive, he would have raised the issue at the time."
3. "If they had launched in Q1, they would have beaten their competitors."
4. "If I weren't so busy, I would have helped you yesterday."

Respuestas:
1. Mixto A (condición pasada, resultado presente: "speak better now")
2. Mixto B (condición presente, resultado pasado: "would have raised")
3. Type 3 puro (todo en el pasado)
4. Mixto B (condición presente, resultado pasado: "would have helped")`;

// ─────────────────────────────────────────────────────────────────────────────
// L1.4 — Beyond If — Advanced Conditional Linkers
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L14 = `"If" no es el único conector condicional en inglés. En registros profesionales y académicos —y en el inglés B2 en general— existen expresiones más precisas y sofisticadas que debes conocer tanto para comprenderlas como para usarlas.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONECTORES CONDICIONALES FORMALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROVIDED (THAT) / PROVIDING (THAT)
→  siempre que / con tal de que (condición positiva, más formal que "if")

"We will sign the contract provided that all parties agree to the revised terms."
"Providing the weather holds, the event will take place outdoors."

AS LONG AS
→  siempre y cuando (condición que debe mantenerse)

"You can work from home as long as you meet your deadlines."
"The project will succeed as long as the budget is approved on time."

ON CONDITION THAT
→  a condición de que (condición formal, frecuente en contratos y acuerdos)

"The board will approve the merger on condition that the due diligence report is satisfactory."
"I will take the role on condition that I have full operational autonomy."

UNLESS
→  a menos que / salvo que (condición negativa; equivale a "if...not")

"We will proceed unless you advise otherwise."
= "We will proceed if you do not advise otherwise."

"The team won't deliver on time unless we allocate more resources."
≠ "The team won't deliver on time if we allocate more resources." (significado opuesto)

ATENCIÓN: "unless" nunca se usa con "not" — ya contiene la negación:
❌ "Unless you don't call me..."
✅ "Unless you call me..."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONECTORES DE SUPOSICIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUPPOSE / SUPPOSING (THAT)
→  supón que / y si... (para explorar escenarios hipotéticos)

"Supposing the client rejected our proposal, what would we do next?"
"Suppose the system fails on launch day — do we have a contingency plan?"

Más informal que "if" pero útil en reuniones para plantear escenarios.

WHAT IF
→  ¿y si...? (para plantear hipótesis, más coloquial)

"What if we delayed the launch by one quarter? Would that change anything?"
"What if the competitor reduces their price? How do we respond?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INVERSIÓN CONDICIONAL (NIVEL AVANZADO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En inglés formal, especialmente escrito, la cláusula condicional puede expresarse mediante inversión del sujeto y auxiliar, eliminando "if". Esta estructura es característica del inglés B2-C1.

TYPE 2 con inversión:
"If I were in your position..."  →  "Were I in your position..."
"Were I the CEO, I would restructure the department."

TYPE 3 con inversión:
"If they had consulted us..."  →  "Had they consulted us..."
"Had they consulted us, we would have identified the problem sooner."

"If the report had been accurate..."  →  "Had the report been accurate..."
"Had the report been accurate, the board would have reached a different decision."

NEGATIVA con inversión:
"If it had not been for your support..."  →  "Had it not been for your support..."
"Had it not been for your support, the project would have failed."

Esta estructura indica un nivel de inglés avanzado y tiene un efecto muy profesional en escritura formal.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGISTRO — CUÁNDO USAR CADA EXPRESIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MÁS FORMAL (contratos, informes, correspondencia):
  on condition that / provided that / had + sujeto...

NEUTRO-FORMAL (reuniones, presentaciones, correo profesional):
  as long as / unless / providing that

MÁS COLOQUIAL (conversación, reuniones informales):
  what if / suppose / supposing / as long as


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sustituye "if" por un conector más preciso sin cambiar el significado:

1. "If you don't approve this today, we will miss the window."
   → _______ you approve this today, we will miss the window.

2. "If the team meets the targets, bonuses will be paid."
   → Bonuses will be paid _______ the team meets the targets.

3. "If I had known about the meeting, I would have prepared."
   → _______ I known about the meeting, I would have prepared.

4. "If all conditions are met, the deal will proceed."
   → The deal will proceed _______ all conditions are met.

Respuestas:
1. Unless
2. provided that / as long as
3. Had
4. on condition that / provided that`;

// ─────────────────────────────────────────────────────────────────────────────
// L1.5 — Conditionals at Work — Real Business Scenarios
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L15 = `Esta lección integra todos los condicionales aprendidos en situaciones reales del mundo profesional: reuniones, negociaciones, presentaciones y revisiones de proyecto.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EL SISTEMA CONDICIONAL — MAPA COMPLETO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TYPE 0  General / científico
  If + present  →  present
  "If you heat water to 100°C, it boils."

TYPE 1  Probable en el futuro
  If + present simple  →  will + infinitivo
  "If we submit the bid today, we will hear back by Friday."

TYPE 2  Hipotético en el presente
  If + past simple  →  would + infinitivo
  "If I were the project lead, I would prioritise the client deliverables first."

TYPE 3  Hipotético en el pasado
  If + past perfect  →  would have + participio
  "If we had started earlier, we would have avoided these delays."

MIXTO A  Pasado → Presente
  If + past perfect  →  would + infinitivo
  "If she had taken that course, she would be managing the team now."

MIXTO B  Presente → Pasado
  If + past simple  →  would have + participio
  "If he were more detail-oriented, he would have caught the error."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENARIO 1 — POST-MORTEM DE PROYECTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El equipo analiza por qué el lanzamiento de un producto se retrasó. Identifica qué tipo de condicional usa cada participante:

Sarah: "If we had allocated a dedicated QA team from day one, we would have caught these bugs much earlier." [TYPE 3]

Mark: "Had the scope been defined more clearly at the outset, we wouldn't be having this conversation now." [MIXTO A — inversión formal]

Laura: "If our project management software were more intuitive, the team would have updated their tasks more consistently." [MIXTO B]

Director: "Going forward, we will implement daily stand-ups provided that all team leads are available." [TYPE 1 + provided that]


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENARIO 2 — NEGOCIACIÓN COMERCIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Una empresa negocia los términos de un contrato con un proveedor:

"We are prepared to sign on condition that you guarantee delivery within 30 days."

"If you could offer a 10% discount on orders over 500 units, we would commit to a 12-month exclusive partnership."
[TYPE 2 — propuesta hipotética con beneficio mutuo]

"Had you informed us of the price increase before the contract renewal, we might have explored alternatives."
[TYPE 3 — expresión de insatisfacción sobre una decisión pasada]

"As long as quality standards are maintained, we are happy to extend the agreement."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENARIO 3 — ENTREVISTA DE TRABAJO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Preguntas frecuentes que usan condicionales:

"What would you do if a key team member resigned unexpectedly?" [TYPE 2]
→  Candidato: "If that happened, I would immediately assess the workload distribution and..."

"If you had to describe your biggest professional failure, what would it be and what did you learn?" [TYPE 2 + reflection]

"Supposing you were offered a higher salary elsewhere, would you leave this role?"
→  Candidato: "Unless the role here stopped offering opportunities to grow, I wouldn't consider leaving."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRASES ÚTILES PARA REUNIONES PROFESIONALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para plantear hipótesis:
"What would happen if we...?"
"Supposing we took a different approach, would that change the outcome?"
"Had we known this earlier, we could have..."

Para establecer condiciones:
"We can proceed as long as..."
"I would be happy to support this provided that..."
"We will commit on condition that..."

Para analizar el pasado:
"If we had prioritised this, we wouldn't be in this position now."
"Had the team communicated more effectively, this issue wouldn't have escalated."

Para expresar consecuencias actuales de decisiones pasadas:
"Because we invested in training two years ago, we now have the capacity to..."
(Versión positiva sin condicional — también muy útil)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con el tipo de condicional más adecuado al contexto:

1. En un informe post-proyecto:
   "If the stakeholders _______ (approve) the additional budget in March, the team _______ (deliver) on time."

2. En una reunión estratégica:
   "If our data systems _______ (be) more integrated, we _______ (have) real-time visibility into the supply chain now."

3. En una negociación:
   "We _______ (commit) to the full order on condition that you _______ (guarantee) the revised price for 12 months."

4. En una evaluación de rendimiento:
   "_______ he _______ (communicate) the problem sooner, we _______ (be able to) resolve it before it affected the client."

Respuestas:
1. had approved / would have delivered   [Type 3]
2. were / would have   [Mixto B]
3. will commit / guarantee   [Type 1]
4. Had / communicated / would have been able to   [Type 3 con inversión]`;

// ─────────────────────────────────────────────────────────────────────────────
// L1.6 — What Could Have Been — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L16 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — TYPE 3: ESTRUCTURA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. "If I _______ harder, I _______ the contract."
   → Respuesta: had negotiated / would have won

2. Identifica el error:
   "If she had applied, she would get the job."
   → Error: "would get" debe ser "would have got" (Type 3 requiere would have + participio)

3. Transforma a Type 3:
   "She didn't read the brief. She missed the key point."
   → "If she had read the brief, she wouldn't have missed the key point."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — VARIANTES MODALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. ¿Qué modal expresa posibilidad pero no certeza en el resultado de un Type 3?
   → could have / might have

5. "If you had flagged this issue, the team _______ it earlier."
   Elige: would have addressed / could have addressed / should have addressed
   → Las tres son posibles. "would have" = certeza. "could have" = posibilidad. "should have" = obligación moral.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — CONDICIONALES MIXTOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. "If he had done an MBA, he _______ (be) the CFO now."
   → would be  [Mixto A: condición pasada, resultado presente]

7. "If she _______ (be) more resilient, she would have handled the crisis better."
   → were  [Mixto B: condición presente, resultado pasado]

8. Clasifica:
   "If they had restructured in 2020, the company would be profitable today."
   → Mixto A (condición pasada → efecto en el presente)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — CONECTORES AVANZADOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. Sustituye "if not" por el conector equivalente:
   "If you don't meet the KPIs, the contract will be terminated."
   → "Unless you meet the KPIs, the contract will be terminated."

10. ¿Qué diferencia hay entre "provided that" y "as long as"?
    → Ambos introducen condiciones. "Provided that" es más formal (contratos, acuerdos).
      "As long as" es neutro y más frecuente en conversación profesional.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE E — INVERSIÓN FORMAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. Transforma eliminando "if" mediante inversión:
    "If the board had approved the proposal, we would have launched in Q2."
    → "Had the board approved the proposal, we would have launched in Q2."

12. Transforma eliminando "if" mediante inversión:
    "If it had not been for the team's dedication, the project would have failed."
    → "Had it not been for the team's dedication, the project would have failed."`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U1 — 12 preguntas × 1 punto. passingScore 80 → mínimo 10/12.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U1 = {
  title:        'What Could Have Been — Unit 1 Assessment',
  description:  'Evalúa el dominio del sistema condicional avanzado: Type 3, condicionales mixtos, variantes modales, conectores formales e inversión condicional en contextos profesionales.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '"If she _______ the report, she would have noticed the error." ¿Qué forma completa correctamente la condición?',
      options:      ['read', 'had read', 'has read', 'was reading'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"If we had started earlier, we _______ these delays." ¿Qué forma correcta completa el resultado?',
      options:      ['would avoid', 'avoided', 'would have avoided', 'had avoided'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál de estas frases contiene un Type 3 correcto?',
      options:      [
        'If they invested earlier, they would have succeeded.',
        'If they had invested earlier, they would succeed.',
        'If they had invested earlier, they would have succeeded.',
        'If they had invested earlier, they will have succeeded.',
      ],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"If he had done an MBA, he _______ the CFO now." ¿Qué tipo de condicional es y qué forma es correcta?',
      options:      ['Type 3 — would have been', 'Mixto A — would be', 'Mixto B — had been', 'Type 2 — were'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"If she _______ more resilient, she would have handled the crisis better." ¿Qué forma completa este condicional mixto?',
      options:      ['had been', 'were', 'has been', 'would be'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Qué diferencia de significado hay entre "would have" y "could have" en el resultado de un Type 3?',
      options:      [
        'No hay diferencia, son intercambiables.',
        '"Would have" expresa certeza; "could have" expresa posibilidad.',
        '"Could have" expresa certeza; "would have" expresa posibilidad.',
        '"Would have" es más informal que "could have".',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"_______ you approve this today, we will lose the opportunity." ¿Qué conector completa correctamente la frase?',
      options:      ['If', 'Unless', 'Providing', 'Suppose'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"We will sign the contract _______ you guarantee delivery within 30 days." ¿Qué conector formal es más adecuado?',
      options:      ['unless', 'supposing', 'on condition that', 'what if'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál es la versión con inversión formal de "If they had consulted us earlier"?',
      options:      [
        'Had they been consulting us earlier',
        'Had they consulted us earlier',
        'They had consulted us earlier',
        'Should they have consulted us earlier',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"Had it not been for your support, the project would have failed." ¿Qué significa esta frase?',
      options:      [
        'El proyecto fracasó porque no hubo apoyo.',
        'El proyecto tuvo éxito gracias al apoyo recibido.',
        'El proyecto habría tenido éxito sin apoyo.',
        'No está claro si el proyecto tuvo éxito o no.',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         'Clasifica: "If our infrastructure were more scalable, we would have handled the traffic spike without issues."',
      options:      ['Type 3 puro', 'Mixto A (pasado → presente)', 'Mixto B (presente → pasado)', 'Type 2 puro'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"If I had taken that job in Berlin, I _______ living there now." ¿Qué forma es correcta?',
      options:      ['would have been', 'would be', 'had been', 'was'],
      correctIndex: 1,
      points:       1,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Seed
// ─────────────────────────────────────────────────────────────────────────────
module.exports = async (courseId) => {
  const unit = await upsert(Unit, { courseId, order: 1 }, {
    courseId,
    title:            'What Could Have Been',
    order:            1,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L1.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'What Could Have Been — The Third Conditional',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L11,
      duration: 20,
      order:    1,
    }),

    // L1.2 — VIDEO
    // Canal recomendado: BBC Learning English / English with Lucy
    // Búsqueda: "third conditional advanced English B2 BBC"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: Regrets and Possibilities',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-b2-u1-l2',
      duration: 10,
      order:    2,
    }),

    // L1.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'When Past Meets Present — Mixed Conditionals',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L13,
      duration: 20,
      order:    3,
    }),

    // L1.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Beyond If — Advanced Conditional Linkers',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L14,
      duration: 20,
      order:    4,
    }),

    // L1.5 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'Conditionals at Work — Real Business Scenarios',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L15,
      duration: 15,
      order:    5,
    }),

    // L1.6 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 6 }, {
      unitId:   unit._id,
      courseId,
      title:    'What Could Have Been — Quiz',
      type:     LESSON_TYPES.QUIZ,
      content:  CONTENT_L16,
      duration: 25,
      order:    6,
    }),

  ]);

  await upsert(Assessment, { unitId: unit._id }, {
    unitId:   unit._id,
    courseId,
    ...ASSESSMENT_U1,
  });
};
