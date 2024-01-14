const SW_CACHE_NAME = "timer-v1";
const CURRENT_VERSION_STORAGE_KEY = "currentVersion";
const GITHUB_API_URL = "https://api.github.com/repos/iliano101/chrono-calcul/commits/vercel";

/**
 * Initializes the document by registering the service worker and updating the target time.
 */
document.addEventListener("DOMContentLoaded", function () {
    registerSW();
    update();
    checkForUpdates();
});

/**
 * Registers a service worker for offline functionality.
 * 
 * @async
 * @function registerSW
 * @returns {Promise} A promise that resolves when the service worker is registered successfully, or rejects with an error if registration fails.
 * @throws {Error} If the service worker registration fails.
 */
async function registerSW() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./sw.js');
        }
        catch (err) {
            console.log(`SW registration failed`);
        }
    }
}


//#region Version control

/**
 * Registers a service worker for offline functionality.
 * 
 * @async
 * @function registerSW
 * @returns {Promise} A promise that resolves when the service worker is registered successfully, or rejects with an error if registration fails.
 * @throws {Error} If the service worker registration fails.
 */
async function checkForUpdates() {
    const currentVersion = localStorage.getItem(CURRENT_VERSION_STORAGE_KEY);

    try {
        const response = await axios.get(GITHUB_API_URL);
        if (response.status === 200 && response.data !== null && response.data !== undefined) {
            //OK
            const latestVersion = response.data.sha;
            if (currentVersion == null || currentVersion != latestVersion) {
                resetCache(latestVersion);
            }
        }
    } catch (err) {
        console.error(err);
    }


}

/**
 * Resets the cache by unregistering the service worker and deleting the cache.
 * 
 * @returns {void}
 */
function resetCache(newVersion) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
            for (const registration of registrations) {
                // unregister service worker
                registration.unregister();
            }
        });
    }

    caches.delete(SW_CACHE_NAME);
    localStorage.setItem(CURRENT_VERSION_STORAGE_KEY, newVersion);
    location.reload();
}

//#endregion


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

    const offsetBoxElement = document.getElementById('offsetBox');
    const resultElement = document.getElementById('result');

    // Split the target time value into hours and minutes
    const timeArray = targetTimeValue.split(":");
    const targetHours = timeArray[0];
    const targetMinutes = timeArray[1];

    // Create a new date object with the current date and target time
    const targetTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), targetHours, targetMinutes);


    // Calculate the difference in milliseconds
    let differenceInMilliseconds = targetTime - currentDate;

    // Check if the offset box is checked and subtract 15 minutes from the difference if true
    if (offsetBoxElement.checked) {
        differenceInMilliseconds -= (15 * 60 * 1000);
    }

    // Check if the target time is in the past and display an error message if true
    if (differenceInMilliseconds < 0) {
        resultElement.innerHTML = "Le temps cible est dans le passé&nbsp;!";
        resultElement.style.fontSize = "10vmin";
        return;
    }


    // Calculate the difference in hours and minutes
    const differenceInMinutes = (Math.floor(differenceInMilliseconds / (1000 * 60)) % 60);
    const differenceInHours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));

    // Check if the difference in hours or minutes is NaN and return if true
    if (isNaN(differenceInHours) || isNaN(differenceInMinutes)) {
        return;
    }

    // Format the difference in minutes and hours as strings
    const differenceInMinutesString = differenceInMinutes < 10 ? `0${differenceInMinutes}` : differenceInMinutes;
    const differenceInHoursString = differenceInHours < 10 ? `0${differenceInHours}` : differenceInHours;

    // Display the result
    resultElement.textContent = `${differenceInHoursString}:${differenceInMinutesString}:00`;
    resultElement.style.fontSize = "20vmin";
}