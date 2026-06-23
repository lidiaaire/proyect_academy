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
// L6.1 — Food & Drink — Vocabulary
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L61 = `Pedir comida en inglés requiere primero conocer los nombres. Esta lección te da el vocabulario esencial organizado por categorías, y te introduce la gramática que determina cómo se usa: los nombres contables e incontables.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CARNE Y PROTEÍNAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

chicken   →  pollo
beef      →  ternera / vaca
pork      →  cerdo
lamb      →  cordero
fish      →  pescado
salmon    →  salmón
tuna      →  atún
prawns    →  gambas (BrE) / shrimp (AmE)
eggs      →  huevos

Las carnes en inglés no se traducen directamente del animal. El animal es "pig" (cerdo), pero la carne es "pork". El animal es "cow" (vaca), pero la carne es "beef".


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERDURAS, FRUTA Y OTROS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

tomato     →  tomate
lettuce    →  lechuga
onion      →  cebolla
pepper     →  pimiento (también: pimienta según contexto)
mushroom   →  champiñón
carrot     →  zanahoria
potato     →  patata
apple      →  manzana
orange     →  naranja
banana     →  plátano
lemon      →  limón
strawberry →  fresa

Platos y preparaciones habituales:
soup       →  sopa
salad      →  ensalada
sandwich   →  sándwich
pasta      →  pasta
rice       →  arroz
bread      →  pan
cheese     →  queso
butter     →  mantequilla
cake       →  pastel / tarta
ice cream  →  helado


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BEBIDAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bebidas sin alcohol:
water          →  agua
juice          →  zumo / jugo
orange juice   →  zumo de naranja
coffee         →  café
tea            →  té
milk           →  leche
sparkling water →  agua con gas
still water    →  agua sin gas
lemonade       →  limonada / refresco de limón (según contexto)

Bebidas con alcohol:
beer           →  cerveza
wine           →  vino
red wine       →  vino tinto
white wine     →  vino blanco
rosé           →  vino rosado

"Could I have a glass of red wine and a still water, please?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTABLE VS. INCONTABLE — LA CLAVE DE LA GRAMÁTICA ALIMENTARIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Esta distinción afecta directamente a cómo pides comida en inglés.

CONTABLE — puedes contar unidades (1 apple, 2 apples):
an apple / two apples / some apples
a sandwich / three sandwiches / some sandwiches
an egg / two eggs / some eggs

INCONTABLE — no tiene plural, no se cuenta en unidades:
bread (no "a bread", no "two breads")
rice (no "a rice", no "two rices")
water (no "a water" — aunque en la práctica se dice "a water" como elipsis de "a glass of water")
milk / coffee / tea / juice / cheese / butter / pasta

Con nombres incontables, la cantidad se expresa con un recipiente o medida:
a cup of coffee / a glass of water / a bottle of wine
a piece of bread / a slice of cake / a bowl of soup


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A / AN / SOME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A / AN → para nombres contables en singular
"a sandwich", "an apple", "an orange juice"

SOME → para nombres incontables o contables en plural
"some bread", "some water", "some eggs", "some strawberries"

"I'd like a sandwich and some water, please."
"Can I have an orange juice and some chips?"
"I'll have some soup and a piece of bread."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — INCONTABLES FRECUENTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ "I'd like a bread."
✅ "I'd like some bread." / "I'd like a piece of bread."

❌ "Two coffees and a water." (coloquial pero técnicamente impreciso)
✅ "Two cups of coffee and a glass of water." (preciso)
En contexto real, "Two coffees, please" se entiende y se usa — es una elipsis aceptada.

❌ "I want some rice, please." (correcto gramaticalmente, pero brusco)
✅ "I'd like some rice, please." (más educado)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Contable o incontable? Clasifica:

apple / bread / sandwich / milk / egg / pasta / lemon / water / cheese / banana

Contable: apple, sandwich, egg, lemon, banana
Incontable: bread, milk, pasta, water, cheese

Ahora completa con "a", "an" o "some":
1. Can I have ___ orange juice?
2. I'd like ___ pasta and ___ salad.
3. She ordered ___ sandwich and ___ soup.
4. We'd like ___ bread to start, please.

Respuestas: 1. an  2. some / a  3. a / some  4. some`;

