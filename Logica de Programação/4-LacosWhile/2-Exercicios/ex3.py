opcao = "0"

while opcao != "3":
    print("###################\n")
    print("1 - Iniciar partida")
    print("2 - Ver Inventário")
    print("3 - Sair do Jogo\n")
    print("###################\n")

    opcao = input("Escolha uma opção do menu: ")

    if opcao == "1":
        print("Carregando o mapa... Aguarde!")
    elif opcao == "2":
        print("Inventário vazio no momento.")
    elif opcao == "3":
        print("Saindo do jogo. Até a próxima!")
    else:
        print("Comando inválido! Tente novamente.")
