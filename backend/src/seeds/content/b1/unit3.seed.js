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
// L3.1 — What Do You Think? — Expressing Opinions
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L31 = `Expresar tu opinión en inglés no es solo decir "I think". A nivel B1 tienes a tu disposición una gama de expresiones que te permiten matizar cuánto crees en lo que dices, qué tan firme es tu posición y qué registro usas.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPRESIONES DE OPINIÓN — DE MENOS A MÁS FUERTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Las opiniones tienen intensidad. Elegir la expresión correcta transmite exactamente cuánta certeza tienes.

OPINIÓN TENTATIVA O SUAVE:
"I tend to think..."              →  Tiendo a pensar que...
"It seems to me (that)..."        →  Me parece que...
"I'd say (that)..."               →  Yo diría que...
"I suppose..."                    →  Supongo que...

"I tend to think remote working has more advantages than disadvantages."
"It seems to me that the situation is more complicated than it looks."
"I'd say the film was good, but not as good as the book."

OPINIÓN ESTÁNDAR — NEUTRA:
"I think (that)..."               →  Creo que...
"I believe (that)..."             →  Creo / opino que...
"I feel (that)..."                →  Siento / creo que...

"I think this approach is more effective."
"I believe everyone has the right to express their opinion."

OPINIÓN FIRME O PERSONAL:
"In my view / In my opinion..."   →  En mi opinión...
"As far as I'm concerned..."      →  En lo que a mí respecta... / Desde mi punto de vista...
"I'm convinced (that)..."         →  Estoy convencido/a de que...
"Personally, I think..."          →  Personalmente, creo que...

"In my view, the decision was wrong from the start."
"As far as I'm concerned, honesty is the most important value."
"I'm convinced that things will improve."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUANDO USAS CADA TIPO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usa formas tentativas cuando:
— No estás completamente seguro/a
— Quieres sonar abierto/a a otras ideas
— Estás en una conversación informal
— El tema es delicado

Usa formas fuertes cuando:
— Estás seguro/a de tu posición
— Es un debate formal o una presentación
— Defiendes un argumento con evidencia
— Quieres dejar tu postura clara

Recuerda: "I'm convinced" + evidencia → argumento persuasivo
          "I tend to think" + sin evidencia → opinión abierta


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUGHT TO — RECOMENDACIONES (CONTENIDO NUEVO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cuando expresas opinión sobre lo que es correcto o recomendable, usas modales.
Ya conoces SHOULD de A2. Ahora añades OUGHT TO, que es nuevo en tu nivel B1.

OUGHT TO — alternativa formal a SHOULD para recomendaciones y obligaciones morales:

"You should see a doctor."        =   "You ought to see a doctor."
"They should apologise."          =   "They ought to apologise."
"We should respect different views." = "We ought to respect different views."

Ought to + infinitivo (sin "to" extra — no: "ought to to go")

CUÁNDO USAR OUGHT TO EN LUGAR DE SHOULD:
— En contextos más formales (presentaciones, argumentos escritos)
— Para expresar lo que es moralmente correcto o justo
— En frases con un tono más institucional o ético

"The government ought to invest more in public transport."
"Students ought to be given more time to prepare for exams."
"In my opinion, companies ought to be transparent about their practices."

NOTA IMPORTANTE:
OUGHT TO no tiene forma negativa ni interrogativa habitual en inglés moderno.
Para negar o preguntar, usamos SHOULD en su lugar:

✅ "Should we do this?"      (no: "Ought we to do this?" — suena muy formal y anticuado)
✅ "You shouldn't lie."      (no: "You oughtn't to lie." — posible pero rarísimo)

En producción, ought to aparece casi siempre en afirmativa.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPINIONES EN CONTEXTO — DEBATE SOBRE TECNOLOGÍA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"I think social media has changed the way we communicate — not always for the better."
"As far as I'm concerned, people ought to be more careful about what they share online."
"It seems to me that the benefits outweigh the risks, if used responsibly."
"I'm convinced that younger generations will find a healthier balance than ours did."
"I'd say the biggest problem isn't the technology itself, but how we use it."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — "I AM THINKING THAT"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Think" es un verbo de estado cuando expresa opinión — no va en continuous:

❌ "I am thinking that this is wrong."    (opinión)
✅ "I think this is wrong."

❌ "I am believing that he is right."
✅ "I believe he is right."

La forma continuous de "think" existe, pero solo cuando significa "estar pensando en algo":
✅ "I'm thinking about changing jobs." (acción mental en proceso)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Expresa estas opiniones usando la expresión indicada:

1. Crees que el transporte público es mejor que el coche. (opinión firme, primera persona)
2. No estás muy seguro/a, pero piensas que los exámenes generan demasiado estrés. (tentativo)
3. Expresas que sería moralmente correcto pagar más a los profesores. (ought to)
4. Das tu opinión personal sobre el trabajo desde casa. (as far as I'm concerned)

Posibles respuestas:
1. In my opinion, public transport is better than the car. / I'm convinced that...
2. I tend to think / I'd say that exams create too much pressure.
3. Teachers ought to be paid more.
4. As far as I'm concerned, working from home increases productivity.`;

