// Estado global da aplicação expandida
const STATE = {
  currentTab: 'home',
  sidebarOpen: true,
  progress: {
    theoryRead: [], // IDs dos conceitos lidos
    quizCompleted: false,
    quizScore: 0,
    completedLevels: [], // Níveis de desafios completados (1 a 10)
    studentName: "",
    quizAttempts: 0,
    challengeAttempts: {},
    examUnlocked: false,
    examName1: "",
    examName2: "",
    examSubmitted: false,
    examCodes: {},
    examResults: {}
  },
  quiz: {
    selectedModule: 'all',
    currentQuestionIndex: 0,
    answers: [],
    hasAnsweredCurrent: false,
    filteredQuestions: []
  },
  challenges: {
    currentLevel: 1,
    userCodes: {}
  },
  exam: {
    currentQuestionId: 1,
    userCodes: {}
  },
  simulator: {
    defaultCode: `<!-- Escreva seu HTML e CSS abaixo -->
<style>
  .card-flex {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #F0FDF4;
    border: 2px solid #16A34A;
    border-radius: 16px;
    padding: 24px;
    max-width: 320px;
    margin: 20px auto;
    font-family: 'Outfit', sans-serif;
    box-shadow: 0 10px 15px rgba(0,0,0,0.05);
  }
  
  .card-flex h2 {
    color: #15803D;
    margin-bottom: 8px;
  }

  .btn-acao {
    background-color: #16A34A;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s, background 0.2s;
  }

  .btn-acao:hover {
    background-color: #15803D;
    transform: translateY(-2px);
  }
</style>

<div class="card-flex">
  <h2>Flexbox & Estilos!</h2>
  <p>Altere as regras no editor ao lado e veja o resultado ao vivo!</p>
  <button class="btn-acao">Testar Efeito Hover</button>
</div>`,
    currentCode: ""
  }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  setupAccordionSidebar();
  setupTheoryInteractivity();
  setupSimulator();
  setupQuiz();
  setupChallenges();
  setupExam();
  updateProgressUI();
});

// --- PERSISTÊNCIA NO LOCALSTORAGE ---
function loadProgress() {
  const saved = localStorage.getItem('html_css_expanded_progress');
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
        challengeAttempts: parsed.challengeAttempts || {},
        examUnlocked: parsed.examUnlocked || false,
        examName1: parsed.examName1 || "",
        examName2: parsed.examName2 || "",
        examSubmitted: parsed.examSubmitted || false,
        examCodes: parsed.examCodes || {},
        examResults: parsed.examResults || {}
      };
    } catch (e) {
      console.error("Erro ao carregar o progresso", e);
    }
  }
}

function saveProgress() {
  localStorage.setItem('html_css_expanded_progress', JSON.stringify(STATE.progress));
  updateProgressUI();
}

