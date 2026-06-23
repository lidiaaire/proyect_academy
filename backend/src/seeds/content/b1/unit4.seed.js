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
// L4.1 — Have You Ever Read It? — The Present Perfect
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L41 = `En esta unidad aprenderás la voz pasiva, y para entender una de sus formas más frecuentes necesitas conocer primero el present perfect. Esta lección te lo presenta como un tiempo nuevo, no como un repaso.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA ESTRUCTURA — HAVE / HAS + PARTICIPIO PASADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El present perfect combina el auxiliar HAVE (en presente) con el participio pasado del verbo.

I / You / We / They  →  HAVE + participio
He / She / It        →  HAS + participio

"I have visited Japan."           →  He visitado Japón.
"She has read that book."         →  Ella ha leído ese libro.
"They have won three times."      →  Han ganado tres veces.
"He has never tried sushi."       →  Él nunca ha probado el sushi.

Formas contraídas (muy frecuentes en inglés oral):
I have → I've      She has → She's      They have → They've
"I've seen that film twice."
"She's worked here for ten years."
"We've never been to Australia."

Negativa: HAVEN'T / HASN'T + participio
"I haven't finished yet."
"He hasn't called back."

Pregunta: HAVE / HAS + sujeto + participio?
"Have you ever been to New York?"
"Has she read the report?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOS PARTICIPIOS PASADOS — REPASO ESENCIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ya los aprendiste en B1 Unit 1 para el past perfect. Ahora los usas en present perfect.
Los verbos regulares forman el participio con -ed. Los irregulares tienen forma propia:

go → gone        eat → eaten      see → seen       take → taken
write → written  do → done        be → been        give → given
know → known     come → come      have → had       make → made
find → found     leave → left     buy → bought     read → read*
speak → spoken   break → broken   choose → chosen  fall → fallen

*"read" se escribe igual que el infinitivo pero se pronuncia /rɛd/ en pasado y participio.

"I've read that article — it's excellent."
"She's spoken to the editor."
"We've been here before."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOS USOS PRINCIPALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USO 1 — EXPERIENCIAS DE VIDA (sin tiempo específico):
Hablas de algo que has hecho en algún momento de tu vida, sin decir cuándo exactamente.

"Have you ever tried Thai food?"     →  ¿Has probado alguna vez la comida tailandesa?
"I've never seen snow."              →  Nunca he visto nieve.
"She's lived in four different countries." → Ha vivido en cuatro países.
"They've won the championship twice." → Han ganado el campeonato dos veces.

USO 2 — ACCIONES RECIENTES CON RELEVANCIA PRESENTE:
Algo ocurrió en el pasado reciente y tiene un efecto o importancia ahora.

"I've just finished the report." (ahora está terminado)
"She's already left." (ya no está aquí)
"The website has changed — it looks different now."
"He hasn't arrived yet." (todavía no está)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MARCADORES DE TIEMPO DEL PRESENT PERFECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ever     →  alguna vez (en preguntas): "Have you ever been to Rome?"
never    →  nunca: "I've never eaten octopus."
already  →  ya (la acción ocurrió antes de lo esperado): "She's already finished."
yet      →  todavía / ya (con negativa o pregunta): "I haven't read it yet." / "Have you eaten yet?"
just     →  acabar de (muy reciente): "I've just spoken to him."
recently →  recientemente: "They've recently launched a new product."
so far   →  hasta ahora: "I've read three chapters so far."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRESENT PERFECT VS. PAST SIMPLE — LA DISTINCIÓN CLAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Esta distinción es una de las más importantes del inglés B1.

PRESENT PERFECT — cuando NO dices cuándo:
"I have visited Paris."    →  He estado en París. (en algún momento de mi vida)
"She has called."          →  Ha llamado. (recientemente, o es relevante ahora)

PAST SIMPLE — cuando SÍ dices cuándo (o es obvio):
"I visited Paris in 2019." →  Fui a París en 2019.
"She called this morning." →  Llamó esta mañana.

La presencia de un tiempo específico (yesterday, last week, in 2020, two hours ago, at six o'clock) obliga al PAST SIMPLE:

❌ "I have seen him yesterday."
✅ "I saw him yesterday."

❌ "She has worked here in 2018."
✅ "She worked here in 2018."

Sin tiempo específico → present perfect:
✅ "I've never met him." (nunca, sin fecha)
✅ "She's worked in three different companies." (experiencia de vida)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN CONTEXTO — MEDIOS Y TECNOLOGÍA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Have you seen the documentary about AI? It's just come out."
"I've been following this news story for weeks."
"They've launched a new app — it's completely changed the way I work."
"The editor has already approved the article."
"I haven't read the report yet — have you?"
"This journalist has written some of the best investigations of the last decade."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — FOR VS. SINCE CON PRESENT PERFECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El present perfect también se usa con FOR y SINCE para hablar de situaciones que empezaron
en el pasado y continúan hasta ahora:

FOR + duración (período de tiempo):
"I've worked here for three years."    (llevo tres años aquí)
"She's lived in London for a decade."

SINCE + punto de inicio:
"I've worked here since 2021."         (desde 2021)
"She's lived in London since she was twenty."

❌ "I work here since three years."
✅ "I've worked here for three years." / "I've worked here since 2021."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige present perfect o past simple:

1. "I _______ (meet) him at a conference in Madrid last April."
2. "_______ you ever _______ (try) Japanese food?"
3. "She _______ (write) three articles this month — the last one _______ (come out) yesterday."
4. "I _______ (not / finish) the report yet — I _______ (start) it this morning."
5. "They _______ (live) in this house since 2015."

Respuestas:
1. met (last April = tiempo específico → past simple)
2. Have... tried (experiencia, sin tiempo específico → present perfect)
3. has written / came out (this month sin fecha concreta → PP; yesterday → past simple)
4. haven't finished / started (yet → PP; this morning puede usarse con PP o PS según el contexto; aquí el contexto es proceso en marcha → PP + PS)
5. have lived (since 2015, situación continua → present perfect)`;

