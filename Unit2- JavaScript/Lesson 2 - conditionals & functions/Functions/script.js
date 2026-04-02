// 1. Introduction to Functions
// Functions are blocks of code designed to perform specific tasks. They can be reused, which reduces redundancy and makes code easier to manage and understand. Functions are fundamental in software development because they allow for code modularity.

// 2. Creating a Function
// Example: A function to greet a user
function greetUser(name) {
    console.log("Hello, " + name + "!");
}

// Calling the function
greetUser("Alice");
greetUser("Bob");

// 3. Using Arguments and Parameters
// The function above takes a parameter (name) and uses it when called. Parameters are variables that act as placeholders
// for values, and the values passed when calling the function are called arguments.

// 4. Returning Information from a Function
// Example: A function to calculate the square of a number
function square(number) {
    return number * number;
}

// Calling the function and storing the result
let result = square(5);
console.log("The square of 5 is: " + result);

// The return statement allows the function to send back a value that can be used later. This makes functions
// more versatile and useful.

// 5. Arrow Functions
// Arrow functions provide a shorter syntax for writing functions. They are often used for shorter functions
// and can make the code more readable.

// Example: Arrow function to multiply two numbers
const multiply = (a, b) => a * b;

// Calling the arrow function
let product = multiply(4, 3);
console.log("The product of 4 and 3 is: " + product);

// Arrow function with multiple lines (using curly braces)
const subtract = (a, b) => {
    return a - b;
};

// Calling the arrow function with multiple lines
let difference = subtract(10, 7);
console.log("The difference between 10 and 7 is: " + difference);
