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
// L5.1 — Places in Town — Vocabulary
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L51 = `Para moverte por una ciudad en inglés necesitas dos cosas: saber el nombre de los lugares y poder decir si existen o no cerca de donde estás. Esta lección te da el vocabulario y la estructura para hacer exactamente eso.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LUGARES EN LA CIUDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Servicios esenciales:
supermarket     →  supermercado
pharmacy        →  farmacia
hospital        →  hospital
bank            →  banco
post office     →  oficina de correos
police station  →  comisaría
petrol station  →  gasolinera
car park        →  aparcamiento

Transporte:
train station   →  estación de tren
bus station     →  estación de autobús
bus stop        →  parada de autobús
airport         →  aeropuerto

Ocio y cultura:
park            →  parque
café            →  cafetería
restaurant      →  restaurante
cinema          →  cine
museum          →  museo
library         →  biblioteca

Servicios urbanos:
school          →  colegio
hotel           →  hotel
town hall       →  ayuntamiento
market          →  mercado

Falso amigo importante: "library" es biblioteca, no librería. La librería en inglés es "bookshop" (BrE) o "bookstore" (AmE).


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THERE IS / THERE ARE — DECIR QUÉ EXISTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THERE IS  →  para un elemento singular
THERE ARE →  para varios elementos en plural

"There is a park near the hotel."
"There is a pharmacy on the corner."
"There are two supermarkets in the town centre."
"There are some cafés near the station."

En conversación, "there is" se contrae habitualmente a "there's":
"There's a bank on Market Street."
"There's a good restaurant near here."

"There are" no tiene contracción habitual en inglés estándar.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THERE IS / THERE ARE — NEGATIVA E INTERROGATIVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Negativa:
"There isn't a cinema in the village."
"There aren't any hotels near the station."

Interrogativa:
"Is there a bank near here?"
"Are there any good restaurants in town?"

Respuestas cortas:
"Is there a pharmacy nearby?" → "Yes, there is." / "No, there isn't."
"Are there any cafés?" → "Yes, there are." / "No, there aren't."

"Any" aparece en preguntas y negativas con nombres contables en plural:
"Are there any hotels?" / "There aren't any taxis."

En afirmativas se usa "some":
"There are some good cafés near the market."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — "LIBRARY" NO ES LIBRERÍA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ "I buy my books at the library."
✅ "I buy my books at the bookshop."
✅ "I borrow books from the library." (en la biblioteca se toman prestados libros)

Otro error frecuente: omitir el "there" en preguntas de existencia.
❌ "Is a bank near here?"
✅ "Is there a bank near here?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con "there is", "there are", "there isn't" o "there aren't":

1. _______ a good market near my house. I go every Saturday.
2. _______ a cinema in my village. We have to go to the next town.
3. _______ any good restaurants on this street?
4. _______ three pharmacies in the town centre.
5. _______ a hotel near the station, but it's quite expensive.

Respuestas: 1. There's / There is  2. There isn't  3. Are there  4. There are  5. There's / There is`;

