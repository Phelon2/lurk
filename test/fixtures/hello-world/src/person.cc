#include <iostream>
#include <src/person.h>

void Person::sayHi() {
  std::cout << "I am age " << age;

  if (male) {
    std::cout << " and I am a dude" << std::endl;
  } else {
    std::cout << " and I am a lady" << std::endl;
  }
}
