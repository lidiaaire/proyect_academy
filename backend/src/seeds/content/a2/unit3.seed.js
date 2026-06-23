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
// L3.1 — The Human Body — Parts and Functions
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L31 = `Conocer el vocabulario del cuerpo y la salud en inglés es esencial en situaciones reales: visitar a un médico en el extranjero, describir cómo te encuentras o entender instrucciones médicas. Esta lección te da las bases.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARTES DEL CUERPO — DE ARRIBA A ABAJO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

head         →  cabeza
face         →  cara
eye(s)       →  ojo(s)
ear(s)       →  oreja(s)
nose         →  nariz
mouth        →  boca
tooth / teeth →  diente / dientes
lip(s)       →  labio(s)
chin         →  barbilla
cheek(s)     →  mejilla(s)
forehead     →  frente
neck         →  cuello
shoulder(s)  →  hombro(s)
chest        →  pecho
back         →  espalda
arm(s)       →  brazo(s)
elbow(s)     →  codo(s)
wrist(s)     →  muñeca(s)
hand(s)      →  mano(s)
finger(s)    →  dedo(s) de la mano
stomach      →  estómago / tripa
hip(s)       →  cadera(s)
leg(s)       →  pierna(s)
knee(s)      →  rodilla(s)
ankle(s)     →  tobillo(s)
foot / feet  →  pie / pies
toe(s)       →  dedo(s) del pie


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ÓRGANOS INTERNOS Y VOCABULARIO MÉDICO BÁSICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

heart        →  corazón
lung(s)      →  pulmón / pulmones
liver        →  hígado
kidney(s)    →  riñón / riñones
brain        →  cerebro
blood        →  sangre
bone(s)      →  hueso(s)
muscle(s)    →  músculo(s)
skin         →  piel
joint(s)     →  articulación(es)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CÓMO DECIR QUE ALGO TE DUELE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En inglés tienes dos estructuras principales:

1. My [parte del cuerpo] hurts / aches.

"My head hurts."           →  Me duele la cabeza.
"My back aches."           →  Me duele la espalda.
"My feet hurt."            →  Me duelen los pies.
"My throat hurts a lot."   →  Me duele mucho la garganta.

2. I have a [symptom].

"I have a headache."       →  Tengo dolor de cabeza.
"I have a stomachache."    →  Tengo dolor de estómago.
"I have a backache."       →  Tengo dolor de espalda.
"I have a toothache."      →  Tengo dolor de muelas.
"I have an earache."       →  Tengo dolor de oídos.
"I have a sore throat."    →  Tengo la garganta irritada.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VOCABULARIO DEL SISTEMA SANITARIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

doctor / GP       →  médico de cabecera (GP = General Practitioner)
nurse             →  enfermero/a
hospital          →  hospital
surgery / clinic  →  consultorio / clínica
appointment       →  cita médica
prescription      →  receta médica
medicine          →  medicamento
tablet / pill     →  pastilla / comprimido
injection         →  inyección
blood test        →  análisis de sangre
X-ray             →  radiografía
emergency         →  urgencias

"I need to make an appointment with my doctor."
"The doctor gave me a prescription for antibiotics."
"You need to take these tablets twice a day."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — "I HAVE PAIN IN MY HEAD"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los hispanohablantes traducen literalmente "tengo dolor de cabeza":

❌ "I have pain in my head."
✅ "I have a headache." / "My head hurts."

❌ "I feel pain in my stomach."
✅ "I have a stomachache." / "My stomach hurts."

Las formas compuestas (-ache) son mucho más naturales en inglés cotidiano.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Cómo dirías estas cosas en inglés?

1. Me duele la espalda.
2. Tengo dolor de muelas.
3. Me duelen los pies.
4. Tengo la garganta irritada.
5. Necesito una cita con el médico.

Posibles respuestas:
1. My back hurts. / I have a backache.
2. I have a toothache.
3. My feet hurt.
4. I have a sore throat.
5. I need to make an appointment with my doctor.`;

