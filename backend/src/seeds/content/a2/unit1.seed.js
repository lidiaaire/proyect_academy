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
// L1.1 — Regular Verbs — The -ed Rule
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L11 = `Cuando hablas del pasado en inglés, la primera gran herramienta es el Past Simple. La buena noticia: los verbos regulares siguen siempre la misma regla.

Situaciones que ya puedes describir:

"Yesterday I worked until seven in the evening."
"Last week I visited my parents in Valencia."
"On Saturday we watched a great film at home."
"This morning I walked to the supermarket."

¿Ves el patrón? Todos estos verbos terminan en -ed. Esa es la señal del pasado en inglés para los verbos regulares.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA REGLA BÁSICA — AÑADIR -ED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para la mayoría de los verbos, simplemente añades -ed al infinitivo:

work   → worked    (trabajar)
play   → played    (jugar)
watch  → watched   (ver)
visit  → visited   (visitar)
talk   → talked    (hablar)
walk   → walked    (caminar)
start  → started   (empezar)
finish → finished  (terminar)
listen → listened  (escuchar)
open   → opened    (abrir)

Ejemplos en contexto:
"I worked from home yesterday."
"She visited her grandparents last Sunday."
"They finished the project on Friday."
"He listened to the podcast on the train."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCEPCIONES DE ORTOGRAFÍA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El inglés tiene tres reglas ortográficas especiales al añadir -ed:

1. VERBOS QUE TERMINAN EN -E → solo añades -d (no -ed)

live  → lived
love  → loved
dance → danced
arrive → arrived
use   → used
move  → moved
decide → decided

2. VERBOS MONOSÍLABOS CON PATRÓN CONSONANTE + VOCAL + CONSONANTE → doblas la consonante final

stop  → stopped
plan  → planned
drop  → dropped
chat  → chatted
fit   → fitted

Pero NO doblas si la sílaba acentuada no es la última:
visit  → visited   (no: visitted)
open   → opened    (no: openned)

3. VERBOS QUE TERMINAN EN CONSONANTE + Y → cambias -y a -i y añades -ed

study → studied
try   → tried
carry → carried
worry → worried

Excepción: si el verbo termina en VOCAL + y, solo añades -ed:
play  → played    (vocal + y → sin cambio)
enjoy → enjoyed


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA PRONUNCIACIÓN DE -ED (TRES SONIDOS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La terminación -ed no siempre suena igual:

/t/   → después de sonidos sordos (p, k, f, s, sh, ch, x)
        worked /wɜːkt/    watched /wɒtʃt/    stopped /stɒpt/

/d/   → después de sonidos sonoros y vocales
        played /pleɪd/    lived /lɪvd/    moved /muːvd/

/ɪd/  → después de los sonidos /t/ y /d/
        started /stɑːtɪd/    visited /vɪzɪtɪd/    wanted /wɒntɪd/

No te preocupes por dominar esto desde el principio. Con la práctica auditiva llega de forma natural.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MARCADORES TEMPORALES DEL PASADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estas expresiones son la señal de que necesitas el Past Simple:

yesterday         →  ayer
last night        →  anoche
last week         →  la semana pasada
last month        →  el mes pasado
last year         →  el año pasado
two days ago      →  hace dos días
three years ago   →  hace tres años
in 2020           →  en 2020
on Monday         →  el lunes (pasado)
at the weekend    →  el fin de semana

"I moved to London three years ago."
"She studied English last year."
"We watched a film at the weekend."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — INFINITIVO EN LUGAR DE PASADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los hispanohablantes a veces usan el infinitivo en lugar del pasado:

❌ "Yesterday I work a lot."
✅ "Yesterday I worked a lot."

❌ "Last week she visit Madrid."
✅ "Last week she visited Madrid."

Con los marcadores de tiempo del pasado, el verbo SIEMPRE va en pasado. El infinitivo en inglés no tiene marca temporal.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Escribe la forma correcta del Past Simple:

1. She (study) _______ English every day last month.
2. We (stop) _______ at a café on the way home.
3. They (arrive) _______ at eight o'clock.
4. I (play) _______ tennis on Saturday.
5. He (try) _______ the local food in Japan.

Respuestas: 1. studied  2. stopped  3. arrived  4. played  5. tried`;

