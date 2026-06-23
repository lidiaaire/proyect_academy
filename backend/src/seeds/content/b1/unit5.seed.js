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
// L5.1 — The Person Who, The Place Where — Defining Relative Clauses
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L51 = `Las cláusulas de relativo son frases que se añaden a un nombre para identificarlo o describir mejor. En inglés B1 las usas para hablar con más precisión de personas, lugares y cosas — una habilidad clave en conversaciones de viajes y cultura.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUÉ ES UNA DEFINING RELATIVE CLAUSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Una defining relative clause define o restringe el significado del nombre al que acompaña.
Sin ella, no sabes exactamente a quién o qué te estás refiriendo.

"The man who called earlier is waiting outside."
→  No es cualquier hombre — es el específico que llamó antes. La cláusula lo identifica.

"The country where I was born is called Spain."
→  No cualquier país — el que me vio nacer.

"The documentary that we watched last night was excellent."
→  No cualquier documental — ese en concreto.

SIN COMAS. Las defining relative clauses van pegadas al nombre, sin comas.
Las comas cambiarían el significado — las veremos en la siguiente lección.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOS PRONOMBRES RELATIVOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHO      →  para personas
"The journalist who broke the story won an award."
"Do you know the woman who runs the café on the corner?"

WHICH    →  para cosas y animales
"The book which I recommended is now out of stock."
"This is the dish which became famous after the documentary."

THAT     →  para personas O cosas (alternativa a who/which en defining clauses)
"The journalist that broke the story won an award."
"The book that I recommended is now out of stock."
→  THAT es más frecuente en inglés oral e informal.
→  WHICH y WHO se prefieren en registro más formal o escrito.

WHERE    →  para lugares
"This is the village where my grandmother was born."
"Is there a place where we can sit and talk?"

WHOSE    →  para posesión (de quien / cuyo)
"The artist whose work I admire lives in Berlin."
"I met a family whose daughter speaks four languages."
→  WHOSE sustituye a su / sus (posesivo del nombre antecedente).


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUÁNDO PUEDES OMITIR EL PRONOMBRE RELATIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Puedes omitir el pronombre relativo cuando es el OBJETO de la cláusula.
El objeto es la persona o cosa que recibe la acción del verbo de la cláusula.

"The book [that] I read last year was incredible."
→  "I read the book" — el libro es el objeto de read. Se puede omitir.

"The city [which] she grew up in has changed a lot."
→  "She grew up in the city" — la ciudad es el objeto. Se puede omitir.

"The person [who] you should speak to is the manager."
→  "You should speak to the person" — persona es objeto. Se puede omitir.

NO puedes omitir cuando es el SUJETO de la cláusula:
"The man who called is waiting." → who es sujeto (él llama). NO se puede omitir.
"The book that changed my life" → that es sujeto (el libro cambia). NO se puede omitir.

Truco: si el pronombre va seguido directamente de un verbo, es sujeto — no lo omitas.
       si va seguido de un sujeto nuevo, es objeto — puedes omitirlo.

"The film [that] I saw / vs / The film that won"
         objeto: yo vi      sujeto: el film ganó


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN CONTEXTO — VIAJES Y CULTURA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"The guide who showed us around the old city was incredibly knowledgeable."
"The restaurant where we had dinner on the first night is now closed, apparently."
"I'd love to visit the country whose cuisine I've been reading about."
"Is there anything that you particularly want to see while you're here?"
"The language that surprised me most was Japanese — the writing system is beautiful."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — WHOSE VS. OF WHICH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHOSE se usa para personas principalmente, pero también para cosas en registro formal:
"A country whose population is declining..." (formal pero correcto)
"A city whose streets I know well..." (perfectamente natural)

No uses WHO para cosas:
❌ "The book who I read..."
✅ "The book that / which I read..."

No uses WHICH para personas como sujeto:
❌ "The woman which helped me..."
✅ "The woman who helped me..."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con el pronombre relativo correcto (o indica si puede omitirse):

1. The journalist _______ wrote the article has won several awards.
2. Is this the town _______ the festival takes place every summer?
3. The friend _______ I'm staying with is incredibly hospitable.
4. She works for a company _______ products are sold in forty countries.
5. That's the documentary _______ changed my view of the world completely.

Respuestas:
1. who (sujeto → no se puede omitir)
2. where
3. who / that (objeto → se puede omitir)
4. whose
5. that / which (sujeto → no se puede omitir)`;

