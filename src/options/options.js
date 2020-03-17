/*
Name:           options.js
Description:    Responsible for everything that can be managed in the options page.
Author:         WakandaO2
Date:           2017-2018
*/

/*****  Constants  *****/

const Constants = browser.extension.getBackgroundPage().Constants;

// MyAnimeList Addresses
var LIST_REQUEST_PARTS = ["https://myanimelist.net/malappinfo.php?u=", "&status=all&type=anime"];


/***** Global Variables  *****/

var gUser,
    gOneColor,
    gShows = new Array(),
    gMultiColors = new Array();

function toggleColorMenu(noColor, oneColor, multiColor)
{
        noColorMenu.style.display = noColor;
        oneColorMenu.style.display = oneColor;
        multiColorMenu.style.display = multiColor;
}


/***** Callback Functions *****/

function onNewUsernameSet()
{
    alert("New username set. To update the shows, go to the username's \"All anime\" page.");
    location.reload();
}

function onUsernameGet(items)
{
    if (items['username'] != null) {
        storedUsername.innerHTML = items['username'];
        gUser = items['username'];

        userURL.setAttribute('href', Constants.MAL_USER_PROFILE_URL_PREFIX + gUser);
        userURL.setAttribute('target', '_blank')
    }
}

function onShowsResponse(response)
{
    // The shows list is actually an associative object.
    var namesArray = Object.keys(response.farewell);

    for (i = 0; i < namesArray.length; i++) {
        gShows.push(response.farewell[namesArray[i]]);
    }
    
    showListOfShows();
}

function onOptionsPageLoad()
{
    //Adds the version number to the title in the top of the page
    titleText.innerHTML += chrome.runtime.getManifest().version;
    
    // TODO: Add storage get fail error handler.
    browser.storage.local.get('username').then(onUsernameGet, null);
    
    requestShowsInfo();
    
    //Gets the user preference about Disabled/One Color/Multi Color and opens the correct menu
    chrome.storage.sync.get('colorSelection', function(item) {
        if(item.colorSelection == null)
        {
            chrome.storage.sync.set({'colorSelection':"none"},function(){
            });
            toggleColorMenu("block", "none", "none");
            radioNo.checked = true;
        }
        else
        {
            if(item.colorSelection == "none")
            {
                toggleColorMenu("block", "none", "none");
                radioNo.checked = true;
            }
            else
            {
                if(item.colorSelection == "one")
                {
                    toggleColorMenu("none", "block", "none");
                    radioOne.checked = true;
                }
                else
                {
                    toggleColorMenu("none", "none", "block");
                    radioMulti.checked = true;
                }
            }
        }
    });
    
    //Gets multi color array from storage and if there is no array creates one and puts the default colorSelection
    chrome.storage.sync.get('multiChoosed', function(item) {
        if(item.multiChoosed == null)
        {
            chrome.storage.sync.set({'multiChoosed': Constants.DEFAULT_COLORS}, function() {
                console.log("DEFAULT COLORS SET.");
            });
            
            for(i = 0; i < Constants.DEFAULT_COLORS.length; i++)
            {
                gMultiColors.push(Constants.DEFAULT_COLORS[i]);
            }
        }
        else
        {
            for(i = 0; i < item.multiChoosed.length; i++)
            {
                gMultiColors.push(item.multiChoosed[i]);
            }
        }
        multiColorWATCH.innerHTML = gMultiColors[0];
        colorWATCHInput.value = gMultiColors[0];
        multiColorCMPLT.innerHTML = gMultiColors[1];
        colorCMPLTInput.value = gMultiColors[1];
        multiColorONHLD.innerHTML = gMultiColors[2];
        colorONHLDInput.value = gMultiColors[2];
        multiColorDROPD.innerHTML = gMultiColors[3];
        colorDROPDInput.value = gMultiColors[3];
        multiColorPTW.innerHTML = gMultiColors[4];
        colorPTWInput.value = gMultiColors[4];
    });
    
    //Gets color from storage and if there is no color it puts the default one.
    chrome.storage.sync.get('oneColorChoosed', function(item) {
        if(item.oneColorChoosed == null)
        {
            chrome.storage.sync.set({'oneColorChoosed': Constants.DEFAULT_COLOR}, function() {
            });
            oneColorChosen.innerHTML = Constants.DEFAULT_COLOR;
            gOneColor = Constants.DEFAULT_COLOR;
        }
        else
        {
            oneColorChosen.innerHTML = item.oneColorChoosed;
            gOneColor = item.oneColorChoosed;
        }
        oneColorInput.value = oneColorChosen.innerHTML;
    });
    
    
    //Calls store username function when submit button is clicked
    submitUsername.addEventListener("click", function() {
        setNewUsername(usernameField.value);
    });
    
    //Calls list refreshing function when refresh button is clicked
    refreshCurrUser.addEventListener("click", function() {
        alert("Will now refresh shows for user " + gUser + ".");
    });

    //Handles showing/hiding of color menus
    
    //No Colors
    radioNo.addEventListener("click", function() {
        toggleColorMenu("block", "none", "none");
        setColorSelection("none");
    });
    
    //One Color
    radioOne.addEventListener("click", function() {
        toggleColorMenu("none", "block", "none");
        setColorSelection("one");
    });    

    //Multi Colors
    radioMulti.addEventListener("click", function() {
        toggleColorMenu("none", "none", "block");
        setColorSelection("multi");
    });
    
    ////
    
    //When one color is submitted, inserts it into storage.
    submitOneColor.addEventListener("click", function() {
        setNewOneColor(oneColorInput.value);
    });
    
    //When the submit button in multi color menu is pressed, inserts the colors into storage.
    submitMultiColor.addEventListener("click", function() {
        setNewMultiColors();
    });
    
    defaultOneColor.addEventListener("click", function() {
        setNewOneColor(defaultOneColor.innerHTML);
        oneColorInput.value = defaultOneColor.innerHTML;
    });
    
    defaultColorWATCH.addEventListener("click", function() {
        colorWATCHInput.value = defaultColorWATCH.innerHTML;
    });
    
    defaultColorCMPLT.addEventListener("click", function() {
        colorCMPLTInput.value = defaultColorCMPLT.innerHTML;
    });
    
    defaultColorONHLD.addEventListener("click", function() {
        colorONHLDInput.value = defaultColorONHLD.innerHTML;
    });
    
    defaultColorDROPD.addEventListener("click", function() {
        colorDROPDInput.value = defaultColorDROPD.innerHTML;
    });
    
    defaultColorPTW.addEventListener("click", function() {
        colorPTWInput.value = defaultColorPTW.innerHTML;
    });
}