// ─────────────────────────────────────────────────────────────────────────────
// L3.3 — Agreeing, Disagreeing and Everything In Between
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L33 = `En un debate real, no siempre estás completamente de acuerdo ni completamente en desacuerdo. Esta lección te da las herramientas para navegar toda la escala — desde el acuerdo total hasta el desacuerdo educado — sin romper la conversación.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACUERDO TOTAL — STRONG AGREEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Exactamente la misma posición que la otra persona:

"Exactly!"                            →  ¡Exacto!
"Absolutely!"                         →  ¡Por supuesto! / ¡Totalmente!
"I couldn't agree more."              →  No podría estar más de acuerdo.
"That's exactly what I think."        →  Es exactamente lo que pienso.
"You're absolutely right."            →  Tienes toda la razón.
"I totally agree with you on that."   →  Estoy totalmente de acuerdo contigo en eso.

Uso: cuando compartes la posición completamente y quieres mostrarlo con entusiasmo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACUERDO PARCIAL — PARTIAL AGREEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reconoces parte de lo que dice la otra persona pero matizas:

"I see your point, but..."                →  Entiendo tu punto, pero...
"That's a fair point, but..."             →  Es un punto válido, pero...
"I see what you mean, but..."             →  Entiendo lo que quieres decir, pero...
"You have a point, although..."           →  Tienes razón en eso, aunque...
"That may be true, but..."               →  Puede que sea así, pero...
"I agree up to a point, but..."          →  Estoy de acuerdo hasta cierto punto, pero...
"I can see where you're coming from, but..." → Entiendo de dónde vienes, pero...

ESTRUCTURA CLÁSICA DEL ACUERDO PARCIAL:
[Reconocer la parte válida] + "but/however/although" + [tu matiz o contraargumento]

"I see your point about the cost, but I think the long-term benefits outweigh it."
"That's a fair point, although I'm not sure the evidence supports that conclusion."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESACUERDO — DISAGREEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Discrepar sin atacar a la persona:

DESACUERDO SUAVE:
"I'm not sure I agree with that."        →  No estoy seguro/a de estar de acuerdo.
"I'm not convinced."                     →  No estoy convencido/a.
"I'm not sure about that."               →  No estoy muy seguro/a de eso.
"That's an interesting point, but..."    →  Es un punto interesante, pero...

DESACUERDO DIRECTO (educado):
"I don't think that's right."            →  No creo que eso sea correcto.
"I'd argue the opposite."                →  Yo defenderé lo contrario.
"I'm afraid I disagree."                 →  Me temo que no estoy de acuerdo.
"I see it differently."                  →  Yo lo veo de otra manera.

DESACUERDO FUERTE (para debate formal):
"I strongly disagree."                   →  Estoy totalmente en desacuerdo.
"I think that's a misconception."        →  Creo que eso es un malentendido.
"The evidence suggests otherwise."       →  La evidencia sugiere lo contrario.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTUALLY — PARA CORREGIR CON EDUCACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Actually" es una de las palabras más útiles para corregir algo con tacto:

"Actually, I think you'll find that..." →  En realidad, creo que encontrarás que...
"Actually, that's not quite right."     →  En realidad, eso no es del todo correcto.
"Actually, I see it differently."       →  En realidad, yo lo veo diferente.

ATENCIÓN — FALSO AMIGO EN ESPAÑOL:
"Actually" NO significa "actualmente".
"Actually" = en realidad / de hecho
"Currently" = actualmente / en este momento

❌ "Actually, I work in a hospital." (para decir: actualmente trabajo en un hospital)
✅ "Currently, I work in a hospital." / "I'm currently working in a hospital."
✅ "Actually, I work in a hospital." (para corregir algo: "en realidad sí trabajo allí")


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TURNO DE PALABRA — INTERRUMPIR Y RETOMAR CON CORTESÍA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para interrumpir con educación:
"Sorry to interrupt, but..."             →  Perdona que interrumpa, pero...
"If I could just add something..."       →  Si pudiera añadir algo...
"Can I just come in here?"               →  ¿Puedo intervenir aquí?

Para retomar tu turno después de una interrupción:
"As I was saying..."                     →  Como decía...
"Going back to my point..."              →  Volviendo a mi punto...
"To finish what I was saying..."         →  Para terminar lo que decía...


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UN INTERCAMBIO REAL — DEBATE SOBRE EDUCACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A: "I think exams are the best way to assess students."
B: "I see your point, but I'm not convinced they measure real ability."
A: "That's a fair point. However, they do provide an objective standard."
B: "I'd argue the opposite — they mainly measure how well you perform under pressure."
A: "Actually, there's research that supports their validity as a measure of learning."
B: "I agree up to a point. Perhaps a combination of exams and continuous assessment would be better."
A: "Absolutely — that's what I was going to suggest."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Cómo responderías en cada situación?

1. Tu compañero/a dice: "Social media is a waste of time." Estás completamente de acuerdo.
2. Tu compañero/a dice: "Public transport is always unreliable." Estás parcialmente de acuerdo pero quieres matizar.
3. Tu compañero/a dice: "It's impossible to learn a language as an adult." No estás de acuerdo.
4. Tu compañero/a dice algo incorrecto sobre los horarios. Quieres corregir con tacto.

Posibles respuestas:
1. "I couldn't agree more." / "Absolutely!"
2. "I see your point, but it depends on the city — some systems are very efficient."
3. "I'm afraid I disagree — there's plenty of evidence that adults can learn languages successfully."
4. "Actually, I think the meeting is at three, not four."`;

