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
// L6.1 — She Said That... — Reported Speech (Statements)
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L61 = `El reported speech (estilo indirecto) te permite contar lo que alguien dijo sin citar sus palabras exactas. Es imprescindible en contextos profesionales: reuniones, correos que resumen conversaciones, entrevistas de trabajo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAID VS. TOLD — DISTINCIÓN CLAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de hablar del backshift, debes dominar esta distinción que genera errores frecuentes.

SAY — no necesita objeto:
"She said that the meeting was cancelled."    ✅
"She said the results were good."            ✅
("that" es opcional en inglés informal)

TELL — necesita un objeto obligatoriamente (a quién le dijiste):
"She told me that the meeting was cancelled." ✅
"She told us the results were good."         ✅

"She told that the meeting was cancelled."   ❌  (falta el objeto)
"She said me the results."                   ❌  (say no lleva objeto directo de persona)

La prueba rápida:
— ¿Puedes añadir "me / us / him / her / them" directamente después del verbo?
— Sí → TELL (told me / told us / told him)
— No → SAY (said that / said nothing)

Más ejemplos en contexto profesional:
"The manager said the project was on track."
"The manager told the team the project was on track."
"My colleague said she would send the files later."
"My colleague told me she would send the files later."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EL BACKSHIFT — RETROCESO DE TIEMPOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cuando repites lo que alguien dijo en el pasado, los tiempos verbales generalmente retroceden un paso hacia el pasado. Esto refleja la distancia temporal entre el momento en que se dijo y el momento en que lo repites.

PASO 1 — Presente simple → Pasado simple:
Directo:   "I work in the marketing department."
Reported:  She said (that) she worked in the marketing department.

PASO 2 — Past simple → Past perfect:
Directo:   "I finished the report yesterday."
Reported:  He said (that) he had finished the report the day before.

PASO 3 — Present continuous → Past continuous:
Directo:   "We are working on a new campaign."
Reported:  She said (that) they were working on a new campaign.

PASO 4 — Present perfect → Past perfect:
Directo:   "I have sent the email."
Reported:  He said (that) he had sent the email.

PASO 5 — Will → Would:
Directo:   "I will call you on Monday."
Reported:  She said (that) she would call me on Monday.

PASO 6 — Can → Could:
Directo:   "I can attend the meeting."
Reported:  He said (that) he could attend the meeting.

PASO 7 — Must → Had to (para obligación):
Directo:   "You must submit the form today."
Reported:  She said (that) I had to submit the form that day.

TABLA RESUMEN:
Directo             →  Reported
present simple      →  past simple
past simple         →  past perfect
present continuous  →  past continuous
present perfect     →  past perfect
will                →  would
can                 →  could
must                →  had to
may                 →  might


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAMBIOS DE PRONOMBRES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los pronombres cambian según quién habla y a quién se refiere:

Directo:   "I love my job."   (Ana habla)
Reported:  Ana said that SHE loved HER job.

Directo:   "We finished our project."   (el equipo habla)
Reported:  They said that THEY had finished THEIR project.

Directo:   "You did excellent work."   (el jefe te habla a ti)
Reported:  The manager told me that I had done excellent work.

No hay una regla mecánica — tienes que pensar lógicamente en quién dice qué a quién.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAMBIOS DE EXPRESIONES TEMPORALES Y DE LUGAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Las referencias al tiempo y al espacio también cambian para reflejar la perspectiva:

Directo          →  Reported
now              →  then / at that moment
today            →  that day
yesterday        →  the day before / the previous day
tomorrow         →  the next day / the following day
this week        →  that week
last week        →  the week before / the previous week
next year        →  the following year
here             →  there
this             →  that

"I'll send it today."           →  She said she would send it THAT DAY.
"The meeting is here tomorrow." →  He said the meeting was THERE the NEXT DAY.
"We spoke to them yesterday."   →  She said they had spoken to them THE DAY BEFORE.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERBOS DE REPORTE CON MATIZ — MÁS ALLÁ DE SAID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Said y told son neutros. Para añadir precisión sobre la intención del hablante:

explained       →  explicó:   "She explained that the delay was due to supply issues."
mentioned       →  mencionó:  "He mentioned that the budget had been cut."
added           →  añadió:    "She added that there would be a follow-up meeting."
admitted        →  admitió:   "He admitted that the targets had not been met."
claimed         →  afirmó/alegó: "She claimed that the figures were inaccurate."
confirmed       →  confirmó:  "He confirmed that the contract had been signed."
complained      →  se quejó:  "She complained that nobody had informed her."
warned          →  advirtió:  "He warned that the deadline was approaching fast."
denied          →  negó:      "She denied that there had been any problems."
suggested       →  sugirió:   "He suggested that they review the strategy."

Elige el verbo de reporte que capture mejor la actitud del hablante original.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUÁNDO NO ES NECESARIO EL BACKSHIFT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El backshift no es obligatorio cuando:

1. Lo que se dijo sigue siendo verdad ahora:
"She said that Paris is the capital of France." (sigue siendo verdad → no cambia)
"He mentioned that he lives near the office." (todavía vive allí → puede mantenerse)

2. Reported speech con verbos en presente (cuando cuentas algo inmediatamente):
"She says she will be late." (acabas de leer su mensaje — sin backshift)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN CONTEXTO — UNA REUNIÓN DE TRABAJO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lo que dijo el director en la reunión:
"We need to review the budget. I've spoken to the finance team and they can help. The report will be ready by Thursday."

Cómo lo repites a un compañero que no asistió:
"The director said that we needed to review the budget. He mentioned that he had spoken to the finance team and that they could help. He also confirmed that the report would be ready by Thursday."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transforma al reported speech:

1. "I work in the legal department." (She said...)
2. "We have already sent the proposal." (He told us...)
3. "I will finish the project by Friday." (She confirmed...)
4. "I saw the client yesterday." (He mentioned...)
5. "We can meet on Thursday." (She said...)

Respuestas:
1. She said (that) she worked in the legal department.
2. He told us (that) they had already sent the proposal.
3. She confirmed (that) she would finish the project by Friday.
4. He mentioned (that) he had seen the client the day before.
5. She said (that) they could meet on Thursday.`;

