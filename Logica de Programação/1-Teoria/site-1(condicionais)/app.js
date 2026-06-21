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
  setupExam();
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
        challengeAttempts: parsed.challengeAttempts || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        // Propriedades da Avaliação 1
        examUnlocked: parsed.examUnlocked || false,
        examName1: parsed.examName1 || "",
        examName2: parsed.examName2 || "",
        examSubmitted: parsed.examSubmitted || false,
        examCodes: parsed.examCodes || {},
        examResults: parsed.examResults || {}
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
      challengeAttempts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      // Propriedades da Avaliação 1
      examUnlocked: false,
      examName1: "",
      examName2: "",
      examSubmitted: false,
      examCodes: {},
      examResults: {}
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
      challengeAttempts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      examUnlocked: false,
      examName1: "",
      examName2: "",
      examSubmitted: false,
      examCodes: {},
      examResults: {}
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
    setupExam();
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
  } else if (tabId === 'exam') {
    refreshExamUI();
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

  // Habilita inserção de Tab como 4 espaços
  enableTabKeyPress('chal-code-editor', onCodeEditorInput);
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
    
    // Atualiza destaque
    const pre = editor.nextElementSibling;
    if (pre) {
      updateEditorHighlight(editor, pre);
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

// --- SEÇÃO DE AVALIAÇÃO 1 ---
// Configuração do EmailJS para envio automático silencioso
const EMAILJS_CONFIG = {
  serviceId: "service_9u2sac8",
  templateId: "template_yew74so", // ID do modelo criado no painel do EmailJS
  publicKey: "krM3uc38ucTfqux-q"   // Chave Pública (Public Key) no painel do EmailJS
};

STATE.exam = {
  activeQ: 1
};

function setupExam() {
  const listContainer = document.getElementById('exam-list-container');
  if (!listContainer) return;
  
  // Limpa e gera lista lateral de questões
  let html = "";
  SITE_DATA.exam.forEach(q => {
    const isCompleted = STATE.progress.examResults && STATE.progress.examResults[q.id];
    const completedClass = isCompleted ? 'completed' : '';
    const activeClass = q.id === STATE.exam.activeQ ? 'active' : '';
    
    html += `
      <button class="challenge-item ${activeClass} ${completedClass}" id="exam-item-${q.id}" onclick="selectExamQuestion(${q.id})">
        Questão ${q.id}: ${q.name.split(':')[1].trim()}
      </button>
    `;
  });
  listContainer.innerHTML = html;
  
  // Carrega os nomes se já estiverem salvos
  const nameInput1 = document.getElementById('exam-student-name-1');
  const nameInput2 = document.getElementById('exam-student-name-2');
  if (nameInput1) nameInput1.value = STATE.progress.examName1 || "";
  if (nameInput2) nameInput2.value = STATE.progress.examName2 || "";

  // Habilita inserção de Tab como 4 espaços
  enableTabKeyPress('exam-code-editor', onExamCodeInput);
}

function unlockExam() {
  const pwdInput = document.getElementById('exam-password-input');
  const errorDiv = document.getElementById('exam-auth-error');
  
  if (!pwdInput) return;
  
  const enteredPassword = pwdInput.value.trim();
  
  // Senha definida: "ecs101" ou "aula101"
  if (enteredPassword === 'ecs101' || enteredPassword === 'aula101') {
    STATE.progress.examUnlocked = true;
    if (errorDiv) errorDiv.style.display = 'none';
    saveProgress();
    refreshExamUI();
  } else {
    if (errorDiv) errorDiv.style.display = 'block';
    pwdInput.value = "";
    pwdInput.focus();
  }
}

function refreshExamUI() {
  const authCard = document.getElementById('exam-auth-card');
  const contentCard = document.getElementById('exam-content-card');
  const successCard = document.getElementById('exam-success-card');
  const questionsArea = document.getElementById('exam-questions-area');
  const nameInput1 = document.getElementById('exam-student-name-1');
  const nameInput2 = document.getElementById('exam-student-name-2');
  
  if (!authCard || !contentCard) return;
  
  // Se o aluno já concluiu/enviou a avaliação, pula direto para a tela de sucesso
  if (STATE.progress.examSubmitted) {
    authCard.style.display = 'none';
    contentCard.style.display = 'none';
    if (successCard) successCard.style.display = 'block';
    
    const textarea = document.getElementById('exam-report-text-copy');
    if (textarea) textarea.value = generateExamReportText();
    return;
  }
  
  if (STATE.progress.examUnlocked) {
    authCard.style.display = 'none';
    contentCard.style.display = 'block';
    if (successCard) successCard.style.display = 'none';
    
    const name1 = STATE.progress.examName1 || "";
    const name2 = STATE.progress.examName2 || "";
    if (nameInput1) nameInput1.value = name1;
    if (nameInput2) nameInput2.value = name2;
    
    if (name1.trim().length > 2) {
      if (questionsArea) questionsArea.style.display = 'block';
      loadExamQuestion(STATE.exam.activeQ);
    } else {
      if (questionsArea) questionsArea.style.display = 'none';
    }
  } else {
    authCard.style.display = 'block';
    contentCard.style.display = 'none';
    if (successCard) successCard.style.display = 'none';
  }
}

function onExamNameChange() {
  const name1 = document.getElementById('exam-student-name-1').value;
  const name2 = document.getElementById('exam-student-name-2').value;
  
  STATE.progress.examName1 = name1;
  STATE.progress.examName2 = name2;
  saveProgress();
  
  const questionsArea = document.getElementById('exam-questions-area');
  if (name1.trim().length > 2) {
    if (questionsArea) questionsArea.style.display = 'block';
    loadExamQuestion(STATE.exam.activeQ);
  } else {
    if (questionsArea) questionsArea.style.display = 'none';
  }
}

function selectExamQuestion(qId) {
  STATE.exam.activeQ = qId;
  
  // Atualiza botões laterais
  document.querySelectorAll('#exam-list-container .challenge-item').forEach(btn => {
    const btnId = parseInt(btn.id.replace('exam-item-', ''));
    btn.classList.remove('active');
    if (btnId === qId) {
      btn.classList.add('active');
    }
  });
  
  loadExamQuestion(qId);
}

function loadExamQuestion(qId) {
  const q = SITE_DATA.exam.find(item => item.id === qId);
  if (!q) return;
  
  const qTitle = document.getElementById('exam-q-title');
  const qDesc = document.getElementById('exam-q-description');
  const editor = document.getElementById('exam-code-editor');
  const resultsPanel = document.getElementById('exam-results-panel');
  
  if (qTitle && qDesc && editor) {
    qTitle.innerHTML = q.name;
    qDesc.innerHTML = q.description;
    
    // Carrega o código do estado ou inicial
    if (STATE.progress.examCodes && STATE.progress.examCodes[qId] !== undefined) {
      editor.value = STATE.progress.examCodes[qId];
    } else {
      editor.value = q.starterCode;
    }
    
    // Atualiza destaque
    const pre = editor.nextElementSibling;
    if (pre) {
      updateEditorHighlight(editor, pre);
    }
  }
  
  if (resultsPanel) {
    resultsPanel.classList.remove('visible');
  }
}

function onExamCodeInput(code) {
  if (!STATE.progress.examCodes) STATE.progress.examCodes = {};
  STATE.progress.examCodes[STATE.exam.activeQ] = code;
  saveProgress();
}

function resetExamCode() {
  const qId = STATE.exam.activeQ;
  const q = SITE_DATA.exam.find(item => item.id === qId);
  
  if (q && confirm("Deseja voltar o código desta questão para o estado original?")) {
    const editor = document.getElementById('exam-code-editor');
    if (editor) editor.value = q.starterCode;
    
    if (!STATE.progress.examCodes) STATE.progress.examCodes = {};
    STATE.progress.examCodes[qId] = q.starterCode;
    
    if (STATE.progress.examResults) {
      delete STATE.progress.examResults[qId];
    }
    
    saveProgress();
    
    const btn = document.getElementById(`exam-item-${qId}`);
    if (btn) btn.classList.remove('completed');
    
    const resultsPanel = document.getElementById('exam-results-panel');
    if (resultsPanel) resultsPanel.classList.remove('visible');
  }
}

function runAndValidateExamCode() {
  const qId = STATE.exam.activeQ;
  const q = SITE_DATA.exam.find(item => item.id === qId);
  const editor = document.getElementById('exam-code-editor');
  
  if (!q || !editor) return;
  
  const code = editor.value;
  if (!STATE.progress.examCodes) STATE.progress.examCodes = {};
  STATE.progress.examCodes[qId] = code;
  
  const resultsPanel = document.getElementById('exam-results-panel');
  if (!resultsPanel) return;
  
  resultsPanel.classList.add('visible');
  resultsPanel.innerHTML = "";
  
  let allPass = true;
  let testCaseResults = [];
  let compileError = null;
  
  for (let test of q.testCases) {
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
  
  if (compileError) {
    resultsPanel.innerHTML = `
      <div class="results-header" style="color: var(--color-error)">
        ⚠️ Erro Encontrado no Código:
      </div>
      <div class="compiler-error-box">${compileError}</div>
      <p style="font-size: 0.9rem; color: var(--text-light);">
        Revise seu código, corrija as regras de indentação do Python e tente novamente.
      </p>
    `;
    return;
  }
  
  let headerColor = allPass ? 'var(--color-success)' : 'var(--color-error)';
  let headerText = allPass ? '🎉 Parabéns! Código validado com sucesso!' : '❌ Ops! Seu código falhou em alguns testes de validação.';
  
  let rowsHtml = testCaseResults.map((res, idx) => {
    let rowClass = res.pass ? 'pass' : 'fail';
    let indicatorClass = res.pass ? 'pass' : 'fail';
    let indicatorText = res.pass ? 'SUCESSO' : 'FALHOU';
    
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
  
  // Atualiza resultados no estado
  if (!STATE.progress.examResults) STATE.progress.examResults = {};
  STATE.progress.examResults[qId] = allPass;
  saveProgress();
  
  // Atualiza botão lateral
  const btn = document.getElementById(`exam-item-${qId}`);
  if (btn) {
    if (allPass) {
      btn.classList.add('completed');
    } else {
      btn.classList.remove('completed');
    }
  }
}

function openExamReview() {
  const name1 = STATE.progress.examName1 ? STATE.progress.examName1.trim() : "";
  const name2 = STATE.progress.examName2 ? STATE.progress.examName2.trim() : "";
  
  if (name1.length < 3) {
    alert("Por favor, preencha o nome do Integrante 1 antes de revisar a avaliação!");
    return;
  }
  
  const modal = document.getElementById('exam-review-modal');
  const infoDiv = document.getElementById('exam-review-student-info');
  const listDiv = document.getElementById('exam-review-questions-list');
  
  if (!modal || !infoDiv || !listDiv) return;
  
  let nameStr = name1;
  if (name2) nameStr += " e " + name2;
  
  infoDiv.innerHTML = `
    <div style="font-size: 1.1rem; color: var(--text-main);">
      Integrantes: <strong style="color: var(--primary-navy);">${nameStr}</strong>
    </div>
    <div style="font-size: 0.9rem; color: var(--text-light); margin-top: 0.25rem;">
      Código de Acesso Utilizado: <code>${STATE.progress.examUnlocked ? 'ecs101' : 'Não autenticado'}</code>
    </div>
  `;
  
  let html = "";
  SITE_DATA.exam.forEach(q => {
    const code = STATE.progress.examCodes && STATE.progress.examCodes[q.id] ? STATE.progress.examCodes[q.id] : q.starterCode;
    const isCompleted = STATE.progress.examResults && STATE.progress.examResults[q.id];
    
    let statusBadge = `<span class="status-indicator fail">FALHANDO OU NÃO TESTADO</span>`;
    if (isCompleted) {
      statusBadge = `<span class="status-indicator pass">VALIDADO COM SUCESSO (PASSOU NOS TESTES)</span>`;
    }
    
    html += `
      <div class="review-q-item">
        <div class="review-q-header">
          <span>${q.name}</span>
          ${statusBadge}
        </div>
        <div class="review-q-body">
          <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-light);">Código Desenvolvido:</div>
          <pre class="review-q-code">${escapeHtml(code)}</pre>
        </div>
      </div>
    `;
  });
  listDiv.innerHTML = html;
  
  // Adapta os botões de rodapé caso já tenha sido enviado (evita múltiplos envios de e-mail ao reabrir o relatório)
  const submitBtn = modal.querySelector('.modal-footer .primary-btn');
  const cancelBtn = modal.querySelector('.modal-footer .btn-secondary');
  if (STATE.progress.examSubmitted) {
    if (submitBtn) submitBtn.style.display = 'none';
    if (cancelBtn) cancelBtn.innerText = 'Fechar';
  } else {
    if (submitBtn) submitBtn.style.display = 'flex';
    if (cancelBtn) cancelBtn.innerText = 'Voltar à Prova';
  }
  
  modal.style.display = 'flex';
}

function closeExamReview() {
  const modal = document.getElementById('exam-review-modal');
  if (modal) modal.style.display = 'none';
}

function generateExamReportText() {
  const name1 = STATE.progress.examName1 ? STATE.progress.examName1.trim() : "";
  const name2 = STATE.progress.examName2 ? STATE.progress.examName2.trim() : "";
  let nameStr = name1;
  if (name2) nameStr += " & " + name2;
  if (!nameStr) nameStr = "Sem identificação";
  
  const date = new Date().toLocaleString('pt-BR');
  
  let report = `==================================================\n`;
  report += `RELATÓRIO DE AVALIAÇÃO - CONDICIONAIS 101\n`;
  report += `==================================================\n\n`;
  report += `Alunos/Dupla: ${nameStr}\n`;
  report += `Data de Entrega: ${date}\n`;
  report += `Repositório: https://github.com/euclidespaim/ecs-101\n\n`;
  
  report += `--------------------------------------------------\n`;
  report += `DESEMPENHO GERAL:\n`;
  report += `--------------------------------------------------\n`;
  
  let totalCorrect = 0;
  SITE_DATA.exam.forEach(q => {
    const passed = STATE.progress.examResults && STATE.progress.examResults[q.id];
    if (passed) totalCorrect++;
  });
  
  report += `Questões Resolvidas: ${totalCorrect} de ${SITE_DATA.exam.length}\n`;
  report += `Nota Estimada: ${(totalCorrect / SITE_DATA.exam.length * 10).toFixed(1)} / 10.0\n\n`;
  
  SITE_DATA.exam.forEach(q => {
    const code = STATE.progress.examCodes && STATE.progress.examCodes[q.id] ? STATE.progress.examCodes[q.id] : q.starterCode;
    const passed = STATE.progress.examResults && STATE.progress.examResults[q.id] ? "PASSOU EM TODOS OS TESTES" : "NÃO PASSOU OU NÃO TESTADO";
    
    report += `==================================================\n`;
    report += `${q.name}\n`;
    report += `Status: ${passed}\n`;
    report += `--------------------------------------------------\n`;
    report += `CÓDIGO ENVIADO:\n`;
    report += `--------------------------------------------------\n`;
    report += `${code}\n`;
    report += `==================================================\n\n`;
  });
  
  return report;
}

function submitExamFinal() {
  // Marca como submetido e salva
  STATE.progress.examSubmitted = true;
  saveProgress();
  
  const reportText = generateExamReportText();
  
  // Atualiza textarea da cópia
  const textarea = document.getElementById('exam-report-text-copy');
  if (textarea) textarea.value = reportText;
  
  // Fecha o modal de revisão
  closeExamReview();
  
  // Mostra a tela de sucesso
  const contentCard = document.getElementById('exam-content-card');
  const successCard = document.getElementById('exam-success-card');
  if (contentCard && successCard) {
    contentCard.style.display = 'none';
    successCard.style.display = 'block';
  }

  const name1 = STATE.progress.examName1 ? STATE.progress.examName1.trim() : "";
  const name2 = STATE.progress.examName2 ? STATE.progress.examName2.trim() : "";
  let nameStr = name1;
  if (name2) nameStr += " e " + name2;
  
  const subjectText = `Avaliação 1 - ${nameStr}`;

  // Verifica se o EmailJS está configurado
  if (EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.templateId !== "YOUR_TEMPLATE_ID" &&
      EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== "YOUR_PUBLIC_KEY") {
    // Tenta envio automático silencioso em segundo plano
    sendEmailViaEmailJS(subjectText, reportText, nameStr);
  } else {
    // Fallback: abre cliente de e-mail tradicional em nova guia
    fallbackMailto(subjectText, reportText);
  }
}

function retryMailtoSubmit() {
  const reportText = generateExamReportText();
  const name1 = STATE.progress.examName1 ? STATE.progress.examName1.trim() : "";
  const name2 = STATE.progress.examName2 ? STATE.progress.examName2.trim() : "";
  let nameStr = name1;
  if (name2) nameStr += " e " + name2;
  
  const subjectText = `Avaliação 1 - ${nameStr}`;
  fallbackMailto(subjectText, reportText);
}

function sendEmailViaEmailJS(subject, reportText, nameStr) {
  const payload = {
    service_id: EMAILJS_CONFIG.serviceId,
    template_id: EMAILJS_CONFIG.templateId,
    user_id: EMAILJS_CONFIG.publicKey,
    template_params: {
      subject: subject,
      from_name: nameStr,
      message: reportText,
      // Recipient Address variables to avoid "the recipients address is empty" error
      to_email: "euclidespaim@gmail.com",
      email: "euclidespaim@gmail.com",
      from_email: "euclidespaim@gmail.com",
      reply_to: "euclidespaim@gmail.com",
      // Template placeholders from the user's template settings
      name: nameStr,
      title: subject
    }
  };

  fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (response.ok) {
      console.log('EMAILJS REST SUCCESS!');
      alert("Avaliação enviada com sucesso ao e-mail do professor via EmailJS! 🎉");
    } else {
      return response.text().then(text => { throw new Error(text); });
    }
  })
  .catch(error => {
    console.error('EMAILJS REST FAILED...', error);
    alert("Falha no envio automático via EmailJS. Abrindo cliente de e-mail local em nova guia como contingência...\nErro: " + error.message);
    fallbackMailto(subject, reportText);
  });
}

function fallbackMailto(subject, reportText) {
  const emailRecipient = "euclidespaim@gmail.com";
  const mailtoUrl = `mailto:${emailRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(reportText)}`;
  window.open(mailtoUrl, '_blank');
}

function copyExamReportToClipboard() {
  const textarea = document.getElementById('exam-report-text-copy');
  if (!textarea) return;
  
  textarea.select();
  textarea.setSelectionRange(0, 99999); // Para mobile
  
  navigator.clipboard.writeText(textarea.value).then(() => {
    const copyBtn = document.getElementById('exam-copy-btn');
    if (copyBtn) {
      copyBtn.innerText = "Copiado! ✓";
      copyBtn.style.backgroundColor = "var(--color-success-bg)";
      copyBtn.style.color = "#065F46";
      copyBtn.style.borderColor = "var(--color-success)";
      
      setTimeout(() => {
        copyBtn.innerText = "Copiar Relatório 📋";
        copyBtn.style.backgroundColor = "";
        copyBtn.style.color = "";
        copyBtn.style.borderColor = "";
      }, 2500);
    }
  }).catch(err => {
    alert("Falha ao copiar automaticamente: " + err);
  });
}

function downloadExamReportAsTxt() {
  const reportText = generateExamReportText();
  const name1 = STATE.progress.examName1 ? STATE.progress.examName1.trim().replace(/\s+/g, "_") : "avaliacao";
  const name2 = STATE.progress.examName2 ? "_" + STATE.progress.examName2.trim().replace(/\s+/g, "_") : "";
  const filename = `avaliacao_1_${name1}${name2}.txt`;
  
  const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Vincula funções do Exame ao escopo global (window)
window.unlockExam = unlockExam;
window.onExamNameChange = onExamNameChange;
window.selectExamQuestion = selectExamQuestion;
window.onExamCodeInput = onExamCodeInput;
window.resetExamCode = resetExamCode;
window.runAndValidateExamCode = runAndValidateExamCode;
window.openExamReview = openExamReview;
window.closeExamReview = closeExamReview;
window.submitExamFinal = submitExamFinal;
window.copyExamReportToClipboard = copyExamReportToClipboard;
window.downloadExamReportAsTxt = downloadExamReportAsTxt;
window.retryMailtoSubmit = retryMailtoSubmit;
window.setupExam = setupExam;
window.refreshExamUI = refreshExamUI;

function resetSubmittedExam() {
  const password = prompt("Digite a senha do professor para liberar uma nova tentativa de envio:");
  if (password === 'ecs101' || password === 'aula101') {
    STATE.progress.examSubmitted = false;
    saveProgress();
    alert("Avaliação liberada com sucesso! Os códigos anteriores foram mantidos para que a dupla possa revisá-los ou editá-los.");
    refreshExamUI();
  } else if (password !== null) {
    alert("Senha incorreta!");
  }
}
window.resetSubmittedExam = resetSubmittedExam;

function resetEntireExam() {
  const password = prompt("Digite a senha do professor para RESETAR COMPLETAMENTE a avaliação (apaga nomes e códigos):");
  if (password === 'ecs101' || password === 'aula101') {
    STATE.progress.examUnlocked = false;
    STATE.progress.examSubmitted = false;
    STATE.progress.examName1 = "";
    STATE.progress.examName2 = "";
    STATE.progress.examCodes = {};
    STATE.progress.examResults = {};
    saveProgress();
    
    // Limpa campos na UI
    const nameInput1 = document.getElementById('exam-student-name-1');
    const nameInput2 = document.getElementById('exam-student-name-2');
    if (nameInput1) nameInput1.value = "";
    if (nameInput2) nameInput2.value = "";
    
    const pwdInput = document.getElementById('exam-password-input');
    if (pwdInput) pwdInput.value = "";
    
    alert("Avaliação resetada com sucesso! A seção foi bloqueada e todos os dados foram apagados.");
    refreshExamUI();
  } else if (password !== null) {
    alert("Senha incorreta!");
  }
}
window.resetEntireExam = resetEntireExam;

// --- SISTEMA DE DESTAQUE DE SINTAXE PYTHON (VS CODE STYLE) ---
function highlightPython(code) {
  let html = escapeHtml(code);
  
  // Array para guardar tokens temporariamente (evita conflitos entre strings e comentários)
  const placeholders = [];
  
  // Regex para capturar strings (aspas duplas/simples) e comentários sequencialmente
  const tokenRegex = /(&quot;.*?&quot;|&#039;.*?&#039;|#.*)/g;
  
  html = html.replace(tokenRegex, (match) => {
    const placeholder = `__TOKEN_PLACEHOLDER_${placeholders.length}__`;
    let highlightedToken = match;
    if (match.startsWith('#')) {
      highlightedToken = `<span class="hl-comment">${match}</span>`;
    } else {
      highlightedToken = `<span class="hl-string">${match}</span>`;
    }
    placeholders.push(highlightedToken);
    return placeholder;
  });

  // Palavras reservadas (keywords): if, elif, else, and, or, not, True, False
  const keywords = /\b(if|elif|else|and|or|not|True|False)\b/g;
  html = html.replace(keywords, '<span class="hl-keyword">$1</span>');

  // Funções embutidas: print
  const builtins = /\b(print)\b/g;
  html = html.replace(builtins, '<span class="hl-builtin">$1</span>');

  // Variáveis (declaradas por atribuição ou conhecidas nos enunciados)
  // 1. Variáveis por atribuição: identificador seguido de '='
  html = html.replace(/\b([a-zA-Z_]\w*)\b(?=\s*=[^=])/g, '<span class="hl-variable">$1</span>');
  
  // 2. Variáveis conhecidas nos enunciados das questões
  const knownVars = /\b(pontos|recorde|idade|pdl|valor_compra|cor|pedestre_esperando|vidas|temperatura|altura|energia)\b/g;
  html = html.replace(knownVars, '<span class="hl-variable">$1</span>');

  // Números (inteiros ou decimais)
  const numbers = /\b(\d+(?:\.\d+)?)\b/g;
  html = html.replace(numbers, '<span class="hl-number">$1</span>');

  // Restaura os tokens (strings e comentários) nos seus devidos lugares
  html = html.replace(/__TOKEN_PLACEHOLDER_(\d+)__/g, (match, idx) => {
    return placeholders[parseInt(idx)];
  });

  return html;
}

function updateEditorHighlight(textarea, pre) {
  if (!textarea || !pre) return;
  const codeEl = pre.querySelector('code');
  if (codeEl) {
    codeEl.innerHTML = highlightPython(textarea.value);
  } else {
    pre.innerHTML = highlightPython(textarea.value);
  }
  syncEditorScroll(textarea, pre);
}

// Sincroniza o scroll da textarea com o pre de fundo
function syncEditorScroll(textarea, pre) {
  if (!textarea || !pre) return;
  pre.scrollTop = textarea.scrollTop;
  pre.scrollLeft = textarea.scrollLeft;
}

// Intercepta a tecla Tab para inserir 4 espaços ao invés de perder o foco
function enableTabKeyPress(textareaId, onInputCallback) {
  const textarea = document.getElementById(textareaId);
  if (!textarea) return;
  
  textarea.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const start = this.selectionStart;
      const end = this.selectionEnd;
      
      const spaces = "    ";
      this.value = this.value.substring(0, start) + spaces + this.value.substring(end);
      
      this.selectionStart = this.selectionEnd = start + 4;
      
      if (onInputCallback) {
        onInputCallback(this.value);
      }
      
      const pre = this.nextElementSibling;
      if (pre) {
        updateEditorHighlight(this, pre);
      }
    }
  });
}

window.syncEditorScroll = syncEditorScroll;
window.updateEditorHighlight = updateEditorHighlight;
