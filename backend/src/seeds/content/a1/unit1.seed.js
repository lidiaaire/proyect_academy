'use strict';

const { LESSON_TYPES }     = require('../../../config/constants');
const { upsert }           = require('../../helpers');
const UnitRepository       = require('../../../repositories/unit.repository');
const LessonRepository     = require('../../../repositories/lesson.repository');

const Unit   = UnitRepository.model;
const Lesson = LessonRepository.model;

// ─────────────────────────────────────────────────────────────────────────────
// L1.1 — Hello! — Greetings for Every Moment
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L11 = `Antes de hablar de gramática o vocabulario, vamos a ver cómo habla la gente real.

Imagina estas situaciones:

A las 8:30 de la mañana, un compañero de trabajo te ve y dice: "Good morning! How are you?"
A las 3 de la tarde, el médico entra a la consulta: "Good afternoon. Please, have a seat."
Por la noche, quedas con amigos: "Hey! Good evening. Nice to see you!"
Antes de dormir, alguien te dice: "Good night. Sleep well."

¿Ves el patrón? En inglés, el saludo cambia según la hora del día.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOS SALUDOS SEGÚN LA HORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Good morning     →  De madrugada hasta las 12:00
Good afternoon   →  De las 12:00 hasta las 18:00
Good evening     →  A partir de las 18:00
Good night       →  Solo para despedirse antes de dormir

Atención: "Good night" NO es un saludo de llegada. Es siempre una despedida.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SALUDOS INFORMALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Con amigos, familia o personas de tu misma edad, usamos versiones más cortas y relajadas:

Hello   →  Saludo neutro. Funciona en cualquier situación.
Hi      →  Más informal que Hello. El más habitual en conversación.
Hey     →  Muy informal. Solo con personas cercanas.

Ejemplos reales:

"Hi! How are you?" — entre amigos
"Hey, what's up?" — muy coloquial, entre amigos jóvenes
"Hello, this is Dr. Smith." — formal, al contestar el teléfono


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAS DESPEDIDAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Goodbye         →  Formal. Para cuando no vas a ver a alguien en mucho tiempo.
Bye             →  Informal y muy habitual en el día a día.
See you         →  "Hasta luego" — indica que os volveréis a ver pronto.
See you later   →  "Hasta luego" (versión un poco más concreta).
See you tomorrow →  "Hasta mañana".
Take care       →  "Cuídate" — muy común entre conocidos.
Have a good one →  "Que vaya bien" — informal, muy americano.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — EL MÁS FRECUENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los hispanohablantes cometen este error con mucha frecuencia:

❌ Usar "Good night" al llegar a un lugar por la noche.

Es una traducción directa de "buenas noches" como saludo de llegada. En inglés, "Good night" es SIEMPRE una despedida, nunca un saludo de bienvenida.

✅ Llegas a una cena a las 9 de la noche  →  "Good evening, everyone!"
✅ Te vas de la cena a medianoche         →  "Good night. It was lovely meeting you."

La regla es sencilla: si llegas, dices "Good evening". Si te marchas a dormir, dices "Good night".


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Qué dirías en estas situaciones?

1. Son las 9 de la mañana y llegas al trabajo. ¿Cómo saludas a tu jefe?
2. Un amigo te llama por teléfono a las 4 de la tarde. ¿Cómo contestas?
3. Te vas de casa de un amigo a las 11 de la noche. ¿Qué dices?

Tómate un momento para pensarlo. En la próxima lección verás cómo funciona todo esto con hablantes nativos reales.`;

