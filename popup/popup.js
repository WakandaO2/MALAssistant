/*
Name:           popup.js
Description:    Popup page's script file.
Author:         WakandaO2
Date:           2017
*/

// See 'script/common/Constants.js'
const Constants = chrome.extension.getBackgroundPage().Constants;

document.addEventListener('DOMContentLoaded', function () {
    
    //Adds the version number to the top of the popup page
    titleText.innerHTML += Constants.VERSION;
    
    chrome.storage.sync.get('username', function(item) {
        if(item.username == null)
        {
            userText.innerHTML = "NO USERNAME SET";
        }
        else
        {
            userText.innerHTML = "Hey " + item.username + "!";
        }
    });
});