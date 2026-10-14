const video = document.getElementById("lessonVideo");
const overlay = document.getElementById("challengeOverlay");
const finalOverlay = document.getElementById("finalOverlay");
const answers = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const continueBtn = document.getElementById("continueBtn");
const restartBtn = document.getElementById("restartBtn");
const xpEl = document.getElementById("xp");
const correctEl = document.getElementById("correctCount");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const progressPercent = document.getElementById("progressPercent");
const missionCount = document.getElementById("missionCount");
const missionTitle = document.getElementById("missionTitle");
const missionDescription = document.getElementById("missionDescription");
const timerEl = document.getElementById("timer");

const challenges = [
  {
    time: 116,
    title: "Identifica el sistema",
    icon: "🔎",
    question: "En el ejemplo inicial, ¿qué tipo de sistema se está estudiando?",
    options: ["SISO (una entrada y una salida)", "MIMO (múltiples entradas y salidas)", "Un sistema sin entrada"],
    answer: 0,
    explanation: "Correcto. SISO significa Single Input, Single Output: una entrada y una salida.",
    xp: 100
  },
  {
    time: 300,
    title: "El objetivo de Laplace",
    icon: "🎯",
    question: "¿Qué busca facilitar la transformada de Laplace en esta clase?",
    options: ["Trabajar el sistema en el dominio de Laplace", "Eliminar todas las variables del problema", "Convertir cualquier sistema en una imagen"],
    answer: 0,
    explanation: "La clase plantea pasar del dominio del tiempo al dominio de Laplace para trabajar el sistema de otra manera.",
    xp: 100
  },
  {
    time: 520,
    title: "Reconoce la transformación",
    icon: "🧠",
    question: "¿Cuál de estas expresiones corresponde a una transformada básica mostrada en la tabla?",
    options: ["L{1} = 1/s", "L{1} = s", "L{1} = 0"],
    answer: 0,
    explanation: "La transformada de Laplace de la función constante 1 es 1/s.",
    xp: 150
  },
  {
    time: 690,
    title: "Funciones trigonométricas",
    icon: "〰️",
    question: "Para una función seno, ¿qué forma aparece en la tabla de transformadas?",
    options: ["ω/(s² + ω²)", "s/(s² + ω²)", "1/(s + ω)"],
    answer: 0,
    explanation: "Para sin(ωt), la transformada es ω/(s² + ω²).",
    xp: 150
  },
  {
    time: 880,
    title: "Piensa como ingeniero",
    icon: "⚙️",
    question: "¿Para qué se presenta esta herramienta en el contexto de sistemas lineales?",
    options: ["Para analizar y trabajar con sistemas lineales", "Para reemplazar todos los experimentos físicos", "Para evitar usar funciones matemáticas"],
    answer: 0,
    explanation: "La clase conecta Laplace con el análisis de sistemas lineales y sus funciones.",
    xp: 150
  },
  {
    time: 1080,
    title: "Desafío final",
    icon: "🏆",
    question: "¿Qué cambio de dominio es la idea central presentada en esta clase?",
    options: ["Del dominio del tiempo al dominio de Laplace", "Del dominio de Laplace al dominio del tiempo únicamente", "Del dominio de la imagen al dominio del sonido"],
    answer: 0,
    explanation: "¡Exacto! Esa es la idea central que se introduce y desarrolla en el video.",
    xp: 200
  }
];

let current = 0;
let xp = 0;
let correct = 0;
let challengeOpen = false;
let answered = false;
let timer = null;
let seconds = 20;

function updateDashboard() {
  const done = current;
  const pct = Math.round((done / challenges.length) * 100);
  progressBar.style.width = `${pct}%`;
  progressText.textContent = `Misión ${done} de ${challenges.length}`;
  progressPercent.textContent = `${pct}%`;
  xpEl.textContent = xp;
  correctEl.textContent = correct;
  missionCount.textContent = `${String(Math.min(current + 1, challenges.length)).padStart(2,"0")} / ${String(challenges.length).padStart(2,"0")}`;
}

