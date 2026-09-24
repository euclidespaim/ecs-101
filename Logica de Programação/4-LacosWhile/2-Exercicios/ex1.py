# Crie um programa que enquanto o usuário não 
# digitar "2026" peça a senha repetidamente 
# Se ele errar, exiba "Senha incorreta". 
# Se ele acertar, o laço deve terminar e 
# exibir "Celular desbloqueado!".

senha = ""
print('=== TELA DE BLOQUEIO ===')

while senha != "2026":
    senha = input("Digite a senha de 4 dígitos:")

    if senha != "2026":
        print("Acesso negado. Tente novamente.\n")

print("Celular desbloqueado!")
