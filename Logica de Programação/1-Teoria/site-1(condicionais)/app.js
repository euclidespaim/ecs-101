// Estado global da aplicação
const STATE = {
  currentTab: 'home',
  progress: {
    theoryRead: [], // IDs dos conceitos lidos
    quizCompleted: false,
    quizScore: 0,
    completedLevels: [] // Níveis de desafios completados (1 a 5)
  },
  quiz: {
    currentQuestionIndex: 0,
    answers: [], // Respostas dadas
    hasAnsweredCurrent: false
  },
  challenges: {
    currentLevel: 1,
    userCodes: {} // Guarda o código digitado de cada nível
  },
  simulator: {
    // Valores iniciais do simulador
    nota: 7.5,
    chuva: false,
    energia: 80
  }
};

// Inicialização da Página
document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  setupNavigation();
  setupTheoryInteractivity();
  setupSimulator();
  setupQuiz();
  setupChallenges();
  updateProgressUI();
});

// --- PERSISTÊNCIA DE PROGRESSO (LOCALSTORAGE) ---
function loadProgress() {
  const saved = localStorage.getItem('python_condicionais_progress');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      STATE.progress = {
        theoryRead: parsed.theoryRead || [],
        quizCompleted: parsed.quizCompleted || false,
        quizScore: parsed.quizScore || 0,
        completedLevels: parsed.completedLevels || [],
        studentName: parsed.studentName || "",
        quizAttempts: parsed.quizAttempts || 0,
        challengeAttempts: parsed.challengeAttempts || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    } catch (e) {
      console.error("Erro ao ler progresso do localStorage", e);
    }
  } else {
    STATE.progress = {
      theoryRead: [],
      quizCompleted: false,
      quizScore: 0,
      completedLevels: [],
      studentName: "",
      quizAttempts: 0,
      challengeAttempts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
}

function saveProgress() {
  localStorage.setItem('python_condicionais_progress', JSON.stringify(STATE.progress));
  updateProgressUI();
}

function resetProgress() {
  if (confirm("Tem certeza que deseja recomeçar toda a trilha? Seu progresso será apagado.")) {
    STATE.progress = {
      theoryRead: [],
      quizCompleted: false,
      quizScore: 0,
      completedLevels: [],
      studentName: "",
      quizAttempts: 0,
      challengeAttempts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
    saveProgress();
    // Reinicia estados locais
    STATE.quiz.currentQuestionIndex = 0;
    STATE.quiz.answers = [];
    STATE.quiz.hasAnsweredCurrent = false;
    STATE.challenges.userCodes = {};
    
    // Atualiza UIs
    setupQuiz();
    setupChallenges();
    const nameInput = document.getElementById('student-name-input');
    if (nameInput) nameInput.value = "";
    renderPerformanceReport();
    switchTab('home');
    alert("Progresso reiniciado com sucesso!");
  }
}

function updateProgressUI() {
  // Calcula porcentagem total de progresso
  // Teoria (4 partes) + Quiz (1 parte) + Desafios (5 partes) = 10 itens no total
  const theoryWeight = STATE.progress.theoryRead.length;
  const quizWeight = STATE.progress.quizCompleted ? 1 : 0;
  const challengeWeight = STATE.progress.completedLevels.length;
  
  const totalItems = 4 + 1 + 5;
  const completedItems = theoryWeight + quizWeight + challengeWeight;
  const percent = Math.round((completedItems / totalItems) * 100);
  
  // Atualiza barras de progresso
  const progressFills = document.querySelectorAll('.progress-fill');
  progressFills.forEach(fill => {
    fill.style.width = percent + '%';
  });
  
  const percentText = document.getElementById('progress-percent-text');
  if (percentText) {
    percentText.innerText = `${percent}% concluído`;
  }
  
  // Atualiza os badges dos desafios no Início
  for (let lvl = 1; lvl <= 5; lvl++) {
    const badge = document.getElementById(`badge-lvl-${lvl}`);
    if (badge) {
      badge.className = 'level-badge';
      
      // Destaca se já completou
      if (STATE.progress.completedLevels.includes(lvl)) {
        badge.classList.add('unlocked');
        badge.innerHTML = `🌟<br>Nível ${lvl}`;
      } else if (lvl === 1 || STATE.progress.completedLevels.includes(lvl - 1)) {
        // Desbloqueado para jogar agora
        badge.classList.add('current');
        badge.innerHTML = `🎮<br>Nível ${lvl}`;
      } else {
        // Bloqueado
        badge.innerHTML = `🔒<br>Nível ${lvl}`;
      }
    }
  }

  // Banner de parabéns final se tudo estiver concluído
  const banner = document.getElementById('final-achievement-banner');
  if (banner) {
    if (completedItems === totalItems) {
      banner.style.display = 'flex';
    } else {
      banner.style.display = 'none';
    }
  }
  
  // Atualiza relatório dinamicamente se estiver visível
  renderPerformanceReport();
}

// --- NAVEGAÇÃO ENTRE ABAS ---
function setupNavigation() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
}

function switchTab(tabId) {
  STATE.currentTab = tabId;
  
  // Atualiza botões da barra
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Atualiza painéis de conteúdo
  document.querySelectorAll('.tab-content').forEach(content => {
    if (content.id === `${tabId}-tab`) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });

  // Ações específicas ao abrir abas
  if (tabId === 'challenges') {
    // Recarrega o editor do desafio ativo
    loadChallenge(STATE.challenges.currentLevel);
  } else if (tabId === 'report') {
    renderPerformanceReport();
  }
}

// --- ABA TEORIA: FLUXOGRAMA INTERATIVO ---
function setupTheoryInteractivity() {
  const theoryTabs = document.querySelectorAll('.theory-tab-btn');
  theoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const conceptId = tab.getAttribute('data-concept');
      switchTheoryConcept(conceptId);
    });
  });
  
  // Carrega o primeiro conceito
  switchTheoryConcept('if');
}

