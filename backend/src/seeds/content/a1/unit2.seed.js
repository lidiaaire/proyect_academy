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
// L2.1 — 1 to 100 — Numbers in English
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L21 = `Los números son la base de cualquier conversación práctica: precios, horarios, distancias, edades, teléfonos. Sin ellos no puedes comprar, reservar ni entender un anuncio. Esta lección te da todos los números que necesitas en inglés para el día a día.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEL 1 AL 20 — APRENDE ESTOS DE MEMORIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1  → one        11 → eleven
2  → two        12 → twelve
3  → three      13 → thirteen
4  → four       14 → fourteen
5  → five       15 → fifteen
6  → six        16 → sixteen
7  → seven      17 → seventeen
8  → eight      18 → eighteen
9  → nine       19 → nineteen
10 → ten        20 → twenty

Los números del 13 al 19 llevan todos el sufijo -teen. Lo importante a este nivel es no confundirlos con las decenas: thirteen ≠ thirty, fifteen ≠ fifty.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAS DECENAS — DEL 20 AL 100
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

20  → twenty
30  → thirty
40  → forty       ← Sin "u". No "fourty".
50  → fifty
60  → sixty
70  → seventy
80  → eighty
90  → ninety
100 → one hundred


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NÚMEROS COMPUESTOS — DEL 21 AL 99
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La fórmula es siempre: decena + guion + unidad.

21 → twenty-one
35 → thirty-five
47 → forty-seven
58 → fifty-eight
63 → sixty-three
79 → seventy-nine
96 → ninety-six

El guion es obligatorio en inglés escrito. "Twentyone" sin guion no es correcto.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOS NÚMEROS EN CONTEXTO REAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"My phone number is oh seven nine one, three four five, six seven eight."
"The total is forty-two pounds, please."
"She's thirty-five years old."
"The bus leaves from platform seventeen."
"Turn to page ninety-four."

En números de teléfono, el 0 se pronuncia "oh" en inglés británico. "Zero" también es correcto pero menos habitual en este contexto.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — TEENS VS. TENS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El error más frecuente con los números ingleses:

thirteen (13) ≠ thirty (30)
fourteen (14) ≠ forty (40)
fifteen (15)  ≠ fifty (50)
sixteen (16)  ≠ sixty (60)
seventeen (17) ≠ seventy (70)
eighteen (18) ≠ eighty (80)
nineteen (19) ≠ ninety (90)

La diferencia en inglés hablado está en el acento:
thir-TEEN → énfasis en la última sílaba
THIR-ty   → énfasis en la primera sílaba

En contextos de precios o cantidades importantes, si no estás seguro de haber entendido bien, pide confirmación: "Sorry, did you say thirteen or thirty?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Escribe en inglés:

1. 15    2. 40    3. 63    4. 18    5. 99    6. 100

Respuestas: 1. fifteen  2. forty  3. sixty-three  4. eighteen  5. ninety-nine  6. one hundred`;

// ─────────────────────────────────────────────────────────────────────────────
// L2.3 — What Time Is It? — Telling the Time
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L23 = `Saber decir la hora en inglés es imprescindible en cualquier viaje o conversación cotidiana. El sistema inglés tiene sus propias fórmulas y algunas diferencias importantes con el español.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CÓMO PREGUNTAR LA HORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"What time is it?"              → ¿Qué hora es? (informal)
"What's the time?"              → ¿Qué hora es? (también informal)
"Do you have the time?"         → ¿Tienes la hora? (muy habitual)
"Excuse me, what time is it?"   → versión educada con desconocidos


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAS HORAS EN PUNTO — O'CLOCK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"It's one o'clock."     → Es la una en punto.
"It's five o'clock."    → Son las cinco en punto.
"It's twelve o'clock."  → Son las doce en punto.

"O'clock" solo se usa con horas exactas, sin minutos. Nunca con medias ni cuartos.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUARTOS Y MEDIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

quarter past  →  y cuarto     (15 minutos después de la hora)
half past     →  y media      (30 minutos después de la hora)
quarter to    →  menos cuarto (15 minutos antes de la siguiente hora)

"It's quarter past three."   →  Las tres y cuarto.  (3:15)
"It's half past six."        →  Las seis y media.   (6:30)
"It's quarter to nine."      →  Las nueve menos cuarto.  (8:45)

"Quarter to nine" puede confundir: significa "un cuarto para las nueve", es decir, las ocho cuarenta y cinco.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MINUTOS — PAST Y TO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Del minuto 1 al 30  →  PAST (después de la hora)
Del minuto 31 al 59 →  TO   (antes de la siguiente hora)

"It's ten past four."          →  Las cuatro y diez.        (4:10)
"It's twenty past seven."      →  Las siete y veinte.       (7:20)
"It's twenty-five to two."     →  Las dos menos veinticinco. (1:35)
"It's five to eleven."         →  Las once menos cinco.     (10:55)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AM Y PM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

am  →  de la mañana   (de medianoche a las 11:59)
pm  →  de la tarde/noche (de las 12:00 a las 23:59)

"The meeting is at 9am."   →  La reunión es a las 9 de la mañana.
"I finish work at 6pm."    →  Termino el trabajo a las 6 de la tarde.

En inglés informal se puede escribir "9am", "9 am" o "9 a.m." — las tres formas son correctas.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HORA DIGITAL VS. TRADICIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En conversación cotidiana, la hora digital es cada vez más habitual:

"It's three forty-five."  →  Las tres cuarenta y cinco.
"It's seven fifteen."     →  Las siete quince.

Ambas formas son correctas. La forma tradicional (half past, quarter to) sigue siendo la más frecuente en conversación formal y en el Reino Unido.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA HORA EN CONTEXTO — HORARIOS Y CITAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"The train leaves at quarter past eight."
"The film starts at half past seven."
"My appointment is at ten to three."
"Dinner is at eight pm."

Para la hora de un evento, la preposición siempre es AT.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — "IN" CON LA HORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ "The meeting is in 9 o'clock."
✅ "The meeting is at 9 o'clock."

La hora siempre va con AT. El mismo AT que usas para "at the bus stop" lo usas para "at half past three".


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Cómo se dice en inglés?

1. Las 3:00      2. Las 7:30      3. Las 9:15
4. Las 11:45     5. Las 6:20      6. Las 4:50

Respuestas:
1. It's three o'clock.
2. It's half past seven.
3. It's quarter past nine.
4. It's quarter to twelve.
5. It's twenty past six.
6. It's ten to five.`;

