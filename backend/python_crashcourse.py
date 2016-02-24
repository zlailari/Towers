#!/usr/bin/env python3
"""Python is pretty easy to pick up, but some things aren't immediately clear, so if anyone in the group is new to Python
these are the things that confused me at first."""


class Example:
    some_val = 42  # any class variable NOT attached to 'self' is like a static variable in Java, and
    # any object of type Example sees the same exact value.

    def __init__(self):
        """this method is called at object initialization,
        it's basically the constructor method"""
        self.test = 100  # since we attach test to 'self', each object has its own 'test', like a true member variable in Java/C++/whatever

    def get_test(self):
        return self.test

    def set_test(self, value):
        self.test = value
        """self in Python is sort of like keyword 'this' in Java/C++, it's just a reference to the object
        on which the method is being called.  What's tricky is you need to include self as an argument when you
        define the function, but you don't have to include it when you call it."""


def main():
    example = Example()

    ex_test = example.get_test()
    # you need to convert ex_test to a string before printing it, or an
    # exception is thrown
    print(str(ex_test))

    # you don't need to include 'self' when calling the method
    example.set_test(12)


if __name__ == '__main__':
    main()
    # This is Python's way of entering the program, which is sort of weird, but that's just how python does it.
    # The method main() isn't special at all, it could be kangaroo(), it just
    # makes sense for the main method to be called main()