function switchTheoryConcept(conceptId) {
  // Marca abas
  document.querySelectorAll('.theory-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-concept') === conceptId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Mostra conteúdo textual
  document.querySelectorAll('.theory-body-content').forEach(body => {
    if (body.id === `theory-content-${conceptId}`) {
      body.classList.add('active');
    } else {
      body.classList.remove('active');
    }
  });

  // Atualiza Fluxograma conforme o conceito
  renderTheoryFlowchart(conceptId);
  
  // Salva leitura
  if (!STATE.progress.theoryRead.includes(conceptId)) {
    STATE.progress.theoryRead.push(conceptId);
    saveProgress();
  }
}

function renderTheoryFlowchart(conceptId) {
  const container = document.getElementById('theory-flowchart-area');
  if (!container) return;
  
  let html = '';
  
  if (conceptId === 'if') {
    html = `
      <div class="flowchart-container">
        <div class="flow-node active">Início do Programa</div>
        <div class="flow-arrow active"></div>
        <div class="flow-node diamond active">Condição Verdadeira?<br><em>Ex: energia > 50</em></div>
        
        <div class="flow-branch-container">
          <div class="flow-branch">
            <span class="branch-label yes">SIM</span>
            <div class="flow-arrow active"></div>
            <div class="flow-node active" style="border-color: var(--color-success)">Executa Bloco do IF<br><em>print("Pode correr!")</em></div>
          </div>
          <div class="flow-branch">
            <span class="branch-label no">NÃO</span>
            <div class="flow-arrow"></div>
            <div class="flow-node" style="color: var(--text-light); background-color: #F1F5F9;">Ignora Bloco<br><em>(Próxima instrução)</em></div>
          </div>
        </div>
      </div>
    `;
  } else if (conceptId === 'else') {
    html = `
      <div class="flowchart-container">
        <div class="flow-node active">Início do Programa</div>
        <div class="flow-arrow active"></div>
        <div class="flow-node diamond active">Condição do IF?<br><em>Ex: temperatura > 25</em></div>
        
        <div class="flow-branch-container">
          <div class="flow-branch">
            <span class="branch-label yes">SIM</span>
            <div class="flow-arrow active"></div>
            <div class="flow-node active" style="border-color: var(--color-success)">Executa Bloco do IF<br><em>print("Está calor.")</em></div>
          </div>
          <div class="flow-branch">
            <span class="branch-label no">NÃO</span>
            <div class="flow-arrow active"></div>
            <div class="flow-node active" style="border-color: var(--color-error)">Executa Bloco do ELSE<br><em>print("Está frio ou fresco.")</em></div>
          </div>
        </div>
      </div>
    `;
  } else if (conceptId === 'elif') {
    html = `
      <div class="flowchart-container">
        <div class="flow-node active">Início do Programa</div>
        <div class="flow-arrow active"></div>
        
        <div class="flow-node diamond active">Condição 1 (IF)?<br><em>Ex: nota >= 9.0</em></div>
        
        <div class="flow-branch-container" style="margin-bottom: 1rem;">
          <div class="flow-branch">
            <span class="branch-label yes">SIM</span>
            <div class="flow-arrow active"></div>
            <div class="flow-node active" style="border-color: var(--color-success)">Executa IF<br><em>print("Excelente!")</em></div>
          </div>
          <div class="flow-branch">
            <span class="branch-label no">NÃO</span>
            <div class="flow-arrow active"></div>
            
            <div class="flow-node diamond active" style="margin-top: 0.5rem;">Condição 2 (ELIF)?<br><em>Ex: nota >= 7.0</em></div>
            
            <div class="flow-branch-container">
              <div class="flow-branch">
                <span class="branch-label yes">SIM</span>
                <div class="flow-arrow active"></div>
                <div class="flow-node active" style="border-color: var(--color-success)">Executa ELIF<br><em>print("Muito bom!")</em></div>
              </div>
              <div class="flow-branch">
                <span class="branch-label no">NÃO</span>
                <div class="flow-arrow active"></div>
                <div class="flow-node active" style="border-color: var(--color-error)">Executa ELSE<br><em>print("Estudar mais!")</em></div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    `;
  } else if (conceptId === 'operators') {
    html = `
      <div style="display: flex; flex-direction: column; gap: 1rem; width: 100%; align-items: center; background: #FFFFFF; border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 1.5rem; box-shadow: var(--shadow-sm);">
        <h5 style="margin-bottom: 0.25rem; font-family: var(--font-title); color: var(--primary-navy); font-size: 1.05rem;">Calculadora Lógica Interativa</h5>
        <p style="font-size: 0.8rem; color: var(--text-light); text-align: center; margin-bottom: 0.5rem;">
          Clique para alternar o valor lógico de A e B e observe a saída dos operadores condicionais!
        </p>
        
        <div style="display: flex; gap: 2rem; margin-bottom: 0.75rem;">
          <div style="text-align: center;">
            <div style="font-size: 0.8rem; font-weight: bold; margin-bottom: 0.25rem; color: var(--text-light);">Valor de A</div>
            <button id="btn-val-a" class="btn-choice active" style="min-width: 80px; padding: 0.4rem 0.8rem; font-weight: bold;">True</button>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 0.8rem; font-weight: bold; margin-bottom: 0.25rem; color: var(--text-light);">Valor de B</div>
            <button id="btn-val-b" class="btn-choice active" style="min-width: 80px; padding: 0.4rem 0.8rem; font-weight: bold;">True</button>
          </div>
        </div>
        
        <div style="width: 100%; border-top: 1px solid var(--border-color); padding-top: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.8rem; background: var(--bg-cream); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm);">
            <code style="font-size: 0.95rem; font-weight: bold; font-family: var(--font-code);">A and B</code>
            <span id="res-and" class="status-indicator pass" style="font-size: 0.85rem; font-weight: bold;">True</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.8rem; background: var(--bg-cream); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm);">
            <code style="font-size: 0.95rem; font-weight: bold; font-family: var(--font-code);">A or B</code>
            <span id="res-or" class="status-indicator pass" style="font-size: 0.85rem; font-weight: bold;">True</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.8rem; background: var(--bg-cream); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm);">
            <code style="font-size: 0.95rem; font-weight: bold; font-family: var(--font-code);">not A</code>
            <span id="res-not" class="status-indicator fail" style="font-size: 0.85rem; font-weight: bold;">False</span>
          </div>
        </div>
      </div>
    `;
  }
  
  container.innerHTML = html;
  
  if (conceptId === 'operators') {
    setupOperatorsInteractive();
  }
}

