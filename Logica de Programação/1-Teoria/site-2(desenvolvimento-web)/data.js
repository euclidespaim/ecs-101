// Dados globais do site de estudos de Desenvolvimento Web (HTML & CSS)
const SITE_DATA = {
  title: "HTML & CSS 101",
  subtitle: "Aprenda a estruturar páginas com HTML e estilizar com CSS!",
  
  // Conteúdo teórico estruturado de forma simples e visual
  theory: {
    introduction: "Imagine que você está construindo uma casa. O HTML seria a estrutura física da casa — os tijolos, as paredes, as portas e as janelas. O CSS seria a pintura, a decoração, o estilo do piso e a iluminação. Juntos, eles dão vida às páginas da internet!",
    concepts: [
      {
        id: "html",
        title: "1. O que é HTML? (Estrutura)",
        description: "O HTML (HyperText Markup Language) serve para estruturar e organizar o conteúdo de uma página web. Ele usa <strong>tags</strong> como <code>&lt;h1&gt;</code> para títulos, <code>&lt;p&gt;</code> para parágrafos, <code>&lt;a&gt;</code> para links e <code>&lt;img&gt;</code> para imagens.",
        example: `<!-- Exemplo de HTML -->
<h1>Meu Primeiro Título</h1>
<p>Este é um parágrafo de texto.</p>
<a href="https://google.com">Ir para o Google</a>`,
        analogy: "<strong>Analogia:</strong> HTML é o esqueleto ou a estrutura física (tijolos e vigas) de uma casa."
      },
      {
        id: "css",
        title: "2. O que é CSS? (Estilos)",
        description: "O CSS (Cascading Style Sheets) controla o design e o visual da página. Com ele, podemos mudar a cor de fundo, alterar fontes, ajustar tamanhos de texto, definir bordas e espaçamentos. O CSS é escrito dentro de uma tag <code>&lt;style&gt;</code> no HTML (ou em um arquivo separado).",
        example: `/* Exemplo de CSS */
h1 {
    color: teal;
    font-size: 24px;
}
p {
    color: #475569;
    line-height: 1.5;
}`,
        analogy: "<strong>Analogia:</strong> CSS é a pintura das paredes, a escolha das cortinas, móveis e acabamento da casa."
      },
      {
        id: "selectors",
        title: "3. Seletores CSS (Alvos)",
        description: "Para aplicar um estilo, precisamos indicar qual tag HTML queremos modificar. Isso é feito pelos <strong>seletores</strong>:<br>" +
                     "• <strong>Seletor de tag:</strong> Altera todas as tags daquele tipo (ex: <code>p { color: blue; }</code>).<br>" +
                     "• <strong>Seletor de classe:</strong> Altera elementos com a propriedade <code>class</code> específica (inicia com ponto no CSS, ex: <code>.destaque { font-weight: bold; }</code>).<br>" +
                     "• <strong>Seletor de ID:</strong> Altera um único elemento com a propriedade <code>id</code> específica (inicia com cerquilha no CSS, ex: <code>#topo { color: red; }</code>).",
        example: `<!-- HTML -->
<p class="importante">Texto em destaque.</p>
<p id="rodape">Texto comum de rodapé.</p>

<style>
  .importante { color: green; }
  #rodape { color: gray; }
</style>`,
        analogy: "<strong>Analogia:</strong> O seletor é o endereço postal. Ele diz ao pintor exatamente em qual parede aplicar a tinta."
      },
      {
        id: "boxmodel",
        title: "4. O Box Model (Espaçamento)",
        description: "No desenvolvimento web, todo elemento é considerado uma <strong>caixa retangular</strong>. O Box Model é composto por:<br>" +
                     "• <strong>Content:</strong> O conteúdo de texto ou imagem em si.<br>" +
                     "• <strong>Padding:</strong> O espaço interno entre o conteúdo e a borda.<br>" +
                     "• <strong>Border:</strong> A linha que circula o preenchimento e o conteúdo.<br>" +
                     "• <strong>Margin:</strong> O espaço externo que afasta este elemento de outras caixas.",
        example: `/* Exemplo do Box Model */
div {
    width: 200px;
    padding: 20px;
    border: 2px solid black;
    margin: 15px;
}`,
        analogy: "<strong>Analogia:</strong> O objeto é o Content, o plástico bolha protetor é o Padding, a caixa de papelão é a Border, e o espaço livre para outras caixas na estante é a Margin."
      }
    ],
    indentationNotice: "<strong>⚠️ Regra de Ouro do HTML: Tags Fechadas!</strong> Quase toda tag HTML aberta (ex: <code>&lt;p&gt;</code>) precisa ser fechada (ex: <code>&lt;/p&gt;</code>). Se você esquecer de fechar uma tag, o navegador pode misturar os estilos ou quebrar o layout da sua página inteira!"
  },

  // Perguntas do Quiz
  quiz: [
    {
      id: 1,
      question: "Qual palavra-chave/abreviação significa HTML?",
      options: [
        "HyperText Markup Language",
        "HighTech Modern Language",
        "HyperTransfer Markup Language",
        "Home Tool Markup Language"
      ],
      correctAnswer: 0,
      explanation: "HTML significa HyperText Markup Language (Linguagem de Marcação de Hipertexto) e serve para definir o conteúdo de páginas web."
    },
    {
      id: 2,
      question: "Qual tag HTML é usada para criar o título principal de maior importância de uma página?",
      options: [
        "<title>",
        "<heading>",
        "<h1>",
        "<head>"
      ],
      correctAnswer: 2,
      explanation: "A tag <h1> define o título principal de primeiro nível de uma página web."
    },
    {
      id: 3,
      question: "Qual propriedade CSS é utilizada para alterar a cor de fundo de um elemento?",
      options: [
        "color",
        "background-color",
        "bg-color",
        "font-color"
      ],
      correctAnswer: 1,
      explanation: "Usamos a propriedade 'background-color' para definir o fundo e a propriedade 'color' apenas para a cor do texto."
    },
    {
      id: 4,
      question: "No CSS, como selecionamos todos os elementos que possuem o atributo class=\"destaque\"?",
      options: [
        "#destaque",
        "destaque",
        ".destaque",
        "*destaque"
      ],
      correctAnswer: 2,
      explanation: "No CSS, seletores de classe começam com um ponto '.', seletores de ID começam com '#' e seletores de tag não levam prefixo."
    },
    {
      id: 5,
      question: "No CSS Box Model, qual propriedade representa o espaço interno entre o conteúdo do elemento e sua borda?",
      options: [
        "margin",
        "padding",
        "border",
        "spacing"
      ],
      correctAnswer: 1,
      explanation: "O 'padding' é o preenchimento ou espaçamento interno. A 'margin' é o espaçamento externo que afasta os elementos entre si."
    }
  ],

  // Desafios práticos por nível com casos de teste
  exercises: [
    {
      level: 1,
      name: "Nível 1: Estruturando o Cabeçalho 🏷️",
      description: "Comece criando o título principal da sua página. Crie uma tag <code>&lt;h1&gt;</code> contendo exatamente o texto <strong>Meu Primeiro Site</strong>.",
      starterCode: `<!-- Escreva sua tag h1 abaixo: -->\n`,
      testCases: [
        {
          id: 1,
          label: "Existe a tag h1?",
          validate: (doc) => doc.querySelector('h1') !== null
        },
        {
          id: 2,
          label: "O texto do h1 é 'Meu Primeiro Site'?",
          validate: (doc) => doc.querySelector('h1')?.innerText.trim() === "Meu Primeiro Site"
        }
      ]
    },
    {
      level: 2,
      name: "Nível 2: Dando Cor ao Texto 🎨",
      description: "Dê vida ao seu título! Crie uma tag <code>&lt;h1&gt;</code> com o texto <strong>Título Colorido</strong>. Em seguida, dentro do bloco <code>&lt;style&gt;</code>, adicione uma regra CSS para que o elemento <code>h1</code> tenha a cor vermelha (<code>red</code>).",
      starterCode: `<style>\n  /* Escreva sua regra CSS para o h1 abaixo: */\n  \n</style>\n\n<!-- Crie seu h1 abaixo: -->\n`,
      testCases: [
        {
          id: 1,
          label: "Existe a tag h1?",
          validate: (doc) => doc.querySelector('h1') !== null
        },
        {
          id: 2,
          label: "O texto do h1 é 'Título Colorido'?",
          validate: (doc) => doc.querySelector('h1')?.innerText.trim() === "Título Colorido"
        },
        {
          id: 3,
          label: "A cor do h1 é vermelha?",
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
      name: "Nível 3: Criando Links e Parágrafos 🔗",
      description: "Crie um parágrafo contendo um link. O parágrafo <code>&lt;p&gt;</code> deve conter o texto 'Visite o site do ' seguido de um link <code>&lt;a&gt;</code> direcionado para <code>https://www.google.com</code> com o texto <strong>Google</strong>.",
      starterCode: `<!-- Crie seu parágrafo p com o link a interno abaixo: -->\n<p>Visite o site do </p>`,
      testCases: [
        {
          id: 1,
          label: "Existe a tag p?",
          validate: (doc) => doc.querySelector('p') !== null
        },
        {
          id: 2,
          label: "Existe a tag a dentro de p?",
          validate: (doc) => doc.querySelector('p a') !== null
        },
        {
          id: 3,
          label: "O link aponta para https://www.google.com?",
          validate: (doc) => {
            const a = doc.querySelector('p a');
            if (!a) return false;
            const href = a.getAttribute('href')?.trim();
            return href === "https://www.google.com" || href === "https://www.google.com/" || href === "http://www.google.com";
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
      name: "Nível 4: Selecionando com Classes 🏷️",
      description: "Crie dois parágrafos (<code>&lt;p&gt;</code>):<br>" +
                   "1. O primeiro parágrafo deve ter a classe <code>importante</code> e conter o texto <strong>Atenção Aluno!</strong>.<br>" +
                   "2. O segundo parágrafo deve ser normal (sem classe) e conter o texto <strong>Conteúdo normal.</strong>.<br>" +
                   "No CSS (bloco <code>&lt;style&gt;</code>), estilize o parágrafo de classe <code>importante</code> para que a cor dele fique verde (<code>green</code>). Certifique-se de que o parágrafo normal continue com a cor padrão.",
      starterCode: `<style>\n  /* Estilize apenas a classe importante abaixo: */\n  \n</style>\n\n<!-- Crie os dois parágrafos abaixo: -->\n`,
      testCases: [
        {
          id: 1,
          label: "Existem pelo menos dois parágrafos p?",
          validate: (doc) => doc.querySelectorAll('p').length >= 2
        },
        {
          id: 2,
          label: "Existe um parágrafo com a classe importante?",
          validate: (doc) => doc.querySelector('p.importante') !== null
        },
        {
          id: 3,
          label: "A classe importante está verde?",
          validate: (doc) => {
            const imp = doc.querySelector('p.importante');
            if (!imp) return false;
            const color = window.getComputedStyle(imp).color;
            return color === "rgb(0, 128, 0)" || color === "green";
          }
        },
        {
          id: 4,
          label: "O parágrafo comum não ficou verde?",
          validate: (doc) => {
            const paragraphs = doc.querySelectorAll('p');
            let normalPara = null;
            paragraphs.forEach(p => {
              if (!p.classList.contains('importante')) normalPara = p;
            });
            if (!normalPara) return false;
            const color = window.getComputedStyle(normalPara).color;
            return color !== "rgb(0, 128, 0)" && color !== "green";
          }
        }
      ]
    },
    {
      level: 5,
      name: "Nível 5: O Box Model na Prática 📦",
      description: "Crie uma <code>&lt;div&gt;</code> com a classe <code>painel</code> contendo qualquer texto. No CSS, estilize a classe <code>.painel</code> para ter:<br>" +
                   "• Preenchimento interno (<code>padding</code>) de <code>20px</code>.<br>" +
                   "• Borda sólida de <code>2px</code> na cor preta (<code>black</code>).<br>" +
                   "• Margem externa (<code>margin</code>) de <code>10px</code>.<br>" +
                   "• Uma cor de fundo à sua escolha (não transparente/branca) para destacar o painel.",
      starterCode: `<style>\n  .painel {\n    /* Adicione as regras de box model aqui: */\n    \n  }\n</style>\n\n<!-- Crie a div com classe painel abaixo: -->\n<div class="painel">\n  Conteúdo do Painel\n</div>`,
      testCases: [
        {
          id: 1,
          label: "Existe a div com classe painel?",
          validate: (doc) => doc.querySelector('div.painel') !== null
        },
        {
          id: 2,
          label: "O padding interno é de 20px?",
          validate: (doc) => {
            const painel = doc.querySelector('div.painel');
            if (!painel) return false;
            const style = window.getComputedStyle(painel);
            return style.paddingTop === "20px" && style.paddingRight === "20px";
          }
        },
        {
          id: 3,
          label: "A borda é preta, sólida e com 2px?",
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
          label: "A margin externa é de 10px?",
          validate: (doc) => {
            const painel = doc.querySelector('div.painel');
            if (!painel) return false;
            const style = window.getComputedStyle(painel);
            return style.marginTop === "10px" && style.marginRight === "10px";
          }
        },
        {
          id: 5,
          label: "Possui cor de fundo de destaque?",
          validate: (doc) => {
            const painel = doc.querySelector('div.painel');
            if (!painel) return false;
            const bg = window.getComputedStyle(painel).backgroundColor;
            return bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)" && bg !== "rgb(255, 255, 255)";
          }
        }
      ]
    }
  ],

  // Avaliação 1
  exam: [
    {
      id: 1,
      name: "Questão 1: Botão Customizado de Ação 🔘",
      description: "Crie um botão (<code>&lt;button&gt;</code>) com a classe <code>btn-acao</code> e o texto 'Clique Aqui'. No bloco CSS, estilize o botão para ter:<br>" +
                   "• Cor de fundo azul (<code>blue</code>) e cor de texto branca (<code>white</code>).<br>" +
                   "• Preenchimento interno (<code>padding</code>) de <code>10px</code> na vertical e <code>20px</code> na horizontal.<br>" +
                   "• Sem borda externa (<code>border: none</code>).",
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
          label: "Sem borda?",
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
      name: "Questão 2: Lista de Estudos Sem Marcadores 📋",
      description: "Crie uma lista não ordenada (<code>&lt;ul&gt;</code>) contendo três itens de lista (<code>&lt;li&gt;</code>) com os seguintes textos em ordem: 'Aprender HTML', 'Aprender CSS' e 'Criar Sites'. No CSS:<br>" +
                   "• Remova as bolinhas padrão da lista (<code>list-style-type: none</code>).<br>" +
                   "• Adicione um espaçamento inferior (<code>margin-bottom</code>) de <code>8px</code> a cada item <code>li</code> para separar as tarefas.",
      starterCode: `<style>\n  /* Remova as bolinhas da lista ul e adicione margem aos itens li abaixo: */\n  \n</style>\n\n<!-- Crie a lista ul com os três itens li abaixo: -->\n`,
      testCases: [
        {
          id: 1,
          label: "Existe a tag ul?",
          validate: (doc) => doc.querySelector('ul') !== null
        },
        {
          id: 2,
          label: "Existem 3 itens li internos?",
          validate: (doc) => doc.querySelectorAll('ul li').length === 3
        },
        {
          id: 3,
          label: "Os textos dos itens li estão corretos?",
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
          label: "Espaçamento inferior de 8px nos itens li?",
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
      description: "Crie uma seção (<code>&lt;section&gt;</code>) com o ID <code>destaque</code>. Dentro dela, insira um título <code>&lt;h2&gt;</code> com o texto 'Aviso Urgente' e um parágrafo <code>&lt;p&gt;</code> com o texto 'Matrículas abertas.'. No CSS, estilize:<br>" +
                   "• A seção <code>#destaque</code> deve ter fundo amarelo claro (use cor <code>lightyellow</code> ou a cor hexadecimal <code>#ffffcc</code>) e uma borda lateral esquerda sólida vermelha de <code>5px</code> (<code>border-left: 5px solid red</code>).<br>" +
                   "• O título <code>h2</code> dentro do destaque deve ter cor vermelha (<code>red</code>).",
      starterCode: `<style>\n  /* Estilize o ID destaque e o h2 interno abaixo: */\n  \n</style>\n\n<!-- Crie a section destaque com o h2 e p abaixo: -->\n`,
      testCases: [
        {
          id: 1,
          label: "Existe a section com ID destaque?",
          validate: (doc) => doc.querySelector('section#destaque') !== null
        },
        {
          id: 2,
          label: "Possui h2 e p dentro do destaque?",
          validate: (doc) => {
            const sec = doc.querySelector('section#destaque');
            if (!sec) return false;
            return sec.querySelector('h2') !== null && sec.querySelector('p') !== null;
          }
        },
        {
          id: 3,
          label: "Cor de fundo amarela clara no destaque?",
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
            return r > 200 && g > 200 && b < 240; // matches lightyellow / #ffffcc
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
          label: "O título h2 interno tem a cor vermelha?",
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
