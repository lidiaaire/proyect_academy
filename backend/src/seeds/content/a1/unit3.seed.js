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
// L3.1 — This Is My Family — Vocabulary
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L31 = `Hablar de la familia es una de las primeras cosas que haces cuando conoces a alguien en inglés. Esta lección te da el vocabulario para presentar a los tuyos y entender cuando otros hablan de los suyos.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA FAMILIA NUCLEAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

mother / mum (BrE) / mom (AmE)  →  madre
father / dad                     →  padre
parents                          →  padres
son                              →  hijo
daughter                         →  hija
children                         →  hijos (en general)
brother                          →  hermano
sister                           →  hermana
siblings                         →  hermanos (en general)

"I have two brothers and one sister."
"My parents live in Madrid."
"She has a son and a daughter."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA FAMILIA EXTENSA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

grandmother / grandma  →  abuela
grandfather / grandpa  →  abuelo
grandparents           →  abuelos
aunt                   →  tía
uncle                  →  tío
cousin                 →  primo / prima  (una sola palabra para los dos)
nephew                 →  sobrino
niece                  →  sobrina

"My grandmother is seventy-eight years old."
"I have four cousins — two boys and two girls."
"His nephew is only three months old."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RELACIONES DE PAREJA Y MATRIMONIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

husband     →  marido / esposo
wife        →  mujer / esposa
partner     →  pareja (término neutro, muy habitual en inglés)
boyfriend   →  novio
girlfriend  →  novia
ex          →  ex (informal, muy frecuente)

"My husband works in London."
"This is my partner, James."

En inglés moderno, "partner" es el término más neutro para cualquier relación de pareja. Es más inclusivo que "husband/wife" porque no implica estado civil ni género.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FAMILIAS MIXTAS Y RECOMPUESTAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

stepfather / stepmum  →  padrastro / madrastra
stepson / stepdaughter →  hijastro / hijastra
half-brother / half-sister →  hermanastro / hermanastra (medio hermano)

"My stepfather is very kind."
"She has a half-sister from her mother's first marriage."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRESENTAR A LA FAMILIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"This is my sister, Ana. She's a nurse."
"These are my parents. My dad is retired and my mum is a teacher."
"I'd like you to meet my husband, Carlos."
"Have you met my cousin? His name is Pablo."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — "COUSIN" ES PARA LOS DOS GÉNEROS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En español tenemos "primo" y "prima". En inglés existe una sola palabra: "cousin".

❌ "My male cousin is called Diego." → correcto gramaticalmente pero innecesariamente largo
✅ "My cousin Diego is twenty years old."

Si necesitas aclarar el género, se añade "male cousin" o "female cousin", pero en la práctica casi nunca hace falta.

Otro error frecuente: "nephew" y "niece" se confunden entre sí.
nephew → sobrino (masculino)
niece  → sobrina (femenino)

Truco: niece empieza por "ni" como en "niña".


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Cómo se dice en inglés?

1. La hija de tu tía o tu tío: ___________
2. El hijo de tu hermana: ___________
3. La madre de tu madre: ___________
4. El hermano de tu padre: ___________
5. Los hijos de tus hijos (cuando sean mayores): ___________

Respuestas: 1. cousin  2. nephew  3. grandmother  4. uncle  5. grandchildren`;

// ─────────────────────────────────────────────────────────────────────────────
// L3.3 — He Is / She Is — Describing People
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L33 = `Cuando describes a alguien, necesitas dos cosas: los adjetivos correctos y la forma verbal correcta en tercera persona. Esta lección cubre los dos.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HE IS / SHE IS / THEY ARE — LA BASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I am     →  yo soy / estoy
You are  →  tú eres / estás
He is    →  él es / está
She is   →  ella es / está
They are →  ellos/ellas son / están
We are   →  nosotros somos / estamos

En descripción de personas, las contracciones son lo más natural:

"He's tall."  /  "She's very friendly."  /  "They're sisters."

Contraída:
He is → He's
She is → She's
They are → They're


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESCRIPCIÓN FÍSICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Altura:
tall      →  alto/a
short     →  bajo/a
medium height  →  estatura media

Complexión:
slim / thin    →  delgado/a
well-built     →  corpulento/a, de complexión fuerte
overweight     →  con sobrepeso

Edad:
young     →  joven
old       →  mayor / viejo/a
middle-aged →  de mediana edad

Pelo:
long hair    →  pelo largo
short hair   →  pelo corto
straight hair →  pelo liso
curly hair   →  pelo rizado
dark hair    →  pelo oscuro
fair hair    →  pelo rubio
red hair     →  pelo pelirrojo
bald         →  calvo/a

Ojos:
brown eyes  →  ojos marrones
blue eyes   →  ojos azules
green eyes  →  ojos verdes


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESCRIPCIÓN DE CARÁCTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

friendly    →  simpático/a, amigable
kind        →  amable, buena persona
funny       →  gracioso/a
intelligent →  inteligente
shy         →  tímido/a
quiet       →  tranquilo/a, callado/a
talkative   →  hablador/a
hard-working →  trabajador/a


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESCRIBIR EN CONTEXTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"My sister is tall and slim. She has long, dark hair and brown eyes. She's very friendly and hard-working."

"My grandfather is old but very active. He's got short white hair and he's quite tall. He's funny and kind."

"My cousins are young — they're twelve and fifteen. They're both talkative and very funny."

Nota: en inglés es habitual decir "He's got" (= He has got) como alternativa a "He has" para describir características físicas. Ambas son correctas:
"She has blue eyes." = "She's got blue eyes."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — "HE HAVE" EN VEZ DE "HE HAS"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El error más frecuente en tercera persona del singular:

❌ "He have a sister."
✅ "He has a sister."

❌ "She have brown eyes."
✅ "She has brown eyes."

En tercera persona del singular (he, she, it), el verbo "have" cambia a "has". Esta regla se aplica a todos los verbos en presente simple: he works, she lives, it costs.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Describe a estas personas con las palabras entre paréntesis:

1. Tu madre: (tall, friendly, dark hair)
2. Tu hermano: (young, funny, short hair)
3. Tus abuelos: (old, kind, retired)

Escribe también tres frases describiendo a alguien de tu familia real.`;