// ─────────────────────────────────────────────────────────────────────────────
// L4.3 — It Was Made in 1969 — Passive Voice Present & Past
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L43 = `La voz pasiva es la herramienta que usa el inglés cuando el foco no está en quién hace la acción sino en qué se hace o qué le pasa al objeto. Es especialmente frecuente en textos de prensa, documentales y lenguaje formal.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTIVA VS. PASIVA — EL CAMBIO DE FOCO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VOZ ACTIVA — el sujeto hace la acción:
"Journalists write the articles."     →  Los periodistas escriben los artículos.
"Someone invented the telephone."     →  Alguien inventó el teléfono.

VOZ PASIVA — el sujeto recibe la acción:
"The articles are written by journalists." →  Los artículos son escritos por periodistas.
"The telephone was invented in 1876."  →  El teléfono fue inventado en 1876.

La pasiva desplaza el objeto de la activa a posición de sujeto.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA ESTRUCTURA — TO BE + PARTICIPIO PASADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La pasiva se forma siempre con el verbo BE (en el tiempo que necesites) + participio pasado.

PASIVA PRESENTE — IS / ARE + participio:
"English is spoken in many countries."
"These phones are made in South Korea."
"The news is broadcast every hour."
"Millions of articles are published online every day."

PASIVA PASADA — WAS / WERE + participio:
"The film was directed by Kubrick."
"The pyramids were built thousands of years ago."
"The email was sent to the wrong address."
"Several people were interviewed for the article."

El participio pasado es el mismo que usas en present perfect (B1 Unit 1 y Unit 4 L4.1):
write → written:   "The report was written by the research team."
make → made:       "This documentary was made in 2020."
take → taken:      "The photos were taken in the 1970s."
give → given:      "Clear instructions were given to all participants."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POR QUÉ SE USA LA VOZ PASIVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. EL AGENTE ES DESCONOCIDO O IRRELEVANTE:
"My car was stolen last night."  (no sé quién)
"Three people were arrested."    (lo importante es el hecho, no el agente)

2. EL FOCO ES EL OBJETO, NO EL AGENTE:
"The Eiffel Tower was built in 1889."  (nos interesa la torre, no los constructores)
"Penicillin was discovered by Fleming in 1928."

3. ESTILO FORMAL O IMPERSONAL:
En artículos, informes y documentales el agente suele omitirse para dar objetividad:
"It was reported that three people were injured."
"The data was collected over a period of six months."
"New regulations have been introduced." (agente = gobierno, irrelevante en contexto)

4. VARIEDAD ESTILÍSTICA:
Evita repetir el mismo sujeto. La pasiva permite variar la estructura de las frases.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BY + AGENTE — CUÁNDO INCLUIRLO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El agente se incluye con BY solo cuando aporta información importante:

INCLUIR BY:
"The theory was proposed by Einstein."     (el agente es relevante — es Einstein)
"The documentary was directed by Herzog."  (información de valor)
"The virus was discovered by a Chinese laboratory." (contexto importante)

OMITIR BY:
"Several arrests were made." (no importa quién los hizo)
"The meeting has been cancelled." (no importa quién lo canceló)
"Mistakes were made." (agente intencionalmente vago)

Regla práctica: si quitas el BY y la frase sigue siendo informativa, omítelo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASIVA EN TITULARES DE PRENSA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los titulares usan con frecuencia la pasiva sin auxiliar (el verbo BE se omite):

"Three Arrested After Protest" (= Three people were arrested...)
"New Law Approved by Parliament" (= A new law has been approved...)
"Museum Closed for Renovation" (= The museum has been closed...)

Esta forma comprimida es característica del inglés periodístico.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — OLVIDAR EL PARTICIPIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ "The report was write by the team."
✅ "The report was written by the team."

❌ "This film is make in France."
✅ "This film is made in France."

❌ "Several mistakes were did."
✅ "Several mistakes were made."

La pasiva es SIEMPRE: BE + participio pasado. Nunca el infinitivo, nunca el past simple.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transforma al pasivo:

1. Journalists publish thousands of articles every day.
2. Alexander Fleming discovered penicillin in 1928.
3. Someone broke the window during the night.
4. The studio produces the podcast in London.
5. Workers built this bridge in 1902.

Respuestas:
1. Thousands of articles are published (by journalists) every day.
2. Penicillin was discovered by Alexander Fleming in 1928.
3. The window was broken during the night. (agente desconocido → omitido)
4. The podcast is produced in London. (agente irrelevante → omitido)
5. This bridge was built in 1902. (agente irrelevante → omitido)`;

