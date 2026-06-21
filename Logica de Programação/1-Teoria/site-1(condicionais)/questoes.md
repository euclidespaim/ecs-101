# Exercícios de Fixação: Estruturas Condicionais em Python 🐍

Esta lista de exercícios foi elaborada para alunos do 1º ano do Ensino Médio que estão iniciando seus estudos em lógica de programação. A estrutura e a progressão de dificuldade são semelhantes às do site interativo **Condicionais 101**.

---

## 🎯 Exercício 1: Nível Fácil (Estrutura `if` / `else` Simples)

### Enunciado: **Vidas do Herói** 🎮
Em um jogo de aventura, o jogador começa com uma quantidade de vidas. Se a quantidade de vidas chegar a zero, o jogo deve mostrar a mensagem `*Game Over*` na tela. Caso contrário, o jogo deve mostrar a mensagem `*Continue Jogando!*`.

Complete o código em Python abaixo para que ele realize essa validação.

### Código Inicial (Esqueleto):
```python
vidas = 3  # Esta variável pode mudar durante o jogo

# Escreva seu código de validação abaixo:

```

### Casos de Teste Esperados:
- **Caso 1:** Se `vidas = 0`, a saída na tela deve ser exatamente: `*Game Over*`
- **Caso 2:** Se `vidas = 3`, a saída na tela deve ser exatamente: `*Continue Jogando!*`
- **Caso 3:** Se `vidas = 1`, a saída na tela deve ser exatamente: `*Continue Jogando!*`

<details>
<summary>💡 Ver Resolução Comentada (Gabarito)</summary>

```python
# Resolução Esperada:
if vidas == 0:
    print("Game Over")
else:
    print("Continue Jogando!")
```

**Explicação Didática:**
- O `if vidas == 0:` verifica se o número de vidas é igual a zero (lembrando de usar `==` para comparação).
- Se for verdadeiro, ele executa o bloco indentado e imprime `*Game Over*`.
- O `else:` funciona como a opção alternativa para qualquer valor de vidas que não seja zero, imprimindo `*Continue Jogando!*`.
</details>

---

## 🎯 Exercício 2: Nível Intermediário (Estrutura `if` / `elif` / `else`)

### Enunciado: **Termômetro da Estufa** 🌡️
Uma estufa inteligente precisa monitorar a temperatura interna de uma plantação de morangos. O sistema funciona da seguinte forma:
* Se a `temperatura` for **menor que 15 graus**, imprima `*Frio - Ligar aquecedor*`.
* Se a `temperatura` estiver **entre 15 e 25 graus (inclusive 15 e 25)**, imprima `*Temperatura ideal*`.
* Se a `temperatura` for **maior que 25 graus**, imprima `*Quente - Ligar resfriador*`.

Complete o código em Python para exibir a mensagem correta com base no valor da variável `temperatura`.

### Código Inicial (Esqueleto):
```python
temperatura = 18.5  # Pode ser qualquer valor decimal ou inteiro

# Escreva seu código com if, elif e else abaixo:

```

### Casos de Teste Esperados:
- **Caso 1:** Se `temperatura = 12`, a saída deve ser: `*Frio - Ligar aquecedor*`
- **Caso 2:** Se `temperatura = 15`, a saída deve ser: `*Temperatura ideal*`
- **Caso 3:** Se `temperatura = 22.5`, a saída deve ser: `*Temperatura ideal*`
- **Caso 4:** Se `temperatura = 25`, a saída deve ser: `*Temperatura ideal*`
- **Caso 5:** Se `temperatura = 30`, a saída deve ser: `*Quente - Ligar resfriador*`

<details>
<summary>💡 Ver Resolução Comentada (Gabarito)</summary>

```python
# Resolução Esperada (Opção A):
if temperatura < 15:
    print("Frio - Ligar aquecedor")
elif temperatura <= 25:
    print("Temperatura ideal")
else:
    print("Quente - Ligar resfriador")
```

**Explicação Didática:**
- No Python, a leitura é feita de cima para baixo.
- O primeiro `if` testa se a temperatura é menor que 15. Se for falso, o fluxo passa para o `elif`.
- Como já sabemos que a temperatura é de pelo menos 15 (pois falhou no primeiro teste), o `elif temperatura <= 25:` é suficiente para cobrir a faixa de 15 a 25.
- Se a temperatura for maior que 25, ela falhará em ambos os testes anteriores e entrará diretamente no `else:`.
</details>

---

## 🎯 Exercício 3: Nível Avançado (Condições Compostas com Operadores Lógicos)

### Enunciado: **Montanha-Russa Radical** 🎢
Uma montanha-russa muito alta e rápida no parque de diversões tem regras rígidas de segurança por motivos físicos. Para entrar no brinquedo, o visitante deve atender a dois requisitos simultaneamente:
1. Ter **altura** maior ou igual a **1.40 metros**.
2. Ter **idade** maior ou igual a **12 anos**.

Complete o código utilizando operadores lógicos. Se o visitante cumprir ambos os requisitos, imprima `*Acesso autorizado*`. Caso contrário, imprima `*Acesso negado*`.

### Código Inicial (Esqueleto):
```python
altura = 1.45
idade = 11

# Escreva seu código de validação utilizando operadores lógicos abaixo:

```

### Casos de Teste Esperados:
- **Caso 1:** Se `altura = 1.45` e `idade = 11`, a saída deve ser: `*Acesso negado*` (falta idade).
- **Caso 2:** Se `altura = 1.35` e `idade = 14`, a saída deve ser: `*Acesso negado*` (falta altura).
- **Caso 3:** Se `altura = 1.50` e `idade = 13`, a saída deve ser: `*Acesso autorizado*` (cumpre ambos).
- **Caso 4:** Se `altura = 1.40` e `idade = 12`, a saída deve ser: `*Acesso autorizado*` (limites exatos).

<details>
<summary>💡 Ver Resolução Comentada (Gabarito)</summary>

```python
# Resolução Esperada:
if altura >= 1.40 and idade >= 12:
    print("Acesso autorizado")
else:
    print("Acesso negado")
```

**Explicação Didática:**
- Usamos o operador lógico `and` porque a regra de segurança exige que **ambas** as condições sejam verdadeiras ao mesmo tempo.
- Se pelo menos uma das variáveis não atingir o limite mínimo, a condição conjunta se torna `False` e o programa executa o bloco do `else:`, imprimindo `*Acesso negado*`.
</details>
