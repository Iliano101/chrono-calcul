// #region Constants
const SERVICEWORKER_CACHE_NAME = "timer-v1";
const CURRENT_VERSION_STORAGE_KEY = "currentVersion";
const GITHUB_API_URL =
    "https://api.github.com/repos/iliano101/chrono-calcul/commits/vercel";
const UPDATE_INTERVAL = 1000;
//#endregion

// #region Event Listeners
document.addEventListener("DOMContentLoaded", function () {
    registerServiceWorker();
    setInterval(updateResult, UPDATE_INTERVAL);
    checkForUpdates();
});
//#endregion

// #region Service Worker
/**
 * Registers a service worker for the current page.
 *
 * @returns {Promise} A promise that resolves when the service worker is successfully registered, or rejects if the registration fails.
 */
async function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.register("./JS/sw.js");
        } catch (err) {
            showUserError(err, `SW registration failed`);
        }
    }
}
//#endregion

// #region Automatic Updates
/**
 * Check for updates and update the application if a new version is available.
 *
 * @returns {Promise<void>} - A promise that resolves once the check for updates is complete.
 */
async function checkForUpdates() {
    const OK = 200;

    const currentVersion = localStorage.getItem(CURRENT_VERSION_STORAGE_KEY);

    try {
        const response = await axios.get(GITHUB_API_URL);
        if (
            response.status === OK &&
            response.data !== null &&
            response.data !== undefined
        ) {
            const latestVersion = response.data.sha;
            if (currentVersion == null || currentVersion != latestVersion) {
                updateApplication(latestVersion);
            }
        }
    } catch (err) {
        showUserError(err, "Failed to check for updates on GitHub");
    }
}

/**
 * Updates the application to a new version.
 *
 * @param {string} newVersion - The new version of the application.
 * @returns {void}
 */
function updateApplication(newVersion) {
    unregisterServiceWorkers();
    caches.delete(SERVICEWORKER_CACHE_NAME);
    localStorage.setItem(CURRENT_VERSION_STORAGE_KEY, newVersion);
    location.reload();
}

/**
 * Unregister all service workers.
 *
 * This function checks if the browser supports service workers and then retrieves all active service worker registrations.
 * It iterates through each registration and unregister the service worker.
 *
 * @returns {void}
 */
function unregisterServiceWorkers() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .getRegistrations()
            .then(function (registrations) {
                for (const serviceWorker of registrations) {
                    serviceWorker.unregister();
                }
            });
    }
}
// #endregion

// #region Time Calculation
/**
 * Calculates the time difference between the current date and a target time.
 *
 * @returns {void}
 */
function updateResult() {
    const currentDate = new Date();

    const targetTimeElement = document.getElementById("target-time");
    const targetTimeValue = targetTimeElement.value;
    const offsetBoxElement = document.getElementById("offset-box");
    const resultElement = document.getElementById("result-text");

    if (targetTimeValue == "") {
        resultElement.innerHTML = "Entrez l'heure cible";
    }

    const timeArray = targetTimeValue.split(":");
    const targetHours = timeArray[0];
    const targetMinutes = timeArray[1];

    const targetTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        targetHours,
        targetMinutes
    );

    let differenceInMilliseconds = targetTime - currentDate;

    if (offsetBoxElement.checked) {
        differenceInMilliseconds -= 15 * 60 * 1000;
    }

    if (differenceInMilliseconds < 0) {
        resultElement.innerHTML = "Le temps cible est dans le passé&nbsp;!";
        return;
    }

    const differenceInMinutes =
        Math.floor(differenceInMilliseconds / (1000 * 60)) % 60;
    const differenceInHours = Math.floor(
        differenceInMilliseconds / (1000 * 60 * 60)
    );

    if (isNaN(differenceInHours) || isNaN(differenceInMinutes)) {
        return;
    }

    const differenceInMinutesString =
        differenceInMinutes < 10
            ? `0${differenceInMinutes}`
            : differenceInMinutes;
    const differenceInHoursString =
        differenceInHours < 10 ? `0${differenceInHours}` : differenceInHours;

    resultElement.textContent = `${differenceInHoursString}:${differenceInMinutesString}:00`;
}
//#endregion

// #region Utils
function showUserError(err, userMessage) {
    const errorObjet = {
        status: err.response.status ? err.response.status : "No status",
        errorMessage: err.response.data ? err.response.data : err.message,
        userMessage: userMessage,
    };
    console.error(errorObjet);
}
//#endregion
