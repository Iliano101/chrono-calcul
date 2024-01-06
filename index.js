$("#targetTime").on("change", function () {
    update();
});


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