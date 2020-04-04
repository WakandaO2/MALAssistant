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
        return handleShowsInsert(message.shows);
    case MessageTypes.REQUEST_SHOWS:
        return handleShowsRequest(sendResponse);
    default:
        // Unknown message type. do nothing.
        return true;
    }
}

/* Functions */

function handleShowsRequest(sendResponse)
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

function handleShowsInsert(shows)
{
    // Insert shows.
    var showsToInsert = new Array();
        
    for (i = 0; i < shows.length; i++)
    {
        showsToInsert.push(shows[i]);
    }
            
    insertNewData(showsToInsert);
    return true;
}

// Inserts the new shows data to the DB, deleting the old data.
function insertNewData(shows)
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
        putNext();
        
        function putNext() {
            if (i < shows.length) {
                var addRequest = objStore.add(shows[i]);
                i++;
                addRequest.onsuccess = putNext();
            }
            else {
                console.log("ADDITION COMPLETED");
            }
        }    
    };
}


/*****  Callback Registrations  *****/

browser.runtime.onMessage.addListener(onMessageReception);