// ─────────────────────────────────────────────────────────────────────────────
// L2.4 — Days, Months and Dates
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L24 = `Saber el nombre de los días, los meses y las fechas es esencial para hablar de planes, cumpleaños y citas. Esta lección también cubre las preposiciones correctas, que es donde más errores se cometen.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOS DÍAS DE LA SEMANA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Monday    →  lunes
Tuesday   →  martes
Wednesday →  miércoles
Thursday  →  jueves
Friday    →  viernes
Saturday  →  sábado
Sunday    →  domingo

En inglés, todos los días se escriben con mayúscula. Es una diferencia importante respecto al español.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOS MESES DEL AÑO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

January   →  enero       July      →  julio
February  →  febrero     August    →  agosto
March     →  marzo       September →  septiembre
April     →  abril       October   →  octubre
May       →  mayo        November  →  noviembre
June      →  junio       December  →  diciembre

Los meses también van siempre en mayúscula en inglés.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NÚMEROS ORDINALES — PARA LAS FECHAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Las fechas en inglés se dicen con números ordinales:

1st  → first       11th → eleventh     21st → twenty-first
2nd  → second      12th → twelfth      22nd → twenty-second
3rd  → third       13th → thirteenth   23rd → twenty-third
4th  → fourth      14th → fourteenth   30th → thirtieth
5th  → fifth       15th → fifteenth    31st → thirty-first
6th  → sixth       20th → twentieth
10th → tenth

1st, 2nd y 3rd son irregulares. A partir del 4, la regla es añadir -th.
Los que terminan en 1, 2 o 3 (excepto 11, 12, 13) siguen la misma lógica: 21st, 22nd, 23rd...


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CÓMO SE DICEN LAS FECHAS EN INGLÉS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Inglés británico → día + mes:
"the fifteenth of June"  /  "June the fifteenth"
Escrito: 15/06  o  15 June  o  15th June

Inglés americano → mes + día:
"June fifteenth"  /  "June the fifteenth"
Escrito: 06/15  o  June 15

El orden en la escritura es diferente entre BrE y AmE. Para evitar ambigüedad, lo más seguro es escribir el mes en letras: "15 March 2024".

Ejemplos completos:
"My birthday is on the third of April."
"The conference is on July the twenty-first."
"Christmas is on the twenty-fifth of December."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREPOSICIONES CON DÍAS, MESES Y FECHAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ON  →  con días de la semana y fechas específicas
"I work on Monday and Tuesday."
"The meeting is on the 5th of March."
"See you on Friday!"

IN  →  con meses, años y estaciones
"I was born in June."
"The course starts in September."
"She moved here in 2022."

AT  →  con la hora y festividades como punto de referencia
"The class is at 9am."
"I'll see you at Christmas."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — "IN MONDAY" O "ON JUNE"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ "I have a class in Monday."
✅ "I have a class on Monday."

❌ "The festival is on June."
✅ "The festival is in June."

Regla para recordarlo:
Días y fechas concretas → ON
Meses, años, estaciones → IN


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con ON, IN o AT:

1. My appointment is _______ Thursday _______ half past ten.
2. I was born _______ the 22nd of July.
3. The school closes _______ August.
4. See you _______ Monday morning!
5. The party is _______ Saturday, _______ 8pm.

Respuestas: 1. on / at  2. on  3. in  4. on  5. on / at`;

// ─────────────────────────────────────────────────────────────────────────────
// L2.5 — Numbers in Action — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L25 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — NÚMEROS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Escribe en inglés:

