# Peça ao usuário para digitar o número de degraus. 

# Utilize um laço for com range() e o operador de 

# multiplicação de string (*) para desenhar a escada 
# na tela usando o caractere " # "

degraus = int(input("Digite o núnmero de degraus: "))

for x in range(1, degraus):
    print("#" * x)


