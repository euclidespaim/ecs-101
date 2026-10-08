print("Caverna do dragão! Você está entrando em uma masmorra!")

botas = input("Você está usando botas silenciosas? (sim/nao)")

if botas == "sim":
    dragao = input("O dragão acordou? (sim/nao)")
    
    if dragao == "nao":
        print("Você roubou o tesouro e escapou!")
    elif dragao == "sim":
        print("O dragão te viu! Fim de jogo.")
    else:
        print("Opção inválida, tente novamente!")
else:
    print("Seus passos fizeram barulho e você não pôde entrar.")