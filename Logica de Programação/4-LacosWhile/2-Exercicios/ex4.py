senha_secreta = "";

while senha_secreta != 42:

    senha_secreta = int(input("Chuta uma valor entre 0 e 100: "))

    if senha_secreta > 42:
        print("Tá alto!")
    
    elif senha_secreta < 42:
        print("Tá baixo!")

print("Acertou!!")