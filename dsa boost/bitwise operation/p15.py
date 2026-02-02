#program to find the binary of the decimal using loop simple % operaotr

def  decimaltobinary(num):
  if(num == 0):
    return "0"
  bin = ""
  while num > 0:
    rem = num%2
    bin = str(rem) + bin
    num = num//2
 
  return bin
num = 21
print(decimaltobinary(num))

