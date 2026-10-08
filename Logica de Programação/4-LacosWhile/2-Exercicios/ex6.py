chave = int(input("Você possui uma chave? 1- sim 2- não"))


if chave == 1:
    nivel = int(input("Qual o nível do seu personagem? "))

    if nivel >= 10:
        print("Porta aberta!!")
    else:
        print("Nível muito baixo para entrar.")

else:
    print("Você precisa de uma chave.")