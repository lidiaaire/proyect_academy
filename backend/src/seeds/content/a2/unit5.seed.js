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
// L5.1 — Rain or Shine — Weather Vocabulary
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L51 = `El tiempo meteorológico es uno de los temas de conversación más frecuentes en inglés, especialmente en el Reino Unido. Dominar su vocabulario te permite hablar con cualquier angloparlante en el contexto más natural posible.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADJETIVOS METEOROLÓGICOS — LA BASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

sunny        →  soleado
cloudy       →  nublado
rainy        →  lluvioso
windy        →  ventoso
foggy        →  con niebla
snowy        →  nevado / con nieve
icy          →  con hielo
stormy       →  tormentoso
humid        →  húmedo
dry          →  seco
overcast     →  cubierto (cielo sin sol, pero sin llover)
clear        →  despejado

"It's a beautiful sunny day."
"The roads are icy this morning — drive carefully."
"It's very humid today — feels like a sauna."
"It was overcast all day but it didn't rain."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPRESAR EL TIEMPO — IT'S + ADJETIVO / -ING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La estructura más frecuente es IT'S + adjetivo o IT'S + verbo en -ing:

It's sunny.          →  Está soleado.
It's raining.        →  Está lloviendo.
It's snowing.        →  Está nevando.
It's windy.          →  Hace viento.
It's foggy.          →  Hay niebla.
It's thundering.     →  Hay tormenta / está tronando.
It's hailing.        →  Está granizando.
It's drizzling.      →  Está llovizneando.

En inglés, el sujeto del tiempo siempre es IT. Nunca se omite:

❌ "Is raining outside."
✅ "It's raining outside."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEMPERATURA — DE MUCHO CALOR A MUCHO FRÍO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

(de más calor a más frío)

scorching / boiling  →  abrasador / hace un calor brutal (informal)
very hot             →  hace mucho calor
hot                  →  hace calor
warm                 →  templado / agradable
mild                 →  suave (sin extremos)
cool                 →  fresquito
cold                 →  frío
very cold            →  hace mucho frío
freezing             →  helado / hace un frío que pela (informal)

"It's absolutely boiling today — I can't leave the house."
"The weather was mild and pleasant for the whole trip."
"It was freezing last night — minus six degrees."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREGUNTAR POR EL TIEMPO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"What's the weather like today?"    →  ¿Qué tiempo hace hoy?
"What's the weather going to be like this weekend?"
"Is it going to rain?"
"How cold is it?"

"What's the weather like?" es la pregunta más natural y frecuente en inglés hablado.

❌ "How is the weather?"  →  Gramaticalmente posible pero suena no nativo.
✅ "What's the weather like?"  →  Lo que dicen los nativos.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPRESIONES IDIOMÁTICAS DEL TIEMPO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

under the weather      →  encontrarse mal / pachucho
a ray of sunshine      →  un rayo de esperanza / alegría
every cloud has a silver lining  →  no hay mal que por bien no venga
it's raining cats and dogs       →  está lloviendo a cántaros

"I'm feeling a bit under the weather today — I think I'm getting a cold."
"It's raining cats and dogs — take an umbrella!"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Cómo lo dirías en inglés?

1. Está llovizneando.
2. Hay niebla esta mañana.
3. Hace un frío que pela.
4. ¿Qué tiempo hace?
5. El cielo está cubierto pero no llueve.

Posibles respuestas:
1. It's drizzling.   2. It's foggy this morning.   3. It's freezing.
4. What's the weather like?   5. It's overcast.`;

