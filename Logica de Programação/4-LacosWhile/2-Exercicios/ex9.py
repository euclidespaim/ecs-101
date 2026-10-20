integridade = 50

while integridade >= 0:
    ataque = int(input("Qual o poder do seu ataque?"))

    integridade = integridade - ataque

print("Firewall destruído! Acesso concedido.")
