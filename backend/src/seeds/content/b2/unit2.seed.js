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
// L2.1 — Must and Can't — Logical Deduction
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L21 = `En B1 aprendiste los usos básicos de los modales: will, would, can, could, should, must. Esta unidad los lleva al nivel B2: usar modales para deducir, especular y evaluar situaciones en el pasado y el presente — una habilidad fundamental en el inglés profesional.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEDUCCIÓN — QUÉ SIGNIFICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deducir es llegar a una conclusión lógica a partir de evidencias disponibles, sin tener certeza absoluta. Los modales son la herramienta del inglés para expresar este proceso.

MUST — deducción afirmativa (casi certeza)
→  La evidencia apunta fuertemente a que algo ES o ESTÁ.

"She must be exhausted — she worked through the weekend."
→  Deduzco que está agotada (por la evidencia: trabajó todo el fin de semana).

"There must be a problem with the server — nobody can access the platform."
→  Deduzco que hay un problema (por la evidencia: nadie puede acceder).

"He must know what he's doing — he's been in this industry for twenty years."
→  Deduzco que sabe lo que hace (por la evidencia: vasta experiencia).

MUST es la conclusión más segura. No es certeza absoluta — es la inferencia más lógica.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAN'T — DEDUCCIÓN NEGATIVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CAN'T / COULDN'T — deducción negativa (casi certeza de que NO)
→  La evidencia apunta fuertemente a que algo NO ES o NO ESTÁ.

"She can't be the director — she looks about twenty-five."
→  Deduzco que no es la directora (la evidencia contradice esa posibilidad).

"That can't be right — we checked those figures three times."
→  Deduzco que no es correcto (por la evidencia: verificación exhaustiva).

"He can't have received the email — he would have replied immediately."
→  Deduzco que no recibió el email (su comportamiento habitual lo contradice).

MUST y CAN'T son los dos extremos de la deducción:
MUST → "Estoy casi seguro de que SÍ."
CAN'T → "Estoy casi seguro de que NO."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEDUCCIÓN EN EL PASADO — MUST HAVE / CAN'T HAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para deducir sobre algo que ya ocurrió en el pasado, se usa MODAL + HAVE + PARTICIPIO PASADO.

MUST HAVE + participio — deducción afirmativa sobre el pasado:
"She must have left early — her computer is off and her coat is gone."
→  Deduzco que se fue antes (evidencia presente → conclusión sobre pasado).

"There must have been a misunderstanding — they were expecting a different version."
→  Deduzco que hubo un malentendido (por el resultado).

"He must have worked all night — the report is complete and it was only half done yesterday."
→  Deduzco que trabajó toda la noche.

CAN'T HAVE + participio — deducción negativa sobre el pasado:
"She can't have read the brief — she didn't mention any of the key points."
→  Deduzco que no leyó el informe (comportamiento inconsistente con haberlo leído).

"They can't have received our proposal — we would have had a response by now."
→  Deduzco que no recibieron la propuesta.

"He can't have understood the instructions — he did the complete opposite."
→  Deduzco que no entendió.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MUST VS. MUST HAVE — PRESENTE VS. PASADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"She must be in the meeting."
→  Deduzco que está en la reunión AHORA.

"She must have been in the meeting."
→  Deduzco que estuvo en la reunión (en algún momento pasado).

"The figures can't be correct."
→  Deduzco que las cifras no son correctas AHORA.

"The figures can't have been correct."
→  Deduzco que las cifras no eran correctas EN ESE MOMENTO.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — CONFUNDIR MUST CON HAVE TO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MUST (deducción) ≠ MUST (obligación):

"You must submit the report by Friday." → obligación
"She must be very experienced." → deducción

En el pasado, MUST HAVE es siempre deducción — no existe "must have" de obligación.
La obligación pasada se expresa con "had to":
"I had to rewrite the entire document." → obligación en el pasado.
"He must have rewritten the entire document." → deducción en el pasado.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usa must have o can't have para deducir sobre el pasado:

1. The office is empty and it's only 3 p.m. → "Everyone _______ (go) home early."
2. She answered every question correctly without checking her notes. → "She _______ (prepare) very thoroughly."
3. He submitted a report full of basic errors. → "He _______ (proofread) it before sending."
4. The client signed the contract without any changes. → "They _______ (be) completely satisfied with the terms."

Respuestas:
1. must have gone
2. must have prepared
3. can't have proofread
4. must have been`;

