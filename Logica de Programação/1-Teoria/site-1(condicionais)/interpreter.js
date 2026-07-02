/**
 * Mini-interpretador Python para JavaScript
 * Projetado para validar e executar estruturas condicionais básicas (if, elif, else, print, atribuições)
 * com foco educacional (fornece mensagens de erro extremamente didáticas).
 */

function translateCondition(cond) {
  let result = "";
  let inString = false;
  let strChar = null;
  let i = 0;
  
  function isWordChar(char) {
    return char && /[a-zA-Z0-9_]/.test(char);
  }
  
  while (i < cond.length) {
    let char = cond[i];
    
    // Trata aspas para evitar substituições indesejadas dentro de strings
    if ((char === '"' || char === "'") && (i === 0 || cond[i-1] !== '\\')) {
      if (!inString) {
        inString = true;
        strChar = char;
      } else if (char === strChar) {
        inString = false;
        strChar = null;
      }
      result += char;
      i++;
      continue;
    }
    
    if (inString) {
      result += char;
      i++;
    } else {
      let sub = cond.slice(i);
      let prevChar = i > 0 ? cond[i - 1] : null;
      let isPrevWordChar = isWordChar(prevChar);
      
      // Apenas substitui se não for parte de outro identificador (ex: evita transformar 'cor' em 'c||')
      if (!isPrevWordChar) {
        if (sub.startsWith('and') && !isWordChar(sub[3])) {
          result += "&&";
          i += 3;
          continue;
        }
        if (sub.startsWith('or') && !isWordChar(sub[2])) {
          result += "||";
          i += 2;
          continue;
        }
        if (sub.startsWith('not') && !isWordChar(sub[3])) {
          result += "!";
          i += 3;
          continue;
        }
        if (sub.startsWith('True') && !isWordChar(sub[4])) {
          result += "true";
          i += 4;
          continue;
        }
        if (sub.startsWith('False') && !isWordChar(sub[5])) {
          result += "false";
          i += 5;
          continue;
        }
      }
      
      result += char;
      i++;
    }
  }
  return result;
}