// ─────────────────────────────────────────────────────────────────────────────
// L3.4 — Linking Ideas — Discourse Markers
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L34 = `Los marcadores del discurso son las señales de tráfico de un argumento: indican al oyente o lector adónde va la frase a continuación. Sin ellos, las ideas quedan desconectadas. Con ellos, tu inglés tiene cohesión y suena natural.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AÑADIR INFORMACIÓN — ADDING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para introducir un punto adicional en la misma dirección:

Furthermore          →  Además (más formal)
What's more          →  Además (más oral / enfático)
In addition          →  Además / Adicionalmente (neutro)
Not only that        →  No solo eso (enfático)
On top of that       →  Encima de eso (oral)
Also / As well       →  También (más casual)

Posición: normalmente al inicio de la frase o cláusula, seguido de coma.

"The plan reduces costs. Furthermore, it improves efficiency."
"She speaks three languages. What's more, she's learning a fourth."
"The journey was long. On top of that, we missed the connection."

NOTA: "Also" generalmente va entre el sujeto y el verbo principal:
"She also speaks Italian." (no: "Also she speaks Italian.")


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTRASTAR — CONTRASTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para introducir una idea opuesta o limitante:

However              →  Sin embargo (neutro, muy frecuente)
On the other hand    →  Por otro lado (presenta una perspectiva alternativa)
Nevertheless         →  No obstante (a pesar de lo anterior)
Despite this         →  A pesar de esto
Even so              →  Aun así
That said            →  Dicho esto (oral, para matizar lo anterior)
Although / Though    →  Aunque (dentro de la misma frase)
While / Whereas      →  Mientras que / Aunque (contraste entre dos cláusulas)

"The project was expensive. However, the results were worth it."
"On the other hand, there are arguments in favour of the traditional approach."
"I don't enjoy early mornings. That said, I always feel better after a morning workout."
"Although the plan is ambitious, it is achievable with the right resources."
"While some people prefer cities, others find them overwhelming."

DIFERENCIA ENTRE HOWEVER Y ALTHOUGH:
HOWEVER → al inicio de una nueva frase o cláusula independiente (con coma)
ALTHOUGH → dentro de la misma frase, conectando dos cláusulas

"It was cold. However, we went for a walk." (dos frases)
"Although it was cold, we went for a walk." (una frase)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONCLUIR — CONCLUDING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para cerrar un argumento o resumir una posición:

In conclusion        →  En conclusión (formal, escrito)
To sum up            →  En resumen (oral y escrito)
All things considered →  Teniendo todo en cuenta
On balance           →  En general / Sopesando todo
Overall              →  En general
To conclude          →  Para concluir (formal)

"In conclusion, I believe the benefits of this policy outweigh the costs."
"To sum up, there are strong arguments on both sides."
"All things considered, I think we made the right decision."
"On balance, the positives outweigh the negatives."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DAR EJEMPLOS — EXEMPLIFYING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para concretar un punto abstracto con un caso real:

For example          →  Por ejemplo (más neutral)
For instance         →  Por ejemplo (ligeramente más formal)
Take... as an example →  Tomemos... como ejemplo
Such as              →  Como / tales como
To illustrate        →  Para ilustrar (formal)

"Many companies have improved their work culture. For example, some now offer flexible hours."
"Take Spain as an example — the siesta is less common in modern workplaces than it used to be."
"Some languages, such as Finnish and Hungarian, are notoriously difficult for English speakers."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POSICIÓN DE LOS MARCADORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La mayoría de los marcadores van al INICIO de la frase, seguidos de coma:
"However, this is not always the case."
"Furthermore, the data supports this view."

Algunos pueden ir en el MEDIO (entre comas) para variar el ritmo:
"This approach, however, has its limitations."
"The results, furthermore, were consistent across all groups."

Evita usar el mismo marcador varias veces seguidas — varía.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UN ARGUMENTO CON MARCADORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sin marcadores (desconectado):
"Technology has improved communication. There are problems. Young people use their phones too much. Face-to-face conversation is suffering."

Con marcadores (cohesionado):
"Technology has undoubtedly improved communication. However, it has also created new challenges. For instance, young people often spend more time on their phones than talking face to face. What's more, studies suggest this is having an impact on social skills. That said, it would be unfair to blame technology alone — the way we use it is equally important. All things considered, a more balanced approach to screen time seems necessary."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige el marcador más adecuado:

1. "Learning a language takes time. _______, it requires consistent daily practice."
   (However / Furthermore / To sum up)

2. "The film received good reviews. _______, the box office results were disappointing."
   (Furthermore / For instance / However)

3. "There are many benefits to exercise. _______, running improves cardiovascular health."
   (For example / Nevertheless / On the other hand)

4. "_______, I believe the advantages of the proposal outweigh its risks."
   (Furthermore / All things considered / For instance)

Respuestas: 1. Furthermore  2. However  3. For example  4. All things considered`;

