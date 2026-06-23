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
// L5.1 — Building the Argument — Addition and Contrast Markers
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L51 = `Un argumento bien construido no depende solo de sus ideas — depende de cómo esas ideas se conectan entre sí. Los discourse markers (marcadores discursivos) son las señales que guían al lector o al oyente a través del razonamiento: indican cuándo añades información, cuándo introduces un contraste, cuándo concedes un punto y cuándo llegas a una conclusión. Esta lección cubre los marcadores de adición y contraste a nivel B2.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MARCADORES DE ADICIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los marcadores de adición añaden información al argumento, reforzando o ampliando el punto anterior.

FURTHERMORE / MOREOVER / IN ADDITION
→  Además / Asimismo (registro formal; muy frecuentes en informes y presentaciones)

"The new system reduces processing time. Furthermore, it eliminates the need for manual data entry."
"The proposal meets all regulatory requirements. Moreover, it offers a significant cost saving."
"We have exceeded our targets for three consecutive quarters. In addition, customer satisfaction scores are at an all-time high."

WHAT IS MORE
→  Y lo que es más (énfasis adicional, destaca que el siguiente punto es aún más relevante)

"The project was completed on schedule. What is more, it came in 15% under budget."

BESIDES (THAT) / ON TOP OF THAT
→  Además de eso (más coloquial que furthermore; frecuente en conversación profesional)

"The service is expensive. On top of that, the turnaround time is unreliable."
"We lost three key clients this quarter. Besides that, the team morale has suffered significantly."

NOT TO MENTION
→  Sin mencionar / Para no hablar de... (añade énfasis, introduce el punto más fuerte al final)

"The platform is slow, poorly designed — not to mention the complete lack of customer support."

REGISTRO — ADICIÓN:
  Formal (escrito):    furthermore, moreover, in addition, additionally
  Neutro-formal:       what is more, as well as this
  Conversacional:      on top of that, besides, not to mention


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MARCADORES DE CONTRASTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los marcadores de contraste introducen una idea que se opone o matiza lo anterior.

HOWEVER / NEVERTHELESS / NONETHELESS
→  Sin embargo / No obstante (entre oraciones, después de punto o punto y coma)

"The initial results were promising. However, sustained growth proved difficult."
"The project faced significant delays. Nevertheless, the final product met all specifications."
"Costs have increased. Nonetheless, the investment remains justified by the long-term returns."

DIFERENCIA DE MATIZ:
HOWEVER → contraste directo y neutro (el más frecuente)
NEVERTHELESS / NONETHELESS → el segundo punto prevalece a pesar del primero (más formal, más enfático)

ON THE OTHER HAND
→  Por otro lado (introduce la perspectiva contraria en una comparación equilibrada)

"Outsourcing reduces costs. On the other hand, it can compromise quality control."
"Working remotely offers flexibility. On the other hand, it reduces opportunities for informal collaboration."

IN CONTRAST / BY CONTRAST
→  En contraste con... / Por el contrario (comparación directa entre dos elementos)

"Sales in the domestic market grew by 4%. In contrast, international sales declined by 11%."
"Last year's figures showed strong growth. This year's results, by contrast, point to stagnation."

WHILE / WHEREAS → dentro de la misma frase (no al inicio de frase independiente):
"While the northern region exceeded targets, the southern region fell short by 20%."
"Whereas the previous approach focused on cost reduction, the new strategy prioritises growth."

ATENCIÓN — PUNCTUATION:
HOWEVER, NEVERTHELESS, NONETHELESS → entre oraciones: punto + mayúscula, o punto y coma.
✅ "Sales grew. However, costs also increased."
✅ "Sales grew; however, costs also increased."
❌ "Sales grew, however, costs also increased." (incorrecto: requiere punto o punto y coma antes)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YET / STILL — CONTRASTE COMPACTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YET (después de punto o coma) → sin embargo, pero aun así (más formal que "but"):
"The strategy was sound. Yet the execution was flawed."
"Costs remain high, yet the board has approved further investment."

STILL (en mitad de la oración) → aun así / todavía:
"Despite the setbacks, the team still delivered on time."
"The data is incomplete. We can still draw some preliminary conclusions, however."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN EL ENTORNO PROFESIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En informes ejecutivos:
"Revenue increased by 8% year on year. Moreover, operating margins improved for the third consecutive quarter. However, the outlook for H2 remains uncertain due to macroeconomic headwinds."

En presentaciones:
"The new platform significantly reduces onboarding time. Furthermore, it integrates seamlessly with our existing CRM. On the other hand, the initial implementation cost is higher than anticipated."

En propuestas comerciales:
"Our solution offers the best value in the market. In addition, our support team is available 24/7. Nevertheless, we understand that price is a key consideration, and we are prepared to discuss a phased payment structure."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige el marcador más adecuado:

1. "The project was completed on time. _______, it was delivered under budget."
   [Furthermore / However / On the other hand]

2. "Working remotely reduces commuting costs. _______, it can make team coordination more difficult."
   [Moreover / On the other hand / In addition]

3. "The report identified serious compliance gaps. _______, the board decided to proceed with the acquisition."
   [Furthermore / Nevertheless / In contrast]

4. "International sales declined by 8%. _______, domestic sales grew by 14%."
   [However / In contrast / Furthermore]

Respuestas: 1. Furthermore  2. On the other hand  3. Nevertheless  4. In contrast`;

