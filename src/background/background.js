/*
Name:           background.js
Description:    Background page script that interacts with the shows DB.
Author:         WakandaO2
Date:           2017-2018
*/

/*****  Callback Functions  *****/

function onDatabaseUpgradeNeeded(event)
{
    var db = event.target.result;
    
    if (!(Constants.SHOWS_OBJSTORE in db.objectStoreNames)) {
        db.createObjectStore(Constants.SHOWS_OBJSTORE, { autoIncrement:true });
        console.log("Shows object store created.");
    }

    return true;
}

function onDatabaseError(event)
{
    console.log(`${typeof(event.target)} error: ${event.target.error}`);
}

function onMessageReception(message, sender, sendResponse)
{
    switch (message.type) {
    case MessageTypes.INSERT_SHOWS:
        return insertShows(message.shows, sendResponse);
    case MessageTypes.REQUEST_SHOWS:
        return sendShows(sendResponse);
    default:
        // Unknown message type. do nothing.
        return true;
    }
}


/*****  Functions  *****/

function sendShows(sendResponse)
{
    var openRequest = indexedDB.open(Constants.DATABASE_NAME, 1);
    
    openRequest.onupgradeneeded = onDatabaseUpgradeNeeded;
    openRequest.onerror = onDatabaseError;

    openRequest.onsuccess = () => {
        const db = openRequest.result,
              objStore = db.transaction([Constants.SHOWS_OBJSTORE], "readonly")
                           .objectStore(Constants.SHOWS_OBJSTORE);
        var dataRequest = objStore.getAll();
            
        dataRequest.onerror = onDatabaseError;

        dataRequest.onsuccess = () => {
            const dbEntries = dataRequest.result;
            var showsList = new Array();
            for (i = 0; i < dbEntries.length; i++) {
                /* Create the associative array that contains the show. */
                showsList[dbEntries[i].title] = { title: dbEntries[i].title, 
                                                  status: dbEntries[i].status };
            }

            db.close();
            sendResponse({shows: showsList});
        };
    };
    
    return true;
}

function insertShows(shows, sendResponse)
{
    shows.sort(compareShowNames);

    var openRequest = indexedDB.open(Constants.DATABASE_NAME, 1);
    
    openRequest.onupgradeneeded = onDatabaseUpgradeNeeded;
    openRequest.onerror = onDatabaseError;

    openRequest.onsuccess = () => {
        const db = openRequest.result,
              objStore = db.transaction([Constants.SHOWS_OBJSTORE], "readwrite")
                           .objectStore(Constants.SHOWS_OBJSTORE);
        var clearRequest = objStore.clear();

        clearRequest.onerror = onDatabaseError;

        clearRequest.onsuccess = () => {
            console.log("Object store was successfully cleared.");
            var i = 0;
            putNext(sendResponse);
            
            function putNext() {
                if (i < shows.length) {
                    var addRequest = objStore.add(shows[i]);
                    addRequest.onerror = onDatabaseError;
                    addRequest.onsuccess = putNext;

                    i++;
                    return true;
                }
                
                db.close();

                console.log("Shows insertion completed.");
                sendResponse({farewell: "Finished shows insertion!"});
                return true;
            }
        };
    };
}


/*****  Callback Registrations  *****/

browser.runtime.onMessage.addListener(onMessageReception);

