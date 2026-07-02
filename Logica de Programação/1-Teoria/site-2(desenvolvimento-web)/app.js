// Estado global da aplicação
const STATE = {
  currentTab: 'home',
  progress: {
    theoryRead: [], // IDs dos conceitos lidos ("html", "css", "selectors", "boxmodel")
    quizCompleted: false,
    quizScore: 0,
    completedLevels: [], // Níveis de desafios completados (1 a 5)
    studentName: "",
    quizAttempts: 0,
    challengeAttempts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    // Propriedades da Avaliação
    examUnlocked: false,
    examName1: "",
    examName2: "",
    examSubmitted: false,
    examCodes: {},
    examResults: {}
  },
  quiz: {
    currentQuestionIndex: 0,
    answers: [], // Respostas dadas
    hasAnsweredCurrent: false
  },
  challenges: {
    currentLevel: 1,
    userCodes: {} // Guarda o código digitado de cada nível dos desafios
  },
  exam: {
    currentQuestionId: 1,
    userCodes: {} // Guarda o código da avaliação
  },
  simulator: {
    defaultCode: `<!-- Escreva seu HTML e CSS abaixo -->
<style>
  .cartao {
    background-color: #E0F2FE;
    border: 2px solid #0284C7;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    font-family: 'Outfit', sans-serif;
    max-width: 300px;
    margin: 20px auto;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  .titulo {
    color: #0369A1;
    margin-bottom: 8px;
  }
  .botao {
    background-color: #0284C7;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.2s;
  }
  .botao:hover {
    background-color: #0369A1;
  }
</style>

<div class="cartao">
  <h2 class="titulo">Olá, Mundo!</h2>
  <p>Altere os textos ou cores no editor para ver o preview mudar em tempo real!</p>
  <button class="botao">Clique Aqui</button>
</div>`,
    currentCode: ""
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
  const saved = localStorage.getItem('html_css_tutorial_progress');
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
  }
}

function saveProgress() {
  localStorage.setItem('html_css_tutorial_progress', JSON.stringify(STATE.progress));
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
    STATE.exam.userCodes = {};
    
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
  const theoryWeight = STATE.progress.theoryRead.length;
  const quizWeight = STATE.progress.quizCompleted ? 1 : 0;
  const challengeWeight = STATE.progress.completedLevels.length;
  
  const totalItems = 4 + 1 + 5; // 4 partes de teoria + 1 quiz + 5 desafios
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
  
  // Atualiza badges dos desafios no Início
  for (let lvl = 1; lvl <= 5; lvl++) {
    const badge = document.getElementById(`badge-lvl-${lvl}`);
    if (badge) {
      badge.className = 'level-badge';
      
      if (STATE.progress.completedLevels.includes(lvl)) {
        badge.classList.add('unlocked');
        badge.innerHTML = `🌟<br>Nível ${lvl}`;
      } else if (lvl === 1 || STATE.progress.completedLevels.includes(lvl - 1)) {
        badge.classList.add('current');
        badge.innerHTML = `🎮<br>Nível ${lvl}`;
      } else {
        badge.innerHTML = `🔒<br>Nível ${lvl}`;
      }
    }
  }

  // Banner final
  const banner = document.getElementById('final-achievement-banner');
  if (banner) {
    if (completedItems === totalItems) {
      banner.style.display = 'flex';
    } else {
      banner.style.display = 'none';
    }
  }
  
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
  // Se a prova já foi enviada, bloqueia o aluno na tela final de sucesso da avaliação
  if (STATE.progress.examSubmitted && tabId !== 'exam') {
    alert("Avaliação finalizada e entregue. A navegação foi travada!");
    switchTab('exam');
    return;
  }

  STATE.currentTab = tabId;
  
  // Botões ativos
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Conteúdos ativos
  document.querySelectorAll('.tab-content').forEach(content => {
    if (content.id === `${tabId}-tab`) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });

  // Ações de abertura
  if (tabId === 'challenges') {
    loadChallenge(STATE.challenges.currentLevel);
  } else if (tabId === 'report') {
    renderPerformanceReport();
  } else if (tabId === 'exam') {
    refreshExamUI();
  }
}

