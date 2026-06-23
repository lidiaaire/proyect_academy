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
// L6.1 — Jobs and the Workplace — Vocabulary
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L61 = `Hablar de tu trabajo en inglés es una de las situaciones más frecuentes en una conversación: presentaciones profesionales, networking, entrevistas, o simplemente contarle a alguien a qué te dedicas. Esta lección te da el vocabulario base.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROFESIONES HABITUALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

accountant     →  contable / contador
architect      →  arquitecto/a
chef           →  chef / cocinero/a profesional
designer       →  diseñador/a
doctor / GP    →  médico/a
engineer       →  ingeniero/a
journalist     →  periodista
lawyer         →  abogado/a
manager        →  gerente / director/a
nurse          →  enfermero/a
pharmacist     →  farmacéutico/a
programmer     →  programador/a
receptionist   →  recepcionista
salesperson    →  vendedor/a
teacher        →  profesor/a
vet            →  veterinario/a

Cómo describir tu profesión:
"I'm a teacher."         →  (profesión con artículo "a")
"I work as a designer."  →  Trabajo como diseñadora.
"I'm in marketing."      →  Trabajo en marketing.
"I work for a tech company."  →  Trabajo para una empresa de tecnología.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VOCABULARIO DEL ENTORNO LABORAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

office         →  oficina
meeting        →  reunión
deadline       →  fecha límite / plazo de entrega
colleague      →  compañero/a de trabajo
boss / manager →  jefe/a / director/a
salary / wages →  salario (mensual / por horas)
promotion      →  ascenso
overtime       →  horas extra
remote work    →  teletrabajo
shift          →  turno
contract       →  contrato
interview      →  entrevista
CV / résumé    →  currículum

Frases habituales en el trabajo:
"I have a meeting at three this afternoon."
"The deadline for this project is Friday."
"I work from home three days a week."
"My colleague is helping me with this report."
"I've just been offered a promotion!"
"I'm working overtime this week to finish the project."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESCRIBIR TU TRABAJO — ESTRUCTURAS CLAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"What do you do?" / "What do you do for a living?"  →  ¿A qué te dedicas?

Respuestas posibles:
"I'm a nurse. I work at a hospital in the city centre."
"I work as a graphic designer for an advertising agency."
"I'm in finance — I work for an investment bank."
"I'm self-employed — I run my own business."
"I'm a student at the moment, but I work part-time as a waiter."

Nota: "What do you do?" es LA pregunta para preguntar por la profesión.
❌ "What is your work?"  →  Suena no nativo.
✅ "What do you do?" / "What do you do for a living?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPRESIONES HABITUALES SOBRE EL TRABAJO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

to be made redundant  →  quedarse sin trabajo por recortes (no por culpa propia)
to be promoted        →  ser ascendido/a
to resign / to quit   →  dimitir / dejar el trabajo voluntariamente
to be fired           →  ser despedido (por causa)
to be on sick leave   →  estar de baja médica
full-time             →  jornada completa
part-time             →  jornada parcial
freelance             →  autónomo/a / freelance

"She resigned last month to start her own company."
"He was made redundant when the company downsized."
"I work part-time on Mondays and Wednesdays."
"She went freelance two years ago and loves the flexibility."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Cómo lo dirías en inglés?

1. ¿A qué te dedicas? (pregunta natural)
2. Trabajo para una empresa de software.
3. Mi compañero de trabajo me ayuda mucho.
4. Tengo una fecha límite el viernes.
5. Estoy trabajando horas extra esta semana.

Posibles respuestas:
1. "What do you do?" / "What do you do for a living?"
2. "I work for a software company."
3. "My colleague helps me a lot."
4. "I have a deadline on Friday."
5. "I'm working overtime this week."`;

