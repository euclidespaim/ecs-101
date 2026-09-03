# Com a instrução break, podemos interromper 
# o laço mesmo que a condição do while ainda 
# seja verdadeira:

i = 1
while i < 6:
  print(i)
  if i == 3:
    break
  i += 1
