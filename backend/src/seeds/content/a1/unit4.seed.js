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
// L4.1 — Everyday Verbs — What People Do
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L41 = `Antes de hablar de gramática, necesitas los verbos. Esta lección te da el vocabulario que describe lo que la mayoría de las personas hacen cada día, en el orden en que suelen ocurrir.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA RUTINA DE LA MAÑANA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

wake up          →  despertarse
get up           →  levantarse (salir de la cama)
have a shower    →  ducharse  (BrE: have a shower / AmE: take a shower)
brush your teeth →  lavarse los dientes
get dressed      →  vestirse
have breakfast   →  desayunar
leave home       →  salir de casa
go to work       →  ir al trabajo
go to school     →  ir al colegio / a la universidad

"I wake up at seven. I have a shower, get dressed and have breakfast. I leave home at eight fifteen."

La diferencia entre "wake up" y "get up": "wake up" es el momento en que te despiertas mentalmente (puedes seguir en la cama). "Get up" es cuando físicamente te levantas.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EL DÍA DE TRABAJO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

start work / school  →  empezar a trabajar / ir a clase
have lunch           →  comer (el almuerzo)
have a coffee break  →  tomar un descanso para el café
finish work          →  terminar el trabajo
come home            →  llegar a casa
cook dinner          →  cocinar la cena
have dinner          →  cenar

"I start work at nine and finish at six. I have lunch at one o'clock, usually at my desk."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA TARDE Y LA NOCHE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

do exercise      →  hacer ejercicio
watch TV         →  ver la televisión
read             →  leer
meet friends     →  quedar con amigos
go for a walk    →  salir a pasear
relax            →  descansar, relajarse
go to bed        →  irse a dormir
fall asleep      →  quedarse dormido/a

"After work I usually go for a walk or meet friends. I watch TV for a bit and go to bed at around eleven."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPRESIONES DE TIEMPO PARA LA RUTINA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

in the morning    →  por la mañana
in the afternoon  →  por la tarde (hasta las 18-19h)
in the evening    →  por la tarde-noche (a partir de las 18-19h)
at night          →  por la noche
at noon           →  al mediodía
at midnight       →  a medianoche
every day         →  todos los días
on weekdays       →  entre semana (de lunes a viernes)
at the weekend    →  el fin de semana (BrE) / on the weekend (AmE)

"I exercise in the morning. I watch TV in the evening. I always read a bit at night before I go to bed."

La preposición con estas expresiones:
IN the morning / afternoon / evening
AT night / noon / midnight / the weekend


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — "MAKE" VS. "DO"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dos verbos que se confunden constantemente:

DO → actividades y tareas cotidianas
"do exercise", "do housework", "do the washing up", "do homework"

MAKE → crear o producir algo
"make breakfast", "make a coffee", "make dinner", "make the bed"

❌ "I make exercise every morning."
✅ "I do exercise every morning."

❌ "I do breakfast at eight."
✅ "I make breakfast at eight." / "I have breakfast at eight."

La distinción no siempre es lógica — hay combinaciones que simplemente se aprenden. Las más frecuentes: "do exercise", "do housework" / "make breakfast", "make a coffee", "make the bed".


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ordena esta rutina de la más habitual a la menos habitual:

go to bed / have breakfast / get up / brush teeth / wake up / have dinner / have lunch

Orden habitual: wake up → get up → brush teeth → have breakfast → have lunch → have dinner → go to bed

Ahora escribe cinco frases describiendo tu propia rutina del día de hoy o de ayer.`;