// ─────────────────────────────────────────────────────────────────────────────
// L6.3 — He Asked Whether... — Reported Questions and Commands
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L63 = `En una reunión o entrevista no solo se hacen afirmaciones — también se hacen preguntas, peticiones e instrucciones. Esta lección te muestra cómo reportar todo eso correctamente, con las reglas gramaticales que difieren de las afirmaciones.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REPORTED QUESTIONS — PREGUNTAS INDIRECTAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Las preguntas reportadas tienen dos reglas que las hacen distintas de las afirmaciones:

REGLA 1: EL ORDEN DE LAS PALABRAS CAMBIA (sin inversión)
En una pregunta directa, el auxiliar va antes del sujeto.
En una pregunta reportada, el orden es el mismo que en una afirmación: SUJETO + VERBO.

Pregunta directa:   "Where DO you work?"
Pregunta reportada: She asked me where I WORKED.   ✅
                    She asked me where DID I WORK.  ❌ (no inversión en reportada)

Pregunta directa:   "What ARE you doing?"
Pregunta reportada: He asked what I WAS DOING.     ✅
                    He asked what WAS I DOING.      ❌

REGLA 2: BACKSHIFT (los mismos cambios de tiempo que en las afirmaciones)
Presente → Pasado, Will → Would, etc.

"Where do you work?" → She asked where I worked.
"What have you done?" → He asked what I had done.
"Will you be available?" → She asked if I would be available.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREGUNTAS DE SÍ O NO — IF / WHETHER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cuando la pregunta original era de sí o no (sin palabra interrogativa), se introduce con IF o WHETHER:

"Are you available on Monday?"
→  She asked if / whether I was available on Monday.

"Did you receive my email?"
→  He asked if / whether I had received his email.

"Can you attend the presentation?"
→  She asked if / whether I could attend the presentation.

IF vs WHETHER:
En la práctica son intercambiables en reported questions.
WHETHER suena ligeramente más formal y se usa más en escritura:
"She asked whether the project was on schedule."
"He asked if the project was on schedule."

WHETHER (NO IF) se usa obligatoriamente con "or not":
"She asked whether I was interested or not."
"He wondered whether to apply or not."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREGUNTAS CON PALABRA INTERROGATIVA — WH-
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Se introduce directamente con la palabra interrogativa (who, what, where, when, why, how):

"Where do you see yourself in five years?"
→  The interviewer asked where I saw myself in five years.

"Why did you leave your previous job?"
→  She asked why I had left my previous job.

"How long have you worked in this sector?"
→  He asked how long I had worked in that sector.

"What are your main strengths?"
→  She asked what my main strengths were.

"Who does the final decision depend on?"
→  He asked who the final decision depended on.

Todos los ejemplos muestran el mismo patrón: WH- + sujeto + verbo (sin inversión).


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REPORTED COMMANDS — INSTRUCCIONES Y ÓRDENES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Las órdenes e instrucciones directas se reportan con:
TELL / ASK + objeto + (NOT) TO + infinitivo

TELL para instrucciones y órdenes:
"Sign the contract by Friday." → He told me TO SIGN the contract by Friday.
"Send the report to the whole team." → She told us TO SEND the report to the whole team.
"Don't be late tomorrow." → He told her NOT TO BE late the next day.

ASK para peticiones (más corteses):
"Could you send me the files?" → She asked me TO SEND her the files.
"Please prepare a summary." → He asked us TO PREPARE a summary.
"Please don't share this information." → She asked me NOT TO SHARE that information.

LA ESTRUCTURA ES SIEMPRE:
Verbo de reporte + objeto (me / him / us / them...) + to + infinitivo
                                                     not to + infinitivo (para negativas)

❌ "She told to sign the contract." (falta el objeto)
✅ "She told me to sign the contract."

❌ "He asked that I send the files." (estructura incorrecta con ask + command)
✅ "He asked me to send the files."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OTROS VERBOS PARA REPORTED COMMANDS Y PETICIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

invite + object + to:
"She invited me to present at the conference."

remind + object + to:
"He reminded us to submit our timesheets."

warn + object + not to:
"She warned me not to mention the budget in the meeting."

advise + object + to:
"He advised me to prepare some examples for the interview."

encourage + object + to:
"The manager encouraged her to apply for the promotion."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UNA ENTREVISTA EN REPORTED SPEECH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lo que dijo el entrevistador:
"Tell me about your previous experience."
"Why do you want to work here?"
"Can you start in September?"
"Don't worry about the technical test — it's just a formality."

Cómo lo repites después:
"The interviewer asked me to tell him about my previous experience.
He also asked why I wanted to work there.
Then he asked whether I could start in September.
Finally, he told me not to worry about the technical test — he said it was just a formality."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — INVERSIÓN EN PREGUNTAS REPORTADAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El error más frecuente: mantener la inversión de la pregunta directa.

❌ "She asked where was I from."           ✅ "She asked where I was from."
❌ "He asked what did I do."               ✅ "He asked what I did."
❌ "They asked when would I be available." ✅ "They asked when I would be available."

Reported questions: sujeto + verbo. Sin inversión. Siempre.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transforma al reported speech:

1. "Are you available for a second interview next week?" (She asked...)
2. "What experience do you have in project management?" (The interviewer asked...)
3. "Don't mention your salary expectations in the first interview." (He warned me...)
4. "Could you send us your portfolio by Thursday?" (They asked...)
5. "Why did you leave your last position?" (She asked...)

Respuestas:
1. She asked if / whether I was available for a second interview the following week.
2. The interviewer asked what experience I had in project management.
3. He warned me not to mention my salary expectations in the first interview.
4. They asked me to send them my portfolio by Thursday.
5. She asked why I had left my last position.`;

