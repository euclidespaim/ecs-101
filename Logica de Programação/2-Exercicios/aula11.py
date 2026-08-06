'''
Escreva um programa em Python que receba a nota de um aluno 
(considere um valor numérico entre 0 e 10) e exiba uma mensagem 
de incentivo de acordo com os seguintes critérios:

* Excelente! para notas maiores ou iguais a \(9.0\).
* Precisa estudar mais! para notas menores que \(7.0\).

Dica: Utilize estruturas condicionais como if e else para verificar as 
faixas de nota corretamente.
'''

nota = int(input("Digite a nota do aluno: "))

if nota >= 9:
    print("Excelente!")
else:
    print("Precisa estudar mais!")