// ─────────────────────────────────────────────────────────────────────────────
// L5.3 — Hedging — How to Soften Claims Professionally
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L53 = `En inglés académico y profesional, hacer afirmaciones absolutas sin evidencia suficiente se percibe como impreciso o arrogante. El hedging (uso de lenguaje atenuador) permite presentar ideas con el nivel exacto de certeza que la evidencia respalda — una marca de rigor y profesionalismo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿QUÉ ES EL HEDGING?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hedging significa "proteger" o "cubrir" una afirmación — expresarla con cautela para indicar que es una interpretación, una tendencia o una posibilidad, no una certeza absoluta.

SIN HEDGE (demasiado absoluto):
"Remote work increases productivity."
→  Afirmación universal. ¿Siempre? ¿Para todos? ¿Con qué evidencia?

CON HEDGE (calibrado):
"Remote work tends to increase productivity in roles that require sustained focus."
→  Indica tendencia, no regla universal, y acota el contexto.

"The data suggests that remote work may have a positive impact on productivity."
→  Reporta la evidencia, no la conclusión directa. Deja margen para otros factores.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERBOS DE HEDGING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUGGEST / INDICATE / IMPLY
→  Presenta la evidencia sin asumir la conclusión directamente.
"The figures suggest a shift in consumer behaviour."
"The data indicates that the market is contracting."
"The pattern implies a systemic issue rather than an isolated incident."

SEEM / APPEAR
→  Basado en la observación, no en certeza.
"The approach seems to be more effective in smaller teams."
"There appears to be a discrepancy between the two reports."
"The situation appeared to have stabilised by the end of the quarter."

TEND TO
→  Expresa tendencia general, no regla absoluta.
"Large organisations tend to adopt change more slowly."
"Customer complaints tend to peak in the first month after a platform update."

WOULD APPEAR / WOULD SEEM
→  Versión más formal y cautelosa de appear/seem.
"It would appear that the integration has introduced new vulnerabilities."
"It would seem that the original estimates were overly optimistic."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVERBIOS Y EXPRESIONES DE HEDGING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FRECUENCIA / GENERALIZACIÓN (acota el alcance):
generally, typically, usually, in most cases, in many instances, as a rule, for the most part

"Clients generally respond positively to proactive communication."
"In most cases, the issue can be resolved without escalation."

APROXIMACIÓN (acota la precisión):
approximately, around, roughly, in the region of, some

"The project is expected to cost approximately €300,000."
"Around 60% of respondents indicated a preference for the new format."

POSIBILIDAD (modales — ya conocidos de Unit 2):
may, might, could, can
"This approach may reduce costs significantly."
"There could be regulatory implications that we have not yet considered."

RESTRICCIÓN DEL ALCANCE (limita a qué se aplica):
in this context, in certain circumstances, under specific conditions, to some extent, in some respects

"This model works well, to some extent, in established markets."
"In certain circumstances, a more flexible approach may be appropriate."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURAS DE DISTANCIAMIENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IT COULD BE ARGUED THAT / IT MIGHT BE SUGGESTED THAT
→  Introduce una idea como posición posible, no como afirmación del autor.
"It could be argued that the current pricing model is unsustainable long-term."
"It might be suggested that a phased rollout would reduce implementation risk."

IT IS WORTH NOTING THAT / IT IS IMPORTANT TO CONSIDER THAT
→  Introduce un matiz sin hacer una afirmación categórica.
"It is worth noting that these figures exclude the results from the pilot markets."
"It is important to consider that the study was conducted over a limited timeframe."

ONE MIGHT / ONE COULD
→  Muy formal; introduce una perspectiva con distanciamiento máximo.
"One might argue that the decision was premature given the available data."
"One could reasonably conclude that further testing is needed."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCESO DE HEDGING — CUÁNDO EVITARLO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El hedging excesivo debilita el mensaje. Cuando tienes certeza, afirma:

DEMASIADO CAUTELOSO:
"It might perhaps possibly be suggested that there could be a potential issue with the timeline."

APROPIADO:
"The timeline presents a significant risk that should be addressed immediately."

Regla práctica: hedging calibrado = nivel de certeza = nivel de evidencia disponible.
Si la evidencia es sólida, la afirmación puede ser directa. Si es preliminar o parcial, usa hedging.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN EL ENTORNO PROFESIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En informes:
"The data suggests that customer acquisition costs are rising. This may be attributable, at least in part, to increased competition in the digital advertising space. It would appear that the trend is likely to continue into Q3."

En reuniones:
"It seems to me that we may be underestimating the integration complexity. I could be wrong, but it would be worth reviewing the technical specifications before committing."

En correos profesionales:
"I may have misunderstood the brief — could you clarify whether the scope includes the legacy data migration?"
"It would appear that the delivery date needs to be revised. Could we schedule a call to discuss this?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Añade un hedge apropiado sin cambiar el significado esencial:

1. "The new process is faster." → "_______."
2. "There is a problem with the data." → "_______."
3. "This approach will not work in regulated industries." → "_______."
4. "Costs will increase next year." → "_______."

Respuestas (posibles):
1. The new process tends to be faster. / The new process appears to be faster.
2. There appears to be an issue with the data. / It would seem that there is a problem with the data.
3. This approach may not work in all regulated industries. / It could be argued that this approach is less effective in regulated industries.
4. Costs are likely to increase next year. / Costs may increase in the coming year.`;

