#include <iostream>
#include <src/person.h>

int main (int, char *[]) {
  std::cout << "\nHello World\n\n";
  Person person("Danny", 25, true);
  person.sayHi();
  return 0;
}
