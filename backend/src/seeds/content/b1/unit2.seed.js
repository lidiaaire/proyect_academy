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
// L2.1 — The Future in English — A Complete Map
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L21 = `El inglés tiene varias formas de hablar del futuro y cada una transmite un matiz diferente. En esta lección repasas las tres que ya conoces y preparas el terreno para lo que viene en la unidad.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMA 1 — WILL + INFINITIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CUÁNDO SE USA:

a) Decisiones espontáneas (tomadas en el momento de hablar):
"It's cold in here. I'll close the window."
→  Acabo de decidirlo ahora mismo.

b) Predicciones sin evidencia presente (opinión o creencia):
"I think it will rain tomorrow."
"She'll probably be late, as usual."

c) Promesas, ofrecimientos y peticiones:
"I'll help you with that."       →  Promesa
"Will you pass me the salt?"     →  Petición formal

Forma: sujeto + will + infinitivo (sin "to")
Negativa: won't (= will not)
"He won't come — I'm sure of it."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMA 2 — GOING TO + INFINITIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CUÁNDO SE USA:

a) Planes e intenciones previamente decididos:
"We're going to move to a bigger flat next year."
→  Ya lo hemos decidido.

b) Predicciones basadas en evidencia visible en el presente:
"Look at that sky — it's going to snow."
"She's not well — she's going to miss the meeting."
→  Hay una señal clara ahora mismo.

Forma: am / is / are + going to + infinitivo
"I'm going to start a new job in September."
"He's going to be a great teacher."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMA 3 — PRESENT CONTINUOUS PARA FUTURO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CUÁNDO SE USA:
Para compromisos y citas previamente acordados con otra persona o con una agenda:

"I'm meeting the doctor on Thursday at ten."
"We're flying to Rome next Friday."
"She's having dinner with a client this evening."

La diferencia con going to: el present continuous para futuro implica que ya está en la agenda — hay una hora, un lugar, otra persona. Going to puede ser una intención más personal.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TABLA COMPARATIVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Forma                  Cuándo                           Ejemplo
will                   Decisión espontánea              "I'll get it!" (suena el teléfono)
will                   Predicción sin evidencia         "It'll be fine, don't worry."
going to               Plan decidido de antemano        "I'm going to apply for that job."
going to               Predicción con evidencia         "He's going to fall — careful!"
present continuous     Cita / compromiso acordado       "I'm seeing Ana at five."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LO QUE VIENE EN ESTA UNIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En las próximas lecciones añades dos herramientas nuevas al mapa del futuro:

1. WAS / WERE GOING TO — para hablar de planes del pasado que no se cumplieron.
2. WILL HAVE + PARTICIPIO (future perfect) — para hablar de acciones que estarán completadas antes de un punto futuro.

También aprenderás a expresar distintos grados de certeza sobre el futuro.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — WILL CON PLANES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ "I will meet her tomorrow at six — we organized it last week."
✅ "I'm meeting her tomorrow at six — we organized it last week."
(Cita acordada → present continuous)

❌ "Look at those clouds — it will rain!"
✅ "Look at those clouds — it's going to rain!"
(Evidencia visible → going to)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige la forma más natural en cada contexto:

1. El teléfono suena. Dices: "Don't worry, _______ (I answer / I'll answer / I'm answering)."
2. Tienes reserva de avión. Dices: "_______ (I fly / I'm flying / I'll fly) to Dublin on Saturday."
3. Con evidencia en el cielo: "The match _______ (will cancel / is going to be / is being) cancelled — look at that rain."
4. Describes un plan tuyo para este año: "I _______ (will / am going to / am) learn to drive."

Respuestas: 1. I'll answer  2. I'm flying  3. is going to be  4. am going to`;

