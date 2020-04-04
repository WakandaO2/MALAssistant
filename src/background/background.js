/*
Name:           background.js
Description:    Background page script that interacts with the shows DB.
Author:         WakandaO2
Date:           2017-2018
*/

/*****  Callback Functions  *****/

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
    var openRequest = indexedDB.open(Constants.DATABASE_NAME);
    
    openRequest.onsuccess = function(e){
        var database = e.target.result;
        var transaction = database.transaction([Constants.SHOWS_TABLE_NAME], "readonly");
        var objStore = transaction.objectStore(Constants.SHOWS_TABLE_NAME);
        
        var dataRequest = objStore.getAll();
    
        dataRequest.onsuccess = function(e){
            var showsList = new Object();
            for(i = 0; i < e.target.result.length; i++)
            {
                /* Create the associative OBJECT that contains the show. */
                showsList[e.target.result[i].title] = { title: e.target.result[i].title, status: e.target.result[i].status };
            }
            database.close();
            
            sendResponse({shows: showsList});
        }
    }
    
    return true;
}

// Inserts the new shows data to the DB, deleting the old data.
function insertShows(shows, sendResponse)
{
    // Sort the shows array.
    shows.sort(compareNames);
    
    //Request for deleting old data (if exists)
    var resetRequest = indexedDB.deleteDatabase(Constants.DATABASE_NAME); 
    resetRequest.onsuccess = function(e){
        console.log("OLD DATA DELETED.");
    };
    
    //Opening new database for new shows data
    var openRequest = indexedDB.open(Constants.DATABASE_NAME, 1);
    
    //Will get here before success - everything that should be initialized goes here
    openRequest.onupgradeneeded = function(e){
        console.log("NEW DATABASE INITIALIZING...");
        var newDB = e.target.result;
        
        if(!newDB.objectStoreNames.contains(Constants.SHOWS_TABLE_NAME))
        {
            newDB.createObjectStore(Constants.SHOWS_TABLE_NAME, {autoIncrement:true});
            console.log("OBJECT STORE CREATED.");
        }
    };
    
    //After everything is initialized, gets here
    openRequest.onsuccess = function(e){
        console.log("DATABASE INITIALIZED. INSTERING DATA.");
        var database = e.target.result;
        var transaction = database.transaction([Constants.SHOWS_TABLE_NAME], "readwrite");
        var objStore = transaction.objectStore(Constants.SHOWS_TABLE_NAME);
        var i = 0;
        putNext(sendResponse);
        
        function putNext() {
            if (i < shows.length) {
                var addRequest = objStore.add(shows[i]);
                i++;
                addRequest.onsuccess = putNext();
            }
            else {
                console.log("ADDITION COMPLETED");
                sendResponse({farewell: "YES!"});
            }
        }    
    };
}


/*****  Callback Registrations  *****/

browser.runtime.onMessage.addListener(onMessageReception);

