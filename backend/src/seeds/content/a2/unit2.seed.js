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
// L2.1 — At the Shop — Vocabulary and Expressions
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L21 = `Ir de compras en un país de habla inglesa es una de las situaciones más frecuentes para un viajero o estudiante en el extranjero. Esta lección te da el vocabulario y las expresiones que necesitas para moverte con soltura en cualquier tienda.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIPOS DE TIENDAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

supermarket        →  supermercado
clothes shop       →  tienda de ropa
shoe shop          →  zapatería
bookshop           →  librería (venta de libros)
chemist / pharmacy →  farmacia
bakery             →  panadería
market             →  mercado
department store   →  grandes almacenes
newsagent          →  quiosco de prensa
off-licence        →  tienda de bebidas alcohólicas (BrE)

Atención: "bookshop" = tienda de libros / "library" = biblioteca. Dos palabras diferentes para cosas muy distintas.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPRESIONES ESENCIALES EN LA TIENDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El dependiente te dice:
"Can I help you?"                  →  ¿Le puedo ayudar?
"Are you looking for anything in particular?"  →  ¿Busca algo en concreto?
"We have this in other colours."   →  Lo tenemos en otros colores.
"I'm afraid we're out of stock."   →  Lo siento, no nos queda.

Tú respondes o preguntas:
"I'm just looking, thanks."        →  Solo estoy mirando, gracias.
"Do you have this in a medium?"    →  ¿Lo tiene en talla media?
"How much is this?"                →  ¿Cuánto cuesta esto?
"How much are these?"              →  ¿Cuánto cuestan estos?
"I'll take it."                    →  Me lo llevo.
"Do you accept card?"              →  ¿Aceptan tarjeta?
"Can I pay by card?"               →  ¿Puedo pagar con tarjeta?
"Can I have a receipt, please?"    →  ¿Me puede dar un recibo?


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRECIOS Y DINERO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En el Reino Unido la moneda es la libra esterlina (pound, símbolo £).
En Estados Unidos, Canadá y Australia se usa el dólar ($).

Cómo decir precios:

£3.50   →  "three pounds fifty"
£12.99  →  "twelve pounds ninety-nine"
£0.75   →  "seventy-five pence" / "seventy-five p"
$25.00  →  "twenty-five dollars"
$8.40   →  "eight dollars forty" / "eight forty"

En inglés informal, el "pounds" o "dollars" se omite a veces:
"That's twelve ninety-nine." → Eso son doce con noventa y nueve.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CANTIDADES Y MEDIDAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

a kilo of...           →  un kilo de...
half a kilo of...      →  medio kilo de...
a litre of...          →  un litro de...
a loaf of bread        →  una barra de pan
a dozen eggs           →  una docena de huevos
a tin of soup          →  una lata de sopa
a packet of biscuits   →  un paquete de galletas
a bottle of water      →  una botella de agua
a bag of crisps        →  una bolsa de patatas fritas

"Can I have two kilos of apples, please?"
"I'd like a loaf of brown bread and a dozen eggs."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIÁLOGO COMPLETO — EN EL SUPERMERCADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cashier:  "Hi there! Did you find everything okay?"
Customer: "Yes, thanks. Oh, do you have any organic milk? I couldn't find it."
Cashier:  "Yes, it's in the dairy aisle, near the butter."
Customer: "Ah, I missed it! Never mind — how much is this in total?"
Cashier:  "That's £14.85. Cash or card?"
Customer: "Card, please."
Cashier:  "That's great. Here's your receipt."
Customer: "Thanks. Have a good day!"
Cashier:  "You too!"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — "HOW MUCH IS / ARE"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"How much is this?"   →  Para artículos singulares o incontables.
"How much are these?" →  Para artículos en plural.

❌ "How much are this jacket?"
✅ "How much is this jacket?"

❌ "How much cost this?"
✅ "How much does this cost?" / "How much is this?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Cómo dirías estas cosas en inglés?

1. Preguntar cuánto cuesta una camisa.
2. Decir que solo estás mirando.
3. Pedir dos kilos de naranjas.
4. Preguntar si aceptan tarjeta.
5. Pedir el recibo.

Posibles respuestas:
1. "How much is this shirt?"
2. "I'm just looking, thanks."
3. "Can I have two kilos of oranges, please?"
4. "Do you accept card?" / "Can I pay by card?"
5. "Can I have a receipt, please?"`;