// ─────────────────────────────────────────────────────────────────────────────
// L5.4 — Concession — Acknowledging the Other Side
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L54 = `Un argumento persuasivo no ignora las objeciones — las anticipa y las incorpora. La concesión es la técnica retórica que reconoce el punto de vista contrario antes de reafirmar la posición propia con mayor solidez. Dominar la concesión es una señal de pensamiento crítico avanzado y comunicación profesional sofisticada.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿QUÉ ES UNA CONCESIÓN?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Una concesión reconoce que el punto contrario tiene cierta validez, para luego reafirmar la posición principal con más fuerza.

Estructura básica:
[Reconocer] + [Reafirmar]
"Although [punto contrario], [posición principal]."

SIN CONCESIÓN (más débil):
"We should adopt the new platform. It's faster and more cost-effective."

CON CONCESIÓN (más persuasivo):
"Although the initial implementation costs are considerable, the long-term savings and efficiency gains make adoption the stronger strategic choice."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTHOUGH / EVEN THOUGH / THOUGH — DENTRO DE LA FRASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Introducen la cláusula de concesión dentro de una frase compuesta.

ALTHOUGH → formal, neutro; puede ir al inicio o en el medio:
"Although the project ran over budget, the client expressed full satisfaction with the outcome."
"The project ran over budget, although the client expressed full satisfaction."

EVEN THOUGH → más enfático que although; subraya que el contraste es sorprendente:
"Even though the product received negative reviews initially, it became the market leader within two years."
"We maintained the partnership even though the terms were less favourable than expected."

THOUGH → más informal; frecuente en conversación; puede ir al final de frase:
"The results were disappointing, though the team worked extremely hard."
"It's a viable option, though not our preferred one."

DIFERENCIA CLAVE:
ALTHOUGH / EVEN THOUGH → introducen la cláusula subordinada (al inicio o en medio).
THOUGH → puede ir al final como adverbio de contraste.
❌ "Although, the results were positive." → ALTHOUGH no funciona solo al inicio con coma.
✅ "Although the results were mixed, the overall trend was positive."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESPITE / IN SPITE OF — CON NOMBRE O GERUNDIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DESPITE y IN SPITE OF van seguidos de un sustantivo, pronombre o gerundio — nunca de una cláusula con sujeto + verbo.

"Despite the delays, the project was completed successfully."
→  Despite + sustantivo

"In spite of receiving negative feedback, the team persisted."
→  In spite of + gerundio

"Despite the fact that costs increased, margins remained stable."
→  Despite the fact that + cláusula (esta variante sí admite sujeto + verbo)

DESPITE vs. ALTHOUGH:
ALTHOUGH → introduce una cláusula: "Although costs increased..."
DESPITE → introduce un sustantivo o gerundio: "Despite the increase in costs..."

❌ "Despite costs increased, margins remained stable."
✅ "Despite the increase in costs / Despite costs increasing, margins remained stable."
✅ "Although costs increased, margins remained stable."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMITTEDLY / GRANTED / I ACCEPT THAT — CONCESIÓN DIRECTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estas expresiones reconocen explícitamente el punto contrario antes de rebatirlo:

ADMITTEDLY
→  Es cierto que... / Hay que reconocer que...
"Admittedly, the initial investment is substantial. However, the return on investment over a five-year horizon is compelling."

GRANTED
→  Es verdad / Concedido (muy directo, frecuente en debate oral y escrito)
"Granted, we don't have all the data yet. That said, the trend is clear enough to act on."

IT IS TRUE THAT... / THAT SAID...
→  Secuencia formal de concesión + refutación
"It is true that our competitors have a price advantage. That said, our product offers features they cannot match."

WHILE I ACCEPT THAT... / I ACKNOWLEDGE THAT...
→  Muy formal; útil en negociaciones, cartas de reclamación, presentaciones ejecutivas
"While I accept that the timeline is ambitious, I believe the resource allocation makes it achievable."
"I acknowledge that there are risks associated with this approach. Nevertheless, the potential upside justifies them."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA COMPLETA — CONCESIÓN + REAFIRMACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La estructura clásica: reconocer → contrastar → reafirmar

"Admittedly, the cost of implementation is higher than alternatives.
 However, when we consider the total cost of ownership over three years,
 the investment proves significantly more efficient."

"Although our initial pilot results were mixed,
 subsequent iterations have addressed the core issues identified.
 In fact, the revised version outperformed our original projections."

"Despite the challenging market conditions,
 and granted that our competitors have been more aggressive in their pricing,
 we have maintained our market share — which is, in itself, a positive result."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POR QUÉ LA CONCESIÓN FORTALECE UN ARGUMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. CREDIBILIDAD: Quien reconoce las limitaciones de su posición parece más objetivo y confiable.
2. ANTICIPACIÓN: Rebates las objeciones antes de que el interlocutor las plantee.
3. CONTROL: Introduces el punto contrario en los términos que tú eliges — con el enmarcado más favorable.
4. PERSUASIÓN: La estructura "concedo X pero X no supera Y" es más convincente que ignorar X.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con la expresión de concesión más adecuada:

1. "_______ the team exceeded the deadline, the quality of the deliverable was exceptional."
   [Although / Despite / Granted]

2. "_______ the criticism, the project has generated significant commercial value."
   [Although / Despite / Even though]

3. "_______, the rollout took longer than planned. The results, however, have exceeded expectations."
   [Admittedly / Despite / While]

4. "_______ the new process requires additional training, it reduces error rates by 40%."
   [In spite of / Although / Despite]

Respuestas:
1. Although  2. Despite  3. Admittedly  4. Although`;

