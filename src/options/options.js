/*
Name:           options.js
Description:    Responsible for everything that can be managed in the options page.
Author:         WakandaO2
Date:           2017-2018
*/

/*****  Constants  *****/

const StatusFields = { 
    WATCHING       : "colorWATCH",
    COMPLETED      : "colorCMPLT",
    ONHOLD         : "colorONHLD",
    DROPPED        : "colorDROPD",
    PLAN_TO_WATCH  : "colorPTW",
};


/*****  Global Variables  *****/

var gColorInfo,
    gUser;


/*****  Callback Functions  *****/

function refreshPage()
{
    alert('New username set. To update the shows, go to the username\'s "All anime" page.');
    location.reload();
}

function showListOfShows(response)
{
    var optionAdded;

    for (let showName in response.shows) {
        optionAdded = document.createElement("option");
        optionAdded.text = showName;
        selectShowsListed.options.add(optionAdded);
    }

    document.getElementById("numShowsListed").innerText = selectShowsListed.options.length;
}

function onUsernameGet(items)
{
    if (!items['username']) {
        return;
    }

    storedUsername.innerText = items['username'];
    gUser = items['username'];

    userURL.setAttribute('href', Constants.MAL_USER_PROFILE_URL_PREFIX + gUser);
    userURL.setAttribute('target', '_blank');
}

function onColorInfoGet(items)
{
    gColorInfo = items['colorInfo'];

    if (!items['colorInfo']) {
        // No color information set - use the default one.
        gColorInfo = {
            mode: Constants.COLOR_MODES.DISABLED,
            oneColor: Constants.DEFAULT_ONE_COLOR,
            multiColors: Constants.DEFAULT_COLORS
        };
    }

    updateColorMenu();
}

function onColorInfoSetError(error)
{
    return onGenericError("Color information set failed", error);
}

function onOptionsPageLoad()
{
    titleText.innerText += Constants.VERSION;
    
    browser.storage.local.get('username').then(onUsernameGet)
    .catch(onUsernameGetError);
    
    browser.runtime.sendMessage({ type: MessageTypes.REQUEST_SHOWS }).then(showListOfShows)
    .catch(onMessageSendError);

    browser.storage.local.get('colorInfo').then(onColorInfoGet)
    .catch(onColorInfoGetError);

    setupMenus();
}


/*****  Functions  *****/

function updateColorMenu()
{
    noColorMenu.style.display = "none";
    oneColorMenu.style.display = "none";
    multiColorMenu.style.display = "none";

    switch (gColorInfo.mode) {
    case Constants.COLOR_MODES.ONE:
        oneColorMenu.style.display = "block";
        radioOne.checked = true;

        oneColor.innerText = gColorInfo.oneColor;
        oneColorInput.value = gColorInfo.oneColor;
        break;
    case Constants.COLOR_MODES.MULTI:
        multiColorMenu.style.display = "block";
        radioMulti.checked = true;

        for (let stat in StatusFields) {
            document.getElementById(StatusFields[stat]).innerText = gColorInfo.multiColors[MalStatuses[stat]];
            document.getElementById(`${StatusFields[stat]}Input`).value = gColorInfo.multiColors[MalStatuses[stat]];
        }
        break;
    default:
        // Actually disabled.
        noColorMenu.style.display = "block";
        radioNo.checked = true;
        break;
    }
}

function setNewUsername(new_username)
{
    if ((new_username == null) || (new_username[0] == ' ') || (new_username == "")) {
        alert("Invalid username. Please enter a valid one.");
        return;
    }

    browser.storage.local.set({'username': new_username}).then(refreshPage)
    .catch(onUsernameSetError);
}

function setColorMode(mode)
{
    gColorInfo.mode = mode;
    
    browser.storage.local.set({'colorInfo': gColorInfo}).then(updateColorMenu)
    .catch(onColorInfoSetError);
}

function setNewColors()
{
    switch (gColorInfo.mode) {
    case Constants.COLOR_MODES.ONE:
        gColorInfo.oneColor = oneColorInput.value;
        break;
    case Constants.COLOR_MODES.MULTI:
        for (let stat in StatusFields) {
            gColorInfo.multiColors[MalStatuses[stat]] = document.getElementById(`${StatusFields[stat]}Input`).value;
        }
        break;
    default:
        // This should not happen.
        return;
    }

    browser.storage.local.set({'colorInfo': gColorInfo}).then(updateColorMenu)
    .catch(onColorInfoSetError);
}

function setupMenus()
{
    submitUsername.addEventListener("click", () => { setNewUsername(usernameField.value); });

    refreshShows.addEventListener("click", () => {
        browser.tabs.create({ url: Constants.MAL_ANIMELIST_FORMAT.replace("USERNAME", gUser) });
    });

    radioNo.addEventListener("click", () => { setColorMode(Constants.COLOR_MODES.DISABLED) });
    radioOne.addEventListener("click", () => { setColorMode(Constants.COLOR_MODES.ONE) });
    radioMulti.addEventListener("click", () => { setColorMode(Constants.COLOR_MODES.MULTI) });

    oneColorInput.addEventListener("change", () => { setNewColors(); });

    for (let status in StatusFields) {
        ((status) => {
            let inputField = document.getElementById(`${StatusFields[status]}Input`);
    
            inputField.addEventListener("change", () => { setNewColors(); });
    
            document.getElementById(`${StatusFields[status]}Default`)
                    .addEventListener("click", () => {
                inputField.value = Constants.DEFAULT_COLORS[MalStatuses[status]];
                setNewColors();
            });
        })(status);
    }
}


/*****  Callback Registrations  *****/

document.addEventListener('DOMContentLoaded', onOptionsPageLoad);

