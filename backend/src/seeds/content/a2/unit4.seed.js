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
// L4.1 — Getting Around — Transport Vocabulary
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L41 = `Viajar en un país de habla inglesa implica manejar vocabulario muy específico: en el aeropuerto, en la estación, al coger un taxi. Esta lección te da las palabras y frases que necesitas para moverte con confianza.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN EL AEROPUERTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

check-in               →  facturación
boarding pass          →  tarjeta de embarque
passport control       →  control de pasaportes
customs                →  aduana
security               →  control de seguridad
departure lounge       →  sala de embarque
gate                   →  puerta de embarque
departure              →  salida
arrival                →  llegada
carry-on / hand luggage →  equipaje de mano
luggage / baggage      →  equipaje facturado
delay                  →  retraso
boarding               →  embarque
terminal               →  terminal

Frases habituales:
"Excuse me, where is gate 14B?"
"My flight is delayed by two hours."
"Can I have a window seat, please?"
"I only have hand luggage — I didn't check in any bags."
"My bag is over the weight limit."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN LA ESTACIÓN DE TREN O AUTOBÚS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

platform        →  andén
timetable       →  horario
single (ticket) →  billete de ida
return (ticket) →  billete de ida y vuelta
first class     →  primera clase
standard class  →  clase turista / segunda clase
season ticket   →  abono de transporte
ticket machine  →  máquina expendedora
ticket office   →  taquilla
fare            →  tarifa / precio del billete

Frases habituales:
"Which platform does the train to Manchester leave from?"
"A return to Edinburgh, please."
"Is there a direct train or do I have to change?"
"How long does the journey take?"
"The next train leaves at half past three from platform nine."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TAXIS Y TRANSPORTE URBANO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

taxi rank          →  parada de taxi
cab                →  taxi (informal)
bus stop           →  parada de autobús
tube / underground →  metro (Londres)
subway             →  metro (América)
fare               →  precio del trayecto
contactless        →  pago sin contacto

Frases habituales:
"Can you take me to the city centre, please?"
"How much is it to the airport?"
"Keep the change."              →  Quédese con el cambio.
"Which bus goes to Oxford Street?"
"Does this bus stop at Victoria Station?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPRANDO UN BILLETE — DIÁLOGO COMPLETO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Passenger:  "Hi, I'd like a return ticket to Cambridge, please."
Clerk:      "When would you like to travel?"
Passenger:  "This afternoon — is there a train at around three?"
Clerk:      "There's one at 3:15 from platform seven. That's £28.50."
Passenger:  "Is that first class?"
Clerk:      "No, that's standard. First class is £45."
Passenger:  "Standard is fine, thanks. Can I pay by card?"
Clerk:      "Of course. Just tap here. Here's your ticket — have a good trip!"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — SINGLE Y RETURN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Single = solo ida   /   Return = ida y vuelta

Estas son las palabras del inglés británico. El inglés americano usa:
one way (= single)   /   round trip (= return)

❌ "A one way to London, please." → Correcto en AmE, raro en BrE.
✅ "A single to London, please." → Natural en inglés británico.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Cómo dirías estas cosas en inglés?

1. Quieres saber desde qué andén sale el tren a Bristol.
2. Necesitas un billete de ida y vuelta a Oxford.
3. Tu vuelo lleva dos horas de retraso.
4. Quieres que el taxista te lleve al hotel.
5. Preguntas si el autobús para en Victoria Station.

Posibles respuestas:
1. "Which platform does the train to Bristol leave from?"
2. "A return to Oxford, please."
3. "My flight is delayed by two hours."
4. "Can you take me to the hotel, please?"
5. "Does this bus stop at Victoria Station?"`;

