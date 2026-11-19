"""
Crie uma única função em Python chamada 
tabuada(numero) que receba um número e imprima 
a tabuada inteira dele, do 1 ao 10, uma linha 
por vez:
"""

def tabuada(numero):
    for x in range(1, 11):
        print(numero, "x", x, "=", numero * x)

tabuada(1)
tabuada(3)
tabuada(9)
