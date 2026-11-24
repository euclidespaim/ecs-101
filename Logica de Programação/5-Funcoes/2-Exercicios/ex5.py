"""
Crie uma única função em Python chamada
retangulo(largura, altura) que desenhe um
retângulo de "#" na tela: cada linha tem largura
símbolos, e são altura linhas.

1. Desenhe um retângulo deitado, de 5 de largura
   por 2 de altura.
2. Deixe uma linha em branco entre os dois, com
   um print() sem nada dentro.
3. Desenhe outro retângulo, agora de 2 de largura
   por 5 de altura.

Para pensar: as duas chamadas usam os mesmos dois
números, 5 e 2. Por que os desenhos ficaram
diferentes?

Desafio: crie uma segunda função, quadrado(lado),
que não desenha nada sozinha: ela só chama
retangulo(lado, lado). Depois teste com
quadrado(4).
"""

def retangulo(largura, altura):
    for x in range(altura):
        print("#" * largura)


# retangulo(5, 2)


def quadrado(lado):
    retangulo(lado, lado)


quadrado(5)