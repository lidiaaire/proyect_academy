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
// L6.1 — Writing to Persuade — The Full B2 Toolkit on the Page
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L61 = `Esta unidad consolida las cinco competencias trabajadas en el nivel B2. No introduce gramática nueva — integra lo que ya dominas en los contextos profesionales de mayor exigencia: la escritura persuasiva, los informes ejecutivos, las negociaciones y las presentaciones de alto nivel.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAS CINCO COMPETENCIAS B2 — REPASO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UNIDAD 1 — CONDICIONALES AVANZADOS
Type 3: If we had invested earlier, we would have captured the market.
Mixtos: If the team were more experienced, they would have handled it better.
Conectores: provided that, unless, on condition that, had we known...

UNIDAD 2 — MODALES DE DEDUCCIÓN, ESPECULACIÓN Y EVALUACIÓN
Deducción: must have / can't have
Especulación: might have / may have / could have
Evaluación: should have / needn't have / could have (oportunidad no aprovechada)

UNIDAD 3 — ESTRUCTURAS DE ÉNFASIS
IT-cleft: It was the lack of data that led to the decision.
WHAT-cleft: What we need is a clearer framework.
Inversión: Never have we faced such a complex challenge. / Not only did they miss the target, but they also exceeded the budget.

UNIDAD 4 — PASIVA AVANZADA Y CAUSATIVA
Impersonal: It is widely believed that / It is expected that...
Estructura B: The CEO is said to have resigned. / Losses are estimated to amount to...
Causativa: We had the contract reviewed. / The legislation will make companies disclose...

UNIDAD 5 — DISCOURSE MARKERS, HEDGING Y CONCESIÓN
Adición: furthermore, moreover, in addition
Contraste: however, nevertheless, on the other hand
Concesión: although, despite, admittedly, granted, that said
Hedging: suggest, appear, tend to, may, approximately, it could be argued that


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UN TEXTO PERSUASIVO ANOTADO — PROPUESTA EJECUTIVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lee el siguiente extracto de una propuesta ejecutiva. Los corchetes identifican qué competencia B2 usa cada fragmento:

---

"It is widely acknowledged that our current market position, while stable, is unlikely to support the growth targets set for the next three years. [PASIVA IMPERSONAL] What the data suggests is a structural shift in customer expectations that our existing product line is not equipped to address. [WHAT-CLEFT + HEDGING]

Had we acted on the early signals in 2022, we would be in a significantly stronger competitive position today. [CONDICIONAL MIXTO A] Admittedly, the investment required at that stage would have been considerable. [CONCESIÓN] Nevertheless, the cost of inaction — measured in market share lost — has proven to be far greater. [CONTRASTE]

It is therefore proposed that we approve the attached three-year transformation plan on condition that the full board endorses the revised budget by end of Q1. [PASIVA IMPERSONAL + CONECTOR CONDICIONAL] The plan has been developed with input from all divisional heads and has been independently reviewed by our strategy advisors. [PASIVA BÁSICA]

Not only does this plan address our immediate competitive challenges, but it also positions us for sustained growth in the emerging markets identified in the accompanying analysis. [INVERSIÓN — NOT ONLY] What is more, it is estimated that, if implemented as proposed, the plan could generate returns of approximately 22% within three years. [ADICIÓN + PASIVA + CONDICIONAL TYPE 1 + HEDGING]

Under no circumstances should this opportunity be allowed to pass without a clear strategic response. The question is not whether we can afford to act — it is whether we can afford not to." [INVERSIÓN + IT-CLEFT]

---

Observa cómo cada estructura hace un trabajo concreto:
— La PASIVA IMPERSONAL proyecta objetividad institucional.
— Las CLEFT SENTENCES dirigen la atención hacia los argumentos clave.
— Los CONDICIONALES exploran consecuencias y hubieran podido ser.
— Los MODALES calibran el nivel de certeza de las afirmaciones.
— La CONCESIÓN anticipa las objeciones y las absorbe.
— Los DISCOURSE MARKERS guían el razonamiento paso a paso.
— El HEDGING calibra la precisión sin debilitar el argumento.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITERIOS DE UN TEXTO B2 DE ALTA CALIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PRECISIÓN: las afirmaciones tienen el nivel de certeza que la evidencia respalda (hedging).
2. COHERENCIA: el lector nunca se pierde — los discourse markers marcan cada transición.
3. PERSUASIÓN: las objeciones se reconocen (concesión) antes de ser superadas.
4. ÉNFASIS: los puntos clave están en primer plano (cleft sentences, inversión).
5. REGISTRO: la pasiva y los conectores formales sostienen el tono institucional.
6. PROFUNDIDAD: los condicionales exploran causas, consecuencias y alternativas.

Un texto que reúne estos seis criterios opera con plena eficacia al nivel B2.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analiza este párrafo e identifica qué estructura B2 usa cada fragmento marcado:

"[A] It is generally understood that staff retention is closely linked to company culture. [B] What our exit interviews reveal, however, is a more specific issue: a lack of career progression clarity. [C] Had this been addressed two years ago, we might have retained several high-performing individuals who have since joined competitors. [D] Admittedly, implementing a structured development programme requires investment. [E] Nevertheless, it is our view that the cost is justified. [F] It is therefore recommended that HR develop and pilot a Career Framework by Q3."

Respuestas:
A → Pasiva impersonal con hedging (generally)
B → WHAT-cleft + contraste (however)
C → Condicional mixto A (pasado → presente/pasado)
D → Concesión directa (Admittedly)
E → Contraste (Nevertheless) + pasiva con modal implícito
F → Pasiva impersonal + consecuencia (therefore)`;