function resetProgress() {
  if (confirm("Deseja recomeçar toda a trilha pedagógica? O progresso salvo será zerado.")) {
    STATE.progress = {
      theoryRead: [],
      quizCompleted: false,
      quizScore: 0,
      completedLevels: [],
      studentName: "",
      quizAttempts: 0,
      challengeAttempts: {},
      examUnlocked: false,
      examName1: "",
      examName2: "",
      examSubmitted: false,
      examCodes: {},
      examResults: {}
    };
    saveProgress();
    STATE.quiz.currentQuestionIndex = 0;
    STATE.quiz.answers = [];
    STATE.quiz.hasAnsweredCurrent = false;
    STATE.challenges.userCodes = {};
    STATE.exam.userCodes = {};
    
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
  const totalConcepts = 9; // 3 no Mod 1, 2 no Mod 2, 2 no Mod 3, 2 no Mod 4
  const totalChallenges = 10;
  const totalItems = totalConcepts + 1 + totalChallenges;
  
  const completedItems = STATE.progress.theoryRead.length + (STATE.progress.quizCompleted ? 1 : 0) + STATE.progress.completedLevels.length;
  const percent = Math.round((completedItems / totalItems) * 100);
  
  document.querySelectorAll('.progress-fill').forEach(fill => {
    fill.style.width = percent + '%';
  });
  
  const percentText = document.getElementById('progress-percent-text');
  if (percentText) {
    percentText.innerText = `${percent}% concluído`;
  }
  
  // Badges da tela inicial
  for (let lvl = 1; lvl <= 10; lvl++) {
    const badge = document.getElementById(`badge-lvl-${lvl}`);
    if (badge) {
      badge.className = 'level-badge';
      if (STATE.progress.completedLevels.includes(lvl)) {
        badge.classList.add('unlocked');
        badge.innerHTML = `🌟<br>Lvl ${lvl}`;
      } else if (lvl === 1 || STATE.progress.completedLevels.includes(lvl - 1)) {
        badge.classList.add('current');
        badge.innerHTML = `🎮<br>Lvl ${lvl}`;
      } else {
        badge.innerHTML = `🔒<br>Lvl ${lvl}`;
      }
    }
  }

  const banner = document.getElementById('final-achievement-banner');
  if (banner) {
    banner.style.display = (completedItems === totalItems) ? 'flex' : 'none';
  }
  
  renderPerformanceReport();
}

// --- BARRA LATERAL SANFONA (ACCORDION SIDEBAR) ---
function setupAccordionSidebar() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const group = header.parentElement;
      group.classList.toggle('open');
    });
  });
  
  // Links de navegação na sidebar
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetTab = link.getAttribute('data-tab');
      const targetConcept = link.getAttribute('data-concept');
      const targetLevel = link.getAttribute('data-level');
      
      switchTab(targetTab);
      
      if (targetConcept) {
        switchTheoryConcept(targetConcept);
      }
      if (targetLevel) {
        selectChallenge(parseInt(targetLevel));
      }
    });
  });
}

window.toggleSidebar = function() {
  const sidebar = document.getElementById('main-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('collapsed');
    STATE.sidebarOpen = !sidebar.classList.contains('collapsed');
  }
};

function switchTab(tabId) {
  if (STATE.progress.examSubmitted && tabId !== 'exam') {
    alert("Avaliação finalizada. A navegação foi travada!");
    switchTab('exam');
    return;
  }

  STATE.currentTab = tabId;
  
  // Atualiza destaque na barra lateral
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('data-tab') === tabId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Painéis de conteúdo
  document.querySelectorAll('.tab-content').forEach(content => {
    if (content.id === `${tabId}-tab`) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });

  if (tabId === 'challenges') {
    loadChallenge(STATE.challenges.currentLevel);
  } else if (tabId === 'report') {
    renderPerformanceReport();
  } else if (tabId === 'exam') {
    refreshExamUI();
  }
}

// --- TEORIA & INSPETORES INTERATIVOS ---
function setupTheoryInteractivity() {
  const theoryTabs = document.querySelectorAll('.theory-tab-btn');
  theoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const conceptId = tab.getAttribute('data-concept');
      switchTheoryConcept(conceptId);
    });
  });
  
  switchTheoryConcept('html-basics');
}

function switchTheoryConcept(conceptId) {
  document.querySelectorAll('.theory-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-concept') === conceptId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  document.querySelectorAll('.theory-body-content').forEach(body => {
    if (body.id === `theory-content-${conceptId}`) {
      body.classList.add('active');
    } else {
      body.classList.remove('active');
    }
  });

  renderTheoryInteractiveArea(conceptId);
  
  if (!STATE.progress.theoryRead.includes(conceptId)) {
    STATE.progress.theoryRead.push(conceptId);
    saveProgress();
  }
}