// ─────────────────────────────────────────────────────────────────────────────
// L2.3 — Might, Could and May — Speculation
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L23 = `MUST y CAN'T expresan deducciones de alta certeza. MIGHT, COULD y MAY expresan el espacio intermedio: cuando la evidencia existe pero no es suficiente para llegar a una conclusión firme. En inglés profesional, esta distinción es crucial para comunicar con precisión.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MIGHT / MAY / COULD — PRESENTE Y FUTURO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los tres expresan posibilidad (no certeza) en el presente o sobre el futuro:

"She might be in a meeting right now."
→  Es posible que esté en una reunión (no lo sé con certeza).

"The delay may affect our timeline."
→  Es posible que el retraso afecte el calendario.

"There could be a simpler explanation."
→  Podría haber una explicación más simple.

GRADO DE CERTEZA APROXIMADO:
must          → ~90 % (casi seguro que sí)
may / might   → ~50 % (posible)
could         → ~30-50 % (posible, más tentativo)
can't         → ~90 % (casi seguro que no)

DIFERENCIAS PRÁCTICAS:
— MAY tiene un registro ligeramente más formal que MIGHT.
  "This may cause delays." (informe) vs. "This might cause delays." (conversación)
— COULD añade un matiz de "entre las opciones posibles":
  "The problem could be the software, or it could be the network configuration."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MIGHT HAVE / MAY HAVE / COULD HAVE — ESPECULACIÓN SOBRE EL PASADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para especular sobre lo que posiblemente ocurrió en el pasado:

MIGHT HAVE + participio:
"She might have misread the brief."
→  Es posible que haya malinterpretado el informe. (No lo sé con seguridad.)

MAY HAVE + participio:
"There may have been a communication error somewhere in the chain."
→  Es posible que haya habido un error de comunicación.

COULD HAVE + participio:
"The problem could have started days before anyone noticed."
→  Es posible que el problema comenzara días antes.

Estos tres son prácticamente intercambiables para especulación pasada.
La diferencia es registro (may > might en formalidad) y matiz (could = "entre las opciones posibles").


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EL ESPECTRO COMPLETO DE LA DEDUCCIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRESENTE:
  must be         → casi seguro que SÍ
  may / might / could be → posible
  can't be        → casi seguro que NO

PASADO:
  must have [pp]         → casi seguro que SÍ (pasado)
  may / might / could have [pp] → posible (pasado)
  can't have [pp]        → casi seguro que NO (pasado)

Ejemplo — la misma situación, diferentes niveles de certeza:

La oficina está a oscuras a las 6 p.m. un miércoles.
"Everyone must have gone home." → Casi seguro (es lo normal).
"Everyone might have gone home." → Posible (pero no estoy seguro).
"They can't have all gone home." → Casi seguro que no (normalmente trabajan hasta las 8).


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESPECULACIÓN EN EL ENTORNO PROFESIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La especulación cuidadosa es una marca de profesionalismo en inglés: evita afirmaciones que no puedes sostener con evidencia.

En reuniones:
"The figures might not reflect the full picture — we may need to revisit the data."
"There could be a regulatory issue we haven't considered."

En correo electrónico:
"I may have sent the wrong version — please let me know if the attachment doesn't open correctly."
"There might be a delay at our end; I'll confirm by tomorrow."

En informes:
"The drop in conversion rates may have been caused by the platform update in Q3."
"Performance could have been affected by several external factors, including..."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COULD HAVE — DOS SIGNIFICADOS DISTINTOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Atención: COULD HAVE tiene dos significados que el contexto distingue:

1. ESPECULACIÓN — "es posible que haya ocurrido":
"She could have taken a different route." (quizás lo hizo)

2. POSIBILIDAD NO APROVECHADA — "era posible pero no ocurrió" (ver L2.4):
"She could have taken a different route, but she didn't." (tenía la opción pero no la usó)

El contexto y la presencia de "but" distinguen los dos usos.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige entre must have, might have / may have, o can't have:

1. The project finished two weeks early and under budget. → "The team _______ (work) incredibly efficiently."
2. He didn't answer any of our calls or emails all day. → "He _______ (be) dealing with an emergency."
3. She submitted a perfect report without any revisions. → "She _______ (rush) it — there are no errors at all."
4. The system went down right after the update. → "The update _______ (cause) a conflict with existing code."

Respuestas:
1. must have worked
2. might / may have been
3. can't have rushed
4. must have caused / might have caused (ambas válidas según la certeza que queramos expresar)`;

