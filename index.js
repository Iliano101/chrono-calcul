$("#calculateButton").click(function () {
    // Get the current time
    const timeNow = new Date();
    // Get the target time
    let targetTime = new Date();
    const timeArray = $("#targetTime").val().split(":");
    targetTime.setHours(timeArray[0]);
    targetTime.setMinutes(timeArray[1]);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = targetTime - timeNow;

    if (differenceInMilliseconds < 0) {
        $("#result").html("The target time is in the past!");
        return;
    }

    const differenceInMinutes = (Math.floor(differenceInMilliseconds / (1000 * 60)) % 60);
    const differenceInHours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));

    const differenceInMinutesString = differenceInMinutes < 10 ? `0${differenceInMinutes}` : differenceInMinutes;
    const differenceInHoursString = differenceInHours < 10 ? `0${differenceInHours}` : differenceInHours;

    $("#result").html(`${differenceInHoursString}:${differenceInMinutesString}:00`);
});