// ─────────────────────────────────────────────────────────────────────────────
// L3.4 — My, Your, His, Her — Possessives
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L34 = `Los posesivos son indispensables para hablar de la familia. "This is my sister", "Her name is Ana", "His brother is a doctor" — todo esto usa posesivos. Son pocos y fáciles de aprender, pero tienen una trampa importante para hispanohablantes.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOS ADJETIVOS POSESIVOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

my      →  mi / mis
your    →  tu / tus / su / sus (de usted)
his     →  su / sus (de él)
her     →  su / sus (de ella)
its     →  su / sus (de una cosa o animal)
our     →  nuestro/a / nuestros/as
their   →  su / sus (de ellos/ellas)

Los adjetivos posesivos van siempre delante del nombre. Nunca se usan solos.

"This is my father."     →  Este es mi padre.
"What's your name?"      →  ¿Cómo te llamas?
"His sister is a doctor."  →  Su hermana (de él) es médica.
"Her brother lives in Paris." →  Su hermano (de ella) vive en París.
"Our house is small but nice." →  Nuestra casa es pequeña pero bonita.
"Their children go to school here." →  Sus hijos van al colegio aquí.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HIS O HER — EL POSESIVO CONCUERDA CON EL POSEEDOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La diferencia más importante entre el español y el inglés con los posesivos:

En español, el posesivo concuerda con la cosa poseída:
"el libro de María → su libro" (concuerda con libro, que es masculino... o neutro en este sistema)

En inglés, el posesivo concuerda con el poseedor:
"María's book → her book" (her porque María es mujer, sin importar lo que sea el libro)

Ejemplos:
"Carlos has a sister. His sister is a nurse."
→ His porque Carlos es hombre.

"Ana has a brother. Her brother lives in London."
→ Her porque Ana es mujer.

"The dog has a toy. Its toy is a ball."
→ Its porque se refiere a un animal o cosa.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOS POSESIVOS EN CONTEXTO — PRESENTANDO FAMILIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"This is my family. My parents are called Juan and Rosa. My father is a teacher and my mother works in a hospital. I have one brother. His name is Miguel and he's twenty. We also have a dog. Its name is Max."

"Sarah lives with her husband and their two children. Her husband's name is David. Their son is eight and their daughter is five."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — "IT'S" VS. "ITS"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Este error es tan frecuente que incluso hablantes nativos lo cometen por escrito.

its   →  posesivo. "The cat licks its paws."
it's  →  contracción de "it is". "It's a beautiful day."

La diferencia es el apóstrofo. El posesivo "its" NUNCA lleva apóstrofo.

❌ "The dog and it's owner are outside."
✅ "The dog and its owner are outside."

❌ "Its very cold today."
✅ "It's very cold today."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige el posesivo correcto:

1. "María has a cat. _______ cat is called Luna." (María)
2. "Tom has a sister. _______ sister is a doctor." (Tom)
3. "My parents have a house. _______ house is in Valencia." (los padres)
4. "I live with _______ grandmother. She's wonderful." (yo)
5. "Ana and Carlos have two children. _______ children go to school here." (Ana y Carlos)

Respuestas: 1. Her  2. His  3. Their  4. my  5. Their`;

// ─────────────────────────────────────────────────────────────────────────────
// L3.5 — Who's Who? — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L35 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — VOCABULARIO DE FAMILIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Qué relación es?

1. La madre de tu madre: ___________
2. El hijo de tu hermana: ___________
3. El hermano de tu padre: ___________
4. La hija de tu tío: ___________
5. El marido de tu hija: ___________

Respuestas:
1. grandmother  2. nephew  3. uncle  4. cousin  5. son-in-law


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — HE IS / SHE IS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Corrige los errores:

1. "She have two brothers."
2. "He are very tall."
3. "My sister have blue eyes."
4. "They is young."
5. "He have got dark hair."