// --- INTERATIVIDADES DA TEORIA ---
function setupTheoryInteractivity() {
  const theoryTabs = document.querySelectorAll('.theory-tab-btn');
  theoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const conceptId = tab.getAttribute('data-concept');
      switchTheoryConcept(conceptId);
    });
  });
  
  switchTheoryConcept('html');
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
  const container = document.getElementById('theory-flowchart-area'); // Reusando o id de site-1 para compatibilidade no HTML
  if (!container) return;
  
  if (conceptId === 'html') {
    container.innerHTML = `
      <div class="interactive-theory-card">
        <h4 style="font-family: var(--font-title); color: var(--primary-navy); margin-bottom: 0.75rem;">Visão Anatômica de uma Tag</h4>
        <div style="background-color: #1E293B; padding: 1.25rem; border-radius: var(--border-radius-sm); font-family: var(--font-code); color: white; text-align: center; width: 100%; font-size: 0.9rem;">
          <span style="color: #F43F5E;">&lt;p</span> <span style="color: #F59E0B;">class</span>=<span style="color: #10B981;">"destaque"</span><span style="color: #F43F5E;">&gt;</span>Olá, Aluno!<span style="color: #F43F5E;">&lt;/p&gt;</span>
        </div>
        <div style="width: 100%; margin-top: 1rem; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.8rem; color: var(--text-light);">
          <div>👉 <strong style="color: #F43F5E;">&lt;p&gt; e &lt;/p&gt;</strong>: Abertura e fechamento de tag.</div>
          <div>👉 <strong style="color: #F59E0B;">class</strong>: Nome do atributo para identificar o estilo.</div>
          <div>👉 <strong style="color: #10B981;">"destaque"</strong>: Valor do atributo de classe.</div>
          <div>👉 <strong>Olá, Aluno!</strong>: O conteúdo interno da tag.</div>
        </div>
      </div>
    `;
  } else if (conceptId === 'css') {
    container.innerHTML = `
      <div class="interactive-theory-card">
        <h4 style="font-family: var(--font-title); color: var(--primary-navy); margin-bottom: 0.75rem;">Anatomia de Regras CSS</h4>
        <div style="background-color: #1E293B; padding: 1.25rem; border-radius: var(--border-radius-sm); font-family: var(--font-code); color: white; width: 100%; font-size: 0.9rem;">
          <span style="color: #38BDF8;">h1</span> {<br>
          &nbsp;&nbsp;<span style="color: #F59E0B;">color</span>: <span style="color: #10B981;">blue</span>;<br>
          &nbsp;&nbsp;<span style="color: #F59E0B;">font-size</span>: <span style="color: #10B981;">18px</span>;<br>
          }
        </div>
        <div style="width: 100%; margin-top: 1rem; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.8rem; color: var(--text-light);">
          <div>👉 <strong style="color: #38BDF8;">h1</strong>: O seletor (quem receberá a pintura).</div>
          <div>👉 <strong style="color: #F59E0B;">color e font-size</strong>: Propriedades de estilo.</div>
          <div>👉 <strong style="color: #10B981;">blue e 18px</strong>: Valores aplicados às propriedades.</div>
          <div>👉 <strong>{} e ;</strong>: Abre o bloco de estilo e separa as linhas de regras.</div>
        </div>
      </div>
    `;
  } else if (conceptId === 'selectors') {
    container.innerHTML = `
      <div class="interactive-theory-card">
        <h4 style="font-family: var(--font-title); color: var(--primary-navy); margin-bottom: 0.5rem;">Seletor Sandbox</h4>
        <p style="font-size: 0.75rem; color: var(--text-light); margin-bottom: 1rem; text-align: center;">Clique nos botões seletores para iluminar os elementos correspondentes na caixa abaixo!</p>
        
        <div class="selector-sandbox">
          <div class="selector-buttons">
            <button class="btn-choice" onclick="runSelectorDemo('p')">p (Tag)</button>
            <button class="btn-choice" onclick="runSelectorDemo('.azul')">.azul (Classe)</button>
            <button class="btn-choice" onclick="runSelectorDemo('#unico')">#unico (ID)</button>
            <button class="btn-choice" onclick="runSelectorDemo('clear')">Limpar ✨</button>
          </div>
          
          <div class="selector-demo-area" id="selector-demo-container">
            <p class="demo-p">Parágrafo padrão &lt;p&gt;</p>
            <p class="demo-p azul">Parágrafo azul &lt;p class="azul"&gt;</p>
            <p class="demo-p" id="unico">Parágrafo único &lt;p id="unico"&gt;</p>
          </div>
        </div>
      </div>
    `;
  } else if (conceptId === 'boxmodel') {
    container.innerHTML = `
      <div class="interactive-theory-card">
        <h4 style="font-family: var(--font-title); color: var(--primary-navy); margin-bottom: 0.5rem;">Inspetor Visual do Box Model</h4>
        <p style="font-size: 0.75rem; color: var(--text-light); margin-bottom: 1rem; text-align: center;">Ajuste as réguas abaixo e veja como a Margin, Border e Padding afetam a caixa!</p>
        
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
  }
}

// Lógica auxiliar do Sandbox de Seletores
window.runSelectorDemo = function(selector) {
  const container = document.getElementById('selector-demo-container');
  if (!container) return;
  
  // Limpa marcações anteriores
  container.querySelectorAll('.demo-p').forEach(el => {
    el.classList.remove('highlighted-element');
  });
  
  // Marca os botões ativos
  const buttons = document.querySelectorAll('.selector-buttons button');
  buttons.forEach(btn => {
    if (btn.innerText.includes(selector)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (selector === 'clear') {
    return;
  }

  // Ilumina novos elementos
  if (selector === 'p') {
    container.querySelectorAll('.demo-p').forEach(el => el.classList.add('highlighted-element'));
  } else if (selector === '.azul') {
    container.querySelectorAll('.azul').forEach(el => el.classList.add('highlighted-element'));
  } else if (selector === '#unico') {
    const el = container.querySelector('#unico');
    if (el) el.classList.add('highlighted-element');
  }
};

// Lógica auxiliar do Box Model
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
    elBorder.style.padding = "6px"; // base spacing
  }
  if (elPadding) elPadding.style.padding = padVal + "px";
};

// --- ABA SIMULADOR (SANDBOX) ---
function setupSimulator() {
  const textarea = document.getElementById('sim-code-editor-textarea'); // note o ID específico
  const iframe = document.getElementById('sim-live-preview-iframe');
  
  if (!textarea || !iframe) return;

  // Carrega código default
  if (!STATE.simulator.currentCode) {
    STATE.simulator.currentCode = STATE.simulator.defaultCode;
  }
  textarea.value = STATE.simulator.currentCode;

  // Highlight inicial
  const pre = textarea.nextElementSibling;
  if (pre) {
    updateEditorHighlight(textarea, pre);
  }

  // Roda renderizador inicial
  renderIframePreview(iframe, textarea.value);

  // Escuta escrita
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
    console.error("Erro na renderização do sandbox", e);
  }
}

// --- AUXILIARES DO EDITOR ---
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
      const spaces = "  "; // 2 espaços é o padrão mais limpo para HTML/CSS
      this.value = this.value.substring(0, start) + spaces + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + spaces.length;

      if (onInputCallback) onInputCallback(this.value);
      
      const pre = this.nextElementSibling;
      if (pre) updateEditorHighlight(this, pre);
    }
  });
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
  
  let codeHtml = "";
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
    const isCode = option.includes('<') || option.includes('.') || option.includes('#') || option.includes('{');
    const codeClass = isCode ? 'code-font' : '';
    return `<button class="quiz-option ${codeClass}" data-idx="${idx}">${escapeHtml(option)}</button>`;
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
      if (STATE.quiz.hasAnsweredCurrent) return;
      const selectedIdx = parseInt(opt.getAttribute('data-idx'));
      selectQuizOption(selectedIdx, opt);
    });
  });
  
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
  
  nextBtn.style.display = 'flex';
}

function advanceQuiz() {
  const total = SITE_DATA.quiz.length;
  
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
  SITE_DATA.quiz.forEach((q, idx) => {
    if (STATE.quiz.answers[idx] === q.correctAnswer) {
      correctCount++;
    }
  });
  
  STATE.progress.quizCompleted = true;
  STATE.progress.quizScore = correctCount;
  saveProgress();
  
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
        Seu progresso foi salvo com sucesso! Você pode refazer para melhorar a sua pontuação.
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
    alert("🔒 Desafio Bloqueado! Você precisa concluir o nível anterior para desbloquear este.");
    return;
  }
  
  STATE.challenges.currentLevel = level;
  
  document.querySelectorAll('.challenge-item').forEach(btn => {
    const btnLvl = parseInt(btn.id.replace('chal-item-', ''));
    btn.classList.remove('active');
    if (btnLvl === level) {
      btn.classList.add('active');
    }
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
    
    if (STATE.challenges.userCodes[level]) {
      editor.value = STATE.challenges.userCodes[level];
    } else {
      editor.value = ex.starterCode;
    }
    
    const pre = editor.nextElementSibling;
    if (pre) {
      updateEditorHighlight(editor, pre);
    }
  }
  
  if (resultsPanel) {
    resultsPanel.classList.remove('visible');
  }
}

function onCodeEditorInput(value) {
  STATE.challenges.userCodes[STATE.challenges.currentLevel] = value;
}

window.resetChallengeCode = function() {
  const level = STATE.challenges.currentLevel;
  const ex = SITE_DATA.exercises.find(e => e.level === level);
  if (ex && confirm("Deseja voltar o código para o estado original?")) {
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
  
  // Contabiliza tentativa
  if (!STATE.progress.challengeAttempts) STATE.progress.challengeAttempts = {};
  STATE.progress.challengeAttempts[level] = (STATE.progress.challengeAttempts[level] || 0) + 1;
  
  const resultsPanel = document.getElementById('chal-results-panel');
  if (!resultsPanel) return;
  
  // Roda validações DOM
  const valResult = runHTMLCSSValidation(code, ex.testCases);
  
  let headerHtml = "";
  if (valResult.success) {
    headerHtml = `<div class="results-header" style="color: var(--color-success)">🎉 Muito Bem! Todos os testes passaram!</div>`;
    if (!STATE.progress.completedLevels.includes(level)) {
      STATE.progress.completedLevels.push(level);
    }
    saveProgress();
    setupChallenges(); // Recarrega botões laterais com o check ✓
  } else {
    headerHtml = `<div class="results-header" style="color: var(--color-error)">❌ Alguns testes falharam. Tente novamente!</div>`;
  }
  
  let casesHtml = valResult.results.map(res => {
    const statusClass = res.pass ? 'pass' : 'fail';
    const statusTxt = res.pass ? 'PASSOU' : 'FALHOU';
    return `
      <div class="test-case-row ${statusClass}">
        <div class="test-case-info">
          <span>${res.pass ? '✅' : '❌'}</span>
          <strong>${escapeHtml(res.label)}</strong>
        </div>
        <span class="status-indicator ${statusClass}">${statusTxt}</span>
      </div>
    `;
  }).join('');
  
  resultsPanel.innerHTML = `
    ${headerHtml}
    <div class="test-cases-summary">
      ${casesHtml}
    </div>
  `;
  resultsPanel.classList.add('visible');
};

// --- ABA RELATÓRIO DE DESEMPENHO ---
window.updateStudentName = function(val) {
  STATE.progress.studentName = val;
  saveProgress();
};

function renderPerformanceReport() {
  const outputArea = document.getElementById('report-output-area');
  if (!outputArea) return;
  
  const name = STATE.progress.studentName || "";
  
  // Contabiliza estatísticas
  const theoryRead = STATE.progress.theoryRead.length;
  const quizScore = STATE.progress.quizCompleted ? STATE.progress.quizScore : 0;
  const challengesDone = STATE.progress.completedLevels.length;
  
  const totalSteps = 4 + 1 + 5;
  const stepsDone = theoryRead + (STATE.progress.quizCompleted ? 1 : 0) + challengesDone;
  const percentage = Math.round((stepsDone / totalSteps) * 100);
  
  let reportHtml = "";
  
  if (name.trim() === "") {
    reportHtml = `
      <div style="text-align: center; padding: 2rem; color: var(--text-light);">
        <p>⚠️ Digite o nome do aluno acima para visualizar e gerar o relatório escolar completo.</p>
      </div>
    `;
  } else {
    // Diagnósticos baseados nas notas e progresso
    let diagnostic = "";
    let weaknesses = "";
    let strengths = "";
    let suggestions = "";
    
    // Strengths
    if (challengesDone >= 4) {
      strengths = "Excelente dedicação e compreensão na escrita de códigos estruturados HTML/CSS. Consegue criar caixas, aplicar classes e editar propriedades de Box Model de forma autônoma.";
    } else if (challengesDone >= 2) {
      strengths = "Boa compreensão na criação de tags e aplicação de estilos CSS básicos, necessitando de pouca ajuda para estruturar o cabeçalho e colorir elementos.";
    } else {
      strengths = "O aluno compreende a diferença básica de tags e estilos e iniciou a resolução dos desafios iniciais.";
    }
    
    // Weaknesses & Suggestions
    if (quizScore < 3) {
      weaknesses = "Dificuldade na assimilação de termos técnicos (como a diferença exata entre Padding e Margin, ou o sinal de seletores de classe e ID).";
      suggestions = "Refazer a leitura da aba de Teoria, com foco especial na seção de Box Model e Seletores. Realizar o Quiz novamente para fixar os nomes das propriedades.";
    } else if (challengesDone < 4) {
      weaknesses = "Dificuldade em aplicar regras complexas do Box Model ou na criação e aninhamento correto de links em parágrafos.";
      suggestions = "Praticar mais exercícios sobre links aninhados e margens na aba Simulador e tentar concluir os níveis 4 e 5 da trilha de Desafios.";
    } else {
      weaknesses = "Nenhuma fraqueza crítica detectada. O aluno atingiu ótimo entendimento de desenvolvimento web básico.";
      suggestions = "Avançar para a realização da Avaliação 1. Experimentar criar layouts flexíveis na aba Simulador livre.";
    }
    
    diagnostic = quizScore >= 4 && challengesDone === 5 
      ? "Desempenho Excelente. O estudante domina a sintaxe HTML/CSS básica e concluiu com facilidade toda a trilha pedagógica."
      : "Desempenho em Evolução. O estudante está construindo sólida base em programação visual e estruturada, devendo focar em detalhes de estilização.";

    // Verificação de Prova
    let examReportHtml = "";
    if (STATE.progress.examSubmitted) {
      let examCorrect = 0;
      for (let q = 1; q <= 3; q++) {
        if (STATE.progress.examResults[q]) examCorrect++;
      }
      examReportHtml = `
        <div style="margin-top: 1.5rem; background: var(--accent-teal-light); border: 1.5px solid var(--accent-teal); border-radius: var(--border-radius-sm); padding: 1.25rem;">
          <h4 style="color: var(--accent-teal-hover); margin-bottom: 0.5rem;">📋 Avaliação 1 Entregue</h4>
          <p style="font-size: 0.95rem; color: #0F766E;">
            A dupla <strong>${STATE.progress.examName1} ${STATE.progress.examName2 ? ' & ' + STATE.progress.examName2 : ''}</strong> concluiu a prova com <strong>${examCorrect} de 3 questões corretas</strong> nos testes automáticos.
          </p>
        </div>
      `;
    } else {
      examReportHtml = `
        <div style="margin-top: 1.5rem; background: #F1F5F9; border: 1.5px dashed var(--border-color); border-radius: var(--border-radius-sm); padding: 1.25rem; text-align: center;">
          <p style="font-size: 0.9rem; color: var(--text-light);">⚠️ Avaliação 1 ainda não foi realizada ou enviada por esta dupla.</p>
        </div>
      `;
    }

    reportHtml = `
      <div class="print-only-border">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--primary-navy); padding-bottom: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="font-family: var(--font-title); color: var(--primary-navy); font-size: 1.8rem; margin: 0;">Relatório de Aproveitamento Escolar</h3>
            <p style="color: var(--text-light); font-size: 0.9rem;">Disciplina: Lógica de Programação | Web Design 101</p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.2rem; font-weight: bold; color: var(--accent-teal);">${percentage}% Concluído</div>
            <p style="font-size: 0.8rem; color: var(--text-light);">${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Aluno: <strong style="color: var(--primary-navy); font-size: 1.25rem;">${escapeHtml(name)}</strong></p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
          <div style="background-color: #F8FAFC; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); padding: 1rem; text-align: center;">
            <div style="font-size: 1.75rem; font-weight: bold; color: var(--primary-navy);">${theoryRead}/4</div>
            <div style="font-size: 0.8rem; color: var(--text-light); font-weight: 500;">Tópicos de Teoria Lidos</div>
          </div>
          <div style="background-color: #F8FAFC; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); padding: 1rem; text-align: center;">
            <div style="font-size: 1.75rem; font-weight: bold; color: var(--primary-navy);">${quizScore}/5</div>
            <div style="font-size: 0.8rem; color: var(--text-light); font-weight: 500;">Acertos no Quiz de Lógica</div>
          </div>
          <div style="background-color: #F8FAFC; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); padding: 1rem; text-align: center;">
            <div style="font-size: 1.75rem; font-weight: bold; color: var(--primary-navy);">${challengesDone}/5</div>
            <div style="font-size: 0.8rem; color: var(--text-light); font-weight: 500;">Desafios de Código Concluídos</div>
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 1.25rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
          <div>
            <h4 style="color: var(--primary-navy); font-family: var(--font-title); margin-bottom: 0.25rem;">Diagnóstico do Professor:</h4>
            <p style="color: #334155; font-size: 0.95rem;">${diagnostic}</p>
          </div>
          <div>
            <h4 style="color: var(--primary-navy); font-family: var(--font-title); margin-bottom: 0.25rem;">Pontos Fortes demonstrados:</h4>
            <p style="color: #334155; font-size: 0.95rem;">${strengths}</p>
          </div>
          <div>
            <h4 style="color: var(--primary-navy); font-family: var(--font-title); margin-bottom: 0.25rem;">Oportunidades de Melhoria:</h4>
            <p style="color: #334155; font-size: 0.95rem;">${weaknesses}</p>
          </div>
          <div>
            <h4 style="color: var(--primary-navy); font-family: var(--font-title); margin-bottom: 0.25rem;">Próximos Passos recomendados:</h4>
            <p style="color: #334155; font-size: 0.95rem;">${suggestions}</p>
          </div>
        </div>

        ${examReportHtml}
        
        <div style="margin-top: 2.5rem; display: flex; gap: 1rem; justify-content: flex-end;" class="no-print">
          <button onclick="window.print()" class="primary-btn" style="background-color: var(--primary-navy);">Imprimir Relatório 🖨️</button>
        </div>
      </div>
    `;
  }
  
  outputArea.innerHTML = reportHtml;
}

// --- ABA AVALIAÇÃO (SENHA E PROVA) ---
function setupExam() {
  enableTabKeyPress('exam-code-editor', onExamCodeInput);
  
  const textarea = document.getElementById('exam-code-editor');
  if (textarea) {
    textarea.addEventListener('scroll', () => {
      syncEditorScroll(textarea, textarea.nextElementSibling);
    });
  }
}

// Função auxiliar para calcular o hash SHA-256 usando implementação pure JS (fallback seguro)
function sha256js(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  
  const words = [];
  const asciiLength = ascii.length;
  for (let i = 0; i < asciiLength; i++) {
    words[i >> 2] |= (ascii.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  }
  
  const maxWord = ((asciiLength + 8) >> 6) * 16 + 15;
  words[maxWord] = asciiLength * 8;
  words[(asciiLength >> 2)] |= 0x80 << (24 - (asciiLength % 4) * 8);
  for (let i = (asciiLength >> 2) + 1; i < maxWord; i++) {
    words[i] = 0;
  }
  
  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;
  
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  
  const w = new Array(64);
  const totalWords = words.length;
  for (let i = 0; i < totalWords; i += 16) {
    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;
    
    for (let j = 0; j < 64; j++) {
      if (j < 16) {
        w[j] = words[i + j] || 0;
      } else {
        const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }
      
      const ch = (e & f) ^ (~e & g);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const temp1 = (h + S1 + ch + k[j] + w[j]) | 0;
      const temp2 = (S0 + maj) | 0;
      
      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }
    
    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
    h5 = (h5 + f) | 0;
    h6 = (h6 + g) | 0;
    h7 = (h7 + h) | 0;
  }
  
  function hex(num) {
    let s = "";
    for (let i = 0; i < 4; i++) {
      s += ((num >>> (24 - i * 8)) & 0xff).toString(16).padStart(2, '0');
    }
    return s;
  }
  
  return hex(h0) + hex(h1) + hex(h2) + hex(h3) + hex(h4) + hex(h5) + hex(h6) + hex(h7);
}

// Função auxiliar assíncrona para calcular o hash SHA-256 de uma string
async function sha256(message) {
  try {
    if (window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    }
  } catch (e) {
    console.warn("crypto.subtle não disponível ou falhou, usando fallback em JS puro.", e);
  }
  return sha256js(message);
}

window.unlockExam = async function() {
  const pwdInput = document.getElementById('exam-password-input');
  const errorMsg = document.getElementById('exam-auth-error');
  if (!pwdInput) return;
  
  const pwd = pwdInput.value.trim();
  const hash = await sha256(pwd);
  const expectedHash = "08c27d176d710371afef9924eb32c012803eef04a6647d3febf69422f27a294b"; // Hash de acesso da Avaliação 1
  
  if (hash === expectedHash) {
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

  // Se já foi enviada
  if (STATE.progress.examSubmitted) {
    authCard.style.display = 'none';
    contentCard.style.display = 'none';
    successCard.style.display = 'block';
    
    // Preenche a caixa de cópia do relatório
    const reportTextarea = document.getElementById('exam-report-text-copy');
    if (reportTextarea) {
      reportTextarea.value = generateExamReportString();
    }
    return;
  }
  
  // Se está desbloqueada
  if (STATE.progress.examUnlocked) {
    authCard.style.display = 'none';
    contentCard.style.display = 'block';
    successCard.style.display = 'none';
    
    // Recupera nomes
    document.getElementById('exam-student-name-1').value = STATE.progress.examName1 || "";
    document.getElementById('exam-student-name-2').value = STATE.progress.examName2 || "";
    
    // Se os nomes estão preenchidos, mostra workspace
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
  const name1 = document.getElementById('exam-student-name-1').value;
  const name2 = document.getElementById('exam-student-name-2').value;
  
  STATE.progress.examName1 = name1;
  STATE.progress.examName2 = name2;
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
  const resultsPanel = document.getElementById('exam-results-panel');
  
  if (descTitle && descText && editor) {
    descTitle.innerHTML = q.name;
    descText.innerHTML = q.description;
    
    if (STATE.progress.examCodes[id]) {
      editor.value = STATE.progress.examCodes[id];
    } else {
      editor.value = q.starterCode;
    }
    
    const pre = editor.nextElementSibling;
    if (pre) {
      updateEditorHighlight(editor, pre);
    }
  }
  
  if (resultsPanel) {
    resultsPanel.classList.remove('visible');
  }
}

function onExamCodeInput(val) {
  STATE.progress.examCodes[STATE.exam.currentQuestionId] = val;
  saveProgress();
}

window.resetExamCode = function() {
  const id = STATE.exam.currentQuestionId;
  const q = SITE_DATA.exam.find(item => item.id === id);
  if (q && confirm("Deseja voltar o código da questão para o original?")) {
    document.getElementById('exam-code-editor').value = q.starterCode;
    STATE.progress.examCodes[id] = q.starterCode;
    saveProgress();
    const pre = document.getElementById('exam-code-editor').nextElementSibling;
    if (pre) updateEditorHighlight(document.getElementById('exam-code-editor'), pre);
    document.getElementById('exam-results-panel').classList.remove('visible');
  }
};

window.runAndValidateExamCode = function() {
  const id = STATE.exam.currentQuestionId;
  const q = SITE_DATA.exam.find(item => item.id === id);
  const code = document.getElementById('exam-code-editor').value;
  
  STATE.progress.examCodes[id] = code;
  
  const resultsPanel = document.getElementById('exam-results-panel');
  if (!resultsPanel) return;
  
  const valResult = runHTMLCSSValidation(code, q.testCases);
  
  // Salva resultado no progresso
  STATE.progress.examResults[id] = valResult.success;
  saveProgress();
  renderExamList(); // Recarrega checks laterais
  
  let headerHtml = "";
  if (valResult.success) {
    headerHtml = `<div class="results-header" style="color: var(--color-success)">✅ Questão correta! Passou nos testes.</div>`;
  } else {
    headerHtml = `<div class="results-header" style="color: var(--color-error)">❌ Falhou em alguns testes. Corrija seu código!</div>`;
  }
  
  let casesHtml = valResult.results.map(res => {
    const statusClass = res.pass ? 'pass' : 'fail';
    const statusTxt = res.pass ? 'PASSOU' : 'FALHOU';
    return `
      <div class="test-case-row ${statusClass}">
        <div class="test-case-info">
          <span>${res.pass ? '✅' : '❌'}</span>
          <strong>${escapeHtml(res.label)}</strong>
        </div>
        <span class="status-indicator ${statusClass}">${statusTxt}</span>
      </div>
    `;
  }).join('');
  
  resultsPanel.innerHTML = `
    ${headerHtml}
    <div class="test-cases-summary">
      ${casesHtml}
    </div>
  `;
  resultsPanel.classList.add('visible');
};

// --- MODAL DE REVISÃO E ENVIO ---
window.openExamReview = function() {
  const modal = document.getElementById('exam-review-modal');
  if (!modal) return;
  
  // Roda validação final em todas as questões para garantir integridade antes do modal abrir
  SITE_DATA.exam.forEach(q => {
    const code = STATE.progress.examCodes[q.id] || q.starterCode;
    const res = runHTMLCSSValidation(code, q.testCases);
    STATE.progress.examResults[q.id] = res.success;
  });
  saveProgress();
  
  // Nome da dupla
  const info = document.getElementById('exam-review-student-info');
  const d1 = STATE.progress.examName1 || "";
  const d2 = STATE.progress.examName2 || "";
  info.innerHTML = `
    <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Dupla: <strong style="color: var(--primary-navy);">${escapeHtml(d1)} ${d2 ? ' e ' + escapeHtml(d2) : '(Individual)'}</strong></p>
  `;
  
  // Lista códigos e status
  const listArea = document.getElementById('exam-review-questions-list');
  let html = "";
  SITE_DATA.exam.forEach(q => {
    const code = STATE.progress.examCodes[q.id] || q.starterCode;
    const isCorrect = STATE.progress.examResults[q.id] === true;
    const badge = isCorrect 
      ? `<span class="status-indicator pass" style="padding: 2px 8px; font-size: 0.75rem;">CORRETA (100% dos testes)</span>`
      : `<span class="status-indicator fail" style="padding: 2px 8px; font-size: 0.75rem;">INCOMPLETA / ERROS</span>`;
      
    html += `
      <div class="review-q-item">
        <div class="review-q-header">
          <span>${q.name}</span>
          ${badge}
        </div>
        <div class="review-q-body">
          <pre class="review-q-code"><code>${escapeHtml(code)}</code></pre>
        </div>
      </div>
    `;
  });
  listArea.innerHTML = html;
  
  modal.style.display = 'flex';
};

window.closeExamReview = function() {
  const modal = document.getElementById('exam-review-modal');
  if (modal) modal.style.display = 'none';
};

// Envio final para o professor via EmailJS com fallback mailto
window.submitExamFinal = function() {
  const d1 = STATE.progress.examName1 || "";
  const d2 = STATE.progress.examName2 || "";
  const studentNames = `${d1} ${d2 ? ' e ' + d2 : ''}`;
  const subject = `Prova HTML/CSS - ${studentNames}`;
  const reportText = generateExamReportString();
  
  closeExamReview();
  
  // API Payload conforme o checklist
  const payload = {
    service_id: "service_9u2sac8",
    template_id: "template_yew74so",
    user_id: "krM3uc38ucTfqux-q",
    template_params: {
      subject: subject,
      from_name: studentNames,
      message: reportText,
      // Fallbacks redundantes para evitar destinatário vazio
      to_email: "euclidespaim@gmail.com",
      email: "euclidespaim@gmail.com",
      from_email: "euclidespaim@gmail.com",
      reply_to: "euclidespaim@gmail.com",
      name: studentNames,
      title: subject
    }
  };

  fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => {
    if (res.ok) {
      alert("Avaliação entregue via EmailJS com sucesso! 🎉");
      onExamSubmittedSuccessfully();
    } else {
      throw new Error("Erro no servidor");
    }
  })
  .catch(err => {
    alert("Falha no EmailJS. Tentando fallback local (mailto)...");
    window.open(`mailto:euclidespaim@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(reportText)}`, '_blank');
    onExamSubmittedSuccessfully();
  });
};

function onExamSubmittedSuccessfully() {
  STATE.progress.examSubmitted = true;
  saveProgress();
  refreshExamUI();
}

function generateExamReportString() {
  const d1 = STATE.progress.examName1 || "";
  const d2 = STATE.progress.examName2 || "";
  const studentNames = `${d1} ${d2 ? ' e ' + d2 : ''}`;
  
  let qReport = "";
  let totalCorrect = 0;
  SITE_DATA.exam.forEach(q => {
    const code = STATE.progress.examCodes[q.id] || q.starterCode;
    const isCorrect = STATE.progress.examResults[q.id] === true;
    if (isCorrect) totalCorrect++;
    
    qReport += `=========================================\n`;
    qReport += `${q.name}\n`;
    qReport += `Status: ${isCorrect ? 'APROVADO nos testes DOM' : 'REPROVADO nos testes DOM'}\n`;
    qReport += `Código Enviado:\n\n${code}\n\n`;
  });
  
  return `RELATÓRIO DA AVALIAÇÃO DE DESENVOLVIMENTO WEB (HTML/CSS)