// ─────────────────────────────────────────────────────────────────────────────
// L6.4 — Professional Communication — Emails, Meetings, Presentations
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L64 = `El inglés profesional tiene sus propias convenciones. Esta lección te da las herramientas para comunicarte con eficacia en los tres contextos más frecuentes del entorno laboral: correos electrónicos, reuniones y presentaciones.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CORREOS ELECTRÓNICOS FORMALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

APERTURA — cómo empezar:
Dear Mr / Ms [apellido],    →  Para una persona específica (formal)
Dear [Nombre],              →  Para alguien que conoces (semiformal)
To whom it may concern,     →  Si no sabes quién lo leerá (muy formal)
Hi [Nombre],                →  Informal / compañeros de trabajo

PRIMERA FRASE — el propósito:
"I am writing to enquire about..."      →  Escribo para preguntar sobre...
"I am writing with reference to..."     →  Escribo en relación con...
"Further to our conversation..."        →  A raíz de nuestra conversación...
"I would like to follow up on..."       →  Me gustaría hacer un seguimiento de...
"Thank you for your email of [date]."   →  Gracias por su correo del [fecha].

CUERPO DEL MENSAJE — conectores formales:
"I would be grateful if you could..."   →  Le agradecería que pudiera...
"Please find attached..."               →  Adjunto encontrará...
"As per our previous discussion..."     →  Como acordamos previamente...
"I would like to draw your attention to..." →  Me gustaría llamar su atención sobre...
"Please do not hesitate to contact me." →  No dude en ponerse en contacto conmigo.

CIERRE — cómo terminar:
"I look forward to hearing from you."   →  Quedo a la espera de sus noticias.
"I look forward to meeting you."        →  Espero conocerle/a en persona.
"Please let me know if you need anything further." →  No dude en indicarme si necesita algo más.

DESPEDIDA:
Yours sincerely,    →  Si conoces el nombre del destinatario
Yours faithfully,   →  Si no conoces el nombre (Dear Sir/Madam)
Best regards,       →  Semiformal, muy frecuente en entornos profesionales
Kind regards,       →  Semiformal, igualmente frecuente
Best,               →  Informal


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIFERENCIAS FORMALES VS. INFORMALES EN EMAIL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Informal              Formal
Hi / Hey              Dear Mr / Ms...
Thanks for your mail  Thank you for your email
I'm writing to ask    I am writing to enquire
Can you send me...?   I would be grateful if you could send me...
Sorry for the delay   I apologise for the delay
Get back to me        Please do not hesitate to contact me
Cheers / Best         Yours sincerely / Kind regards

En B1, apunta al registro semiformal (Dear [Nombre], Best regards) como punto de referencia.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REUNIONES — LENGUAJE PARA PARTICIPAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ABRIR UNA REUNIÓN:
"Shall we get started?"                →  ¿Empezamos?
"Let's begin. The purpose of today's meeting is..." →  Comencemos. El objetivo de hoy es...
"I'd like to welcome everyone."        →  Me gustaría dar la bienvenida a todos.

CEDER EL TURNO:
"I'd like to hear your thoughts on this." →  Me gustaría escuchar vuestra opinión.
"Does anyone have anything to add?"    →  ¿Alguien quiere añadir algo?
"Over to you, [Nombre]."               →  La palabra es tuya, [Nombre].

INTERVENIR / INTERRUMPIR CON EDUCACIÓN:
"If I could just come in here..."      →  Si me permites intervenir un momento...
"Sorry to interrupt, but..."           →  Perdona que interrumpa, pero...
"I'd like to add something, if I may." →  Me gustaría añadir algo, si me lo permites.

RESUMIR Y AVANZAR:
"So, to summarise what we've agreed..." →  Entonces, para resumir lo acordado...
"Let's move on to the next point."     →  Pasemos al siguiente punto.
"Can we come back to that later?"      →  ¿Podemos volver a eso más tarde?
"I think we're getting off track."     →  Creo que nos estamos desviando del tema.

CERRAR UNA REUNIÓN:
"I think that covers everything."      →  Creo que hemos cubierto todo.
"The next steps are..."                →  Los próximos pasos son...
"Who is responsible for...?"           →  ¿Quién se encarga de...?
"The next meeting will be on..."       →  La próxima reunión será el...


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRESENTACIONES — SIGNPOSTING LANGUAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El signposting language ("lenguaje de señalización") guía al oyente por tu presentación:

PARA INTRODUCIR:
"Good morning / afternoon, everyone. Today I'm going to talk about..."
"The aim of this presentation is to..."
"I'll start by... and then move on to..."
"Feel free to ask questions at the end."

PARA PASAR DE UN PUNTO AL SIGUIENTE:
"Moving on to..."                       →  Pasando a...
"This brings me to my next point..."    →  Esto me lleva a mi siguiente punto...
"Now let's look at..."                  →  Ahora veamos...
"Turning now to..."                     →  Pasando ahora a...

PARA ILUSTRAR:
"As you can see from this slide..."     →  Como pueden ver en esta diapositiva...
"This graph shows..."                   →  Este gráfico muestra...
"To give you an example..."             →  Para darles un ejemplo...
"To put it another way..."              →  Dicho de otra forma...

PARA RESUMIR Y CONCLUIR:
"To summarise the key points..."        →  Para resumir los puntos clave...
"In conclusion, I'd like to..."         →  Para concluir, me gustaría...
"To wrap up..."                         →  Para terminar...
"I'd be happy to take any questions."   →  Estaré encantado/a de responder preguntas.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UN EMAIL PROFESIONAL COMPLETO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear Ms Chen,

I am writing further to our telephone conversation on Monday regarding the project timeline.

As agreed, I would like to confirm that our team will submit the first draft by 15 March. Please find attached a revised schedule for your review.

I would be grateful if you could let me know whether this works for your team. Please do not hesitate to contact me if you need any further information.

I look forward to hearing from you.

Kind regards,
David Martínez
Project Manager


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Cómo dirías estas cosas en inglés profesional?

1. Escribes un email para preguntar si el puesto de trabajo sigue disponible.
2. En una reunión, quieres interrumpir con educación.
3. En una presentación, quieres pasar al siguiente punto.
4. Quieres cerrar un email de forma semiformal.

Respuestas posibles:
1. "I am writing to enquire whether the position is still available."
2. "Sorry to interrupt, but I'd like to add something here."
3. "Moving on to my next point..." / "This brings me to..."
4. "Kind regards," / "Best regards,"`;

