"""
Crie uma única função em Python chamada
mostrar_total(nome, total) que receba um nome e um
valor e imprima na tela: Ana deve pagar R$ 36

Repare: aqui a função não faz conta nenhuma, só
mostra o que recebeu. Quem faz a conta é a
chamada. Não use input().

1. Antes das chamadas, crie duas variáveis:
   preco = 12 e quantidade = 3.
2. Chame a função três vezes, passando uma conta
   no lugar do total:

   mostrar_total("Ana", preco * quantidade)
   mostrar_total("Beto", 8 + 5)
   mostrar_total("Carla", preco)

Para pensar: o Python resolve a conta antes de
entregar o valor para a função. Na primeira
chamada, que número chegou dentro de total?
"""

def mostrar_total(nome, total):
   print(nome, "deve pagar: ", total)

preco = 12
quantidade = 3

mostrar_total("Ana", preco * quantidade)
mostrar_total("Beto", 8 + 5)
mostrar_total("Carla", preco)
