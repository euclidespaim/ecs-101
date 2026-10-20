caminho = int(input("Escolha um caminho 1-Esquerda/2-Direita"))

if caminho == 1:
    goblin = int(input("Você viu um goblin!! 1-Atacar/2-Fugir"))

    if goblin == 1:
        print("Você derrotou o monstro!")
    elif goblin == 2:
        print("Você escapou em segurança!")

elif caminho == 2:
    bau = int(input("Você achou um baú! (1-abrir/2-ignorar)"))

    if bau == 1:
        print("Era uma armadilha! Fim de jogo.")
    elif bau == 2:
        print("Você passou direto e sobreviveu.")