// ─────────────────────────────────────────────────────────────────────────────
// L3.3 — I Feel Terrible — Symptoms and Illnesses
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L33 = `Describir tus síntomas con precisión es fundamental cuando visitas a un médico en inglés. Esta lección te da el vocabulario para expresar cómo te encuentras y entender lo que el médico o farmacéutico te pregunta.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SÍNTOMAS FRECUENTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

a temperature / a fever    →  fiebre
a cough                    →  tos
a cold                     →  catarro, resfriado
the flu                    →  gripe
a runny nose               →  nariz que moquea
a blocked / stuffy nose    →  nariz tapada
a rash                     →  sarpullido, erupción
dizziness / feeling dizzy  →  mareo
nausea / feeling sick      →  náuseas
vomiting                   →  vómitos
diarrhoea                  →  diarrea
constipation               →  estreñimiento
swelling                   →  hinchazón
bruise                     →  moratón
cut                        →  corte
blister                    →  ampolla
sunburn                    →  quemadura solar
allergy                    →  alergia


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CÓMO DESCRIBIR SÍNTOMAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"I feel terrible / awful / unwell."       →  Me encuentro fatal / muy mal.
"I don't feel well."                      →  No me encuentro bien.
"I've had a headache since this morning." →  Llevo con dolor de cabeza desde esta mañana.
"I've been coughing all night."           →  He estado tosiendo toda la noche.
"I have a temperature of 38.5."          →  Tengo 38.5 de fiebre.
"I'm allergic to penicillin."            →  Soy alérgico/a a la penicilina.
"I've been feeling dizzy since yesterday."  →  Llevo mareado/a desde ayer.
"The pain is here, on my right side."    →  El dolor es aquí, en el lado derecho.
"It's a sharp pain." / "It's a dull ache."  →  Es un dolor agudo / Es un dolor sordo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENFERMEDADES Y PROBLEMAS DE SALUD COMUNES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

a cold             →  un resfriado
the flu / influenza →  la gripe
food poisoning     →  intoxicación alimentaria
an infection       →  una infección
a broken bone      →  un hueso roto
high blood pressure →  tensión alta
diabetes           →  diabetes
asthma             →  asma
hay fever          →  alergia al polen


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIÁLOGO — EN LA CONSULTA DEL MÉDICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Doctor:   "Good morning. What seems to be the problem?"
Patient:  "Good morning. I've had a terrible headache for two days and I feel dizzy."
Doctor:   "I see. Do you have a temperature?"
Patient:  "Yes, I took it this morning — it was 38.2."
Doctor:   "Any other symptoms? Cough? Sore throat?"
Patient:  "I have a slightly sore throat, yes."
Doctor:   "Have you been feeling sick?"
Patient:  "A little, yes — especially in the morning."
Doctor:   "Okay. Are you allergic to any medication?"
Patient:  "No, I'm not."
Doctor:   "I think you have a viral infection. I'll prescribe you some rest and plenty of fluids. If you don't improve in three days, come back."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — "I AM SICK" VS. "I FEEL SICK"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En inglés, "sick" puede tener dos significados:

"I am sick."     →  Estoy enfermo/a (AmE, equivale a "ill" en BrE)
"I feel sick."   →  Tengo ganas de vomitar / Me noto mal (muy frecuente)

En inglés británico, "ill" es el término más neutro para "enfermo/a":
"I've been ill all week."  →  He estado enfermo/a toda la semana.

En inglés americano, "sick" funciona en ambos sentidos.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Describe estos síntomas en inglés:

1. Llevas dos días con fiebre.
2. Tienes la nariz tapada y mucho moco.
3. Te duele el lado izquierdo del estómago.
4. Llevas una semana con tos.
5. Eres alérgico/a a los antiinflamatorios.

Posibles respuestas:
1. I've had a temperature for two days.
2. I have a blocked nose and a runny nose.
3. I have a pain on the left side of my stomach.
4. I've been coughing for a week. / I've had a cough for a week.
5. I'm allergic to anti-inflammatory medication.`;

