/*
Name:           popup.js
Description:    Popup page's scripts file.
Author:         WakandaO2
Date:           2017
*/

/*****  Callback Functions  *****/

function setUserMessage(items)
{
    if (items['username']) {
        userText.innerText = `Hello ${items['username']}!`;
    }
}

function onPopupPageLoad()
{
    // Add the version number to the top of the popup page.
    titleText.innerText += Constants.VERSION;
    
    // Get the username (if set) from storage.
    browser.storage.local.get('username').then(setUserMessage)
    .catch(onUsernameGetError);
    
    options_link.addEventListener("click", () => { browser.runtime.openOptionsPage(); });
}


/*****  Callback Registrations  *****/

document.addEventListener('DOMContentLoaded', onPopupPageLoad);