// ─────────────────────────────────────────────────────────────────────────────
// L6.3 — The Language of Reports and Proposals
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L63 = `Los informes y las propuestas son los géneros escritos más exigentes del inglés profesional. Requieren precisión, objetividad, cohesión y la capacidad de guiar al lector desde los datos hasta la recomendación. Esta lección te da las frases y estructuras que articulan cada sección de un documento formal.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN 1 — INTRODUCCIÓN Y CONTEXTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para presentar el propósito del documento:
"This report sets out to examine..."
"The purpose of this proposal is to..."
"This document provides an analysis of..."
"The following report was commissioned in response to..."

Para establecer el contexto con objetividad (pasiva impersonal):
"It has been noted that..."
"It is widely recognised that..."
"It has recently been brought to our attention that..."
"Concerns have been raised regarding..."

Para delimitar el alcance:
"This report focuses specifically on..."
"The analysis is based on data collected between..."
"It is worth noting that this report does not address..."
"The findings presented here should be read in conjunction with..."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN 2 — PRESENTACIÓN DE HALLAZGOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para reportar datos con hedging apropiado:
"The data suggests that..."
"Analysis indicates a clear trend towards..."
"It appears that the decline began in..."
"The figures point to a significant shift in..."
"What the results demonstrate is..."

Para cuantificar con precisión:
"Sales increased by approximately 14% over the period."
"The majority of respondents (roughly 68%) indicated..."
"In most cases, the issue manifests as..."
"Losses are estimated to amount to in the region of €2 million."

Para contrastar hallazgos:
"While [X] showed improvement, [Y] continued to decline."
"In contrast to Q2, Q3 figures revealed..."
"The domestic market performed well; however, international performance was mixed."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN 3 — ANÁLISIS DE CAUSAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para identificar causas con distintos niveles de certeza:

CERTEZA ALTA:
"It was the supply chain disruption that triggered the initial shortfall." [IT-cleft]
"The system failure must have originated in the third-party integration." [must have]

CERTEZA MEDIA:
"The decline may have been caused by a combination of factors."
"It is believed that market saturation has played a significant role."
"The underperformance appears to be linked to the delays in product development."

POSIBILIDAD:
"It is possible that external market conditions contributed to the outcome."
"There may have been internal communication issues that compounded the problem."

Para explorar alternativas pasadas (condicional Type 3):
"Had the risk assessment been conducted earlier, the impact could have been mitigated."
"If the team had been briefed on the revised specifications, the errors might have been avoided."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN 4 — RECOMENDACIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para formular recomendaciones en registro formal (pasiva con modal):
"It is recommended that..."
"It is proposed that..."
"It is suggested that the following steps be taken..."
"All contracts should be reviewed before the end of Q2."
"Under no circumstances should this data be shared externally."

Para establecer condiciones (condicionales avanzados):
"The proposed plan should be adopted provided that full board approval is secured."
"These measures will take effect on condition that the budget is confirmed by March."
"Unless the current trend is reversed, further restructuring may become necessary."

Para expresar urgencia sin perder objetividad:
"It is strongly recommended that..."
"What is required is immediate action on..."
"Failure to act on these findings could result in..."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN 5 — CONCLUSIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para resumir y concluir:
"In conclusion, the evidence presented in this report suggests that..."
"To summarise, the key findings point to..."
"On balance, the proposed course of action represents the most viable path forward."
"Overall, while challenges remain, there are grounds for cautious optimism."
"Taking everything into account, it is the view of this report that..."

Para cerrar con una llamada a la acción:
"It is therefore recommended that the board approve..."
"What is now needed is a clear decision on..."
"The time for action is now — the cost of further delay is too high to justify."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODELO COMPLETO — ESTRUCTURA DE UN INFORME EJECUTIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. EXECUTIVE SUMMARY (1 párrafo)
   → Propósito + hallazgo principal + recomendación clave

2. BACKGROUND / CONTEXT
   → "This report was commissioned following..."
   → Pasiva impersonal para contextualizar sin atribuir

3. FINDINGS
   → Datos con hedging + discourse markers para guiar al lector

4. ANALYSIS
   → Causas (IT-cleft, modales, condicionales) + concesión de factores externos

5. RECOMMENDATIONS
   → Pasiva modal + condicionales para establecer condiciones

6. CONCLUSION
   → Discourse markers de conclusión + llamada a la acción


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Escribe una frase apropiada para cada sección usando la estructura indicada:

1. INTRODUCCIÓN — pasiva impersonal para presentar el contexto:
   "It _______ that employee turnover has increased significantly over the past 18 months."

2. HALLAZGO — hedging para reportar un dato:
   "Exit interviews _______ that the primary driver is a lack of career development opportunities."

3. ANÁLISIS — IT-cleft para identificar la causa principal:
   "It _______ the absence of a structured development programme _______ contributed most significantly to this trend."

4. RECOMENDACIÓN — pasiva con modal:
   "A Career Framework _______ developed and piloted in all divisions before the end of Q3."

5. CONCLUSIÓN — discourse marker de consecuencia:
   "_______, it is recommended that the board approve the proposed HR initiative without further delay."

Respuestas:
1. It has been noted / It is widely understood
2. suggest / indicate / reveal
3. It was / that has
4. should be
5. Therefore / Consequently / For this reason`;