// ─────────────────────────────────────────────────────────────────────────────
// L4.4 — Has Been Updated — Passive Voice Perfect & Future
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L44 = `Ya dominas la pasiva en presente y pasado. Ahora la extiendes a dos tiempos más: el present perfect y el futuro. Ambos son especialmente frecuentes en medios de comunicación y entornos profesionales.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASIVA EN PRESENT PERFECT — HAS / HAVE BEEN + PARTICIPIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En la lección L4.1 aprendiste el present perfect activo: HAVE / HAS + participio.
Ahora el participio de HAVE cambia de lugar: el auxiliar BE se convierte en participio (been).

Estructura: HAVE / HAS + BEEN + participio pasado

"The website has been updated."
→  La web ha sido actualizada. (recientemente, tiene relevancia ahora)

"Several journalists have been arrested."
→  Varios periodistas han sido detenidos.

"The policy has been changed three times this year."
→  La política ha sido modificada tres veces este año.

"New rules have been introduced."
→  Se han introducido nuevas normas.

"A decision hasn't been made yet."
→  Todavía no se ha tomado una decisión.

Contraste con pasiva pasada:
"The app was updated last night."   →  (sabemos cuándo — past simple pasiva)
"The app has been updated."         →  (relevancia presente — present perfect pasiva)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASIVA EN FUTURO — WILL BE + PARTICIPIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estructura: WILL BE + participio pasado

"The results will be announced next week."
→  Los resultados serán anunciados la semana que viene.

"A new law will be introduced by the end of the year."
→  Se introducirá una nueva ley antes de que acabe el año.

"The documentary will be broadcast tonight at nine."
→  El documental será emitido esta noche a las nueve.

"All data will be deleted automatically."
→  Todos los datos serán eliminados automáticamente.

"The report will not be published until further notice."
→  El informe no se publicará hasta nuevo aviso.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAS CUATRO FORMAS PASIVAS — TABLA RESUMEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tiempo          Estructura                    Ejemplo
Presente        is / are + pp                 "It is published daily."
Pasado          was / were + pp               "It was published in 2020."
Present perfect has / have been + pp          "It has been published."
Futuro          will be + pp                  "It will be published tomorrow."

El participio pasado es siempre el mismo — lo que cambia es el auxiliar BE y su tiempo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BY + AGENTE EN PRESENT PERFECT Y FUTURO PASIVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Las mismas reglas de L4.3 aplican: incluye BY solo si el agente aporta información relevante.

"The decision has been approved by the board of directors." (agente relevante)
"The article will be reviewed by two independent experts." (agente relevante)
"Several changes have been made." (agente irrelevante o desconocido → se omite)
"A new version will be released soon." (quién lo lanzará no importa → se omite)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN TITULARES Y NOTICIAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los medios usan la pasiva constantemente para presentar hechos con objetividad aparente:

"New App Downloaded 10 Million Times"         (has been downloaded)
"Decision Expected to Be Announced Thursday"  (will be announced)
"Three Officials Suspended Pending Investigation" (have been suspended)
"Prices Set to Be Increased"                  (will be increased)

Leer prensa en inglés es el mejor entrenamiento para interiorizar la pasiva.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — CONFUNDIR HAS BEEN CON WAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ "The website was updated — it looks different now."
Esta frase dice que la actualización ocurrió en algún momento pasado específico.
Si el foco es la relevancia presente (se nota ahora), usa present perfect:
✅ "The website has been updated — it looks completely different."

❌ "The results will been announced next week."
✅ "The results will be announced next week." (will be + participio, sin "n")


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con la forma pasiva correcta:

1. The new policy _______ (introduce) recently — you should read it.
2. The winner _______ (announce) on Friday evening.
3. Several accounts _______ (hack) in the last few weeks.
4. The app _______ (update) automatically tonight.
5. No decision _______ (make) yet about the merger.

Respuestas:
1. has been introduced (recently → present perfect)
2. will be announced (Friday evening → futuro)
3. have been hacked (in the last few weeks → present perfect)
4. will be updated (tonight → futuro)
5. has been made (yet con negativa → present perfect)`;