function renderTheoryInteractiveArea(conceptId) {
  const container = document.getElementById('theory-flowchart-area');
  if (!container) return;
  
  if (conceptId === 'html-basics') {
    container.innerHTML = `
      <div class="interactive-theory-card">
        <h4 style="font-family: var(--font-title); color: var(--primary-navy); margin-bottom: 0.75rem;">Visão Anatômica de uma Tag HTML</h4>
        <div style="background-color: #1E293B; padding: 1.25rem; border-radius: var(--border-radius-sm); font-family: var(--font-code); color: white; text-align: center; width: 100%; font-size: 0.9rem;">
          <span style="color: #F43F5E;">&lt;p</span> <span style="color: #F59E0B;">class</span>=<span style="color: #10B981;">"destaque"</span><span style="color: #F43F5E;">&gt;</span>Olá, Aluno!<span style="color: #F43F5E;">&lt;/p&gt;</span>
        </div>
        <div style="width: 100%; margin-top: 1rem; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.8rem; color: var(--text-light);">
          <div>👉 <strong style="color: #F43F5E;">&lt;p&gt; e &lt;/p&gt;</strong>: Abertura e fechamento da tag.</div>
          <div>👉 <strong style="color: #F59E0B;">class</strong>: Atributo identificador.</div>
          <div>👉 <strong style="color: #10B981;">"destaque"</strong>: Valor do atributo de classe.</div>
        </div>
      </div>
    `;
  } else if (conceptId === 'css-basics') {
    container.innerHTML = `
      <div class="interactive-theory-card">
        <h4 style="font-family: var(--font-title); color: var(--primary-navy); margin-bottom: 0.75rem;">Anatomia de Regras CSS</h4>
        <div style="background-color: #1E293B; padding: 1.25rem; border-radius: var(--border-radius-sm); font-family: var(--font-code); color: white; width: 100%; font-size: 0.9rem;">
          <span style="color: #38BDF8;">h1</span> {<br>
          &nbsp;&nbsp;<span style="color: #F59E0B;">color</span>: <span style="color: #10B981;">#1E3A8A</span>;<br>
          &nbsp;&nbsp;<span style="color: #F59E0B;">font-size</span>: <span style="color: #10B981;">24px</span>;<br>
          }
        </div>
      </div>
    `;
  } else if (conceptId === 'box-model') {
    container.innerHTML = `
      <div class="interactive-theory-card">
        <h4 style="font-family: var(--font-title); color: var(--primary-navy); margin-bottom: 0.5rem;">Inspetor Visual do Box Model</h4>
        <div class="box-model-container">
          <div class="box-model-visual" id="bm-margin">
            <div class="box-model-border" id="bm-border">
              <div class="box-model-padding" id="bm-padding">
                <div class="box-model-content">CONTEÚDO</div>
              </div>
            </div>
          </div>
          
          <div class="box-model-sliders">
            <div>
              <label>Padding: <span id="lbl-bm-padding">20px</span></label>
              <input type="range" id="slider-bm-padding" min="5" max="35" value="20" oninput="updateBoxModelDemo()">
            </div>
            <div>
              <label>Borda: <span id="lbl-bm-border">3px</span></label>
              <input type="range" id="slider-bm-border" min="0" max="10" value="3" oninput="updateBoxModelDemo()">
            </div>
            <div>
              <label>Margin: <span id="lbl-bm-margin">20px</span></label>
              <input type="range" id="slider-bm-margin" min="5" max="40" value="20" oninput="updateBoxModelDemo()">
            </div>
          </div>
        </div>
      </div>
    `;
    updateBoxModelDemo();
  } else if (conceptId === 'flexbox-alignment' || conceptId === 'flexbox-intro') {
    container.innerHTML = `
      <div class="interactive-theory-card">
        <h4 style="font-family: var(--font-title); color: var(--primary-navy); margin-bottom: 0.75rem;">Flexbox Playground Inspector</h4>
        <div class="flexbox-demo-container">
          <div class="flexbox-controls">
            <label>justify-content:</label>
            <select id="sel-flex-justify" onchange="updateFlexboxDemo()">
              <option value="flex-start">flex-start (Início)</option>
              <option value="center">center (Centralizado)</option>
              <option value="flex-end">flex-end (Fim)</option>
              <option value="space-between" selected>space-between (Espaçado)</option>
              <option value="space-around">space-around (Distribuído)</option>
            </select>
          </div>
          <div class="flexbox-demo-box" id="flexbox-demo-box" style="justify-content: space-between;">
            <div class="flexbox-demo-item">Item 1</div>
            <div class="flexbox-demo-item">Item 2</div>
            <div class="flexbox-demo-item">Item 3</div>
          </div>
        </div>
      </div>
    `;
  }
}