// ─────────────────────────────────────────────────────────────────────────────
// L6.4 — Spoken English at B2 — Meetings, Negotiations and Presentations
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L64 = `Las estructuras B2 no son solo para la escritura. Esta lección te muestra cómo las mismas competencias —condicionales, modales, énfasis, hedging, concesión— se despliegan en el inglés oral de alto nivel: reuniones de dirección, negociaciones comerciales y presentaciones ante audiencias exigentes.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REUNIONES — ESTRUCTURAS DE ALTO REGISTRO ORAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PLANTEAR UN PROBLEMA CON PRECISIÓN (hedging + modales):
"I think there may be an issue with the current timeline that we should address today."
"It would appear that the integration is taking longer than originally estimated."
"The data seems to suggest we're losing ground in the mid-market segment."

INTRODUCIR UN PUNTO CONTRASTANTE (contraste + concesión):
"I take your point. That said, the risk of moving too quickly seems greater than the risk of waiting."
"Granted, the initial figures look promising. Nevertheless, I'd want to see Q2 data before committing."
"I accept that — though I'd argue that the implementation challenges are being underestimated."

DESTACAR UN PUNTO CLAVE (cleft sentences en oral):
"What concerns me most here is the lack of a contingency plan."
"It's the timeline, not the budget, that I think needs to be revisited."
"What we need to decide today is whether to proceed or pause."

EXPLORAR ALTERNATIVAS (condicionales):
"If we were to delay the launch by one quarter, what impact would that have on the annual targets?"
"Had we known about this earlier, we could have structured the deal differently."
"Supposing the client pushes back on price — what's our fallback position?"

FORMULAR UNA RECOMENDACIÓN CALIBRADA:
"I would suggest that we commission an independent review before making a final decision."
"It might be worth exploring a phased approach, provided we can get sign-off by the end of the week."
"Under no circumstances should we commit to this without legal approval."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEGOCIACIONES — EL INGLÉS DE LOS ACUERDOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ESTABLECER POSICIÓN CON FIRMEZA Y DIPLOMACIA:
"What we are looking for is a guaranteed delivery window, not an estimate."
"It is the quality assurance process that we are most concerned about — price is secondary."
"I should make it clear that, under no circumstances, would we accept a unilateral price revision."

HACER UNA CONCESIÓN ESTRATÉGICA:
"I acknowledge that your position on the timeline is driven by genuine operational constraints.
 That said, we do need a firm commitment date — not a range."
"Admittedly, we may have underestimated the complexity on our side as well.
 Nevertheless, the original terms still reflect what was agreed at the outset."

PROPONER UNA SOLUCIÓN CON CONDICIONES:
"We would be prepared to extend the payment terms to 60 days on condition that the delivery guarantee is written into the contract."
"Provided that you can confirm the revised specifications by Thursday, we are willing to proceed on the original price."
"We could consider a phased payment structure, as long as the first milestone is clearly defined."

RECHAZAR UNA PROPUESTA CON ELEGANCIA:
"I'm afraid that's not something we're in a position to accept as it stands. What I could suggest, however, is..."
"While I understand the rationale, I don't think that approach would work for us — could we explore an alternative?"
"That said, we remain committed to finding a workable solution. What would a revised proposal look like from your side?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRESENTACIONES — IMPACTO Y ESTRUCTURA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

APERTURA CON IMPACTO (inversión + cleft):
"Never before has the case for transformation been more compelling."
"What I want to leave you with today is not a problem — it's an opportunity."
"It is not the size of the challenge that should concern us — it's whether we are equipped to meet it."

TRANSICIÓN ENTRE SECCIONES (discourse markers orales):
"Having looked at the data, let me now turn to what it means in practice."
"That brings me to the second point — and this is where it gets interesting."
"So much for the diagnosis. What about the solution?"

INVOLUCRAR A LA AUDIENCIA (preguntas con condicionales):
"What would you do if you discovered that 30% of your customer base was considering switching?"
"Supposing we had acted on this trend 18 months ago — where would we be today?"

CIERRE (concesión + reafirmación + call to action):
"I accept that the path ahead is not without risk. Nevertheless, I would argue that the greater risk lies in doing nothing.
 What I am asking for today is not a guarantee — it is a commitment to take the next step together."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIFERENCIAS CLAVE — ORAL VS. ESCRITO AL NIVEL B2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ESCRITO:                          ORAL:
furthermore                  →    what is more / and on top of that
it is believed that          →    I think / it seems to me that
it is recommended that       →    I would suggest / my recommendation would be
nevertheless                 →    that said / even so
under no circumstances       →    (se usa también en oral formal — sin cambio)
admittedly                   →    I'll grant you that / fair enough, but...
it would appear that         →    it looks like / it seems like (más informal)
had we done this (inversión) →    if we had done this (más frecuente en oral)

Las inversiones y las cleft sentences también aparecen en el inglés oral formal, especialmente en presentaciones y discursos preparados. En conversación espontánea, sus equivalentes más directos son más frecuentes.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reescribe estas frases en un registro oral formal apropiado para una reunión de dirección:

1. "The data proves that the strategy has failed." [añade hedging]
2. "We reject your proposal on price." [reformula con diplomacia y apertura]
3. "If we had started sooner we would be done now." [mantén — ya es oral natural]
4. "This is a very important decision." [reformula con énfasis B2]

Respuestas posibles:
1. "The data suggests that the strategy may not have delivered the expected results."
2. "I'm afraid the pricing, as it stands, isn't something we're able to accept. That said, we're open to exploring alternatives."
3. "If we had started sooner, we would be done now." ✓ (natural y correcto)
4. "What we need to recognise is the significance of the decision in front of us." / "It is this decision — more than any other — that will shape our direction for the next three years."`;