// ─────────────────────────────────────────────────────────────────────────────
// L5.3 — Extra Information — Non-Defining Relative Clauses
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L53 = `En la lección anterior aprendiste las cláusulas que identifican — las que dicen de cuál estamos hablando. Ahora aprenderás las que añaden información extra sobre algo que ya está identificado. La diferencia parece pequeña pero cambia el significado.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUÉ ES UNA NON-DEFINING RELATIVE CLAUSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Una non-defining relative clause añade información adicional sobre un nombre ya identificado.
Si la quitas, la frase sigue teniendo sentido completo — solo pierdes el detalle extra.

"My sister, who lives in Tokyo, is a teacher."
→  Ya sabes de quién hablo (mi hermana). La cláusula añade dónde vive — es información extra.
→  Si la quitas: "My sister is a teacher." Perfectamente completo.

"Barcelona, where I was born, has the best food in the world."
→  Ya sabes qué ciudad es. La cláusula añade que nací allí — dato adicional.

CON COMAS. Las non-defining relative clauses siempre van entre comas (o precedidas de coma si van al final de la frase).


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOS PRONOMBRES EN NON-DEFINING CLAUSES
━━━━━━━━━────────────────────────────────

Las reglas son ligeramente diferentes a las defining:

WHO      →  para personas (igual que en defining)
"My colleague, who has lived in five countries, speaks six languages."

WHICH    →  para cosas (NO se usa "that" en non-defining)
"The trip, which lasted three weeks, changed my perspective completely."
"His first novel, which was published in 2008, became a bestseller."

WHERE    →  para lugares (igual que en defining)
"We stayed in Kyoto, where the temples are extraordinary."

WHOSE    →  para posesión (igual que en defining)
"The chef, whose restaurant has three Michelin stars, trained in Paris."

REGLA CLAVE: THAT nunca se usa en non-defining relative clauses.
❌ "My brother, that works in Madrid, called me yesterday."
✅ "My brother, who works in Madrid, called me yesterday."

❌ "The Sagrada Família, that has been under construction for over a century, is in Barcelona."
✅ "The Sagrada Família, which has been under construction for over a century, is in Barcelona."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFINING VS. NON-DEFINING — LA DIFERENCIA DE SIGNIFICADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La diferencia no es solo de puntuación — cambia el significado de la frase.

EJEMPLO 1:
DEFINING:     "The students who passed the exam celebrated."
→  Solo algunos estudiantes pasaron. Los que pasaron celebraron. Los que no, no.

NON-DEFINING: "The students, who all passed the exam, celebrated."
→  Todos los estudiantes pasaron. Todos celebraron.

EJEMPLO 2:
DEFINING:     "My friend who lives in Paris is coming to visit."
→  Tengo varios amigos. El que vive en París viene a visitarme.

NON-DEFINING: "My friend Ana, who lives in Paris, is coming to visit."
→  Ya sé quién es (Ana). El dato de París es adicional.

En el segundo ejemplo, el nombre propio ya identifica a la persona, por lo que la cláusula es automáticamente non-defining (lleva comas).


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EL PRONOMBRE OMITIDO EN NON-DEFINING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NUNCA se omite el pronombre en una non-defining relative clause:

❌ "My sister, lives in Tokyo, is a teacher." (falta el pronombre)
✅ "My sister, who lives in Tokyo, is a teacher."

❌ "The report, I wrote last week, has been approved."
✅ "The report, which I wrote last week, has been approved."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGISTRO — MÁS FORMAL EN ESCRITURA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Las non-defining relative clauses son más frecuentes en escritura que en conversación.
En el habla, tendemos a dividir la información en frases separadas:

Escrito: "The documentary, which I had wanted to see for months, was disappointing."
Oral:    "I'd wanted to see that documentary for months. In the end it was disappointing."

Sin embargo, en inglés oral de nivel B1 y superior, las no-defining aparecen con naturalidad:
"My last trip, which was to Japan, was the best experience of my life."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Añade comas donde sea necesario y elige el pronombre correcto:

1. My grandmother _______ grew up during the war has incredible stories to tell.
2. The Alhambra _______ is in Granada attracts millions of visitors every year.
3. I'd like to visit Vietnam _______ the street food is supposed to be amazing.
4. The journalist _______ article we read yesterday has won three awards.
5. She met a traveller _______ had visited over eighty countries.

Respuestas:
1. My grandmother, WHO grew up during the war, has incredible stories to tell. (non-defining)
2. The Alhambra, WHICH is in Granada, attracts millions of visitors every year. (non-defining)
3. I'd like to visit Vietnam, WHERE the street food is supposed to be amazing. (non-defining)
4. The journalist WHOSE article we read yesterday has won three awards. (defining — hay posesión)
5. She met a traveller WHO had visited over eighty countries. (defining — identifica al viajero)`;