window.updateBoxModelDemo = function() {
  const padVal = document.getElementById('slider-bm-padding')?.value || 20;
  const bordVal = document.getElementById('slider-bm-border')?.value || 3;
  const margVal = document.getElementById('slider-bm-margin')?.value || 20;
  
  const lblPad = document.getElementById('lbl-bm-padding');
  const lblBord = document.getElementById('lbl-bm-border');
  const lblMarg = document.getElementById('lbl-bm-margin');
  
  if (lblPad) lblPad.innerText = padVal + "px";
  if (lblBord) lblBord.innerText = bordVal + "px";
  if (lblMarg) lblMarg.innerText = margVal + "px";
  
  const elMargin = document.getElementById('bm-margin');
  const elBorder = document.getElementById('bm-border');
  const elPadding = document.getElementById('bm-padding');
  
  if (elMargin) elMargin.style.padding = margVal + "px";
  if (elBorder) {
    elBorder.style.borderWidth = bordVal + "px";
    elBorder.style.padding = "6px";
  }
  if (elPadding) elPadding.style.padding = padVal + "px";
};

window.updateFlexboxDemo = function() {
  const justify = document.getElementById('sel-flex-justify')?.value || 'space-between';
  const box = document.getElementById('flexbox-demo-box');
  if (box) {
    box.style.justifyContent = justify;
  }
};

// --- SIMULADOR SANDBOX ---
function setupSimulator() {
  const textarea = document.getElementById('sim-code-editor-textarea');
  const iframe = document.getElementById('sim-live-preview-iframe');
  if (!textarea || !iframe) return;

  if (!STATE.simulator.currentCode) {
    STATE.simulator.currentCode = STATE.simulator.defaultCode;
  }
  textarea.value = STATE.simulator.currentCode;

  const pre = textarea.nextElementSibling;
  if (pre) updateEditorHighlight(textarea, pre);

  renderIframePreview(iframe, textarea.value);

  textarea.addEventListener('input', (e) => {
    STATE.simulator.currentCode = e.target.value;
    updateEditorHighlight(textarea, pre);
    renderIframePreview(iframe, e.target.value);
  });

  textarea.addEventListener('scroll', () => {
    syncEditorScroll(textarea, pre);
  });

  enableTabKeyPress('sim-code-editor-textarea', (val) => {
    STATE.simulator.currentCode = val;
    renderIframePreview(iframe, val);
  });
}

function renderIframePreview(iframe, code) {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(code);
    doc.close();
  } catch (e) {
    console.error("Erro no preview live", e);
  }
}

// --- EDITOR & HIGHLIGHT DE SINTAXE ---
function updateEditorHighlight(textarea, pre) {
  if (!textarea || !pre) return;
  const codeElement = pre.querySelector('code');
  if (codeElement) {
    codeElement.innerHTML = highlightHTMLandCSS(textarea.value) + "\n";
  }
  syncEditorScroll(textarea, pre);
}

function syncEditorScroll(textarea, pre) {
  if (!textarea || !pre) return;
  pre.scrollTop = textarea.scrollTop;
  pre.scrollLeft = textarea.scrollLeft;
}

function enableTabKeyPress(textareaId, onInputCallback) {
  const textarea = document.getElementById(textareaId);
  if (!textarea) return;

  textarea.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = this.selectionStart;
      const end = this.selectionEnd;
      const spaces = "  ";
      this.value = this.value.substring(0, start) + spaces + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + spaces.length;

      if (onInputCallback) onInputCallback(this.value);
      
      const pre = this.nextElementSibling;
      if (pre) updateEditorHighlight(this, pre);
    }
  });
}

