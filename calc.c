#include <stdio.h>

float do_sum (float x, float y) {
    return x + y;
}

float do_sub (float x, float y) {
    return x - y;
}

float do_mul (float x, float y) {
    return x * y;
}

float do_div (float x, float y) {

    return x / y;
}

float do_sqr (float x, float y) {
    return pow(x,y);
}


int main () {

    float x;
    float y;
    char choice;

    printf("===========Calculator code===========\n");
    printf("Choose the type of math operation: \n");
    printf("A)Sum\n");
    printf("B)Subtraction\n");
    printf("C)Multiplication\n");
    printf("D)Division\n");
    printf("E)Square\n");
    printf("Choose: ");
    scanf("%c", &choice);

    printf("Now enter the first you want to use for the operation(1/2): \n");
    printf("X = \n");
    scanf("%f", &x);
    printf("Now enter the second number you want to use for the operation(2/2): \n");
    printf("Y = \n");
    scanf("%f", &y);

    if (choice == 'a' || choice == 'A')
{
        printf("The sum result is: %g", do_sum(x,y));
}
    else if (choice == 'b' || choice == 'B')
{
        printf("The subtraction result is: %g", do_sub(x,y));
}
    else if (choice == 'c' || choice == 'C')
{
        printf("The multiplication result is: %g", do_mul(x,y));
}
    else if (choice == 'd' || choice == 'D'){
        if (x == 0|| y == 0){

        printf("Division by zero is not on the menu...");
        return 0;
        }

        printf("The divison result is: %g", do_div(x,y));
}
    else if (choice == 'e' || choice == 'E')
{
        printf("The sqr result is: %g", do_sqr(x,y));
}
return 0;
}