// ─────────────────────────────────────────────────────────────────────────────
// L5.4 — If I Could Go Anywhere... — Conditional Type 2
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L54 = `Hasta ahora sabías hablar de condiciones reales y posibles. En esta lección añades una herramienta nueva: el conditional type 2, para hablar de situaciones hipotéticas — cosas que imaginas pero que no son tu realidad actual.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA ESTRUCTURA — IF + PAST SIMPLE, WOULD + INFINITIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IF + past simple  →  would / could / might + infinitivo

La cláusula con IF describe una condición imaginada — algo que no es verdad ahora.
La cláusula principal describe el resultado hipotético.

"If I had more time, I would learn Japanese."
→  Ahora no tengo más tiempo. Es una hipótesis.

"If she lived closer, we would see each other more often."
→  Ella no vive cerca. Es una situación imaginada.

"If we had a bigger flat, we could have more friends over."
→  No tenemos un piso más grande. Condición irreal.

El orden puede invertirse sin coma cuando la cláusula principal va primero:
"I would learn Japanese if I had more time."
"We would see each other more often if she lived closer."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IF I WERE YOU... — UNA FORMA ESPECIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Con el verbo BE, el inglés formal y estándar usa WERE para todos los sujetos en type 2:

"If I were you, I would apologise."
"If she were here, she would know what to do."
"If it were possible, I'd do it differently."

En inglés coloquial también se oye "was" con I, he, she, it:
"If I was younger..." / "If she was here..."

Para uso B1 correcto, usa WERE — especialmente en "If I were you":
"If I were you, I wouldn't accept that offer."
"If I were in your position, I'd talk to the manager."

Esta expresión es una de las más útiles del conditional type 2: sirve para dar consejos.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WOULD, COULD Y MIGHT EN EL RESULTADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ya conoces might y could de B1 Unit 2 para hablar de posibilidad. Aquí los usas en el resultado del conditional type 2 para matizar cuánta certeza tienes sobre el hipotético resultado.

WOULD → resultado hipotético con bastante certeza:
"If I lived in Japan, I would study the language intensively."
→  Estoy bastante seguro de que lo haría.

COULD → resultado posible o capacidad hipotética:
"If I had more confidence, I could speak in front of large audiences."
→  Podría — sería posible para mí.

MIGHT → resultado posible pero incierto:
"If she moved to a new city, she might find it difficult at first."
→  Puede que le costara — no es seguro.

Los tres son correctos en type 2. Elegir uno u otro depende del grado de certeza que quieras transmitir:

"If I had the money, I would buy a house." (casi seguro que lo haría)
"If I had the money, I could buy a house." (sería posible / estaría en condiciones)
"If I had the money, I might buy a house." (lo consideraría, pero no lo sé)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USOS DEL CONDITIONAL TYPE 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SITUACIONES HIPOTÉTICAS (lo contrario de la realidad):
"If I spoke better Chinese, I would feel more confident in Shanghai."
(No hablo bien chino — es la realidad)

2. SUEÑOS Y DESEOS:
"If I could live anywhere, I would choose Kyoto."
"What would you do if you didn't have to work?"

3. DAR CONSEJOS:
"If I were you, I'd book the flights early — prices go up fast."
"What would you do if you were in my situation?"

4. ESPECULACIÓN SOBRE EL PRESENTE O FUTURO:
"If everyone recycled more, pollution would decrease significantly."
"If companies invested in clean energy, they might reduce their costs."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TYPE 1 VS. TYPE 2 — REAL O HIPOTÉTICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ya tienes los dos tipos. La diferencia fundamental:

TYPE 1 — condición REAL o POSIBLE (puede ocurrir de verdad):
"If it rains, I'll take an umbrella."  →  Es posible que llueva hoy.
"If you apply now, you will get an interview."  →  Es algo que puede pasar.

TYPE 2 — condición HIPOTÉTICA o IRREAL (lo contrario de la realidad):
"If it rained here every day, I would move."  →  No llueve todos los días — es imaginado.
"If I could fly, I would travel everywhere."  →  No puedo volar — es imaginado.

EL MISMO ESCENARIO, DOS PERSPECTIVAS:

TYPE 1: "If I get the job, I'll move to London."
→  Hay una entrevista pendiente — es una posibilidad real.

TYPE 2: "If I got the job, I would move to London."
→  Es un sueño o especulación — no hay ninguna oferta concreta.

Atención: El tiempo verbal del tipo 2 (past simple en la cláusula IF) no indica pasado — indica distancia de la realidad. Es un uso especial del past simple.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — WILL EN LA CLÁUSULA IF (TYPE 2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El mismo error que en type 1, pero con would:

❌ "If I would have more time, I would travel more."
✅ "If I had more time, I would travel more."

❌ "If she would live closer, we'd see each other."
✅ "If she lived closer, we'd see each other."

Nunca uses WOULD en la cláusula con IF.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con la forma correcta del conditional type 2:

1. If I _______ (be) you, I _______ (not / accept) that offer.
2. Where _______ you _______ (go) if you _______ (have) a month off work?
3. If she _______ (speak) better French, she _______ (could / apply) for the Paris position.
4. They _______ (might / travel) more if the flights _______ (be) cheaper.
5. If this city _______ (have) a better public transport system, more people _______ (use) it.

Respuestas:
1. were / wouldn't accept
2. would... go / had
3. spoke / could apply
4. might travel / were
5. had / would use`;