// --- QUIZZES ---
function setupQuiz() {
  if (SITE_DATA.quiz.length === 0) return;
  STATE.quiz.currentQuestionIndex = 0;
  STATE.quiz.answers = [];
  STATE.quiz.hasAnsweredCurrent = false;
  STATE.quiz.filteredQuestions = SITE_DATA.quiz;
  
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const container = document.getElementById('quiz-container');
  if (!container) return;
  
  const questions = STATE.quiz.filteredQuestions;
  if (questions.length === 0) {
    container.innerHTML = `<p>Nenhuma pergunta encontrada neste módulo.</p>`;
    return;
  }
  
  const question = questions[STATE.quiz.currentQuestionIndex];
  const total = questions.length;
  
  let optionsHtml = question.options.map((option, idx) => {
    const isCode = option.includes('<') || option.includes('.') || option.includes('#') || option.includes('{');
    const codeClass = isCode ? 'code-font' : '';
    return `<button class="quiz-option ${codeClass}" data-idx="${idx}">${escapeHtml(option)}</button>`;
  }).join('');
  
  container.innerHTML = `
    <div class="quiz-progress-text">Pergunta ${STATE.quiz.currentQuestionIndex + 1} de ${total}</div>
    <p class="quiz-question">${question.question}</p>
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
  
  container.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => {
      if (STATE.quiz.hasAnsweredCurrent) return;
      const selectedIdx = parseInt(opt.getAttribute('data-idx'));
      selectQuizOption(selectedIdx, opt);
    });
  });
  
  const nextBtn = document.getElementById('quiz-next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', advanceQuiz);
  }
}

function selectQuizOption(selectedIdx, element) {
  STATE.quiz.hasAnsweredCurrent = true;
  const questions = STATE.quiz.filteredQuestions;
  const question = questions[STATE.quiz.currentQuestionIndex];
  const correctIdx = question.correctAnswer;
  
  STATE.quiz.answers.push(selectedIdx);
  
  const feedbackBox = document.getElementById('quiz-feedback-box');
  const nextBtn = document.getElementById('quiz-next-btn');
  const allOptions = document.querySelectorAll('.quiz-option');
  
  if (selectedIdx === correctIdx) {
    element.classList.add('correct');
    feedbackBox.className = 'quiz-feedback success';
    feedbackBox.innerHTML = `<strong>✨ Resposta Correta!</strong><br>${question.explanation}`;
  } else {
    element.classList.add('incorrect');
    allOptions[correctIdx].classList.add('correct');
    feedbackBox.className = 'quiz-feedback error';
    feedbackBox.innerHTML = `<strong>❌ Resposta Incorreta.</strong><br>${question.explanation}`;
  }
  
  nextBtn.style.display = 'inline-flex';
}

function advanceQuiz() {
  const total = STATE.quiz.filteredQuestions.length;
  if (STATE.quiz.currentQuestionIndex < total - 1) {
    STATE.quiz.currentQuestionIndex++;
    STATE.quiz.hasAnsweredCurrent = false;
    renderQuizQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  const container = document.getElementById('quiz-container');
  if (!container) return;
  
  STATE.progress.quizAttempts = (STATE.progress.quizAttempts || 0) + 1;
  
  let correctCount = 0;
  STATE.quiz.filteredQuestions.forEach((q, idx) => {
    if (STATE.quiz.answers[idx] === q.correctAnswer) {
      correctCount++;
    }
  });
  
  STATE.progress.quizCompleted = true;
  STATE.progress.quizScore = correctCount;
  saveProgress();
  
  container.innerHTML = `
    <div style="text-align: center; padding: 2rem;">
      <h2 style="color: var(--primary-navy); margin-bottom: 1rem;">Quiz Concluído!</h2>
      <p style="font-size: 1.1rem; color: var(--text-light); margin-bottom: 1.5rem;">
        Você acertou <strong>${correctCount}</strong> de <strong>${STATE.quiz.filteredQuestions.length}</strong> perguntas.
      </p>
      <button id="quiz-retry-btn" class="btn-secondary">Refazer Quiz</button>
      <button onclick="switchTab('challenges')" class="primary-btn">Ir para os Desafios ➔</button>
    </div>
  `;
  
  document.getElementById('quiz-retry-btn')?.addEventListener('click', setupQuiz);
}

// --- DESAFIOS DE CÓDIGO (NÍVEIS 1 A 10) ---
function setupChallenges() {
  const listContainer = document.getElementById('challenge-list-container');
  if (!listContainer) return;
  
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
  
  loadChallenge(STATE.challenges.currentLevel);
  enableTabKeyPress('chal-code-editor', onCodeEditorInput);
}

window.selectChallenge = function(level) {
  if (level > 1 && !STATE.progress.completedLevels.includes(level - 1) && !STATE.progress.completedLevels.includes(level)) {
    alert("🔒 Desafio Bloqueado! Conclua o nível anterior para desbloquear.");
    return;
  }
  
  STATE.challenges.currentLevel = level;
  
  document.querySelectorAll('.challenge-item').forEach(btn => {
    const btnLvl = parseInt(btn.id.replace('chal-item-', ''));
    btn.classList.remove('active');
    if (btnLvl === level) btn.classList.add('active');
  });
  
  loadChallenge(level);
};

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
    
    editor.value = STATE.challenges.userCodes[level] || ex.starterCode;
    
    const pre = editor.nextElementSibling;
    if (pre) updateEditorHighlight(editor, pre);
  }
  
  if (resultsPanel) resultsPanel.classList.remove('visible');
}

function onCodeEditorInput(value) {
  STATE.challenges.userCodes[STATE.challenges.currentLevel] = value;
}

window.resetChallengeCode = function() {
  const level = STATE.challenges.currentLevel;
  const ex = SITE_DATA.exercises.find(e => e.level === level);
  if (ex && confirm("Voltar ao código inicial?")) {
    document.getElementById('chal-code-editor').value = ex.starterCode;
    STATE.challenges.userCodes[level] = ex.starterCode;
    const pre = document.getElementById('chal-code-editor').nextElementSibling;
    if (pre) updateEditorHighlight(document.getElementById('chal-code-editor'), pre);
    document.getElementById('chal-results-panel').classList.remove('visible');
  }
};

window.runAndValidateCode = function() {
  const level = STATE.challenges.currentLevel;
  const ex = SITE_DATA.exercises.find(e => e.level === level);
  const code = document.getElementById('chal-code-editor').value;
  
  STATE.challenges.userCodes[level] = code;
  
  const resultsPanel = document.getElementById('chal-results-panel');
  if (!resultsPanel) return;
  
  const valResult = runHTMLCSSValidation(code, ex.testCases);
  
  let headerHtml = "";
  if (valResult.success) {
    headerHtml = `<div class="results-header" style="color: var(--color-success)">🎉 Todos os testes passaram com sucesso!</div>`;
    if (!STATE.progress.completedLevels.includes(level)) {
      STATE.progress.completedLevels.push(level);
    }
    saveProgress();
    setupChallenges();
  } else {
    headerHtml = `<div class="results-header" style="color: var(--color-error)">❌ Falha em alguns testes. Corrija o código!</div>`;
  }
  
  let casesHtml = valResult.results.map(res => {
    const statusClass = res.pass ? 'pass' : 'fail';
    const statusTxt = res.pass ? 'PASSOU' : 'FALHOU';
    return `
      <div class="test-case-row ${statusClass}">
        <span>${res.pass ? '✅' : '❌'} <strong>${escapeHtml(res.label)}</strong></span>
        <span class="status-indicator ${statusClass}">${statusTxt}</span>
      </div>
    `;
  }).join('');
  
  resultsPanel.innerHTML = `${headerHtml}<div class="test-cases-summary">${casesHtml}</div>`;
  resultsPanel.classList.add('visible');
};

// --- RELATÓRIO ESCOLAR DINÂMICO ---
window.updateStudentName = function(val) {
  STATE.progress.studentName = val;
  saveProgress();
};

function renderPerformanceReport() {
  const outputArea = document.getElementById('report-output-area');
  if (!outputArea) return;
  
  const name = STATE.progress.studentName || "";
  const theoryRead = STATE.progress.theoryRead.length;
  const quizScore = STATE.progress.quizCompleted ? STATE.progress.quizScore : 0;
  const challengesDone = STATE.progress.completedLevels.length;
  
  if (name.trim() === "") {
    outputArea.innerHTML = `<p style="text-align: center; color: var(--text-light); padding: 2rem;">⚠️ Digite o nome do aluno acima para gerar o relatório escolar completo.</p>`;
    return;
  }

  const percentage = Math.round(((theoryRead + (STATE.progress.quizCompleted ? 1 : 0) + challengesDone) / 20) * 100);

  outputArea.innerHTML = `
    <div style="border: 2px solid var(--primary-navy); padding: 2rem; border-radius: 12px; background: white;">
      <div style="display: flex; justify-content: space-between; border-bottom: 2px solid var(--primary-navy); padding-bottom: 1rem; margin-bottom: 1.5rem;">
        <div>
          <h3 style="color: var(--primary-navy); font-size: 1.5rem;">Relatório de Desempenho em Web Design</h3>
          <p style="color: var(--text-light); font-size: 0.85rem;">Disciplina: Lógica de Programação | HTML & CSS Expandido</p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 1.25rem; font-weight: bold; color: var(--accent-teal);">${percentage}% Progresso</div>
          <span style="font-size: 0.8rem; color: var(--text-light);">${new Date().toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
      <p style="font-size: 1.1rem; margin-bottom: 1rem;">Estudante: <strong style="color: var(--primary-navy);">${escapeHtml(name)}</strong></p>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
        <div style="background: #F8FAFC; padding: 1rem; border-radius: 8px; text-align: center;">
          <div style="font-size: 1.5rem; font-weight: bold;">${theoryRead}/9</div>
          <div style="font-size: 0.8rem; color: var(--text-light);">Tópicos Lidos</div>
        </div>
        <div style="background: #F8FAFC; padding: 1rem; border-radius: 8px; text-align: center;">
          <div style="font-size: 1.5rem; font-weight: bold;">${quizScore}/15</div>
          <div style="font-size: 0.8rem; color: var(--text-light);">Acertos em Quizzes</div>
        </div>
        <div style="background: #F8FAFC; padding: 1rem; border-radius: 8px; text-align: center;">
          <div style="font-size: 1.5rem; font-weight: bold;">${challengesDone}/10</div>
          <div style="font-size: 0.8rem; color: var(--text-light);">Desafios Concluídos</div>
        </div>
      </div>

      <button onclick="window.print()" class="primary-btn" style="float: right;">Imprimir Relatório 🖨️</button>
    </div>
  `;
}

// --- AVALIAÇÃO 1 ---
function setupExam() {
  enableTabKeyPress('exam-code-editor', onExamCodeInput);
}

window.unlockExam = function() {
  const pwdInput = document.getElementById('exam-password-input');
  const errorMsg = document.getElementById('exam-auth-error');
  if (!pwdInput) return;
  
  const pwd = pwdInput.value.trim();
  if (pwd === 'ecs101' || pwd === 'aula101') {
    STATE.progress.examUnlocked = true;
    errorMsg.style.display = 'none';
    saveProgress();
    refreshExamUI();
  } else {
    errorMsg.style.display = 'block';
    pwdInput.value = "";
  }
};

function refreshExamUI() {
  const authCard = document.getElementById('exam-auth-card');
  const contentCard = document.getElementById('exam-content-card');
  const successCard = document.getElementById('exam-success-card');
  const questionsArea = document.getElementById('exam-questions-area');
  
  if (!authCard || !contentCard || !successCard) return;

  if (STATE.progress.examSubmitted) {
    authCard.style.display = 'none';
    contentCard.style.display = 'none';
    successCard.style.display = 'block';
    return;
  }
  
  if (STATE.progress.examUnlocked) {
    authCard.style.display = 'none';
    contentCard.style.display = 'block';
    successCard.style.display = 'none';
    
    document.getElementById('exam-student-name-1').value = STATE.progress.examName1 || "";
    document.getElementById('exam-student-name-2').value = STATE.progress.examName2 || "";
    
    if ((STATE.progress.examName1 || "").trim() !== "") {
      questionsArea.style.display = 'block';
      renderExamList();
      loadExamQuestion(STATE.exam.currentQuestionId);
    } else {
      questionsArea.style.display = 'none';
    }
  } else {
    authCard.style.display = 'block';
    contentCard.style.display = 'none';
    successCard.style.display = 'none';
  }
}

window.onExamNameChange = function() {
  STATE.progress.examName1 = document.getElementById('exam-student-name-1').value;
  STATE.progress.examName2 = document.getElementById('exam-student-name-2').value;
  saveProgress();
  refreshExamUI();
};

function renderExamList() {
  const listContainer = document.getElementById('exam-list-container');
  if (!listContainer) return;
  
  let html = "";
  SITE_DATA.exam.forEach(q => {
    const isPass = STATE.progress.examResults[q.id] === true;
    const completedClass = isPass ? 'completed' : '';
    const activeClass = q.id === STATE.exam.currentQuestionId ? 'active' : '';
    
    html += `
      <button class="challenge-item ${activeClass} ${completedClass}" id="exam-item-${q.id}" onclick="selectExamQuestion(${q.id})">
        Questão ${q.id}: ${q.name.split(':')[1].trim()}
      </button>
    `;
  });
  listContainer.innerHTML = html;
}

window.selectExamQuestion = function(id) {
  STATE.exam.currentQuestionId = id;
  renderExamList();
  loadExamQuestion(id);
};

function loadExamQuestion(id) {
  const q = SITE_DATA.exam.find(item => item.id === id);
  if (!q) return;
  
  const descTitle = document.getElementById('exam-q-title');
  const descText = document.getElementById('exam-q-description');
  const editor = document.getElementById('exam-code-editor');
  
  if (descTitle && descText && editor) {
    descTitle.innerHTML = q.name;
    descText.innerHTML = q.description;
    editor.value = STATE.progress.examCodes[id] || q.starterCode;
    
    const pre = editor.nextElementSibling;
    if (pre) updateEditorHighlight(editor, pre);
  }
}

function onExamCodeInput(val) {
  STATE.progress.examCodes[STATE.exam.currentQuestionId] = val;
  saveProgress();
}

window.runAndValidateExamCode = function() {
  const id = STATE.exam.currentQuestionId;
  const q = SITE_DATA.exam.find(item => item.id === id);
  const code = document.getElementById('exam-code-editor').value;
  
  STATE.progress.examCodes[id] = code;
  const resultsPanel = document.getElementById('exam-results-panel');
  
  const valResult = runHTMLCSSValidation(code, q.testCases);
  STATE.progress.examResults[id] = valResult.success;
  saveProgress();
  renderExamList();
  
  if (resultsPanel) {
    let headerHtml = valResult.success ? `<div class="results-header" style="color: var(--color-success)">✅ Questão Aprovada!</div>` : `<div class="results-header" style="color: var(--color-error)">❌ Correção necessária.</div>`;
    resultsPanel.innerHTML = `${headerHtml}`;
    resultsPanel.classList.add('visible');
  }
};

window.openExamReview = function() {
  const modal = document.getElementById('exam-review-modal');
  if (modal) modal.style.display = 'flex';
};

window.closeExamReview = function() {
  const modal = document.getElementById('exam-review-modal');
  if (modal) modal.style.display = 'none';
};

window.submitExamFinal = function() {
  STATE.progress.examSubmitted = true;
  saveProgress();
  closeExamReview();
  refreshExamUI();
};