// ─────────────────────────────────────────────────────────────────────────────
// L6.5 — From B2 to C1 — What Advanced Fluency Looks Like
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L65 = `Has llegado al final del nivel B2. Esta lección cierra el curso con una perspectiva clara: qué has consolidado, cuál es la diferencia real entre B2 y C1, y qué señales indican que estás listo para dar el siguiente paso.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUÉ SIGNIFICA OPERAR AL NIVEL B2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El Marco Europeo de Referencia define B2 así:

"Can understand the main ideas of complex text on both concrete and abstract topics,
 including technical discussions in their field of specialisation.
 Can interact with a degree of fluency and spontaneity that makes regular interaction
 with native speakers quite possible without strain for either party.
 Can produce clear, detailed text on a wide range of subjects and explain a viewpoint
 on a topical issue giving the advantages and disadvantages of various options."

En términos prácticos, al final de Working English debes ser capaz de:

✓ Escribir informes, propuestas y correos formales con precisión y cohesión.
✓ Presentar y defender una posición argumentando con evidencia y reconociendo objeciones.
✓ Participar en reuniones y negociaciones complejas con fluidez y registro apropiado.
✓ Deducir, especular y evaluar usando el sistema modal completo.
✓ Destacar información clave con cleft sentences e inversión.
✓ Calibrar la certeza de tus afirmaciones mediante hedging.
✓ Guiar al lector u oyente con un sistema cohesivo de discourse markers.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
B2 VS. C1 — LAS DIFERENCIAS REALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La diferencia entre B2 y C1 no es principalmente gramatical — es de fluidez, matiz y rango.

GRAMÁTICA:
B2: dominas las estructuras avanzadas de forma deliberada.
C1: las produces de forma automática, sin esfuerzo consciente.

VOCABULARIO:
B2: amplio rango léxico; recurres a circunloquios ocasionalmente.
C1: acceso a vocabulario preciso, idiomático y de registro elevado sin pausa.

COHESIÓN:
B2: utilizas discourse markers correctamente; el texto fluye bien.
C1: la cohesión es natural e invisible — el texto no parece construido.

MATIZ:
B2: distingues entre certeza y posibilidad; hedging deliberado.
C1: el matiz es instintivo; adaptas el registro con precisión según el interlocutor.

COMPRENSIÓN:
B2: entiendes textos complejos con esfuerzo; puedes perder matices en audio rápido.
C1: comprendes textos implícitos, ironía, registro y variedad dialectal con facilidad.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAS SEÑALES DE QUE ESTÁS EN LA FRONTERA B2-C1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estás en la transición B2→C1 cuando:

— Produces las estructuras B2 sin consultarlas conscientemente.
— Reconoces cuándo una frase suena poco natural antes de articularla.
— Lees textos económicos, legales o periodísticos en inglés con comprensión sólida.
— Ajustas automáticamente el registro (formal/informal, directo/hedged) según el contexto.
— Cuando buscas una palabra, el término que encuentras es preciso — no un sinónimo aproximado.
— Aprecias la diferencia entre "however" y "nevertheless" sin tener que pensarlo.
— El inglés empieza a ser una herramienta, no un proceso de traducción.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUÉ VIENE EN C1 — ANTICIPACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En C1 las estructuras gramaticales nuevas son menos numerosas — el énfasis se desplaza hacia:

LÉXICO AVANZADO:
Colocaciones precisas, phrasal verbs de registro formal, expresiones idiomáticas en contexto, vocabulario especializado por campo.

GRAMÁTICA DE MATIZ:
Subjuntivo formal (it is essential that this BE reviewed), wish/if only en todos los tiempos, estructuras de fronting y tematización, inversión en contextos más amplios.

PRAGMÁTICA Y REGISTRO:
Implicaturas (lo que se comunica sin decirse), ironía y distanciamiento, adaptación radical del registro, humor y sofisticación cultural.

FLUIDEZ Y AUTOMATICIDAD:
El objetivo C1 no es aprender más reglas — es integrar las que ya conoces hasta que su uso sea tan natural que no requiera esfuerzo deliberado.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CIERRE DEL NIVEL B2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Working English ha recorrido seis unidades:

1. WHAT COULD HAVE BEEN — el sistema condicional completo
2. READING BETWEEN THE LINES — los modales de deducción y evaluación
3. MAKING YOUR POINT — las estructuras de énfasis avanzado
4. BEHIND THE SCENES — la pasiva profesional y la causativa
5. SHAPING YOUR ARGUMENT — los discourse markers y el hedging
6. THE BIGGER PICTURE — integración en contextos de alto nivel

Lo que has construido no es una colección de reglas — es un sistema de comunicación. Cada estructura tiene una función específica, y la diferencia entre B2 y los niveles inferiores es precisamente esa: no cuántas reglas conoces, sino si sabes qué herramienta usar en cada momento y por qué.

Eso es lo que significa escribir y hablar al nivel B2.`;

