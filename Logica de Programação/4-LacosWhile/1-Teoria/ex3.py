# Com a instrução continue, podemos interromper a 
# iteração atual e continuar com a próxima:

i = 0 # variável de controle

while i < 6:
  i += 1
  if i == 3:
    continue
  print(i)
  print("A 101 é a melhor turma da escola")