// ─────────────────────────────────────────────────────────────────────────────
// L5.5 — Culture, Customs and Connections
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L55 = `El vocabulario cultural te permite hablar de las diferencias entre países, entender experiencias de viaje y conectar con personas de culturas distintas. Esta lección también te da las expresiones para hacerlo con respeto y curiosidad.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VOCABULARIO DE CULTURA Y TRADICIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

customs            →  costumbres (prácticas habituales de una sociedad)
traditions         →  tradiciones (prácticas transmitidas de generación en generación)
values             →  valores (principios importantes para una cultura)
social norms       →  normas sociales (lo que se considera aceptable)
etiquette          →  etiqueta / protocolo social (las "normas" de comportamiento)
taboo              →  tabú (tema o comportamiento que no se menciona o hace)
hospitality        →  hospitalidad
heritage           →  patrimonio (cultural o histórico)
identity           →  identidad

"In many Asian cultures, removing your shoes before entering a home is part of the etiquette."
"Gift-giving customs vary enormously from one country to another."
"Understanding local social norms helps avoid misunderstandings."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CULTURE SHOCK — FASES Y VOCABULARIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

culture shock      →  choque cultural (la desorientación al llegar a una nueva cultura)
adjustment         →  adaptación
homesickness       →  morriña / añoranza del hogar
reverse culture shock →  choque cultural al regresar al propio país

LAS CUATRO FASES DEL CHOQUE CULTURAL:

1. Honeymoon phase  →  Todo es fascinante y emocionante (las primeras semanas)
2. Frustration      →  Las diferencias empiezan a molestar o confundir
3. Adjustment       →  Comienzas a adaptarte y a entender la nueva cultura
4. Adaptation       →  Te sientes cómodo/a y funcional en la nueva cultura

"At first, everything was exciting — classic honeymoon phase."
"After a few months, I found myself really struggling with the cultural differences."
"I had to go through a period of adjustment before I felt comfortable."
"Interestingly, I had reverse culture shock when I went back home."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADJETIVOS PARA DESCRIBIR CULTURAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cosmopolitan       →  cosmopolita (diverso e internacional)
multicultural      →  multicultural
welcoming          →  acogedor
reserved           →  reservado (las personas no se abren fácilmente)
laid-back          →  relajado / tranquilo (ritmo de vida pausado)
formal             →  formal (con jerarquía y protocolo)
close-knit         →  unido (comunidad muy cohesionada)
individualistic    →  individualista
collective         →  colectivista (el grupo sobre el individuo)
open-minded        →  de mente abierta

"Japan is often described as polite and reserved, with very clear social etiquette."
"Buenos Aires has a cosmopolitan, welcoming atmosphere."
"Scandinavian cultures tend to be more individualistic than Mediterranean ones."
"My home city is a close-knit community where everyone knows each other."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VOCABULARIO DE VIAJES Y TURISMO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

sightseeing        →  turismo / visitar lugares de interés
heritage site      →  sitio de patrimonio histórico
off the beaten track →  fuera de los circuitos turísticos habituales
package holiday    →  vacaciones organizadas (todo incluido)
gap year           →  año sabático (antes de la universidad o entre trabajos)
itinerary          →  itinerario
local cuisine      →  gastronomía local
souvenir           →  recuerdo / souvenir

"I prefer travelling off the beaten track — tourist areas tend to feel artificial."
"We spent three days doing sightseeing in Rome: the Colosseum, the Vatican, the Trevi Fountain."
"Trying the local cuisine is always the best way to understand a culture."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRASES PARA HABLAR DE DIFERENCIAS CULTURALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para comparar culturas con respeto:
"In my culture, it's common to... whereas in [country], people tend to..."
"One thing that surprised me was that..."
"I noticed that here, people... — where I'm from, we usually..."
"I found it fascinating that..."
"I had to get used to the fact that..."

Para mostrar apertura y curiosidad:
"That's really interesting — could you tell me more about that tradition?"
"I hadn't thought about it that way."
"I can understand why that would be important in your culture."

Para pedir ayuda o consejo antes de viajar:
"Is there anything I should know about local customs before I visit?"
"Are there any topics I should avoid?"
"What's considered polite / impolite when meeting someone for the first time?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMBINANDO GRAMÁTICA Y VOCABULARIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Las cláusulas de relativo y el conditional type 2 — ambos vistos en esta unidad — funcionan perfectamente con el vocabulario cultural:

"The country where I felt most at home was New Zealand, which has a wonderfully laid-back culture."
"If I could live anywhere, I would choose Japan — a country whose traditions I find deeply fascinating."
"The family who hosted me in Morocco showed me a level of hospitality that I had never experienced before."
"If I were in your position, I would try to learn at least a few phrases in the local language before going."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Responde en inglés:

1. ¿Qué es el "culture shock" y cuáles son sus fases?
2. Usa una cláusula de relativo para describir un lugar cultural que te interese.
3. Usa el conditional type 2 para expresar dónde vivirías si pudieras elegir.
4. Describe la cultura de tu país usando dos adjetivos de la lista.

Respuestas posibles:
1. Culture shock is the disorientation you feel when immersed in a new culture. Phases: honeymoon, frustration, adjustment, adaptation.
2. "I'd love to visit Kyoto, which is famous for its temples and traditional culture."
3. "If I could live anywhere, I would choose New Zealand, where the landscapes are extraordinary."
4. Various answers possible — e.g. "Spanish culture is warm and welcoming. It's also quite laid-back in terms of meal times and social life."`;