// ─────────────────────────────────────────────────────────────────────────────
// L5.5 — Cohesion in Professional Texts — Integrated Use
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L55 = `Esta lección integra todos los marcadores discursivos en textos profesionales reales: un informe ejecutivo, un correo de escalada y el cierre de una presentación. El objetivo es que veas cómo los distintos tipos de marcadores trabajan juntos para crear textos coherentes, persuasivos y con registro apropiado.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MAPA COMPLETO — MARCADORES POR FUNCIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ADICIÓN (sumar argumentos):
furthermore, moreover, in addition, additionally, what is more, on top of that, not to mention

CONTRASTE (oponer ideas):
however, nevertheless, nonetheless, on the other hand, in contrast, by contrast, yet, while, whereas

CONCESIÓN (reconocer para luego reafirmar):
although, even though, despite, in spite of, admittedly, granted, it is true that, that said,
while I accept that, I acknowledge that, though

HEDGING (calibrar certeza):
suggest, indicate, appear, seem, tend to, would appear, may, might, could, generally, typically,
approximately, in most cases, it could be argued that, it is worth noting that

CAUSALIDAD Y CONSECUENCIA:
therefore, consequently, as a result, hence, thus, for this reason, it follows that, accordingly

ILUSTRACIÓN Y EJEMPLO:
for instance, for example, such as, to illustrate, a case in point, namely

CONCLUSIÓN Y RESUMEN:
in conclusion, to summarise, overall, on balance, taking everything into account, all things considered


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENARIO 1 — SECCIÓN DE UN INFORME EJECUTIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Performance Analysis — Q3

Overall, Q3 results were below the targets set at the beginning of the year. Revenue declined by 6% compared to the same period last year, while operating costs increased by 4%. As a result, the EBITDA margin has contracted to its lowest level in three years.

It is worth noting, however, that these results reflect broader market conditions. Sector-wide data suggests that most competitors experienced similar or greater declines. Furthermore, our customer retention rate remained at 91%, indicating that the underlying business relationships are solid.

Admittedly, our new product launch underperformed against projections. Despite an increase in marketing spend, conversion rates were approximately 30% lower than forecast. It would appear that the pricing strategy may need to be reviewed. That said, early feedback from existing customers has been encouraging, and there are grounds for cautious optimism regarding Q4."

Análisis de marcadores:
— OVERALL: abre con un resumen calibrado
— WHILE: contraste dentro de la misma frase (ingresos vs. costes)
— AS A RESULT: consecuencia de los datos anteriores
— IT IS WORTH NOTING + HOWEVER: introduce un matiz con hedging y contraste
— SUGGESTS / INDICATING: hedging para no afirmar directamente
— FURTHERMORE: adición de argumento favorable
— ADMITTEDLY: concesión directa sobre el lanzamiento fallido
— DESPITE: concesión sin cláusula (sustantivo)
— APPROXIMATELY: hedging de precisión
— IT WOULD APPEAR / MAY NEED: doble hedging para recomendación prudente
— THAT SAID: giro hacia la perspectiva positiva


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENARIO 2 — CORREO DE ESCALADA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Subject: Escalation — Platform Stability Issues

I am writing to escalate a concern regarding the stability of the new platform following last week's update. It would appear that the update has introduced a performance issue affecting approximately 15% of users. In most cases, the issue manifests as slow loading times; however, in some instances, users have been unable to access the system entirely.

I acknowledge that the update itself was necessary and well-intentioned. Nevertheless, the current situation is impacting productivity and, more importantly, client-facing operations. As a result, I would recommend that we consider a partial rollback while the root cause is identified.

Furthermore, it is worth noting that two similar incidents occurred earlier this year. I therefore suggest that we review our testing and deployment protocols to prevent recurrence. I would be happy to discuss this further at your earliest convenience."

Análisis:
— IT WOULD APPEAR: hedging — no afirma el problema directamente
— APPROXIMATELY: hedging de cantidad
— IN MOST CASES / HOWEVER / IN SOME INSTANCES: matiza el alcance del problema
— I ACKNOWLEDGE: concesión — reconoce la intención positiva del update
— NEVERTHELESS + MORE IMPORTANTLY: contraste y escalada del argumento
— AS A RESULT: consecuencia lógica → recomendación
— FURTHERMORE + IT IS WORTH NOTING: adición de evidencia adicional
— THEREFORE: consecuencia → propuesta de acción


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCENARIO 3 — CIERRE DE PRESENTACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"To summarise, the data clearly supports a shift in our go-to-market strategy. Granted, the transition will require investment and will not be without risk. However, the alternative — maintaining the status quo — carries its own risks, which the figures suggest are considerably greater.

On balance, the evidence points strongly in one direction. I would therefore recommend that we proceed with the proposed plan, subject to the board's approval. I am, of course, open to questions and to any concerns you may wish to raise."

Análisis:
— TO SUMMARISE: marcador de conclusión
— GRANTED: concesión compacta — reconoce los riesgos
— HOWEVER: contraste → introduce el argumento más fuerte
— SUGGESTS: hedging — no afirma directamente lo que dicen las cifras
— ON BALANCE + THEREFORE: conclusión equilibrada + recomendación derivada


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA INTEGRADA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa el párrafo con los marcadores adecuados:

"The pilot programme produced encouraging results. _______ [adición], participant feedback was overwhelmingly positive. _______ [concesión], the sample size was limited, which means the findings should be interpreted with caution. _______ [contraste + hedging], the data _______ [hedging] a genuine improvement in efficiency of _______ [aproximación] 20%. _______ [conclusión], we recommend extending the programme to all regional offices."

Respuesta posible:
"The pilot programme produced encouraging results. Furthermore, participant feedback was overwhelmingly positive. Admittedly, the sample size was limited, which means the findings should be interpreted with caution. Nevertheless, the data suggests a genuine improvement in efficiency of approximately 20%. On balance, we recommend extending the programme to all regional offices."`;

