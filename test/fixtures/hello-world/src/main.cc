#include <iostream>
#include <src/person.h>
#include <src/animal.h>

int main (int, char *[]) {
  std::cout << "\nHello World\n\n";
  Person person("Danny", 25, true);
  person.sayHi();
  Animal animal("Falcon", 1, true);
  animal.sayHi();
  return 0;
}