// ─────────────────────────────────────────────────────────────────────────────
// L5.2 — In, On, At, Next To — Prepositions of Place
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L52 = `Saber que algo existe no es suficiente. Necesitas también poder decir dónde está. Las preposiciones de lugar son las palabras que hacen ese trabajo. Donde el español dice "en", el inglés puede decir "in", "on" o "at" según el contexto.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAS PREPOSICIONES RELACIONALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

next to         →  al lado de
opposite        →  enfrente de
between         →  entre (dos elementos)
near            →  cerca de
behind          →  detrás de
in front of     →  delante de
on the corner   →  en la esquina
on the left     →  a la izquierda
on the right    →  a la derecha

"The café is next to the bank."
"The hotel is opposite the train station."
"The pharmacy is between the supermarket and the post office."
"There's a park near the school."
"The bus stop is in front of the hotel."
"The car park is behind the supermarket."
"The library is on the corner of High Street and Oak Avenue."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IN, ON, AT — PARA DESCRIBIR UBICACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IN → dentro de un espacio o área
"The bank is in the town centre."
"She works in a hospital."

ON → sobre una calle específica
"The pharmacy is on King Street."
"There's a bus stop on this road."

AT → en un punto concreto de referencia
"Meet me at the train station."
"Turn left at the traffic lights."

Resumen para indicaciones:
Calle       → ON: "It's on Park Road."
Punto exacto → AT: "I'll wait at the corner."
Zona o área  → IN: "It's in the town centre."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMBINAR PREPOSICIONES EN DESCRIPCIONES REALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"The post office is on King Street, opposite the park and next to the café. It's at the end of the road, on the left."

"The hospital is in the city centre, near the train station. It's on Elm Avenue, behind the big shopping centre. There's a bus stop in front of it."

Cada preposición aporta un tipo distinto de información: IN sitúa en una zona, ON indica la calle, NEAR / OPPOSITE / NEXT TO definen la posición relativa.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — ERRORES FRECUENTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Error 1 — Omitir "of" en "in front of" y "on the corner of":
❌ "The bus stop is in front the hotel."
✅ "The bus stop is in front of the hotel."

Error 2 — Usar "in" para calles:
❌ "The pharmacy is in King Street."
✅ "The pharmacy is on King Street."

Error 3 — "Opposite to":
❌ "The hotel is opposite to the station."
✅ "The hotel is opposite the station."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con la preposición correcta:

1. The pharmacy is _______ the supermarket and the bank.
2. There's a café _______ Park Street, _______ the cinema.
3. Meet me _______ the bus stop on Green Road.
4. The car park is _______ the supermarket.
5. The hotel is _______ the station, so it's very convenient.
6. The library is _______ the town centre, _______ the corner of Mill Road.

Respuestas: 1. between  2. on / next to  3. at  4. behind  5. opposite  6. in / on`;