// ─────────────────────────────────────────────────────────────────────────────
// L6.5 — Getting the Job — Applications and Interviews
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L65 = `Conseguir un trabajo en inglés implica navegar todo un proceso con su propio vocabulario y sus propias convenciones. Esta lección te prepara para cada etapa: el currículum, la carta de presentación y la entrevista.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VOCABULARIO DEL PROCESO DE SELECCIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CV / résumé          →  currículum vitae (CV es más frecuente en inglés británico)
cover letter         →  carta de presentación
job advertisement    →  oferta de trabajo
to apply for         →  solicitar (un puesto)
application form     →  formulario de solicitud
shortlist            →  lista de candidatos preseleccionados
interview            →  entrevista
candidate            →  candidato/a
recruiter            →  reclutador/a
hiring manager       →  responsable de contratación
reference            →  referencia (persona que puede avalar tu trabajo)
to be headhunted     →  ser contactado directamente por un reclutador
probation period     →  período de prueba
to be offered the job →  recibir la oferta de trabajo
to accept / decline an offer →  aceptar / rechazar una oferta
notice period        →  período de preaviso
to resign / to hand in your notice →  dimitir / entregar la carta de dimisión


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VOCABULARIO DEL CURRÍCULUM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

work experience      →  experiencia laboral
skills               →  habilidades / competencias
qualifications       →  titulaciones / cualificaciones
achievements         →  logros
responsibilities     →  responsabilidades
duties               →  funciones / tareas
key competencies     →  competencias clave
teamwork             →  trabajo en equipo
leadership           →  liderazgo
time management      →  gestión del tiempo
communication skills →  habilidades comunicativas
fluent in            →  con fluidez en (idiomas)
proficient in        →  competente en / con dominio de

Frases útiles para el CV:
"Responsible for managing a team of ten people."
"Achieved a 20% increase in sales within the first year."
"Led the implementation of a new CRM system."
"Collaborated with cross-functional teams across three offices."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREGUNTAS FRECUENTES EN ENTREVISTAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Tell me about yourself."
→  Respuesta ideal: breve resumen profesional (2-3 min). No tu historia de vida.
"I'm a marketing professional with five years of experience in the tech sector. I've worked mainly on digital campaigns and I'm particularly interested in data-driven strategies."

"Why do you want to work here?"
→  Investiga la empresa. Vincula sus valores con los tuyos.
"I've admired [company]'s approach to sustainability for years. I believe my background in supply chain management would allow me to contribute directly to your sustainability targets."

"What are your main strengths?"
"I'm particularly good at working under pressure — in my last role, I consistently delivered projects on time despite tight deadlines."
"One of my strengths is communication: I'm able to explain technical concepts clearly to non-technical stakeholders."

"What is your greatest weakness?"
→  Menciona una debilidad real pero muestra que la estás trabajando.
"I sometimes find it difficult to delegate, but I've been working on this by trusting my team more and checking in regularly rather than micromanaging."

"Where do you see yourself in five years?"
"In five years, I'd like to have taken on more responsibility in a senior role. Ideally, I'd be leading a team and contributing to strategic decisions."

"Why are you leaving your current job?"
"I've learned a great deal in my current position, but I feel ready for a new challenge — particularly in a company with the growth potential that yours has."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HABLAR DE SALARIO Y CONDICIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

salary               →  salario
salary expectations  →  expectativas salariales
gross / net salary   →  salario bruto / neto
annual leave         →  vacaciones anuales
flexible working     →  trabajo flexible (horario o lugar)
remote working       →  teletrabajo
benefits package     →  paquete de beneficios (seguro médico, bonus, etc.)
bonus                →  bonus / incentivo económico
pension scheme       →  plan de pensiones

Cómo responder a "What are your salary expectations?":
"Based on my experience and the responsibilities of the role, I'm looking for something in the range of [X] to [Y]. However, I'm open to discussing the full package."

Cómo preguntar por condiciones:
"Could you tell me more about the benefits package?"
"What is the policy on remote working?"
"How many days of annual leave does the role include?"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONNECTING GRAMMAR TO PROFESSIONAL CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Todo lo aprendido en esta unidad converge aquí:

Reported speech en entrevistas:
"The interviewer asked why I wanted to work there."
"She asked whether I had experience with project management software."
"He told me not to worry about the salary discussion at this stage."

Present perfect para experiencia profesional:
"I've managed teams of up to fifteen people."
"I've worked in this sector for over six years."
"I've never missed a project deadline." (sea cierto o no — es un ejemplo de uso)

Conditional type 2 para describir ambiciones:
"If I were offered the position, I would bring considerable experience to the team."
"If I had the opportunity to lead this project, I would start by reviewing the current process."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Responde brevemente en inglés:

1. ¿Qué es un "probation period"?
2. ¿Cómo responderías en una entrevista a "What is your greatest achievement?"
3. ¿Cómo preguntarías por las condiciones de teletrabajo?
4. Transforma al reported speech: The recruiter said: "We will contact you by the end of next week."

Respuestas posibles:
1. A probation period is a trial period at the start of a job, during which both the employer and employee can decide if the position is a good fit.
2. Variable — e.g. "My greatest achievement was leading the launch of a new product that increased revenue by 30% in its first year."
3. "What is the company's policy on remote working?" / "Is there flexibility to work from home?"
4. The recruiter said that they would contact me by the end of the following week.`;