// ─────────────────────────────────────────────────────────────────────────────
// L4.5 — The Media and Digital Life — Vocabulary
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L45 = `Esta lección cubre el vocabulario que necesitas para leer noticias, hablar de tecnología y participar en conversaciones sobre los medios de comunicación en inglés.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN A — LOS MEDIOS DE COMUNICACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIPOS DE MEDIOS:

broadsheet         →  periódico serio / de calidad (grande, The Guardian, El País)
tabloid            →  prensa sensacionalista (formato pequeño, titulares llamativos)
podcast            →  programa de audio bajo demanda
blog               →  publicación personal o temática en internet
streaming platform →  plataforma de vídeo bajo demanda (Netflix, HBO...)
newsletter         →  boletín informativo por correo electrónico
live stream        →  emisión en directo por internet

VOCABULARIO DE CONTENIDO:

breaking news      →  noticias de última hora
headline           →  titular
article            →  artículo
editorial          →  editorial (columna de opinión de la dirección)
feature            →  reportaje en profundidad
investigation      →  investigación periodística
source             →  fuente

VOCABULARIO CRÍTICO — PARA ANALIZAR LOS MEDIOS:

biased             →  sesgado (presenta solo un punto de vista)
objective          →  objetivo / imparcial
clickbait          →  titular engañoso diseñado para conseguir clics
fake news          →  noticias falsas
misinformation     →  desinformación (información falsa, no necesariamente intencionada)
disinformation     →  desinformación intencionada (campaña deliberada)
reliable source    →  fuente fiable
to verify          →  verificar
to fact-check      →  verificar los datos de una noticia

VERBOS DEL PERIODISMO:

to broadcast       →  emitir (radio, televisión)
to publish         →  publicar
to report (on)     →  informar sobre
to investigate     →  investigar
to expose          →  denunciar / revelar
to go viral        →  hacerse viral
to cover a story   →  cubrir una noticia

En contexto:
"The story went viral after it was shared by several influencers."
"This source is not reliable — the article contains several factual errors."
"The documentary investigates corruption in the food industry."
"Be careful with that headline — it looks like clickbait."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN B — TECNOLOGÍA Y VIDA DIGITAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VOCABULARIO DIGITAL ESENCIAL:

to update          →  actualizar (software, app)
to download        →  descargar
to upload          →  subir (un archivo, una foto)
to log in / log out →  iniciar / cerrar sesión
to sign in / sign up →  iniciar sesión / registrarse
to back up         →  hacer una copia de seguridad
to crash           →  colapsar / colgarse (un sistema)
to hack            →  piratear / hackear
digital footprint  →  huella digital
data privacy       →  privacidad de datos
cyberattack        →  ciberataque
cloud storage      →  almacenamiento en la nube
algorithm          →  algoritmo
artificial intelligence (AI) → inteligencia artificial

PHRASAL VERBS TECNOLÓGICOS:

set up             →  configurar / instalar: "I need to set up my new laptop."
switch on / off    →  encender / apagar: "Switch off the router and switch it on again."
plug in            →  enchufar: "Plug in the charger — the battery is almost dead."
scroll through     →  desplazarse por (una pantalla): "I was scrolling through my feed."
zoom in / out      →  acercar / alejar: "Zoom in on that part of the image."
log in / out       →  iniciar / cerrar sesión: "You need to log in to access the content."
back up            →  hacer copia de seguridad: "Back up your files before the update."

En contexto:
"You should back up your data before updating the system."
"The algorithm decides what content appears on your feed."
"My phone crashed and I lost everything — I hadn't backed up."
"They suffered a major cyberattack and all the data was stolen."
"Be aware of your digital footprint — everything you do online leaves a trace."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPRESIONES PARA OPINAR SOBRE LOS MEDIOS Y LA TECNOLOGÍA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"I think social media algorithms are designed to keep us scrolling as long as possible."
"As far as I'm concerned, people ought to verify information before sharing it."
"It's been reported that several major outlets were hacked last month."
"In my view, the way news is presented has become increasingly biased."
"I've noticed that the more controversial a headline is, the more clicks it gets."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIFERENCIAS ÚTILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SIGN UP vs LOG IN:
sign up   →  registrarse por primera vez: "I signed up to the newsletter last week."
log in    →  entrar con credenciales ya existentes: "I log in every morning."

DOWNLOAD vs UPLOAD:
download  →  traer datos de internet a tu dispositivo: "I downloaded the app."
upload    →  enviar datos desde tu dispositivo a internet: "She uploaded the video."

FAKE NEWS vs CLICKBAIT:
fake news →  contenido completamente falso
clickbait →  titular exagerado o engañoso que lleva a un contenido mediocre o diferente


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige la palabra o expresión correcta:

1. "The story _______ after a celebrity shared it." (went viral / was broadcast / published)
2. "Always _______ your files before updating your system." (log in / scroll through / back up)
3. "That headline is _______— the actual article says something completely different." (biased / clickbait / objective)
4. "She _______ to the platform last month and has been using it every day since." (signed up / logged in / uploaded)
5. "The app _______ and I lost all my work." (hacked / crashed / uploaded)

Respuestas: 1. went viral  2. back up  3. clickbait  4. signed up  5. crashed`;

