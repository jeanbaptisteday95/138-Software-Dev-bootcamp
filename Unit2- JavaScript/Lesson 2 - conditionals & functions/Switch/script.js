// Prompt the user for a temperature
let temperature = prompt("Enter the temperature in degrees:");

// Convert the input to a number
temperature = parseFloat(temperature);

// Using a switch statement to categorize the temperature
switch (true) {
    case (temperature >= 30):
        document.getElementById("result").innerText = "It's hot outside!";
        break;
    case (temperature >= 20 && temperature < 30):
        document.getElementById("result").innerText = "The weather is warm.";
        break;
    case (temperature >= 10 && temperature < 20):
        document.getElementById("result").innerText = "It's a bit chilly.";
        break;
    case (temperature < 10):
        document.getElementById("result").innerText = "It's cold outside!";
        break;
    default:
        document.getElementById("result").innerText = "Invalid input. Please enter a number.";
        break;
}
