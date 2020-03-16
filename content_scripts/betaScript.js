/*
Name:           betaScript.js
Description:    Contains a new method to get the shows (using the user profile's 'All Shows' table), 
                since MAL API is down.
Author:         WakandaO2
Date:           2018
*/

chrome.storage.sync.get('username', function(item) {
        if (typeof chrome.runtime.lastError != 'undefined') {
            console.log(sprintf("Username retrieval from database failed. Error: \"%s\"", chrome.runtime.lastError))
            return;
        }

        if(item.username == null) {
            console.log("No username set.")
            return;
        }

        var expected_url = (Constants.MAL_ANIMELIST_URL_PREFIX + item.username + Constants.MAL_ANIMELIST_ALL_SUFFIX).toLowerCase();

        if (String(window.location).toLowerCase() != expected_url) {
            return;
        }

        if (confirm("Do you want to refresh your anime list?")) {
            gatherShowsData();
            setUsername();
        }
});

/* Functions */

function gatherShowsData()
{
    var rawEntriesArr = document.getElementsByClassName("list-table-data");
    var showsArr = new Array();
    var currentShowStatus = 0;
    
    for (i = 0; i < rawEntriesArr.length; i++) {
        currentShowStatus = 0;
        var statusClassName = rawEntriesArr[i].childNodes[0].className;

        switch (statusClassName.split(' ')[2])
        {
        case "watching":
            currentShowStatus = MalStatuses.WATCHING;
            break;
            
        case "completed":
            currentShowStatus = MalStatuses.COMPLETED;
            break;
            
        case "onhold":
            currentShowStatus = MalStatuses.ONHOLD;
            break;
            
        case "dropped":
            currentShowStatus = MalStatuses.DROPPED;
            break;
            
        case "plantowatch":
            currentShowStatus = MalStatuses.PLAN_TO_WATCH;
            break;

        default:
            currentShowStatus = MalStatuses.UNKNOWN;
            break;
        }
        
        var show = {
            title: rawEntriesArr[i].childNodes[6].childNodes[0].innerText,
            status: currentShowStatus
        };
        
        showsArr.push(show);
    }
    
    // Let the event page do the insertion, to make the DB under the extension domain
    chrome.runtime.sendMessage({shows: showsArr, message: Constants.MESSAGE_INSERT_SHOWS}, function(response) {
    });
}

function setUsername() {
    /* The user might not give the user with the exact case MAL knows (for example: WakandaO2 - wakandao2)
       That's why we will use the generated page to get the username MAL knows. */
    var usernameCased = document.getElementsByTagName("body")[0].getAttribute("data-owner-name");

    chrome.storage.sync.set({'username': usernameCased}, function() {
        if (typeof chrome.runtime.lastError != 'undefined') {
            console.log(sprintf("Username set failed. error: \"%s\"", chrome.runtime.lastError));
            return;
        }

        console.log("Username set successfully.");
    });
}

/*
list-table-data (15):
    [0] status
    [6] data title clearfix
*/