// ─────────────────────────────────────────────────────────────────────────────
// L5.6 — Relative Clauses & Conditionals — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L56 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — DEFINING RELATIVE CLAUSES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. "The journalist _______ broke the story won an award." ¿Qué pronombre es correcto?
   a) which   b) who   c) where   d) whose
   Respuesta: b (who para personas, sujeto de la cláusula)

2. "The documentary _______ we watched last night was fascinating." ¿Qué pronombre es correcto?
   a) who   b) whose   c) which   d) where
   Respuesta: c (which para cosas)

3. "The article _______ I read yesterday was very biased."
   ¿Puede omitirse el pronombre? ¿Por qué?
   a) No, porque es sujeto de la cláusula.
   b) Sí, porque es objeto de la cláusula ("I read the article").
   c) No, porque se refiere a una cosa, no a una persona.
   d) Sí, siempre se puede omitir en defining clauses.
   Respuesta: b


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — NON-DEFINING RELATIVE CLAUSES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. "My sister, _______ lives in Tokyo, is a translator." ¿Qué pronombre es correcto?
   a) that   b) who   c) which   d) where
   Respuesta: b (who para personas; "that" no se usa en non-defining)

5. "The Sagrada Família, _______ has been under construction since 1882, is in Barcelona."
   a) that   b) who   c) which   d) whose
   Respuesta: c (which para cosas en non-defining; "that" nunca en non-defining)