// ─────────────────────────────────────────────────────────────────────────────
// L5.6 — Shaping Your Argument — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L56 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — MARCADORES DE ADICIÓN Y CONTRASTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. "Costs increased significantly last quarter. _______, margins remained stable."
   ¿Qué marcador introduce correctamente el contraste?
   A: Furthermore  B: Nevertheless  C: In addition  D: As a result
   → B

2. "The new system reduces processing time. _______, it eliminates manual data entry entirely."
   ¿Qué marcador de adición es más apropiado en un informe formal?
   A: On top of that  B: Furthermore  C: Not to mention  D: Besides
   → B (más formal)

3. ¿Cuál es el error de puntuación en esta frase?
   "Revenue grew by 8%, however, operating costs also increased."
   → HOWEVER entre dos cláusulas independientes requiere punto y coma (o punto):
     "Revenue grew by 8%; however, operating costs also increased."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — HEDGING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. "The data _______ that customer satisfaction is declining."
   ¿Qué verbo de hedging es más adecuado para un informe?
   A: proves  B: confirms  C: suggests  D: establishes
   → C (suggests — deja margen de interpretación; los otros son demasiado categóricos)

5. "The system failure _______ have been caused by the recent update."
   ¿Qué modal de hedging completa correctamente la frase?
   A: must  B: may  C: will  D: should
   → B (may — especulación, no certeza)