// ─────────────────────────────────────────────────────────────────────────────
// L6.6 — Work & Reported Speech — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L66 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — SAID VS. TOLD Y REPORTED STATEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. "He _______ the results would be ready on Friday." ¿Qué forma es correcta?
   a) told that   b) said that   c) said me that   d) told to
   Respuesta: b (said + that, sin objeto directo de persona)

2. "She _______ the meeting had been postponed." ¿Qué forma con objeto es correcta?
   a) said us that   b) told us that   c) told that   d) said to us
   Respuesta: b (told + objeto + that)

3. Backshift: "I work in marketing." → He said that he _______ in marketing.
   a) works   b) worked   c) has worked   d) will work
   Respuesta: b (present simple → past simple)

4. Backshift: "I saw the client yesterday." → She said that she _______ the client the day before.
   a) saw   b) had seen   c) has seen   d) see
   Respuesta: b (past simple → past perfect)

5. Backshift: "I will call you." → He said that he _______ me.
   a) will call   b) would call   c) called   d) has called
   Respuesta: b (will → would)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — PRONOMBRES Y EXPRESIONES TEMPORALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. "I love my job." (Ana habla) → Ana said that _______ loved _______ job.
   a) I / my   b) she / her   c) he / his   d) they / their
   Respuesta: b

