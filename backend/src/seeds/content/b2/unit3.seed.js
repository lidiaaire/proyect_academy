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
// L3.1 — It Was the Deadline — Cleft Sentences with It
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L31 = `En inglés, el orden por defecto de la frase sitúa la información más importante al final. Pero a veces necesitas destacar un elemento concreto —el sujeto, el objeto, la causa, el momento— y colocarlo en primer plano. Las cleft sentences son la herramienta principal para hacer esto sin cambiar el significado.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿QUÉ ES UNA CLEFT SENTENCE?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Una cleft sentence "divide" (cleave) la frase original en dos partes para destacar un elemento. La más común en inglés usa la estructura:

IT + BE + [elemento destacado] + THAT / WHO + [resto de la frase]

Frase original:
"The communication breakdown caused the project to fail."

Destacando la causa:
"It was the communication breakdown THAT caused the project to fail."
→  No fue otra cosa — fue específicamente la ruptura en la comunicación.

Destacando el resultado:
"It was the project THAT the communication breakdown caused to fail."
→  (menos frecuente en este contexto, pero gramaticalmente correcto)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA COMPLETA — IT + BE + X + THAT / WHO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THAT → para cosas, conceptos, tiempo, lugar, razón:

"It was the lack of testing THAT led to the system failure."
→  Fue la falta de pruebas lo que provocó el fallo.

"It was in Q3 THAT sales started to recover."
→  Fue en el tercer trimestre cuando las ventas empezaron a recuperarse.

"It was because of the merger THAT roles were restructured."
→  Fue a causa de la fusión que se reestructuraron los puestos.

WHO → para personas:

"It was the CFO WHO flagged the discrepancy."
→  Fue la directora financiera quien señaló la discrepancia.

"It was our lead developer WHO solved the problem overnight."
→  Fue nuestro desarrollador principal quien resolvió el problema.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIEMPO VERBAL EN IT + BE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El verbo BE concuerda con el tiempo de la frase original:

Presente:
"It IS the client's requirements THAT are driving this decision."
→  Son los requisitos del cliente los que impulsan esta decisión.

Pasado:
"It WAS the tight deadline THAT put the team under pressure."
→  Fue el plazo tan ajustado lo que presionó al equipo.

Futuro:
"It WILL BE the Q4 results THAT determine our strategy for next year."
→  Serán los resultados del cuarto trimestre los que determinarán nuestra estrategia.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USO NEGATIVO — IT IS NOT... THAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Las cleft negativas son muy efectivas para corregir malentendidos o rechazar una suposición:

"It isn't the budget THAT is the problem — it's the lack of a clear plan."
→  No es el presupuesto el problema, es la falta de un plan claro.

"It wasn't the product THAT failed — it was the marketing strategy."
→  No fue el producto lo que falló, sino la estrategia de marketing.

"It wasn't just the cost THAT concerned us — it was the timeline too."
→  No fue solo el coste lo que nos preocupó, también el plazo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLEFT SENTENCES EN COMUNICACIÓN PROFESIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Son especialmente útiles para:

En presentaciones (dirigir la atención):
"It is customer retention THAT drives long-term profitability — not acquisition."

En informes (identificar causas con precisión):
"It was the integration of the legacy system THAT created the bottleneck."

En negociaciones (aclarar prioridades):
"It is the delivery guarantee THAT matters most to us — price is secondary."

En reuniones (corregir interpretaciones erróneas):
"It wasn't the proposal THAT they rejected — it was the pricing structure."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — THAT OBLIGATORIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En cleft sentences con IT, THAT (o WHO) no es opcional:

❌ "It was the manager decided to cancel the project."
✅ "It was the manager WHO decided to cancel the project."

❌ "It was the report caused the confusion."
✅ "It was the report THAT caused the confusion."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transforma destacando el elemento entre paréntesis:

1. "The CEO approved the decision." [el CEO]
   → "It was _______ WHO _______."

2. "The new pricing model increased our margins." [el nuevo modelo de precios]
   → "It was _______ THAT _______."

3. "Poor stakeholder communication caused the delay — not the technical issues." [corrección]
   → "It wasn't _______ THAT _______."

4. "The board will review this proposal next month." [el mes que viene]
   → "It will be _______ THAT _______."

Respuestas:
1. It was the CEO WHO approved the decision.
2. It was the new pricing model THAT increased our margins.
3. It wasn't the technical issues THAT caused the delay — it was poor stakeholder communication.
4. It will be next month THAT the board reviews this proposal.`;