6. ¿Cuál de estas frases implica que TODOS los estudiantes aprobaron?
   a) "The students who passed the exam celebrated."
   b) "The students, who all passed the exam, celebrated."
   c) Ambas significan lo mismo.
   d) Ninguna de las dos.
   Respuesta: b (non-defining → aplica a todos; defining → solo a los que pasaron)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — CONDITIONAL TYPE 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. "If I _______ more time, I _______ learn a new language." ¿Qué formas son correctas?
   a) have / will   b) had / would   c) have / would   d) had / will
   Respuesta: b

8. ¿Cuál de estas frases usa el conditional type 2 correctamente?
   a) "If it rains, I will stay inside."
   b) "If I were you, I would apologise."
   c) "If it rained yesterday, I stayed inside."
   d) "If you study, you will pass."
   Respuesta: b (were + would = type 2 hipotético)

9. "If she had more confidence, she _______ apply for the job." (posibilidad, no certeza)
   a) will   b) would definitely   c) might   d) had
   Respuesta: c (might para posibilidad hipotética)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — TYPE 1 VS. TYPE 2 Y VOCABULARIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. "If I _______ a million euros, I _______ travel the world." (hipotético — no tienes un millón)
    a) win / will   b) won / would   c) win / would   d) won / will
    Respuesta: b

11. "El escritor _______ libros he leído es de Colombia." ¿Qué pronombre de posesión es correcto?
    a) who   b) which   c) whose   d) where
    Respuesta: c