// ─────────────────────────────────────────────────────────────────────────────
// L1.3 — Irregular Verbs — The Essential List
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L13 = `La mayoría de los verbos más utilizados en inglés son irregulares. Esto significa que no siguen la regla del -ed: tienen una forma de pasado propia que hay que aprender. La buena noticia es que hay patrones que ayudan a memorizarlos por grupos.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOS VERBOS IRREGULARES MÁS FRECUENTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Infinitivo   →  Pasado       Significado
be           →  was / were   ser / estar
have         →  had          tener
do           →  did          hacer
go           →  went         ir
come         →  came         venir / llegar
get          →  got          obtener / llegar / ponerse
see          →  saw          ver
say          →  said         decir
know         →  knew         saber / conocer
think        →  thought      pensar
take         →  took         tomar / coger
give         →  gave         dar
eat          →  ate          comer
drink        →  drank        beber
buy          →  bought       comprar
find         →  found        encontrar
tell         →  told         contar / decir
make         →  made         hacer / fabricar
leave        →  left         salir / dejar
meet         →  met          conocer / quedar


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GRUPOS POR PATRÓN — APRENDE EN BLOQUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Memorizar verbos en grupos con el mismo patrón es mucho más eficaz:

PATRÓN i → o (vocal interna cambia):
drive → drove    ride → rode    write → wrote
rise  → rose

PATRÓN i → a (vocal interna cambia):
drink → drank    sing → sang    swim → swam
ring  → rang     begin → began  run   → ran

PATRÓN -ought / -aught (misma pronunciación /ɔːt/):
buy   → bought   bring → brought   teach → taught
think → thought  catch → caught

SIN CAMBIO (igual en presente y pasado):
cut → cut     put → put     hit → hit     let → let     set → set


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOS IRREGULARES EN CONTEXTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Last night I ate at a new restaurant — the food was incredible."
"She went to Paris last summer and saw the Eiffel Tower."
"I found my keys in my jacket pocket."
"We met our neighbours at the supermarket yesterday."
"He drank three coffees this morning and felt terrible."
"They bought a new car last week."
"I left my phone at the office and had to go back."
"She made a delicious cake for the birthday party."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BE — EL VERBO MÁS IRREGULAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Be" tiene dos formas en pasado según el sujeto:

I / He / She / It  →  was
You / We / They    →  were

"I was at home last night."
"She was very tired after the journey."
"We were at the beach on Sunday."
"The film was brilliant — we were all really moved."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — AÑADIR -ED A IRREGULARES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ "I goed to the cinema last week."      →  ✅ "I went to the cinema last week."
❌ "She eated pizza for dinner."           →  ✅ "She ate pizza for dinner."
❌ "We buyed some souvenirs."             →  ✅ "We bought some souvenirs."
❌ "He taked the train."                  →  ✅ "He took the train."

Si el verbo es irregular, su pasado es único. No existe la forma -ed para estos verbos.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Escribe el pasado correcto:

1. She _______ (go) to the market early in the morning.
2. I _______ (have) a great time at the party.
3. We _______ (eat) at an amazing restaurant last night.
4. He _______ (buy) a new laptop on Friday.
5. They _______ (meet) at university twenty years ago.

Respuestas: 1. went  2. had  3. ate  4. bought  5. met`;