// ─────────────────────────────────────────────────────────────────────────────
// L6.2 — I'd Like... — Ordering in a Café or Restaurant
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L62 = `Saber el vocabulario de comida no es suficiente. Necesitas saber cómo pedirla de manera natural y educada. En inglés hay diferencias claras entre formas de pedir, y la elección incorrecta puede sonar brusco sin que lo pretendas.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"I WANT" VS. "I'D LIKE"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"I want" es gramaticalmente correcto, pero suena directo y a veces brusco en inglés británico y en contextos de hostelería.

"I'd like" es la contracción de "I would like". Es más suave, más educado y es la forma estándar en restaurantes y cafeterías.

❌ "I want a coffee."      → funciona, pero suena exigente
✅ "I'd like a coffee."    → natural y educado
✅ "Can I have a coffee?"  → muy habitual, informal pero correcto
✅ "Could I have a coffee?" → más formal y aún más educado

En la práctica, los nativos usan las cuatro formas, pero en hostelería "I'd like" y "Can I have" son las más habituales.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAS TRES FORMAS CLAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I'd like...         →  Me gustaría... (educado, muy habitual)
Can I have...?      →  ¿Me pone...? (informal, muy habitual en cafeterías)
Could I have...?    →  ¿Podría tomar...? (más formal, muy educado)

Ejemplos con comida:
"I'd like the chicken salad, please."
"Can I have a cappuccino and a slice of cake?"
"Could I have the fish with potatoes, please?"

Ejemplos con bebidas:
"I'd like a glass of white wine."
"Can I have a still water?"
"Could I have an orange juice, please?"

Las tres formas son intercambiables en la mayoría de los contextos.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CANTIDADES Y RECIPIENTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para especificar cantidad con nombres incontables:

a cup of coffee / tea        →  una taza de café / té
a glass of water / wine      →  un vaso / copa de agua / vino
a bottle of water / beer     →  una botella de agua / cerveza
a bowl of soup               →  un tazón de sopa
a piece of cake              →  un trozo de tarta
a slice of bread             →  una rebanada de pan
a portion of chips           →  una ración de patatas fritas

"I'd like a bowl of soup and a piece of bread, please."
"Could I have a bottle of still water for the table?"
"Can I have two cups of tea and a slice of chocolate cake?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WITH / WITHOUT — PERSONALIZANDO EL PEDIDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"I'd like a coffee with milk, please."      →  con leche
"Can I have the pasta without cheese?"      →  sin queso
"I'd like the salad with the dressing on the side." →  el aliño aparte
"Could I have the burger without onion, please?"

"On the side" = servido aparte, no mezclado con el plato.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREGUNTAS DEL CAMARERO — LO QUE TE DIRÁN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Are you ready to order?"     →  ¿Listos para pedir?
"What would you like?"        →  ¿Qué desea?
"What can I get you?"         →  ¿Qué le pongo? (informal)
"Anything to drink?"          →  ¿Algo para beber?
"Any starters?"               →  ¿Van a tomar primero?
"How would you like your steak?" →  ¿Cómo quiere el filete?

Respuestas a "How would you like your steak?":
rare / medium rare / medium / well done
(poco hecho / al punto tirando a poco / al punto / bien hecho)

"Is everything okay?"         →  ¿Todo bien? (durante la comida)
"Can I get you anything else?" →  ¿Desean algo más?


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transforma estas frases para que suenen más educadas:

1. "I want pasta."
2. "Give me a coffee."
3. "Water."
4. "I want the fish but no lemon."

Respuestas posibles:
1. "I'd like the pasta, please."
2. "Could I have a coffee, please?" / "Can I have a coffee, please?"
3. "I'd like a glass of water, please." / "Could I have some water?"
4. "I'd like the fish without lemon, please."`;