// ─────────────────────────────────────────────────────────────────────────────
// L5.3 — The Four Seasons — Climate, Adverbs of Degree
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L53 = `Los cuatro estaciones y cómo describirlas con precisión — incluyendo los adverbios de grado que matizan cualquier descripción del tiempo o de la vida cotidiana.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAS CUATRO ESTACIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

spring    →  primavera   (March – May, en el hemisferio norte)
summer    →  verano      (June – August)
autumn    →  otoño       (September – November)  [BrE]
fall      →  otoño       [AmE]
winter    →  invierno    (December – February)

SPRING:
"Spring in England is quite unpredictable — one day it's warm and sunny, the next it's raining."
"The flowers come out in spring and the days get longer."

SUMMER:
"Summers in the UK can be warm but they're rarely very hot."
"In southern Spain, summers are absolutely scorching."

AUTUMN:
"Autumn is beautiful — the leaves turn orange, red and yellow."
"It gets darker earlier and the mornings are quite cool."

WINTER:
"Winters in Scotland can be extremely cold and very dark."
"It sometimes snows, but in most of England it's just grey and chilly."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVERBIOS DE GRADO — MATIZAR LO QUE DICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los adverbios de grado modifican la intensidad de un adjetivo. En inglés son esenciales para sonar natural, ya que las descripciones sin matiz suenan planas o exageradas.

Escala de menos a más intensidad:

a bit / a little     →  un poco  (muy ligero, informal)
quite                →  bastante  (más que a bit, menos que very)
fairly               →  bastante  (similar a quite, algo más neutro)
rather               →  bastante  (con matiz de sorpresa o énfasis)
very                 →  muy
extremely            →  extremadamente
absolutely           →  totalmente (solo con adjetivos extremos)

"It's a bit cold today." → Un poco de frío.
"It's quite cold today." → Bastante frío (más que un poco).
"It's very cold today." → Hace mucho frío.
"It's extremely cold today." → Hace un frío extremo.
"It's absolutely freezing today." → Hace un frío que pela.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLA CLAVE — ADJETIVOS EXTREMOS VS GRADUABLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los adjetivos GRADUABLES (cold, hot, tired, good) admiten very, quite, a bit:
"very cold" / "quite tired" / "a bit good" (aunque "a bit good" no es muy habitual)

Los adjetivos EXTREMOS (freezing, boiling, exhausted, perfect, terrible, awful) ya llevan la idea de "mucho" en sí mismos. Con ellos se usa absolutely, not a bit, etc. — NO very:

❌ "It's very freezing."       →  ✅ "It's absolutely freezing."
❌ "It was very perfect."      →  ✅ "It was absolutely perfect."
❌ "I was very exhausted."     →  ✅ "I was absolutely exhausted."

"The weather was absolutely awful — rain every single day."
"The view from the mountain was absolutely stunning."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA ROPA SEGÚN LA ESTACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

spring / autumn:
jacket / light coat    →  chaqueta / abrigo ligero
raincoat               →  chubasquero / impermeable
umbrella               →  paraguas
boots                  →  botas

summer:
shorts                 →  pantalón corto
t-shirt / vest         →  camiseta
sandals                →  sandalias
sunglasses             →  gafas de sol
sunscreen              →  protector solar

winter:
coat / heavy coat      →  abrigo
scarf                  →  bufanda
gloves                 →  guantes
hat / woolly hat       →  gorro de lana
thick jumper / woolly jumper →  jersey grueso


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con el adverbio de grado más natural:

1. The weather was _______ cold — we had to wear coats. (bastante)
2. It was _______ freezing last January — the pipes froze. (totalmente)
3. The summer was _______ hot this year — nothing like usual. (extremadamente)
4. It was _______ windy — just enough to fly a kite. (un poco)
5. The autumn colours were _______ beautiful. (absolutamente)

Respuestas:
1. quite / fairly / rather   2. absolutely   3. extremely
4. a bit / a little   5. absolutely`;