/*****  Functions  *****/

function showListOfShows()
{
    for (i = 0; i < gShows.length; i++)
    {
        var optionAdded = document.createElement("option");
        optionAdded.text = gShows[i].title;
        selectShowsListed.options.add(optionAdded);
    }

    document.getElementById("numShowsListed").innerHTML = selectShowsListed.options.length;
}

function requestShowsInfo()
{
    var message = { message: Constants.MESSAGE_REQUEST_SHOWS };
    
    // TODO: Add on response failed error handler.
    browser.runtime.sendMessage(message).then(onShowsResponse, null);
}

function setNewUsername(new_username)
{
    // New username validation.
    if ((new_username != null) && (new_username[0] != ' ') && (new_username != "")) {
        // TODO: Add on storage set error handling function.
        browser.storage.local.set({'username': new_username}).then(onNewUsernameSet, null);
    } else { 
        alert("Invalid username. Please enter a valid one.");
    }
}

function setNewOneColor(color)
{
    chrome.storage.sync.set({'oneColorChoosed': color}, function() {
        oneColorChosen.innerHTML = color;
    });
}

//Inserts the selection of color scheme (e.g: no colors, one color, multi color) into storage
function setColorSelection(selection)
{
    chrome.storage.sync.set({'colorSelection': selection}, function() {
    });
}

function setNewMultiColors()
{
    var multiColors = new Array();
    multiColors.push(colorWATCHInput.value);
    multiColors.push(colorCMPLTInput.value);
    multiColors.push(colorONHLDInput.value);
    multiColors.push(colorDROPDInput.value);
    multiColors.push(colorPTWInput.value);
    chrome.storage.sync.set({'multiChoosed': multiColors}, function() {
        multiColorWATCH.innerHTML = multiColors[0];
        multiColorCMPLT.innerHTML = multiColors[1];
        multiColorONHLD.innerHTML = multiColors[2];
        multiColorDROPD.innerHTML = multiColors[3];
        multiColorPTW.innerHTML = multiColors[4];
        alert("New colors set.");
    });
}


/*****  Callback registrations  *****/

document.addEventListener('DOMContentLoaded', onOptionsPageLoad);