// ─────────────────────────────────────────────────────────────────────────────
// L6.3 — Hobbies and Free Time — What Do You Do?
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L63 = `Hablar de aficiones e intereses es esencial en cualquier conversación informal. Saber describir qué haces en tu tiempo libre — con el vocabulario y las preposiciones correctas — te permite conectar de forma natural con cualquier angloparlante.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTIVIDADES DE OCIO — VOCABULARIO ESENCIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

reading             →  leer
cooking             →  cocinar
travelling          →  viajar
painting            →  pintar
photography         →  fotografía
gardening           →  jardinería
dancing             →  bailar
hiking              →  senderismo
cycling             →  ciclismo
swimming            →  natación
yoga                →  yoga
playing video games →  jugar a videojuegos
watching films      →  ver películas
listening to music  →  escuchar música
going to concerts   →  ir a conciertos
volunteering        →  voluntariado


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEPORTES — PLAY / DO / GO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En inglés, el verbo que usas con los deportes depende del tipo de actividad:

PLAY → deportes de equipo y competición con pelota
play football / tennis / basketball / golf / chess

DO → deportes o actividades individuales sin pelota
do yoga / karate / gymnastics / athletics

GO → deportes que terminan en -ing (actividades de movimiento)
go swimming / cycling / hiking / running / skiing / surfing

"I play tennis every Saturday morning."
"She does yoga twice a week."
"We go hiking in the mountains at the weekend."
"He goes running before work every day."

Atención:
❌ "I do football."    →  ✅ "I play football."
❌ "I play swimming."  →  ✅ "I go swimming."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRECUENCIA — ¿CON QUÉ REGULARIDAD?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

every day           →  todos los días
twice a week        →  dos veces a la semana
once a month        →  una vez al mes
at weekends         →  los fines de semana
in the evenings     →  por las tardes / noches
occasionally        →  de vez en cuando
hardly ever         →  casi nunca
never               →  nunca

"I go to the gym three times a week."
"I hardly ever watch TV — I prefer reading."
"She plays the piano every evening after dinner."
"We occasionally go to the theatre, but not very often."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HABLAR DE TUS AFICIONES — CONVERSACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"What do you do in your free time?"
"I'm really into photography. I go out most weekends to take pictures."
"Oh really? What kind of photos do you take?"
"Mostly landscapes — I love hiking, so I combine the two."
"That's great. Do you do any sport?"
"Yes, I play tennis twice a week and I go swimming occasionally."
"I'd love to get into tennis. Is it hard to learn?"
"Not at all! You should try it."

Expresiones para hablar de aficiones:
"I'm really into..."    →  Soy muy aficionado/a a... (me encanta)
"I'm passionate about..." →  Me apasiona...
"I'm keen on..."        →  Me gusta mucho...
"I used to play..."     →  Antes jugaba a... (ya no)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige el verbo correcto: play, do o go:

1. I _______ yoga every morning before breakfast.
2. She _______ swimming twice a week.
3. They _______ basketball in the school team.
4. He _______ running in the park at the weekends.
5. We _______ karate — we've been doing it for three years.

Respuestas: 1. do  2. goes  3. play  4. goes  5. do`;