6. Transforma para añadir un hedge apropiado:
   "This strategy will increase sales."
   → Respuesta posible: "This strategy is likely to increase sales." / "This strategy may increase sales." / "This strategy tends to increase sales in comparable markets."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — CONCESIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. ¿Cuál de estas frases usa DESPITE correctamente?
   A: "Despite costs increased, margins held."
   B: "Despite the increase in costs, margins held."
   C: "Despite of the increase in costs, margins held."
   D: "Despite costs were higher, margins held."
   → B

8. "_______, the rollout was slower than planned. The final results, however, exceeded projections."
   ¿Qué expresión de concesión directa es más apropiada?
   A: Although  B: Despite  C: Admittedly  D: Even though
   → C (Admittedly — reconocimiento explícito al inicio de oración independiente)

9. ¿Qué diferencia hay entre ALTHOUGH y DESPITE?
   → ALTHOUGH introduce una cláusula con sujeto + verbo.
     DESPITE va seguido de un sustantivo o gerundio (no de sujeto + verbo).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — COHESIÓN EN TEXTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lee el párrafo e identifica los marcadores indicados:

"The proposal has clear merits. Furthermore, it aligns well with our strategic objectives. Admittedly, the timeline is ambitious, and there are risks associated with the implementation phase. Nevertheless, on balance, the benefits outweigh the drawbacks. It is therefore recommended that the board approve the proposal subject to a revised risk management plan."

10. ¿Qué función tiene FURTHERMORE en este párrafo?
    → Marcador de adición: suma un argumento favorable a los méritos ya mencionados.

11. ¿Qué función tiene ADMITTEDLY?
    → Marcador de concesión: reconoce los puntos débiles antes de reafirmar la posición.