// ─────────────────────────────────────────────────────────────────────────────
// L2.4 — Should Have, Needn't Have — Criticism and Regret
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L24 = `SHOULD HAVE, NEEDN'T HAVE y COULD HAVE (en su uso no especulativo) expresan evaluación crítica del pasado: lo que era la opción correcta, lo que era innecesario y lo que era posible pero no se aprovechó. Son herramientas frecuentes en revisiones de proyectos, feedback profesional y expresión de arrepentimiento.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SHOULD HAVE — LO CORRECTO QUE NO OCURRIÓ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SHOULD HAVE + participio
→  Algo era lo correcto, lo esperado o lo aconsejable — y no ocurrió.
→  Expresa crítica (hacia otros) o arrepentimiento (hacia uno mismo).

CRÍTICA:
"She should have informed the client before making that change."
→  Era su responsabilidad informar al cliente, y no lo hizo.

"The team should have tested the software more thoroughly before the launch."
→  Era lo que debían haber hecho, y no lo hicieron.

"Management should have communicated the restructuring plan earlier."
→  Era lo correcto desde el punto de vista del liderazgo.

ARREPENTIMIENTO (primera persona):
"I should have backed up the files before the update."
→  Sé que era lo correcto y no lo hice — me arrepiento.

"We should have asked for a longer deadline — this timeline was never realistic."
→  Reconocemos que cometimos un error de planificación.

NEGATIVO — SHOULDN'T HAVE:
→  Algo ocurrió pero no debería haber ocurrido.

"He shouldn't have sent that email without approval."
→  Lo hizo, pero no era correcto.

"We shouldn't have agreed to those terms without reading the contract carefully."
→  Aceptamos las condiciones, pero no era lo que debíamos haber hecho.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEEDN'T HAVE — LO INNECESARIO QUE OCURRIÓ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEEDN'T HAVE + participio
→  Algo ocurrió pero no era necesario — se hizo trabajo o esfuerzo de más.

"You needn't have prepared such a detailed report — a summary would have been enough."
→  Hiciste el informe (te tomó tiempo), pero no era necesario.

"She needn't have stayed until midnight — the deadline was extended."
→  Se quedó hasta medianoche, pero el plazo se amplió (no era necesario).

"We needn't have ordered extra stock — demand was much lower than expected."
→  Pedimos stock adicional, pero no hizo falta.

NEEDN'T HAVE vs. DIDN'T NEED TO:

"You needn't have booked a meeting room — we cancelled."
→  Reservaste la sala (lo hiciste), pero no era necesario.

"You didn't need to book a meeting room — we always use the open space."
→  No era necesario reservar sala (y probablemente no lo hiciste).

La diferencia clave: NEEDN'T HAVE confirma que la acción sí ocurrió. DIDN'T NEED TO no lo confirma.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COULD HAVE — LA OPORTUNIDAD NO APROVECHADA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COULD HAVE + participio (uso crítico, no especulativo)
→  Había una opción o posibilidad disponible — y no se aprovechó.

"They could have raised this issue in the last meeting — why wait until now?"
→  Tenían la oportunidad de hacerlo antes y no la usaron.

"We could have negotiated better terms — we accepted the first offer too quickly."
→  Era posible conseguir mejores condiciones y no lo intentamos.

"She could have asked for help instead of struggling alone."
→  Tenía la opción de pedir ayuda y no lo hizo.

PODRÍAS vs. DEBERÍAS — MATIZ IMPORTANTE:
COULD HAVE → tenía la posibilidad (no la aprovechó) — crítica moderada
SHOULD HAVE → era lo correcto (no lo hizo) — crítica más directa

"You could have told me." → Tenías la oportunidad de decírmelo.
"You should have told me." → Era tu responsabilidad decírmelo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MAPA COMPLETO — EVALUACIÓN DEL PASADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

should have [pp]    → era lo correcto, no ocurrió (crítica / arrepentimiento)
shouldn't have [pp] → ocurrió, no era correcto (crítica / reproche)
needn't have [pp]   → ocurrió, no era necesario (era innecesario)
could have [pp]     → era posible, no ocurrió (oportunidad no aprovechada)
must have [pp]      → casi seguro que ocurrió (deducción)
can't have [pp]     → casi seguro que no ocurrió (deducción negativa)
might have [pp]     → posiblemente ocurrió (especulación)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN CONTEXTO PROFESIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Revisión de proyecto (post-mortem):
"We should have identified the dependency earlier in the planning phase."
"The team needn't have rebuilt the entire module — patching the existing code would have been sufficient."
"We could have piloted the solution with a smaller group first."

Feedback de rendimiento:
"You should have escalated this to me before taking that decision unilaterally."
"You could have delegated more — you didn't need to handle everything yourself."
"She needn't have rewritten the whole report; the structure was already solid."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige el modal correcto:

1. "The client was upset because nobody told them about the delay. We _______ (inform) them immediately."
2. "I spent three hours preparing slides, but the meeting was cancelled. I _______ (bother)."
3. "They had a great opportunity to expand into that market in 2021 and didn't take it. They _______ (act) then."
4. "He sent a formal complaint to the CEO directly. He _______ (do) that — it created a very difficult situation."

Respuestas:
1. should have informed
2. needn't have bothered
3. could have acted
4. shouldn't have done`;

