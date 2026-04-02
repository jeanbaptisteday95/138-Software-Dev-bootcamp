// Prompt the user for a temperature
let temperature = prompt("Enter the temperature in degrees:");

// Convert the input to a number
temperature = parseFloat(temperature);

// Conditionals using if, else if, and else
if (temperature >= 30) {
    document.getElementById("result").innerText = "It's hot outside!";
} else if (temperature >= 20 && temperature < 30) {
    document.getElementById("result").innerText = "The weather is warm.";
} else if (temperature >= 10 && temperature < 20) {
    document.getElementById("result").innerText = "It's a bit chilly.";
} else if (temperature < 10) {
    document.getElementById("result").innerText = "It's cold outside!";
} else {
    document.getElementById("result").innerText = "Invalid input. Please enter a number.";
}