// ─────────────────────────────────────────────────────────────────────────────
// L5.4 — Making Arrangements — Present Continuous for Future
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L54 = `Ya sabes usar going to para planes y will para decisiones espontáneas. Hay un tercer modo de hablar del futuro que se usa para compromisos ya fijados y confirmados: el presente continuo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿QUÉ ES EL PRESENTE CONTINUO PARA EL FUTURO?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En inglés, el presente continuo (am/is/are + -ing) no solo describe lo que pasa ahora mismo. También describe compromisos, citas y arreglos ya confirmados en un futuro próximo.

Clave: existe una idea de plan acordado con otra persona o reserva ya hecha.

"I'm meeting Sarah for lunch tomorrow." (la cita está acordada con Sarah)
"She's flying to New York on Friday." (el vuelo ya está reservado)
"We're having dinner with the team tonight." (el plan está fijado)
"He's starting his new job on Monday." (todo está acordado)
"They're getting married in June." (todo está organizado)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRESENTE CONTINUO VS GOING TO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En la práctica, ambas formas se usan para hablar de planes futuros. La diferencia es sutil:

Presente continuo → énfasis en el compromiso acordado, muy concreto
Going to → énfasis en la intención o decisión personal

"I'm seeing the doctor at three." (cita ya reservada)
"I'm going to see the doctor." (tengo la intención, quizá sin cita aún)

En conversación, ambas formas son intercambiables en muchos contextos. Los angloparlantes las mezclan con naturalidad.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUÁNDO NO USAR EL PRESENTE CONTINUO PARA EL FUTURO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El presente continuo para el futuro NO se usa con:
- Predicciones generales: ✅ "I think it will rain." (no: "it is raining")
- Decisiones espontáneas: ✅ "I'll open the window." (no: "I'm opening the window" con sentido futuro)
- Horarios de transporte: ✅ "The train leaves at 9." (presente simple para horarios fijos)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MARCADORES TEMPORALES TÍPICOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Palabras y expresiones que aparecen con frecuencia cuando se usa el presente continuo para el futuro:

tonight         →  esta noche
tomorrow        →  mañana
on Saturday     →  el sábado
next week       →  la próxima semana
this weekend    →  este fin de semana
at three o'clock →  a las tres
in the morning  →  por la mañana

"I'm working from home tomorrow."
"She's presenting at the conference next Thursday."
"We're leaving on Sunday morning at seven."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN CONTEXTO — LA AGENDA DE LA SEMANA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"What are you doing this weekend?"
"On Saturday I'm playing tennis with Carlos in the morning, and in the afternoon we're going to a barbecue at my neighbour's. On Sunday I'm not doing anything — I think I'll stay at home and rest."
"Are you working on Monday?"
"Yes, I'm starting early — I'm presenting the new project at nine."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — PRESENTE CONTINUO SIN REFERENCIA TEMPORAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sin contexto o marcador temporal, el presente continuo siempre indica el presente:

"I'm meeting Anna." → Me estoy reuniendo con Anna AHORA.

Para indicar futuro, añade un marcador temporal:

"I'm meeting Anna tomorrow at two." → Mañana a las dos (futuro, plan confirmado).


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reescribe usando presente continuo para el futuro:

1. I have a flight to Berlin next Tuesday. (I / fly)
2. We have a reservation at the restaurant tonight. (we / have dinner)
3. She has an appointment with the dentist on Friday. (she / see the dentist)
4. They have a meeting tomorrow at 10. (they / meet)
5. I have plans with John on Sunday. (I / spend the day)

Respuestas:
1. I'm flying to Berlin next Tuesday.
2. We're having dinner at the restaurant tonight.
3. She's seeing the dentist on Friday.
4. They're meeting at 10 tomorrow.
5. I'm spending the day with John on Sunday.`;

// ─────────────────────────────────────────────────────────────────────────────
// L5.5 — Weather & Seasons — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L55 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — VOCABULARIO METEOROLÓGICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Cómo se dice en inglés?

1. Está llovizneando: ___________
2. El cielo está cubierto: ___________
3. Hace un calor brutal (informal): ___________
4. Hace un frío que pela (informal): ___________
5. ¿Qué tiempo hace? ___________

Respuestas:
1. It's drizzling.   2. It's overcast.   3. It's boiling / scorching.
4. It's freezing.   5. What's the weather like?


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — ADVERBIOS DE GRADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Hay un error? Corrígelo:

1. "It was very freezing last night."
2. "The trip was absolutely wonderful."
3. "It's a very bit windy today."
4. "The view was very stunning."
5. "It's quite cold — you should wear a coat."

Respuestas:
1. ERROR → "It was absolutely freezing." (freezing es un adjetivo extremo)
2. CORRECTO
3. ERROR → "It's a bit windy today." / "It's quite windy today." (no "very a bit")
4. ERROR → "The view was absolutely stunning." (stunning es extremo)
5. CORRECTO


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — PRESENTE CONTINUO PARA EL FUTURO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reescribe con presente continuo para el futuro:

1. I have a dentist appointment on Thursday.
2. She has a flight to Dublin tomorrow morning.
3. We have a meeting with the team at 3pm.
4. He has plans with his family this weekend.
5. They have a reservation for dinner tonight.

Respuestas:
1. I'm seeing the dentist on Thursday.
2. She's flying to Dublin tomorrow morning.
3. We're meeting with the team at 3pm.
4. He's spending the weekend with his family.
5. They're having dinner at the restaurant tonight.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — COMPRENSIÓN LECTORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lee el texto y responde:

"This week is quite hectic. On Monday I'm presenting a report at work — I'm a bit nervous about it. On Tuesday evening I'm meeting some old friends for dinner, which will be lovely. Wednesday is going to be absolutely awful — the forecast says it's going to rain all day and I have to cycle to work. On Thursday I'm seeing my dentist at noon, and on Friday I'm flying to Edinburgh for the weekend. I'm really looking forward to it — I hear the weather there is rather cold but extremely beautiful in autumn."

Preguntas:
1. ¿Qué pasa el lunes en el trabajo?
2. ¿Por qué el miércoles va a ser un día difícil?
3. ¿Qué tiene el jueves al mediodía?
4. ¿Adónde va el fin de semana?

Respuestas:
1. She's presenting a report.
2. It's going to rain all day and she has to cycle.
3. A dentist appointment.
4. To Edinburgh.`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U5
// 10 preguntas × 1 punto = 10 pts totales. passingScore 80 → 8/10.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U5 = {
  title:        'Weather & Seasons — Unit 5 Assessment',
  description:  'Describe el tiempo que hace en tu ciudad en cada estación del año. Usa adverbios de grado variados y al menos tres frases con el presente continuo para el futuro describiendo tus planes para la próxima semana.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '¿Qué significa "it\'s drizzling"?',
      options:      ['Está granizando.', 'Está llovizneando.', 'Está nevando.', 'Hay niebla.'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Cómo se pregunta por el tiempo en inglés de forma natural?',
      options:      ['How is the weather?', "What's the weather like?", 'How does the weather look?', 'What weather is today?'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"It\'s absolutely _______." ¿Qué adjetivo es un ERROR en esta frase?',
      options:      ['freezing', 'boiling', 'cold', 'stunning'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál es el adverbio de grado MÁS intenso?',
      options:      ['quite', 'fairly', 'very', 'extremely'],
      correctIndex: 3,
      points:       1,
    },
    {
      text:         '"She _______ the dentist on Friday." ¿Qué forma indica un plan futuro ya confirmado?',
      options:      ["She'll see", 'She sees', "She's seeing", 'She going to see'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿En qué estación del año son los meses de diciembre, enero y febrero en el hemisferio norte?',
      options:      ['Spring', 'Autumn', 'Summer', 'Winter'],
      correctIndex: 3,
      points:       1,
    },
    {
      text:         '¿Qué significa la expresión "under the weather"?',
      options:      ['Hace mal tiempo fuera.', 'Estar al aire libre.', 'Encontrarse mal / pachucho.', 'Protegerse de la lluvia.'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"We _______ dinner with clients tomorrow evening." ¿Qué forma es correcta para un plan ya fijado?',
      options:      ["We'll have", "We're having", 'We have', 'We going to have'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Qué adjetivo de temperatura describe el día más caluroso?',
      options:      ['warm', 'mild', 'scorching', 'cool'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"It\'s raining cats and dogs." ¿Qué significa?',
      options:      ['Hay animales en la calle.', 'Hace mucho calor.', 'Está lloviendo a cántaros.', 'Hay una tormenta eléctrica.'],
      correctIndex: 2,
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
    title:            'Weather & Seasons',
    order:            5,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L5.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'Rain or Shine — Weather Vocabulary',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L51,
      duration: 15,
      order:    1,
    }),

    // L5.2 — VIDEO
    // Canal recomendado: BBC Learning English
    // Búsqueda: "talking about weather English BBC Learning English"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: Talking About the Weather',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-a2-u5-l2',
      duration: 10,
      order:    2,
    }),

    // L5.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'The Four Seasons — Climate and Adverbs of Degree',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L53,
      duration: 15,
      order:    3,
    }),

    // L5.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Making Arrangements — Present Continuous for Future',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L54,
      duration: 20,
      order:    4,
    }),

    // L5.5 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'Weather & Seasons — Quiz',
      type:     LESSON_TYPES.QUIZ,
      content:  CONTENT_L55,
      duration: 20,
      order:    5,
    }),

  ]);

  await upsert(Assessment, { unitId: unit._id }, {
    unitId:   unit._id,
    courseId,
    ...ASSESSMENT_U5,
  });
};