// ─────────────────────────────────────────────────────────────────────────────
// L6.6 — The Bigger Picture — Final Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L66 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — CONDICIONALES (UNIDAD 1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. "If we _______ the risk assessment earlier, we _______ the problem in time."
   [Type 3 — condición pasada, resultado pasado]
   → had conducted / would have identified

2. "If the team _______ more experienced, they _______ the crisis better last month."
   [Mixto B — condición presente, resultado pasado]
   → were / would have handled

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — MODALES (UNIDAD 2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. "The system went down right after the patch was applied. The patch _______ a conflict."
   [Deducción con alta certeza — pasado]
   → must have caused

4. "She submitted the proposal without reading the brief. She _______ the guidelines."
   [Deducción negativa — pasado]
   → can't have read

5. "We had four weeks to prepare and didn't use the time well. We _______ better."
   [Oportunidad no aprovechada]
   → could have done / could have prepared

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — ESTRUCTURAS DE ÉNFASIS (UNIDAD 3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. Transforma usando una IT-cleft para destacar "the communication breakdown":
   "The communication breakdown caused the project to fail."
   → "It was _______ THAT _______."
   → It was the communication breakdown THAT caused the project to fail.

7. Transforma usando inversión con NOT ONLY:
   "They exceeded the budget and missed the deadline."
   → "Not only _______, but _______."
   → Not only did they exceed the budget, but they also missed the deadline.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — PASIVA AVANZADA (UNIDAD 4)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. Transforma a Estructura B (sujeto + pasiva + infinitivo):
   "It is reported that the company has entered administration."
   → "The company _______."
   → The company is reported to have entered administration.

9. Completa la causativa:
   "Before the summit, we _______ all key documents _______ by our legal team."
   → had / reviewed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE E — DISCOURSE MARKERS Y HEDGING (UNIDAD 5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. Elige el marcador más adecuado:
    "The pilot results were mixed. _______, early feedback from end users has been encouraging."
    A: Furthermore  B: In contrast  C: That said  D: As a result
    → C (That said — concesión que introduce la perspectiva positiva)

11. Identifica el error de hedging:
    "The data definitely proves that customer satisfaction has collapsed."
    → "Definitely proves" es demasiado categórico para evidencia basada en datos.
      Corrección: "The data suggests that customer satisfaction has declined significantly."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE F — TEXTO INTEGRADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lee el párrafo e identifica las estructuras marcadas:

"It is widely believed that the current model is no longer fit for purpose. [A] What the data reveals is a consistent decline over four consecutive quarters. [B] Had the board acted on the early warning signs, the situation might have been very different. [C] Admittedly, the market environment has been challenging. [D] Nevertheless, it is our competitors who have managed to grow despite those same conditions. [E] It is therefore recommended that a strategic review be commissioned without delay."

12. Identifica la estructura B2 de cada fragmento marcado:

A → Pasiva impersonal (It is widely believed that)
B → WHAT-cleft (What the data reveals is)
C → Condicional mixto / Type 3 (Had the board acted — inversión + might have been)
D → Concesión directa (Admittedly)
E → Contraste (Nevertheless) + IT-cleft (it is our competitors WHO — énfasis en el agente)
+ Pasiva impersonal modal (It is therefore recommended that) + consecuencia (therefore)`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U6 — 12 preguntas × 1 punto. passingScore 80 → mínimo 10/12.
// Assessment de cierre: una pregunta por cada competencia B2 + integración.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U6 = {
  title:        'The Bigger Picture — B2 Final Assessment',
  description:  'Assessment de cierre del nivel B2. Evalúa la integración de las cinco competencias avanzadas del curso: condicionales, modales, énfasis, pasiva avanzada y discourse markers en contextos profesionales de alto nivel.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '"If the merger _______ announced earlier, the market reaction _______ more positive." [Type 3]',
      options:      [
        'was announced / would be',
        'had been announced / would have been',
        'has been announced / would have been',
        'had been announced / would be',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"If our onboarding process _______ more streamlined, we _______ far fewer clients in Q1." [Mixto B — condición presente, resultado pasado]',
      options:      [
        'had been / would lose',
        'were / would have lost',
        'had been / would have lost',
        'were / would lose',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"The meeting room is empty and the presentation screen is still on. They _______ just finished the session." [deducción con alta certeza — pasado]',
      options:      ['might have', 'should have', 'must have', 'can\'t have'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"She delivered the keynote without any notes and handled every question expertly. She _______ presented at this level before." [deducción negativa — pasado]',
      options:      ['must have never', 'can\'t have never', 'can\'t never have', 'must never have'],
      correctIndex: 3,
      points:       1,
    },
    {
      text:         '¿Cuál es la IT-cleft correcta para destacar "the lack of a contingency plan"?',
      options:      [
        'What was the lack of a contingency plan that caused the failure.',
        'It was the lack of a contingency plan that caused the failure.',
        'It was the lack of a contingency plan caused the failure.',
        'There was the lack of a contingency plan that caused the failure.',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"Not only _______ the deadline, but they also significantly exceeded the budget."',
      options:      [
        'they missed',
        'did they miss',
        'they did miss',
        'have they missed',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         'Transforma a Estructura B: "It is alleged that the director falsified the accounts." ¿Cuál es correcta?',
      options:      [
        'The director is alleged to falsify the accounts.',
        'The director is alleged to have falsified the accounts.',
        'The director was alleged to falsify the accounts.',
        'The director is alleging to have falsified the accounts.',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"We _______ the entire codebase _______ by an external security firm before the launch." ¿Qué forma causativa es correcta?',
      options:      ['made / audit', 'got / audited', 'had / audited', 'had / to audit'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"The initial results were encouraging. _______, the sample size was too small to draw firm conclusions."',
      options:      ['Furthermore', 'Admittedly', 'As a result', 'In contrast'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"Costs rose sharply in Q3. _______, margins held steady, suggesting improved operational efficiency." ¿Qué marcador de contraste es más apropiado?',
      options:      ['Furthermore', 'Therefore', 'Nevertheless', 'Admittedly'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"The data _______ that the decline began before the structural changes were implemented." ¿Qué verbo de hedging es más apropiado para un informe formal?',
      options:      ['proves', 'confirms', 'suggests', 'establishes'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Qué frase combina correctamente una WHAT-cleft, una pasiva impersonal y un marcador de consecuencia en un único argumento cohesivo?',
      options:      [
        'What the report found is very interesting and important for the future.',
        'What the audit reveals is a systemic gap in oversight. It is therefore recommended that governance protocols be reviewed immediately.',
        'The report found problems. Therefore, we should do something about it.',
        'It is a problem that was found by the audit, so we need to fix it.',
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
  const unit = await upsert(Unit, { courseId, order: 6 }, {
    courseId,
    title:            'The Bigger Picture',
    order:            6,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L6.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'Writing to Persuade — The Full B2 Toolkit on the Page',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L61,
      duration: 25,
      order:    1,
    }),

    // L6.2 — VIDEO
    // Canal recomendado: TED / McKinsey / HBR talks en YouTube
    // Búsqueda: "advanced business English presentation persuasion B2 C1"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: A High-Stakes Business Presentation',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-b2-u6-l2',
      duration: 12,
      order:    2,
    }),

    // L6.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'The Language of Reports and Proposals',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L63,
      duration: 20,
      order:    3,
    }),

    // L6.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Spoken English at B2 — Meetings, Negotiations and Presentations',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L64,
      duration: 20,
      order:    4,
    }),

    // L6.5 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'From B2 to C1 — What Advanced Fluency Looks Like',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L65,
      duration: 15,
      order:    5,
    }),

    // L6.6 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 6 }, {
      unitId:   unit._id,
      courseId,
      title:    'The Bigger Picture — Final Quiz',
      type:     LESSON_TYPES.QUIZ,
      content:  CONTENT_L66,
      duration: 30,
      order:    6,
    }),

  ]);

  await upsert(Assessment, { unitId: unit._id }, {
    unitId:   unit._id,
    courseId,
    ...ASSESSMENT_U6,
  });
};
