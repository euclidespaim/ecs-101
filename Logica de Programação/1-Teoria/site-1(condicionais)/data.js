// Dados globais do site de estudos de Lógica de Programação
const MODULES_DATA = {
  condicionais: {
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
  ],

  // Prova de Recuperação 1
  recovery: [
    {
      id: 1,
      name: "Questão 1: Controle de Acesso (Cinema) 🎬",
      description: "Em um cinema, a entrada para um filme de classificação 16 anos precisa de verificação. Se a idade (variável <code>idade</code>) for <strong>maior ou igual a 16</strong>, imprima a mensagem exata <code><em>Acesso permitido</em></code> na tela usando a função <code>print</code>. Caso contrário, imprima <code><em>Acesso negado</em></code>.",
      starterCode: `idade = 15

# Escreva seu código de validação abaixo:
`,
      testCases: [
        { id: 1, label: "Caso 1 (Menor de 16)", setupVariables: { idade: 15 }, expectedOutput: "Acesso negado\n" },
        { id: 2, label: "Caso 2 (16 anos cravados)", setupVariables: { idade: 16 }, expectedOutput: "Acesso permitido\n" },
        { id: 3, label: "Caso 3 (Maior de 16)", setupVariables: { idade: 18 }, expectedOutput: "Acesso permitido\n" }
      ]
    },
    {
      id: 2,
      name: "Questão 2: Sensor de Pressão 🌋",
      description: "O sensor de uma caldeira mede a pressão em atm. Crie o controle de fluxo:<br>" +
                   "• Se a <code>pressao</code> for <strong>menor ou igual a 5.0</strong> atm, imprima <code><em>Pressao normal</em></code>.<br>" +
                   "• Senão, se a <code>pressao</code> for <strong>menor ou igual a 8.0</strong> atm, imprima <code><em>Alerta - Pressao alta</em></code>.<br>" +
                   "• Caso contrário (se for maior que 8.0), imprima <code><em>Perigo - Desligar sistema</em></code>.",
      starterCode: `pressao = 4.2

# Escreva seu código com if, elif e else abaixo:
`,
      testCases: [
        { id: 1, label: "Caso 1 (Pressão normal baixa)", setupVariables: { pressao: 4.2 }, expectedOutput: "Pressao normal\n" },
        { id: 2, label: "Caso 2 (Limite normal)", setupVariables: { pressao: 5.0 }, expectedOutput: "Pressao normal\n" },
        { id: 3, label: "Caso 3 (Alerta de alta)", setupVariables: { pressao: 6.8 }, expectedOutput: "Alerta - Pressao alta\n" },
        { id: 4, label: "Caso 4 (Limite alerta)", setupVariables: { pressao: 8.0 }, expectedOutput: "Alerta - Pressao alta\n" },
        { id: 5, label: "Caso 5 (Perigo crítico)", setupVariables: { pressao: 9.5 }, expectedOutput: "Perigo - Desligar sistema\n" }
      ]
    },
    {
      id: 3,
      name: "Questão 3: Login Seguro 🔑",
      description: "Para fazer login no sistema interno da escola, o usuário deve atender a dois requisitos ao mesmo tempo:<br>" +
                   "1. A conta deve estar ativa (variável <code>conta_ativa</code> deve ser <code>True</code>).<br>" +
                   "2. A senha deve estar correta (variável <code>senha_correta</code> deve ser <code>True</code>).<br>" +
                   "Se ambos os requisitos forem atendidos, imprima <code><em>Login efetuado</em></code>. Caso contrário, imprima <code><em>Login negado</em></code>.",
      starterCode: `conta_ativa = True
senha_correta = False

# Escreva seu código de validação abaixo:
`,
      testCases: [
        { id: 1, label: "Caso 1 (Conta inativa, senha incorreta)", setupVariables: { conta_ativa: false, senha_correta: false }, expectedOutput: "Login negado\n" },
        { id: 2, label: "Caso 2 (Conta inativa, senha correta)", setupVariables: { conta_ativa: false, senha_correta: true }, expectedOutput: "Login negado\n" },
        { id: 3, label: "Caso 3 (Conta ativa, senha incorreta)", setupVariables: { conta_ativa: true, senha_correta: false }, expectedOutput: "Login negado\n" },
        { id: 4, label: "Caso 4 (Login correto)", setupVariables: { conta_ativa: true, senha_correta: true }, expectedOutput: "Login efetuado\n" }
      ]
    }
  ]
  },
  laco_for: {
    title: "Laço For 101",
    subtitle: "Domine a arte das repetições e iterações no Python com o laço for!",
    theory: {
      introduction: "Na programação, muitas vezes precisamos repetir a mesma ação várias vezes. Imagine ter que imprimir os números de 1 a 1000 escrevendo print() mil vezes! O laço <strong>for</strong> resolve isso permitindo que um bloco de código seja repetido automaticamente.",
      concepts: [
        {
          id: "for_intro",
          title: "1. O Básico do Laço For",
          description: "O laço <code>for</code> em Python é usado para iterar (percorrer) sobre uma sequência. Para cada item na sequência, o bloco de código indentado é executado uma vez.",
          example: `# Exemplo em Python\nlista = [1, 2, 3]\nfor item in lista:\n    print(item)`,
          analogy: "<strong>Analogia:</strong> Para cada 'aluno' na 'sala de aula', entregue uma 'prova'."
        },
        {
          id: "for_range",
          title: "2. A Função range()",
          description: "Muito frequentemente, queremos repetir algo um número específico de vezes. A função <code>range(n)</code> gera uma sequência de números de 0 até n-1.",
          example: `# Repete 5 vezes (0, 1, 2, 3, 4)\nfor i in range(5):\n    print(i)`,
          analogy: "<strong>Analogia:</strong> Dê exatamente 5 voltas na pista de corrida."
        },
        {
          id: "for_range_params",
          title: "3. Limites no range()",
          description: "Podemos especificar um início e um fim para o range com <code>range(início, fim)</code>. O número de fim não é incluído na contagem.",
          example: `# Imprime do 1 ao 4\nfor x in range(1, 5):\n    print(x)`,
          analogy: "<strong>Analogia:</strong> Leia o livro começando do capítulo 1 até terminar o capítulo 4."
        },
        {
          id: "for_list",
          title: "4. Percorrendo Listas",
          description: "O <code>for</code> é excelente para passar por cada item de uma lista, um por um, e fazer algo com ele, sem precisar usar índices numéricos diretamente.",
          example: `frutas = ["maçã", "banana", "uva"]\nfor fruta in frutas:\n    print("Eu gosto de " + fruta)`,
          analogy: "<strong>Analogia:</strong> Olhe para sua lista de compras e coloque cada item no carrinho, um por um."
        }
      ],
      indentationNotice: "<strong>⚠️ Indentação!</strong> Assim como no if/else, tudo que está dentro do <code>for</code> deve estar indentado."
    },
    quiz: [
      {
        id: 1,
        question: "Qual comando Python é usado para criar uma repetição com um número previsível de vezes?",
        options: ["if", "for", "repeat", "while"],
        correctAnswer: 1,
        explanation: "O 'for' é ideal quando sabemos quantas vezes queremos repetir um bloco de código."
      },
      {
        id: 2,
        question: "O que o comando `range(3)` gera no Python?",
        options: ["Os números 1, 2, 3", "Os números 0, 1, 2, 3", "Os números 0, 1, 2", "Um erro"],
        correctAnswer: 2,
        explanation: "O range(n) começa do 0 e vai até n-1, totalizando n repetições."
      },
      {
        id: 3,
        question: `Quantas vezes a mensagem 'Oi' será impressa no código abaixo?\nfor i in range(2, 5):\n    print('Oi')`,
        options: ["2 vezes", "3 vezes", "4 vezes", "5 vezes"],
        correctAnswer: 1,
        explanation: "O range(2, 5) gera os números 2, 3 e 4. Portanto, repete 3 vezes."
      },
      {
        id: 4,
        question: "Como você leria o comando `for item in lista:` em português?",
        options: [
          "Para cada item na lista",
          "Se o item estiver na lista",
          "Enquanto o item for lista",
          "Para uma lista chamada item"
        ],
        correctAnswer: 0,
        explanation: "A leitura literal e o conceito lógico é exatamente 'Para cada item na lista faça...'"
      },
      {
        id: 5,
        question: "O que acontecerá se o código dentro do for NÃO estiver recuado (indentado)?",
        options: [
          "O programa rodará normalmente.",
          "O for será ignorado.",
          "O Python gerará um Erro de Indentação.",
          "Ele será executado infinitamente."
        ],
        correctAnswer: 2,
        explanation: "Assim como nas condicionais, o Python usa a indentação para saber quais comandos pertencem ao bloco do laço."
      }
    ],
    exercises: [
      {
        level: 1,
        name: "Nível 1: Contador Básico 🔢",
        description: "Use o laço <code>for</code> e a função <code>range(5)</code> para imprimir os números de 0 a 4, cada um em uma linha.",
        starterCode: `# Escreva seu laço for abaixo:\n`,
        testCases: [
          { id: 1, label: "Teste padrão", setupVariables: {}, expectedOutput: "0\n1\n2\n3\n4\n" }
        ]
      },
      {
        level: 2,
        name: "Nível 2: Tabuada Simples ✖️",
        description: "Escreva um <code>for</code> usando <code>range(1, 6)</code> para imprimir a tabuada do número 3 (de 1 a 5). O que vai ser impresso será o resultado de cada iteração vezes 3 (você pode guardar em uma variável ou calcular direto).",
        starterCode: `numero = 3\n# Faça o loop para calcular resultado = i * numero e imprimi-lo\n`,
        testCases: [
          { id: 1, label: "Teste da Tabuada", setupVariables: { numero: 3 }, expectedOutput: "3\n6\n9\n12\n15\n" }
        ]
      },
      {
        level: 3,
        name: "Nível 3: Intervalo Personalizado 📏",
        description: "Dadas as variáveis dinâmicas <code>inicio</code> e <code>fim</code>, use um <code>for</code> iterando por <code>range(inicio, fim)</code> e imprima cada número.",
        starterCode: `inicio = 10\nfim = 13\n\n# Escreva o for usando as variaveis acima:\n`,
        testCases: [
          { id: 1, label: "Caso 1", setupVariables: { inicio: 10, fim: 13 }, expectedOutput: "10\n11\n12\n" },
          { id: 2, label: "Caso 2", setupVariables: { inicio: 5, fim: 7 }, expectedOutput: "5\n6\n" }
        ]
      },
      {
        level: 4,
        name: "Nível 4: A Busca por Suprimentos 🏕️",
        description: "<strong>Cenário:</strong> O mundo como o conhecemos acabou e você está abrigado em uma zona segura. A comida está acabando e você precisa sair para explorar as ruínas da cidade durante 5 dias seguidos.<br><br>" +
                     "<strong>Sua Missão:</strong><br>" +
                     "1. Crie uma variável chamada <code>total_comida</code> começando com o valor <code>0</code>.<br>" +
                     "2. Utilize um laço <code>for</code> com a função <code>range()</code> para simular os 5 dias de busca.<br>" +
                     "3. Dentro do laço, pergunte ao usuário (com <code>input()</code> e <code>int()</code>): \"Quantas latas de comida encontrou no dia X?\"<br>" +
                     "4. Adicione esse valor à variável <code>total_comida</code>.<br>" +
                     "5. Fora do laço, no final do programa, utilize um <code>if/else</code>:<br>" +
                     "• Se o total for maior ou igual a <strong>15</strong>, exiba: <code><em>Conseguimos suprimentos suficientes para sobreviver este mês!</em></code>.<br>" +
                     "• Caso contrário, exiba: <code><em>A situação é crítica. Vamos passar fome...</em></code>.",
        starterCode: `total_comida = 0\n\n# Escreva seu laço for para os 5 dias de busca abaixo:\n`,
        testCases: [
          {
            id: 1,
            label: "Caso 1: Expedição Fartura (18 latas)",
            setupVariables: { inputs: [3, 4, 5, 2, 4] },
            expectedOutput: "Conseguimos suprimentos suficientes para sobreviver este mês!\n"
          },
          {
            id: 2,
            label: "Caso 2: Expedição Escassa (9 latas)",
            setupVariables: { inputs: [2, 1, 3, 2, 1] },
            expectedOutput: "A situação é crítica. Vamos passar fome...\n"
          },
          {
            id: 3,
            label: "Caso 3: Limite de Sobrevivência (15 latas)",
            setupVariables: { inputs: [3, 3, 3, 3, 3] },
            expectedOutput: "Conseguimos suprimentos suficientes para sobreviver este mês!\n"
          }
        ]
      }
    ],
    exam: [],
    recovery: []
  }
};
