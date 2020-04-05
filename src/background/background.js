/*
Name:           background.js
Description:    Background page script that interacts with the shows DB.
Author:         WakandaO2
Date:           2017-2018
*/

/*****  Callback Functions  *****/

function onDatabaseUpgradeNeeded(event)
{
    const db = event.target.result;
    
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
    return new Promise(resolve => {
        switch (message.type) {
        case MessageTypes.INSERT_SHOWS:
            insertShows(resolve, message.shows);
            break;
        case MessageTypes.REQUEST_SHOWS:
            sendShows(resolve);
            break;
        default:
            // Unknown message type. do nothing.
            resolve(true);
        }
    });
}


/*****  Functions  *****/

function sendShows(resolve)
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
            var showsList = { };

            for (dbEntry of dataRequest.result) {
                /* Create the associative array that contains the shows. */
                showsList[dbEntry.title] = { title: dbEntry.title, 
                                             status: dbEntry.status };
            }

            db.close();
            resolve({shows: showsList});
        };
    };
    
    return true;
}

function insertShows(resolve, shows)
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
            putNext();
            
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
                resolve(true);
            }
        };
    };
}


/*****  Callback Registrations  *****/

browser.runtime.onMessage.addListener(onMessageReception);