function showChallenge(c) {
  challengeOpen = true;
  answered = false;
  seconds = 20;
  clearInterval(timer);
  timerEl.textContent = seconds;

  document.getElementById("challengeTitle").textContent = c.title;
  document.getElementById("challengeQuestion").textContent = c.question;
  document.getElementById("challengeIcon").textContent = c.icon;
  feedback.textContent = "";
  feedback.className = "feedback";
  continueBtn.classList.add("hidden");
  answers.innerHTML = "";

  c.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer";
    btn.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    btn.addEventListener("click", () => chooseAnswer(index));
    answers.appendChild(btn);
  });

  missionTitle.textContent = c.title;
  missionDescription.textContent = "Responde el reto para continuar con la clase.";
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");

  timer = setInterval(() => {
    seconds--;
    timerEl.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(timer);
      if (!answered) chooseAnswer(-1);
    }
  }, 1000);
}

function chooseAnswer(index) {
  if (answered) return;
  answered = true;
  clearInterval(timer);

  const c = challenges[current];
  const buttons = [...answers.querySelectorAll(".answer")];
  buttons.forEach((b, i) => {
    b.disabled = true;
    if (i === c.answer) b.classList.add("correct");
    if (i === index && index !== c.answer) b.classList.add("wrong");
  });

  if (index === c.answer) {
    correct++;
    xp += c.xp;
    feedback.textContent = `✓ ${c.explanation} +${c.xp} XP`;
    feedback.className = "feedback good";
  } else {
    feedback.textContent = index === -1
      ? `⏱️ Se acabó el tiempo. ${c.explanation}`
      : `✕ No esta vez. ${c.explanation}`;
    feedback.className = "feedback bad";
  }

  xpEl.textContent = xp;
  correctEl.textContent = correct;
  continueBtn.classList.remove("hidden");
}

continueBtn.addEventListener("click", () => {
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
  challengeOpen = false;
  current++;
  updateDashboard();

  if (current >= challenges.length) {
    finish();
    return;
  }

  missionTitle.textContent = "Sigue observando";
  missionDescription.textContent = "El siguiente reto aparecerá automáticamente durante la explicación.";
  video.play();
});

function finish() {
  video.pause();
  document.getElementById("finalXP").textContent = xp;
  document.getElementById("finalCorrect").textContent = `${correct}/${challenges.length}`;
  document.getElementById("finalMessage").textContent =
    correct >= 5
      ? "Excelente trabajo. Completaste todos los retos de esta clase."
      : "Actividad completada. Puedes repetirla para reforzar los conceptos.";
  finalOverlay.classList.remove("hidden");
  finalOverlay.setAttribute("aria-hidden", "false");
  progressBar.style.width = "100%";
  progressText.textContent = `Misión ${challenges.length} de ${challenges.length}`;
  progressPercent.textContent = "100%";
}

restartBtn.addEventListener("click", () => {
  current = 0;
  xp = 0;
  correct = 0;
  challengeOpen = false;
  clearInterval(timer);
  finalOverlay.classList.add("hidden");
  finalOverlay.setAttribute("aria-hidden", "true");
  video.currentTime = 0;
  updateDashboard();
  missionTitle.textContent = "Prepárate";
  missionDescription.textContent = "Mira la clase y presta atención: aparecerán retos durante la explicación.";
  video.play();
});

video.addEventListener("timeupdate", () => {
  if (challengeOpen || current >= challenges.length) return;
  const c = challenges[current];
  if (video.currentTime >= c.time) {
    video.pause();
    showChallenge(c);
  }
});

video.addEventListener("ended", () => {
  if (current < challenges.length && !challengeOpen) {
    current = challenges.length;
    updateDashboard();
    finish();
  }
});

updateDashboard();
