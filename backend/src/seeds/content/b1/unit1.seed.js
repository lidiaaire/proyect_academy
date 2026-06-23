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
// L1.1 — While Things Were Happening — Past Continuous
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L11 = `Antes de aprender a hablar del pasado con precisión, necesitas dominar una forma que quizás ya conoces en presente: el present continuous. Esta lección empieza ahí y luego da el salto al pasado.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE PARTIDA — EL PRESENT CONTINUOUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El present continuous describe una acción que está ocurriendo en este momento:

am / is / are + verbo + -ing

"I am reading right now."            →  Estoy leyendo ahora mismo.
"She is cooking dinner."             →  Está cocinando la cena.
"They are studying for the exam."    →  Están estudiando para el examen.
"It is raining outside."             →  Está lloviendo fuera.

El verbo BE (am / is / are) es el auxiliar — indica que la acción está en proceso.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EL SALTO AL PASADO — PAST CONTINUOUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para describir una acción que estaba en proceso en un momento del pasado, simplemente cambias el verbo BE al pasado:

am / is  →  was
are      →  were

was / were + verbo + -ing

"I was reading when you called."       →  Estaba leyendo cuando llamaste.
"She was cooking dinner at eight."     →  Estaba cocinando a las ocho.
"They were studying all afternoon."    →  Estuvieron estudiando toda la tarde.
"It was raining when I left."          →  Estaba lloviendo cuando salí.

La forma -ing del verbo principal no cambia. Solo cambia el auxiliar BE.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOS USOS DEL PAST CONTINUOUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USO 1 — ACCIÓN INTERRUMPIDA
Una acción larga estaba en progreso cuando ocurrió otro evento más breve.

Past continuous (acción larga) + WHEN + Past simple (evento que interrumpe):

"I was having a shower when the phone rang."
→  Estaba en la ducha cuando sonó el teléfono.

"She was walking to work when she saw the accident."
→  Iba caminando al trabajo cuando vio el accidente.

"They were watching the film when the power went off."
→  Estaban viendo la película cuando se fue la luz.

USO 2 — DESCRIPCIÓN DE FONDO
El past continuous pinta el escenario: qué estaba ocurriendo alrededor de los eventos principales.

"It was a cold evening. The wind was blowing and the streets were empty. Nobody was walking outside."
→  Era una tarde fría. El viento soplaba y las calles estaban vacías. Nadie caminaba fuera.

Este uso convierte el past continuous en una herramienta narrativa muy poderosa.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHEN vs WHILE — ¿CUÁL USAR?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHEN introduce el evento corto (past simple):
"I was sleeping WHEN the alarm went off."   (el alarm going off es el evento puntual)

WHILE introduce la acción larga (past continuous):
"WHILE I was sleeping, the alarm went off."  (la misma idea, diferente conector)

Ambas frases significan lo mismo. La diferencia es solo qué parte de la frase va primero.

Otro ejemplo:
"He called me WHEN I was driving."   =   "WHILE I was driving, he called me."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTRASTE — PAST SIMPLE VS. PAST CONTINUOUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"I walked to the station."
→  Fui caminando a la estación. (evento completo, resultado)

"I was walking to the station."
→  Iba caminando a la estación. (acción en progreso en un momento dado)

"She read the report."
→  Leyó el informe. (lo terminó)

"She was reading the report."
→  Estaba leyendo el informe. (en proceso, no sabemos si terminó)

El past simple narra eventos — el past continuous describe procesos.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — VERBOS DE ESTADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Algunos verbos no se usan normalmente en continuous porque expresan estados, no acciones:
know, believe, understand, love, hate, want, need, seem, own, belong...

❌ "I was knowing the answer."
✅ "I knew the answer."

❌ "She was wanting a coffee."
✅ "She wanted a coffee."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con past continuous o past simple según el contexto:

1. I _______ (watch) TV when my sister _______ (arrive).
2. While they _______ (have) dinner, it _______ (start) to snow.
3. She _______ (wear) a red coat and _______ (carry) a small bag.
4. What _______ you _______ (do) at eight o'clock last night?
5. He _______ (drop) his keys while he _______ (run) for the bus.

Respuestas:
1. was watching / arrived
2. were having / started
3. was wearing / was carrying (descripción de fondo)
4. were ... doing
5. dropped / was running`;