function runPython(code, initialVars = {}) {
  let jsCode = "";
  let lines = code.split('\n');
  let indentStack = [0];
  let previousWasColon = false;
  let lastLineCodeIndent = 0;
  let hasExecutedConditional = false; // to track if they used if/elif/else
  
  // Buffer de saída
  let outputBuffer = "";
  
  // Função print customizada para simular o comportamento do print do Python
  function __print(...args) {
    outputBuffer += args.map(arg => {
      if (arg === true) return "True";
      if (arg === false) return "False";
      if (arg === null || arg === undefined) return "None";
      return arg.toString();
    }).join(" ") + "\n";
  }
  
  // Variáveis do ambiente local
  let env = { 
    ...initialVars,
    print: __print
  };
  
  try {
    for (let i = 0; i < lines.length; i++) {
      let lineNum = i + 1;
      let rawLine = lines[i];
      let trimmed = rawLine.trim();
      
      // Ignora linhas vazias ou apenas com comentários
      if (trimmed === "" || trimmed.startsWith('#')) {
        continue;
      }
      
      // Verifica o nível de indentação (quantidade de espaços à esquerda)
      let indent = rawLine.search(/\S/);
      
      // Regras de Indentação do Python
      if (previousWasColon) {
        if (indent <= lastLineCodeIndent) {
          return {
            success: false,
            error: `Erro de Indentação (Linha ${lineNum}): Esperado um bloco recuado (com espaços à esquerda) após os dois pontos ':'.`,
            lineNum
          };
        }
      }
      
      if (indent < indentStack[indentStack.length - 1]) {
        while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
          indentStack.pop();
          jsCode += "}\n";
        }
        if (indent !== indentStack[indentStack.length - 1]) {
          return {
            success: false,
            error: `Erro de Indentação (Linha ${lineNum}): O recuo não corresponde a nenhum nível anterior de indentação.`,
            lineNum
          };
        }
      } else if (indent > indentStack[indentStack.length - 1]) {
        if (!previousWasColon) {
          return {
            success: false,
            error: `Erro de Indentação (Linha ${lineNum}): Recuo inesperado de código.`,
            lineNum
          };
        }
        indentStack.push(indent);
      }
      
      lastLineCodeIndent = indent;
      previousWasColon = trimmed.endsWith(':');
      
      // Erros de sintaxe comuns
      
      // 1. Falta de dois pontos (:) no if/elif/else
      if ((trimmed.startsWith('if ') || trimmed.startsWith('elif ') || trimmed === 'else') && !previousWasColon) {
        return {
          success: false,
          error: `Erro de Sintaxe (Linha ${lineNum}): Faltou colocar dois pontos ':' no final do comando condicional. Exemplo: 'if condicao:'`,
          lineNum
        };
      }
      
      // 2. Uso de 'else if' em vez de 'elif'
      if (trimmed.startsWith('else if')) {
        return {
          success: false,
          error: `Erro de Sintaxe (Linha ${lineNum}): No Python, usamos 'elif' para condições intermediárias, e não 'else if'.`,
          lineNum
        };
      }
      
      // 3. Print sem parênteses (comportamento Python 2)
      if (trimmed.startsWith('print ') && !trimmed.includes('(')) {
        return {
          success: false,
          error: `Erro de Sintaxe (Linha ${lineNum}): No Python 3, o comando 'print' precisa de parênteses. Use print("mensagem") com parênteses.`,
          lineNum
        };
      }
      
      let lineJs = "";
      
      if (trimmed.startsWith('if ') || trimmed.startsWith('elif ')) {
        hasExecutedConditional = true;
        let isIf = trimmed.startsWith('if ');
        let condPart = isIf ? trimmed.slice(3, -1) : trimmed.slice(5, -1);
        condPart = condPart.trim();
        
        // 4. Uso de '=' único dentro da condição
        let hasSingleEquals = false;
        let inString = false;
        let strChar = null;
        for (let idx = 0; idx < condPart.length; idx++) {
          let char = condPart[idx];
          if ((char === '"' || char === "'") && (idx === 0 || condPart[idx-1] !== '\\')) {
            if (!inString) {
              inString = true;
              strChar = char;
            } else if (char === strChar) {
              inString = false;
              strChar = null;
            }
          }
          if (!inString && char === '=') {
            let prev = condPart[idx - 1];
            let next = condPart[idx + 1];
            if (prev !== '=' && prev !== '<' && prev !== '>' && prev !== '!' && next !== '=') {
              hasSingleEquals = true;
              break;
            }
          }
        }
        
        if (hasSingleEquals) {
          return {
            success: false,
            error: `Erro de Sintaxe (Linha ${lineNum}): Use '==' para testar se dois valores são iguais. Um único '=' é usado apenas para guardar um valor (atribuição). Exemplo: if pontos == 100:`,
            lineNum
          };
        }
        
        let translatedCond = translateCondition(condPart);
        
        if (isIf) {
          lineJs = `if (${translatedCond}) {\n`;
        } else {
          lineJs = `else if (${translatedCond}) {\n`;
        }
      } else if (trimmed.startsWith('for ') && trimmed.includes(' in ')) {
        hasExecutedConditional = true;
        let forMatch = trimmed.match(/^for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+(.+):$/);
        if (!forMatch) {
          return {
            success: false,
            error: `Erro de Sintaxe (Linha ${lineNum}): Comando 'for' mal formatado. Use 'for variavel in iteravel:'`,
            lineNum
          };
        }
        let iterator = forMatch[1];
        let iterable = forMatch[2].trim();
        let rangeMatch = iterable.match(/^range\(([^,]+)(?:,\s*([^,]+))?\)$/);
        
        if (!(iterator in env)) {
          env[iterator] = undefined;
        }

        if (rangeMatch) {
          let start = rangeMatch[2] ? rangeMatch[1].trim() : '0';
          let end = rangeMatch[2] ? rangeMatch[2].trim() : rangeMatch[1].trim();
          lineJs = `for (let ${iterator} = ${translateCondition(start)}; ${iterator} < ${translateCondition(end)}; ${iterator}++) {\n`;
        } else {
          lineJs = `for (let ${iterator} of ${translateCondition(iterable)}) {\n`;
        }
      } else if (trimmed === 'else:') {
        hasExecutedConditional = true;
        lineJs = `else {\n`;
      } else if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
        let printContent = trimmed.substring(6, trimmed.length - 1).trim();
        lineJs = `print(${printContent});\n`;
      } else {
        // Trata atribuições simples, ex: pontos = 150 (impede de bater em comparações com ==)
        let match = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^=].*|)$/);
        if (match) {
          let varName = match[1];
          let expr = match[2].trim();
          let translatedExpr = translateCondition(expr);
          
          // Se a variável é fornecida como entrada do caso de teste, ignoramos a atribuição no código
          // para que o valor dinâmico do teste prevaleça.
          if (varName in initialVars) {
            lineJs = `// Variável de entrada ${varName} mantida com o valor do teste: ${initialVars[varName]}\n`;
          } else if (!(varName in env)) {
            lineJs = `let ${varName} = ${translatedExpr};\n`;
            env[varName] = undefined; 
          } else {
            lineJs = `${varName} = ${translatedExpr};\n`;
          }
        } else {
          // Expressões gerais como cálculos simples
          lineJs = translateCondition(trimmed) + ";\n";
        }
      }
      
      jsCode += lineJs;
    }
    
    // Fecha quaisquer chaves abertas no fim do código
    while (indentStack.length > 1) {
      indentStack.pop();
      jsCode += "}\n";
    }
    
    // Prepara os argumentos do ambiente de execução
    let varNames = Object.keys(env);
    let varValues = Object.values(env);
    
    // Executa o código JavaScript compilado em um escopo limpo
    let runner = new Function(...varNames, jsCode);
    runner(...varValues);
    
    return {
      success: true,
      output: outputBuffer,
      error: null
    };
    
  } catch (err) {
    // Captura erros de execução no JavaScript traduzido (ex: variável inexistente)
    let friendlyError = err.message;
    if (friendlyError.includes("is not defined")) {
      let missingVar = friendlyError.split(" ")[0];
      friendlyError = `Erro de Execução: A variável ou comando '${missingVar}' não foi definido. Verifique a grafia ou se a variável foi criada corretamente.`;
    }
    return {
      success: false,
      error: friendlyError
    };
  }
}
