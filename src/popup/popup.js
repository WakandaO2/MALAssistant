/*
Name:           popup.js
Description:    Popup page's scripts file.
Author:         WakandaO2
Date:           2017
*/

/*****  Constants  *****/

// Retrieve the constants from the backgroundPage's namespace.
const Constants = browser.extension.getBackgroundPage().Constants;

const USER_GREET_FORMAT = "Hello USER!"


/*****  Callback Functions  *****/

function setUserMessage(items)
{
    if (items['username'] != null) {
        userText.innerHTML = USER_GREET_FORMAT.replace("USER", items['username']);
    }
}

function onPopupPageLoad()
{
    // Add the version number to the top of the popup page.
    titleText.innerHTML += Constants.VERSION;
    
    // Get the username (if set) from storage.
    // TODO: Add storage get error handler.
    browser.storage.local.get('username').then(setUserMessage).catch(null);
    
    options_link.addEventListener("click", function() {
        browser.runtime.openOptionsPage();
    });
}


/*****  Callback Registrations  *****/

document.addEventListener('DOMContentLoaded', onPopupPageLoad);

