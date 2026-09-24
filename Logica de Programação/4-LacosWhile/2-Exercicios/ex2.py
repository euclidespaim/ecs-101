# Crie uma variável energia = 100. Faça um laço 
# while que continue rodando enquanto a energia 
# for maior que 0. Dentro do laço, pergunte ao 
# usuário "Qual foi o dano do meteoro?" e subtraia 
# esse valor da energia. Quando a energia chegar a 
# zero ou menos, imprima 
# "O escudo falhou! Nave destruída!".

energia = 100

while energia > 0:
    dano = int(input("Qual foi o dano do meteoro?"))
    
    energia = energia - dano 

    if energia > 0:
        print("Escudo inteiro!!", energia)
    else:
        print("O escudo falhou! a nave foi destruída!", energia)