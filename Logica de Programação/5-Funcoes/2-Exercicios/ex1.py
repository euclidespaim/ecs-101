def gerar_passe(agente, setor):
    print("Passe liberado: Agente: ", agente, 
    "autorizado no setor: ", setor, ".")

agente = input("Digite o nome do agente: ")
setor = input("Digite o setor de acesso: ")

gerar_passe(agente, setor)

gerar_passe(input("Digite o nome"), input("Digite o setor"))