// ─────────────────────────────────────────────────────────────────────────────
// L3.3 — What I Need Is... — What-Cleft Sentences
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L33 = `La cleft con IT destaca el quién, el cuándo, el dónde o el por qué. La cleft con WHAT destaca el QUÉ: la acción, el objeto, la necesidad o el resultado. Juntas forman el sistema de énfasis más poderoso del inglés avanzado.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA — WHAT + CLÁUSULA + BE + ÉNFASIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT + [sujeto + verbo]  +  BE  +  [elemento destacado]

La cláusula con WHAT actúa como sujeto de la frase. BE la conecta con el elemento que quieres destacar.

Frase original:
"We need a clear roadmap."

Con énfasis mediante WHAT-cleft:
"What we need IS a clear roadmap."
→  El énfasis cae sobre "a clear roadmap" — es lo que hace falta, no otra cosa.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EJEMPLOS EN CONTEXTO PROFESIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Destacando una necesidad:
"What this project needs IS better resource allocation."
→  No mejor tecnología, no más tiempo — mejor distribución de recursos.

"What the client expects IS a weekly progress update, not a monthly report."
→  Corrige una expectativa malentendida.

Destacando una acción:
"What we should do IS consult the legal team before signing anything."
→  Lo que debemos hacer es consultar al equipo legal — antes de cualquier otra cosa.

"What surprised everyone WAS how quickly the market responded."
→  No fue la dirección del mercado — fue la velocidad.

Destacando un problema:
"What concerns me IS the lack of a contingency plan."
→  La preocupación no es el plan en sí — es la ausencia de plan alternativo.

"What nobody considered WAS the regulatory impact on the Asian markets."
→  Nadie consideró ese aspecto concreto.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIEMPO VERBAL — CONCORDANCIA CON BE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El verbo BE adopta el tiempo de la frase original:

PRESENTE:
"What the data shows IS a consistent decline in customer satisfaction."

PASADO:
"What impressed the board WAS the speed of the turnaround."

CON MODAL:
"What we will need IS a dedicated team for the integration phase."
"What you should consider IS the long-term maintenance cost."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VARIANTE — WHAT + HAPPEN(S) + IS (THAT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Muy frecuente en explicaciones y presentaciones para introducir un proceso o consecuencia:

"What happens IS (that) the system overloads when more than five hundred users log in simultaneously."
→  Introduce la explicación de un problema técnico de forma clara y enfática.

"What tends to happen in these situations IS (that) communication breaks down at the handover stage."
→  Generalización sobre un patrón recurrente.

"What happened WAS (that) nobody had documented the original configuration, so the migration failed."
→  Explica la causa de un problema pasado.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IT-CLEFT VS. WHAT-CLEFT — ¿CUÁNDO USAR CADA UNA?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IT-CLEFT → identifica quién, cuándo, dónde, por qué:
"It was the operations team WHO flagged the issue." (quién)
"It was in March THAT the problem first appeared." (cuándo)
"It was because of budget cuts THAT the project stalled." (por qué)

WHAT-CLEFT → destaca qué acción, qué objeto, qué resultado:
"What the operations team flagged WAS a critical security gap." (el QUÉ de la acción)
"What happened in March WAS a series of compounding failures." (el QUÉ del evento)
"What caused the stall WAS an unexpected budget freeze." (el QUÉ de la causa)

En muchos casos ambas son posibles y la diferencia es solo de matiz.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — ORDEN DEL VERBO BE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El verbo BE debe estar presente entre la cláusula WHAT y el elemento destacado:

❌ "What we need more resources."
✅ "What we need IS more resources."

❌ "What happened the system crashed."
✅ "What happened WAS (that) the system crashed."

❌ "What concerns me the lack of documentation."
✅ "What concerns me IS the lack of documentation."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transforma usando una WHAT-cleft para destacar el elemento en cursiva:

1. "We need [more time for testing]."
   → "What we need IS _______."

2. "[The absence of a clear owner] caused the confusion."
   → "What caused the confusion WAS _______."

3. "The board rejected [the proposed budget increase]."
   → "What the board rejected WAS _______."

4. "[Nobody had reviewed the data] before the presentation."
   → "What happened was _______."

Respuestas:
1. What we need IS more time for testing.
2. What caused the confusion WAS the absence of a clear owner.
3. What the board rejected WAS the proposed budget increase.
4. What happened was that nobody had reviewed the data before the presentation.`;

