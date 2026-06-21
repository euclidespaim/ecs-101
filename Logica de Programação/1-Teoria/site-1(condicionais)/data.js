// Dados globais do site de estudos de Lógica de Programação
const SITE_DATA = {
  title: "Condicionais 101",
  subtitle: "Aprenda a controlar o fluxo dos seus programas com if, elif e else no Python!",
  
  // Conteúdo teórico estruturado de forma simples e visual
  theory: {
    introduction: "Imagine que você está programando um jogo de corrida. Se o carro passar pela linha de chegada, o jogo deve parar e mostrar 'Você venceu!'. Caso contrário, o carro continua correndo. Essa tomada de decisão no código é feita usando <strong>estruturas condicionais</strong>.",
    concepts: [
      {
        id: "if",
        title: "1. O comando 'if' (Se)",
        description: "O <code>if</code> é o ponto de partida. Ele testa uma condição. Se essa condição for <strong>verdadeira (True)</strong>, o bloco de código que está recuado (indentado) logo abaixo dele é executado.",
        example: `# Exemplo em Python
energia = 80

if energia > 50:
    print("O personagem pode correr!")`,
        analogy: "<strong>Analogia:</strong> <em>Se</em> estiver chovendo, eu abro o guarda-chuva."
      },
      {
        id: "else",
        title: "2. O comando 'else' (Senão)",
        description: "O <code>else</code> serve para quando a condição do <code>if</code> for <strong>falsa (False)</strong>. Ele é o plano B: se a primeira condição não deu certo, o código entra obrigatoriamente no <code>else</code>.",
        example: `# Exemplo em Python
temperatura = 15

if temperatura > 25:
    print("Está calor.")
else:
    print("Está frio ou fresco.")`,
        analogy: "<strong>Analogia:</strong> <em>Se</em> fizer sol, vou à praia. <em>Senão</em>, fico em casa jogando videogame."
      },
      {
        id: "elif",
        title: "3. O comando 'elif' (Senão se)",
        description: "E se você tiver mais de duas opções? O <code>elif</code> (abreviação de <em>else if</em>) permite testar condições extras em ordem. O Python vai testando uma por uma até achar uma verdadeira. Se nenhuma for verdadeira, ele vai para o <code>else</code> no final.",
        example: `# Exemplo em Python
nota = 8.5

if nota >= 9.0:
    print("Excelente!")
elif nota >= 7.0:
    print("Muito bom!")
else:
    print("Precisa estudar mais!")`,
        analogy: "<strong>Analogia:</strong> <em>Se</em> eu tiver R$ 20, compro pizza. <em>Senão, se</em> eu tiver R$ 10, compro um pastel. <em>Senão</em>, como pão com queijo."
      },
      {
        id: "operators",
        title: "4. Valores Booleanos e Operadores Lógicos",
        description: "Além de números e textos, as condições em Python lidam com o tipo lógico booleano: <code>True</code> (Verdadeiro) e <code>False</code> (Falso). Para testar condições compostas no mesmo <code>if</code>, usamos os <strong>operadores lógicos</strong>: <code>and</code> (exige que <em>todas</em> as partes sejam verdadeiras) e <code>or</code> (exige que <em>pelo menos uma</em> parte seja verdadeira). Também há o <code>not</code>, que inverte um valor lógico.",
        example: `# Exemplo em Python
tem_ingresso = True
idade = 17

if tem_ingresso and idade >= 16:
    print("Acesso liberado!")`,
        analogy: "<strong>Analogia:</strong> Vou à praia se fizer sol <em>E</em> eu tiver dinheiro (and). Vou de ônibus se estiver chovendo <em>OU</em> se eu estiver cansado (or)."
      }
    ],
    indentationNotice: "<strong>⚠️ Regra de Ouro do Python: Indentação!</strong> No Python, os blocos de código pertencentes ao <code>if</code>, <code>elif</code> e <code>else</code> devem estar <strong>afastados da margem esquerda</strong> (geralmente por 4 espaços ou 1 tab). Isso mostra ao Python o que está 'dentro' da condição."
  },

  // Perguntas do Quiz com feedback instrutivo
  quiz: [
    {
      id: 1,
      question: "Qual palavra-chave é usada no Python para testar uma condição inicial?",
      options: [
        "when",
        "if",
        "switch",
        "else if"
      ],
      correctAnswer: 1, // 0-indexed index: "if"
      explanation: "Usamos o 'if' para dar início a qualquer estrutura condicional em Python."
    },
    {
      id: 2,
      question: "Observe o código a seguir:\n\nx = 10\nif x > 15:\n    print('A')\nelse:\n    print('B')\n\nO que será impresso na tela?",
      options: [
        "A",
        "B",
        "A e B",
        "Nada será impresso"
      ],
      correctAnswer: 1, // "B"
      explanation: "Como x vale 10, a condição 'x > 15' é Falsa. Portanto, o código ignora o bloco do 'if' e executa o bloco do 'else', imprimindo 'B'."
    },
    {
      id: 3,
      question: "O que significa 'elif' em Python?",
      options: [
        "Uma abreviação de 'else if' para testar uma nova condição caso as anteriores sejam falsas.",
        "Um comando para repetir um bloco de código várias vezes.",
        "Uma palavra para encerrar o programa imediatamente.",
        "Um erro de digitação de 'else'."
      ],
      correctAnswer: 0,
      explanation: "O 'elif' é a junção de 'else' e 'if' (senão se), permitindo criar múltiplas condições intermediárias em sequência."
    },
    {
      id: 4,
      question: "Qual das opções a seguir apresenta a indentação (recuo de código) CORRETA em Python?",
      options: [
        "if x > 5:\nprint('Maior')",
        "if x > 5:\n    print('Maior')",
        "if x > 5\n    print('Maior'):",
        "if x > 5: print('Maior')" // Although technically single-line is allowed, the standard indented block is the correct academic pattern.
      ],
      correctAnswer: 1,
      explanation: "Em Python, colocamos dois pontos ':' no final da linha do 'if' e recuamos a próxima linha com 4 espaços para indicar o bloco interno."
    },
    {
      id: 5,
      question: "Se tivermos o seguinte código:\n\nidade = 16\nif idade >= 18:\n    print('Adulto')\nelif idade >= 12:\n    print('Adolescente')\nelse:\n    print('Criança')\n\nO que será impresso?",
      options: [
        "Adulto",
        "Adolescente",
        "Criança",
        "Adolescente e Criança"
      ],
      correctAnswer: 1,
      explanation: "A primeira condição 'idade >= 18' (16 >= 18) é Falsa. A segunda condição 'idade >= 12' (16 >= 12) é Verdadeira. Logo, imprime 'Adolescente' e finaliza a estrutura condicional, ignorando as demais."
    }
  ],

  // Desafios práticos por nível com casos de teste
  exercises: [
    {
      level: 1,
      name: "Nível 1: Recorde de Pontos 🏆",
      description: "Você está criando um jogo e quer parabenizar o jogador se ele bater o recorde atual. Complete o código abaixo: se o valor da variável <code>pontos</code> for <strong>estritamente maior</strong> que o valor da variável <code>recorde</code>, exiba a mensagem exata <code><em>Novo recorde!</em></code> na tela usando a função <code>print</code>.",
      starterCode: `pontos = 150
recorde = 120

# Escreva seu código if abaixo:
`,
      // Casos de teste que o interpretador vai rodar para validar
      testCases: [
        {
          id: 1,
          label: "Caso 1 (Bateu o Recorde)",
          setupVariables: { pontos: 150, recorde: 120 },
          expectedOutput: "Novo recorde!\n"
        },
        {
          id: 2,
          label: "Caso 2 (Não Bateu o Recorde)",
          setupVariables: { pontos: 100, recorde: 120 },
          expectedOutput: ""
        },
        {
          id: 3,
          label: "Caso 3 (Empatou)",
          setupVariables: { pontos: 120, recorde: 120 },
          expectedOutput: ""
        }
      ]
    },
    {
      level: 2,
      name: "Nível 2: Título de Eleitor 🗳️",
      description: "No Brasil, jovens a partir de 16 anos podem votar. Complete o programa: se a variável <code>idade</code> for <strong>maior ou igual a 16</strong>, imprima <code><em>Pode votar!</em></code>. Caso contrário (se for menor que 16), imprima a mensagem <code><em>Espere mais um pouco!</em></code>.",
      starterCode: `idade = 15

# Escreva seu código if/else abaixo:
`,
      testCases: [
        {
          id: 1,
          label: "Caso 1 (Menor de idade)",
          setupVariables: { idade: 15 },
          expectedOutput: "Espere mais um pouco!\n"
        },
        {
          id: 2,
          label: "Caso 2 (Tem 16 anos cravados)",
          setupVariables: { idade: 16 },
          expectedOutput: "Pode votar!\n"
        },
        {
          id: 3,
          label: "Caso 3 (Maior de idade)",
          setupVariables: { idade: 22 },
          expectedOutput: "Pode votar!\n"
        }
      ]
    },
    {
      level: 3,
      name: "Nível 3: Ranking de Esports 🎮",
      description: "Classifique a patente de um jogador pelo número de Pontos de Liga (<code>pdl</code>) que ele possui:<br>" +
                   "• Se <code>pdl</code> for <strong>menor que 1000</strong>, imprima <code><em>Ferro</em></code>.<br>" +
                   "• Senão, se <code>pdl</code> for <strong>menor que 2000</strong>, imprima <code><em>Bronze</em></code>.<br>" +
                   "• Caso contrário (se for 2000 ou mais), imprima <code><em>Prata</em></code>.",
      starterCode: `pdl = 1250

# Escreva seu código if/elif/else abaixo:
`,
      testCases: [
        {
          id: 1,
          label: "Caso 1 (Pouco PDL)",
          setupVariables: { pdl: 450 },
          expectedOutput: "Ferro\n"
        },
        {
          id: 2,
          label: "Caso 2 (Médio PDL)",
          setupVariables: { pdl: 1250 },
          expectedOutput: "Bronze\n"
        },
        {
          id: 3,
          label: "Caso 3 (Alto PDL)",
          setupVariables: { pdl: 2500 },
          expectedOutput: "Prata\n"
        }
      ]
    },
    {
      level: 4,
      name: "Nível 4: Cupom de Desconto 🏷️",
      description: "Uma loja online calcula o desconto baseado no valor total da compra:<br>" +
                   "• Compras <strong>abaixo de R$ 50.00</strong>: imprima <code><em>Sem desconto</em></code>.<br>" +
                   "• Compras de <strong>R$ 50.00 até R$ 100.00</strong> (inclusive 50 e 100): imprima <code><em>Desconto de 5%</em></code>.<br>" +
                   "• Compras <strong>acima de R$ 100.00</strong>: imprima <code><em>Desconto de 10%</em></code>.",
      starterCode: `valor_compra = 75.0

# Escreva seu código abaixo:
`,
      testCases: [
        {
          id: 1,
          label: "Caso 1 (Compra barata)",
          setupVariables: { valor_compra: 35.5 },
          expectedOutput: "Sem desconto\n"
        },
        {
          id: 2,
          label: "Caso 2 (Limite inferior do cupom de 5%)",
          setupVariables: { valor_compra: 50.0 },
          expectedOutput: "Desconto de 5%\n"
        },
        {
          id: 3,
          label: "Caso 3 (Meio termo de 5%)",
          setupVariables: { valor_compra: 75.0 },
          expectedOutput: "Desconto de 5%\n"
        },
        {
          id: 4,
          label: "Caso 4 (Limite superior do cupom de 5%)",
          setupVariables: { valor_compra: 100.0 },
          expectedOutput: "Desconto de 5%\n"
        },
        {
          id: 5,
          label: "Caso 5 (Compra cara para 10%)",
          setupVariables: { valor_compra: 150.0 },
          expectedOutput: "Desconto de 10%\n"
        }
      ]
    },
    {
      level: 5,
      name: "Nível 5: Semáforo Inteligente 🚦",
      description: "Desenvolva o controle de segurança de um cruzamento inteligente. O programa analisa a <code>cor</code> do semáforo ('verde', 'amarelo' ou 'vermelho') e se há um <code>pedestre_esperando</code> (<code>True</code> ou <code>False</code>).<br>" +
                   "• Se a <code>cor</code> for <strong>'vermelho'</strong> OU se <code>pedestre_esperando</code> for <strong>True</strong>, imprima <code><em>PARE</em></code>.<br>" +
                   "• Senão, se a <code>cor</code> for <strong>'amarelo'</strong> (e nenhum pedestre estiver esperando), imprima <code><em>ATENÇÃO</em></code>.<br>" +
                   "• Caso contrário (semáforo verde e sem pedestres esperando), imprima <code><em>SIGA</em></code>.",
      starterCode: `cor = "verde"
pedestre_esperando = False

# Escreva seu código abaixo:
`,
      testCases: [
        {
          id: 1,
          label: "Caso 1 (Vermelho, sem pedestre)",
          setupVariables: { cor: "vermelho", pedestre_esperando: false },
          expectedOutput: "PARE\n"
        },
        {
          id: 2,
          label: "Caso 2 (Verde com pedestre querendo passar)",
          setupVariables: { cor: "verde", pedestre_esperando: true },
          expectedOutput: "PARE\n"
        },
        {
          id: 3,
          label: "Caso 3 (Amarelo de atenção)",
          setupVariables: { cor: "amarelo", pedestre_esperando: false },
          expectedOutput: "ATENÇÃO\n"
        },
        {
          id: 4,
          label: "Caso 4 (Verde livre para seguir)",
          setupVariables: { cor: "verde", pedestre_esperando: false },
          expectedOutput: "SIGA\n"
        }
      ]
    }
  ],

  // Avaliação 1
  exam: [
    {
      id: 1,
      name: "Questão 1: Vidas do Herói 🎮",
      description: "Em um jogo de aventura, o jogador começa com uma quantidade de vidas. Se a quantidade de vidas (variável <code>vidas</code>) for <strong>igual a zero</strong>, exiba a mensagem exata <code><em>Game Over</em></code> na tela usando a função <code>print</code>. Caso contrário, exiba a mensagem <code><em>Continue Jogando!</em></code>.",
      starterCode: `vidas = 3

# Escreva seu código de validação abaixo:
`,
      testCases: [
        { id: 1, label: "Caso 1 (Sem vidas)", setupVariables: { vidas: 0 }, expectedOutput: "Game Over\n" },
        { id: 2, label: "Caso 2 (Muitas vidas)", setupVariables: { vidas: 3 }, expectedOutput: "Continue Jogando!\n" },
        { id: 3, label: "Caso 3 (Última vida)", setupVariables: { vidas: 1 }, expectedOutput: "Continue Jogando!\n" }
      ]
    },
    {
      id: 2,
      name: "Questão 2: Termômetro da Estufa 🌡️",
      description: "Uma estufa inteligente precisa monitorar a temperatura interna de uma plantação de morangos. Crie o controle:<br>" +
                   "• Se a <code>temperatura</code> for <strong>menor que 15</strong> graus, imprima <code><em>Frio - Ligar aquecedor</em></code>.<br>" +
                   "• Senão, se a <code>temperatura</code> for <strong>menor ou igual a 25</strong>, imprima <code><em>Temperatura ideal</em></code>.<br>" +
                   "• Caso contrário (se for maior que 25), imprima <code><em>Quente - Ligar resfriador</em></code>.",
      starterCode: `temperatura = 18.5

# Escreva seu código com if, elif e else abaixo:
`,
      testCases: [
        { id: 1, label: "Caso 1 (Muito frio)", setupVariables: { temperatura: 12 }, expectedOutput: "Frio - Ligar aquecedor\n" },
        { id: 2, label: "Caso 2 (Limite frio/ideal)", setupVariables: { temperatura: 15 }, expectedOutput: "Temperatura ideal\n" },
        { id: 3, label: "Caso 3 (Agradável)", setupVariables: { temperatura: 22.5 }, expectedOutput: "Temperatura ideal\n" },
        { id: 4, label: "Caso 4 (Limite ideal/quente)", setupVariables: { temperatura: 25 }, expectedOutput: "Temperatura ideal\n" },
        { id: 5, label: "Caso 5 (Muito quente)", setupVariables: { temperatura: 30 }, expectedOutput: "Quente - Ligar resfriador\n" }
      ]
    },
    {
      id: 3,
      name: "Questão 3: Montanha-Russa Radical 🎢",
      description: "Para entrar em uma montanha-russa radical, o visitante deve atender a dois requisitos de segurança ao mesmo tempo:<br>" +
                   "1. Ter <code>altura</code> maior ou igual a <strong>1.40</strong> metros.<br>" +
                   "2. Ter <code>idade</code> maior ou igual a <strong>12</strong> anos.<br>" +
                   "Se o visitante cumprir ambos os requisitos, imprima <code><em>Acesso autorizado</em></code>. Caso contrário, imprima <code><em>Acesso negado</em></code>.",
      starterCode: `altura = 1.45
idade = 11

# Escreva seu código de validação abaixo:
`,
      testCases: [
        { id: 1, label: "Caso 1 (Falta idade)", setupVariables: { altura: 1.45, idade: 11 }, expectedOutput: "Acesso negado\n" },
        { id: 2, label: "Caso 2 (Falta altura)", setupVariables: { altura: 1.35, idade: 14 }, expectedOutput: "Acesso negado\n" },
        { id: 3, label: "Caso 3 (Autorizado)", setupVariables: { altura: 1.50, idade: 13 }, expectedOutput: "Acesso autorizado\n" },
        { id: 4, label: "Caso 4 (Limites exatos)", setupVariables: { altura: 1.40, idade: 12 }, expectedOutput: "Acesso autorizado\n" }
      ]
    }
  ]
};