// ─────────────────────────────────────────────────────────────────────────────
// L3.5 — If This, Then That — Conditional Type 1
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L35 = `El condicional es la gramática de las posibilidades, las consecuencias y los planes. El tipo 1 cubre condiciones reales y posibles — situaciones que pueden ocurrir de verdad.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LA ESTRUCTURA BÁSICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IF + present simple  →  will / can / may + infinitivo

La cláusula con IF describe la condición.
La cláusula principal describe el resultado probable.

"If it rains, I'll take an umbrella."
→  Si llueve (condición posible), cogeré un paraguas (resultado probable).

"If you study hard, you will pass the exam."
"If she calls, I'll answer."
"If we leave now, we'll catch the train."

El orden de las cláusulas puede invertirse. Cuando la cláusula principal va primero, no hay coma:

"I'll take an umbrella if it rains."
"You will pass the exam if you study hard."
"We'll catch the train if we leave now."

REGLA ESENCIAL:
En la cláusula con IF → PRESENTE SIMPLE (nunca "will")
En la cláusula de resultado → WILL / CAN / MAY + infinitivo

❌ "If it will rain, I'll take an umbrella."
✅ "If it rains, I'll take an umbrella."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VARIANTES EN LA CLÁUSULA DE RESULTADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No solo WILL — también puedes usar CAN y MAY para matizar el resultado:

WILL → resultado muy probable / seguro:
"If you apply now, you will get an interview."

CAN → resultado posible o permitido:
"If you finish early, you can go home."
"If it stops raining, we can go for a walk."

MAY → resultado posible pero incierto:
"If we promote the event well, more people may attend."
"If you eat too much sugar, you may feel tired afterwards."

Elige según el grado de certeza del resultado.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UNLESS — LA CONDICIÓN NEGATIVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UNLESS = IF + NOT

"Unless you hurry, you'll miss the bus."
= "If you don't hurry, you'll miss the bus."

"Unless it rains, we'll have the picnic outside."
= "If it doesn't rain, we'll have the picnic outside."

"She won't come unless you invite her."
= "She won't come if you don't invite her."

REGLA: después de UNLESS, el verbo va en afirmativo (la negación ya está en unless):
❌ "Unless you don't study, you'll fail."
✅ "Unless you study, you'll fail." (= If you don't study, you'll fail.)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTERNATIVAS A IF — REGISTRO FORMAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estas expresiones tienen el mismo significado que IF pero son más formales:

PROVIDED THAT / PROVIDING (THAT):
"Provided that you submit the form on time, your application will be considered."
= "If you submit the form on time, your application will be considered."

AS LONG AS:
"As long as you follow the instructions, everything should be fine."
= "If you follow the instructions, everything should be fine."

ON CONDITION THAT:
"I'll help you on condition that you explain the situation fully."
= "I'll help you if you explain the situation fully."

Uso: contratos, condiciones de trabajo, situaciones legales o formales.
En conversación cotidiana, IF es siempre preferible.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EL CONDICIONAL TIPO 1 EN UN DEBATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El condicional tipo 1 es especialmente útil al debatir porque permite:
— Presentar consecuencias: "If we invest in education, standards will improve."
— Hacer propuestas: "If we reduce working hours, productivity may actually increase."
— Advertir: "If nothing changes, the problem will get worse."
— Negociar: "I'll agree to this, provided that we review the terms in six months."

"In my view, if the government raises the minimum wage, more people will be able to afford housing."
"As far as I'm concerned, unless companies reduce their carbon emissions, the environmental targets won't be met."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — WILL EN LA CLÁUSULA IF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El error más frecuente entre hispanohablantes: usar "will" en la cláusula con IF porque en español el futuro sí aparece ahí ("si llueve" = si hay lluvia).

❌ "If it will be cold, I'll wear a coat."
✅ "If it is cold, I'll wear a coat."

❌ "Unless she will come, we'll cancel."
✅ "Unless she comes, we'll cancel."

❌ "As long as you will help me, I can do it."
✅ "As long as you help me, I can do it."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completa con la forma correcta:

1. If you _______ (eat) breakfast, you _______ (feel) more alert all morning.
2. Unless she _______ (reply) today, we _______ (have to) find another speaker.
3. _______ you finish before six, you can join us for dinner. (Usa "provided that")
4. If I _______ (not get) a reply by Friday, I _______ (send) a follow-up email.
5. We _______ (meet) the deadline if everyone _______ (contribute) this week.

Respuestas:
1. eat / will feel
2. replies / will have to
3. Provided that you finish before six, you can join us for dinner.
4. don't get / will send
5. will meet / contributes`;