function setupOperatorsInteractive() {
  let valA = true;
  let valB = true;
  
  const btnA = document.getElementById('btn-val-a');
  const btnB = document.getElementById('btn-val-b');
  
  if (!btnA || !btnB) return;
  
  function updateDisplay() {
    const resAnd = document.getElementById('res-and');
    const resOr = document.getElementById('res-or');
    const resNot = document.getElementById('res-not');
    
    if (!resAnd || !resOr || !resNot) return;
    
    // Atualiza botões
    btnA.innerText = valA ? "True" : "False";
    if (valA) {
      btnA.classList.add('active');
      btnA.style.backgroundColor = "var(--accent-teal)";
      btnA.style.color = "#FFFFFF";
    } else {
      btnA.classList.remove('active');
      btnA.style.backgroundColor = "";
      btnA.style.color = "";
    }
    
    btnB.innerText = valB ? "True" : "False";
    if (valB) {
      btnB.classList.add('active');
      btnB.style.backgroundColor = "var(--accent-teal)";
      btnB.style.color = "#FFFFFF";
    } else {
      btnB.classList.remove('active');
      btnB.style.backgroundColor = "";
      btnB.style.color = "";
    }
    
    // Calcula valores lógicos
    const andVal = valA && valB;
    const orVal = valA || valB;
    const notVal = !valA;
    
    // Atualiza indicadores de resultado
    resAnd.innerText = andVal ? "True" : "False";
    resAnd.className = andVal ? "status-indicator pass" : "status-indicator fail";
    resAnd.style.backgroundColor = andVal ? "var(--color-success-bg)" : "var(--color-error-bg)";
    resAnd.style.color = andVal ? "#065F46" : "#991B1B";
    
    resOr.innerText = orVal ? "True" : "False";
    resOr.className = orVal ? "status-indicator pass" : "status-indicator fail";
    resOr.style.backgroundColor = orVal ? "var(--color-success-bg)" : "var(--color-error-bg)";
    resOr.style.color = orVal ? "#065F46" : "#991B1B";
    
    resNot.innerText = notVal ? "True" : "False";
    resNot.className = notVal ? "status-indicator pass" : "status-indicator fail";
    resNot.style.backgroundColor = notVal ? "var(--color-success-bg)" : "var(--color-error-bg)";
    resNot.style.color = notVal ? "#065F46" : "#991B1B";
  }
  
  btnA.addEventListener('click', () => {
    valA = !valA;
    updateDisplay();
  });
  
  btnB.addEventListener('click', () => {
    valB = !valB;
    updateDisplay();
  });
  
  updateDisplay();
}

// --- ABA SIMULADOR PASSO A PASSO ---
function setupSimulator() {
  const notaSlider = document.getElementById('sim-slider-nota');
  const notaVal = document.getElementById('sim-val-nota');
  
  if (notaSlider && notaVal) {
    notaSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      notaVal.innerText = val.toFixed(1);
      STATE.simulator.nota = val;
      runSimulatorLogic();
    });
  }
  
  // Executa lógica inicial
  runSimulatorLogic();
}

function runSimulatorLogic() {
  const nota = STATE.simulator.nota;
  const lines = document.querySelectorAll('.sim-line');
  const consoleEl = document.getElementById('sim-console-output');
  
  if (lines.length === 0 || !consoleEl) return;
  
  // Limpa highlights de todas as linhas
  lines.forEach(l => l.classList.remove('active'));
  
  // Linha 1 (atribuição) sempre ativa inicialmente
  lines[0].classList.add('active');
  
  let output = "";
  
  // Simulação passo a passo com atraso visual simulado por ativação direta
  // Linha 2 (vazia)
  
  // Linha 3 (if nota >= 9.0)
  lines[2].classList.add('active');
  
  if (nota >= 9.0) {
    // Linha 4 (print Excelente) é executada
    lines[3].classList.add('active');
    output = "Excelente!";
  } else {
    // Linha 5 (elif nota >= 7.0) é avaliada
    lines[4].classList.add('active');
    
    if (nota >= 7.0) {
      // Linha 6 (print Muito bom) é executada
      lines[5].classList.add('active');
      output = "Muito bom!";
    } else {
      // Linha 7 (else)
      lines[6].classList.add('active');
      // Linha 8 (print Precisa estudar) é executada
      lines[7].classList.add('active');
      output = "Precisa estudar mais!";
    }
  }
  
  consoleEl.innerText = output;
}