// ─────────────────────────────────────────────────────────────────────────────
// L6.4 — I Love Doing... — Gerunds and Infinitives
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L64 = `Hay una decisión gramatical que los hablantes de inglés toman constantemente sin pensarlo: después de ciertos verbos, viene un GERUNDIO (-ing); después de otros, viene un INFINITIVO (to + verbo). No es aleatorio — cada verbo "pide" una forma específica.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERBOS SEGUIDOS DE GERUNDIO (-ING)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estos verbos siempre van seguidos de -ing:

like       →  "I like reading before bed."
love       →  "She loves cooking Italian food."
hate       →  "He hates waiting in queues."
enjoy      →  "We enjoy hiking in the mountains."
don't mind →  "I don't mind working late occasionally."
can't stand →  "She can't stand commuting — it drives her mad."
finish     →  "Have you finished reading that book?"
avoid      →  "I avoid eating too much sugar."
consider   →  "Are you considering moving to another city?"
keep       →  "He keeps making the same mistake."
miss       →  "I miss living near the sea."
practise   →  "You should practise speaking English every day."

Regla: gerundio después de estos verbos, siempre.

"I love going to the cinema on Friday nights."
"She enjoys playing the guitar after work."
"We can't stand sitting in traffic — we always take the train."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERBOS SEGUIDOS DE INFINITIVO (TO + VERBO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estos verbos siempre van seguidos de to + infinitivo:

want       →  "I want to learn how to cook."
would like →  "She'd like to visit Japan one day."
hope       →  "We hope to get tickets for the concert."
plan       →  "He plans to retire at sixty."
decide     →  "They decided to take the train."
need       →  "I need to finish this report by Friday."
manage     →  "She managed to get a promotion last year."
afford     →  "We can't afford to travel this summer."
offer      →  "He offered to help with the project."
promise    →  "I promise to call you when I land."

"I'd like to improve my English before the interview."
"She decided to change careers and study architecture."
"We can't afford to eat out every weekend."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LIKE + GERUNDIO VS WOULD LIKE + INFINITIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Esta es una distinción muy importante:

LIKE + -ing → hablar de un gusto general, algo que haces habitualmente
"I like cooking." → Me gusta cocinar (en general, es algo que hago).

WOULD LIKE + to → desear hacer algo concreto, equivale a "me gustaría"
"I'd like to cook something special tonight." → Me gustaría cocinar algo especial esta noche.

Más ejemplos:
"I love playing football." (actividad habitual que te gusta)
"I'd love to play for a real team one day." (deseo o aspiración)

"She hates waiting." (le molesta esperar en general)
"She doesn't want to wait any longer." (no quiere esperar en este momento)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN CONTEXTO — HABLANDO DE TIEMPO LIBRE Y PLANES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"What do you like doing at the weekend?"
"I enjoy hiking and I love photographing landscapes. I'd like to do a photography course one day."
"Do you mind working at the weekend sometimes?"
"I don't mind doing it occasionally, but I hate missing family time."
"Have you considered freelancing?"
"Yes, I'm thinking about it. I'd need to plan it carefully, though."
"You should avoid leaving too quickly — build up some savings first."
"I know — I plan to save for a year before making any decisions."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — DOBLE INFINITIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ "I enjoy to read."          →  ✅ "I enjoy reading."
❌ "She wants going to Paris." →  ✅ "She wants to go to Paris."
❌ "He hates to wait."         →  Posible en AmE, pero "He hates waiting" es la forma estándar.
❌ "I'd like eating sushi."    →  ✅ "I'd like to eat sushi."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con gerundio (-ing) o infinitivo (to):

1. I enjoy _______ (read) historical novels.
2. She'd like _______ (travel) to New Zealand someday.
3. He can't stand _______ (commute) to work every day.
4. We decided _______ (move) to the countryside.
5. Do you mind _______ (wait) for a few minutes?
6. I hope _______ (get) a promotion this year.

Respuestas:
1. reading   2. to travel   3. commuting   4. to move   5. waiting   6. to get`;

// ─────────────────────────────────────────────────────────────────────────────
// L6.5 — Work & Free Time — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L65 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — VOCABULARIO DE TRABAJO Y OCIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Cómo se dice en inglés?

1. Compañero de trabajo: ___________
2. Fecha límite de entrega: ___________
3. Horas extra: ___________
4. Quedarse sin trabajo por recortes: ___________
5. Jornada parcial: ___________

Respuestas:
1. colleague   2. deadline   3. overtime   4. to be made redundant   5. part-time


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — PLAY / DO / GO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige el verbo correcto:

1. I _______ yoga three times a week.
2. She _______ tennis every Saturday.
3. They _______ running in the park at 7am.
4. He _______ karate since he was eight years old.
5. We _______ golf at the club on Sundays.

Respuestas: 1. do   2. plays   3. go   4. has done / does   5. play


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — GERUNDIOS E INFINITIVOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Hay error? Corrígelo:

1. "I enjoy to cook for my friends."
2. "She wants to change her job."
3. "He hates to miss his family."
4. "We'd like visiting Rome next summer."
5. "I can't stand waiting in queues."