// ─────────────────────────────────────────────────────────────────────────────
// L3.4 — Never Have I Seen — Negative Inversion
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L34 = `La inversión es una estructura en la que el auxiliar se coloca antes del sujeto —igual que en preguntas— pero dentro de una frase afirmativa. Cuando va precedida de un adverbio negativo o restrictivo, crea un efecto de énfasis muy marcado y es una característica distintiva del inglés avanzado, tanto escrito como oral.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿QUÉ ES LA INVERSIÓN?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En inglés estándar: SUJETO + AUXILIAR + VERBO
En inversión: ADVERBIO/EXPRESIÓN + AUXILIAR + SUJETO + VERBO

Frase estándar:
"I have never seen such a comprehensive proposal."

Con inversión negativa:
"Never have I seen such a comprehensive proposal."
→  El énfasis es mayor. El tono es más formal y contundente.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVERBIOS Y EXPRESIONES QUE DESENCADENAN INVERSIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEVER:
Estándar:  "We have never faced such pressure before."
Inversión: "Never have we faced such pressure before."

NOT ONLY... BUT ALSO:
Estándar:  "They not only missed the deadline but also exceeded the budget."
Inversión: "Not only did they miss the deadline, but they also exceeded the budget."
→  Nota: cuando "not only" va al inicio, el verbo principal pasa a la forma simple con DO/DID.

HARDLY / SCARCELY + WHEN:
Estándar:  "We had hardly started the project when the requirements changed."
Inversión: "Hardly had we started the project when the requirements changed."
→  Expresa que dos eventos ocurrieron casi simultáneamente, con el primero apenas comenzado.

NO SOONER + THAN:
Estándar:  "We had no sooner launched the product than a competitor released a similar one."
Inversión: "No sooner had we launched the product than a competitor released a similar one."
→  El mismo significado que HARDLY/SCARCELY, pero con THAN en lugar de WHEN.

RARELY / SELDOM:
Estándar:  "We rarely have the opportunity to work with such a talented team."
Inversión: "Rarely do we have the opportunity to work with such a talented team."

ONLY + expresión temporal:
Estándar:  "We realised the error only after the contract had been signed."
Inversión: "Only after the contract had been signed did we realise the error."

UNDER NO CIRCUMSTANCES:
Estándar:  "You should not share this information with competitors under any circumstances."
Inversión: "Under no circumstances should you share this information with competitors."
→  Uso muy frecuente en documentos legales, políticas de empresa y comunicaciones formales.

AT NO POINT / AT NO TIME:
"At no point did the client indicate they were dissatisfied."
"At no time was the data accessible to unauthorised users."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA DEL AUXILIAR EN LA INVERSIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El auxiliar que se invierte depende del tiempo verbal:

PRESENT PERFECT → HAVE / HAS:
"Never have I seen such poor communication."
"Rarely has the board been so divided on an issue."

PAST SIMPLE → DID + infinitivo:
"Not only did the launch fail, but the team morale also suffered."
"Seldom did management acknowledge the team's concerns."

PAST PERFECT → HAD + participio:
"Hardly had the meeting started when the fire alarm went off."
"No sooner had we agreed on the terms than they changed their position."

PRESENTE SIMPLE → DO / DOES:
"Rarely does this kind of opportunity arise."
"Under no circumstances does this policy apply to existing contracts."

MODAL → modal + sujeto:
"Under no circumstances should employees disclose client information."
"Only in exceptional cases may the deadline be extended."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INVERSIÓN EN EL ENTORNO PROFESIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En presentaciones (apertura impactante):
"Never before has customer loyalty been so critical to our survival as a business."
"Rarely do we see this level of alignment across all departments."

En informes y comunicados formales:
"Under no circumstances should project data be shared externally without prior approval."
"At no point during the audit was any irregularity detected."

En discursos y argumentaciones:
"Not only did we exceed our targets, but we also opened three new markets."
"No sooner had we resolved one challenge than another emerged."

En cartas de reclamación o escalada:
"At no time were we informed of this change in the terms."
"Under no circumstances do we consider this outcome acceptable."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — OLVIDAR INVERTIR EL AUXILIAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El error más frecuente: escribir la expresión negativa al inicio pero no invertir:

❌ "Never we have faced such a challenge."
✅ "Never have we faced such a challenge."

❌ "Not only they missed the deadline, but also exceeded the budget."
✅ "Not only did they miss the deadline, but they also exceeded the budget."

❌ "Hardly the project had started when problems appeared."
✅ "Hardly had the project started when problems appeared."

La inversión es la marca del nivel avanzado — sin ella, la estructura es incorrecta.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transforma usando inversión:

1. "We had scarcely announced the merger when speculation began."
   → "Scarcely _______."

2. "You should not make changes to live systems under any circumstances."
   → "Under no circumstances _______."

3. "We have rarely encountered such a complex regulatory environment."
   → "Rarely _______."

4. "They not only lost the contract but also damaged the client relationship."
   → "Not only _______."

Respuestas:
1. Scarcely had we announced the merger when speculation began.
2. Under no circumstances should you make changes to live systems.
3. Rarely have we encountered such a complex regulatory environment.
4. Not only did they lose the contract, but they also damaged the client relationship.`;