// ─────────────────────────────────────────────────────────────────────────────
// L2.5 — Modal Verbs at Work — Integrated Professional Use
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L25 = `Esta lección integra todos los modales de deducción, especulación y evaluación en situaciones reales del entorno laboral. El objetivo es que identifiques cuál usar en función de lo que quieres comunicar exactamente.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MAPA DE DECISIÓN — ¿QUÉ MODAL USAR?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PREGUNTA 1: ¿Hablas del presente o del pasado?

PRESENTE → modal simple (must be / can't be / might be / could be)
PASADO   → modal + have + participio (must have / can't have / might have...)

PREGUNTA 2: ¿Cuánta certeza tienes?

CASI SEGURO QUE SÍ  → must (be / have + pp)
POSIBLE             → might / may / could (be / have + pp)
CASI SEGURO QUE NO  → can't / couldn't (be / have + pp)

PREGUNTA 3: ¿Estás evaluando o deduciendo?

DEDUCCIÓN / ESPECULACIÓN → must / might / may / could / can't
CRÍTICA (no debió ocurrir) → shouldn't have + pp
ARREPENTIMIENTO (debió ocurrir) → should have + pp
INNECESARIO (ocurrió pero no hacía falta) → needn't have + pp
POSIBILIDAD NO APROVECHADA → could have + pp


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENARIO 1 — ANÁLISIS DE UN INCIDENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El sistema de pagos de una empresa cayó durante dos horas en pleno Black Friday.

Director técnico:
"The system must have been under significantly more load than our tests simulated."
[must have — deducción con alta certeza sobre la causa]

Analista:
"There might have been a memory leak in the new module deployed that morning."
[might have — especulación, posibilidad entre varias]

Project manager:
"We should have run a load test with production-level traffic before the release."
[should have — crítica sobre un proceso que no se siguió]

Jefa de operaciones:
"We needn't have rolled out the update that day — we could have waited until after the peak season."
[needn't have — era innecesario; could have — posibilidad no aprovechada]


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENARIO 2 — REVISIÓN DE UNA PROPUESTA PERDIDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La empresa perdió un contrato importante con un cliente clave.

Director comercial:
"They must have received a more competitive offer — our pricing was above market."
[must have — deducción sobre la decisión del cliente]

Account manager:
"The client might not have fully understood the value proposition we were offering."
[might not have — especulación sobre la comprensión del cliente]

Director general:
"We should have arranged a face-to-face presentation instead of sending everything by email."
[should have — arrepentimiento sobre la estrategia]

Compañero:
"You couldn't have known they were also talking to three other agencies at the same time."
[couldn't have — deducción negativa; también sirve para eximir de culpa]


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENARIO 3 — CORREO PROFESIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Expresar incertidumbre con precisión en comunicación escrita:

"I may have sent you the wrong version of the document. Could you confirm which one you received?"
[may have — posibilidad, tono profesional no alarmista]

"There might be an issue with the payment reference — I'll check with our finance team and come back to you."
[might be — especulación; no confirma el problema, solo lo plantea]

"The delay shouldn't have happened — I apologise on behalf of the team and will ensure it doesn't recur."
[shouldn't have — reconocimiento de que algo estuvo mal, tono responsable]


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERRORES FRECUENTES A NIVEL B2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ "She must have forgot the meeting."
✅ "She must have forgotten the meeting."
(HAVE siempre va seguido de PARTICIPIO, no de past simple.)

❌ "He might knew about it."
✅ "He might have known about it."
(Para el pasado: modal + HAVE + participio.)

❌ "You needn't have to come."
✅ "You needn't have come."
(NEEDN'T HAVE ya contiene la idea de obligación — no se añade "to".)

❌ "They should have went earlier."
✅ "They should have gone earlier."
(HAVE + participio: "gone", no "went".)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA INTEGRADA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige el modal más preciso para cada situación:

1. Llegas a una reunión y la sala está vacía aunque estaba reservada para las 10.
   "There _______ (be) a last-minute change of room."

2. Tu colega entregó un informe excelente en tiempo récord.
   "She _______ (spend) the whole weekend on this."

3. El cliente firmó sin leer las condiciones. La empresa perdió una cláusula clave.
   "They _______ (read) the contract more carefully before signing."

4. Preparaste una presentación enorme para lo que resultó ser una llamada informal de cinco minutos.
   "You _______ (prepare) so much material — a few slides would have been fine."

5. El proveedor no ha respondido en tres días.
   "They _______ (receive) our message — we should try a different channel."

Respuestas:
1. must have been / might have been (según certeza)
2. must have spent
3. should have read
4. needn't have prepared
5. might not have received / can't have received (según certeza)`;