// ─────────────────────────────────────────────────────────────────────────────
// L1.3 — Before It Happened — Past Perfect
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L13 = `Para hablar del pasado con precisión temporal —indicar que algo ocurrió antes que otra cosa también pasada— necesitas una forma verbal nueva. Pero primero hay que aprender la pieza que la sostiene: el participio pasado.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASO 1 — LOS PARTICIPIOS PASADOS (NUEVO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El participio pasado es una forma del verbo distinta del infinitivo y del past simple.
Para los verbos REGULARES, el participio pasado es igual al past simple (-ed):

work → worked → worked   (past simple = participio)
visit → visited → visited

Para los verbos IRREGULARES, el participio pasado es una forma PROPIA que debes memorizar.
Ya conoces el past simple de estos verbos; ahora añade la tercera columna:

Infinitivo    Past Simple    Participio pasado
go            went           GONE
eat           ate            EATEN
see           saw            SEEN
take          took           TAKEN
write         wrote          WRITTEN
do            did            DONE
be            was / were     BEEN
give          gave           GIVEN
know          knew           KNOWN
come          came           COME
get           got            GOT / GOTTEN
have          had            HAD
say           said           SAID
make          made           MADE
find          found          FOUND
leave         left           LEFT
buy           bought         BOUGHT
bring         brought        BROUGHT
think         thought        THOUGHT
feel          felt           FELT

Nota: buy → bought / bring → brought — el participio es igual al past simple en estos casos.
Note that "come" and "have" also share the same form: come → came → come / have → had → had.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASO 2 — EL PAST PERFECT: HAD + PARTICIPIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ahora que tienes el participio, el past perfect es simple:

HAD + participio pasado

"She had gone before I arrived."          →  Ella se había ido antes de que yo llegara.
"I had eaten, so I wasn't hungry."        →  Había comido, así que no tenía hambre.
"They had never seen snow before."        →  Nunca antes habían visto nieve.
"He had written the email but didn't send it."  →  Había escrito el email pero no lo envió.
"We had already left when she called."    →  Ya habíamos salido cuando llamó.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿CUÁNDO SE USA EL PAST PERFECT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El past perfect sirve para dejar claro cuál de dos eventos pasados ocurrió ANTES.

Sin past perfect (orden cronológico ambiguo):
"She left and he arrived."
→  No queda claro cuál fue primero — podría ser cualquiera.

Con past perfect (orden claro):
"She had left when he arrived."
→  Primero se fue ella, luego llegó él. Sin ambigüedad.

El evento más antiguo usa past perfect. El más reciente usa past simple.

LÍNEA DE TIEMPO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[She LEFT]  .....  [He ARRIVED]
  had left               arrived
  (más antiguo)          (más reciente)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONECTORES FRECUENTES CON PAST PERFECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

after        →  "After he had finished, he went out."
before       →  "She called before I had even woken up."
when         →  "When I arrived, the show had already started."
by the time  →  "By the time we got there, they had left."
because      →  "I was tired because I had worked all day."
already      →  "She had already eaten, so she wasn't hungry."
never        →  "It was the best film I had ever seen."
just         →  "He had just left when I called."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿CUÁNDO NO ES NECESARIO?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cuando el orden es ya obvio por el contexto o por un conector como "after" o "before",
el past perfect es opcional aunque siempre correcto:

"After I finished (/ had finished), I went home."  →  Ambas formas son correctas.

Si no hay ambigüedad, puedes usar past simple. Si hay riesgo de confusión, usa past perfect.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — CONFUNDIR PAST SIMPLE CON PARTICIPIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El error más frecuente: usar el past simple en lugar del participio.

❌ "She had went to the shop."         ✅ "She had gone to the shop."
❌ "I had ate before you arrived."     ✅ "I had eaten before you arrived."
❌ "He had saw that film before."      ✅ "He had seen that film before."
❌ "We had wrote the report already."  ✅ "We had written the report already."

HAD siempre va seguido de PARTICIPIO, nunca de past simple.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con el participio pasado correcto:

1. By the time I arrived, she had already _______ (go).
2. He was tired because he had _______ (work) twelve hours.
3. I had never _______ (eat) sushi before that evening.
4. They had _______ (leave) a note on the door.
5. She had _______ (write) three emails before breakfast.

Respuestas: 1. gone  2. worked  3. eaten  4. left  5. written`;