// ─────────────────────────────────────────────────────────────────────────────
// L3.5 — Making Your Point — Emphasis in Professional Communication
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L35 = `Esta lección integra las tres estructuras de énfasis en situaciones reales del entorno laboral: presentaciones, informes, negociaciones y comunicación escrita formal.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MAPA DE DECISIÓN — ¿QUÉ ESTRUCTURA USAR?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IT-CLEFT → para identificar quién, cuándo, dónde, por qué con precisión:
"It was the risk assessment THAT was missing from the original plan."
"It was our operations director WHO negotiated the revised terms."

WHAT-CLEFT → para destacar qué acción, qué resultado, qué necesidad:
"What we need IS a dedicated project manager for this phase."
"What the data shows IS a clear upward trend in customer retention."

INVERSIÓN NEGATIVA → para añadir impacto formal, énfasis máximo:
"Never have we seen such consistent growth across all regions."
"Under no circumstances should client data leave the secure server."
"Not only did the team deliver on time, but they came in under budget."

Las tres pueden combinarse en un mismo texto para variar el énfasis y el registro.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENARIO 1 — APERTURA DE PRESENTACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Good morning. What I want to do today IS give you a clear picture of where we are and where we need to be by Q4.

It isn't the revenue figures that should concern us most — it IS the customer retention rate. Never before has retention been so directly linked to our ability to grow sustainably.

What the data tells us IS that we are losing customers not at the acquisition stage, but six months after onboarding. It is at that six-month mark THAT we need to intervene."

Análisis de estructuras:
— WHAT-cleft (what I want to do): introduce el objetivo de la presentación.
— IT-cleft negativo (it isn't...it IS): corrige la prioridad percibida.
— Inversión (Never before has): crea impacto en la afirmación clave.
— WHAT-cleft (what the data tells us): introduce el hallazgo principal.
— IT-cleft (It is at that six-month mark THAT): identifica el momento crítico.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENARIO 2 — EXTRACTO DE INFORME EJECUTIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"It was the supply chain disruption in Q2 that initially triggered the performance shortfall. What the subsequent analysis revealed, however, was a pre-existing vulnerability in our inventory management process. Not only did demand forecasting prove inaccurate, but the contingency protocols were also insufficient for a disruption of this magnitude.

What this report recommends is a two-phase response: immediate operational adjustments and a strategic review of our supplier diversification policy. Under no circumstances should the organisation return to a single-supplier model for critical components."

Análisis:
— IT-cleft: identifica la causa inicial.
— WHAT-cleft: introduce el hallazgo de la investigación.
— NOT ONLY inversion: amplía la crítica con dos elementos.
— WHAT-cleft: introduce las recomendaciones.
— UNDER NO CIRCUMSTANCES: refuerza la conclusión con máxima firmeza.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENARIO 3 — NEGOCIACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"What we are asking for is not a price reduction — it is a payment structure that reflects the extended scope of the project. It was this extended scope that wasn't accounted for in the original contract.

Under no circumstances are we prepared to absorb those additional costs unilaterally. What we propose is a revised schedule of payments aligned to each project milestone."

Análisis:
— WHAT-cleft: reencuadra la petición (no reducción de precio, sino estructura de pago).
— IT-cleft: identifica el elemento no contemplado en el contrato.
— UNDER NO CIRCUMSTANCES: posición no negociable, tono firme.
— WHAT-cleft: presenta la propuesta constructiva.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGISTRO — ¿CUÁNDO USAR ESTAS ESTRUCTURAS?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SIEMPRE ADECUADAS (oral y escrito):
IT-cleft y WHAT-cleft — amplio rango de registros, desde conversación hasta documentos formales.

MÁS FORMALES (escrito o discurso preparado):
Inversión negativa (Never, Not only, Hardly, Under no circumstances).
En conversación informal suenan excesivamente rígidas.

NUNCA en mensajes muy informales (chat interno, mensajes breves):
Las tres estructuras son inadecuadas en contextos muy coloquiales.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA INTEGRADA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reescribe usando la estructura indicada:

1. "The quality of the data is the main issue, not the quantity." [IT-cleft negativo]
   → "It isn't _______ THAT is the issue — it IS _______."

2. "We need a clear escalation process." [WHAT-cleft]
   → "_______."

3. "We have never experienced this level of staff turnover before." [inversión con never]
   → "_______."

4. "They failed to deliver AND they didn't inform the client." [NOT ONLY]
   → "_______."

Respuestas:
1. It isn't the quantity of data THAT is the issue — it IS the quality.
2. What we need IS a clear escalation process.
3. Never before have we experienced this level of staff turnover.
4. Not only did they fail to deliver, but they also failed to inform the client.`;