// ─────────────────────────────────────────────────────────────────────────────
// L2.3 — Comparing Things — Comparative Adjectives
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L23 = `Para comparar dos cosas en inglés usamos los adjetivos comparativos. Esta estructura es imprescindible en el contexto de las compras: decidir entre dos productos, dos tiendas o dos precios.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA REGLA BÁSICA — ADJETIVOS CORTOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para adjetivos de una sílaba (y algunos de dos): añades -er.

cheap  → cheaper   (más barato)
small  → smaller   (más pequeño)
big    → bigger    (más grande)
fast   → faster    (más rápido)
old    → older     (más viejo)
tall   → taller    (más alto)
cold   → colder    (más frío)
long   → longer    (más largo)
light  → lighter   (más ligero)
dark   → darker    (más oscuro)

La estructura completa:  Adjetivo-er + THAN

"This jacket is cheaper than that one."    →  Esta chaqueta es más barata que aquella.
"The red bag is bigger than the blue one." →  El bolso rojo es más grande que el azul.
"This model is faster than the old one."   →  Este modelo es más rápido que el antiguo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCEPCIONES ORTOGRÁFICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Adjetivos monosílabos CVC → doblan la consonante final:
big  → bigger    hot  → hotter    thin → thinner    sad → sadder

2. Adjetivos terminados en -e → solo añaden -r:
nice → nicer     late → later     safe → safer      large → larger

3. Adjetivos terminados en consonante + -y → cambia -y a -i y añade -er:
easy  → easier   heavy → heavier   busy → busier    friendly → friendlier


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADJETIVOS LARGOS — MORE + ADJETIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para adjetivos de dos sílabas (sin -y) y tres o más sílabas: usas MORE.

expensive  → more expensive   (más caro)
comfortable → more comfortable (más cómodo)
beautiful  → more beautiful   (más bonito)
modern     → more modern      (más moderno)
reliable   → more reliable    (más fiable)
popular    → more popular     (más popular)

"This sofa is more comfortable than the other one."
"The new design is more modern but also more expensive."
"This brand is more reliable than the cheap ones."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPARATIVOS IRREGULARES — MEMORIZA ESTOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

good  → better    (mejor)
bad   → worse     (peor)
far   → further / farther  (más lejos)
little → less     (menos)

"This laptop is better than my old one but worse than the professional model."
"The market is further from here than the supermarket."
"This version has less memory, so it's cheaper."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN CONTEXTO — COMPARANDO EN LA TIENDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Excuse me, is this phone better than that one?"
"Yes, it's faster and the camera is much better."
"But is it more expensive?"
"It's a bit more expensive, but it's also lighter and the battery is bigger."
"And is it easier to use?"
"Definitely! The screen is larger, so it's clearer to read."
"I'll think about it, thanks."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — "MORE CHEAPER"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Un error muy frecuente es usar BOTH -er AND more:

❌ "This is more cheaper."
✅ "This is cheaper."

❌ "It's more bigger than before."
✅ "It's bigger than before."

Solo hay una forma comparativa por adjetivo, nunca las dos a la vez.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Forma el comparativo correcto:

1. This bag is _______ (heavy) than the other one.
2. The new model is _______ (expensive) than I expected.
3. Is the market _______ (far) from here than the supermarket?
4. Your English is _______ (good) than you think!
5. This sofa is _______ (comfortable) than the one in the other shop.

Respuestas: 1. heavier  2. more expensive  3. farther / further  4. better  5. more comfortable`;

