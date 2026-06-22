# Skill File: Interactive HTML & CSS Learning SPA Builder
This file contains the architectural blueprint, code templates, and validation checklist for building an interactive single-page application (SPA) to teach HTML & CSS. Use this document as a guide for implementing similar educational platforms.

---

## 1. Architectural Structure
The project should follow a zero-dependency, static web structure optimized for offline usage in school labs:
*   `index.html`: The markup, UI tabs (Theory, Live Sandbox, Quiz, Challenges, Exam), and modals.
*   `style.css`: Clean, modern HSL-based typography, layout rules, and the crucial code editor overlapping CSS.
*   `data.js`: Centralized data store containing theoretical text, quiz questions, exercise starter codes, and test cases.
*   `validator.js`: The DOM parser engine that renders code into an iframe and validates its structure/styles.
*   `app.js`: Core controller handling navigation, local state persistence (`localStorage`), EmailJS API delivery, and teacher password-lock controls.

---

## 2. UI & UX Guidelines (VS Code Overlay Editor)
To make the coding area look like a real IDE (VS Code) with syntax highlighting while keeping it fully interactive and copy-paste secure:

### CSS Blueprint (Overlay Editor)
Add these styles to `style.css` to overlay a transparent `textarea` exactly on top of a colored `<pre><code>` tag, disabling selection on the backdrop to prevent copy-paste corruption.

```css
.editor-wrapper {
  position: relative;
  width: 100%;
  height: 250px;
  background-color: #1E293B; /* Slate dark background */
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
}

.editor-wrapper textarea,
.editor-wrapper pre {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 1rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
  font-size: 0.95rem !important;
  line-height: 1.5 !important;
  white-space: pre !important;
  overflow: auto !important;
  box-sizing: border-box !important;
  border: none !important;
  outline: none !important;
}

/* Interactive transparent textarea on top */
.editor-wrapper textarea {
  color: transparent !important;
  background: transparent !important;
  caret-color: #38BDF8 !important; /* Soft blue cursor */
  resize: none !important;
  z-index: 2;
  word-wrap: normal !important;
  user-select: text !important;
  -webkit-user-select: text !important;
}

/* Display highlighted code block underneath */
.editor-wrapper pre {
  color: #E2E8F0;
  z-index: 1;
  pointer-events: none;
  scrollbar-width: none !important;
  user-select: none !important; /* Prevents selecting HTML tags during copying */
  -webkit-user-select: none !important;
}

.editor-wrapper pre::-webkit-scrollbar {
  display: none !important;
}

.editor-wrapper pre code {
  font-family: inherit !important;
  font-size: inherit !important;
  line-height: inherit !important;
  white-space: inherit !important;
  color: inherit !important;
  background: transparent !important;
  padding: 0 !important;
  user-select: none !important;
}

/* Syntax colors (VS Code Style) */
.hl-tag { color: #F43F5E !important; font-weight: 600; }     /* HTML Tags (eg: h1, div, p) */
.hl-attr { color: #F59E0B !important; }                     /* HTML/CSS Attributes (eg: class, color) */
.hl-val { color: #10B981 !important; }                      /* Attribute values / CSS values */
.hl-selector { color: #38BDF8 !important; font-weight: bold; } /* CSS Selectors */
.hl-comment { color: #64748B !important; font-style: italic !important; }
```

### Tab Key Listener & Scroll Synchronization (JS Blueprint)
Include this helper in `app.js` to ensure the student can indent code with the Tab key (4 spaces) without losing focus, and that scrolling is synced between layers.

```javascript
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
      this.selectionStart = this.selectionEnd = start + spaces.length;

      if (onInputCallback) onInputCallback(this.value);
      
      const pre = this.nextElementSibling;
      if (pre) updateEditorHighlight(this, pre);
    }
  });
}

function syncEditorScroll(textarea, pre) {
  if (!textarea || !pre) return;
  pre.scrollTop = textarea.scrollTop;
  pre.scrollLeft = textarea.scrollLeft;
}
```

---

## 3. HTML & CSS Syntax Highlighting Tokenizer
To highlight HTML and CSS code on the fly without breaking nested tags, do not use sequential regex replacements. Use this one-pass tokenizer that handles tag parsing cleanly:

```javascript
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightHTMLandCSS(code) {
  let html = escapeHtml(code);

  // Tokenizer: Splits strings/values, comments, tags, properties and operators
  const tokenizer = /(&lt;!--.*?--&gt;|#.*|&lt;\/?[a-zA-Z0-9_-]+.*?&gt;|[a-zA-Z0-9_-]+\s*(?=:)|&quot;.*?&quot;|&#039;.*?&#039;|\.[a-zA-Z0-9_-]+|#[a-zA-Z0-9_-]+|[^\s\w]+|\s+)/g;
  
  const tokens = html.match(tokenizer) || [];
  
  const output = tokens.map(token => {
    // 1. HTML Comment / CSS Comment
    if (token.startsWith('&lt;!--') || token.startsWith('/*') || token.startsWith('#')) {
      return `<span class="hl-comment">${token}</span>`;
    }
    // 2. HTML Tag
    if (token.startsWith('&lt;')) {
      // Highlight attributes and tags inside
      let inner = token;
      // Color tags
      inner = inner.replace(/(&lt;\/?[a-zA-Z0-9_-]+)/g, '<span class="hl-tag">$1</span>');
      // Color attribute names
      inner = inner.replace(/(\s[a-zA-Z0-9_-]+)(?=\s*=)/g, '<span class="hl-attr">$1</span>');
      // Color attribute values
      inner = inner.replace(/(=(=?(?:&quot;.*?&quot;|&#039;.*?&#039;)))/g, '<span class="hl-val">$1</span>');
      // Closing tag bracket
      inner = inner.replace(/(&gt;)/g, '<span class="hl-tag">$1</span>');
      return inner;
    }
    // 3. CSS Selector (Class or ID)
    if (token.startsWith('.') || token.startsWith('#')) {
      return `<span class="hl-selector">${token}</span>`;
    }
    // 4. CSS Property (Word before colon)
    if (token.endsWith(':') && token.length > 1) {
      return `<span class="hl-attr">${token.slice(0, -1)}</span>:`;
    }
    
    return token;
  });

  return output.join('');
}
```

