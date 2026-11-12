integridade = 100

while integridade > 0:
    ataque = int(input("Qual o poder do seu ataque?"))

    integridade = integridade - ataque
    print("Integridade do firewall em: ", integridade)

print("Firewall destruído! Acesso concedido.")