// ─────────────────────────────────────────────────────────────────────────────
// L2.6 — Reading Between the Lines — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L26 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — DEDUCCIÓN PRESENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. "The lights are off and nobody answers the door. They _______ be at home."
   → can't

2. "She knows every detail of the project without checking her notes. She _______ be extremely well prepared."
   → must

3. "He _______ be available right now — he said he was free all afternoon."
   → must

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — DEDUCCIÓN Y ESPECULACIÓN EN EL PASADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. "The report was perfect. She _______ (work) on it for days."
   → must have worked

5. "He submitted the wrong file. He _______ (check) the folder before sending."
   → can't have checked

6. "Nobody responded to the invitation. There _______ (be) a problem with the distribution list."
   → might have been / may have been

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — SHOULD HAVE / NEEDN'T HAVE / COULD HAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. "The contract expired without anyone noticing. Someone _______ (monitor) the renewal dates."
   → should have monitored

8. "I spent four hours formatting the spreadsheet, but the client only wanted the raw data."
   "I _______ (spend) so long on the formatting."
   → needn't have spent

9. "We had all the resources and time to pilot the product — we just didn't."
   "We _______ (pilot) it before the full launch."
   → could have piloted

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — DIFERENCIAS DE SIGNIFICADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. ¿Qué diferencia hay entre estas dos frases?
    A: "You didn't need to book a taxi — we have a company car."
    B: "You needn't have booked a taxi — we have a company car."
    → A: probablemente no reservaste el taxi. B: sí lo reservaste, pero no era necesario.

11. ¿Cuándo se usa COULD HAVE para expresar crítica en lugar de especulación?
    → Cuando hay un "but" implícito o explícito: "They could have told us sooner [but they didn't]."
      La ausencia de incertidumbre sobre el hecho (sabemos que no ocurrió) marca la diferencia.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE E — TEXTO INTEGRADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lee el extracto de una reunión de revisión y responde:

"The launch clearly didn't go as planned. Sales figures must have been far below projections — the board wouldn't have called an emergency meeting otherwise. Someone should have flagged the pre-order numbers weeks ago; they might have given us enough warning to adjust the strategy. We needn't have rushed the timeline — a two-week delay would have been entirely manageable."

