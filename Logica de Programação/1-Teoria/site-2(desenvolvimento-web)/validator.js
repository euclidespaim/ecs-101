/**
 * Validador e Tokenizer de HTML & CSS
 * Responsável por tokenizar e realçar a sintaxe do código sem corromper tags internas
 * e executar validações DOM em iframe sandboxed oculto.
 */

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function highlightHTMLandCSS(code) {
  let html = escapeHtml(code);

  // Tokenizer Regex: divide comentários, tags HTML, propriedades/atributos CSS, classes, IDs, strings e números
  const tokenizer = /(&lt;!--[\s\S]*?--&gt;|\/\*[\s\S]*?\*\/|&lt;\/?[a-zA-Z0-9_-]+.*?&gt;|[a-zA-Z0-9_-]+\s*(?=:)|&quot;.*?&quot;|&#039;.*?&#039;|\.[a-zA-Z0-9_-]+|#[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]+|[^\s\w]+|\s+)/g;
  
  const tokens = html.match(tokenizer) || [];
  
  const output = tokens.map(token => {
    // 1. Comentários HTML ou CSS
    if (token.startsWith('&lt;!--') || token.startsWith('/*')) {
      return `<span class="hl-comment">${token}</span>`;
    }
    // 2. Tags HTML (Usa a técnica de placeholders temporários para evitar recursão de substituições em spans)
    if (token.startsWith('&lt;')) {
      let inner = token;
      inner = inner.replace(/(&lt;\/?[a-zA-Z0-9_-]+)/g, '__TAG_OPEN__$1__TAG_CLOSE__');
      inner = inner.replace(/(\s[a-zA-Z0-9_-]+)(?=\s*=)/g, '__ATTR_OPEN__$1__ATTR_CLOSE__');
      inner = inner.replace(/(=(&quot;.*?&quot;|&#039;.*?&#039;|[a-zA-Z0-9_-]+))/g, '=__VAL_OPEN__$2__VAL_CLOSE__');
      inner = inner.replace(/(&gt;)/g, '__TAG_OPEN__$1__TAG_CLOSE__');
      
      // Substituição final dos placeholders por marcações span
      inner = inner
        .replace(/__TAG_OPEN__/g, '<span class="hl-tag">')
        .replace(/__TAG_CLOSE__/g, '</span>')
        .replace(/__ATTR_OPEN__/g, '<span class="hl-attr">')
        .replace(/__ATTR_CLOSE__/g, '</span>')
        .replace(/__VAL_OPEN__/g, '<span class="hl-val">')
        .replace(/__VAL_CLOSE__/g, '</span>');
      return inner;
    }
    // 3. Seletores CSS (Classe ou ID)
    if (token.startsWith('.') || token.startsWith('#')) {
      return `<span class="hl-selector">${token}</span>`;
    }
    // 4. Propriedades CSS (palavra seguida de dois pontos)
    if (token.endsWith(':') && token.length > 1) {
      return `<span class="hl-attr">${token.slice(0, -1)}</span>:`;
    }
    
    return token;
  });

  return output.join('');
}

/**
 * Executa as validações DOM injetando o código em um iframe sandboxed oculto.
 */
function runHTMLCSSValidation(code, testCases) {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.setAttribute('sandbox', 'allow-same-origin');
  document.body.appendChild(iframe);
  
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(code);
  doc.close();

  const results = [];
  let allPass = true;

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

  document.body.removeChild(iframe);
  return { success: allPass, results };
}