// ─────────────────────────────────────────────────────────────────────────────
// L4.6 — Media & Technology — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L46 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — PRESENT PERFECT ACTIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. "Have you ever _______ sushi?" ¿Qué participio es correcto?
   a) ate   b) eat   c) eating   d) eaten
   Respuesta: d

2. Elige la frase correcta para una experiencia sin tiempo específico:
   a) "I visited Paris last year."
   b) "I have visited Paris."
   c) "I had visited Paris."
   d) "I was visiting Paris."
   Respuesta: b

3. "She _______ to London in 2019." ¿Qué forma es correcta? (tiempo específico)
   a) has gone   b) went   c) had gone   d) goes
   Respuesta: b

4. "I haven't read the report _______." ¿Qué marcador es correcto?
   a) already   b) just   c) ever   d) yet
   Respuesta: d


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — VOZ PASIVA PRESENTE Y PASADA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. "English _______ all over the world." ¿Qué forma pasiva es correcta?
   a) speaks   b) is speaking   c) is spoken   d) was spoken
   Respuesta: c

6. "The Eiffel Tower _______ in 1889." ¿Qué forma es correcta?
   a) built   b) was built   c) is built   d) has been built
   Respuesta: b

7. "This article _______ a famous journalist." ¿Cómo se completa la pasiva?
   a) wrote   b) was written by   c) is written by   d) has written
   Respuesta: b


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — VOZ PASIVA PERFECTA Y FUTURA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. "The website _______ — it looks completely different now." (present perfect pasiva)
   a) redesigned   b) was redesigned   c) has been redesigned   d) is redesigned
   Respuesta: c

9. "The results _______ next week." (futuro pasiva)
   a) announce   b) will announce   c) will be announced   d) are announced
   Respuesta: c

10. ¿Cuál es el participio pasado correcto de "write" en una pasiva?
    a) "The report was wrote."   b) "The report was write."
    c) "The report was writing." d) "The report was written."
    Respuesta: d


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — VOCABULARIO DE MEDIOS Y TECNOLOGÍA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. "Un artículo con un titular engañoso diseñado para conseguir más clics" se llama...
    a) a broadsheet   b) clickbait   c) a podcast   d) a broadcast
    Respuesta: b

