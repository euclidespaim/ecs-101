energia = 50

while energia > 0:
    resposta =   input("O que você encontrou: ouro/pedra? ")
    resposta = resposta.lower()

    if resposta == "ouro":
        print("Você ficou mais rico!!")
    else:
        print("Apenas cascalho!")
    
    energia -= 10

print("Fim do expediente. Hora da taverna!!")