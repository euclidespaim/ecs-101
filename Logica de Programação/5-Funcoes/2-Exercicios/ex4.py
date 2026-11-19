'''
Desafio: faça a tabuada parar onde você quiser. 
Troque a definição para tabuada(numero, ate) e 
use range(1, ate + 1). Assim tabuada(7, 5) mostra 
só até 7 x 5. Depois de mudar a definição, todas 
as chamadas precisam passar dois argumentos, nem 
mais, nem menos.
'''

def tabuada(numero, ate):
    for i in range(1, ate + 1):
        print(numero, "x", i, "=", numero * i)


tabuada(3, 10)

