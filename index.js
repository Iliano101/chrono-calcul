document.addEventListener("DOMContentLoaded", function () {
    registerSW();
});

async function registerSW() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./PWA/sw.js');
        }
        catch (err) {
            console.log(`SW registration failed`);
        }
    }
}

/**
 * Updates the displayed time based on the target time entered by the user.
 * 
 * This function retrieves the current time and the target time from the input field.
 * It calculates the difference between the target time and the current time in milliseconds.
 * If the offset checkbox is checked, it subtracts 15 minutes from the difference.
 * If the difference is negative, it displays an error message.
 * Otherwise, it calculates the difference in hours and minutes and displays the result.
 * 
 * @returns {void}
 */
function update() {
    // Get the current date and time
    const currentDate = new Date();

    // Get the target time element and value
    const targetTimeElement = document.getElementById('targetTime');
    const targetTimeValue = targetTimeElement.value;

    // Split the target time value into hours and minutes
    const timeArray = targetTimeValue.split(":");
    const targetHours = timeArray[0];
    const targetMinutes = timeArray[1];

    // Create a new date object with the current date and target time
    const targetTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), targetHours, targetMinutes);

    // Calculate the difference in milliseconds
    let differenceInMilliseconds = targetTime - currentDate;

    // Check if the offset box is checked and subtract 15 minutes from the difference if true
    const offsetBoxElement = document.getElementById('offsetBox');
    if (offsetBoxElement.checked) {
        differenceInMilliseconds -= (15 * 60 * 1000);
    }

    // Check if the target time is in the past and display an error message if true
    if (differenceInMilliseconds < 0) {
        const resultElement = document.getElementById('result');
        resultElement.textContent = "The target time is in the past!";
        return;
    }

    // Calculate the difference in hours and minutes
    const differenceInMinutes = (Math.round(differenceInMilliseconds / (1000 * 60)) % 60);
    const differenceInHours = Math.round(differenceInMilliseconds / (1000 * 60 * 60));

    // Check if the difference in hours or minutes is NaN and return if true
    if (isNaN(differenceInHours) || isNaN(differenceInMinutes)) {
        return;
    }

    // Format the difference in minutes and hours as strings
    const differenceInMinutesString = differenceInMinutes < 10 ? `0${differenceInMinutes}` : differenceInMinutes;
    const differenceInHoursString = differenceInHours < 10 ? `0${differenceInHours}` : differenceInHours;

    // Display the result
    const resultElement = document.getElementById('result');
    resultElement.textContent = `${differenceInHoursString}:${differenceInMinutesString}:00`;
}