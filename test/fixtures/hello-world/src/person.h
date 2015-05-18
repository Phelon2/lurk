#include <string>

class Person {
public:
  std::string name;
  int age;
  bool male;

  Person(
    std::string name,
    int age,
    bool male
  ) : name(name), age(age), male(male) {}

  void sayHi();
};
