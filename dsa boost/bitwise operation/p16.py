# program to basically to convert binary to decimal

def binarytodec(num):
  ans = 0
  pow = 0
  while num > 0:
    rem = num%10
    ans = ans + rem *(2 ** pow)
    pow +=1
    num = num // 10

  return ans


print(binarytodec(10101))