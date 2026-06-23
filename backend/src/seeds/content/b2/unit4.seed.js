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
// L4.1 — Reporting Without a Source — Impersonal Passive
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L41 = `En B1 aprendiste la voz pasiva fundamental: be + participio pasado. Esta unidad introduce los usos avanzados que caracterizan la escritura profesional y académica: la pasiva impersonal con verbos de comunicación, la pasiva con verbos modales y la construcción causativa. Son las estructuras que distinguen el inglés B2 del B1.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REPASO — PASIVA BÁSICA B1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Activa:  "The team launched the product in March."
Pasiva:  "The product was launched in March (by the team)."

Usos principales en B1:
— El agente no importa o no se conoce.
— El foco está en el objeto, no en quien actúa.
— Registro formal o científico.

Esta lección va más allá: la pasiva impersonal permite informar sin atribuir la afirmación a ninguna fuente concreta — una herramienta esencial en informes, noticias y comunicados oficiales.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERBOS DE COMUNICACIÓN Y PENSAMIENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los siguientes verbos permiten construir pasivas impersonales:

say, report, believe, think, expect, consider, claim, allege, estimate, know, understand, fear, suggest, announce

Estos verbos aparecen constantemente en:
— Noticias e informes ("It is reported that...")
— Documentos corporativos ("It is expected that...")
— Comunicados legales y regulatorios ("It is alleged that...")
— Análisis de mercado ("It is estimated that...")


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA A — IT + PASIVA + THAT + CLÁUSULA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IT  +  IS/WAS + participio  +  THAT  +  [sujeto + verbo]

Esta estructura evita atribuir la información a una fuente específica.

PRESENTE / PRESENTE CONTINUO:
"It is said that the company is considering a merger."
→  Se dice que la empresa está considerando una fusión.

"It is believed that the new policy will take effect in Q1."
→  Se cree que la nueva política entrará en vigor en el primer trimestre.

"It is estimated that the market will grow by 12% this year."
→  Se estima que el mercado crecerá un 12% este año.

"It is expected that the board will announce a decision by Friday."
→  Se espera que el consejo anuncie una decisión antes del viernes.

PASADO:
"It was reported that the company had breached data protection regulations."
→  Se informó de que la empresa había incumplido la normativa de protección de datos.

"It was claimed that the figures had been manipulated."
→  Se alegó que las cifras habían sido manipuladas.

"It was understood that both parties had reached an informal agreement."
→  Se entendía que ambas partes habían alcanzado un acuerdo informal.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FUNCIÓN CLAVE — DISTANCIAMIENTO Y OBJETIVIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La pasiva impersonal permite al escritor:

1. REPORTAR sin comprometerse con la veracidad:
"It is alleged that funds were misused."  →  No confirma que sea verdad — solo que se alega.

2. PRESENTAR opinión general sin atribuirla a nadie:
"It is widely believed that remote work increases productivity."
→  Es una creencia extendida, no necesariamente la del escritor.

3. MANTENER UN TONO OBJETIVO en documentos formales:
"It is considered that the proposal meets all regulatory requirements."
→  Suena institucional y objetivo, sin implicar a ninguna persona concreta.

4. SUAVIZAR AFIRMACIONES en contextos diplomáticos:
"It is suggested that the timeline may need to be revised."
→  Mucho más diplomático que: "We think you need to change the timeline."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVERBIOS FRECUENTES CON ESTA ESTRUCTURA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

widely     → "It is widely reported that..."
generally  → "It is generally understood that..."
commonly   → "It is commonly believed that..."
officially → "It is officially confirmed that..."
formally   → "It has been formally announced that..."

"It is widely considered that this approach is the most cost-effective."
"It is generally understood that the contract will be renewed."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — CONFUNDIR IT IS SAID Y THEY SAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"They say the market is recovering." → informal, agente implícito (they = la gente)
"It is said that the market is recovering." → formal, pasiva impersonal
"People say the market is recovering." → informal, agente explícito

Las tres transmiten una idea similar, pero el registro es muy distinto. En documentos profesionales, la pasiva impersonal es la opción apropiada.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transforma a pasiva impersonal con IT:

1. "People believe the company will announce job cuts next month."
   → "It _______ that the company _______."

2. "Analysts report that the merger negotiations have stalled."
   → "It _______ that _______."

3. "Everyone understood that the director had resigned voluntarily."
   → "It _______ that _______."

Respuestas:
1. It is believed that the company will announce job cuts next month.
2. It is reported that the merger negotiations have stalled.
3. It was understood that the director had resigned voluntarily.`;

