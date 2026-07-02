/**
 * Validador e Tokenizer de HTML & CSS
 * Projetado para renderizar o código de forma segura dentro de um iframe e inspecionar o DOM,
 * fornecendo validação em tempo real e realce de sintaxe VS Code Style.
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

  // Tokenizer: Divide comentários HTML, comentários CSS, tags, atributos, classes, IDs, valores e strings
  const tokenizer = /(&lt;!--[\s\S]*?--&gt;|\/\*[\s\S]*?\*\/|&lt;\/?[a-zA-Z0-9_-]+.*?&gt;|[a-zA-Z0-9_-]+\s*(?=:)|&quot;.*?&quot;|&#039;.*?&#039;|\.[a-zA-Z0-9_-]+|#[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]+|[^\s\w]+|\s+)/g;
  
  const tokens = html.match(tokenizer) || [];
  
  const output = tokens.map(token => {
    // 1. Comentários HTML ou CSS
    if (token.startsWith('&lt;!--') || token.startsWith('/*')) {
      return `<span class="hl-comment">${token}</span>`;
    }
    // 2. Tags HTML
    if (token.startsWith('&lt;')) {
      let inner = token;
      // Usa placeholders temporários para evitar que substituições subsequentes
      // alterem as classes das spans que nós mesmos injetamos.
      inner = inner.replace(/(&lt;\/?[a-zA-Z0-9_-]+)/g, '__TAG_OPEN__$1__TAG_CLOSE__');
      inner = inner.replace(/(\s[a-zA-Z0-9_-]+)(?=\s*=)/g, '__ATTR_OPEN__$1__ATTR_CLOSE__');
      inner = inner.replace(/(=(&quot;.*?&quot;|&#039;.*?&#039;|[a-zA-Z0-9_-]+))/g, '=__VAL_OPEN__$2__VAL_CLOSE__');
      inner = inner.replace(/(&gt;)/g, '__TAG_OPEN__$1__TAG_CLOSE__');
      
      // Converte os placeholders nas tags HTML finais
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
    // 4. Propriedades CSS (ex: color, padding, border)
    if (token.endsWith(':') && token.length > 1) {
      return `<span class="hl-attr">${token.slice(0, -1)}</span>:`;
    }
    
    return token;
  });

  return output.join('');
}

/**
 * Executa as validações DOM injetando o código HTML/CSS em um iframe sandboxed oculto.
 */
function runHTMLCSSValidation(code, testCases) {
  // 1. Cria o iframe sandboxed e oculto
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  // Define o sandbox para permitir execução segura e leitura do mesmo domínio local
  iframe.setAttribute('sandbox', 'allow-same-origin');
  document.body.appendChild(iframe);
  
  // 2. Escreve o código no iframe
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(code);
  doc.close();

  const results = [];
  let allPass = true;

  // 3. Executa as validações
  testCases.forEach(test => {
    try {
      // Executa a função passando o document do iframe.
      // Opcionalmente vincula o window do próprio iframe para facilitar getComputedStyle
      const pass = test.validate(doc);
      if (!pass) allPass = false;
      results.push({ label: test.label, pass });
    } catch (e) {
      allPass = false;
      results.push({ label: test.label, pass: false, error: e.message });
    }
  });

  // 4. Remove o iframe da tela
  document.body.removeChild(iframe);
  return { success: allPass, results };
}