// ─────────────────────────────────────────────────────────────────────────────
// L4.3 — Going To — Plans and Intentions
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L43 = `Cuando tienes planes concretos para el futuro — un viaje reservado, una cita en el calendario, una intención clara — en inglés usas GOING TO. Es el tiempo del futuro planeado.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA ESTRUCTURA — AM/IS/ARE + GOING TO + INFINITIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I am going to...         →  I'm going to...
You are going to...      →  You're going to...
He / She / It is going to... →  He's / She's going to...
We / They are going to... →  We're / They're going to...

La forma contracta es la más habitual en conversación.

Ejemplos con viajes:
"I'm going to fly to Dublin next weekend."
"She's going to take the train to Edinburgh."
"They're going to rent a car for the road trip."
"We're going to book the hotel tonight."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOS USOS PRINCIPALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PLANES E INTENCIONES — algo que ya tienes decidido antes de hablar

"I'm going to visit Japan next spring."   (ya está en los planes)
"We're going to take a gap year."         (la decisión está tomada)
"She's going to apply for a new job."     (ya lo ha decidido)

2. PREDICCIONES CON EVIDENCIA — ves algo que indica lo que va a pasar

"Look at those clouds — it's going to rain."   (ves las nubes)
"He didn't sleep at all — he's going to be exhausted tomorrow."
"The bus is coming and we're not ready — we're going to miss it!"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRASES NEGATIVAS E INTERROGATIVAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Negativa — la negación va en el verbo BE:

"I'm not going to take the bus today."
"She isn't going to be at the airport."
"They're not going to make the connection."

❌ "I'm going to not fly."   →   ✅ "I'm not going to fly."

Interrogativa — se invierte el sujeto y BE:

"Are you going to take the train?"
"Is she going to book the tickets?"
"What are they going to do in Rome?"
"Where are you going to stay?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN CONTEXTO — HABLANDO DE UN VIAJE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Are you going to travel this summer?"
"Yes! I'm going to go to Portugal for two weeks. We're going to drive there."
"Are you going to stay in hotels?"
"No, we're going to rent a house near the beach."
"Is your sister going to come too?"
"She's not going to join us — she's going to work through the summer."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — PRESENTE SIMPLE PARA EL FUTURO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los hispanohablantes a veces usan el presente simple para el futuro:

❌ "Next week I go to Paris."
✅ "Next week I'm going to go to Paris." / "I'm going to Paris next week."

Excepción válida: el presente simple SÍ se usa para horarios fijos inamovibles:
"The train leaves at 9am." / "The match starts at 8pm." → horario de transporte o espectáculo


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con la forma correcta de "going to":

1. We _______ (visit) the Alhambra next Monday — we already have tickets.
2. Look at that cyclist — she _______ (fall)!
3. She _______ (not travel) this year — she's saving money.
4. _______ you _______ (rent) a car or take the train?
5. I _______ (book) the hotel tonight.

Respuestas:
1. 're going to visit   2. 's going to fall   3. isn't going to travel
4. Are / going to rent   5. 'm going to book`;