// ─────────────────────────────────────────────────────────────────────────────
// L4.3 — Two Structures, Same Meaning — Subject Passive with Infinitive
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L43 = `La pasiva impersonal con IT tiene una variante igualmente importante: en lugar de IT como sujeto impersonal, el sujeto real del verbo pasa al primer plano. Ambas estructuras expresan lo mismo, pero la segunda es más directa y más frecuente en inglés formal moderno.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA B — SUJETO + PASIVA + INFINITIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUJETO  +  IS/WAS + participio  +  TO + infinitivo / to have + participio

En lugar de IT como sujeto, la persona o cosa de la que se habla pasa al frente:

"It is said that he is the best negotiator in the industry."
→  "He is said TO BE the best negotiator in the industry."

"It is believed that the CEO will resign."
→  "The CEO is believed TO BE about to resign."
(o: "The CEO is believed TO be planning to resign.")

"It is expected that the results will exceed projections."
→  "The results are expected TO EXCEED projections."

"It was reported that the company had filed for bankruptcy."
→  "The company was reported TO HAVE FILED for bankruptcy."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUÁNDO USAR TO + INFINITIVO VS. TO HAVE + PARTICIPIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TO + INFINITIVO → cuando el hecho reportado es simultáneo o futuro respecto al verbo principal:

"The project is expected TO DELIVER results by Q4."
→  Se espera que entregue resultados (hecho futuro respecto al momento actual).

"He is understood TO BE in negotiations."
→  Se entiende que está negociando (hecho actual, simultáneo al verbo principal).

TO HAVE + PARTICIPIO → cuando el hecho reportado es anterior al verbo principal:

"The company is alleged TO HAVE VIOLATED data protection laws."
→  Se alega que violó (ya ocurrió) las leyes — el hecho es anterior al momento de la alegación.

"She is said TO HAVE WORKED in intelligence before joining the private sector."
→  Se dice que trabajó (antes) en inteligencia.

"The funds are believed TO HAVE BEEN transferred to an offshore account."
→  Se cree que los fondos fueron transferidos (pasado) — PASIVA PERFECTA.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERBOS MÁS FRECUENTES EN ESTA ESTRUCTURA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

say       → "He is said to be..."
believe   → "The company is believed to have..."
expect    → "Sales are expected to rise..."
report    → "She was reported to have resigned..."
think     → "The strategy is thought to be..."
consider  → "The approach is considered to represent..."
know      → "He is known to have worked with..."
allege    → "The executive is alleged to have..."
claim     → "The product is claimed to reduce..."
understand → "The parties are understood to have agreed..."
estimate  → "Losses are estimated to amount to..."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPARACIÓN DIRECTA — LAS DOS ESTRUCTURAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ESTRUCTURA A (IT + pasiva + THAT):
"It is estimated that the project will cost €2 million."
"It was alleged that the director had falsified the accounts."

ESTRUCTURA B (sujeto + pasiva + infinitivo):
"The project is estimated TO COST €2 million."
"The director was alleged TO HAVE FALSIFIED the accounts."

Ambas son correctas y expresan lo mismo. La Estructura B es más directa y ligeramente más frecuente en titulares y documentos ejecutivos.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN TITULARES Y COMUNICADOS OFICIALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los titulares frecuentemente usan la Estructura B porque es más compacta:

"Merger talks said to be at advanced stage."
→  "It is said that merger talks are at an advanced stage."

"CEO believed to be in talks with rival firm."
→  "It is believed that the CEO is in talks with a rival firm."

"Company reported to have laid off 200 employees."
→  "It is reported that the company has laid off 200 employees."

En comunicados oficiales y cartas formales, la Estructura A suena más institucional:
"It is hereby confirmed that the agreement has been finalised."
"It is our understanding that all conditions have been met."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — INFINITIVO VS. PARTICIPIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ "The company is believed to violated the agreement."
✅ "The company is believed to have violated the agreement."
(Hecho pasado: to HAVE + participio)

❌ "She is expected to has submitted the report."
✅ "She is expected to have submitted the report."
(HAVE, no HAS, después de to)

❌ "The funds are said to transferred."
✅ "The funds are said to have been transferred."
(Pasiva perfecta: to HAVE BEEN + participio)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transforma usando la Estructura B (sujeto + pasiva + infinitivo):

1. "It is expected that the board will reach a decision this week."
   → "The board _______."

2. "It is alleged that the manager falsified the expense reports."
   → "The manager _______."

3. "It is widely believed that the new regulation will reduce costs."
   → "The new regulation _______."

4. "It was reported that the company had lost its operating licence."
   → "The company _______."

Respuestas:
1. The board is expected to reach a decision this week.
2. The manager is alleged to have falsified the expense reports.
3. The new regulation is widely believed to reduce costs.
4. The company was reported to have lost its operating licence.`;