// ─────────────────────────────────────────────────────────────────────────────
// L4.3 — I Work, She Works — Present Simple
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L43 = `El Present Simple es el tiempo verbal más importante del inglés A1. Se usa para hablar de hábitos, rutinas y hechos que son siempre verdad. Esta lección lo cubre de principio a fin.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUÁNDO SE USA EL PRESENT SIMPLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hábitos y rutinas:
"I wake up at seven every day."
"She goes to the gym on Mondays."

Hechos permanentes:
"Water boils at 100 degrees."
"My parents live in Seville."

Preferencias y estados:
"I like coffee but I don't like tea."
"He loves his job."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMA AFIRMATIVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I work         →  yo trabajo
You work       →  tú trabajas
He works       →  él trabaja      ← añade -s
She works      →  ella trabaja    ← añade -s
It works       →  funciona        ← añade -s
We work        →  nosotros trabajamos
They work      →  ellos trabajan

La única diferencia es la tercera persona del singular (he/she/it): añades -s al verbo.

Reglas de ortografía para la -s:
Verbos que terminan en -ch, -sh, -s, -x, -o → añaden -es:
watch → watches / finish → finishes / go → goes / do → does

Verbos que terminan en consonante + -y → cambian -y por -ies:
study → studies / carry → carries / fly → flies

Verbos que terminan en vocal + -y → simplemente añaden -s:
play → plays / say → says / enjoy → enjoys

Irregulares que hay que memorizar:
have → has (no "haves")
be → is (tercera persona)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMA NEGATIVA — DON'T / DOESN'T
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I / You / We / They → don't + verbo base
He / She / It       → doesn't + verbo base

"I don't drink coffee."
"She doesn't like Mondays."
"They don't work on Sundays."
"He doesn't have a car."

Atención: con "doesn't", el verbo vuelve a su forma base. NO se añade -s.

❌ "She doesn't works."
✅ "She doesn't work."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMA INTERROGATIVA — DO / DOES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I / You / We / They → Do + sujeto + verbo base?
He / She / It       → Does + sujeto + verbo base?

"Do you work on Saturdays?"       →  "Yes, I do." / "No, I don't."
"Does she live near here?"        →  "Yes, she does." / "No, she doesn't."
"Do they have children?"          →  "Yes, they do." / "No, they don't."
"Does he speak English?"          →  "Yes, he does." / "No, he doesn't."

Con "does", igual que con "doesn't": el verbo vuelve a su forma base.

❌ "Does she works here?"
✅ "Does she work here?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRESENT SIMPLE EN CONTEXTO — RUTINAS REALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"My sister is a nurse. She works long hours and she often starts at six in the morning. She doesn't have breakfast at home — she eats at the hospital. She finishes work at two and she usually sleeps in the afternoon. She doesn't go out much during the week, but at the weekend she meets her friends. She loves her job."

Cuenta los verbos en tercera persona: works, starts, has, eats, finishes, sleeps, goes, meets, loves — todos con -s (o irregulares).


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — LA -S DE TERCERA PERSONA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Este error es el más frecuente en Present Simple para hispanohablantes, en todos los niveles:

❌ "He work every day."
✅ "He works every day."

❌ "She live in Barcelona."
✅ "She lives in Barcelona."

La regla no tiene excepciones (salvo los irregulares have → has). Si el sujeto es he, she o it, el verbo lleva -s. Siempre.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con la forma correcta del verbo:

1. She _______ (study) French at university.
2. My brother _______ (not / like) vegetables.
3. _______ (do) you work from home?
4. He _______ (finish) work at five o'clock.
5. They _______ (not / have) a car — they use public transport.
6. _______ (does) your sister speak English?

Respuestas: 1. studies  2. doesn't like  3. Do  4. finishes  5. don't have  6. Does`;