// ─────────────────────────────────────────────────────────────────────────────
// L4.4 — Will — Predictions and Spontaneous Decisions
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L44 = `Ya sabes usar GOING TO para planes concretos. WILL expresa el futuro desde otro ángulo: decisiones que tomas en el momento de hablar, predicciones generales, ofertas y promesas.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA ESTRUCTURA — WILL + INFINITIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I will...         →  I'll...
You will...       →  You'll...
He / She / It will... →  He'll / She'll...
We / They will... →  We'll / They'll...

Negativa:  will not  →  won't

"I won't be late."    /    "She won't take the bus today."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOS CUATRO USOS DE WILL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. DECISIONES ESPONTÁNEAS — decides en el momento de hablar

"The taxi is stuck in traffic. I'll take the tube."    (decides ahora)
"That bag looks heavy — I'll carry it for you."
"The bill? Don't worry — I'll pay."

2. PREDICCIONES GENERALES — crees que algo ocurrirá (sin evidencia inmediata)

"I think the flight will be on time."
"Travelling will be much easier when they finish the new road."
"You won't have any problems at customs with this passport."

3. OFERTAS Y PROMESAS

"I'll help you with the luggage."           (oferta)
"I'll call you as soon as I land."          (promesa)
"We'll send you the confirmation by email." (promesa corporativa)

4. INFORMACIÓN FUTURA — anuncios, horarios confirmados

"The train will depart from platform four."
"Gates will open at 6:30."
"The next bus will arrive in ten minutes."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WILL VS GOING TO — LA DIFERENCIA CLAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GOING TO → plan previo, ya decidido antes del momento de hablar
WILL → decisión que surge en el momento de hablar

Situación: alguien llega con mucho equipaje.
"I'm going to carry two bags." (ya lo tenía planeado)
"I'll carry your bag." (decides ayudar ahora mismo)

GOING TO → predicción con evidencia visible
WILL → predicción sin evidencia inmediata

"Look at those clouds — it's going to rain." (evidencia: ves las nubes)
"I think it will rain this afternoon." (creencia general, sin evidencia)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN CONTEXTO — EN EL AEROPUERTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"The gate is closing in five minutes!"
"I'll run — I think we'll make it if we hurry."
"I'm going to miss my connection!"
"Don't worry, I'll ask at the information desk. They'll know what to do."
"Do you think the airline will rebook us?"
"I'm sure they will. I'll call the hotel and tell them we'll be late."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — "I WILL TO GO"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WILL es un modal y va seguido del infinitivo sin TO:

❌ "I will to take the taxi."
✅ "I will take the taxi." / "I'll take the taxi."

❌ "She will to call you."
✅ "She'll call you."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Will o Going to? Elige el correcto:

1. La app del tiempo dice 90% de probabilidad de lluvia.
   → It _______ rain.

2. El camarero trae la cuenta. Decides pagar tú.
   → "I _______ pay this time."

3. Ya tienes los vuelos reservados a Lisboa.
   → "We _______ fly to Lisbon next May."

4. Crees que la tecnología cambiará el transporte en el futuro.
   → "I think electric cars _______ replace petrol ones eventually."

Respuestas:
1. is going to (evidencia del pronóstico — visible)
2. 'll / will (decisión espontánea)
3. 're going to (plan previo reservado)
4. will (predicción general sin evidencia inmediata)`;

// ─────────────────────────────────────────────────────────────────────────────
// L4.5 — Travel & Future — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L45 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — VOCABULARIO DE VIAJES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Qué es en inglés?

1. La tarjeta de embarque: ___________
2. El andén del tren: ___________
3. Un billete de ida: ___________
4. La sala de embarque: ___________
5. La tarifa / precio del trayecto: ___________

Respuestas: 1. boarding pass  2. platform  3. a single ticket  4. departure lounge  5. fare


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — GOING TO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa las frases:

1. I _______ (book) the flights tonight — I've already decided.
2. Look at the traffic! We _______ (miss) the train.
3. _______ you _______ (travel) by train or bus?
4. She _______ (not fly) — she's afraid of flying.
5. They _______ (stay) in a hostel. They booked it last week.

Respuestas:
1. 'm going to book   2. 're going to miss   3. Are / going to travel
4. isn't going to fly   5. 're going to stay


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — WILL VS GOING TO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige la opción más correcta y justifica:

1. Your friend drops their ticket. You pick it up for them.
   a) "I'm going to get that for you."
   b) "I'll get that for you."

2. You have a confirmed reservation at a hotel.
   a) "I'll stay at the Grand Hotel."
   b) "I'm going to stay at the Grand Hotel."

3. The forecast shows 80% chance of snow tomorrow.
   a) "It will snow tomorrow."
   b) "It's going to snow tomorrow."

Respuestas:
1. b — decisión espontánea (will)
2. b — plan previo reservado (going to)
3. b — predicción con evidencia (going to)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — COMPRENSIÓN LECTORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lee el texto y responde:

