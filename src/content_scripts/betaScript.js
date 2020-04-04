/*
Name:           betaScript.js
Description:    Contains a new method to get the shows (using the user profile's 'All Shows' table), 
                since MAL API is down.
Author:         WakandaO2
Date:           2018
*/

/*****  Constants  *****/

var MALStatusKeywords = {
    "watching"    : MalStatuses.WATCHING,
    "completed"   : MalStatuses.COMPLETED,
    "onhold"      : MalStatuses.ONHOLD,
    "dropped"     : MalStatuses.DROPPED,
    "plantowatch" : MalStatuses.PLAN_TO_WATCH
}


/*****  Functions  *****/

async function main()
{
    let items = await browser.storage.local.get("username");

    if (items["username"] == null) {
        console.log("No username set.");
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

function gatherShowsData()
{
    /*
        list-table-data:
            [0]'s class changes according to status
            [6] contains the title
    */
    const rawEntries = document.getElementsByClassName("list-table-data");
    var shows = new Array();
    
    for (i = 0; i < rawEntries.length; i++) {
        var showStatusKeyword,
            currentShowStatus = MalStatuses.UNKNOWN;
        
        // Match the show entry's class name to its status.
        showStatusKeyword = rawEntries[i].childNodes[0].className.split(' ')[2];
        if (showStatusKeyword in MALStatusKeywords) {
            currentShowStatus = MALStatusKeywords[showStatusKeyword];
        }

        shows.push({ title: rawEntries[i].childNodes[6].childNodes[0].innerText, 
                     status: currentShowStatus });
    }
    
    // TODO: Add message send failure handler.
    browser.runtime.sendMessage({type: MessageTypes.INSERT_SHOWS, shows: shows})
        .then(function() { alert("Shows list successfully updated!"); })
        .catch(null);
}

function setUsername() 
{
    /* The user might not give the user with the exact case MAL knows (for example: WakandaO2 - wakandao2)
       That's why we will use MAL itself to get the exact username. */
    var usernameCased = document.getElementsByTagName("body")[0].getAttribute("data-owner-name");

    // TODO: error handler for storage set failure.
    browser.storage.local.set({'username': usernameCased})
        .then(function() { console.log("Username successfully updated!"); })
        .catch(null);
}


/*****  Callback Functions  *****/

main();