Respuestas:
1. She has two brothers.
2. He is very tall.
3. My sister has blue eyes.
4. They are young.
5. He has got dark hair.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — POSESIVOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige el posesivo correcto:

1. "Carlos has a sister. _______ sister is twenty-two." (his / her)
2. "Ana has a husband. _______ husband is a teacher." (his / her)
3. "We have a dog. _______ name is Rex." (its / it's)
4. "My parents live in Seville. _______ house is near the cathedral." (their / our)
5. "I have a brother. _______ name is David." (my / his)

Respuestas: 1. His  2. Her  3. Its  4. Their  5. His


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — DESCRIPCIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lee y responde:

"This is my family. My mother is fifty-two years old. She's tall and slim with short, fair hair. She's very kind and hard-working. My father is fifty-five. He's not very tall — he's medium height. He's got dark hair and brown eyes. He's funny and very intelligent. My sister is twenty-eight. She has long, curly hair and blue eyes. She's friendly and talkative."

1. ¿Qué color de pelo tiene la madre?
2. ¿Cuántos años tiene el padre?
3. ¿Cómo se describe el carácter de la hermana?
4. ¿De qué color son los ojos del padre?
5. Describe a la hermana en tus propias palabras usando he is / she is.

Respuestas:
1. Fair hair. / Pelo rubio.
2. Fifty-five. / 55 years old.
3. Friendly and talkative.
4. Brown eyes.
5. Respuesta libre. Ejemplo: "She is twenty-eight. She has long, curly hair and blue eyes. She is friendly and talkative."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE E — SITUACIÓN REAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Escribe cuatro frases sobre tu familia usando vocabulario de esta unidad. Incluye:

- Un miembro de tu familia extensa (abuelo/a, tío/a, primo/a...)
- Una descripción física (tall, short, dark hair...)
- Un rasgo de carácter (kind, funny, hard-working...)
- Un posesivo (his, her, their, my...)`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U3
// 10 preguntas × 1 punto = 10 pts totales.
// passingScore 80 → 8/10 = 80%
// Parte B en description: enunciado para el estudiante.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U3 = {
  title:        'People & Relationships — Unit 3 Assessment',
  description:  'Describe tu familia en inglés. Escribe cinco frases: usa he is, she is o they are para describir a tres personas, y utiliza los posesivos my, his, her o their en al menos dos frases.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '¿Qué significa "grandmother" en español?',
      options:      ['madre', 'abuela', 'tía', 'prima'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Cómo se dice "sobrino" (masculino) en inglés?',
      options:      ['cousin', 'nephew', 'brother-in-law', 'stepbrother'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         'En inglés, "cousin" puede referirse a...',
      options:      ['solo al primo', 'solo a la prima', 'tanto al primo como a la prima', 'al sobrino o a la sobrina'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         'Elige la forma correcta: "She ___ twenty-five years old."',
      options:      ['have', 'are', 'is', 'be'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"My brother is very ___." ¿Qué adjetivo significa "alto"?',
      options:      ['young', 'tall', 'slim', 'old'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"María has a daughter. ___ daughter is a doctor." ¿Qué posesivo es correcto?',
      options:      ['His', 'My', 'Their', 'Her'],
      correctIndex: 3,
      points:       1,
    },
    {
      text:         '"Tom and Lucy are married. ___ son is called Jack." ¿Qué posesivo es correcto?',
      options:      ['His', 'Her', 'Their', 'Our'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"This is my father. ___ name is Robert." ¿Qué posesivo es correcto?',
      options:      ['Her', 'His', 'Their', 'Its'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Cuál de estas frases es correcta en inglés?',
      options:      ['She have two brothers.', 'She has two brother.', 'She has two brothers.', 'She have two brother.'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"My mother\'s brother is my ___." ¿Qué palabra completa la frase?',
      options:      ['grandfather', 'cousin', 'uncle', 'nephew'],
      correctIndex: 2,
      points:       1,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Seed
// ─────────────────────────────────────────────────────────────────────────────
module.exports = async (courseId) => {
  const unit = await upsert(Unit, { courseId, order: 3 }, {
    courseId,
    title:            'People & Relationships',
    order:            3,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L3.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'This Is My Family — Vocabulary',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L31,
      duration: 15,
      order:    1,
    }),

    // L3.2 — VIDEO
    // Canal recomendado: BBC Learning English / engVid
    // Búsqueda: "family vocabulary English beginner A1 BBC"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: Meet the Families',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-u3-l2',
      duration: 10,
      order:    2,
    }),

    // L3.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'He Is / She Is — Describing People',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L33,
      duration: 15,
      order:    3,
    }),

    // L3.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'My, Your, His, Her — Possessives',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L34,
      duration: 15,
      order:    4,
    }),

    // L3.5 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    "Who's Who? — Quiz",
      type:     LESSON_TYPES.QUIZ,
      content:  CONTENT_L35,
      duration: 20,
      order:    5,
    }),

  ]);

  await upsert(Assessment, { unitId: unit._id }, {
    unitId:   unit._id,
    courseId,
    ...ASSESSMENT_U3,
  });
};
