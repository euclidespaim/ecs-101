def calcular_total(preco, quantidade):
    return preco * quantidade


total = calcular_total(12, 3)
print("O total da compra foi ", total)

troco = 100 - calcular_total(12, 3)
print("O troco pra 100 Reais é: ", troco)

print(calcular_total(6, 2) + calcular_total(3, 4))