// ─────────────────────────────────────────────────────────────────────────────
// L2.3 — I Was Going To... — Future in the Past
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L23 = `A veces hablamos de cosas que en su momento iban a ocurrir pero que finalmente no ocurrieron. Para esto el inglés usa una forma muy expresiva que conecta el pasado con el futuro que nunca llegó.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WAS / WERE GOING TO — EL FUTURO EN EL PASADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Era el futuro en aquel entonces, pero ya pasó — y normalmente no fue como se esperaba.

Estructura: was / were + going to + infinitivo

"I was going to call you."              →  Iba a llamarte (pero no lo hice).
"She was going to study medicine."      →  Iba a estudiar medicina (pero no lo hizo).
"We were going to move last year."      →  Íbamos a mudarnos el año pasado (pero no).
"They were going to get married."       →  Iban a casarse (pero no).

El contexto implica casi siempre que el plan cambió o no se cumplió. Es una forma honesta de explicar por qué algo no ocurrió.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USOS PRINCIPALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USO 1 — PLAN QUE CAMBIÓ:
"I was going to take the bus, but I missed it so I walked."
"She was going to apply for the job, but then she got a better offer."

USO 2 — EXPLICAR UN RETRASO O AUSENCIA:
"Sorry I'm late — I was going to leave at seven but the meeting ran over."
"I wasn't going to come tonight, but I'm glad I did."

USO 3 — EXPECTATIVA QUE NO SE CUMPLIÓ:
"It was going to be the best trip of my life. Instead, it rained the whole week."
"He was going to be a professional footballer when he was young."

USO 4 — RECORDAR PLANES COMUNES (en pareja, familia, equipo):
"We were going to renovate the kitchen, remember?"
"You were going to send me that document!"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WAS ABOUT TO — A PUNTO DE OCURRIR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Was / were about to + infinitivo expresa que algo estaba a punto de ocurrir en el pasado — en el último instante antes de que pasara algo más.

"I was about to leave when the phone rang."
→  Estaba a punto de salir cuando sonó el teléfono.

"She was about to give up when she finally found the answer."
→  Estaba a punto de rendirse cuando por fin encontró la respuesta.

"We were about to order when the waiter disappeared."
→  Estábamos a punto de pedir cuando el camarero desapareció.

LA DIFERENCIA CLAVE:
was going to → plan general, puede haber pasado tiempo entre el plan y el cambio
was about to → el tiempo es mínimo, estás a segundos del momento

"I was going to call her." (tenía intención, en algún momento)
"I was about to call her when she walked through the door." (mano sobre el teléfono)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN CONVERSACIÓN REAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Did you see the film last night?"
"No, I was going to, but I fell asleep on the sofa."

"Why didn't you order the salmon?"
"I was about to, but then I saw there was a vegetarian option I hadn't noticed."

"I thought you were going to resign."
"I was. But they offered me a raise, so I changed my mind."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — CONFUNDIR CON GOING TO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ "I am going to call you but I forgot." (presente → no expresa el pasado del plan)
✅ "I was going to call you but I forgot."

❌ "She is about to leave when he arrived." (mezcla de tiempos)
✅ "She was about to leave when he arrived."

El auxiliar BE siempre en pasado (was/were) para referirse al futuro desde el pasado.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con "was/were going to" o "was/were about to":

1. I _______ send you a message, but I lost my phone.
2. She _______ sign the contract when she noticed a mistake.
3. We _______ travel together last summer, but the trip got cancelled.
4. He _______ give up when his coach told him to keep going.
5. They _______ open a restaurant, but they couldn't find the right location.

Respuestas:
1. was going to (plan general)
2. was about to (último instante antes de firmar)
3. were going to (plan cancelado)
4. was about to (a punto de rendirse)
5. were going to (plan que no se materializó)`;