// ─────────────────────────────────────────────────────────────────────────────
// L1.4 — The Full Picture — Combining All Three Tenses
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L14 = `Ahora tienes los tres tiempos narrativos. Esta lección te enseña a combinarlos en un texto real, que es donde el inglés de nivel B1 realmente empieza.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUÉ HACE CADA TIEMPO EN UNA NARRACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAST SIMPLE — el esqueleto de la historia
Narra los eventos principales en orden cronológico.
"I arrived. I opened the door. I walked in."

PAST CONTINUOUS — el escenario
Describe lo que estaba ocurriendo de fondo cuando suceden los eventos principales.
"The music was playing. People were talking. Someone was laughing in the corner."

PAST PERFECT — la historia dentro de la historia
Explica lo que ya había ocurrido antes del momento que estás narrando.
"I recognised him — I had met him once, years before."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UN TEXTO NARRATIVO ANOTADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lee el siguiente texto. Los corchetes indican la función de cada tiempo:

"It was a Tuesday evening in November. The rain WAS FALLING [pasado continuo — escenario]
and the streets WERE SHINING [pasado continuo — escenario] with wet light.
I WAS WALKING [pasado continuo — acción en progreso] home from work
when I NOTICED [pasado simple — evento principal] a small café I HAD NEVER SEEN [pasado perfecto — antes de ese momento] before.

I PUSHED [pasado simple] the door open and WENT [pasado simple] in.
A woman WAS SITTING [pasado continuo — escenario] at the counter.
She LOOKED [pasado simple] up and SMILED [pasado simple].
I RECOGNISED [pasado simple] her immediately — we HAD STUDIED [pasado perfecto — antes] together at university, fifteen years ago.

'I thought you HAD MOVED [pasado perfecto] to Canada,' I SAID [pasado simple].
'I DID,' she SAID [pasado simple], 'but I CAME BACK [pasado simple] last year.'
We TALKED [pasado simple] for two hours."

Observa: los tres tiempos conviven en el mismo texto, cada uno con su función precisa.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECUENCIAS FRECUENTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECUENCIA 1 — Evento + contexto simultáneo:
"She called [P. Simple] while I was driving [P. Continuous]."

SECUENCIA 2 — Evento + explicación anterior:
"She was tired [P. Continuous/Simple] because she had worked [P. Perfect] all night."

SECUENCIA 3 — Reacción + causa anterior:
"I was surprised [P. Simple] — I hadn't expected [P. Perfect] to see him there."

SECUENCIA 4 — Acumulación narrativa:
"By the time she arrived [P. Simple], he had already left [P. Perfect] and I was waiting [P. Continuous] alone."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPARACIÓN DIRECTA — EL MISMO MOMENTO, TRES MIRADAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Imagina que describes el momento en que llegaste a una fiesta:

"I arrived at the party."
→  Solo el evento. Nada más.

"I arrived at the party. People were dancing and laughing. The music was loud."
→  El evento + el escenario. La escena cobra vida.

"I arrived at the party. People were dancing and laughing. I was relieved — I had been worried that nobody would come."
→  El evento + el escenario + la historia previa. Narración completa.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — USAR SOLO PAST SIMPLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Un texto escrito solo en past simple puede ser correcto pero resulta plano:

❌ PLANO: "I went to the station. I waited. The train arrived. I got on."
✅ VIVO: "I arrived at the station. A few people were waiting on the platform.
           The train was already five minutes late. I had left home in a hurry
           and I was still out of breath."

La combinación de tiempos es lo que da profundidad y naturalidad a la narración en inglés.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige el tiempo correcto para cada hueco:

1. When I _______ (arrive), she _______ (cook) dinner and the children _______ (do) their homework.
2. He _______ (not recognize) her at first because she _______ (change) her hair.
3. The meeting _______ (already / start) when they _______ (walk) in.
4. It _______ (snow) outside and I _______ (not want) to leave, but I _______ (promise) to be there.

Respuestas:
1. arrived / was cooking / were doing
2. didn't recognise / had changed
3. had already started / walked
4. was snowing / didn't want / had promised`;

