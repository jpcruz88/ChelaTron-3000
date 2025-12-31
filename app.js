const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

const topicInput = document.getElementById('topic');
const countInput = document.getElementById('question-count');
const timeInput = document.getElementById('question-time');
const chelaToggle = document.getElementById('chela-personality');
const generateButton = document.getElementById('generate');
const thinkingStatus = document.getElementById('thinking');
const previewCard = document.getElementById('question-preview');
const questionList = document.getElementById('question-list');
const regenerateButton = document.getElementById('regenerate');
const acceptButton = document.getElementById('accept');
const waitingRoom = document.getElementById('waiting-room');
const roomCodeSpan = document.getElementById('room-code');
const playerList = document.getElementById('player-list');
const chelaMessage = document.getElementById('chela-message');
const startGameButton = document.getElementById('start-game');
const hostGame = document.getElementById('host-game');
const hostTimer = document.getElementById('host-timer');
const hostQuestion = document.getElementById('host-question');
const hostOptions = document.getElementById('host-options');
const hostRanking = document.getElementById('host-ranking');
const hostFeedback = document.getElementById('host-feedback');
const nextQuestionButton = document.getElementById('next-question');

const joinCard = document.getElementById('player-join');
const joinCodeInput = document.getElementById('join-code');
const joinNameInput = document.getElementById('player-name');
const joinButton = document.getElementById('join-game');
const joinError = document.getElementById('join-error');
const playerGame = document.getElementById('player-game');
const playerQuestionTitle = document.getElementById('player-question-title');
const playerTimer = document.getElementById('player-timer');
const playerQuestion = document.getElementById('player-question');
const playerOptions = document.getElementById('player-options');
const playerResult = document.getElementById('player-result');

const chelaLines = [
  '“Estoy enfriando las preguntas…”',
  '“Se vienen las buenas, papá.”',
  '“¿Listos para destapar respuestas?”',
  '“La chela no espera, tú tampoco.”',
];

let questions = [];
let roomCode = '';
let players = [];
let currentQuestionIndex = 0;
let timer = null;
let timeRemaining = 0;
let answersLocked = false;
let chelaEnabled = true;

const state = {
  isGameActive: false,
  responses: new Map(),
};

const randomId = () => Math.random().toString(36).slice(2, 6).toUpperCase();

const generateQuestionSet = (topic, count) => {
  const topics = topic || 'Cultura Pop Chelera';
  return Array.from({ length: count }, (_, index) => {
    const optionBase = [
      `Dato ${index + 1}A sobre ${topics}`,
      `Dato ${index + 1}B sobre ${topics}`,
      `Dato ${index + 1}C sobre ${topics}`,
      `Dato ${index + 1}D sobre ${topics}`,
    ];
    return {
      id: `${index + 1}`,
      text: `¿Cuál es el dato más Chela de ${topics}? (Pregunta ${index + 1})`,
      options: optionBase,
      correctIndex: Math.floor(Math.random() * 4),
    };
  });
};

const renderQuestions = () => {
  questionList.innerHTML = '';
  questions.forEach((question, index) => {
    const item = document.createElement('div');
    item.className = 'question-item';
    item.innerHTML = `
      <h4>Pregunta ${index + 1}</h4>
      <p>${question.text}</p>
      <ol>
        ${question.options
          .map((option, idx) => `
            <li>${option}${idx === question.correctIndex ? ' ✅' : ''}</li>
          `)
          .join('')}
      </ol>
    `;
    questionList.appendChild(item);
  });
};

const setChelaMessage = () => {
  if (!chelaEnabled) {
    chelaMessage.textContent = '“Modo serio activado. Igual te gano.”';
    return;
  }
  const line = chelaLines[Math.floor(Math.random() * chelaLines.length)];
  chelaMessage.textContent = line;
};

const resetGameState = () => {
  players = [];
  currentQuestionIndex = 0;
  state.responses.clear();
  state.isGameActive = false;
  hostRanking.classList.add('hidden');
  hostFeedback.textContent = '';
  playerResult.textContent = '';
  nextQuestionButton.classList.add('hidden');
};