// ─────────────────────────────────────────────────────────────────────────────
// L3.6 — Opinions & Debate — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L36 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — EXPRESIONES DE OPINIÓN Y OUGHT TO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ¿Cuál de estas expresiones transmite una opinión más tentativa y abierta?
   a) "I'm convinced that..."    b) "I tend to think..."
   c) "In my view..."            d) "I know that..."
   Respuesta: b

2. "You _______ apply before the deadline — the competition is very high."
   (Recomendación formal con el modal nuevo de esta unidad)
   a) must to   b) ought to   c) should to   d) have to to
   Respuesta: b

3. "You ought to rest." tiene el mismo sentido que:
   a) "You must rest." (obligación muy fuerte)
   b) "You should rest." (recomendación)
   c) "You can rest." (permiso)
   d) "You will rest." (predicción)
   Respuesta: b


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — ACUERDO Y DESACUERDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. ¿Qué expresión indica acuerdo total?
   a) "I see your point, but..."
   b) "I'm not sure about that."
   c) "I couldn't agree more."
   d) "Actually, that's not quite right."
   Respuesta: c

5. "I see what you mean, _______ I think the situation is more complex."
   a) and   b) but   c) so   d) because
   Respuesta: b

6. ¿Cuál de estas respuestas expresa desacuerdo educado?
   a) "Absolutely!"
   b) "I couldn't agree more."
   c) "I'm afraid I disagree — I see it differently."
   d) "That's exactly what I think."
   Respuesta: c


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — MARCADORES DEL DISCURSO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. "The project was expensive. _______, the results were excellent."
   ¿Qué marcador introduce un contraste?
   a) Furthermore   b) For instance   c) However   d) In addition
   Respuesta: c

