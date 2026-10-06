# Crie um menu com duas opções de compra e uma 
# opção para sair. Ao escolher um item, o programa 
# deve verificar com um if se o saldo é maior ou 
# igual ao preço. Se for, subtrai o valor do saldo. 
# O laço encerra quando o jogador escolhe "Sair".

saldo = 100
op = "0"

print("Bem vindo a loja do Ferreiro!")

while op != "3":
    print("\nSaldo em moedas: ", saldo)
    print("1 - Comprar Poção (20 moedas)")
    print("2 - Comprar Espada (30 moedas)")
    print("3 - Sair da Loja")

    op = input("O que deseja fazer? ")

    if op == "1":
        if saldo >=  20:
            saldo = saldo - 20
            print("Você comprou um Poção!")
        else:
            print("Você não tem saldo suficiente!")
    
    elif op == "2":
        if saldo >= 30:
            saldo = saldo - 30
            print("Você comprou uma Espada!")
        else:
            print("Você não tem saldo suficiente!")
        
    else:
        print("Opção inválida!")

print("Volte sempre!!")