---

## 4. Live Iframe Renderer & DOM Validator
In HTML/CSS tutorials, code is validated by rendering it inside a sandboxed `<iframe>` and inspecting its DOM structure using standard query selectors.

### Validator Blueprint
Define validation requirements in `data.js` and run them in `validator.js`:

```javascript
// Exercise schema inside data.js
const exercise = {
  id: "chal-html-title",
  name: "Criando Títulos e Estilos",
  description: "Crie um título <h1> contendo o texto 'Minha Receita' e dê a ele a cor azul no CSS.",
  starterCode: `<!-- Escreva seu HTML e CSS aqui -->\n<style>\n  h1 {\n    color: black;\n  }\n</style>\n\n<h1>Minha Receita</h1>`,
  testCases: [
    {
      label: "Existe a tag h1?",
      validate: (doc) => doc.querySelector('h1') !== null
    },
    {
      label: "O texto do h1 é 'Minha Receita'?",
      validate: (doc) => doc.querySelector('h1')?.innerText.trim() === "Minha Receita"
    },
    {
      label: "A cor do h1 no CSS é azul?",
      validate: (doc) => {
        const h1 = doc.querySelector('h1');
        if (!h1) return false;
        const color = window.getComputedStyle(h1).color;
        // Returns true if color matches rgb(0, 0, 255) / "blue"
        return color === "rgb(0, 0, 255)" || color === "blue";
      }
    }
  ]
};

// Execution logic inside validator.js
function runHTMLCSSValidation(code, testCases) {
  // 1. Create a sandboxed hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  // 2. Render code inside
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(code);
  doc.close();

  const results = [];
  let allPass = true;

  // 3. Run validations on the iframe's DOM
  testCases.forEach(test => {
    try {
      const pass = test.validate(doc);
      if (!pass) allPass = false;
      results.push({ label: test.label, pass });
    } catch (e) {
      allPass = false;
      results.push({ label: test.label, pass: false, error: e.message });
    }
  });

  // 4. Remove iframe
  document.body.removeChild(iframe);
  return { success: allPass, results };
}
```

---

## 5. Security & Submission Controls (Teacher Passwords)
To enforce strict exam guidelines (duos, single submission, teacher override):

1.  **State Properties**: Store `examSubmitted` (boolean) and `examUnlocked` (boolean) in `localStorage`.
2.  **Locks**:
    *   If `examSubmitted` is `true`, disable navigation away from the success card, freeze all inputs, and hide editing buttons.
    *   If `examUnlocked` is `false`, display a password prompt overlay requiring `ecs101` or `aula101`.
3.  **Automatic EmailJS Config with Redundant Fallbacks**:
    When calling the EmailJS REST API, supply multiple target address fallbacks to bypass default email template settings and avoid the `the recipients address is empty` error.

```javascript
function submitHTMLCSSEmail(subject, reportText, studentNames) {
  const payload = {
    service_id: "service_9u2sac8", // Replace with your active Service ID
    template_id: "template_yew74so", // Replace with your active Template ID
    user_id: "krM3uc38ucTfqux-q",   // Replace with your Public Key
    template_params: {
      subject: subject,
      from_name: studentNames,
      message: reportText,
      // Target fallbacks to ensure "To Email" is never empty:
      to_email: "euclidespaim@gmail.com",
      email: "euclidespaim@gmail.com",
      from_email: "euclidespaim@gmail.com",
      reply_to: "euclidespaim@gmail.com",
      // Template placeholders matching standard contact setups:
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
    if (res.ok) alert("Avaliação entregue via EmailJS! 🎉");
    else throw new Error("Erro no servidor");
  })
  .catch(err => {
    alert("Falha no EmailJS. Tentando fallback local (mailto)...");
    window.open(`mailto:euclidespaim@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(reportText)}`, '_blank');
  });
}
```

### Reset Controls
Implement a complete reset button that clears names and code variables, locks the page, and requires the password:

```javascript
function resetEntireExam() {
  const pwd = prompt("Digite a senha do professor para RESETAR COMPLETAMENTE:");
  if (pwd === 'ecs101' || pwd === 'aula101') {
    localStorage.removeItem('python_condicionais_progress'); // Or target only exam keys
    alert("Dados limpos e prova trancada!");
    location.reload();
  } else if (pwd !== null) {
    alert("Senha incorreta!");
  }
}
```
