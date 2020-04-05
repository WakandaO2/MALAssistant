/*
Name:           options.js
Description:    Responsible for everything that can be managed in the options page.
Author:         WakandaO2
Date:           2017-2018
*/

/*****  Constants  *****/

const Constants = browser.extension.getBackgroundPage().Constants,
      MalStatuses = browser.extension.getBackgroundPage().MalStatuses,
      MessageTypes = browser.extension.getBackgroundPage().MessageTypes;

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
    // The shows list is actually an associative object.
    const showNames = Object.keys(response.shows);
    
    for (i = 0; i < showNames.length; i++)
    {
        var optionAdded = document.createElement("option");
        optionAdded.text = showNames[i];
        selectShowsListed.options.add(optionAdded);
    }

    document.getElementById("numShowsListed").innerHTML = showNames.length;
}

function onUsernameGet(items)
{
    if (items['username'] == null) {
        return;
    }

    storedUsername.innerHTML = items['username'];
    gUser = items['username'];

    userURL.setAttribute('href', Constants.MAL_USER_PROFILE_URL_PREFIX + gUser);
    userURL.setAttribute('target', '_blank')
}

function onColorInfoGet(items)
{
    gColorInfo = items['colorInfo'];

    if (items['colorInfo'] == null) {
        // No color information set - use the default one.
        gColorInfo = {
            mode: Constants.COLOR_MODES.DISABLED,
            oneColor: Constants.DEFAULT_ONE_COLOR,
            multiColors: Constants.DEFAULT_COLORS
        };
    }

    updateColorMenu();
}

function onOptionsPageLoad()
{
    // Adds the version number to the title in the top of the page
    titleText.innerHTML += Constants.VERSION;
    
    // TODO: Add storage get fail error handler.
    browser.storage.local.get('username').then(onUsernameGet).catch(null);
    
    // TODO: Add message get fail error handler.
    browser.runtime.sendMessage({ type: MessageTypes.REQUEST_SHOWS }).then(showListOfShows).catch(null);

    // TODO: Add storage get fail error handler.
    browser.storage.local.get('colorInfo').then(onColorInfoGet).catch(null);

    // Setup the page's menus.
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

        oneColor.innerHTML = gColorInfo.oneColor;
        oneColorInput.value = gColorInfo.oneColor;
        break;
    case Constants.COLOR_MODES.MULTI:
        multiColorMenu.style.display = "block";
        radioMulti.checked = true;

        for (stat in StatusFields) {
            document.getElementById(StatusFields[stat]).innerText = gColorInfo.multiColors[MalStatuses[stat]];
            document.getElementById(`${StatusFields[stat]}Input`).value = gColorInfo.multiColors[MalStatuses[stat]];
        }
        break;
    default:
        /* Don't enable anything. */
        noColorMenu.style.display = "block";
        radioNo.checked = true;
        break;
    }
}

function setNewUsername(new_username)
{
    // New username validation.
    if ((new_username == null) || (new_username[0] == ' ') || (new_username == "")) {
        alert("Invalid username. Please enter a valid one.");
        return;
    }

    // TODO: Add on storage set error handling function.
    browser.storage.local.set({'username': new_username}).then(refreshPage).catch(null);
}

function setColorMode(mode)
{
    gColorInfo.mode = mode;
    
    // TODO: Add on storage set error handling function.
    browser.storage.local.set({'colorInfo': gColorInfo}).then(updateColorMenu).catch(null);
}

function setNewColors()
{
    switch (gColorInfo.mode) {
    case Constants.COLOR_MODES.ONE:
        gColorInfo.oneColor = oneColorInput.value;
        break;
    case Constants.COLOR_MODES.MULTI:
        for (stat in StatusFields) {
            gColorInfo.multiColors[MalStatuses[stat]] = document.getElementById(`${StatusFields[stat]}Input`).value;
        }
        break;
    default:
        // This should not happen.
        return;
    }

    // TODO: Add on storage set error handling function.
    browser.storage.local.set({'colorInfo': gColorInfo}).then(updateColorMenu).catch(null);
}

function setupMenus()
{
    submitUsername.addEventListener("click", function() { setNewUsername(usernameField.value); });

    refreshShows.addEventListener("click", function() {
        browser.tabs.create({url: Constants.MAL_ANIMELIST_FORMAT.replace("USERNAME", gUser)});
    });

    radioNo.addEventListener("click", function() { setColorMode(Constants.COLOR_MODES.DISABLED) });
    radioOne.addEventListener("click", function() { setColorMode(Constants.COLOR_MODES.ONE) });
    radioMulti.addEventListener("click", function() { setColorMode(Constants.COLOR_MODES.MULTI) });

    oneColorInput.addEventListener("change", function() {
        setNewColors();
    })

    for (status in StatusFields) {
        (function (status) {
            let defaultField = document.getElementById(`${StatusFields[status]}Default`),
                inputField = document.getElementById(`${StatusFields[status]}Input`);
    
            inputField.addEventListener("change", function() {
                setNewColors();
            });
    
            defaultField.addEventListener("click", function() {
                inputField.value = Constants.DEFAULT_COLORS[MalStatuses[status]];
                setNewColors();
            });
        })(status);
    }
}


/*****  Callback Registrations  *****/

document.addEventListener('DOMContentLoaded', onOptionsPageLoad);

