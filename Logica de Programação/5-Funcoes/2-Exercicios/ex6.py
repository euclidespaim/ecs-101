"""
Crie uma única função em Python chamada
boletim(nome, nota1, nota2) que receba o nome do
aluno e duas notas, calcule a média e imprima na
tela: Ana - média: 9.0

A conta fica dentro da função: ela recebe as notas
cruas e mostra o resultado. Não use input().

1. Dentro da função, guarde a média numa variável:
   media = (nota1 + nota2) / 2.
2. Imprima o nome e a média na mesma linha.
3. Fora da função, faça três chamadas com notas já
   escritas no código: Ana com 8 e 10, Beto com
   5 e 6, Carla com 7 e 7.

Dica: em Python a divisão sempre devolve número
quebrado, por isso a média de 7 e 7 aparece como
7.0, e não como 7.

Para pensar: a função foi escrita uma vez só, mas
calculou três médias diferentes. Quem decide quais
notas ela usa em cada chamada?
"""

def boletim(nome, nota1, nota2):
   media = (nota1 + nota2) / 2
   print("O aluno: ", nome , 
   "ficou com: " , media , "na média.")

boletim("Ana", 8, 10)
boletim("Isaque", 6, 5)