'''
Para entrar em uma montanha-russa radical, 
o visitante deve atender a dois requisitos de 
segurança ao mesmo tempo:

1. Ter altura maior ou igual a 1.40 metros.
2. Ter idade maior ou igual a 12 anos.
Se o visitante cumprir ambos os requisitos, 
imprima Acesso autorizado. Caso contrário, 
imprima Acesso negado.
'''

altura = 1.45
idade = 11

# Escreva seu código de validação abaixo:
if altura >= 1.40 and idade >=12:
    print("Acesso autorizado")
else:
    print("Acesso negado")