// ─────────────────────────────────────────────────────────────────────────────
// L4.4 — Getting Things Done — The Causative
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L44 = `La construcción causativa expresa que el sujeto organiza, encarga o provoca que algo ocurra —normalmente a través de otra persona. Es fundamental en el inglés profesional para hablar de gestión, delegación y servicios.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA — HAVE / GET + OBJETO + PARTICIPIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HAVE + objeto + participio pasado
→  El sujeto organiza que alguien haga algo (no lo hace él mismo).

"We had the contract reviewed by our legal team."
→  Hicimos que nuestro equipo legal revisara el contrato. (nosotros no lo revisamos)

"The company had its accounts audited last quarter."
→  La empresa encargó una auditoría de sus cuentas.

"She had the presentation redesigned before the board meeting."
→  Encargó que rediseñaran la presentación.

GET + objeto + participio pasado
→  Mismo significado que HAVE, pero con un matiz de mayor esfuerzo o dificultad para conseguirlo. Ligeramente más informal.

"We finally got the system upgraded after months of requests."
→  Por fin conseguimos que actualizaran el sistema (costó esfuerzo).

"She got the report approved by three different departments."
→  Consiguió que tres departamentos aprobaran el informe.

"Can you get the invoices processed by end of day?"
→  ¿Puedes conseguir que procesen las facturas?


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIEMPOS VERBALES CON HAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La causativa funciona en todos los tiempos — solo cambia HAVE:

PRESENTE:      "We have our servers maintained by an external provider."
PASADO:        "They had the office refurbished last year."
FUTURO:        "We will have the report translated before the summit."
PRESENT PERF.: "She has had her contract renewed twice."
CONDICIONAL:   "We would have the system tested more thoroughly if we had more time."
MODAL:         "You should have the figures checked before submitting."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USO 2 — EXPERIENCIAS NO DESEADAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La causativa también describe algo que le ocurrió al sujeto — sin que lo haya organizado él. El contexto aclara el significado:

"The company had its data stolen in a cyberattack."
→  Les robaron los datos (no lo organizaron — les ocurrió).

"We had three servers taken offline during the attack."
→  Nos dejaron tres servidores fuera de línea (no fue voluntario).

"She had her laptop confiscated at the border."
→  Le confiscaron el ordenador (experiencia no deseada).

El participio pasado y el contexto indican que es algo que le sucedió, no que organizó.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HAVE SOMETHING DONE VS. DO SOMETHING YOURSELF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"I fixed the bug myself." → Lo hice yo.
"I had the bug fixed." → Encargué que lo arreglaran.

"She wrote the report herself." → Lo escribió ella.
"She had the report written." → Encargó que lo escribieran.

"We are updating the software." → Lo estamos haciendo nosotros.
"We are having the software updated." → Están haciéndolo por nosotros.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MAKE Y GET + INFINITIVO — VARIANTES CAUSATIVAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MAKE + objeto + infinitivo sin TO (causativa de obligación o resultado):
"The new regulations will make companies disclose their carbon emissions."
→  Las regulaciones obligarán a las empresas a divulgar sus emisiones.

"The performance review made him reconsider his approach."
→  La revisión le llevó a reconsiderar su enfoque.

GET + objeto + TO + infinitivo (causativa de persuasión o convencimiento):
"She managed to get the client to sign the revised terms."
→  Consiguió que el cliente firmara los términos revisados. (hubo que persuadirle)

"How did you get the board to approve such a large investment?"
→  ¿Cómo conseguiste que el consejo aprobara una inversión tan grande?

RESUMEN:
HAVE + obj + pp    → encargar / organizar (sin agente concreto)
GET + obj + pp     → conseguir / lograr (más esfuerzo, informal)
MAKE + obj + inf   → obligar / provocar (resultado o presión)
GET + obj + to-inf → persuadir / convencer (negociación)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN EL ENTORNO PROFESIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gestión y delegación:
"We have our financial reports audited annually by an independent firm."
"I'll get the design team to prepare three options for the client presentation."
"Can you have the venue confirmed by Thursday?"

Servicios y proveedores:
"We had the office space redesigned to accommodate the new team."
"They are having their entire IT infrastructure migrated to the cloud."

Situaciones no deseadas (pasivas causativas involuntarias):
"We had €50,000 in stock stolen during the warehouse break-in."
"The CEO had his email account compromised in the breach."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con la forma causativa correcta:

1. "Before the merger, the company _______ its assets _______ (value) by an independent advisor."
   → had / valued

2. "We need to _______ the contract _______ (translate) into three languages."
   → have / translated

3. "She finally _______ the client _______ (agree) to the revised payment schedule." [persuasión]
   → got / to agree

4. "The new compliance rules _______ all suppliers _______ (submit) quarterly reports." [obligación]
   → make / submit`;