// ─────────────────────────────────────────────────────────────────────────────
// L1.5 — Making It Flow — Narrative Connectors
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L15 = `Una narración con buenos tiempos verbales pero sin conectores suena a lista de eventos. Los conectores son el pegamento que convierte esa lista en una historia. Esta lección te da las herramientas para hacer que tu inglés narrativo fluya.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONECTORES TEMPORALES — ORDENAR LOS EVENTOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Indican la secuencia cronológica de los eventos:

first / first of all    →  primero / en primer lugar
then / next             →  luego / a continuación
after that              →  después de eso
later / later on        →  más tarde
meanwhile               →  mientras tanto (dos eventos simultáneos)
at the same time        →  al mismo tiempo
eventually              →  finalmente (tras un proceso o espera)
in the end              →  al final (resultado tras dificultades)
finally                 →  finalmente (último de una serie)

"First I checked the map, then I started walking. After that I realised I was going the wrong way."
"Meanwhile, back at the hotel, my bag had disappeared."
"Eventually, after three hours, we found the right street."

ATENCIÓN — eventually ≠ finalmente en todos los contextos:
"Eventually" implica que tardó mucho o costó trabajo: "We eventually found a taxi."
"Finally" es el último de una lista: "I'd like to thank my family, my friends, and finally my teacher."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONECTORES DE DRAMA — DAR IMPACTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para introducir un giro inesperado o un momento de tensión:

suddenly                →  de repente
all of a sudden         →  de repente (más enfático, más oral)
out of nowhere          →  de la nada (muy enfático)
to make matters worse   →  para colmo de males
at that moment          →  en ese momento
the next thing I knew   →  lo siguiente que supe (para cortes narrativos rápidos)

"I was walking home alone when, all of a sudden, someone grabbed my arm."
"The car had broken down. To make matters worse, it was raining heavily."
"I closed my eyes for a second. The next thing I knew, it was morning."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPRESIONES DE APERTURA Y CIERRE DE HISTORIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para empezar una historia de forma natural:
"It all started when..."           →  Todo empezó cuando...
"This happened a few years ago."   →  Esto pasó hace unos años.
"You're not going to believe this, but..."  →  No te lo vas a creer, pero...
"I'll never forget the day..."     →  Nunca olvidaré el día en que...

Para cerrar o concluir:
"In the end, everything worked out."     →  Al final, todo salió bien.
"Looking back, I can see that..."        →  Mirando atrás, puedo ver que...
"It was an experience I'll never forget."  →  Fue una experiencia que nunca olvidaré.
"That was the moment everything changed." →  Ese fue el momento en que todo cambió.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGISTRO — ORAL VS. ESCRITO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Algunos conectores son más naturales en conversación, otros en escritura:

MÁS ORALES:
"and then", "so", "anyway", "you know", "the thing is"
"all of a sudden", "out of nowhere", "the next thing I knew"

MÁS ESCRITOS / FORMALES:
"subsequently", "at that point", "as a result", "consequently"
"prior to this", "at this juncture"

Para el nivel B1, los conectores orales son prioritarios. Los formales aparecerán en B2.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UNA HISTORIA CON CONECTORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sin conectores (plano):
"I missed the last train. I had no money for a taxi. I called a friend. He didn't answer. I walked home."

Con conectores (vivo):
"I'll never forget that night. I had just missed the last train and, to make matters worse, my wallet was empty — I had left it at the restaurant. I tried calling a friend, but he didn't answer. Eventually, with no other option, I started walking. It took two hours. In the end, I got home at three in the morning, exhausted but strangely proud of myself."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige el conector más adecuado:

1. I was reading quietly when _______ (suddenly / eventually / meanwhile) the lights went out.
2. We waited for an hour. _______ (All of a sudden / Eventually / First), a taxi appeared.
3. She cooked dinner. _______ (Meanwhile / Finally / The next thing I knew), I set the table.
4. _______ (It all started when / In the end / To make matters worse) I found an old photo in a drawer.
5. He lost his job and, _______ (meanwhile / to make matters worse / eventually), his car broke down the same week.

Respuestas: 1. suddenly  2. Eventually  3. Meanwhile  4. It all started when  5. to make matters worse`;

// ─────────────────────────────────────────────────────────────────────────────
// L1.6 — Telling Stories — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L16 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — PAST CONTINUOUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige la opción correcta:

1. "_______ when you arrived?" → Respuesta: Was she sleeping
   (was she sleep / she was sleeping / was she sleeping / she sleeping)

2. "I _______ a podcast while I _______ to work."
   → Respuesta: was listening / was walking
   (listened / walked — incorrecto para acciones simultáneas en progreso)

3. Identifica el uso del past continuous en esta frase:
   "The café was quiet. A few people were reading and someone was playing chess."
   → Descripción de fondo (escenario)

BLOQUE B — PARTICIPIOS PASADOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Escribe el participio pasado:

4. go   → _______     (Respuesta: gone)
5. eat  → _______     (Respuesta: eaten)
6. see  → _______     (Respuesta: seen)
7. write → _______    (Respuesta: written)
8. take → _______     (Respuesta: taken)

BLOQUE C — PAST PERFECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. "By the time I got there, they _______ (already / leave)."
   → Respuesta: had already left

10. "She was nervous because she _______ (never / speak) in public before."
    → Respuesta: had never spoken

