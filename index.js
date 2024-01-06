$("#targetTime").on("change", function () {
    update();
});

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
    // Get the current time
    const timeNow = new Date();
    // Get the target time
    let targetTime = new Date();
    const timeArray = document.getElementById('targetTime').value.split(":");
    targetTime.setHours(timeArray[0]);
    targetTime.setMinutes(timeArray[1]);

    // Calculate the difference in milliseconds
    let differenceInMilliseconds = targetTime - timeNow;

    if (document.getElementById('offsetBox').checked) {
        differenceInMilliseconds -= (15 * 60 * 1000);
    }

    if (differenceInMilliseconds < 0) {
        document.getElementById('result').textContent = "The target time is in the past!";
        return;
    }

    const differenceInMinutes = (Math.floor(differenceInMilliseconds / (1000 * 60)) % 60);
    const differenceInHours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));

    if (isNaN(differenceInHours) || isNaN(differenceInMinutes)) {
        return;
    }

    const differenceInMinutesString = differenceInMinutes < 10 ? `0${differenceInMinutes}` : differenceInMinutes;
    const differenceInHoursString = differenceInHours < 10 ? `0${differenceInHours}` : differenceInHours;

    document.getElementById('result').textContent = `${differenceInHoursString}:${differenceInMinutesString}:00`;
}