"I'm really excited about my trip next month. I'm going to fly to Edinburgh on the 12th — my flight leaves at 7am, so I'll have to get up very early. I'm going to stay with a friend for the first two days, and then I'm going to rent a small apartment in the city centre. I think the weather will be cold, so I'm going to pack lots of warm clothes. I haven't bought the train ticket yet, but I think I'll get a return to St Andrews for a day trip."

Preguntas:
1. ¿Cuándo sale el vuelo?
2. ¿Dónde va a pasar los dos primeros días?
3. ¿Qué tiempo cree que hará?
4. ¿Qué todavía no ha comprado?

Respuestas:
1. At 7am on the 12th.
2. With a friend.
3. Cold.
4. The train ticket (to St Andrews).`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U4
// 10 preguntas × 1 punto = 10 pts totales. passingScore 80 → 8/10.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U4 = {
  title:        'Travel & Transport — Unit 4 Assessment',
  description:  'Describe un viaje que hayas hecho o que vayas a hacer. Usa al menos tres frases con going to (planes) y dos con will (decisiones o predicciones). Incluye vocabulario de transporte de la unidad.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '¿Qué es un "boarding pass"?',
      options:      ['El billete de tren', 'La tarjeta de embarque', 'El control de pasaportes', 'La sala de espera'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"A single to Bristol, please." ¿Qué tipo de billete pides?',
      options:      ['Ida y vuelta', 'Primera clase', 'Solo ida', 'Abono mensual'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál es la estructura correcta de "going to"?',
      options:      ['Subject + going to + -ing', 'Subject + am/is/are + going to + infinitive', 'Subject + will + going to + infinitive', 'Subject + going + infinitive'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         'Ya tienes el vuelo reservado. ¿Qué dices?',
      options:      ["I'll fly to Rome next week.", "I'm going to fly to Rome next week.", 'I fly to Rome next week.', 'I am fly to Rome next week.'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         'Tu amigo llega con muchas maletas. Decides ayudarle en ese momento. ¿Qué dices?',
      options:      ["I'm going to carry that for you.", "I'll carry that for you.", 'I carry that for you.', 'I am going carry that.'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         'Ves nubes muy oscuras en el cielo. ¿Qué dices?',
      options:      ["It'll rain.", "It's going to rain.", 'It rains.', 'It will to rain.'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Qué significa "the train is delayed"?',
      options:      ['El tren está completo.', 'El tren ha llegado.', 'El tren lleva retraso.', 'El tren ha sido cancelado.'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál es la forma correcta de la negativa de will?',
      options:      ['will not to go', "won't go", "willn't go", 'not will go'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"I think electric cars _______ replace petrol ones." ¿Qué forma es correcta?',
      options:      ['are going to', 'will', 'going to', 'are will'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Qué es el "fare" en el contexto del transporte?',
      options:      ['El horario del tren', 'La plataforma o andén', 'El precio del trayecto', 'La sala de espera'],
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
    title:            'Travel & Transport',
    order:            4,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L4.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'Getting Around — Transport Vocabulary',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L41,
      duration: 15,
      order:    1,
    }),

    // L4.2 — VIDEO
    // Canal recomendado: BBC Learning English
    // Búsqueda: "travel English airport train conversation BBC Learning English"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: Buying a Ticket and Checking In',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-a2-u4-l2',
      duration: 10,
      order:    2,
    }),

    // L4.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'Going To — Plans and Intentions',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L43,
      duration: 20,
      order:    3,
    }),

    // L4.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Will — Predictions and Spontaneous Decisions',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L44,
      duration: 20,
      order:    4,
    }),

    // L4.5 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'Travel & Future — Quiz',
      type:     LESSON_TYPES.QUIZ,
      content:  CONTENT_L45,
      duration: 20,
      order:    5,
    }),

  ]);

  await upsert(Assessment, { unitId: unit._id }, {
    unitId:   unit._id,
    courseId,
    ...ASSESSMENT_U4,
  });
};