// --- ABA QUIZ ---
function setupQuiz() {
  if (SITE_DATA.quiz.length === 0) return;
  STATE.quiz.currentQuestionIndex = 0;
  STATE.quiz.answers = [];
  STATE.quiz.hasAnsweredCurrent = false;
  
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const container = document.getElementById('quiz-container');
  if (!container) return;
  
  const question = SITE_DATA.quiz[STATE.quiz.currentQuestionIndex];
  const total = SITE_DATA.quiz.length;
  
  // Renderiza cabeçalho, pergunta e código de suporte
  let codeHtml = "";
  // Se a pergunta contiver código com quebras de linha '\n'
  if (question.question.includes('\n')) {
    const parts = question.question.split('\n');
    const questionText = parts[0];
    const codeText = parts.slice(1).join('\n');
    
    codeHtml = `
      <p class="quiz-question">${questionText}</p>
      <pre class="quiz-code-block">${codeText}</pre>
    `;
  } else {
    codeHtml = `<p class="quiz-question">${question.question}</p>`;
  }
  
  let optionsHtml = question.options.map((option, idx) => {
    const isCode = option.includes('\n') || option.includes('if ') || option.includes('print');
    const codeClass = isCode ? 'code-font' : '';
    return `<button class="quiz-option ${codeClass}" data-idx="${idx}">${option}</button>`;
  }).join('');
  
  container.innerHTML = `
    <div class="quiz-progress-text">Pergunta ${STATE.quiz.currentQuestionIndex + 1} de ${total}</div>
    ${codeHtml}
    <div class="quiz-options">
      ${optionsHtml}
    </div>
    <div id="quiz-feedback-box" class="quiz-feedback"></div>
    <div class="quiz-actions">
      <button id="quiz-next-btn" class="primary-btn" style="display: none;">
        ${STATE.quiz.currentQuestionIndex === total - 1 ? 'Finalizar Quiz 🏁' : 'Próxima Pergunta ➔'}
      </button>
    </div>
  `;
  
  // Eventos das opções
  const options = container.querySelectorAll('.quiz-option');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      if (STATE.quiz.hasAnsweredCurrent) return; // Impede responder duas vezes
      
      const selectedIdx = parseInt(opt.getAttribute('data-idx'));
      selectQuizOption(selectedIdx, opt);
    });
  });
  
  // Evento do botão avançar
  const nextBtn = document.getElementById('quiz-next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      advanceQuiz();
    });
  }
}

function selectQuizOption(selectedIdx, element) {
  STATE.quiz.hasAnsweredCurrent = true;
  const question = SITE_DATA.quiz[STATE.quiz.currentQuestionIndex];
  const correctIdx = question.correctAnswer;
  
  STATE.quiz.answers.push(selectedIdx);
  
  const feedbackBox = document.getElementById('quiz-feedback-box');
  const nextBtn = document.getElementById('quiz-next-btn');
  
  // Pega todas as opções para poder colorir a correta caso o aluno erre
  const allOptions = document.querySelectorAll('.quiz-option');
  
  if (selectedIdx === correctIdx) {
    element.classList.add('correct');
    feedbackBox.className = 'quiz-feedback success';
    feedbackBox.innerHTML = `<strong>✨ Resposta Correta!</strong><br>${question.explanation}`;
  } else {
    element.classList.add('incorrect');
    // Mostra a correta em verde
    allOptions[correctIdx].classList.add('correct');
    feedbackBox.className = 'quiz-feedback error';
    feedbackBox.innerHTML = `<strong>❌ Que pena, você errou.</strong><br>${question.explanation}`;
  }
  
  nextBtn.style.display = 'flex';
}

function advanceQuiz() {
  const total = SITE_DATA.quiz.length;
  
  if (STATE.quiz.currentQuestionIndex < total - 1) {
    STATE.quiz.currentQuestionIndex++;
    STATE.quiz.hasAnsweredCurrent = false;
    renderQuizQuestion();
  } else {
    // Fim do quiz
    finishQuiz();
  }
}

function finishQuiz() {
  const container = document.getElementById('quiz-container');
  if (!container) return;
  
  // Incrementa as tentativas do quiz
  STATE.progress.quizAttempts = (STATE.progress.quizAttempts || 0) + 1;
  
  // Calcula pontuação
  let correctCount = 0;
  SITE_DATA.quiz.forEach((q, idx) => {
    if (STATE.quiz.answers[idx] === q.correctAnswer) {
      correctCount++;
    }
  });
  
  // Atualiza progresso
  STATE.progress.quizCompleted = true;
  STATE.progress.quizScore = correctCount;
  saveProgress();
  
  // Mostra resultado final
  let scoreClass = correctCount >= 4 ? 'success' : (correctCount >= 3 ? 'warning' : 'error');
  let emoji = correctCount >= 4 ? '🏆 Excelente!' : (correctCount >= 3 ? '👍 Muito Bom!' : '📚 Vamos estudar mais um pouco?');
  
  container.innerHTML = `
    <div class="card" style="text-align: center; border: none; box-shadow: none; padding: 0;">
      <div class="success-badge-large">🧠</div>
      <h2 class="card-title" style="font-size: 2rem; margin-top: 1rem;">Quiz Concluído!</h2>
      <p style="font-size: 1.2rem; color: var(--text-light); margin-bottom: 1.5rem;">
        Você acertou <strong>${correctCount}</strong> de <strong>${SITE_DATA.quiz.length}</strong> perguntas.
      </p>
      
      <div class="quiz-feedback ${scoreClass}" style="display: block; max-width: 500px; margin: 0 auto 2rem; text-align: left;">
        <strong>${emoji}</strong><br>
        Seu progresso foi salvo! Você pode refazer o quiz quando quiser clicando no botão abaixo.
      </div>
      
      <div style="display: flex; justify-content: center; gap: 1rem;">
        <button id="quiz-retry-btn" class="btn-secondary">Tentar Novamente</button>
        <button onclick="switchTab('challenges')" class="primary-btn">Ir para os Desafios ➔</button>
      </div>
    </div>
  `;
  
  document.getElementById('quiz-retry-btn').addEventListener('click', () => {
    setupQuiz();
  });
}