// ─────────────────────────────────────────────────────────────────────────────
// L2.4 — Will Have Done — The Future Perfect
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L24 = `El future perfect te permite hablar del futuro de una manera muy precisa: no qué pasará, sino qué habrá terminado antes de un punto futuro concreto. Es una herramienta clave para proyecciones personales y profesionales.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA ESTRUCTURA — WILL + HAVE + PARTICIPIO PASADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

will + have + participio pasado

El participio pasado es la tercera forma del verbo — la misma que usaste en la Unit 1 para el past perfect. Aquí la misma pieza aparece en un contexto de futuro.

Repaso de participios irregulares esenciales (de Unit 1):
go → gone       eat → eaten     see → seen       take → taken
write → written  do → done       be → been        give → given
know → known    come → come     have → had       make → made
find → found    leave → left    buy → bought     finish → finished (regular: -ed)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUÉ EXPRESA EL FUTURE PERFECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Describe una acción que habrá sido completada antes de un momento específico en el futuro.

"By next June, I will have finished the course."
→  Antes de que llegue junio, el curso estará terminado.

"By the time you arrive, I will have cooked dinner."
→  Cuando llegues, la cena ya estará hecha.

"In two years, she will have saved enough to buy a flat."
→  En dos años, habrá ahorrado suficiente.

"By this time tomorrow, we will have landed in Tokyo."
→  A esta misma hora mañana, ya habremos aterrizado.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPRESIONES TEMPORALES TÍPICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estas expresiones casi siempre van con future perfect porque indican el punto límite:

by then                  →  para entonces
by next [week/month/year] →  para la semana/mes/año que viene
by the time + frase      →  para cuando...
in [two years / ten years] →  en dos/diez años
by the end of [the year]   →  al final del año
this time next year        →  a estas mismas fechas el año que viene

"By the end of the month, she will have sent all the reports."
"This time next year, I will have graduated."
"By the time he retires, he will have worked here for thirty years."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROGRESIÓN DE EJEMPLOS — DEL SIMPLE AL COMPLEJO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nivel 1 — estructura básica:
"I will have finished by six."
→  Para las seis, habré terminado.

Nivel 2 — con expresión temporal completa:
"By the time the guests arrive, I will have prepared everything."
→  Para cuando lleguen los invitados, habré preparado todo.

Nivel 3 — con contexto personal:
"Next April I will have lived in this city for five years. A lot has changed."
→  En abril próximo habrá cinco años que vivo en esta ciudad.

Nivel 4 — con negativa:
"Don't call me at eight — I won't have finished dinner yet."
→  No me llames a las ocho — todavía no habré terminado de cenar.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FUTURE PERFECT VS. WILL SIMPLE — LA DIFERENCIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WILL SIMPLE — el evento ocurrirá (no dice cuándo terminará):
"I will finish the report tomorrow."
→  Lo acabaré mañana. (Solo informa del plan)

FUTURE PERFECT — el evento estará completado antes de un punto:
"By tomorrow afternoon, I will have finished the report."
→  Antes de mañana por la tarde, el informe estará listo. (Garantiza la finalización)

La diferencia es de perspectiva: will simple mira hacia el evento; future perfect mira más allá, al momento en que el evento ya habrá quedado atrás.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — OLVIDAR "HAVE"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ "By next year, I will finished the project."
✅ "By next year, I will have finished the project."

❌ "She will been promoted by then."
✅ "She will have been promoted by then."

Will + participio sin "have" no existe. La estructura es siempre will + have + participio.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con el future perfect correcto:

1. By the time she wakes up, I _______ (make) breakfast.
2. In five years, they _______ (build) the new hospital.
3. By next summer, we _______ (save) enough for a holiday.
4. This time tomorrow, she _______ (take) the exam.
5. By the end of the week, he _______ (write) twenty pages.

Respuestas:
1. will have made  2. will have built  3. will have saved
4. will have taken  5. will have written`;