// ─────────────────────────────────────────────────────────────────────────────
// L2.4 — The Best and the Worst — Superlative Adjectives
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L24 = `Cuando no comparamos solo dos cosas sino que elegimos la mejor, la más cara o la más pequeña de un grupo, usamos el superlativo. Es la cima de la comparación.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA REGLA BÁSICA — THE + ADJETIVO + -EST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para adjetivos cortos (una sílaba y algunos de dos): THE + adjetivo + -est.

cheap  → the cheapest     (el más barato)
small  → the smallest     (el más pequeño)
big    → the biggest      (el más grande)
fast   → the fastest      (el más rápido)
old    → the oldest       (el más viejo)
long   → the longest      (el más largo)
cold   → the coldest      (el más frío)

"This is the cheapest phone in the shop."
"That was the best meal I've had in years."
"We live on the longest street in the city."

Las mismas reglas ortográficas que en el comparativo:
big → the biggest (CVC: dobla)
nice → the nicest (termina en -e: solo -st)
easy → the easiest (consonante + y → -iest)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADJETIVOS LARGOS — THE MOST + ADJETIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para adjetivos de dos sílabas (sin -y) y tres o más sílabas: THE MOST.

expensive   → the most expensive    (el más caro)
comfortable → the most comfortable  (el más cómodo)
beautiful   → the most beautiful    (el más bonito)
reliable    → the most reliable     (el más fiable)
popular     → the most popular      (el más popular)

"This is the most expensive bag in the collection."
"That was the most comfortable hotel I've ever stayed in."
"It's the most popular model this season."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPERLATIVOS IRREGULARES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

good  → the best     (el mejor)
bad   → the worst    (el peor)
far   → the furthest / the farthest   (el más lejos)
little → the least   (el menos)

"This is the best coffee I've ever had."
"That was the worst film of the year."
"The furthest I've ever walked is forty kilometres."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPARATIVO VS. SUPERLATIVO — RESUMEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Comparativo (entre DOS):
"This laptop is cheaper than that one."

Superlativo (dentro de un GRUPO):
"This is the cheapest laptop in the shop."

"London is bigger than Madrid." (comparativo — dos ciudades)
"Tokyo is the biggest city in the world." (superlativo — todas las ciudades del mundo)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN CONTEXTO — RESEÑAS Y RECOMENDACIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"What's the best supermarket in the city centre?"
"Probably the one on King Street — it's the biggest and it has the most variety."
"Is it the cheapest?"
"Not the cheapest, but not the most expensive either. The quality is the best, though."
"And is it the nearest to the station?"
"It's pretty close, yes. Maybe a five-minute walk."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — OLVIDAR "THE"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El superlativo siempre lleva THE. Es uno de los errores más frecuentes:

❌ "This is most expensive restaurant in town."
✅ "This is the most expensive restaurant in town."

❌ "It's biggest supermarket here."
✅ "It's the biggest supermarket here."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Forma el superlativo correcto:

1. That was _______ (bad) film I've seen this year.
2. This is _______ (comfortable) sofa in the shop.
3. She's _______ (friendly) shop assistant I've ever met.
4. It's _______ (expensive) dress in the collection.
5. This is _______ (easy) recipe in the book.

Respuestas:
1. the worst  2. the most comfortable  3. the friendliest
4. the most expensive  5. the easiest`;

// ─────────────────────────────────────────────────────────────────────────────
// L2.5 — Shopping & Comparing — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L25 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — VOCABULARIO DE COMPRAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Cómo se dice en inglés?

1. Zapatería:                    ___________
2. Una lata de sopa:             ___________
3. "Me lo llevo":                ___________
4. "¿Aceptan tarjeta?":          ___________
5. Una docena de huevos:         ___________

Respuestas:
1. shoe shop  2. a tin of soup  3. I'll take it  4. Do you accept card?  5. a dozen eggs


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — COMPARATIVOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con la forma comparativa correcta:

1. This jacket is _______ (expensive) than the other one.
2. The new model is _______ (fast) and _______ (light).
3. Is the bus _______ (slow) than the train?
4. This coffee is _______ (good) than the one yesterday.
5. The blue bag is _______ (heavy) than the red one.