// --- ABA DESAFIOS DE CÓDIGO ---
function setupChallenges() {
  const listContainer = document.getElementById('challenge-list-container');
  if (!listContainer) return;
  
  // Gera lista lateral de desafios
  let html = "";
  SITE_DATA.exercises.forEach(ex => {
    const isCompleted = STATE.progress.completedLevels.includes(ex.level);
    const completedClass = isCompleted ? 'completed' : '';
    const activeClass = ex.level === STATE.challenges.currentLevel ? 'active' : '';
    
    html += `
      <button class="challenge-item ${activeClass} ${completedClass}" id="chal-item-${ex.level}" onclick="selectChallenge(${ex.level})">
        Nível ${ex.level}: ${ex.name.split(':')[1].trim()}
      </button>
    `;
  });
  listContainer.innerHTML = html;
  
  // Carrega o desafio inicial
  loadChallenge(STATE.challenges.currentLevel);
}

function selectChallenge(level) {
  // Impede selecionar níveis bloqueados (deve resolver sequencialmente)
  if (level > 1 && !STATE.progress.completedLevels.includes(level - 1) && !STATE.progress.completedLevels.includes(level)) {
    alert("🔒 Desafio Bloqueado! Você precisa concluir o nível anterior para desbloquear este.");
    return;
  }
  
  STATE.challenges.currentLevel = level;
  
  // Atualiza destaques da lista lateral
  document.querySelectorAll('.challenge-item').forEach(btn => {
    const btnLvl = parseInt(btn.id.replace('chal-item-', ''));
    btn.classList.remove('active');
    if (btnLvl === level) {
      btn.classList.add('active');
    }
  });
  
  loadChallenge(level);
}

function loadChallenge(level) {
  const ex = SITE_DATA.exercises.find(e => e.level === level);
  if (!ex) return;
  
  const descTitle = document.getElementById('chal-title');
  const descText = document.getElementById('chal-description');
  const editor = document.getElementById('chal-code-editor');
  const resultsPanel = document.getElementById('chal-results-panel');
  
  if (descTitle && descText && editor) {
    descTitle.innerHTML = ex.name;
    descText.innerHTML = ex.description;
    
    // Carrega o código antigo digitado pelo aluno ou o inicial do desafio
    if (STATE.challenges.userCodes[level]) {
      editor.value = STATE.challenges.userCodes[level];
    } else {
      editor.value = ex.starterCode;
    }
  }
  
  // Esconde o painel de resultados anterior
  if (resultsPanel) {
    resultsPanel.classList.remove('visible');
  }
}

// Salva o código digitado à medida que o aluno digita
function onCodeEditorInput(value) {
  STATE.challenges.userCodes[STATE.challenges.currentLevel] = value;
}

function resetChallengeCode() {
  const level = STATE.challenges.currentLevel;
  const ex = SITE_DATA.exercises.find(e => e.level === level);
  if (ex && confirm("Deseja voltar o código para o estado original?")) {
    document.getElementById('chal-code-editor').value = ex.starterCode;
    STATE.challenges.userCodes[level] = ex.starterCode;
    document.getElementById('chal-results-panel').classList.remove('visible');
  }
}

