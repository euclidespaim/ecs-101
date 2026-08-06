// Banco de Dados Centralizado do Curso Expandido de HTML & CSS 101
const SITE_DATA = {
  title: "HTML & CSS 101",
  subtitle: "Aprenda estrutura, estilização, Flexbox, formulários e responsividade!",

  // Estrutura de Módulos da Teoria
  modules: [
    {
      id: "mod-1",
      number: 1,
      title: "Módulo 1: Fundamentos (HTML & CSS)",
      badge: "🧱",
      concepts: [
        {
          id: "html-basics",
          title: "1. Estrutura e Tags HTML",
          description: "O HTML (HyperText Markup Language) constrói a estrutura física de páginas web. Usamos tags como <code>&lt;h1&gt;</code> para títulos principais, <code>&lt;p&gt;</code> para parágrafos, <code>&lt;a&gt;</code> para links e <code>&lt;ul&gt;</code>/<code>&lt;li&gt;</code> para listas.",
          example: `<!-- Exemplo de HTML Básico -->
<h1>Meu Primeiro Título</h1>
<p>Este é um parágrafo contendo um <a href="https://google.com">link externo</a>.</p>`,
          analogy: "<strong>Analogia:</strong> O HTML é o esqueleto ou os tijolos de uma casa."
        },
        {
          id: "css-basics",
          title: "2. Estilos e Seletores CSS",
          description: "O CSS (Cascading Style Sheets) pinta e estiliza o esqueleto HTML. Usamos seletores de tag (ex: <code>p</code>), de classe (ex: <code>.destaque</code>) e de ID (ex: <code>#topo</code>) para aplicar propriedades de cores, fontes e bordas.",
          example: `/* Exemplo de CSS Básico */
h1 { color: #1E3A8A; }
.destaque { color: #0D9488; font-weight: bold; }
#topo { background-color: #FEF3C7; }`,
          analogy: "<strong>Analogia:</strong> O CSS é a pintura das paredes e a decoração interna."
        },
        {
          id: "box-model",
          title: "3. O Box Model (Content, Padding, Border, Margin)",
          description: "No desenvolvimento web, todo elemento visual é uma caixa. O Box Model define a área de conteúdo (Content), preenchimento interno (Padding), borda externa (Border) e margem de afastamento (Margin).",
          example: `/* Exemplo do Box Model */
.caixa {
  width: 250px;
  padding: 20px;
  border: 2px solid #1E3A8A;
  margin: 15px;
}`,
          analogy: "<strong>Analogia:</strong> Content = presente, Padding = plástico bolha, Border = caixa de papelão, Margin = espaço entre caixas."
        }
      ]
    },
    {
      id: "mod-2",
      number: 2,
      title: "Módulo 2: Layout Moderno & Flexbox",
      badge: "📐",
      concepts: [
        {
          id: "flexbox-intro",
          title: "1. Introdução ao Flexbox (display: flex)",
          description: "O Flexbox é um modelo de layout 1D que permite alinhar e distribuir elementos facilmente em linhas ou colunas. Para ativar o Flexbox, aplicamos <code>display: flex;</code> no elemento pai (container).",
          example: `/* Exemplo Flexbox Container */
.container {
  display: flex;
  flex-direction: row; /* Alinha em linha (padrão) ou column */
}`,
          analogy: "<strong>Analogia:</strong> Flexbox é uma prateleira inteligente que organiza objetos automaticamente."
        },
        {
          id: "flexbox-alignment",
          title: "2. Alinhamento com justify-content e align-items",
          description: "Use <code>justify-content</code> para alinhar no eixo principal (horizontal por padrão: <code>center</code>, <code>space-between</code>, <code>flex-end</code>) e <code>align-items</code> para alinhar no eixo cruzado (vertical por padrão: <code>center</code>, <code>stretch</code>). Use <code>gap</code> para dar espaço entre itens.",
          example: `/* Centralização Total em Flexbox */
.painel-centralizado {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}`,
          analogy: "<strong>Analogia:</strong> Justify alinha a fila horizontalmente e Align ajusta a altura dos passageiros no ônibus."
        }
      ]
    },
    {
      id: "mod-3",
      number: 3,
      title: "Módulo 3: Formulários & Interatividade",
      badge: "📝",
      concepts: [
        {
          id: "forms-basics",
          title: "1. Elementos de Formulário (<input>, <label>, <select>)",
          description: "Formulários capturam dados do usuário. A tag <code>&lt;form&gt;</code> agrupa campos como <code>&lt;input type='text'&gt;</code>, <code>&lt;input type='password'&gt;</code>, <code>&lt;select&gt;</code> e <code>&lt;button&gt;</code>. Sempre conecte `<label>` ao `<input>` usando o atributo `for` e `id`.",
          example: `<!-- Exemplo de Formulário -->
<form>
  <label for="nome">Seu Nome:</label>
  <input type="text" id="nome" placeholder="Digite seu nome">
  <button type="submit">Enviar</button>
</form>`,
          analogy: "<strong>Analogia:</strong> Um formulário é uma ficha de cadastro impressa pronta para ser preenchida."
        },
        {
          id: "css-pseudo-classes",
          title: "2. Pseudo-classes de Estado (:hover, :focus, :active)",
          description: "Pseudo-classes alteram o visual do elemento dependendo da interação do usuário:<br>• <code>:hover</code> ao passar o ponteiro do mouse.<br>• <code>:focus</code> quando o campo está selecionado para digitação.<br>• <code>:active</code> no momento exato do clique.",
          example: `/* Efeitos de Interatividade */
button {
  background-color: #0D9488;
  transition: background 0.3s ease;
}
button:hover {
  background-color: #0F766E; /* Fica mais escuro no mouse */
}
input:focus {
  border-color: #38BDF8; /* Borda brilha no foco */
}`,
          analogy: "<strong>Analogia:</strong> Pseudo-classes são como luzes que acendem quando você encosta ou aperta um botão."
        }
      ]
    },
    {
      id: "mod-4",
      number: 4,
      title: "Módulo 4: Mídia & Responsividade",
      badge: "📱",
      concepts: [
        {
          id: "media-images",
          title: "1. Imagens e Mídia (&lt;img&gt;, object-fit)",
          description: "A tag <code>&lt;img src='url' alt='descrição'&gt;</code> insere imagens. Para evitar distorção de proporção ao fixar largura e altura, use a propriedade CSS <code>object-fit: cover;</code>.",
          example: `/* Estilização Responsiva de Imagem */
img.foto-perfil {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%; /* Transforma em círculo */
}`,
          analogy: "<strong>Analogia:</strong> `object-fit: cover` ajusta uma foto em um porta-retratos sem achatar a imagem."
        },
        {
          id: "media-queries",
          title: "2. Introdução ao Design Responsivo (@media)",
          description: "Garante que o site se adapte perfeitamente em telas de celulares, tablets e computadores. Usamos Media Queries para aplicar regras CSS apenas quando a largura da tela estiver abaixo de certo limite.",
          example: `/* CSS para Celulares (telas até 600px) */
@media (max-width: 600px) {
  .container {
    flex-direction: column; /* Transforma linha em coluna */
  }
}`,
          analogy: "<strong>Analogia:</strong> Design responsivo é como água que adapta seu formato ao recipiente (copo ou jarra)."
        }
      ]
    }
  ],

  // Banco de Quizzes (15 Perguntas por Módulo/Tópico)
  quiz: [
    // Módulo 1 (Fundamentos)
    {
      id: 1,
      moduleId: "mod-1",
      question: "Qual palavra-chave/abreviação significa HTML?",
      options: [
        "HyperText Markup Language",
        "HighTech Modern Language",
        "HyperTransfer Markup Language",
        "Home Tool Markup Language"
      ],
      correctAnswer: 0,
      explanation: "HTML significa HyperText Markup Language (Linguagem de Marcação de Hipertexto) e constrói o conteúdo estrutural de páginas web."
    },
    {
      id: 2,
      moduleId: "mod-1",
      question: "Qual tag HTML é usada para criar o título principal de maior importância em uma página web?",
      options: [
        "<title>",
        "<heading>",
        "<h1>",
        "<head>"
      ],
      correctAnswer: 2,
      explanation: "A tag <h1> define o título principal de nível 1 em uma página web."
    },
    {
      id: 3,
      moduleId: "mod-1",
      question: "No CSS, como selecionamos todos os elementos HTML que possuem a classe 'destaque' (ex: class=\"destaque\")?",
      options: [
        "#destaque",
        "destaque",
        ".destaque",
        "*destaque"
      ],
      correctAnswer: 2,
      explanation: "No CSS, seletores de classe iniciam com ponto ('.'), seletores de ID iniciam com cerquilha ('#') e seletores de tag não usam símbolo."
    },
    {
      id: 4,
      moduleId: "mod-1",
      question: "No CSS Box Model, qual propriedade representa o espaço interno entre o conteúdo do elemento e sua borda?",
      options: [
        "margin",
        "padding",
        "border",
        "spacing"
      ],
      correctAnswer: 1,
      explanation: "O 'padding' é o preenchimento interno. A 'margin' é a distância externa que afasta o elemento de outros vizinhos."
    },
    {
      id: 5,
      moduleId: "mod-1",
      question: "Qual a propriedade CSS correta para alterar a cor do texto de um elemento?",
      options: [
        "text-color",
        "font-color",
        "color",
        "background-color"
      ],
      correctAnswer: 2,
      explanation: "Usamos 'color' para a cor das letras do texto e 'background-color' para a cor de fundo do bloco."
    },

    // Módulo 2 (Flexbox)
    {
      id: 6,
      moduleId: "mod-2",
      question: "Qual propriedade CSS deve ser aplicada em um container pai para ativá-lo como um container Flexbox?",
      options: [
        "display: block;",
        "display: flex;",
        "flex: 1;",
        "layout: flexbox;"
      ],
      correctAnswer: 1,
      explanation: "Aplicamos 'display: flex;' no container pai para que seus filhos diretos passem a seguir as regras de alinhamento do Flexbox."
    },
    {
      id: 7,
      moduleId: "mod-2",
      question: "Qual valor da propriedade 'justify-content' distribui os itens flexíveis colocando o primeiro no início, o último no fim e espaço igual entre eles?",
      options: [
        "justify-content: center;",
        "justify-content: space-around;",
        "justify-content: space-between;",
        "justify-content: flex-end;"
      ],
      correctAnswer: 2,
      explanation: "'space-between' coloca o máximo de espaço livre entre os itens internos, empurrando as extremidades para as bordas."
    },
    {
      id: 8,
      moduleId: "mod-2",
      question: "Para alinhar itens verticalmente ao centro dentro de um container Flexbox (com flex-direction em linha padrão), qual propriedade utilizamos?",
      options: [
        "align-items: center;",
        "justify-content: center;",
        "text-align: center;",
        "vertical-align: middle;"
      ],
      correctAnswer: 0,
      explanation: "'align-items: center;' controla o alinhamento no eixo cruzado (vertical por padrão no Flexbox)."
    },
    {
      id: 9,
      moduleId: "mod-2",
      question: "Como definimos um espaçamento uniforme de 16px diretamente entre os elementos dentro de um container Flexbox sem usar margin individual?",
      options: [
        "spacing: 16px;",
        "gap: 16px;",
        "padding: 16px;",
        "between: 16px;"
      ],
      correctAnswer: 1,
      explanation: "A propriedade 'gap: 16px;' define o espaço automático entre linhas e colunas dentro do Flexbox ou Grid."
    },
    {
      id: 10,
      moduleId: "mod-2",
      question: "Qual propriedade altera a orientação do container Flexbox para organizar os elementos de cima para baixo (em coluna)?",
      options: [
        "flex-direction: column;",
        "flex-orientation: vertical;",
        "display: column;",
        "flex-flow: vertical;"
      ],
      correctAnswer: 0,
      explanation: "'flex-direction: column;' muda o eixo principal do Flexbox para a vertical."
    },

    // Módulo 3 & 4 (Formulários, Interatividade & Mídia)
    {
      id: 11,
      moduleId: "mod-3",
      question: "Qual pseudo-classe CSS é ativada quando o usuário passa o ponteiro do mouse por cima de um elemento?",
      options: [
        ":focus",
        ":hover",
        ":active",
        ":visited"
      ],
      correctAnswer: 1,
      explanation: "A pseudo-classe ':hover' aplica estilos enquanto o mouse estiver sobre o elemento."
    },
    {
      id: 12,
      moduleId: "mod-3",
      question: "Ao criar um campo de texto em formulários HTML, qual tipo de input deve ser usado para ocultar os caracteres com bolinhas de segurança?",
      options: [
        "<input type=\"text\">",
        "<input type=\"hidden\">",
        "<input type=\"password\">",
        "<input type=\"secret\">"
      ],
      correctAnswer: 2,
      explanation: "O tipo '<input type=\"password\">' substitui os caracteres visíveis por pontos ou asteriscos de privacidade."
    },
    {
      id: 13,
      moduleId: "mod-4",
      question: "Para evitar que uma imagem <img> fique esticada ou deformada quando definimos width e height fixos, qual propriedade CSS devemos usar?",
      options: [
        "image-fit: cover;",
        "object-fit: cover;",
        "background-size: cover;",
        "aspect-ratio: auto;"
      ],
      correctAnswer: 1,
      explanation: "'object-fit: cover;' faz a imagem preencher a área recortando os excessos sem distorcer o seu aspecto."
    },
    {
      id: 14,
      moduleId: "mod-4",
      question: "Qual sintaxe CSS é usada para aplicar estilos condicionados ao tamanho da tela (Design Responsivo)?",
      options: [
        "@screen (max-width: 768px) { ... }",
        "@media (max-width: 768px) { ... }",
        "@responsive (mobile) { ... }",
        "#media-query { ... }"
      ],
      correctAnswer: 1,
      explanation: "Usamos '@media (max-width: ...)' para declarar Media Queries que adaptam o CSS conforme o tamanho da tela."
    },
    {
      id: 15,
      moduleId: "mod-3",
      question: "Qual propriedade CSS arredonda os cantos de botões, caixas e imagens para criar bordas suaves ou círculos?",
      options: [
        "border-round",
        "corner-radius",
        "border-radius",
        "box-radius"
      ],
      correctAnswer: 2,
      explanation: "'border-radius' define o raio de arredondamento das bordas. Use '50%' para tornar um elemento quadrado em um círculo perfeito."
    }
  ],

  // 10 Desafios Práticos com Validação DOM
  exercises: [
    {
      level: 1,
      moduleId: "mod-1",
      name: "Nível 1: Estruturando o Cabeçalho 🏷️",
      description: "Crie a tag de título principal da página. Crie um elemento <code>&lt;h1&gt;</code> contendo exatamente o texto <strong>Meu Primeiro Site</strong>.",
      starterCode: `<!-- Escreva sua tag h1 abaixo: -->\n`,
      testCases: [
        {
          id: 1,
          label: "Existe a tag <h1>?",
          validate: (doc) => doc.querySelector('h1') !== null
        },
        {
          id: 2,
          label: "O texto do <h1> é 'Meu Primeiro Site'?",
          validate: (doc) => doc.querySelector('h1')?.innerText.trim() === "Meu Primeiro Site"
        }
      ]
    },
    {
      level: 2,
      moduleId: "mod-1",
      name: "Nível 2: Dando Cor ao Título 🎨",
      description: "Dê vida ao seu título! Crie a tag <code>&lt;h1&gt;</code> com o texto <strong>Título Colorido</strong>. No bloco <code>&lt;style&gt;</code>, adicione uma regra CSS para que o <code>h1</code> tenha a cor vermelha (<code>red</code>).",
      starterCode: `<style>\n  /* Escreva sua regra CSS para o h1 abaixo: */\n  \n</style>\n\n<!-- Crie seu h1 abaixo: -->\n`,
      testCases: [
        {
          id: 1,
          label: "Existe a tag <h1>?",
          validate: (doc) => doc.querySelector('h1') !== null
        },
        {
          id: 2,
          label: "O texto do <h1> é 'Título Colorido'?",
          validate: (doc) => doc.querySelector('h1')?.innerText.trim() === "Título Colorido"
        },
        {
          id: 3,
          label: "A cor do <h1> é vermelha (red)?",
          validate: (doc) => {
            const h1 = doc.querySelector('h1');
            if (!h1) return false;
            const color = window.getComputedStyle(h1).color;
            return color === "rgb(255, 0, 0)" || color === "red";
          }
        }
      ]
    },
    {
      level: 3,
      moduleId: "mod-1",
      name: "Nível 3: Links e Parágrafos Aninhados 🔗",
      description: "Crie um parágrafo <code>&lt;p&gt;</code> contendo o texto 'Visite o site do ' seguido de uma tag de link <code>&lt;a&gt;</code> com o destino <code>href=\"https://www.google.com\"</code> e o texto interno <strong>Google</strong>.",
      starterCode: `<!-- Crie seu parágrafo p com o link a interno abaixo: -->\n<p>Visite o site do </p>`,
      testCases: [
        {
          id: 1,
          label: "Existe a tag <p>?",
          validate: (doc) => doc.querySelector('p') !== null
        },
        {
          id: 2,
          label: "Existe a tag <a> dentro do <p>?",
          validate: (doc) => doc.querySelector('p a') !== null
        },
        {
          id: 3,
          label: "O link aponta para https://www.google.com?",
          validate: (doc) => {
            const a = doc.querySelector('p a');
            if (!a) return false;
            const href = a.getAttribute('href')?.trim();
            return href === "https://www.google.com" || href === "https://www.google.com/";
          }
        },
        {
          id: 4,
          label: "O texto do link é 'Google'?",
          validate: (doc) => doc.querySelector('p a')?.innerText.trim() === "Google"
        }
      ]
    },
    {
      level: 4,
      moduleId: "mod-1",
      name: "Nível 4: Seleção com Classes 🏷️",
      description: "Crie dois parágrafos <code>&lt;p&gt;</code>:<br>1. O primeiro com a classe <code>importante</code> contendo o texto <strong>Atenção Aluno!</strong>.<br>2. O segundo comum contendo o texto <strong>Conteúdo normal.</strong>.<br>No CSS (bloco <code>&lt;style&gt;</code>), faça apenas a classe <code>.importante</code> ter a cor verde (<code>green</code>).",
      starterCode: `<style>\n  /* Estilize apenas a classe .importante abaixo: */\n  \n</style>\n\n<!-- Crie os dois parágrafos abaixo: -->\n`,
      testCases: [
        {
          id: 1,
          label: "Existem pelo menos dois parágrafos <p>?",
          validate: (doc) => doc.querySelectorAll('p').length >= 2
        },
        {
          id: 2,
          label: "Existe o parágrafo de classe 'importante'?",
          validate: (doc) => doc.querySelector('p.importante') !== null
        },
        {
          id: 3,
          label: "A classe .importante está com cor verde (green)?",
          validate: (doc) => {
            const imp = doc.querySelector('p.importante');
            if (!imp) return false;
            const color = window.getComputedStyle(imp).color;
            return color === "rgb(0, 128, 0)" || color === "green";
          }
        }
      ]
    },
    {
      level: 5,
      moduleId: "mod-1",
      name: "Nível 5: O Box Model na Prática 📦",
      description: "Crie uma <code>&lt;div&gt;</code> com a classe <code>painel</code> contendo qualquer texto. No CSS, estilize a classe <code>.painel</code> para ter:<br>• Preenchimento interno (<code>padding</code>) de <code>20px</code>.<br>• Borda sólida preta de <code>2px</code> (<code>border: 2px solid black</code>).<br>• Margem externa (<code>margin</code>) de <code>10px</code>.<br>• Cor de fundo de destaque (ex: <code>lightgray</code> ou hexadecimais).",
      starterCode: `<style>\n  .painel {\n    /* Adicione as regras de Box Model aqui: */\n    \n  }\n</style>\n\n<!-- Crie a div com classe painel abaixo: -->\n<div class="painel">\n  Conteúdo do Painel\n</div>`,
      testCases: [
        {
          id: 1,
          label: "Existe a <div class=\"painel\">?",
          validate: (doc) => doc.querySelector('div.painel') !== null
        },
        {
          id: 2,
          label: "Padding interno de 20px?",
          validate: (doc) => {
            const painel = doc.querySelector('div.painel');
            if (!painel) return false;
            const style = window.getComputedStyle(painel);
            return style.paddingTop === "20px" && style.paddingRight === "20px";
          }
        },
        {
          id: 3,
          label: "Borda preta sólida de 2px?",
          validate: (doc) => {
            const painel = doc.querySelector('div.painel');
            if (!painel) return false;
            const style = window.getComputedStyle(painel);
            const isBlack = style.borderLeftColor === "rgb(0, 0, 0)" || style.borderLeftColor === "black";
            const isSolid = style.borderLeftStyle === "solid";
            const is2px = style.borderLeftWidth === "2px";
            return isBlack && isSolid && is2px;
          }
        },
        {
          id: 4,
          label: "Margin de 10px?",
          validate: (doc) => {
            const painel = doc.querySelector('div.painel');
            if (!painel) return false;
            const style = window.getComputedStyle(painel);
            return style.marginTop === "10px" && style.marginRight === "10px";
          }
        }
      ]
    },
    {
      level: 6,
      moduleId: "mod-2",
      name: "Nível 6: Alinhamento com Flexbox 📐",
      description: "Crie uma <code>&lt;div&gt;</code> com a classe <code>menu-flex</code> contendo duas tags <code>&lt;button&gt;</code>. No CSS, transforme <code>.menu-flex</code> em um container Flexbox (<code>display: flex</code>) e alinhe os botões com distribuição de espaço nas pontas usando <code>justify-content: space-between</code>.",
      starterCode: `<style>\n  .menu-flex {\n    /* Adicione as regras de Flexbox aqui: */\n    \n  }\n</style>\n\n<div class="menu-flex">\n  <button>Início</button>\n  <button>Contato</button>\n</div>`,
      testCases: [
        {
          id: 1,
          label: "Existe o container .menu-flex?",
          validate: (doc) => doc.querySelector('div.menu-flex') !== null
        },
        {
          id: 2,
          label: "display: flex aplicado?",
          validate: (doc) => {
            const el = doc.querySelector('div.menu-flex');
            if (!el) return false;
            return window.getComputedStyle(el).display === "flex";
          }
        },
        {
          id: 3,
          label: "justify-content: space-between aplicado?",
          validate: (doc) => {
            const el = doc.querySelector('div.menu-flex');
            if (!el) return false;
            return window.getComputedStyle(el).justifyContent === "space-between";
          }
        }
      ]
    },
    {
      level: 7,
      moduleId: "mod-3",
      name: "Nível 7: Interatividade com :hover 🖱️",
      description: "Crie um botão <code>&lt;button class=\"btn-interativo\"&gt;Clique Aqui&lt;/button&gt;</code>. No CSS, defina a cor de fundo inicial do botão como azul (<code>blue</code>) e adicione uma regra de pseudo-classe <code>.btn-interativo:hover</code> para que a cor mude para verde (<code>green</code>) ao passar o mouse.",
      starterCode: `<style>\n  .btn-interativo {\n    background-color: blue;\n    color: white;\n    padding: 10px 20px;\n    border: none;\n  }\n  \n  /* Adicione a regra :hover abaixo: */\n  \n</style>\n\n<button class="btn-interativo">Clique Aqui</button>`,
      testCases: [
        {
          id: 1,
          label: "Existe o botão com a classe btn-interativo?",
          validate: (doc) => doc.querySelector('button.btn-interativo') !== null
        },
        {
          id: 2,
          label: "Possui regra de CSS contendo a pseudo-classe :hover?",
          validate: (doc) => {
            const styles = doc.querySelectorAll('style');
            let hasHoverRule = false;
            styles.forEach(s => {
              if (s.innerHTML.includes(':hover')) hasHoverRule = true;
            });
            return hasHoverRule;
          }
        }
      ]
    },
    {
      level: 8,
      moduleId: "mod-3",
      name: "Nível 8: Criando um Campo de Login 🔑",
      description: "Crie um pequeno formulário de login. Crie uma tag <code>&lt;form&gt;</code> contendo:<br>1. Um campo de texto <code>&lt;input type=\"text\" placeholder=\"Usuário\"&gt;</code>.<br>2. Um campo de senha <code>&lt;input type=\"password\" placeholder=\"Senha\"&gt;</code>.<br>3. Um botão de envio <code>&lt;button type=\"submit\"&gt;Entrar&lt;/button&gt;</code>.",
      starterCode: `<!-- Crie o formulário com os dois inputs e o botão de submit abaixo: -->\n<form>\n  \n</form>`,
      testCases: [
        {
          id: 1,
          label: "Existe a tag <form>?",
          validate: (doc) => doc.querySelector('form') !== null
        },
        {
          id: 2,
          label: "Existe o input de type='text'?",
          validate: (doc) => doc.querySelector('form input[type="text"]') !== null
        },
        {
          id: 3,
          label: "Existe o input de type='password'?",
          validate: (doc) => doc.querySelector('form input[type="password"]') !== null
        },
        {
          id: 4,
          label: "Existe o botão de submit?",
          validate: (doc) => doc.querySelector('form button') !== null
        }
      ]
    },
    {
      level: 9,
      moduleId: "mod-4",
      name: "Nível 9: Imagem com Arredondamento 🖼️",
      description: "Insira uma imagem usando a tag <code>&lt;img src=\"https://picsum.photos/200\" alt=\"Foto\" class=\"foto-arredondada\"&gt;</code>. No CSS, defina para a classe <code>.foto-arredondada</code> a propriedade <code>border-radius: 50%</code> para deixá-la circular.",
      starterCode: `<style>\n  /* Estilize a classe .foto-arredondada para border-radius: 50% abaixo: */\n  \n</style>\n\n<!-- Insira a imagem abaixo: -->\n`,
      testCases: [
        {
          id: 1,
          label: "Existe a imagem com a classe foto-arredondada?",
          validate: (doc) => doc.querySelector('img.foto-arredondada') !== null
        },
        {
          id: 2,
          label: "border-radius: 50% aplicado na imagem?",
          validate: (doc) => {
            const img = doc.querySelector('img.foto-arredondada');
            if (!img) return false;
            const radius = window.getComputedStyle(img).borderRadius;
            return radius === "50%";
          }
        }
      ]
    },
    {
      level: 10,
      moduleId: "mod-4",
      name: "Nível 10: Card de Produto Completo 🏆",
      description: "Monte o seu primeiro componente completo! Crie uma <code>&lt;div class=\"card-produto\"&gt;</code> contendo:<br>• Um título <code>&lt;h3&gt;Fone Bluetooth&lt;/h3&gt;</code>.<br>• Um parágrafo <code>&lt;p&gt;R$ 199,00&lt;/p&gt;</code>.<br>• Um botão <code>&lt;button class=\"btn-comprar\"&gt;Comprar&lt;/button&gt;</code>.<br>No CSS, faça o <code>.card-produto</code> ter <code>padding: 20px</code>, <code>border: 1px solid gray</code>, <code>border-radius: 12px</code> e fundo branco.",
      starterCode: `<style>\n  .card-produto {\n    /* Adicione os estilos do card abaixo: */\n    \n  }\n  \n  .btn-comprar {\n    background-color: #0D9488;\n    color: white;\n    border: none;\n    padding: 8px 16px;\n    border-radius: 6px;\n  }\n</style>\n\n<!-- Crie a div.card-produto com h3, p e button abaixo: -->\n`,
      testCases: [
        {
          id: 1,
          label: "Existe a div.card-produto?",
          validate: (doc) => doc.querySelector('div.card-produto') !== null
        },
        {
          id: 2,
          label: "Possui o h3, p e button internos?",
          validate: (doc) => {
            const card = doc.querySelector('div.card-produto');
            if (!card) return false;
            return card.querySelector('h3') !== null &&
                   card.querySelector('p') !== null &&
                   card.querySelector('button.btn-comprar') !== null;
          }
        },
        {
          id: 3,
          label: "Card possui padding: 20px e border-radius: 12px?",
          validate: (doc) => {
            const card = doc.querySelector('div.card-produto');
            if (!card) return false;
            const style = window.getComputedStyle(card);
            return style.paddingTop === "20px" && style.borderRadius === "12px";
          }
        }
      ]
    }
  ],

  // Banco da Avaliação 1 Prática (3 Questões Prova)
  exam: [
    {
      id: 1,
      name: "Questão 1: Botão Customizado de Ação 🔘",
      description: "Crie um botão (<code>&lt;button&gt;</code>) com a classe <code>btn-acao</code> e o texto 'Clique Aqui'. No bloco CSS, estilize o botão para ter:<br>• Cor de fundo azul (<code>blue</code>) e cor de texto branca (<code>white</code>).<br>• Preenchimento interno (<code>padding</code>) de <code>10px</code> na vertical e <code>20px</code> na horizontal.<br>• Sem borda externa (<code>border: none</code>).",
      starterCode: `<style>\n  /* Estilize o botão .btn-acao abaixo: */\n  \n</style>\n\n<!-- Crie o botão com a classe btn-acao abaixo: -->\n`,
      testCases: [
        {
          id: 1,
          label: "Existe o botão com a classe btn-acao?",
          validate: (doc) => doc.querySelector('button.btn-acao') !== null
        },
        {
          id: 2,
          label: "O texto do botão é 'Clique Aqui'?",
          validate: (doc) => doc.querySelector('button.btn-acao')?.innerText.trim() === "Clique Aqui"
        },
        {
          id: 3,
          label: "Fundo azul e texto branco?",
          validate: (doc) => {
            const btn = doc.querySelector('button.btn-acao');
            if (!btn) return false;
            const style = window.getComputedStyle(btn);
            const isBlue = style.backgroundColor === "rgb(0, 0, 255)" || style.backgroundColor === "blue";
            const isWhite = style.color === "rgb(255, 255, 255)" || style.color === "white";
            return isBlue && isWhite;
          }
        },
        {
          id: 4,
          label: "Padding vertical 10px e horizontal 20px?",
          validate: (doc) => {
            const btn = doc.querySelector('button.btn-acao');
            if (!btn) return false;
            const style = window.getComputedStyle(btn);
            return style.paddingTop === "10px" && style.paddingBottom === "10px" &&
                   style.paddingLeft === "20px" && style.paddingRight === "20px";
          }
        },
        {
          id: 5,
          label: "Sem borda (border: none)?",
          validate: (doc) => {
            const btn = doc.querySelector('button.btn-acao');
            if (!btn) return false;
            const style = window.getComputedStyle(btn);
            return style.borderStyle === "none" || style.borderWidth === "0px";
          }
        }
      ]
    },
    {
      id: 2,
      name: "Questão 2: Lista de Tarefas sem Marcadores 📋",
      description: "Crie uma lista não ordenada (<code>&lt;ul&gt;</code>) contendo três itens de lista (<code>&lt;li&gt;</code>) com os seguintes textos exatos em ordem: 'Aprender HTML', 'Aprender CSS' e 'Criar Sites'. No CSS:<br>• Remova as bolinhas padrão da lista (<code>list-style-type: none</code>).<br>• Adicione um espaçamento inferior (<code>margin-bottom</code>) de <code>8px</code> a cada item <code>li</code>.",
      starterCode: `<style>\n  /* Remova as bolinhas da lista ul e adicione margem aos itens li abaixo: */\n  \n</style>\n\n<!-- Crie a lista ul com os três itens li abaixo: -->\n`,
      testCases: [
        {
          id: 1,
          label: "Existe a tag <ul>?",
          validate: (doc) => doc.querySelector('ul') !== null
        },
        {
          id: 2,
          label: "Existem 3 itens <li> internos?",
          validate: (doc) => doc.querySelectorAll('ul li').length === 3
        },
        {
          id: 3,
          label: "Textos dos itens <li> estão corretos?",
          validate: (doc) => {
            const lis = doc.querySelectorAll('ul li');
            if (lis.length !== 3) return false;
            return lis[0].innerText.trim() === "Aprender HTML" &&
                   lis[1].innerText.trim() === "Aprender CSS" &&
                   lis[2].innerText.trim() === "Criar Sites";
          }
        },
        {
          id: 4,
          label: "Marcadores removidos da lista?",
          validate: (doc) => {
            const ul = doc.querySelector('ul');
            const li = doc.querySelector('ul li');
            if (!ul || !li) return false;
            return window.getComputedStyle(ul).listStyleType === "none" ||
                   window.getComputedStyle(li).listStyleType === "none";
          }
        },
        {
          id: 5,
          label: "Espaçamento inferior (margin-bottom: 8px) nos itens li?",
          validate: (doc) => {
            const li = doc.querySelector('ul li');
            if (!li) return false;
            return window.getComputedStyle(li).marginBottom === "8px";
          }
        }
      ]
    },
    {
      id: 3,
      name: "Questão 3: Layout de Destaque com Borda 💎",
      description: "Crie uma seção (<code>&lt;section&gt;</code>) com o ID <code>destaque</code>. Dentro dela, insira um título <code>&lt;h2&gt;Aviso Urgente&lt;/h2&gt;</code> e um parágrafo <code>&lt;p&gt;Matrículas abertas.&lt;/p&gt;</code>. No CSS, estilize:<br>• A seção <code>#destaque</code> deve ter fundo amarelo claro (use cor <code>lightyellow</code> ou <code>#ffffcc</code>) e uma borda lateral esquerda sólida vermelha de <code>5px</code> (<code>border-left: 5px solid red</code>).<br>• O título <code>h2</code> dentro do destaque deve ter cor vermelha (<code>red</code>).",
      starterCode: `<style>\n  /* Estilize o ID #destaque e o h2 interno abaixo: */\n  \n</style>\n\n<!-- Crie a section #destaque com h2 e p abaixo: -->\n`,
      testCases: [
        {
          id: 1,
          label: "Existe a <section id=\"destaque\">?",
          validate: (doc) => doc.querySelector('section#destaque') !== null
        },
        {
          id: 2,
          label: "Possui h2 e p dentro da section?",
          validate: (doc) => {
            const sec = doc.querySelector('section#destaque');
            if (!sec) return false;
            return sec.querySelector('h2') !== null && sec.querySelector('p') !== null;
          }
        },
        {
          id: 3,
          label: "Fundo amarelo claro na section?",
          validate: (doc) => {
            const sec = doc.querySelector('section#destaque');
            if (!sec) return false;
            const bg = window.getComputedStyle(sec).backgroundColor;
            if (!bg || bg === "transparent" || bg === "rgba(0, 0, 0, 0)") return false;
            const rgb = bg.match(/\d+/g);
            if (!rgb || rgb.length < 3) return false;
            const r = parseInt(rgb[0]);
            const g = parseInt(rgb[1]);
            const b = parseInt(rgb[2]);
            return r > 200 && g > 200 && b < 240;
          }
        },
        {
          id: 4,
          label: "Borda esquerda vermelha sólida de 5px?",
          validate: (doc) => {
            const sec = doc.querySelector('section#destaque');
            if (!sec) return false;
            const style = window.getComputedStyle(sec);
            const isRed = style.borderLeftColor === "rgb(255, 0, 0)" || style.borderLeftColor === "red";
            const isSolid = style.borderLeftStyle === "solid";
            const is5px = style.borderLeftWidth === "5px";
            return isRed && isSolid && is5px;
          }
        },
        {
          id: 5,
          label: "O h2 interno possui cor vermelha?",
          validate: (doc) => {
            const h2 = doc.querySelector('section#destaque h2');
            if (!h2) return false;
            const color = window.getComputedStyle(h2).color;
            return color === "rgb(255, 0, 0)" || color === "red";
          }
        }
      ]
    }
  ]
};