// ─────────────────────────────────────────────────────────────────────────────
// L3.4 — Should, Must, Have To — Advice and Obligation
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L34 = `Cuando el médico te da indicaciones, cuando lees prospectos o cuando un amigo te da consejos sobre tu salud, necesitas entender tres verbos modales clave: SHOULD, MUST y HAVE TO. Cada uno tiene un matiz diferente.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SHOULD — CONSEJO O RECOMENDACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SHOULD expresa una recomendación o consejo. El hablante cree que es una buena idea, pero no es una obligación estricta.

Forma: Sujeto + SHOULD + infinitivo (sin TO)

"You should rest for a few days."      →  Deberías descansar unos días.
"You should drink more water."         →  Deberías beber más agua.
"She should see a doctor."             →  Debería ver a un médico.
"I think you should take painkillers." →  Creo que deberías tomar analgésicos.

Negativa: SHOULDN'T

"You shouldn't smoke."                 →  No deberías fumar.
"He shouldn't go to work today."       →  No debería ir al trabajo hoy.
"You shouldn't eat before the test."   →  No deberías comer antes del análisis.

Pregunta: Should + sujeto + infinitivo?

"Should I take these tablets with food?"  →  ¿Debería tomar estas pastillas con comida?
"What should I do?"                       →  ¿Qué debería hacer?


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MUST — OBLIGACIÓN FUERTE (SUBJETIVA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MUST expresa una obligación fuerte que viene de quien habla: una decisión personal, una regla importante o algo urgente.

"You must finish the antibiotics even if you feel better."
→  Debes terminar los antibióticos aunque te sientas mejor.

"I must make an appointment today — this can't wait."
→  Tengo que pedir cita hoy — esto no puede esperar.

"You mustn't drink alcohol with this medication."
→  No debes tomar alcohol con esta medicación.

Mustn't expresa PROHIBICIÓN — es más fuerte que shouldn't.

"You mustn't drive after taking these pills." → Está prohibido conducir con estas pastillas.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HAVE TO — OBLIGACIÓN EXTERNA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HAVE TO expresa una obligación que viene de fuera: reglas, leyes, normas, circunstancias.

"I have to take this medicine three times a day." (la receta lo indica)
→  Tengo que tomar esta medicina tres veces al día.

"You have to show your insurance card at reception."
→  Tienes que mostrar tu tarjeta de seguro en recepción.

"She has to go back for a follow-up appointment."
→  Tiene que volver para una cita de seguimiento.

Negativa: DON'T HAVE TO → no es necesario (pero puedes si quieres)

"You don't have to come in tomorrow if you feel better."
→  No tienes que venir mañana si te encuentras mejor. (no es obligatorio)

DON'T HAVE TO ≠ MUSTN'T

"You don't have to wear a mask." → No es obligatorio llevar mascarilla.
"You mustn't smoke here."        → Está prohibido fumar aquí.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESUMEN COMPARATIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

should     →  consejo, recomendación          ("es una buena idea")
must       →  obligación fuerte, decisión propia ("es muy importante")
have to    →  obligación externa, regla          ("las circunstancias lo exigen")
shouldn't  →  consejo en negativo              ("no es buena idea")
mustn't    →  prohibición fuerte               ("está prohibido")
don't have to → no es necesario               ("no es obligatorio")


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EN CONTEXTO — CONSEJOS MÉDICOS REALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Doctor:   "You have a bacterial infection. You have to take these antibiotics twice a day for seven days."
Patient:  "Should I take them with food?"
Doctor:   "Yes, you should. And you mustn't drink alcohol while you're taking them."
Patient:  "Do I have to come back?"
Doctor:   "You don't have to, but if you don't feel better in five days, you should call us."
Patient:  "Should I stay in bed?"
Doctor:   "You should rest as much as possible. You shouldn't go to work tomorrow."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUNTO DE ERROR — "MUST TO" Y "SHOULD TO"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los verbos modales NO van seguidos de TO (salvo "have to" que es diferente):

❌ "You must to rest."
✅ "You must rest."

❌ "She should to see a doctor."
✅ "She should see a doctor."

❌ "I must to take these tablets."
✅ "I must take these tablets." / "I have to take these tablets."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRACTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige el modal más apropiado y completa la frase:

1. The doctor says I _______ (should / must / have to) take three tablets a day. It's on the prescription.
2. You _______ (shouldn't / mustn't / don't have to) take painkillers on an empty stomach — it's bad for your stomach.
3. You _______ (should / mustn't / don't have to) drink alcohol with this medication — it's dangerous.
4. I _______ (must / should / have to) eat more vegetables. I really need to change my diet.
5. You _______ (don't have to / mustn't) come to the appointment if you already feel better.

Respuestas (con justificación):
1. have to (regla externa — la receta)
2. shouldn't (consejo / recomendación en negativo)
3. mustn't (prohibición — peligroso)
4. must / should (ambos válidos — obligación personal o consejo fuerte)
5. don't have to (no es necesario — no está prohibido)`;