// ─────────────────────────────────────────────────────────────────────────────
// L6.4 — Can I Have...? — Dialogues
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L64 = `La estructura de una visita a un restaurante o cafetería en inglés sigue una secuencia muy predecible. Una vez que conoces los patrones, puedes adaptarlos a cualquier situación.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECUENCIA COMPLETA: DE LA LLEGADA A LA CUENTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. LLEGAR — PEDIR MESA

"A table for two, please."
"Do you have a table for four?"
"I have a reservation. The name is García."
"Can we sit by the window?"

Camarero:
"Of course, follow me please."
"I'm afraid we're fully booked. Can I take your name for the waiting list?"
"How many people is it for?"


2. PEDIR BEBIDAS (PRIMERA VUELTA)

Camarero: "Can I get you some drinks to start?"
Cliente: "Yes, I'd like a glass of red wine and a still water, please."
Camarero: "And for you?"
Cliente: "A sparkling water, please."


3. PEDIR LA COMIDA

Camarero: "Are you ready to order?"
Cliente A: "Yes. I'd like the tomato soup to start, and then the chicken with rice, please."
Camarero: "And for you?"
Cliente B: "Could I have the salmon, please? And a salad instead of the chips?"
Camarero: "Of course. No problem."
Cliente A: "Sorry, what does the chicken come with?"
Camarero: "It comes with roast potatoes and vegetables."
Cliente A: "Perfect, thank you."


4. DURANTE LA COMIDA

Camarero: "Is everything okay?"
Cliente: "Yes, it's delicious, thank you."

Si algo falta o está mal:
"Excuse me, I didn't order this."
"I'm sorry, but my soup is cold."
"Could we have some more bread, please?"
"Excuse me, we're still waiting for our drinks."


5. LOS POSTRES

Camarero: "Would you like to see the dessert menu?"
Cliente A: "Yes, please."
Cliente B: "No, thank you. Just the bill, please."
Cliente A: "I'd like the chocolate cake, please."
Camarero: "And a coffee?"
Cliente A: "Yes, a black coffee, please. No sugar."


6. PEDIR LA CUENTA Y PAGAR

"Can I have the bill, please?"
"Could we have the bill, please?" (más formal)
"The bill, please." (informal, muy directo pero aceptable)

Camarero: "Here you are. Do you want to pay together or separately?"
Cliente: "Together, please. Can we pay by card?"
Camarero: "Of course. I'll bring the card machine."

"Keep the change." →  Quédese con el cambio.
"Is service included?" →  ¿Está incluido el servicio?


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIÁLOGO COMPLETO EN UNA CAFETERÍA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

S = Server (camarero/a)   C = Customer (cliente)

S: "Good morning! What can I get you?"
C: "Hi! Can I have a large cappuccino and a croissant, please?"
S: "Of course. Eat in or take away?"
C: "Eat in, please."
S: "Any name for the order?"
C: "Laura."
S: "Great. That's four pounds fifty."
C: "Here you go. Can I pay by card?"
S: "Yes, of course. Just tap there."
C: "Thank you."
S: "Your cappuccino will be ready in a moment. I'll bring it over."

Expresiones nuevas en este diálogo:
"Eat in or take away?" →  ¿Para tomar aquí o para llevar?
"Here you go." →  Aquí tiene / Aquí tienes.
"Just tap there." →  Pulse ahí (pago contactless).


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRECIOS Y CANTIDADES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cómo se dicen los precios en inglés:

£4.50  →  "four pounds fifty"
£12.99 →  "twelve pounds ninety-nine"
£0.75  →  "seventy-five pence"

Para preguntar el precio:
"How much is it?" / "How much does it cost?"
"What's the total?"

Para preguntar por el contenido de un plato:
"What does the X come with?"   →  ¿Con qué viene el X?
"Does it come with chips?"     →  ¿Viene con patatas fritas?
"What's in the salad?"         →  ¿Qué lleva la ensalada?


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUANDO NO ENTIENDES AL CAMARERO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Sorry, could you repeat that?"
"I'm sorry, I don't understand. Could you speak more slowly?"
"What do you recommend?"  →  ¿Qué recomienda?
"What's the dish of the day?" →  ¿Cuál es el plato del día?


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Escribe la frase correcta para cada situación:

1. Llegas a un restaurante con tu pareja. Quieres una mesa.
2. El camarero pregunta qué quieres. Quieres el salmón sin limón.
3. Quieres saber qué lleva el plato del día.
4. Tu sopa está fría.
5. Quieres pagar y marcharte.

Respuestas posibles:
1. "A table for two, please."
2. "I'd like the salmon, please, without lemon."
3. "What's in the dish of the day?" / "What does the dish of the day come with?"
4. "Excuse me, my soup is cold."
5. "Can I have the bill, please?"`;

// ─────────────────────────────────────────────────────────────────────────────
// L6.5 — Order Up! — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L65 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — VOCABULARIO DE COMIDA Y BEBIDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Traduce al inglés:

1. Ternera (la carne): ___________
2. Gambas: ___________
3. Champiñón: ___________
4. Zumo de naranja: ___________
5. Vino tinto: ___________

Respuestas: 1. beef  2. prawns (BrE) / shrimp (AmE)  3. mushroom  4. orange juice  5. red wine

¿Has confundido "beef" y "pork"? beef = ternera/vaca / pork = cerdo.
El animal es "pig" (cerdo) pero la carne es "pork". El animal es "cow" (vaca) pero la carne es "beef".


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — CONTABLE / INCONTABLE + A / AN / SOME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Contable o incontable?

1. bread: ___________
2. apple: ___________
3. pasta: ___________
4. egg: ___________
5. cheese: ___________

Respuestas: 1. incontable  2. contable  3. incontable  4. contable  5. incontable

Ahora completa con "a", "an" o "some":

6. I'd like ___ orange juice.
7. Can I have ___ bread with my soup?
8. She ordered ___ sandwich and ___ salad.
9. We'd like ___ pasta and ___ glass of wine.
10. Could I have ___ egg on toast, please?

Respuestas: 6. an  7. some  8. a / a  9. some / a  10. an


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — LENGUAJE DE PEDIDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ordena de más educado (1) a menos educado (3):

□ "Give me a coffee."
□ "I'd like a coffee, please."
□ "Could I have a coffee, please?"

Orden: 1. Could I have...  2. I'd like...  3. Give me...

