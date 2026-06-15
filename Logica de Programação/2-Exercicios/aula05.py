# Crie um programa que:
# Pergunte o nome do aluno.
# Pergunte o ano de nascimento.
# Calcule a idade (2026 - ano).
# Mostre: "Olá [Nome], você tem [Idade] anos!".

# Entrada de dados
nome = input("Informe seu nome por favor: ")
ano_nasc = int(input("informe o ano em que você nasceu: "))


# Processamento
idade = 2026 - ano_nasc

# Saída de dados
print("Olá ", nome , "você tem " , idade, "anos!")