// ─────────────────────────────────────────────────────────────────────────────
// L3.5 — Health & Body — Quiz
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_L35 = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE A — VOCABULARIO DEL CUERPO Y LA SALUD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Cómo se dice en inglés?

1. Dolor de cabeza:        ___________
2. Fiebre:                 ___________
3. Nariz tapada:           ___________
4. Farmacia:               ___________
5. Cita médica:            ___________

Respuestas:
1. a headache  2. a temperature / a fever  3. a blocked / stuffy nose
4. a chemist / pharmacy  5. an appointment


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE B — DESCRIBIR SÍNTOMAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Traduce al inglés:

1. Me duele la espalda.
2. He tenido tos desde el lunes.
3. Soy alérgico/a a la penicilina.
4. Me encuentro fatal hoy.
5. Tengo dolor en el lado derecho.

Posibles respuestas:
1. My back hurts. / I have a backache.
2. I've had a cough since Monday.
3. I'm allergic to penicillin.
4. I feel terrible today.
5. I have a pain on the right side.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE C — MODALES: SHOULD / MUST / HAVE TO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elige el modal correcto para cada situación:

1. El médico te ha dicho que tienes que tomar pastillas dos veces al día. (regla externa)
   → You _______ take these tablets twice a day.

2. Dar un consejo a un amigo que trabaja demasiado.
   → You _______ rest more. You look exhausted.

3. Advertir de que el alcohol y los antibióticos no se pueden mezclar. (prohibición)
   → You _______ drink alcohol with antibiotics.

4. La cita no es obligatoria si el paciente ya se encuentra bien.
   → You _______ come back if you feel better.

5. Es una decisión personal — quieres cambiar de hábitos.
   → I _______ eat healthier. I really need to change.

Respuestas:
1. have to  2. should  3. mustn't  4. don't have to  5. must / should


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE D — COMPRENSIÓN LECTORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lee el prospecto y responde:

"PARACETAMOL 500mg — PATIENT INFORMATION LEAFLET
Take one or two tablets every four to six hours. Do not take more than eight tablets in twenty-four hours. You should take tablets with water. You mustn't take this medicine with other painkillers. You don't have to take them with food, but you should if you have a sensitive stomach. If your symptoms don't improve after three days, you must see your doctor."

Preguntas:
1. ¿Cuántas pastillas se pueden tomar en 24 horas como máximo?
2. ¿Se pueden tomar con otros analgésicos?
3. ¿Es obligatorio comerlas con comida?
4. ¿Qué debes hacer si los síntomas no mejoran en tres días?