// ─────────────────────────────────────────────────────────────────────────────
// L3.6 — Making Your Point — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L36 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — IT-CLEFT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Transforma destacando "the budget freeze":
   "The budget freeze stopped the expansion."
   → "It was _______ THAT _______."

2. ¿Cuál es la IT-cleft correcta para destacar una persona?
   A: "It was the consultant that resolved the issue."
   B: "It was the consultant who resolved the issue."
   C: Ambas son correctas.
   → C (THAT es aceptable para personas, aunque WHO es preferido)

3. Identifica el error:
   "It was the merger caused the restructuring."
   → Falta THAT: "It was the merger THAT caused the restructuring."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — WHAT-CLEFT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. "We need better internal communication tools."
   Transforma con WHAT-cleft:
   → "What we need IS better internal communication tools."

5. Identifica el error:
   "What the client wants faster delivery."
   → Falta IS: "What the client wants IS faster delivery."

6. ¿Cuándo se usa WHAT-cleft en lugar de IT-cleft?
   → Cuando queremos destacar QUÉ (objeto, necesidad, resultado).
     IT-cleft destaca QUIÉN, CUÁNDO, DÓNDE, POR QUÉ.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — INVERSIÓN NEGATIVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. Transforma con inversión:
   "We had scarcely signed the contract when the conditions changed."
   → "Scarcely _______."
   → Scarcely had we signed the contract when the conditions changed.

8. Identifica el error:
   "Not only they exceeded the budget, but also missed the deadline."
   → Falta DO/DID: "Not only DID they exceed the budget, but they also missed the deadline."

9. "Under no circumstances _______ employees access client records from personal devices."
   Elige el auxiliar correcto:
   A: do  B: should  C: have  D: are
   → B (should — expresa prohibición / política)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — TEXTO INTEGRADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lee el extracto y responde:

"It was the failure to communicate risk early that led to the crisis, not the risk itself. What the post-mortem revealed was a systemic gap in the escalation process. Never had the organisation faced such reputational exposure. Under no circumstances should this situation be allowed to recur."

10. ¿Qué elemento destaca la primera IT-cleft?
    → La causa del problema: "the failure to communicate risk early" (no el riesgo en sí).

11. ¿Por qué se usa WHAT-cleft en la segunda frase?
    → Para destacar el QUÉ del hallazgo: "a systemic gap in the escalation process".