// ─────────────────────────────────────────────────────────────────────────────
// L5.4 — Excuse Me, Where Is...? — Dialogues
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L54 = `Ya tienes el vocabulario de lugares y las preposiciones. Ahora vas a aprender la estructura exacta de los diálogos de indicaciones: qué se dice, en qué orden y cómo reaccionar en cada momento.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CÓMO PEDIR INDICACIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Siempre empieza con "Excuse me". Sin ella, la petición suena descortés.

"Excuse me, where is the train station?"
"Excuse me, is there a pharmacy near here?"
"Excuse me, how do I get to the town hall?"

Para A1, las dos formas más útiles:
"Excuse me, where is [lugar]?"  →  cuando sabes que existe y necesitas la dirección
"Excuse me, is there a [lugar] near here?"  →  cuando no sabes si existe en la zona


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VOCABULARIO PARA DAR INDICACIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Movimiento:
Go straight on.         →  Sigue todo recto.
Turn left.              →  Gira a la izquierda.
Turn right.             →  Gira a la derecha.
Take the first left.    →  Toma la primera a la izquierda.
Take the second right.  →  Toma la segunda a la derecha.
Go past the bank.       →  Pasa por delante del banco.
Cross the road.         →  Cruza la calle.

Referencias y llegada:
It's on your left.      →  Está a tu izquierda.
It's on your right.     →  Está a tu derecha.
It's on the corner.     →  Está en la esquina.
It's opposite the park. →  Está enfrente del parque.
It's next to the bank.  →  Está al lado del banco.
You can't miss it.      →  No tiene pérdida.
It's about five minutes' walk. →  Está a unos cinco minutos andando.

Puntos de referencia en el camino:
at the traffic lights   →  en el semáforo
at the roundabout       →  en la rotonda
at the junction         →  en el cruce


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UN DIÁLOGO COMPLETO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A: "Excuse me, where is the train station?"
B: "Sure! Go straight on down this road and take the second right. Then go past the supermarket and cross the road. The station is on your left, opposite the hotel. You can't miss it."
A: "Sorry, could you say that again? Take the second right?"
B: "Yes, that's right. Second right, then straight on. It's about ten minutes' walk."
A: "Thank you very much!"
B: "No problem. Have a good day!"

Identifica en este diálogo:
- Apertura: "Excuse me"
- Instrucciones: "Go straight on", "take the second right", "go past", "cross the road"
- Referencia de llegada: "on your left, opposite the hotel"
- Confirmación: "You can't miss it"
- Petición de repetición: "Could you say that again?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEGUNDO DIÁLOGO — PREGUNTANDO POR EXISTENCIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A: "Excuse me, is there a pharmacy near here?"
B: "Yes, there's one on Church Street. Turn left at the traffic lights and it's on the right, next to the post office."
A: "Great, thank you. How far is it?"
B: "About five minutes' walk."
A: "Perfect, thanks a lot!"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUANDO NO ENTIENDES — FRASES ESENCIALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Sorry, could you say that again?"      →  ¿Podría repetirlo?
"Could you speak more slowly, please?"  →  ¿Podría hablar más despacio?
"Sorry, I'm not from here."             →  Lo siento, no soy de aquí.
"Did you say left or right?"            →  ¿Ha dicho izquierda o derecha?


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — ERRORES FRECUENTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ "Go to straight on."
✅ "Go straight on."

❌ "Make the first left."
✅ "Take the first left."

❌ "It's your left."
✅ "It's on your left."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa el diálogo con las palabras del cuadro:
(excuse me / straight on / turn right / on your left / can't miss it / is there)

A: _______, _______ a bank near here?
B: Yes, go _______ and _______ at the corner. The bank is _______, next to the café. You _______.
A: Thank you!

Respuesta:
A: Excuse me, is there a bank near here?
B: Yes, go straight on and turn right at the corner. The bank is on your left, next to the café. You can't miss it.
A: Thank you!`;

// ─────────────────────────────────────────────────────────────────────────────
// L5.5 — Find Your Way — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L55 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — VOCABULARIO DE LUGARES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Cuál es la palabra correcta en inglés?

1. El lugar donde puedes coger un tren: ___________
2. El lugar donde puedes sacar dinero: ___________
3. El lugar donde puedes comprar libros: ___________
4. El lugar donde puedes coger prestado un libro: ___________
5. El lugar donde aparcan los coches: ___________

Respuestas:
1. train station  2. bank  3. bookshop / bookstore  4. library  5. car park

Si has confundido "library" con "bookshop": library = biblioteca (préstamo gratuito); bookshop = librería (compra).


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — THERE IS / THERE ARE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige la forma correcta:

1. _______ a good café near the museum. (there's / there are)
2. _______ any hotels in this area? (Is there / Are there)
3. _______ two pharmacies on the main street. (There's / There are)
4. _______ a cinema in my village. (There isn't / There aren't)
5. "Is there a bus stop here?" "No, _______ one on this street." (there isn't / there aren't)

Respuestas: 1. There's  2. Are there  3. There are  4. There isn't  5. there isn't


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — PREPOSICIONES DE LUGAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con la preposición correcta:

1. The pharmacy is _______ the bank and the post office.
2. The bus stop is _______ front of the hotel.
3. The restaurant is _______ the corner of Mill Street.
4. The car park is _______ the supermarket.
5. The station is _______ the town centre, _______ Park Road.

Respuestas: 1. between  2. in  3. on  4. behind  5. in / on


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — DIÁLOGO CON HUECOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa el diálogo:

A: _______ me, _______ is the town hall?
B: Sure. _______ straight on down this road and _______ left at the traffic lights.
   The town hall is on _______ right, _______ the library. You can't _______ it.
A: Thank you. How _______ is it?
B: About five minutes' _______.

Respuestas: Excuse / where / Go / turn / your / opposite (o next to) / miss / far / walk


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE E — SITUACIÓN REAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lee la descripción y responde:

"You are standing at the train station. The supermarket is opposite the station, on Green Street. Next to the supermarket is the pharmacy. Behind the pharmacy, on Park Road, there is a café and a small hotel. The town hall is at the end of Park Road, on the corner of Park Road and High Street. The library is on High Street, between the town hall and the museum."

1. ¿En qué calle está el supermercado?
2. ¿Qué hay al lado del supermercado?
3. ¿Dónde está el ayuntamiento exactamente?
4. ¿Qué hay entre el ayuntamiento y el museo?
5. Escribe cómo irías de la estación a la biblioteca en dos o tres frases.

Respuestas:
1. On Green Street.
2. The pharmacy.
3. At the end of Park Road, on the corner of Park Road and High Street.
4. The library.
5. Respuesta libre. Ejemplo: "Go straight on down Green Street and turn right into Park Road. Go past the café and the hotel. At the end of the road, turn left onto High Street. The library is on the right, between the town hall and the museum."`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U5
// 10 preguntas × 1 punto = 10 pts totales.
// passingScore 80 → 8/10 = 80%
// Parte B en description: enunciado para el estudiante.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U5 = {
  title:        'Places & Getting Around — Unit 5 Assessment',
  description:  'Estás en la estación de tren de Greenfield. Escribe cómo ir de la estación a la biblioteca usando el mapa de la lección. Incluye al menos cuatro expresiones de dirección o posición aprendidas en esta unidad.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '¿Cómo se llama el lugar donde puedes sacar dinero?',
      options:      ['post office', 'bank', 'library', 'pharmacy'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         'Elige la forma correcta: "___ a pharmacy near here."',
      options:      ['There are', "There's", 'There has', 'It is'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         'Elige la forma correcta: "___ any hotels in this area?"',
      options:      ['Is there', 'There is', 'Are there', 'There are'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"The pharmacy is ___ the bank and the post office." ¿Qué preposición es correcta?',
      options:      ['opposite', 'between', 'behind', 'in front'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"The café is ___ Market Street." ¿Qué preposición es correcta?',
      options:      ['in', 'at', 'on', 'by'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Qué expresión significa "sigue todo recto" en inglés?',
      options:      ['Turn left', 'Go straight on', 'Take the first right', 'Cross the road'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"It\'s ___ your left." ¿Qué preposición falta?',
      options:      ['in', 'at', 'on', 'by'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cómo se pide indicaciones cortésmente a un desconocido en inglés?',
      options:      ['Where is the station?', 'Excuse me, where is the station?', 'Tell me where the station is.', 'Station, please?'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"Library" en inglés significa...',
      options:      ['librería (tienda de libros)', 'biblioteca (préstamo gratuito)', 'papelería', 'galería de arte'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"The hotel is opposite the station and the café is next to the hotel." ¿Dónde está el café?',
      options:      ['Behind the hotel', 'Between the station and the hotel', 'Opposite the station', 'Next to the hotel'],
      correctIndex: 3,
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
    title:            'Places & Getting Around',
    order:            5,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L5.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'Places in Town — Vocabulary',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L51,
      duration: 15,
      order:    1,
    }),

    // L5.2 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'In, On, At, Next To — Prepositions of Place',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L52,
      duration: 15,
      order:    2,
    }),

    // L5.3 — VIDEO
    // Canal recomendado: BBC Learning English
    // Búsqueda: "asking for directions English A1 beginner dialogue BBC"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: Asking for Directions',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-u5-l3',
      duration: 10,
      order:    3,
    }),

    // L5.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Excuse Me, Where Is...? — Dialogues',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L54,
      duration: 15,
      order:    4,
    }),

    // L5.5 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'Find Your Way — Quiz',
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