const updatePlayerList = () => {
  playerList.innerHTML = '';
  if (players.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'Aún no hay jugadores conectados.';
    playerList.appendChild(empty);
    return;
  }
  players.forEach((player) => {
    const item = document.createElement('li');
    item.textContent = `${player.name} · ${player.score} pts`;
    playerList.appendChild(item);
  });
};

const showHostGameQuestion = () => {
  const question = questions[currentQuestionIndex];
  hostQuestion.textContent = question.text;
  hostOptions.innerHTML = '';
  question.options.forEach((option) => {
    const div = document.createElement('div');
    div.className = 'option is-locked';
    div.textContent = option;
    hostOptions.appendChild(div);
  });
  hostFeedback.textContent = chelaEnabled
    ? '“No se duerman, que la chela marca el tiempo.”'
    : 'Tiempo en marcha. Responde rápido.';
};

const showPlayerQuestion = () => {
  const question = questions[currentQuestionIndex];
  playerQuestionTitle.textContent = `Pregunta ${currentQuestionIndex + 1}`;
  playerQuestion.textContent = question.text;
  playerOptions.innerHTML = '';
  answersLocked = false;
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'option';
    button.textContent = option;
    button.addEventListener('click', () => handleAnswer(index));
    playerOptions.appendChild(button);
  });
  playerResult.textContent = '';
};

const startTimer = () => {
  clearInterval(timer);
  timeRemaining = Number(timeInput.value) || 20;
  hostTimer.textContent = timeRemaining;
  playerTimer.textContent = timeRemaining;
  timer = setInterval(() => {
    timeRemaining -= 1;
    hostTimer.textContent = timeRemaining;
    playerTimer.textContent = timeRemaining;
    if (timeRemaining <= 0) {
      clearInterval(timer);
      finalizeQuestion();
    }
  }, 1000);
};

const handleAnswer = (selectedIndex) => {
  if (answersLocked) return;
  answersLocked = true;
  const question = questions[currentQuestionIndex];
  const player = players[0];
  if (!player) return;

  const isCorrect = selectedIndex === question.correctIndex;
  const timeBonus = Math.max(timeRemaining, 0);
  const points = isCorrect ? 100 + timeBonus * 5 : 0;

  player.score += points;
  player.answers.push({
    questionId: question.id,
    selectedIndex,
    isCorrect,
    points,
  });

  state.responses.set(player.name, { selectedIndex, isCorrect, points });

  playerOptions.querySelectorAll('button').forEach((button) => {
    button.classList.add('is-locked');
    button.disabled = true;
  });

  playerResult.textContent = isCorrect
    ? `✅ Correcto · +${points} pts`
    : '❌ Incorrecto · 0 pts';
};

const finalizeQuestion = () => {
  const question = questions[currentQuestionIndex];
  const totalResponses = players.length;
  const correctResponses = players.filter((player) =>
    player.answers.some((answer) => answer.questionId === question.id && answer.isCorrect)
  ).length;
  const accuracy = totalResponses === 0 ? 0 : Math.round((correctResponses / totalResponses) * 100);

  hostFeedback.textContent = `Respuesta correcta: ${question.options[question.correctIndex]} · ${accuracy}% de aciertos`;

  const ranking = [...players].sort((a, b) => b.score - a.score);
  hostRanking.classList.remove('hidden');
  hostRanking.innerHTML = `
    <strong>Ranking Top 5</strong>
    <ol>
      ${ranking.slice(0, 5).map((player) => `<li>${player.name} — ${player.score} pts</li>`).join('')}
    </ol>
  `;

  nextQuestionButton.classList.remove('hidden');
  state.isGameActive = false;
};