// ─────────────────────────────────────────────────────────────────────────────
// L1.4 — Questions & Negatives — Did and Didn't
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L14 = `En una conversación real, la mayoría de los intercambios en pasado no son solo afirmaciones. Preguntas, respuestas negativas y aclaraciones son igual de frecuentes. En inglés, el auxiliar DID hace todo ese trabajo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRASES NEGATIVAS — DIDN'T + INFINITIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sujeto + DIDN'T + infinitivo

"I didn't work yesterday."         →  No trabajé ayer.
"She didn't go to the party."      →  Ella no fue a la fiesta.
"We didn't have time."             →  No tuvimos tiempo.
"He didn't eat breakfast."         →  No desayunó.
"They didn't understand."          →  No entendieron.

CLAVE: Después de DIDN'T, el verbo vuelve al INFINITIVO.

❌ "She didn't went to school."
✅ "She didn't go to school."

El auxiliar DID ya lleva la marca de pasado. El verbo principal no la necesita.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREGUNTAS DE SÍ O NO — DID + SUJETO + INFINITIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DID + sujeto + infinitivo + ?

"Did you work yesterday?"          →  ¿Trabajaste ayer?
"Did she go to the party?"         →  ¿Fue ella a la fiesta?
"Did they enjoy the concert?"      →  ¿Disfrutaron del concierto?
"Did he eat something?"            →  ¿Comió algo?

Respuestas cortas:
"Yes, I did."      /    "No, I didn't."
"Yes, she did."    /    "No, she didn't."
"Yes, they did."   /    "No, they didn't."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREGUNTAS CON PALABRA INTERROGATIVA (WH-)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WH- + DID + sujeto + infinitivo + ?

"Where did you go last summer?"      →  ¿Adónde fuiste el verano pasado?
"What did she do at the weekend?"    →  ¿Qué hizo el fin de semana?
"When did they arrive?"              →  ¿Cuándo llegaron?
"Why did he leave early?"            →  ¿Por qué se fue pronto?
"Who did you meet at the party?"     →  ¿A quién conociste en la fiesta?
"How did you get here?"              →  ¿Cómo llegaste aquí?


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA EXCEPCIÓN — BE NO USA DID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El verbo BE (was/were) no necesita DID. Funciona solo, como auxiliar de sí mismo:

Afirmativa:   "She was tired."
Negativa:     "She wasn't tired."            (not: "She didn't be tired.")
Pregunta:     "Was she tired?"               (not: "Did she be tired?")

"Were you at home yesterday?"      →  ¿Estabas en casa ayer?
"I wasn't at the meeting."         →  No estaba en la reunión.
"Was the film good?"               →  ¿Era buena la película?
"They weren't ready on time."      →  No estaban listos a tiempo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UNA CONVERSACIÓN REAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"How was your weekend?"
"It was great! I went to Barcelona with some friends."
"Really? What did you do there?"
"We visited the Sagrada Família and ate at a really nice restaurant."
"Did you take the train?"
"No, we didn't. We flew — the flight was only an hour."
"Nice! Was the weather good?"
"Yes, it was perfect. I didn't want to come back!"

Observa: cada pregunta usa DID (excepto las de BE), y las respuestas negativas usan DIDN'T con el verbo en infinitivo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — DOBLE MARCA DE PASADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El error más frecuente en preguntas y negativas:

❌ "Did you went to the cinema?"
✅ "Did you go to the cinema?"

❌ "She didn't worked on Monday."
✅ "She didn't work on Monday."

❌ "Did he ate pizza?"
✅ "Did he eat pizza?"

DID y DIDN'T ya marcan el pasado. El verbo principal siempre en infinitivo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transforma estas frases:

Afirmativa → Negativa:
1. "She watched TV last night."
2. "They went to the gym on Monday."

Afirmativa → Pregunta:
3. "He bought a new phone."
4. "You saw the match."

Preguntas WH-:
5. "She went to Italy." (Where)
6. "They left at seven." (Why)

Respuestas:
1. She didn't watch TV last night.
2. They didn't go to the gym on Monday.
3. Did he buy a new phone?
4. Did you see the match?
5. Where did she go?
6. Why did they leave at seven?`;

// ─────────────────────────────────────────────────────────────────────────────
// L1.5 — Past Simple — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L15 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — VERBOS REGULARES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Escribe la forma correcta del Past Simple:

1. He (study) _______ all weekend before the exam.
2. We (stop) _______ at a petrol station on the motorway.
3. She (arrive) _______ late to the meeting.
4. I (enjoy) _______ the concert a lot.
5. They (try) _______ the traditional food at the market.

Respuestas: 1. studied  2. stopped  3. arrived  4. enjoyed  5. tried

¿Cometiste algún error ortográfico? Repasa las reglas: CVC dobla consonante, consonante+y cambia a -ied, terminación en -e solo añade -d.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — VERBOS IRREGULARES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Escribe el pasado del verbo entre paréntesis:

1. She (go) _______ to the supermarket this morning.
2. I (have) _______ a terrible headache yesterday.
3. We (eat) _______ at a new Thai restaurant last Friday.
4. He (buy) _______ some flowers for his mother.
5. They (meet) _______ for the first time at a conference in 2019.

Respuestas: 1. went  2. had  3. ate  4. bought  5. met


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — PREGUNTAS Y NEGATIVAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Hay un error en estas frases? Corrígelas si es necesario:

1. "Did you enjoyed the trip?"
2. "She didn't go to work yesterday."
3. "Where did they went for dinner?"
4. "He didn't worked last Monday."
5. "Was you at the party?"

Respuestas:
1. ERROR → "Did you enjoy the trip?" (infinitivo después de DID)
2. CORRECTO
3. ERROR → "Where did they go for dinner?" (infinitivo después de DID)
4. ERROR → "He didn't work last Monday." (infinitivo después de DIDN'T)
5. ERROR → "Were you at the party?" (BE: were con you)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — COMPRENSIÓN LECTORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lee el texto y responde:

"Last Saturday I had a really nice day. I woke up early and went for a run in the park. Then I met my friend Ana for brunch — we ate eggs benedict and talked for two hours. In the afternoon I visited an exhibition at the city museum, but I didn't stay very long because I was tired. In the evening I watched a film at home and went to bed at ten. It was a perfect day."

Preguntas:
1. ¿Qué hizo por la mañana? (dos actividades)
2. ¿Con quién quedó para el brunch?
3. ¿Por qué no se quedó mucho tiempo en el museo?
4. ¿A qué hora se fue a dormir?

Respuestas:
1. Went for a run in the park / met Ana for brunch.
2. With her friend Ana.
3. Because she was tired.
4. At ten (o'clock).`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U1
// 10 preguntas × 1 punto = 10 pts totales. passingScore 80 → 8/10.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U1 = {
  title:        'Past Adventures — Unit 1 Assessment',
  description:  'Escribe un párrafo de seis a ocho frases describiendo lo que hiciste el fin de semana pasado. Usa al menos tres verbos regulares, tres verbos irregulares y una pregunta o negación en pasado simple.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         'Past Simple del verbo "study".',
      options:      ['studyed', 'studied', 'studed', 'studid'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         'Past Simple del verbo "stop".',
      options:      ['stoped', 'stopted', 'stopped', 'stopt'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál es el Past Simple de "go"?',
      options:      ['goed', 'gone', 'went', 'goes'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál es el Past Simple de "buy"?',
      options:      ['buyed', 'boughted', 'buyd', 'bought'],
      correctIndex: 3,
      points:       1,
    },
    {
      text:         'Elige la frase negativa correcta.',
      options:      ["She didn't went to the party.", "She didn't go to the party.", 'She not went to the party.', "She wasn't go to the party."],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Cuál es la pregunta correcta en Past Simple?',
      options:      ['Did she went to the cinema?', 'Did she go to the cinema?', 'She did go to the cinema?', 'Was she go to the cinema?'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Cuál es el Past Simple de "eat"?',
      options:      ['eated', 'aten', 'ate', 'eats'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"I _______ at home last night." ¿Qué forma del verbo BE es correcta?',
      options:      ['am', 'were', 'is', 'was'],
      correctIndex: 3,
      points:       1,
    },
    {
      text:         '¿Qué expresión temporal indica Past Simple?',
      options:      ['tomorrow morning', 'next week', 'last Friday', 'every day'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         'Past Simple del verbo "arrive".',
      options:      ['arriveed', 'arriven', 'arrived', 'arrivd'],
      correctIndex: 2,
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
    title:            'Past Adventures',
    order:            1,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L1.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'Regular Verbs — The -ed Rule',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L11,
      duration: 15,
      order:    1,
    }),

    // L1.2 — VIDEO
    // Canal recomendado: BBC Learning English
    // Búsqueda: "past simple regular verbs BBC Learning English"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: Talking About Your Past',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-a2-u1-l2',
      duration: 10,
      order:    2,
    }),

    // L1.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'Irregular Verbs — The Essential List',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L13,
      duration: 20,
      order:    3,
    }),

    // L1.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Questions & Negatives — Did and Didn\'t',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L14,
      duration: 15,
      order:    4,
    }),

    // L1.5 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'Past Simple — Quiz',
      type:     LESSON_TYPES.QUIZ,
      content:  CONTENT_L15,
      duration: 20,
      order:    5,
    }),

  ]);

  await upsert(Assessment, { unitId: unit._id }, {
    unitId:   unit._id,
    courseId,
    ...ASSESSMENT_U1,
  });
};