function runAndValidateCode() {
  const level = STATE.challenges.currentLevel;
  const ex = SITE_DATA.exercises.find(e => e.level === level);
  const code = document.getElementById('chal-code-editor').value;
  
  // Salva no estado
  STATE.challenges.userCodes[level] = code;
  
  // Incrementa a contagem de tentativas do desafio
  if (!STATE.progress.challengeAttempts) {
    STATE.progress.challengeAttempts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  }
  STATE.progress.challengeAttempts[level] = (STATE.progress.challengeAttempts[level] || 0) + 1;
  saveProgress();
  
  const resultsPanel = document.getElementById('chal-results-panel');
  if (!resultsPanel) return;
  
  resultsPanel.classList.add('visible');
  resultsPanel.innerHTML = ""; // Limpa resultados antigos
  
  let allPass = true;
  let testCaseResults = [];
  let compileError = null;
  
  // Valida cada caso de teste
  for (let test of ex.testCases) {
    // Roda no interpretador python-js
    const result = runPython(code, test.setupVariables);
    
    if (!result.success) {
      compileError = result.error;
      allPass = false;
      break;
    }
    
    const actual = result.output.trim();
    const expected = test.expectedOutput.trim();
    const isPass = actual === expected;
    
    if (!isPass) {
      allPass = false;
    }
    
    testCaseResults.push({
      label: test.label,
      setup: test.setupVariables,
      expected: expected,
      actual: actual,
      pass: isPass
    });
  }
  
  // Se deu erro de sintaxe/indentação do interpretador
  if (compileError) {
    resultsPanel.innerHTML = `
      <div class="results-header" style="color: var(--color-error)">
        ⚠️ Erro Encontrado no Código:
      </div>
      <div class="compiler-error-box">${compileError}</div>
      <p style="font-size: 0.9rem; color: var(--text-light);">
        Revise a mensagem de erro acima, corrija a indentação ou comandos no editor e clique em "Executar Código" novamente.
      </p>
    `;
    return;
  }
  
  // Exibe o cabeçalho do resultado
  let headerColor = allPass ? 'var(--color-success)' : 'var(--color-error)';
  let headerText = allPass ? '🎉 Parabéns! Todos os testes passaram!' : '❌ Ops! Seu código não passou em todos os testes.';
  
  let rowsHtml = testCaseResults.map((res, idx) => {
    let rowClass = res.pass ? 'pass' : 'fail';
    let indicatorClass = res.pass ? 'pass' : 'fail';
    let indicatorText = res.pass ? 'SUCESSO' : 'FALHOU';
    
    // Formata variáveis iniciais legíveis
    let varsStr = Object.entries(res.setup).map(([k, v]) => `${k} = ${typeof v === 'string' ? `'${v}'` : (v === true ? 'True' : (v === false ? 'False' : v))}`).join(', ');
    
    return `
      <div class="test-case-row ${rowClass}">
        <div class="test-case-info">
          <span class="status-indicator ${indicatorClass}">${indicatorText}</span>
          <strong>${res.label}</strong> <span style="color: var(--text-light); font-size: 0.85rem;">(Entrada: ${varsStr})</span>
        </div>
        <button class="toggle-details-btn" onclick="toggleTestDetails(${idx})">Ver Detalhes</button>
        
        <div id="test-details-${idx}" class="test-case-details">
          <div><strong>Saída Esperada:</strong></div>
          <pre style="background: #FFFFFF; padding: 4px; border: 1px solid #CBD5E1; margin: 4px 0;">${res.expected || '(Vazio)'}</pre>
          <div><strong>Saída do Seu Código:</strong></div>
          <pre style="background: #FFFFFF; padding: 4px; border: 1px solid #CBD5E1; margin: 4px 0; color: ${res.pass ? 'green' : 'red'};">${res.actual || '(Vazio)'}</pre>
        </div>
      </div>
    `;
  }).join('');
  
  resultsPanel.innerHTML = `
    <div class="results-header" style="color: ${headerColor}">
      ${headerText}
    </div>
    <div class="test-cases-summary">
      ${rowsHtml}
    </div>
  `;
  
  // Se passou em tudo, salva e desbloqueia
  if (allPass) {
    if (!STATE.progress.completedLevels.includes(level)) {
      STATE.progress.completedLevels.push(level);
      saveProgress();
      
      // Atualiza botão lateral correspondente
      const btn = document.getElementById(`chal-item-${level}`);
      if (btn) btn.classList.add('completed');
    }
    
    // Adiciona botão para avançar para o próximo desafio
    const isLast = level === SITE_DATA.exercises.length;
    if (!isLast) {
      resultsPanel.innerHTML += `
        <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
          <button onclick="selectChallenge(${level + 1})" class="primary-btn">Ir para o Nível ${level + 1} ➔</button>
        </div>
      `;
    } else {
      resultsPanel.innerHTML += `
        <div class="achievement-banner" style="margin-top: 1.5rem;">
          <span class="achievement-icon">🏆</span>
          <div class="achievement-text">
            <h3>Jornada Completa!</h3>
            <p>Você completou todos os desafios práticos de condicionais Python com sucesso! Que orgulho!</p>
          </div>
        </div>
      `;
    }
  }
}

function toggleTestDetails(idx) {
  const el = document.getElementById(`test-details-${idx}`);
  if (el) {
    el.classList.toggle('visible');
  }
}

// Vincula a funções globais para usar em atributos onclick inline do HTML
window.selectChallenge = selectChallenge;
window.runAndValidateCode = runAndValidateCode;
window.resetChallengeCode = resetChallengeCode;
window.onCodeEditorInput = onCodeEditorInput;
window.toggleTestDetails = toggleTestDetails;
window.switchTab = switchTab;
window.resetProgress = resetProgress;

function updateStudentName(name) {
  STATE.progress.studentName = name;
  saveProgress();
  renderPerformanceReport();
}
window.updateStudentName = updateStudentName;

