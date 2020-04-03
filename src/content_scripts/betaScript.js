/*
Name:           betaScript.js
Description:    Contains a new method to get the shows (using the user profile's 'All Shows' table), 
                since MAL API is down.
Author:         WakandaO2
Date:           2018
*/

var MALStatusKeywords = {
    "watching"    : MalStatuses.WATCHING,
    "completed"   : MalStatuses.COMPLETED,
    "onhold"      : MalStatuses.ONHOLD,
    "dropped"     : MalStatuses.DROPPED,
    "plantowatch" : MalStatuses.PLAN_TO_WATCH
}

/* Functions */

function gatherShowsData()
{
    /*
        list-table-data:
            [0]'s class changes according to status
            [6] contains the title
    */
    var rawEntriesArray = document.getElementsByClassName("list-table-data");
    var showsArr = new Array();
    var currentShowStatus = 0;
    
    for (i = 0; i < rawEntriesArr.length; i++) {
        var currentShowStatus = MalStatuses.UNKNOWN;
        
        // Match the show entry's class name to its status.
        if (rawEntriesArray[i].childNodes[0].className.split(' ')[2] in MALStatusKeywords) {
            currentShowStatus = MALStatusKeywords[currentShowStatus];
        }

        var currentShow = {
            title: rawEntriesArray[i].childNodes[6].childNodes[0].innerText,
            status: currentShowStatus
        };
        
        showsArr.push(currentShow);
    }
    
    // Send the shows to the background page that will insert them to the DB.
    chrome.runtime.sendMessage({shows: showsArr, message: Constants.MESSAGE_INSERT_SHOWS}, function(response) {
    });
}

function onUsernameSet()
{
    console.log("Cased username set successfully!");
}

function setUsername() 
{
    /* The user might not give the user with the exact case MAL knows (for example: WakandaO2 - wakandao2)
       That's why we will use MAL itself to get the exact username. */
    var usernameCased = document.getElementsByTagName("body")[0].getAttribute("data-owner-name");

    // TODO: error handler for storage set failure.
    browser.storage.local.set({'username': usernameCased}).then(onUsernameSet, null);
}

/***** Callback Functions *****/

function onUsernameGet(items)
{
    if(items['username'] == null) {
        console.log("No username set.")
        return;
    }

    var expected_url = Constants.MAL_ANIMELIST_FORMAT.replace("USERNAME", items['username'])

    if (String(window.location).toLowerCase() !== expected_url.toLowerCase()) {
        return;
    }

    if (confirm("Do you want to refresh your anime list?")) {
        gatherShowsData();
        setUsername();
    }
}

/*****  Callback registrations  *****/

browser.storage.local.get("username").then(onUsernameGet, null);

