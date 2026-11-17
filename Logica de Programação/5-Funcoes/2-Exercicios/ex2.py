def registrar_missao(agente, cidade, dias):
    print("Agente", agente, 
          "em missão em", cidade,
          "por", dias, "dias.")

agente = input("Digite o nome do agente: ")
cidade = input("Digite a cidade da missão: ")
dias = int(input("Quantos dias de missão? "))

registrar_missao(agente, cidade, dias)

registrar_missao("Falcão", "Curitiba", 5)
registrar_missao("Coruja", "Manaus", 12)