function renderPerformanceReport() {
  const outputEl = document.getElementById('report-output-area');
  const nameInput = document.getElementById('student-name-input');
  
  if (!outputEl) return;
  
  // Sincroniza o input com o estado
  if (nameInput && document.activeElement !== nameInput) {
    nameInput.value = STATE.progress.studentName || "";
  }
  
  const studentName = STATE.progress.studentName ? STATE.progress.studentName.trim() : "";
  
  if (studentName === "") {
    outputEl.innerHTML = `
      <div style="background-color: var(--color-warning-bg); color: #92400E; padding: 1.5rem; border-radius: var(--border-radius-sm); text-align: center; border-left: 4px solid var(--color-warning);">
        <strong>⚠️ Aguardando identificação</strong><br>
        Por favor, digite seu nome completo no campo acima para gerar seu relatório de desempenho.
      </div>
    `;
    return;
  }
  
  // Estatísticas e Nota
  const quizScore = STATE.progress.quizScore || 0;
  const quizAttempts = STATE.progress.quizAttempts || 0;
  const completedChallenges = STATE.progress.completedLevels.length;
  
  // Total de tentativas nos desafios
  let totalChallengeAttempts = 0;
  if (STATE.progress.challengeAttempts) {
    totalChallengeAttempts = Object.values(STATE.progress.challengeAttempts).reduce((a, b) => a + b, 0);
  }
  
  // Nota Geral (Quiz vale 4.0 e Desafios valem 6.0)
  const quizFraction = quizScore / 5; // max 1.0
  const challengeFraction = completedChallenges / 5; // max 1.0
  const grade = (quizFraction * 4.0) + (challengeFraction * 6.0);
  
  // Cor da nota
  let gradeColor = "var(--color-error)";
  let gradeBg = "var(--color-error-bg)";
  let gradeLabel = "Abaixo do Esperado";
  if (grade >= 7.0) {
    gradeColor = "var(--color-success)";
    gradeBg = "var(--color-success-bg)";
    gradeLabel = "Excelente / Aprovado";
  } else if (grade >= 5.0) {
    gradeColor = "var(--color-warning)";
    gradeBg = "var(--color-warning-bg)";
    gradeLabel = "Regular / Recuperação";
  }
  
  // Data de hoje formatada
  const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const formattedDate = new Date().toLocaleDateString('pt-BR', dateOptions);
  
  // Diagnóstico
  let strengths = [];
  let weaknesses = [];
  let suggestions = [];
  
  // Regras para Pontos Fortes
  if (quizScore >= 4) {
    strengths.push("• **Compreensão Teórica Sólida**: Excelente rendimento na simulação mental de execução de blocos condicionais.");
  }
  if (STATE.progress.completedLevels.includes(5)) {
    strengths.push("• **Lógica Composta**: Domínio na criação de lógicas compostas usando operadores booleanos complexos (and, or).");
  }
  if (STATE.progress.completedLevels.includes(3)) {
    strengths.push("• **Condicionais Encadeadas**: Compreensão consistente de múltiplos desvios (if-elif-else).");
  }
  if (STATE.progress.completedLevels.includes(1) && STATE.progress.completedLevels.includes(2)) {
    strengths.push("• **Desvios Simples**: Boa tomada de decisão simples com blocos binários (if-else).");
  }
  if (strengths.length === 0) {
    strengths.push("• Nenhum ponto forte registrado ainda. Leia a aba Teoria e resolva os primeiros desafios!");
  }
  
  // Regras para Pontos Fracos
  if (quizAttempts > 0 && quizScore < 3) {
    weaknesses.push("• **Análise de Variáveis**: Dificuldade em rastrear o valor das variáveis em condicionais sequenciais.");
  }
  // Se errou a Q4 no quiz (indentação)
  if (STATE.quiz.answers[3] !== undefined && STATE.quiz.answers[3] !== 1) {
    weaknesses.push("• **Regras de Indentação**: Apresenta dúvidas com relação ao recuo obrigatório no Python.");
  }
  // Se errou a Q5 no quiz (elif sequencial)
  if (STATE.quiz.answers[4] !== undefined && STATE.quiz.answers[4] !== 1) {
    weaknesses.push("• **Exclusão de Elif**: Dificuldade em entender que apenas o primeiro bloco condicional verdadeiro é executado.");
  }
  if (STATE.progress.completedLevels.length > 0 && !STATE.progress.completedLevels.includes(4)) {
    weaknesses.push("• **Faixas de Valores**: Dificuldade em estruturar intervalos consecutivos de decisão.");
  }
  if (STATE.progress.completedLevels.length > 0 && !STATE.progress.completedLevels.includes(5)) {
    weaknesses.push("• **Expressões Compostas**: Dificuldade de formular lógica com múltiplos operadores booleanos no mesmo if.");
  }
  if (weaknesses.length === 0) {
    if (completedChallenges === 5 && quizScore === 5) {
      weaknesses.push("• **Nenhum ponto fraco detectado!** Desempenho perfeito.");
    } else {
      weaknesses.push("• Avance nos quizzes e desafios para calibrar a análise de fraquezas.");
    }
  }
  
  // Sugestões de Estudo
  // Se errou indentação
  if (STATE.quiz.answers[3] !== undefined && STATE.quiz.answers[3] !== 1) {
    suggestions.push("• **Regra de Margem**: Lembre-se sempre de colocar dois pontos (`:`) no final do if/elif/else e dar 4 espaços de recuo na próxima linha. Evite misturar espaços e tabs.");
  }
  // Se errou lógica de operadores ou falhou no nível 5
  if (!STATE.progress.completedLevels.includes(5) || (STATE.quiz.answers[2] !== undefined && STATE.quiz.answers[2] !== 0)) {
    suggestions.push("• **Estudo de Conjunções**: Revise a aba **Teoria &gt; Valores e Operadores Lógicos**. Pratique usando a Calculadora Lógica Interativa para entender como `True and False` vira False e `True or False` vira True.");
  }
  // Se falhou no nível 4 ou Q5
  if (!STATE.progress.completedLevels.includes(4) || (STATE.quiz.answers[4] !== undefined && STATE.quiz.answers[4] !== 1)) {
    suggestions.push("• **Faixas Numéricas**: Desenhe um fluxo ou linha numérica para ordenar os testes do elif (Ex: do maior para o menor ou vice-versa). Lembre-se que se a primeira condição for atendida, o elif não roda.");
  }
  if (suggestions.length === 0) {
    if (completedChallenges === 5) {
      suggestions.push("• **Avançar nos Estudos**: Parabéns por dominar condicionais! Você está pronto para iniciar Laços de Repetição (`for` e `while`). Pratique criando seus próprios programas locais no seu computador.");
    } else {
      suggestions.push("• Continue resolvendo os desafios sequencialmente. O aprendizado da programação se consolida na prática constante!");
    }
  }
  
  outputEl.innerHTML = `
    <div class="print-only-border" style="border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 1.5rem; background: #FFFFFF;">
      <!-- Cabeçalho Acadêmico de Impressão -->
      <div style="display: flex; justify-content: space-between; border-bottom: 2px solid var(--primary-navy); padding-bottom: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3 style="font-family: var(--font-title); color: var(--primary-navy); font-size: 1.4rem; font-weight: 700; margin: 0;">🐍 Condicionais 101</h3>
          <span style="font-size: 0.85rem; color: var(--text-light); font-weight: 500;">Ficha de Avaliação e Desempenho</span>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 600; color: var(--text-main); font-size: 0.95rem;">Data: ${formattedDate}</div>
          <span style="font-size: 0.85rem; color: var(--text-light);">Lógica de Programação &amp; Python</span>
        </div>
      </div>
      
      <p style="font-size: 1.1rem; margin-bottom: 1.5rem; color: var(--text-main);">
        Aluno(a): <strong style="color: var(--primary-navy); border-bottom: 1px solid #CBD5E1; padding-bottom: 2px;">${studentName}</strong>
      </p>
      
      <!-- Grid de Notas e Estatísticas -->
      <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 1.5rem; margin-bottom: 2rem;">
        <!-- Nota Card -->
        <div style="background-color: ${gradeBg}; border: 2px solid ${gradeColor}; border-radius: var(--border-radius-sm); padding: 1.5rem; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 0.85rem; font-weight: bold; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Nota Geral</div>
          <div style="font-size: 3.5rem; font-weight: 800; font-family: var(--font-title); color: ${gradeColor}; line-height: 1; margin-bottom: 0.25rem;">${grade.toFixed(1)}</div>
          <div style="font-size: 0.8rem; font-weight: bold; color: ${gradeColor};">${gradeLabel}</div>
        </div>
        
        <!-- Detalhes Card -->
        <div style="border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; background: var(--bg-cream);">
          <div style="font-weight: bold; color: var(--primary-navy); margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.25rem; font-size: 0.95rem;">Estatísticas de Resolução</div>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem; color: var(--text-main);">
            <li style="display: flex; justify-content: space-between;">
              <span>Teoria Lida:</span>
              <strong>${STATE.progress.theoryRead.length} de 4 seções</strong>
            </li>
            <li style="display: flex; justify-content: space-between;">
              <span>Acertos no Quiz:</span>
              <strong>${quizScore} de 5 perguntas (${quizAttempts > 0 ? quizAttempts + ' tent.' : 'não finalizado'})</strong>
            </li>
            <li style="display: flex; justify-content: space-between;">
              <span>Desafios Concluídos:</span>
              <strong>${completedChallenges} de 5 níveis</strong>
            </li>
            <li style="display: flex; justify-content: space-between; border-top: 1px dashed var(--border-color); padding-top: 0.4rem; margin-top: 0.2rem;">
              <span>Total de Rodadas de Validação:</span>
              <strong>${totalChallengeAttempts} execuções</strong>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Ficha de Diagnóstico Pedagógico -->
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        
        <!-- Pontos Fortes -->
        <div style="border-left: 4px solid var(--color-success); background: #F0FDF4; padding: 1rem; border-radius: 4px;">
          <h4 style="font-family: var(--font-title); color: #065F46; margin-bottom: 0.5rem; font-size: 1rem;">💪 Pontos Fortes</h4>
          <div style="font-size: 0.9rem; color: #14532D; display: flex; flex-direction: column; gap: 0.25rem;">
            ${strengths.map(s => `<div>${s}</div>`).join('')}
          </div>
        </div>
        
        <!-- Pontos Fracos -->
        <div style="border-left: 4px solid var(--color-error); background: #FFF5F5; padding: 1rem; border-radius: 4px;">
          <h4 style="font-family: var(--font-title); color: #991B1B; margin-bottom: 0.5rem; font-size: 1rem;">⚠️ Pontos Fracos (Atenção)</h4>
          <div style="font-size: 0.9rem; color: #7A1A1A; display: flex; flex-direction: column; gap: 0.25rem;">
            ${weaknesses.map(w => `<div>${w}</div>`).join('')}
          </div>
        </div>
        
        <!-- Sugestões de Estudo -->
        <div style="border-left: 4px solid var(--accent-teal); background: #F0FDFD; padding: 1rem; border-radius: 4px;">
          <h4 style="font-family: var(--font-title); color: #0F766E; margin-bottom: 0.5rem; font-size: 1rem;">💡 Sugestões de Estudo &amp; Prática</h4>
          <div style="font-size: 0.9rem; color: #115E59; display: flex; flex-direction: column; gap: 0.25rem;">
            ${suggestions.map(s => `<div>${s}</div>`).join('')}
          </div>
        </div>
        
      </div>
      
      <!-- Rodapé de Assinatura (para entrega ao professor) -->
      <div style="margin-top: 3rem; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 2rem;">
        <div style="text-align: center; width: 220px; border-top: 1px solid #94A3B8; padding-top: 0.5rem;">
          <span style="font-size: 0.8rem; color: var(--text-light);">Assinatura do Aluno</span>
        </div>
        <div style="text-align: center; width: 220px; border-top: 1px solid #94A3B8; padding-top: 0.5rem;">
          <span style="font-size: 0.8rem; color: var(--text-light);">Rubrica do Professor</span>
        </div>
      </div>
    </div>
    
    <!-- Botão de Ação -->
    <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 1rem;" class="no-print">
      <button onclick="window.print()" class="primary-btn" id="print-report-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        Imprimir Relatório (Salvar PDF)
      </button>
    </div>
  `;
}
window.renderPerformanceReport = renderPerformanceReport;