Respuestas:
1. ERROR → "I enjoy cooking for my friends." (enjoy + -ing)
2. CORRECTO (want + to)
3. Correcto en AmE; en BrE sería más natural "He hates missing his family."
4. ERROR → "We'd like to visit Rome next summer." (would like + to)
5. CORRECTO (can't stand + -ing)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — COMPRENSIÓN LECTORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lee el texto y responde:

"My name is Tom and I'm a freelance graphic designer. I used to work full-time for an agency, but I decided to go freelance three years ago and I love it. I enjoy working from home — I can't stand commuting. In my free time I love going cycling and I play chess online twice a week. I'd like to take up photography too, but I don't have enough time at the moment. My main problem is deadlines — I hate missing them, so I always try to finish projects early."

Preguntas:
1. ¿Qué trabajo hace Tom?
2. ¿Por qué prefiere trabajar desde casa?
3. ¿Qué dos cosas hace en su tiempo libre?
4. ¿Qué le gustaría aprender en el futuro?

Respuestas:
1. He's a freelance graphic designer.
2. He can't stand commuting.
3. Cycling / going cycling and playing chess online.
4. Photography.`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U6
// 10 preguntas × 1 punto = 10 pts totales. passingScore 80 → 8/10.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U6 = {
  title:        'Work & Free Time — Unit 6 Assessment',
  description:  'Escribe un párrafo sobre tu trabajo o estudios y otro sobre tus aficiones. Usa al menos cuatro verbos seguidos de gerundio y dos seguidos de infinitivo. Incluye vocabulario laboral y las expresiones play/do/go con deportes.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '¿Qué significa "deadline" en el contexto laboral?',
      options:      ['Una reunión importante', 'El salario mensual', 'La fecha límite de entrega', 'El contrato de trabajo'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cómo preguntas a alguien a qué se dedica de forma natural?',
      options:      ['What is your work?', 'What do you do?', 'Which is your job?', 'What work are you?'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Qué verbo se usa con "yoga"?',
      options:      ['play yoga', 'go yoga', 'do yoga', 'make yoga'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Qué verbo se usa con "swimming"?',
      options:      ['play swimming', 'go swimming', 'do swimming', 'make swimming'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Cuál es la frase correcta con "enjoy"?',
      options:      ['I enjoy to read.', 'I enjoy read.', 'I enjoy reading.', 'I enjoy to reading.'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál es la frase correcta con "would like"?',
      options:      ["I'd like visiting Paris.", "I'd like to visit Paris.", "I'd like visit Paris.", "I'd like visited Paris."],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Qué significa "to be made redundant"?',
      options:      ['Ser ascendido.', 'Dimitir voluntariamente.', 'Quedarse sin trabajo por recortes.', 'Ser despedido por mal rendimiento.'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"She _______ waiting in queues." ¿Qué verbo es correcto?',
      options:      ["can't stand", 'wants', 'plans', 'decides'],
      correctIndex: 0,
      points:       1,
    },
    {
      text:         '¿Cuál es la diferencia entre "I like cooking" y "I\'d like to cook"?',
      options:      ['No hay diferencia.', '"I like cooking" es un gusto general; "I\'d like to cook" expresa un deseo concreto.', '"I\'d like to cook" es más formal.', '"I like cooking" es incorrecto.'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Cuál es la frase correcta con "decide"?',
      options:      ['She decided changing jobs.', 'She decided to change jobs.', 'She decided change jobs.', 'She decided in changing jobs.'],
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
    title:            'Work & Free Time',
    order:            6,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L6.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'Jobs and the Workplace — Vocabulary',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L61,
      duration: 15,
      order:    1,
    }),

    // L6.2 — VIDEO
    // Canal recomendado: BBC Learning English
    // Búsqueda: "talking about your job work English BBC Learning English"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: Talking About Your Job',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-a2-u6-l2',
      duration: 10,
      order:    2,
    }),

    // L6.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'Hobbies and Free Time — What Do You Do?',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L63,
      duration: 15,
      order:    3,
    }),

    // L6.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    "I Love Doing... — Gerunds and Infinitives",
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L64,
      duration: 20,
      order:    4,
    }),

    // L6.5 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'Work & Free Time — Quiz',
      type:     LESSON_TYPES.QUIZ,
      content:  CONTENT_L65,
      duration: 20,
      order:    5,
    }),

  ]);

  await upsert(Assessment, { unitId: unit._id }, {
    unitId:   unit._id,
    courseId,
    ...ASSESSMENT_U6,
  });
};