const showFinalResults = () => {
  const ranking = [...players].sort((a, b) => b.score - a.score);
  hostQuestion.textContent = '¡Partida finalizada!';
  hostOptions.innerHTML = '';
  hostFeedback.textContent = chelaEnabled
    ? `Ganador: ${ranking[0]?.name || 'Nadie'} · “La chela manda.”`
    : `Ganador: ${ranking[0]?.name || 'Nadie'}`;
  hostRanking.classList.remove('hidden');
  hostRanking.innerHTML = `
    <strong>Ranking completo</strong>
    <ol>
      ${ranking.map((player) => `<li>${player.name} — ${player.score} pts</li>`).join('')}
    </ol>
  `;
};

const startQuestion = () => {
  if (!questions[currentQuestionIndex]) return;
  state.responses.clear();
  state.isGameActive = true;
  showHostGameQuestion();
  showPlayerQuestion();
  startTimer();
  nextQuestionButton.classList.add('hidden');
};

const handleNextQuestion = () => {
  currentQuestionIndex += 1;
  if (currentQuestionIndex >= questions.length) {
    clearInterval(timer);
    showFinalResults();
    nextQuestionButton.classList.add('hidden');
    return;
  }
  startQuestion();
};

const handleGenerate = () => {
  previewCard.classList.add('hidden');
  waitingRoom.classList.add('hidden');
  hostGame.classList.add('hidden');
  resetGameState();
  chelaEnabled = chelaToggle.checked;
  thinkingStatus.classList.remove('hidden');

  setTimeout(() => {
    const count = Number(countInput.value) || 5;
    questions = generateQuestionSet(topicInput.value, count);
    renderQuestions();
    thinkingStatus.classList.add('hidden');
    previewCard.classList.remove('hidden');
  }, 1200);
};

const handleAccept = () => {
  roomCode = randomId();
  roomCodeSpan.textContent = roomCode;
  previewCard.classList.add('hidden');
  waitingRoom.classList.remove('hidden');
  setChelaMessage();
};

const handleRegenerate = () => {
  handleGenerate();
};

const handleJoin = () => {
  const code = joinCodeInput.value.trim().toUpperCase();
  const name = joinNameInput.value.trim();
  joinError.classList.add('hidden');

  if (!code || !name) {
    joinError.textContent = 'Completa el código y tu nombre.';
    joinError.classList.remove('hidden');
    return;
  }

  if (code !== roomCode || !roomCode) {
    joinError.textContent = 'Código inválido. Pide al host el código correcto.';
    joinError.classList.remove('hidden');
    return;
  }

  if (players.some((player) => player.name.toLowerCase() === name.toLowerCase())) {
    joinError.textContent = 'Ese nombre ya está en la sala.';
    joinError.classList.remove('hidden');
    return;
  }

  const player = { name, score: 0, answers: [] };
  players.push(player);
  updatePlayerList();

  joinCard.classList.add('hidden');
  playerGame.classList.remove('hidden');
};

const handleStartGame = () => {
  if (!questions.length) return;
  waitingRoom.classList.add('hidden');
  hostGame.classList.remove('hidden');
  currentQuestionIndex = 0;
  startQuestion();
};

const handleTabClick = (event) => {
  const target = event.currentTarget.dataset.tab;
  tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.tab === target));
  panels.forEach((panel) => panel.classList.toggle('is-active', panel.id === target));
};

const bootstrapDemoPlayer = () => {
  if (players.length === 0) {
    players = [{ name: 'Jugador Demo', score: 0, answers: [] }];
    updatePlayerList();
  }
};

tabs.forEach((tab) => tab.addEventListener('click', handleTabClick));

generateButton.addEventListener('click', handleGenerate);
regenerateButton.addEventListener('click', handleRegenerate);
acceptButton.addEventListener('click', handleAccept);
startGameButton.addEventListener('click', () => {
  bootstrapDemoPlayer();
  handleStartGame();
});
nextQuestionButton.addEventListener('click', handleNextQuestion);
joinButton.addEventListener('click', handleJoin);

window.addEventListener('beforeunload', () => {
  clearInterval(timer);
});