12. "La sensación de desconcierto al llegar a una cultura muy diferente" se llama:
    a) culture clash   b) culture shock   c) cultural awareness   d) cultural etiquette
    Respuesta: b`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U5 — 12 preguntas × 1 punto. passingScore 80 → mínimo 10/12.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U5 = {
  title:        'Travel & Culture — Unit 5 Assessment',
  description:  'Imagina que puedes vivir en cualquier país del mundo. Escribe un párrafo de seis a ocho frases usando al menos dos cláusulas de relativo, una estructura de conditional type 2 y dos palabras del vocabulario cultural de la unidad.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '"The journalist _______ broke the story won an award." ¿Qué pronombre relativo es correcto?',
      options:      ['which', 'who', 'where', 'whose'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"The documentary _______ we watched last night was fascinating." ¿Qué pronombre es correcto?',
      options:      ['who', 'whose', 'which', 'where'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"The article _______ I read yesterday was very biased." ¿Puede omitirse el pronombre?',
      options:      ['No, porque es sujeto de la cláusula.', 'Sí, porque es objeto de la cláusula.', 'No, porque se refiere a una cosa.', 'Sí, siempre se puede omitir.'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"My sister, _______ lives in Tokyo, is a translator." ¿Qué pronombre es correcto en esta non-defining clause?',
      options:      ['that', 'who', 'which', 'where'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"The Sagrada Família, _______ has been under construction since 1882, is in Barcelona."',
      options:      ['that', 'who', 'which', 'whose'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál de estas frases implica que TODOS los estudiantes aprobaron?',
      options:      ['"The students who passed the exam celebrated."', '"The students, who all passed the exam, celebrated."', 'Ambas significan lo mismo.', 'Ninguna de las dos.'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"If I _______ more time, I _______ learn a new language." ¿Qué formas son correctas?',
      options:      ['have / will', 'had / would', 'have / would', 'had / will'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Cuál de estas frases usa el conditional type 2 correctamente?',
      options:      ['"If it rains, I will stay inside."', '"If I were you, I would apologise."', '"If it rained yesterday, I stayed inside."', '"If you study, you will pass."'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"If she had more confidence, she _______ apply for the job." ¿Qué modal expresa posibilidad hipotética?',
      options:      ['will', 'would definitely', 'might', 'had'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"If I _______ a million euros, I _______ travel the world." (situación hipotética — no tienes un millón)',
      options:      ['win / will', 'won / would', 'win / would', 'won / will'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"The writer _______ books I\'ve read is from Colombia." ¿Qué pronombre de posesión es correcto?',
      options:      ['who', 'which', 'whose', 'where'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"La sensación de desconcierto al llegar a una cultura muy diferente" se llama:',
      options:      ['culture clash', 'culture shock', 'cultural awareness', 'cultural etiquette'],
      correctIndex: 1,
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
    title:            'Travel & Culture',
    order:            5,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L5.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'The Person Who, The Place Where — Defining Relative Clauses',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L51,
      duration: 20,
      order:    1,
    }),

    // L5.2 — VIDEO
    // Canal recomendado: DW Documentary / BBC Travel
    // Búsqueda: "expat life culture shock English documentary"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: Life in Another Country',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-b1-u5-l2',
      duration: 12,
      order:    2,
    }),

    // L5.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'Extra Information — Non-Defining Relative Clauses',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L53,
      duration: 20,
      order:    3,
    }),

    // L5.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'If I Could Go Anywhere... — Conditional Type 2',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L54,
      duration: 20,
      order:    4,
    }),

    // L5.5 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'Culture, Customs and Connections',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L55,
      duration: 20,
      order:    5,
    }),

    // L5.6 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 6 }, {
      unitId:   unit._id,
      courseId,
      title:    'Relative Clauses & Conditionals — Quiz',
      type:     LESSON_TYPES.QUIZ,
      content:  CONTENT_L56,
      duration: 25,
      order:    6,
    }),

  ]);

  await upsert(Assessment, { unitId: unit._id }, {
    unitId:   unit._id,
    courseId,
    ...ASSESSMENT_U5,
  });
};