// ─────────────────────────────────────────────────────────────────────────────
// L4.5 — The Passive in Professional Writing — Integrated Use
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L45 = `Esta lección integra todos los usos avanzados de la pasiva en textos profesionales reales: informes, comunicados, correos y presentaciones.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MAPA DE USOS — PASIVA AVANZADA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PASIVA BÁSICA (B1) — foco en el objeto, agente secundario:
"The report was submitted on time."
"The contract has been signed by both parties."

IT + PASIVA IMPERSONAL — reportar sin atribuir fuente:
"It is expected that demand will increase in Q3."
"It was reported that the figures had been revised."

SUJETO + PASIVA + INFINITIVO — versión directa de la impersonal:
"Demand is expected to increase in Q3."
"The figures were reported to have been revised."

PASIVA CON MODALES — obligación, posibilidad, consejo en voz pasiva:
"This information must be treated as confidential."
"The proposal should be reviewed before submission."
"All decisions can be appealed within 30 days."

CAUSATIVA (HAVE/GET + obj + pp) — delegar o encargar:
"We will have the audit completed before the end of the quarter."
"Can you get the figures verified by the finance team?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASIVA CON MODALES — DETALLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los modales se combinan con BE + participio en voz pasiva:

OBLIGACIÓN:
"All invoices must be approved by the finance director before payment."
"Confidential data should be encrypted at all times."

POSIBILIDAD / PERMISO:
"The deadline can be extended in exceptional circumstances."
"Alternative solutions may be considered if the primary approach proves unviable."

CONSEJO / RECOMENDACIÓN:
"The contract should be reviewed by legal counsel before signing."
"All staff should be briefed on the new policy by end of week."

MODAL PERFECTO (sobre el pasado):
"The error should have been detected during the testing phase."
"The client should have been notified before the change was implemented."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENARIO 1 — COMUNICADO INTERNO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"It has been decided that all project proposals must be submitted through the new centralised platform with immediate effect. Documents that do not meet the required format will not be accepted. It is expected that all teams will have completed the onboarding process by 15 July.

All outstanding proposals should be resubmitted by that date. Any questions can be directed to the Project Management Office."

Análisis de estructuras:
— IT HAS BEEN DECIDED → pasiva impersonal (decisión sin atribuir responsable individual)
— MUST BE SUBMITTED → pasiva con modal de obligación
— WILL NOT BE ACCEPTED → pasiva con modal + negación
— IT IS EXPECTED → pasiva impersonal para expectativas
— SHOULD BE RESUBMITTED → pasiva con modal de recomendación
— CAN BE DIRECTED → pasiva con modal de posibilidad


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENARIO 2 — EXTRACTO DE INFORME EJECUTIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"The external audit has been completed and the findings are summarised below. Several process inefficiencies were identified that are believed to have contributed to the Q2 underperformance. It is recommended that these be addressed before the next reporting period.

The IT infrastructure is currently being upgraded. Once completed, response times are expected to improve significantly. We have also had our data security protocols reviewed by an independent cybersecurity firm, whose recommendations are being implemented."

Análisis:
— HAS BEEN COMPLETED → present perfect pasivo (hecho reciente completado)
— ARE SUMMARISED → presente pasivo
— WERE IDENTIFIED → pasado pasivo
— ARE BELIEVED TO HAVE CONTRIBUTED → estructura B (sujeto + pasiva + to have + pp)
— IT IS RECOMMENDED THAT → pasiva impersonal + subjuntivo formal
— IS BEING UPGRADED → presente continuo pasivo
— ARE EXPECTED TO IMPROVE → estructura B (expectativa futura)
— HAD OUR PROTOCOLS REVIEWED → causativa (encargamos la revisión)
— ARE BEING IMPLEMENTED → presente continuo pasivo


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TONO Y REGISTRO — REGLAS PRÁCTICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USAR PASIVA en escritura profesional formal para:
✓ Eliminar el sujeto cuando no es relevante o es obvio.
✓ Mantener un tono objetivo e institucional.
✓ Reportar sin comprometer la veracidad (impersonal).
✓ Dar instrucciones sin señalar a nadie en concreto.
✓ Describir procesos o procedimientos estándar.

EVITAR EXCESO DE PASIVA cuando:
✗ La frase activa es más clara y directa.
✗ El agente es importante y debería mencionarse.
✗ Produce frases largas y difíciles de leer.

REGLA PRÁCTICA: Si eliminar el agente no mejora la claridad ni el registro, usa activa.
"The team will deliver the report by Friday." → más directo que "The report will be delivered by the team by Friday."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA INTEGRADA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transforma al tipo de pasiva indicado:

1. "Everyone expects sales to recover in Q4." [IT + pasiva impersonal]
   → "It _______ that sales _______."

2. "People think the CEO is planning to step down." [sujeto + pasiva + infinitivo]
   → "The CEO _______."

3. "You must submit all expense claims within 30 days." [pasiva con modal]
   → "All expense claims _______."

4. "An independent firm checked our security systems." [causativa — nosotros lo encargamos]
   → "We had _______."

Respuestas:
1. It is expected that sales will recover in Q4.
2. The CEO is thought to be planning to step down.
3. All expense claims must be submitted within 30 days.
4. We had our security systems checked by an independent firm.`;