12. ¿Por qué se usa THEREFORE en la última frase?
    → Marcador de consecuencia: la recomendación es la conclusión lógica del análisis anterior (on balance, benefits outweigh drawbacks → therefore, recommend approval).`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U5 — 12 preguntas × 1 punto. passingScore 80 → mínimo 10/12.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U5 = {
  title:        'Shaping Your Argument — Unit 5 Assessment',
  description:  'Evalúa el dominio de los discourse markers avanzados: marcadores de adición, contraste, concesión, hedging y cohesión en textos profesionales formales.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '"The project exceeded its targets. _______, it was delivered two weeks ahead of schedule." ¿Qué marcador de adición formal es más apropiado?',
      options:      ['On top of that', 'Moreover', 'Not to mention', 'Besides'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"Sales grew significantly in Q3. _______, operating costs also rose, reducing overall profitability." ¿Qué marcador introduce el contraste correctamente?',
      options:      ['Furthermore', 'In addition', 'However', 'Therefore'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál es el error en esta frase? "Revenue increased by 12%, nevertheless, the board remained cautious."',
      options:      [
        'Nevertheless no puede usarse para contrastar dos cláusulas.',
        'Nevertheless necesita punto y coma o punto antes, no solo una coma.',
        'Nevertheless debe ir al final de la frase.',
        'La frase es correcta tal como está.',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"_______ the high initial cost, the board approved the investment." ¿Qué conector de concesión es correcto aquí?',
      options:      ['Although', 'Even though', 'Despite', 'Admittedly'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál de estas frases usa ALTHOUGH correctamente?',
      options:      [
        'Although the high costs, the project was approved.',
        'Although costs were high, the project was approved.',
        'Although of the high costs, the project was approved.',
        'Although, costs were high — the project was approved.',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"_______, the implementation phase took longer than planned; the end result, however, exceeded expectations." ¿Qué expresión de concesión directa encaja mejor?',
      options:      ['Despite', 'Although', 'Admittedly', 'In contrast'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"The analysis _______ that consumer confidence is beginning to recover." ¿Qué verbo de hedging es el más apropiado para un informe formal?',
      options:      ['proves', 'confirms', 'establishes', 'suggests'],
      correctIndex: 3,
      points:       1,
    },
    {
      text:         '"Large organisations _______ adopt new technology more slowly than smaller competitors." ¿Qué expresión de hedging generaliza sin afirmar una regla absoluta?',
      options:      ['always', 'definitely', 'tend to', 'certainly'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"It _______ be argued that the current pricing model is unsustainable." ¿Qué estructura de hedging y distanciamiento es correcta?',
      options:      ['must', 'could', 'should', 'will'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"Costs have risen sharply. _______, we recommend a review of the supplier contracts." ¿Qué marcador de consecuencia es más apropiado?',
      options:      ['Furthermore', 'Nevertheless', 'Therefore', 'Admittedly'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Qué diferencia hay entre NEVERTHELESS y HOWEVER en un texto formal?',
      options:      [
        'Son completamente intercambiables en todos los contextos.',
        'HOWEVER introduce un contraste directo; NEVERTHELESS añade que el segundo punto prevalece a pesar del primero, con mayor énfasis.',
        'HOWEVER es más formal que NEVERTHELESS.',
        'NEVERTHELESS solo se usa al inicio de párrafo; HOWEVER solo en el interior.',
      ],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"_______ all things considered, the evidence supports proceeding with the proposed strategy." ¿Qué marcador de conclusión encaja mejor en lugar del espacio?',
      options:      ['Furthermore', 'On balance', 'Admittedly', 'In contrast'],
      correctIndex: 1,
      points:       1,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Seed
// ─────────────────────────────────────────────────────────────────────────────
module.exports = async (courseId) => {
  const unit = await upsert(Unit, { courseId, order: 5 }, {
    courseId,
    title:            'Shaping Your Argument',
    order:            5,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L5.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'Building the Argument — Addition and Contrast Markers',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L51,
      duration: 20,
      order:    1,
    }),

    // L5.2 — VIDEO
    // Canal recomendado: TED / BBC Learning English / Cambridge English
    // Búsqueda: "discourse markers academic writing B2 advanced English cohesion"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: A Persuasive Presentation',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-b2-u5-l2',
      duration: 10,
      order:    2,
    }),

    // L5.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'Hedging — How to Soften Claims Professionally',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L53,
      duration: 20,
      order:    3,
    }),

    // L5.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Concession — Acknowledging the Other Side',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L54,
      duration: 20,
      order:    4,
    }),

    // L5.5 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'Cohesion in Professional Texts — Integrated Use',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L55,
      duration: 15,
      order:    5,
    }),

    // L5.6 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 6 }, {
      unitId:   unit._id,
      courseId,
      title:    'Shaping Your Argument — Quiz',
      type:     LESSON_TYPES.QUIZ,
      content:  CONTENT_L56,
      duration: 25,
      order:    6,
    }),

  ]);

  await upsert(Assessment, { unitId: unit._id }, {
    unitId:   unit._id,
    courseId,
    ...ASSESSMENT_U5,
  });
};
