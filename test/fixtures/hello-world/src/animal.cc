#include <iostream>
#include <src/animal.h>

void Animal::sayHi() {
  if (age <= 1) {
    std::cout << "im really cute and my name is " << name << std::endl;
  } else {
    std::cout << "bowow chicka wow wow " << std::endl;
    std::cout << "*wags tail*" << std::endl;
  }
}