// ─────────────────────────────────────────────────────────────────────────────
// L4.4 — Always, Sometimes, Never — Adverbs of Frequency
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L44 = `Los adverbios de frecuencia responden a la pregunta "¿con qué frecuencia?". Son esenciales para describir rutinas con precisión y se usan constantemente en conversación cotidiana.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA ESCALA DE FRECUENCIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

always      →  siempre     (100%)
usually     →  normalmente (80%)
often       →  a menudo    (60%)
sometimes   →  a veces     (40%)
rarely      →  raramente   (20%)
never       →  nunca       (0%)

"I always have breakfast." → Siempre desayuno. (sin excepciones)
"I usually get up at seven." → Normalmente me levanto a las siete.
"She often goes to the gym." → Ella va al gimnasio a menudo.
"We sometimes watch a film on Friday." → A veces vemos una película el viernes.
"He rarely drinks alcohol." → Él raramente bebe alcohol.
"I never smoke." → Nunca fumo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POSICIÓN EN LA FRASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Regla general: el adverbio de frecuencia va ANTES del verbo principal.

"I always drink coffee in the morning."
"She usually takes the bus."
"They never eat meat."

Excepción importante: con el verbo BE, el adverbio va DESPUÉS.

"He is always late." (no "He always is late")
"She is usually very friendly."
"I am never tired in the morning."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREGUNTAR CON QUÉ FRECUENCIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"How often do you exercise?"   →  ¿Con qué frecuencia haces ejercicio?
"How often does she travel?"   →  ¿Con qué frecuencia viaja ella?

Respuestas posibles:
"Every day." / "Twice a week." / "Once a month." / "Not very often." / "Never."

once      →  una vez
twice     →  dos veces
three times →  tres veces
a day / a week / a month  →  al día / a la semana / al mes

"I go to the gym three times a week."
"She calls her mother once a day."
"We go on holiday twice a year."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVERBIOS EN CONTEXTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"A: Do you often cook at home?"
"B: I usually do, yes. I cook from Monday to Thursday. I sometimes order food at the weekend. I never eat fast food — I don't like it."

"A: How often does your brother go to the gym?"
"B: He always goes on Monday and Wednesday. He sometimes goes on Friday too, but not always."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — POSICIÓN DESPUÉS DEL VERBO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ "I drink always coffee in the morning."
✅ "I always drink coffee in the morning."

❌ "She is always late always."
✅ "She is always late."

❌ "He goes never to the cinema."
✅ "He never goes to the cinema."

Una vez que interiorizas que el adverbio de frecuencia va delante del verbo principal (y detrás de be), el patrón es estable. Los errores desaparecen con la práctica.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reescribe las frases poniendo el adverbio en el lugar correcto:

1. I eat meat. (never)
2. She is tired in the morning. (always)
3. They go to the cinema. (sometimes)
4. He is on time for meetings. (rarely)
5. We have dinner together. (usually)

Respuestas:
1. I never eat meat.
2. She is always tired in the morning.
3. They sometimes go to the cinema.
4. He is rarely on time for meetings.
5. We usually have dinner together.`;

// ─────────────────────────────────────────────────────────────────────────────
// L4.5 — My Routine — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L45 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — VOCABULARIO DE RUTINAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Cuál es el orden lógico de esta rutina?

Ordena de 1 a 7:
□ have breakfast
□ go to bed
□ get dressed
□ wake up
□ have dinner
□ have lunch
□ get up

Orden correcto:
1. wake up
2. get up
3. get dressed
4. have breakfast
5. have lunch
6. have dinner
7. go to bed

¿Has confundido "wake up" y "get up"? wake up = despertarse / get up = levantarse.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — TERCERA PERSONA (+S)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Escribe la forma correcta del verbo:

1. My sister _______ (work) in a hospital.
2. He _______ (go) to the gym every morning.
3. She _______ (study) English twice a week.
4. My father _______ (watch) the news every evening.
5. Carlos _______ (have) breakfast at eight o'clock.

Respuestas:
1. works  2. goes  3. studies  4. watches  5. has

¿Recuerdas las reglas? work → works / go → goes / study → studies (consonante + y → ies) / watch → watches / have → has (irregular)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — DON'T / DOESN'T
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con la forma negativa correcta:

