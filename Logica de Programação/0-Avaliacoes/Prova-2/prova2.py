'''
Uma estufa inteligente precisa monitorar a temperatura interna de uma plantação de morangos. Crie o controle:
• Se a temperatura for menor que 15 graus, imprima Frio - Ligar aquecedor.
• Senão, se a temperatura for menor ou igual a 25, imprima Temperatura ideal.
• Caso contrário (se for maior que 25), imprima Quente - Ligar resfriador.
'''
temperatura = 18.5

# Escreva seu código com if, elif e else abaixo:
if temperatura < 15:
  print("Frio - Ligar aquecedor")
elif temperatura <= 25:
  print("Temperatura ideal")
else:
  print("Quente - Ligar resfriador")