8. "She's an experienced teacher. _______, she has published three books."
   ¿Qué marcador añade información?
   a) However   b) Nevertheless   c) What's more   d) In conclusion
   Respuesta: c

9. "_______, I believe this is the best approach available."
   ¿Qué marcador cierra un argumento?
   a) Furthermore   b) For instance   c) However   d) To sum up
   Respuesta: d


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — CONDITIONAL TYPE 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. "If it _______ tomorrow, we _______ cancel the outdoor event."
    a) rains / will   b) will rain / will   c) rains / would   d) rained / will
    Respuesta: a

11. "Unless you _______, you'll miss the bus."
    ¿Cuál de estas frases expresa el mismo significado?
    a) "If you hurry, you'll miss the bus."
    b) "If you don't hurry, you'll miss the bus."
    c) "Because you hurried, you missed the bus."
    d) "Although you hurry, you'll miss the bus."
    Respuesta: b

12. "_______ you arrive before nine, you can join the morning session."
    ¿Qué alternativa formal a "if" completa la frase?
    a) Unless   b) Provided that   c) Because   d) So that
    Respuesta: b`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U3 — 12 preguntas × 1 punto. passingScore 80 → mínimo 10/12.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U3 = {
  title:        'Opinions & Debate — Unit 3 Assessment',
  description:  'Escribe un párrafo de seis a ocho frases sobre un tema que conozcas bien. Usa al menos dos expresiones de opinión, un conector de contraste, un conector de adición y una estructura condicional tipo 1.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '¿Qué expresión transmite una opinión más tentativa y abierta?',
      options:      ["I'm convinced that...", 'I tend to think...', 'In my view...', 'I know that...'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"You _______ apply before the deadline — the competition is very high." ¿Qué modal de recomendación formal es correcto?',
      options:      ['must to', 'ought to', 'should to', 'have to to'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"You ought to rest." tiene el mismo sentido que...',
      options:      ['"You must rest."', '"You should rest."', '"You can rest."', '"You will rest."'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Qué expresión indica acuerdo total?',
      options:      ["I see your point, but...", "I'm not sure about that.", "I couldn't agree more.", "Actually, that's not quite right."],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"I see what you mean, _______ I think the situation is more complex." ¿Qué conector es correcto?',
      options:      ['and', 'but', 'so', 'because'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Cuál de estas respuestas expresa desacuerdo educado?',
      options:      ["Absolutely!", "I couldn't agree more.", "I'm afraid I disagree — I see it differently.", "That's exactly what I think."],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"The project was expensive. _______, the results were excellent." ¿Qué marcador introduce un contraste?',
      options:      ['Furthermore', 'For instance', 'However', 'In addition'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"She\'s an experienced teacher. _______, she has published three books." ¿Qué marcador añade información?',
      options:      ['However', 'Nevertheless', "What's more", 'In conclusion'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '"_______, I believe this is the best approach available." ¿Qué marcador cierra un argumento?',
      options:      ['Furthermore', 'For instance', 'However', 'To sum up'],
      correctIndex: 3,
      points:       1,
    },
    {
      text:         '"If it _______ tomorrow, we _______ cancel the event." ¿Qué formas son correctas?',
      options:      ['rains / will', 'will rain / will', 'rains / would', 'rained / will'],
      correctIndex: 0,
      points:       1,
    },
    {
      text:         '"Unless you hurry, you\'ll miss the bus." ¿Cuál de estas frases tiene el mismo significado?',
      options:      ["If you hurry, you'll miss the bus.", "If you don't hurry, you'll miss the bus.", 'Because you hurried, you missed the bus.', "Although you hurry, you'll miss the bus."],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"_______ you arrive before nine, you can join the morning session." ¿Qué alternativa formal a "if" es correcta?',
      options:      ['Unless', 'Provided that', 'Because', 'So that'],
      correctIndex: 1,
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
    title:            'Opinions & Debate',
    order:            3,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L3.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'What Do You Think? — Expressing Opinions',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L31,
      duration: 20,
      order:    1,
    }),

    // L3.2 — VIDEO
    // Canal recomendado: BBC Learning English / TED-Ed
    // Búsqueda: "how to express opinions debate English B1"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    'Watch: A Real Discussion',
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-b1-u3-l2',
      duration: 10,
      order:    2,
    }),

    // L3.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'Agreeing, Disagreeing and Everything In Between',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L33,
      duration: 20,
      order:    3,
    }),

    // L3.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Linking Ideas — Discourse Markers',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L34,
      duration: 20,
      order:    4,
    }),

    // L3.5 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'If This, Then That — Conditional Type 1',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L35,
      duration: 20,
      order:    5,
    }),

    // L3.6 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 6 }, {
      unitId:   unit._id,
      courseId,
      title:    'Opinions & Debate — Quiz',
      type:     LESSON_TYPES.QUIZ,
      content:  CONTENT_L36,
      duration: 25,
      order:    6,
    }),

  ]);

  await upsert(Assessment, { unitId: unit._id }, {
    unitId:   unit._id,
    courseId,
    ...ASSESSMENT_U3,
  });
};