BLOQUE D — CONECTORES NARRATIVOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. ¿Qué conector usarías para introducir un evento inesperado?
    → suddenly / all of a sudden

12. ¿Qué diferencia hay entre "eventually" y "finally"?
    → "Eventually" implica que tardó o costó trabajo. "Finally" es el último de una serie.

BLOQUE E — TEXTO INTEGRADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lee el texto y responde:

"It was getting dark when Ana arrived at the old house. The garden was overgrown and the windows were dark. She had been there once before, years ago, when she was a child. She tried the door — it was open. She went in. All of a sudden, she heard footsteps on the floor above."

13. ¿Qué acción estaba ocurriendo de fondo cuando Ana llegó?
    → It was getting dark. (La oscuridad era el escenario.)

14. ¿Qué indica "she had been there once before"?
    → Una visita anterior, ocurrida antes del momento narrativo. (Past perfect — evento previo.)

15. ¿Qué tiempo verbal tiene "she tried" y "she went in"?
    → Past simple — eventos principales de la narración.`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U1 — 12 preguntas × 1 punto. passingScore 80 → mínimo 10/12.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U1 = {
  title:        'Telling Stories — Unit 1 Assessment',
  description:  'Escribe un párrafo de seis a ocho frases sobre una experiencia del pasado. Usa past simple para los eventos principales, past continuous para el escenario y past perfect para lo que ya había ocurrido antes. Incluye al menos dos conectores narrativos.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '"I _______ TV when you called." ¿Qué forma completa la frase correctamente?',
      options:      ['watch', 'was watching', 'watched', 'am watching'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Cuál es el present continuous correcto de "study" para una acción en curso ahora mismo?',
      options:      ['I study', 'I am study', 'I am studying', 'I studying'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"She _______ in the garden when it started to rain." ¿Qué forma es correcta?',
      options:      ['works', 'worked', 'was working', 'is working'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál es el participio pasado de "go"?',
      options:      ['went', 'goed', 'gone', 'going'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál es el participio pasado de "eat"?',
      options:      ['ate', 'eated', 'eatten', 'eaten'],
      correctIndex: 3,
      points:       1,
    },
    {
      text:         '"When I arrived, she _______ already _______." ¿Qué forma de past perfect es correcta?',
      options:      ['already left', 'had already left', 'has already left', 'already leaves'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"He called me after he _______ the news." ¿Qué verbo es correcto?',
      options:      ['hears', 'heard', 'had heard', 'was hearing'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"While she _______ dinner, the phone rang." ¿Qué forma describe correctamente la acción de fondo?',
      options:      ['cooked', 'cooks', 'was cooking', 'had cooked'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"I was exhausted because I _______ for twelve hours." ¿Qué forma es correcta?',
      options:      ['worked', 'was working', 'had worked', 'have worked'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Qué significa "all of a sudden" en una narración?',
      options:      ['finalmente', 'sin embargo', 'de repente', 'mientras tanto'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Qué conector indica que dos acciones ocurrían al mismo tiempo en el pasado?',
      options:      ['eventually', 'meanwhile', 'before', 'suddenly'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"By the time the police arrived, the thief had escaped." ¿Qué ocurrió primero?',
      options:      ['Llegó la policía', 'El ladrón escapó', 'Llamaron a la policía', 'La policía lo encontró'],
      correctIndex: 1,
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
    title:            'Telling Stories',
    order:            1,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L1.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'While Things Were Happening — Past Continuous',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L11,
      duration: 20,
      order:    1,
    }),

    // L1.2 — VIDEO
    // Canal recomendado: BBC Learning English / EnglishClass101
    // Búsqueda: "past continuous narrative tenses English story BBC"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: A Story Worth Telling',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-b1-u1-l2',
      duration: 10,
      order:    2,
    }),

    // L1.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'Before It Happened — Past Perfect',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L13,
      duration: 20,
      order:    3,
    }),

    // L1.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'The Full Picture — Combining All Three Tenses',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L14,
      duration: 20,
      order:    4,
    }),

    // L1.5 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'Making It Flow — Narrative Connectors',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L15,
      duration: 15,
      order:    5,
    }),

    // L1.6 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 6 }, {
      unitId:   unit._id,
      courseId,
      title:    'Telling Stories — Quiz',
      type:     LESSON_TYPES.QUIZ,
      content:  CONTENT_L16,
      duration: 25,
      order:    6,
    }),

  ]);

  await upsert(Assessment, { unitId: unit._id }, {
    unitId:   unit._id,
    courseId,
    ...ASSESSMENT_U1,
  });
};
