#pragma once
#include <string>

class Animal {
public:
  std::string name;
  int age;
  bool male;

  Animal(
    std::string name,
    int age,
    bool male
  ) : name(name), age(age), male(male) {}

  void sayHi();
};