Respuestas:
1. Eight tablets. / No more than eight.
2. No, you mustn't. / No, it's not allowed.
3. No, you don't have to, but you should if you have a sensitive stomach.
4. You must see your doctor.`;

// ─────────────────────────────────────────────────────────────────────────────
// Assessment U3
// 10 preguntas × 1 punto = 10 pts totales. passingScore 80 → 8/10.
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENT_U3 = {
  title:        'Health & Body — Unit 3 Assessment',
  description:  'Imagina que no te encuentras bien y tienes que ir al médico. Escribe el diálogo completo: al menos seis intervenciones, describiendo tus síntomas y siguiendo los consejos del médico con should, must y have to.',
  passingScore: 80,
  maxAttempts:  3,
  questions: [
    {
      text:         '¿Cómo se dice "dolor de cabeza" en inglés?',
      options:      ['a headpain', 'a headache', 'a head hurt', 'a head cold'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '¿Qué significa "I have a runny nose"?',
      options:      ['Tengo la nariz tapada.', 'Me duele la nariz.', 'Tengo moco / la nariz que moquea.', 'Tengo sangre por la nariz.'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Qué es un "GP" en inglés?',
      options:      ['Un especialista', 'Un médico de cabecera', 'Un enfermero', 'Un farmacéutico'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"You _______ smoke here." ¿Qué modal indica PROHIBICIÓN estricta?',
      options:      ['should not', 'must', "don't have to", "mustn't"],
      correctIndex: 3,
      points:       1,
    },
    {
      text:         '"You _______ come back tomorrow." ¿Qué modal significa que NO ES NECESARIO (pero puedes si quieres)?',
      options:      ["mustn't", "shouldn't", "don't have to", 'must not'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Qué frase describe mejor un consejo médico (recomendación, no obligación)?',
      options:      ['You must drink water.', 'You have to drink water.', 'You should drink more water.', 'You must to drink water.'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál es la forma correcta de decir "My head hurts" con la estructura -ache?',
      options:      ['I have a head-pain.', 'I have a headache.', 'I have a head hurting.', 'My head aches pain.'],
      correctIndex: 1,
      points:       1,
    },
    {
      text:         '"Should I take these tablets with food?" es...',
      options:      ['Una obligación.', 'Una prohibición.', 'Una pregunta pidiendo consejo o recomendación.', 'Una pregunta sobre normas externas.'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Cuál de estas palabras NO es una parte del cuerpo?',
      options:      ['elbow', 'ankle', 'blister', 'wrist'],
      correctIndex: 2,
      points:       1,
    },
    {
      text:         '¿Qué error hay en esta frase? "You should to rest more."',
      options:      ['El sujeto es incorrecto.', '"Should" no puede usarse con "rest".', '"Should" no va seguido de "to".', 'No hay ningún error.'],
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
    title:            'Health & Body',
    order:            3,
    sequentialUnlock: true,
  });

  await Promise.all([

    // L3.1 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 1 }, {
      unitId:   unit._id,
      courseId,
      title:    'The Human Body — Parts and Functions',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L31,
      duration: 15,
      order:    1,
    }),

    // L3.2 — VIDEO
    // Canal recomendado: BBC Learning English
    // Búsqueda: "at the doctor's English conversation BBC Learning English"
    // PLACEHOLDER — sustituir por URL definitiva en fase de curación de contenido
    upsert(Lesson, { unitId: unit._id, order: 2 }, {
      unitId:   unit._id,
      courseId,
      title:    "Watch: At the Doctor's",
      type:     LESSON_TYPES.VIDEO,
      videoUrl: 'https://www.youtube.com/embed/placeholder-a2-u3-l2',
      duration: 10,
      order:    2,
    }),

    // L3.3 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 3 }, {
      unitId:   unit._id,
      courseId,
      title:    'I Feel Terrible — Symptoms and Illnesses',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L33,
      duration: 20,
      order:    3,
    }),

    // L3.4 — TEXT
    upsert(Lesson, { unitId: unit._id, order: 4 }, {
      unitId:   unit._id,
      courseId,
      title:    'Should, Must, Have To — Advice and Obligation',
      type:     LESSON_TYPES.TEXT,
      content:  CONTENT_L34,
      duration: 20,
      order:    4,
    }),

    // L3.5 — QUIZ
    upsert(Lesson, { unitId: unit._id, order: 5 }, {
      unitId:   unit._id,
      courseId,
      title:    'Health & Body — Quiz',
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