12. "Siempre deberías _______ tus archivos por si el ordenador falla." ¿Qué phrasal verb es correcto?
    a) back out   b) back up   c) back into   d) back off
    Respuesta: b`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U4 — 12 preguntas × 1 punto. passingScore 80 → mínimo 10/12.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U4 = {
  title:        'Media & Technology — Unit 4 Assessment',
  description:  'Escribe un párrafo de seis a ocho frases sobre un tema de actualidad. Usa al menos dos frases en voz pasiva, una estructura de present perfect activo y dos palabras del vocabulario de medios o tecnología de la unidad.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '"Have you ever _______ sushi?" ¿Qué participio pasado es correcto?',
      options:      ['ate', 'eat', 'eating', 'eaten'],
      correctIndex: 3,
      points:       1,
    },
    {
      text:         '¿Cuál es la frase correcta para hablar de una experiencia sin tiempo específico?',
      options:      ['I visited Paris last year.', 'I have visited Paris.', 'I had visited Paris.', 'I was visiting Paris.'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"She _______ to London in 2019." ¿Qué forma es correcta?',
      options:      ['has gone', 'went', 'had gone', 'goes'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"English _______ all over the world." ¿Qué forma pasiva de presente es correcta?',
      options:      ['speaks', 'is speaking', 'is spoken', 'was spoken'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"The Eiffel Tower _______ in 1889." ¿Qué forma pasiva de pasado es correcta?',
      options:      ['built', 'was built', 'is built', 'has been built'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"This article _______ a famous journalist." ¿Cómo se completa la pasiva con agente?',
      options:      ['wrote', 'was written by', 'is written by', 'has written'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"The website _______ — it looks completely different now." ¿Qué forma es correcta?',
      options:      ['redesigned', 'was redesigned', 'has been redesigned', 'is redesigned'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"The results _______ next week." ¿Qué forma pasiva de futuro es correcta?',
      options:      ['announce', 'will announce', 'will be announced', 'are announced'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál es la forma pasiva correcta del verbo "write"?',
      options:      ['The report was wrote.', 'The report was write.', 'The report was writing.', 'The report was written.'],
      correctIndex: 3,
      points:       1,
    },
    {
      text:         '"I haven\'t read the report _______." ¿Qué marcador de tiempo del present perfect es correcto?',
      options:      ['already', 'just', 'ever', 'yet'],
      correctIndex: 3,
      points:       1,
    },
    {
      text:         'Un artículo con titular engañoso diseñado para conseguir más clics se llama...',
      options:      ['a broadsheet', 'clickbait', 'a podcast', 'a broadcast'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"Siempre deberías _______ tus archivos por si el ordenador falla." ¿Qué phrasal verb es correcto?',
      options:      ['back out', 'back up', 'back into', 'back off'],
      correctIndex: 1,
      points:       1,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Seed
// ─────────────────────────────────────────────────────────────────────────────
module.exports = async (courseId) => {
  const unit = await upsert(Unit, { courseId, order: 4 }, {
    courseId,
    title:            'Media & Technology',
    order:            4,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L4.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'Have You Ever Read It? — The Present Perfect',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L41,
      duration: 25,
      order:    1,
    }),

    // L4.2 — VIDEO
    // Canal recomendado: DW Documentary / BBC Learning English
    // Búsqueda: "media technology documentary English B1"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: A Short Documentary',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-b1-u4-l2',
      duration: 12,
      order:    2,
    }),

    // L4.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'It Was Made in 1969 — Passive Voice Present & Past',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L43,
      duration: 20,
      order:    3,
    }),

    // L4.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Has Been Updated — Passive Voice Perfect & Future',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L44,
      duration: 20,
      order:    4,
    }),

    // L4.5 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'The Media and Digital Life — Vocabulary',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L45,
      duration: 20,
      order:    5,
    }),

    // L4.6 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 6 }, {
      unitId:   unit._id,
      courseId,
      title:    'Media & Technology — Quiz',
      type:     LESSON_TYPES.QUIZ,
      content:  CONTENT_L46,
      duration: 25,
      order:    6,
    }),

  ]);

  await upsert(Assessment, { unitId: unit._id }, {
    unitId:   unit._id,
    courseId,
    ...ASSESSMENT_U4,
  });
};