12. ¿Qué efecto produce "Never had the organisation faced"?
    → Énfasis máximo mediante inversión con NEVER + past perfect.
       Indica que fue una situación sin precedentes, con tono formal y contundente.`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U3 — 12 preguntas × 1 punto. passingScore 80 → mínimo 10/12.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U3 = {
  title:        'Making Your Point — Unit 3 Assessment',
  description:  'Evalúa el dominio de las estructuras de énfasis en inglés avanzado: IT-cleft, WHAT-cleft e inversión negativa en contextos profesionales escritos y orales.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '"_______ the lack of testing THAT caused the system failure." ¿Qué palabra inicia correctamente esta IT-cleft?',
      options:      ['What was', 'It was', 'That was', 'There was'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Cuál de estas IT-cleft es correcta?',
      options:      [
        'It was the finance director resolved the issue.',
        'It was the finance director who resolved the issue.',
        'It was who the finance director resolved the issue.',
        'It the finance director was who resolved the issue.',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"It isn\'t the budget _______ is the problem — it\'s the timeline." ¿Qué palabra completa la IT-cleft negativa?',
      options:      ['who', 'which', 'that', 'what'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"_______ the client needs IS a dedicated account manager." ¿Qué palabra inicia correctamente esta WHAT-cleft?',
      options:      ['It', 'That', 'Which', 'What'],
      correctIndex: 3,
      points:       1,
    },
    {
      text:         '¿Cuál de estas WHAT-cleft es correcta?',
      options:      [
        'What we need more resources.',
        'What we need are more resources.',
        'What we need IS more resources.',
        'What need we is more resources.',
      ],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuándo es más adecuada una WHAT-cleft frente a una IT-cleft?',
      options:      [
        'Para identificar quién realizó una acción.',
        'Para destacar el QUÉ: la necesidad, el resultado o el objeto de la acción.',
        'Para indicar el momento en que ocurrió algo.',
        'Para expresar una condición hipotética.',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"Never _______ such strong quarterly results." ¿Qué auxiliar completa la inversión correctamente?',
      options:      ['we have seen', 'have we seen', 'we seen have', 'did we see'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"Not only _______ the deadline, but they also exceeded the budget." ¿Qué forma correcta usa la inversión con NOT ONLY?',
      options:      ['they missed', 'did they miss', 'they did miss', 'have they missed'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"_______ had the board approved the acquisition when a regulatory objection was raised." ¿Qué adverbio inicia esta inversión?',
      options:      ['Never', 'Hardly', 'Rarely', 'Only'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"Under no circumstances _______ project data be shared with third parties without written consent." ¿Qué auxiliar es correcto?',
      options:      ['do', 'did', 'should', 'have'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         'Identifica la frase con la inversión negativa correcta:',
      options:      [
        'Rarely we encounter this level of stakeholder engagement.',
        'Rarely do we encounter this level of stakeholder engagement.',
        'Rarely we do encounter this level of stakeholder engagement.',
        'Rarely encountered we this level of stakeholder engagement.',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Qué estructura sería más apropiada para abrir un informe formal con máximo impacto sobre un hallazgo sin precedentes?',
      options:      [
        'WHAT-cleft: "What the audit found was a significant compliance gap."',
        'IT-cleft: "It was a significant compliance gap that the audit found."',
        'Inversión: "Never before has the audit revealed such a significant compliance gap."',
        'Cualquiera de las tres tiene el mismo impacto en un informe formal.',
      ],
      correctIndex: 2,
      points:       1,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Seed
// ─────────────────────────────────────────────────────────────────────────────
module.exports = async (courseId) => {
  const unit = await upsert(Unit, { courseId, order: 3 }, {
    courseId,
    title:            'Making Your Point',
    order:            3,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L3.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'It Was the Deadline — Cleft Sentences with It',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L31,
      duration: 20,
      order:    1,
    }),

    // L3.2 — VIDEO
    // Canal recomendado: BBC Learning English / Cambridge English
    // Búsqueda: "cleft sentences emphasis advanced English B2 C1"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: Speaking with Emphasis',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-b2-u3-l2',
      duration: 10,
      order:    2,
    }),

    // L3.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'What I Need Is... — What-Cleft Sentences',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L33,
      duration: 20,
      order:    3,
    }),

    // L3.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Never Have I Seen — Negative Inversion',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L34,
      duration: 20,
      order:    4,
    }),

    // L3.5 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'Making Your Point — Emphasis in Professional Communication',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L35,
      duration: 15,
      order:    5,
    }),

    // L3.6 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 6 }, {
      unitId:   unit._id,
      courseId,
      title:    'Making Your Point — Quiz',
      type:     LESSON_TYPES.QUIZ,
      content:  CONTENT_L36,
      duration: 25,
      order:    6,
    }),

  ]);

  await upsert(Assessment, { unitId: unit._id }, {
    unitId:   unit._id,
    courseId,
    ...ASSESSMENT_U3,
  });
};