Data de Conclusão: ${new Date().toLocaleString('pt-BR')}
Integrantes da Dupla: ${studentNames}

Pontuação Automática: ${totalCorrect} de 3 questões resolvidas corretas.

Códigos das Questões:
${qReport}
=========================================
FIM DO RELATÓRIO.`;
}

// Outros comandos auxiliares pós-envio
window.copyExamReportToClipboard = function() {
  const text = document.getElementById('exam-report-text-copy')?.value || "";
  navigator.clipboard.writeText(text)
    .then(() => {
      const copyBtn = document.getElementById('exam-copy-btn');
      if (copyBtn) {
        copyBtn.innerText = "Copiado! ✓";
        setTimeout(() => copyBtn.innerText = "Copiar Relatório 📋", 2000);
      }
    })
    .catch(err => alert("Falha ao copiar: " + err));
};

window.downloadExamReportAsTxt = function() {
  const text = document.getElementById('exam-report-text-copy')?.value || "";
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  const d1 = STATE.progress.examName1 || "aluno";
  const safeName = d1.toLowerCase().replace(/[^a-z0-9]/g, "_");
  link.download = `avaliacao_html_css_${safeName}.txt`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

window.resetSubmittedExam = async function() {
  const pwd = prompt("Digite a senha do professor para DESBLOQUEAR A PROVA:");
  if (pwd === null) return;
  
  const hash = await sha256(pwd.trim());
  const expectedHash = "4b4b86eaad7940281b2e662e9fc016d8b381ee0ceef3f7601c2114a47c2808c3"; // Hash de liberação/reset da avaliação
  
  if (hash === expectedHash) {
    STATE.progress.examSubmitted = false;
    saveProgress();
    refreshExamUI();
    alert("Prova liberada para novas edições e reenvio!");
  } else {
    alert("Senha incorreta!");
  }
};

window.resetEntireExam = async function() {
  const pwd = prompt("Digite a senha do professor para RESETAR A PROVA COMPLETAMENTE:");
  if (pwd === null) return;
  
  const hash = await sha256(pwd.trim());
  const expectedHash = "4b4b86eaad7940281b2e662e9fc016d8b381ee0ceef3f7601c2114a47c2808c3"; // Hash de liberação/reset da avaliação
  
  if (hash === expectedHash) {
    STATE.progress.examSubmitted = false;
    STATE.progress.examUnlocked = false;
    STATE.progress.examName1 = "";
    STATE.progress.examName2 = "";
    STATE.progress.examCodes = {};
    STATE.progress.examResults = {};
    saveProgress();
    
    // limpa textarea do auth
    const pwdInput = document.getElementById('exam-password-input');
    if (pwdInput) pwdInput.value = "";
    
    location.reload();
  } else {
    alert("Senha incorreta!");
  }
};

window.retryMailtoSubmit = function() {
  const d1 = STATE.progress.examName1 || "";
  const d2 = STATE.progress.examName2 || "";
  const studentNames = `${d1} ${d2 ? ' e ' + d2 : ''}`;
  const subject = `Prova HTML/CSS - ${studentNames}`;
  const reportText = generateExamReportString();
  
  window.open(`mailto:euclidespaim@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(reportText)}`, '_blank');
};