// ─────────────────────────────────────────────────────────────────────────────
// L4.6 — Behind the Scenes — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L46 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — PASIVA IMPERSONAL CON IT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Transforma a pasiva impersonal con IT:
   "People believe the company will restructure in the new year."
   → "It _______ that the company _______."
   → It is believed that the company will restructure in the new year.

2. ¿Cuál es la función principal de "It is alleged that..."?
   → Reportar una afirmación sin confirmar su veracidad ni atribuirla a una fuente específica.

3. ¿Qué diferencia hay entre "It is said" e "It was said"?
   → "It is said" = se dice actualmente.
     "It was said" = se dijo en el pasado (el reporte ocurrió antes).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — SUJETO + PASIVA + INFINITIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. Transforma usando la Estructura B:
   "It is reported that the executive has resigned."
   → "The executive _______."
   → The executive is reported to have resigned.

5. ¿Cuándo se usa TO HAVE + participio en lugar de TO + infinitivo?
   → Cuando el hecho reportado ocurrió ANTES del momento del verbo principal.
     "She is said to have left the company last year." (dejó antes)
     "She is expected to leave next month." (dejará después)

6. Identifica el error:
   "The funds are believed to transferred to an offshore account."
   → Falta HAVE BEEN: "The funds are believed to HAVE BEEN transferred..."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — CAUSATIVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. "We _______ the office _______ (redecorate) before the client visit."
   Completa con la forma causativa correcta:
   → had / redecorated