7. "I sent the report yesterday." → She said she had sent the report _______.
   a) yesterday   b) the day before   c) today   d) last day
   Respuesta: b (yesterday → the day before)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — REPORTED QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. "Are you coming to the meeting?" → She asked _______ I was coming to the meeting.
   a) that   b) if   c) what   d) was
   Respuesta: b

9. "Where do you work?" → He asked me _______.
   a) where did I work   b) where I work   c) where I worked   d) where worked I
   Respuesta: c (no inversión + backshift)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — REPORTED COMMANDS Y VERBOS DE REPORTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. "Submit the report by Friday." → The manager _______ the report by Friday.
    a) said her to submit   b) told her to submit   c) told her submit   d) asked she to submit
    Respuesta: b (told + objeto + to + infinitivo)

11. "Please don't be late." → She asked me _______ late.
    a) not be   b) not to be   c) to not be   d) don't be
    Respuesta: b (not to + infinitivo para negativa)

12. "I didn't take the files." → He _______ taking the files.
    a) said   b) denied   c) confirmed   d) suggested
    Respuesta: b (denied = negó)`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U6 — 12 preguntas × 1 punto. passingScore 80 → mínimo 10/12.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U6 = {
  title:        'Work & Career — Unit 6 Assessment',
  description:  'Escribe un párrafo de seis a ocho frases reportando lo que dijo alguien en una reunión o entrevista de trabajo. Usa al menos un reported statement, una reported question y un reported command. Incluye dos expresiones del vocabulario profesional de la unidad.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '"He _______ the results would be ready on Friday." ¿Qué forma es correcta?',
      options:      ['told that', 'said that', 'said me that', 'told to'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"She _______ the meeting had been postponed." ¿Qué forma con objeto directo de persona es correcta?',
      options:      ['said us that', 'told us that', 'told that', 'said to us'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         'Backshift: "I work in marketing." → He said that he _______ in marketing.',
      options:      ['works', 'worked', 'has worked', 'will work'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         'Backshift: "I saw the client yesterday." → She said she _______ the client the day before.',
      options:      ['saw', 'had seen', 'has seen', 'see'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         'Backshift: "I will call you." → He said that he _______ me.',
      options:      ['will call', 'would call', 'called', 'has called'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"I love my job." (Ana habla) → Ana said that _______ loved _______ job.',
      options:      ['I / my', 'she / her', 'he / his', 'they / their'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"I sent the report yesterday." → She said she had sent the report _______.',
      options:      ['yesterday', 'the day before', 'today', 'last day'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"Are you coming to the meeting?" → She asked _______ I was coming to the meeting.',
      options:      ['that', 'if', 'what', 'was'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"Where do you work?" → He asked me _______.',
      options:      ['where did I work', 'where I work', 'where I worked', 'where worked I'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"Submit the report by Friday." → The manager _______ the report by Friday.',
      options:      ['said her to submit', 'told her to submit', 'told her submit', 'asked she to submit'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"Please don\'t be late." → She asked me _______ late.',
      options:      ['not be', 'not to be', 'to not be', "don't be"],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"I didn\'t take the files." → He _______ taking the files.',
      options:      ['said', 'denied', 'confirmed', 'suggested'],
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
    title:            'Work & Career',
    order:            6,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L6.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'She Said That... — Reported Speech (Statements)',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L61,
      duration: 25,
      order:    1,
    }),

    // L6.2 — VIDEO
    // Canal recomendado: BBC Learning English / engVid / Indeed Career Tips
    // Búsqueda: "job interview in English authentic BBC"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: A Job Interview',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-b1-u6-l2',
      duration: 12,
      order:    2,
    }),

    // L6.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'He Asked Whether... — Reported Questions and Commands',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L63,
      duration: 20,
      order:    3,
    }),

    // L6.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Professional Communication — Emails, Meetings, Presentations',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L64,
      duration: 20,
      order:    4,
    }),

    // L6.5 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'Getting the Job — Applications and Interviews',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L65,
      duration: 20,
      order:    5,
    }),

    // L6.6 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 6 }, {
      unitId:   unit._id,
      courseId,
      title:    'Work & Reported Speech — Quiz',
      type:     LESSON_TYPES.QUIZ,
      content:  CONTENT_L66,
      duration: 25,
      order:    6,
    }),

  ]);

  await upsert(Assessment, { unitId: unit._id }, {
    unitId:   unit._id,
    courseId,
    ...ASSESSMENT_U6,
  });
};