// ─────────────────────────────────────────────────────────────────────────────
// L2.5 — Maybe, Definitely, No Chance — Expressing Certainty
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L25 = `Hablar del futuro no siempre significa estar seguro. Esta lección te da el vocabulario para expresar distintos grados de certeza — desde la certeza absoluta hasta la duda total — e introduce dos modales nuevos que son esenciales en inglés B1.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVERBIOS DE PROBABILIDAD — ESCALA COMPLETA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

De mayor a menor certeza:

definitely / certainly  →  definitivamente, con toda seguridad (100%)
probably               →  probablemente (70-90%)
possibly / perhaps     →  posiblemente / quizás (40-60%)
I doubt (that)...      →  dudo que... (20-30%)
certainly not          →  desde luego que no (0%)

Posición en la frase: normalmente entre el sujeto y el verbo, o al principio:

"She will definitely be there."       →  Estará allí sin duda.
"He will probably call tomorrow."     →  Probablemente llamará mañana.
"They will possibly cancel the event." →  Posiblemente cancelen el evento.
"I doubt they will agree."            →  Dudo que acepten.

También funciona al inicio de la frase:
"Perhaps it will rain, but I'm not sure."
"Probably we'll go — it depends on the weather."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODALES PARA CERTEZA — MUST Y CAN'T (REPASO A2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ya conoces must y can't de A2 para hablar de obligación. Aquí aparecen con un uso diferente: la deducción lógica.

MUST (deducción positiva — casi certeza):
"She's not answering — she must be asleep."
→  Estoy casi seguro de que está dormida.
"He ran a marathon last week — he must be very fit."

CAN'T (deducción negativa — imposibilidad lógica):
"He can't be at home — I just saw him at the office."
→  Es imposible que esté en casa.
"That can't be right — the numbers don't add up."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MIGHT Y COULD — CONTENIDO NUEVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estos dos modales no aparecieron en A1 ni en A2. Son herramientas nuevas en tu nivel B1.

MIGHT — posibilidad real pero incierta (≈ 30-50%):
"I might go to the party — I haven't decided yet."
→  Puede que vaya a la fiesta, no lo sé todavía.

"She might be late — there's a lot of traffic."
→  Puede que llegue tarde.

"It might rain this afternoon."
→  Puede que llueva esta tarde.

COULD — posibilidad entre varias opciones (alternativa menos frecuente o más condicional):
"There could be a problem with the booking."
→  Podría haber un problema con la reserva.

"That could be the answer, but I'm not sure."
→  Podría ser la respuesta, no estoy seguro.

"You could try calling her — she might answer."
→  Podrías intentar llamarla — igual responde.

DIFERENCIA ENTRE MIGHT Y COULD PARA POSIBILIDAD:

En la práctica, might y could son intercambiables en muchos contextos:
"It might / could rain."  →  Ambas son correctas y naturales.

La diferencia más marcada:
MIGHT — posibilidad de que algo ocurra de forma espontánea
COULD — posibilidad entre opciones, o posibilidad más hipotética

"I might see you tomorrow." (puede que nos veamos)
"We could meet tomorrow, if you're free." (es una opción posible)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA ESCALA COMPLETA CON MODALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CERTEZA TOTAL →  will (definitely)
               →  must (deducción positiva)
               →  should (expectativa razonable)
               →  might / could (posibilidad)
               →  might not / couldn't (posibilidad negativa)
IMPOSIBILIDAD →  can't / won't (definitely not)

Ejemplos en el mismo contexto (¿dónde está Miguel?):

"He will be at the office — he never misses work."        (certeza)
"He must be at the office — his car is outside."          (deducción fuerte)
"He should be at the office at this time."                (expectativa)
"He might be at the office — or possibly at a meeting."   (posibilidad)
"He might not be there today — he mentioned a trip."      (posibilidad negativa)
"He can't be at the office — it's a public holiday."      (imposibilidad lógica)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPRESIONES COMPLEMENTARIAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I'm sure (that)...         →  Estoy seguro/a de que...
I'm fairly sure...         →  Estoy bastante seguro/a...
I'm not sure...            →  No estoy seguro/a...
I have no idea...          →  No tengo ni idea...
I doubt (that)...          →  Dudo que...
There's a good chance...   →  Hay bastantes posibilidades de que...
It's unlikely (that)...    →  Es poco probable que...
It's very likely (that)... →  Es muy probable que...


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — MIGHT CON -S DE TERCERA PERSONA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los modales (might, could, must, can't, will, should) NO llevan -s en tercera persona:

❌ "She mights be at home."
✅ "She might be at home."

❌ "He coulds arrive late."
✅ "He could arrive late."

Los modales son invariables: la misma forma para todos los sujetos.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige el modal o adverbio más apropiado según el contexto:

1. "She's studied every day for a month — she _______ pass the exam." (certeza casi total por deducción)
2. "I haven't decided — I _______ go to the conference or I _______ stay here." (dos posibilidades)
3. "That _______ be him calling — he's on a plane right now." (imposibilidad lógica)
4. "She _______ be at home — her car is in the drive." (deducción positiva)
5. "It _______ rain this afternoon, but it's hard to say." (posibilidad incierta)

Respuestas:
1. must  2. might... might / could... could  3. can't  4. must  5. might / could`;

// ─────────────────────────────────────────────────────────────────────────────
// L2.6 — Future Forms — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L26 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — WILL / GOING TO / PRESENT CONTINUOUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige la forma más natural para cada contexto:

1. El teléfono suena. Tú dices: "_______."
   a) I'm going to answer.   b) I'll answer.   c) I answer.

2. Ya tienes billete de tren comprado: "I _______ to Madrid on Sunday."
   a) will travel   b) travel   c) am travelling

3. Con evidencia visible (cielo negro): "It _______ — get an umbrella."
   a) will storm   b) is going to storm   c) storms

Respuestas: 1. b   2. c   3. b


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — FUTURE IN THE PAST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. "I _______ call you, but I lost my phone."
   a) am going to   b) was going to   c) will   d) had going to
   Respuesta: b

5. "She _______ sign the papers when she noticed an error."
   a) was going to   b) was about to   c) is about to   d) had been going to
   Respuesta: b  (a punto de, en el último instante)

6. ¿Cuál expresa que un plan no se cumplió?
   a) "I will go to the gym tomorrow."
   b) "I was going to go to the gym, but I was too tired."
   c) "I am about to go to the gym."
   d) "I am going to go to the gym next week."
   Respuesta: b


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — FUTURE PERFECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. "By next month, she _______ the project."
   a) will finish   b) will have finish   c) will have finished   d) has finished
   Respuesta: c

8. "_______ next year, I will have lived here for a decade."
   a) Until   b) Since   c) By   d) While
   Respuesta: c