1. 13      2. 40      3. 17      4. 50
5. 22      6. 68      7. 99      8. 100

Respuestas:
1. thirteen  2. forty  3. seventeen  4. fifty
5. twenty-two  6. sixty-eight  7. ninety-nine  8. one hundred

Atención: ¿Has escrito "fourty"? El correcto es "forty" (sin u).
¿Has confundido 13 (thirteen) con 30 (thirty)? Son muy distintos en inglés hablado: thir-TEEN vs. THIR-ty.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — LA HORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Cómo se dice en inglés?

1. 4:00      2. 9:30      3. 11:15
4. 2:45      5. 6:10      6. 7:55

Respuestas:
1. It's four o'clock.
2. It's half past nine.
3. It's quarter past eleven.
4. It's quarter to three.
5. It's ten past six.
6. It's five to eight.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — DÍAS Y MESES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Qué día o mes es?

1. El tercer día de la semana (después del lunes y el martes): ___________
2. El mes después de octubre: ___________
3. El primer día del fin de semana (BrE): ___________
4. El mes de verano entre junio y agosto: ___________
5. El día que va entre miércoles y viernes: ___________

Respuestas:
1. Wednesday  2. November  3. Saturday  4. July  5. Thursday


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — FECHAS Y PREPOSICIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con ON, IN o AT, y escribe el ordinal correcto:

1. My birthday is _______ the _______ (3) of March.
2. The exam is _______ Friday _______ 10am.
3. I usually go on holiday _______ August.
4. The concert is _______ the _______ (21) of June.
5. School starts _______ September _______ 9 o'clock.

Respuestas:
1. on / third  2. on / at  3. in  4. on / twenty-first  5. in / at


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE E — SITUACIÓN REAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lee este texto y responde las preguntas:

"Hi! My name is Lucia. I was born on the fourteenth of August. I'm twenty-six years old. I work Monday to Friday. I start work at eight thirty and finish at half past five. My favourite month is December because it's Christmas!"

1. ¿Cuándo es el cumpleaños de Lucia?
2. ¿Cuántos años tiene?
3. ¿Qué días trabaja?
4. ¿A qué hora empieza a trabajar?
5. ¿A qué hora termina?

Respuestas:
1. On the fourteenth of August. / 14th August.
2. Twenty-six. / 26.
3. Monday to Friday.
4. At eight thirty. / At 8:30.
5. At half past five. / At 5:30.`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U2
// Parte A: 8 preguntas × 1 punto = 8 pts totales.
// Parte B: enunciado breve en description (rúbrica es documentación editorial).
// passingScore 75 → 6/8 = 75%
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U2 = {
  title:        'Numbers & Time — Unit 2 Assessment',
  description:  'Escribe cinco frases sobre ti: tu fecha de nacimiento, tu día favorito de la semana, la hora a la que te despiertas, cuántos años tienes y a qué hora empieza tu clase o trabajo.',
  passingScore: 75,
  maxAttempts:  3,
  questions: [
    {
      text:         '¿Cómo se escribe el número 40 en inglés?',
      options:      ['fourty', 'forty', 'fourtie', 'fortie'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Qué número representa "seventeen" en inglés?',
      options:      ['70', '7', '17', '77'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         'Son las 3:30. ¿Cómo se dice en inglés?',
      options:      ['half past four', 'three and a half', 'half past three', 'thirty past three'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"It\'s quarter to eight." ¿Qué hora es?',
      options:      ['8:15', '7:45', '8:45', '7:15'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Qué preposición es correcta? "I have a meeting ___ Monday."',
      options:      ['in', 'at', 'on', 'by'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Qué preposición es correcta? "The course starts ___ September."',
      options:      ['on', 'in', 'at', 'by'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Cómo se dice la fecha 15 de junio en inglés?',
      options:      ['June fifteen', 'the fifteen of June', 'the fifteenth of June', 'fifteen June'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál es el número ordinal correcto para el 1?',
      options:      ['oneth', 'first', 'firth', 'onst'],
      correctIndex: 1,
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
    title:            'Numbers & Time',
    order:            2,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L2.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    '1 to 100 — Numbers in English',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L21,
      duration: 15,
      order:    1,
    }),

    // L2.2 — VIDEO
    // Canal recomendado: BBC Learning English
    // Búsqueda: "numbers in English everyday situations BBC Learning English"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: Numbers in Real Situations',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-u2-l2',
      duration: 10,
      order:    2,
    }),

    // L2.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'What Time Is It? — Telling the Time',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L23,
      duration: 15,
      order:    3,
    }),

    // L2.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Days, Months and Dates',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L24,
      duration: 15,
      order:    4,
    }),

    // L2.5 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'Numbers in Action — Quiz',
      type:     LESSON_TYPES.QUIZ,
      content:  CONTENT_L25,
      duration: 20,
      order:    5,
    }),

  ]);

  await upsert(Assessment, { unitId: unit._id }, {
    unitId:   unit._id,
    courseId,
    ...ASSESSMENT_U2,
  });
};