// ─────────────────────────────────────────────────────────────────────────────
// L1.3 — My Name Is... — Introducing Yourself
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L13 = `Vas a conocer a alguien nuevo. En inglés, hay una secuencia muy habitual para presentarse. Primero los ejemplos.

Situación 1: Una conferencia de trabajo

"Hello! I'm Sarah. Nice to meet you."
"Hi Sarah, I'm Carlos. I'm from Spain. Are you also here for the conference?"
"Yes! I work for a tech company in Barcelona. What about you?"
"I'm a teacher. I teach English in Madrid."

Situación 2: Primera clase de inglés

"Hi, my name is Amara. I'm from Senegal but I live in London now."
"Nice to meet you, Amara. I'm Nina, I'm Polish."

¿Ves la estructura? Primero el nombre, luego de dónde eres, luego algo sobre tu vida. Es una secuencia muy predecible que puedes aprender de memoria.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CÓMO DECIR TU NOMBRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tienes dos opciones igualmente correctas:

My name is Carlos.   →  Más formal
I'm Carlos.          →  Más natural y habitual en conversación

En la práctica, la mayoría de los angloparlantes dicen "I'm" y no "My name is", excepto en situaciones muy formales o al presentarse por teléfono.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DE DÓNDE ERES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I'm from Spain.    →  Soy de España
I'm from Madrid.   →  Soy de Madrid
I'm Spanish.       →  Soy español/a

En inglés, las nacionalidades siempre van con mayúscula.

Spanish, French, Italian, American, Mexican, Argentine, Brazilian...

Ejemplos:
"I'm from Mexico, but I live in the US now."
"She's Italian. She's from Rome."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TU PROFESIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I'm a teacher.     →  Soy profesor/a
I'm a student.     →  Soy estudiante
I'm a doctor.      →  Soy médico/a
I'm an engineer.   →  Soy ingeniero/a
I'm a nurse.       →  Soy enfermero/a
I'm a lawyer.      →  Soy abogado/a

Nota importante: usa "a" antes de sonido consonántico y "an" antes de sonido vocálico.
"a teacher", "a doctor"... pero "an engineer", "an actor", "an architect".


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAS FÓRMULAS DE CORTESÍA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Al conocer a alguien por primera vez:

Nice to meet you.      →  Mucho gusto
Nice to meet you too.  →  Igualmente (la respuesta)
Pleased to meet you.   →  Encantado/a (más formal)

Estas fórmulas son obligatorias en inglés. Omitirlas suena descortés.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — "HOW ARE YOU?" NO ES UNA PREGUNTA REAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Esta es una de las mayores sorpresas para los hispanohablantes.

En inglés, "How are you?" es una fórmula de saludo, no una pregunta sincera sobre cómo te encuentras.

La respuesta esperada es siempre corta:

✅ "Fine, thanks. And you?"
✅ "Good, thanks! How about you?"
✅ "Pretty good. You?"

❌ No respondas con una explicación larga de cómo te sientes.
❌ No respondas solo "Fine." sin preguntar de vuelta — suena distante en inglés.

Piénsalo como un intercambio automático, equivalente a "¿Qué tal? / Bien, ¿y tú?". No es una pregunta real; es un ritual de saludo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TU PRIMERA PRESENTACIÓN EN INGLÉS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa esta plantilla con tu información real:

"Hi! I'm [tu nombre]. I'm from [tu ciudad o país]. I'm a [tu profesión o rol]. Nice to meet you."

Es breve, es natural y es exactamente lo que diría cualquier angloparlante al presentarse por primera vez.`;

// ─────────────────────────────────────────────────────────────────────────────
// Seed
// ─────────────────────────────────────────────────────────────────────────────
module.exports = async (courseId) => {
  const unit = await upsert(Unit, { courseId, order: 1 }, {
    courseId,
    title:            'First Contact',
    order:            1,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L1.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'Hello! — Greetings for Every Moment',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L11,
      duration: 15,
      order:    1,
    }),

    // L1.2 — VIDEO
    // Canal recomendado: BBC Learning English
    // Búsqueda: "greetings saying hello goodbye English in a Minute BBC"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch & Listen — Real People Saying Hello',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/3e5AVPMjKcU',
      duration: 10,
      order:    2,
    }),

    // L1.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'My Name Is... — Introducing Yourself',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L13,
      duration: 15,
      order:    3,
    }),

  ]);

  // Unit 1 no tiene Assessment en el diseño pedagógico aprobado.
};