9. ¿Cuál es el participio pasado de "take"?
   a) taked   b) took   c) taken   d) taking
   Respuesta: c


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — CERTEZA Y POSIBILIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. "I'm not sure — she _______ be at home or she might be at work." (posibilidad)
    a) must   b) will   c) could   d) definitely
    Respuesta: c

11. "He's not answering his phone — he _______ be asleep." (deducción fuerte positiva)
    a) might   b) could   c) must   d) will
    Respuesta: c

12. "That _______ be right — the figures are completely wrong." (imposibilidad lógica)
    a) might not   b) can't   c) mustn't   d) won't definitely
    Respuesta: b


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERRORES FRECUENTES — IDENTIFICA Y CORRIGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Hay un error? Corrígelo si es necesario:

1. "Look at the sky — it will rain!"
   ERROR → "it's going to rain" (evidencia visible)

2. "I was going to call her but forgot."
   CORRECTO

3. "By next year, I will finished the report."
   ERROR → "I will have finished" (falta "have")

4. "She mights be late."
   ERROR → "She might be late" (los modales no llevan -s)

5. "I'm meeting my boss tomorrow morning at nine."
   CORRECTO (cita acordada → present continuous)`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U2 — 12 preguntas × 1 punto. passingScore 80 → mínimo 10/12.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U2 = {
  title:        'Future & Plans — Unit 2 Assessment',
  description:  'Escribe un párrafo de seis a ocho frases sobre tus planes y predicciones para el próximo año. Usa al menos tres formas de futuro diferentes, una estructura de future perfect y una expresión de posibilidad con might o could.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         'Acaban de llamar a la puerta. ¿Qué dices de forma espontánea?',
      options:      ["I'm going to open it.", "I'll get it.", 'I am opening it.', 'I open it.'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"Look at those clouds — it _______ snow." ¿Qué forma es correcta?',
      options:      ["'ll", 'is going to', 'is', 'will probably'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         'Tienes vuelo reservado el viernes. ¿Cómo lo expresas?',
      options:      ["I'll fly to Berlin on Friday.", 'I fly to Berlin on Friday.', "I'm flying to Berlin on Friday.", 'I am going to fly to Berlin on Friday.'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"I _______ call you, but I lost my phone." ¿Qué forma expresa un plan que no se cumplió?',
      options:      ['will call', 'was going to call', 'had called', 'am going to call'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"She _______ sign the contract when she noticed a mistake." ¿Qué expresa el último instante antes de un evento?',
      options:      ['was going to', 'was about to', 'had been going to', 'would'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"By next June, I _______ this course." ¿Qué forma de future perfect es correcta?',
      options:      ["'ll finish", 'am finishing', "'ll have finished", 'will finished'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Qué expresión temporal va más naturalmente con el future perfect?',
      options:      ['yesterday', 'by the end of the year', 'right now', 'last month'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"I\'m not sure — she _______ be at home or she might be at work." ¿Qué modal de posibilidad es correcto?',
      options:      ['must', 'will', 'could', 'can'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"It\'s possible they _______ change the date." ¿Qué modal de posibilidad es correcto?',
      options:      ['must', 'could', 'will certainly', 'shall'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"He\'s not answering — he _______ be asleep." ¿Qué modal expresa deducción lógica positiva?',
      options:      ['might', 'could', 'must', 'will'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"That _______ be right — the numbers are completely wrong." ¿Qué modal expresa imposibilidad lógica?',
      options:      ["can't", "mustn't", "couldn't", "might not"],
      correctIndex: 0,
      points:       1,
    },
    {
      text:         '"She\'ll _______ pass — she\'s prepared for months." ¿Qué adverbio expresa la mayor certeza?',
      options:      ['possibly', 'perhaps', 'probably', 'definitely'],
      correctIndex: 3,
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
    title:            'Future & Plans',
    order:            2,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L2.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'The Future in English — A Complete Map',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L21,
      duration: 20,
      order:    1,
    }),

    // L2.2 — VIDEO
    // Canal recomendado: BBC Learning English / engVid
    // Búsqueda: "future tenses will going to present continuous English"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: Talking About Tomorrow',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-b1-u2-l2',
      duration: 10,
      order:    2,
    }),

    // L2.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'I Was Going To... — Future in the Past',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L23,
      duration: 15,
      order:    3,
    }),

    // L2.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Will Have Done — The Future Perfect',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L24,
      duration: 20,
      order:    4,
    }),

    // L2.5 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'Maybe, Definitely, No Chance — Expressing Certainty',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L25,
      duration: 20,
      order:    5,
    }),

    // L2.6 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 6 }, {
      unitId:   unit._id,
      courseId,
      title:    'Future Forms — Quiz',
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
