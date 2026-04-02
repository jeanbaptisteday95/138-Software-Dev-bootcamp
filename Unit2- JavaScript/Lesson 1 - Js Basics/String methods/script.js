 // Example Strings
    let string1 = "Hello";
    let string2 = "World";

    // 1. Concatenation of two strings
    let concatenatedString = string1 + " " + string2;
    console.log(concatenatedString);

    // 2. Finding the length of a string
    let stringLength = string1.length;
    console.log("Length of String 1 ('Hello'): " + stringLength);

    // 3. Converting to uppercase
    let upperCaseString = string1.toUpperCase();
    console.log("Uppercase String 1: " + upperCaseString);

    // 4. Converting to lowercase
    let lowerCaseString = string2.toLowerCase();
    console.log("Lowercase String 2: " + lowerCaseString);

    // 5. Extracting a substring (slice)
    let subString = concatenatedString.slice(0, 5); // Extracts 'Hello'
    console.log("Substring (First 5 characters): " + subString);

    // 6. Replacing part of a string
    let replacedString = concatenatedString.replace("World", "JavaScript");
    console.log("Replaced 'World' with 'JavaScript': " + replacedString);

    // 7. Checking if a string includes another string
    let includesHello = concatenatedString.includes("Hello");
    console.log("Does the concatenated string include 'Hello'? " + includesHello);

    // 8. Finding the position of a substring
    let position = concatenatedString.indexOf("World");
    console.log("Position of 'World' in concatenated string: " + position);