Nota: "Give me" no es incorrecto, pero suena descortés en un contexto de hostelería.

Completa los huecos:

1. "I'd ___ the chicken salad, please."
2. "Can ___ have a glass of water?"
3. "I'd like the steak ___ chips, please." (en lugar de / instead of)
4. "Could I have the fish ___ lemon?" (sin)
5. "I'd like a coffee ___ milk, please." (con)

Respuestas: 1. like  2. I  3. without  4. without  5. with


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — DIÁLOGO CON HUECOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa el diálogo con las palabras del cuadro:
(bill / ready / like / have / come / order)

Waiter: "Are you _______ to _______?"
Customer A: "Yes. I'd _______ the soup to start, please."
Waiter: "And for you?"
Customer B: "Can I _______ the pasta? What does it _______ with?"
Waiter: "It comes with salad."
Customer B: "Perfect, thank you."
[Later]
Customer A: "Excuse me, can I have the _______, please?"
Waiter: "Of course, here you are."

Respuesta: ready / order / like / have / come / bill


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE E — SITUACIÓN REAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lee y responde:

"Mark and Sophie are at an Italian restaurant. Mark orders a bowl of tomato soup and then the beef with roast potatoes. He asks for the dressing on the side. Sophie has the pasta without cheese — she's vegan. They share a bottle of sparkling water. For dessert, Mark has a piece of chocolate cake and a black coffee. Sophie doesn't have dessert. At the end, they ask for the bill and pay by card."

1. ¿Qué pide Mark de primero?
2. ¿Cómo quiere Sophie la pasta?
3. ¿Qué piden para beber?
4. ¿Qué toma Mark de postre?
5. ¿Cómo pagan?

Respuestas:
1. A bowl of tomato soup.
2. Without cheese.
3. A bottle of sparkling water.
4. A piece of chocolate cake and a black coffee.
5. By card.`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U6
// 10 preguntas × 1 punto = 10 pts totales.
// passingScore 80 → 8/10 = 80%
// Parte B en description: enunciado para el estudiante.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U6 = {
  title:        'Eating Out & Ordering — Unit 6 Assessment',
  description:  'Escribe el diálogo completo de una visita a un restaurante: llegar, pedir una bebida, pedir el plato principal y pedir la cuenta. Usa I\'d like, Can I have y al menos una pregunta del camarero.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '¿Cómo se dice "ternera" (la carne de vaca) en inglés?',
      options:      ['pork', 'lamb', 'beef', 'chicken'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         'Elige la forma correcta: "Can I have ___ water, please?"',
      options:      ['a', 'an', 'some', 'any'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         'Elige la forma correcta: "I\'d like ___ orange juice, please."',
      options:      ['a', 'an', 'some', 'any'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Cuál es la forma más educada de pedir algo en un restaurante?',
      options:      ['Give me a coffee.', 'I want a coffee.', 'I\'d like a coffee, please.', 'Coffee.'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         'El camarero pregunta "Are you ready to order?" Quieres el pescado. ¿Qué dices?',
      options:      ['Yes, the fish.', 'I want fish.', 'Yes, I\'d like the fish, please.', 'Fish for me.'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál de estas palabras es INCONTABLE en inglés?',
      options:      ['apple', 'sandwich', 'bread', 'egg'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cómo se pide la cuenta en inglés?',
      options:      ['Can I have the bill, please?', 'Give me the bill.', 'I want the check.', 'Pay, please.'],
      correctIndex: 0,
      points:       1,
    },
    {
      text:         '"I\'d like the pasta ___ cheese, please." Quieres la pasta sin queso. ¿Qué palabra falta?',
      options:      ['with', 'without', 'and', 'or'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"___ I have a table for two, please?" (Forma educada)',
      options:      ['Could', 'Should', 'Would', 'Must'],
      correctIndex: 0,
      points:       1,
    },
    {
      text:         'El camarero dice "What would you like?" ¿Qué significa?',
      options:      ['¿Qué cree usted?', '¿Qué desea tomar?', '¿Qué puede comer?', '¿Qué está haciendo?'],
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
    title:            'Eating Out & Ordering',
    order:            6,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L6.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'Food & Drink — Vocabulary',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L61,
      duration: 15,
      order:    1,
    }),

    // L6.2 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    "I'd Like... — Ordering in a Café or Restaurant",
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L62,
      duration: 15,
      order:    2,
    }),

    // L6.3 — VIDEO
    // Canal recomendado: BBC Learning English
    // Búsqueda: "ordering food English café restaurant A1 beginner BBC"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: At the Café',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-u6-l3',
      duration: 10,
      order:    3,
    }),

    // L6.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Can I Have...? — Dialogues',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L64,
      duration: 15,
      order:    4,
    }),

    // L6.5 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'Order Up! — Quiz',
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