8. ¿Qué diferencia hay entre HAVE y GET en la causativa?
   → HAVE = encargar / organizar (neutro, formal).
     GET = conseguir / lograr (implica más esfuerzo o negociación, ligeramente informal).

9. "The new legislation will _______ all companies _______ their emissions annually."
   ¿Qué estructura causativa es correcta? [obligación de ley]
   A: have / disclose   B: make / disclose   C: get / to disclose   D: have / to disclose
   → B (MAKE + objeto + infinitivo sin TO para obligación o resultado)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — PASIVA CON MODALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. Transforma a pasiva:
    "You must encrypt all confidential files before transmission."
    → "All confidential files _______."
    → All confidential files must be encrypted before transmission.

11. "The error should _______ during the QA process." [modal perfecto pasivo]
    → should have been detected / identified / caught

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE E — TEXTO INTEGRADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. Lee el extracto e identifica la estructura de la frase en cursiva:

"Following the incident, an independent review was commissioned. The system failure is believed to have originated in a third-party integration. It is recommended that all external integrations be audited before the platform is relaunched."

¿Qué estructura usa "is believed to have originated"?
→ Sujeto + pasiva + TO HAVE + participio (Estructura B).
  Indica que el origen ocurrió antes del momento actual del reporte.
  Equivalente a: "It is believed that the failure originated in a third-party integration."`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U4 — 12 preguntas × 1 punto. passingScore 80 → mínimo 10/12.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U4 = {
  title:        'Behind the Scenes — Unit 4 Assessment',
  description:  'Evalúa el dominio de la pasiva avanzada: pasiva impersonal con IT, Estructura B (sujeto + pasiva + infinitivo), pasiva con modales y la construcción causativa en contextos profesionales.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '"_______ believed that the company will announce the merger next week." ¿Qué inicio de pasiva impersonal es correcto?',
      options:      ['They are', 'It is', 'There is', 'This is'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Cuál es la función principal de la pasiva impersonal en la escritura profesional?',
      options:      [
        'Identificar claramente quién es responsable de una acción.',
        'Reportar información sin atribuirla a una fuente específica o comprometerse con su veracidad.',
        'Expresar una acción que está ocurriendo en este momento.',
        'Indicar que una acción fue completada antes de otra acción pasada.',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"The board is expected _______ a decision by the end of the month." ¿Qué forma es correcta?',
      options:      ['to reach', 'to have reached', 'reaching', 'to be reaching'],
      correctIndex: 0,
      points:       1,
    },
    {
      text:         '"The director is alleged _______ the expense reports." ¿Qué forma es correcta para un hecho ocurrido en el pasado?',
      options:      ['to falsify', 'to be falsifying', 'to have falsified', 'falsifying'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         'Identifica la transformación correcta de "It is reported that the CEO has resigned":',
      options:      [
        'The CEO is reported to resign.',
        'The CEO is reported to have resigned.',
        'The CEO was reported to resign.',
        'The CEO is reporting to have resigned.',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"All submissions _______ by the finance director before processing." ¿Qué pasiva modal es correcta?',
      options:      ['must approve', 'must be approved', 'should have approved', 'are must approved'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"The error _______ during the testing phase, but it wasn\'t." ¿Qué modal perfecto pasivo es correcto?',
      options:      ['should detect', 'should be detected', 'should have been detected', 'must be detecting'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"We _______ the contract _______ by our legal team before signing." ¿Qué forma causativa es correcta?',
      options:      ['made / review', 'had / reviewed', 'got / to review', 'had / to review'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Qué diferencia hay entre HAVE y MAKE en la construcción causativa?',
      options:      [
        'No hay diferencia, son intercambiables.',
        'HAVE = encargar que alguien haga algo; MAKE = obligar o provocar que ocurra.',
        'MAKE = encargar que alguien haga algo; HAVE = obligar o provocar.',
        'HAVE es informal y MAKE es formal.',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"She got the client _______ the revised terms." ¿Qué forma sigue a GET + objeto?',
      options:      ['accept', 'to accept', 'accepted', 'accepting'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Cuál de estas frases usa correctamente la causativa para una experiencia no deseada?',
      options:      [
        'We had our data stolen in a cyberattack.',
        'We had stolen our data in a cyberattack.',
        'We made our data stolen in a cyberattack.',
        'We got stolen our data in a cyberattack.',
      ],
      correctIndex: 0,
      points:       1,
    },
    {
      text:         '"It _______ that the new regulation will significantly impact smaller businesses." ¿Qué forma completa correctamente la pasiva impersonal?',
      options:      ['is estimating', 'has estimated', 'is estimated', 'was estimating'],
      correctIndex: 2,
      points:       1,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Seed
// ─────────────────────────────────────────────────────────────────────────────
module.exports = async (courseId) => {
  const unit = await upsert(Unit, { courseId, order: 4 }, {
    courseId,
    title:            'Behind the Scenes',
    order:            4,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L4.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'Reporting Without a Source — Impersonal Passive',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L41,
      duration: 20,
      order:    1,
    }),

    // L4.2 — VIDEO
    // Canal recomendado: BBC Learning English / English with Lucy
    // Búsqueda: "advanced passive voice impersonal B2 English professional"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: The Language of Reports',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-b2-u4-l2',
      duration: 10,
      order:    2,
    }),

    // L4.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'Two Structures, Same Meaning — Subject Passive with Infinitive',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L43,
      duration: 20,
      order:    3,
    }),

    // L4.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Getting Things Done — The Causative',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L44,
      duration: 20,
      order:    4,
    }),

    // L4.5 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'The Passive in Professional Writing — Integrated Use',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L45,
      duration: 15,
      order:    5,
    }),

    // L4.6 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 6 }, {
      unitId:   unit._id,
      courseId,
      title:    'Behind the Scenes — Quiz',
      type:     LESSON_TYPES.QUIZ,
      content:  CONTENT_L46,
      duration: 25,
      order:    6,
    }),

  ]);

  await upsert(Assessment, { unitId: unit._id }, {
    unitId:   unit._id,
    courseId,
    ...ASSESSMENT_U4,
  });
};