12. ¿Por qué usa "must have been" en la primera frase?
    → Porque el hablante deduce con alta certeza que las cifras estuvieron por debajo, basándose en la evidencia: el consejo convocó una reunión de emergencia.`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U2 — 12 preguntas × 1 punto. passingScore 80 → mínimo 10/12.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U2 = {
  title:        'Reading Between the Lines — Unit 2 Assessment',
  description:  'Evalúa el dominio de los verbos modales para deducción (must / can\'t), especulación (might / may / could) y evaluación crítica del pasado (should have / needn\'t have / could have) en contextos profesionales.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '"The office is empty at 9 a.m. on a Monday. There _______ be a public holiday." ¿Qué modal es más adecuado?',
      options:      ['can\'t', 'must', 'should', 'needn\'t'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"She answered every technical question without hesitation. She _______ the subject very well." ¿Qué forma correcta completa la frase?',
      options:      ['must know', 'should know', 'might know', 'can\'t know'],
      correctIndex: 0,
      points:       1,
    },
    {
      text:         '"He submitted the report without any supporting data. He _______ the guidelines." ¿Qué deducción negativa es correcta?',
      options:      ['must have read', 'might have read', 'can\'t have read', 'should have read'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"The system crashed right after the update. The patch _______ a conflict." ¿Qué forma de especulación pasada es correcta?',
      options:      ['might have caused', 'must cause', 'should have caused', 'needn\'t have caused'],
      correctIndex: 0,
      points:       1,
    },
    {
      text:         '¿Qué diferencia hay entre "must have" y "might have" en una deducción sobre el pasado?',
      options:      [
        'No hay diferencia de significado, son intercambiables.',
        '"Must have" expresa casi certeza; "might have" expresa posibilidad.',
        '"Might have" expresa casi certeza; "must have" expresa posibilidad.',
        '"Must have" se usa solo para críticas, no para deducciones.',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"The client wasn\'t told about the delay until the day of delivery. We _______ them far earlier." ¿Qué modal expresa que era lo correcto pero no ocurrió?',
      options:      ['might have informed', 'needn\'t have informed', 'should have informed', 'must have informed'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"I prepared a 40-slide presentation for what turned out to be a five-minute chat. I _______ so many slides." ¿Qué modal indica que fue innecesario?',
      options:      ['shouldn\'t have prepared', 'needn\'t have prepared', 'must not have prepared', 'could have prepared'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"They had a chance to expand into Asia in 2019 and didn\'t take it. They _______ then." ¿Qué modal expresa una oportunidad no aprovechada?',
      options:      ['should have acted', 'could have acted', 'might have acted', 'must have acted'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Qué significa "You needn\'t have stayed late" en contraste con "You shouldn\'t have stayed late"?',
      options:      [
        'Son idénticas en significado.',
        '"Needn\'t have" indica que quedarse fue innecesario; "shouldn\'t have" indica que estuvo mal quedarse.',
        '"Shouldn\'t have" indica que fue innecesario; "needn\'t have" indica que estuvo mal.',
        '"Needn\'t have" implica que la persona no se quedó; "shouldn\'t have" implica que sí lo hizo.',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"She _______ the contract more carefully — there was a clause that cost us significantly." ¿Qué modal es más apropiado?',
      options:      ['might have read', 'must have read', 'should have read', 'needn\'t have read'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         'Identifica el error: "The team should have went with the original plan."',
      options:      [
        'Debería ser "should go", no "should have went".',
        'Debería ser "should have gone", no "should have went".',
        'Debería ser "must have gone", no "should have went".',
        'La frase es correcta.',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"The figures can\'t have been accurate — the auditors found discrepancies." ¿Qué expresa esta frase?',
      options:      [
        'Especulación débil: las cifras quizás no eran exactas.',
        'Deducción con alta certeza de que las cifras no eran exactas.',
        'Crítica: alguien debería haber revisado las cifras.',
        'Una oportunidad perdida de mejorar la exactitud.',
      ],
      correctIndex: 1,
      points:       1,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Seed
// ─────────────────────────────────────────────────────────────────────────────
module.exports = async (courseId) => {
  const unit = await upsert(Unit, { courseId, order: 2 }, {
    courseId,
    title:            'Reading Between the Lines',
    order:            2,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L2.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'Must and Can\'t — Logical Deduction',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L21,
      duration: 20,
      order:    1,
    }),

    // L2.2 — VIDEO
    // Canal recomendado: BBC Learning English / English with Lucy
    // Búsqueda: "modal verbs deduction must can't B2 advanced English"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: What\'s Going On?',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-b2-u2-l2',
      duration: 10,
      order:    2,
    }),

    // L2.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'Might, Could and May — Speculation',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L23,
      duration: 20,
      order:    3,
    }),

    // L2.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Should Have, Needn\'t Have — Criticism and Regret',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L24,
      duration: 20,
      order:    4,
    }),

    // L2.5 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'Modal Verbs at Work — Integrated Professional Use',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L25,
      duration: 15,
      order:    5,
    }),

    // L2.6 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 6 }, {
      unitId:   unit._id,
      courseId,
      title:    'Reading Between the Lines — Quiz',
      type:     LESSON_TYPES.QUIZ,
      content:  CONTENT_L26,
      duration: 25,
      order:    6,
    }),

  ]);

  await upsert(Assessment, { unitId: unit._id }, {
    unitId:   unit._id,
    courseId,
    ...ASSESSMENT_U2,
  });
};