1. I _______ drink alcohol. (I → don't)
2. She _______ eat meat. She's vegetarian. (She → doesn't)
3. They _______ work on Sundays. (They → don't)
4. He _______ like early mornings. (He → doesn't)
5. We _______ have a car. We use the bus. (We → don't)

Respuestas:
1. don't  2. doesn't  3. don't  4. doesn't  5. don't

Atención: "doesn't" + verbo BASE (no "doesn't works" → "doesn't work").


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — ADVERBIOS DE FRECUENCIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pon el adverbio en el lugar correcto:

1. I have breakfast at home. (always)
2. She is late for work. (never)
3. They cook dinner together. (usually)
4. He goes to the cinema. (rarely)
5. We eat pizza at the weekend. (sometimes)

Respuestas:
1. I always have breakfast at home.
2. She is never late for work.
3. They usually cook dinner together.
4. He rarely goes to the cinema.
5. We sometimes eat pizza at the weekend.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE E — SITUACIÓN REAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lee y responde:

"My name is Emma. I'm a teacher. I usually wake up at half past six and I always have a shower before breakfast. I have breakfast at seven — I usually have toast and coffee. I start work at nine. I don't have lunch at school — I bring food from home. I finish work at four. In the evenings I often go for a run or meet friends. I never watch TV during the week. I go to bed at around eleven."

1. ¿A qué hora se despierta Emma normalmente?
2. ¿Qué desayuna?
3. ¿Come en el trabajo?
4. ¿Qué hace por las tardes?
5. ¿Ve la televisión entre semana?

Respuestas:
1. At half past six. / At 6:30.
2. Toast and coffee.
3. No, she doesn't. She brings food from home.
4. She often goes for a run or meets friends.
5. No, she never watches TV during the week.`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U4
// 10 preguntas × 1 punto = 10 pts totales.
// passingScore 80 → 8/10 = 80%
// Parte B en description: enunciado para el estudiante.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U4 = {
  title:        'My Day — Unit 4 Assessment',
  description:  'Describe tu rutina diaria en inglés. Escribe cinco frases usando el Present Simple: qué haces por la mañana, cuándo comes, qué haces por la tarde y a qué hora te acuestas. Usa al menos un adverbio de frecuencia.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '¿Cómo se dice en inglés "levantarse de la cama" (salir físicamente de la cama)?',
      options:      ['wake up', 'get up', 'sit up', 'stand up'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         'Elige la forma correcta: "She ___ to work every day."',
      options:      ['go', 'goes', 'going', 'is go'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         'Elige la forma correcta: "My brother ___ breakfast at seven."',
      options:      ['have', 'has', 'having', 'to have'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         'Completa: "I ___ drink coffee. I prefer tea."',
      options:      ['doesn\'t', 'don\'t', 'not', 'isn\'t'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         'Completa: "She ___ like Mondays."',
      options:      ['don\'t', 'doesn\'t', 'isn\'t', 'not'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Qué auxiliar es correcto? "___ you usually have lunch at home?"',
      options:      ['Are', 'Does', 'Do', 'Is'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Qué auxiliar es correcto? "___ your sister work on Saturdays?"',
      options:      ['Do', 'Is', 'Does', 'Are'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál de estas frases está bien escrita?',
      options:      ['She drinks always coffee.', 'She always drinks coffee.', 'Always she drinks coffee.', 'She drinks coffee always.'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"He ___ watches TV. Maybe once a year." ¿Qué adverbio es correcto?',
      options:      ['always', 'often', 'usually', 'rarely'],
      correctIndex: 3,
      points:       1,
    },
    {
      text:         'Elige la forma correcta: "Carlos ___ work at 9am and ___ work at 6pm."',
      options:      ['start / finish', 'starts / finishes', 'start / finishes', 'starts / finish'],
      correctIndex: 1,
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
    title:            'My Day — Daily Routines',
    order:            4,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L4.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'Everyday Verbs — What People Do',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L41,
      duration: 15,
      order:    1,
    }),

    // L4.2 — VIDEO
    // Canal recomendado: BBC Learning English / EnglishClass101
    // Búsqueda: "a day in my life English beginner A1 routine"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: A Day in My Life',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-u4-l2',
      duration: 10,
      order:    2,
    }),

    // L4.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'I Work, She Works — Present Simple',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L43,
      duration: 15,
      order:    3,
    }),

    // L4.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Always, Sometimes, Never — Adverbs of Frequency',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L44,
      duration: 15,
      order:    4,
    }),

    // L4.5 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'My Routine — Quiz',
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