Respuestas: 1. more expensive  2. faster / lighter  3. slower  4. better  5. heavier


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — SUPERLATIVOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Forma el superlativo:

1. This is _______ (cheap) phone in the shop.
2. That was _______ (good) meal I've ever had.
3. She's _______ (popular) teacher in the school.
4. It's _______ (bad) weather we've had all year.
5. That was _______ (comfortable) bed in the hotel.

Respuestas: 1. the cheapest  2. the best  3. the most popular  4. the worst  5. the most comfortable


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — ERRORES FRECUENTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Hay un error? Corrígelo:

1. "This is more cheaper than that one."
2. "It's biggest shop in the city."
3. "How much cost this bag?"
4. "This phone is more better than the old one."
5. "She's the most friendliest person I know."

Respuestas:
1. ERROR → "This is cheaper than that one." (no se usan "more" y "-er" juntos)
2. ERROR → "It's the biggest shop in the city." (falta "the")
3. ERROR → "How much is this bag?" / "How much does this bag cost?"
4. ERROR → "This phone is better than the old one." ("better" ya es el comparativo de "good")
5. ERROR → "She's the friendliest person I know." (no se usan "most" y "-est" juntos)`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U2
// 10 preguntas × 1 punto = 10 pts totales. passingScore 80 → 8/10.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U2 = {
  title:        'Shopping & Money — Unit 2 Assessment',
  description:  'Escribe cinco frases comparando dos tiendas, productos o marcas reales que conozcas. Usa al menos dos comparativos, dos superlativos y vocabulario de compras de la unidad.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '¿Cuál es el comparativo correcto de "expensive"?',
      options:      ['expensiver', 'more expensiver', 'more expensive', 'most expensive'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál es el superlativo correcto de "cheap"?',
      options:      ['most cheap', 'more cheapest', 'the cheapest', 'cheapest'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál es el comparativo de "good"?',
      options:      ['gooder', 'more good', 'goodest', 'better'],
      correctIndex: 3,
      points:       1,
    },
    {
      text:         '¿Cuál es el superlativo de "bad"?',
      options:      ['the most bad', 'the baddest', 'the worst', 'the badder'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"This jacket is _______ than that one." ¿Qué palabra completa la frase con "big"?',
      options:      ['more big', 'biger', 'biggest', 'bigger'],
      correctIndex: 3,
      points:       1,
    },
    {
      text:         'Elige la frase correcta.',
      options:      ['This is most expensive shop in town.', 'This is the more expensive shop in town.', 'This is the most expensive shop in town.', 'This is more expensive shop in town.'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cómo preguntas el precio de un artículo en inglés?',
      options:      ['How much cost this?', 'How much is this?', 'What is the price of this cost?', 'How many is this?'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Qué significa "I\'m just looking"?',
      options:      ['Estoy buscando algo concreto.', 'Solo estoy mirando.', 'Quiero comprar esto.', 'No tengo dinero.'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Qué es una "chemist" en inglés?',
      options:      ['Un supermercado', 'Una ferretería', 'Una farmacia', 'Una panadería'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"Easy" en superlativo es...',
      options:      ['the most easy', 'the easiest', 'the easyest', 'the easyer'],
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
    title:            'Shopping & Money',
    order:            2,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L2.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'At the Shop — Vocabulary and Expressions',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L21,
      duration: 15,
      order:    1,
    }),

    // L2.2 — VIDEO
    // Canal recomendado: BBC Learning English
    // Búsqueda: "shopping in English dialogue BBC Learning English"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: A Real Shopping Conversation',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-a2-u2-l2',
      duration: 10,
      order:    2,
    }),

    // L2.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'Comparing Things — Comparative Adjectives',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L23,
      duration: 20,
      order:    3,
    }),

    // L2.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'The Best and the Worst — Superlative Adjectives',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L24,
      duration: 15,
      order:    4,
    }),

    // L2.5 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'Shopping & Comparing — Quiz',
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
