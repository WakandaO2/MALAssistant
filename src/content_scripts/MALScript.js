/*
Name:           malScript.js
Description:    Content script responsible for coloring the user's shows.
Author:         WakandaO2
Date:           2017-2018
*/

/* Functions */

function fetchData()
{
    chrome.storage.sync.get('colorSelection', function(item) {
        if(item.colorSelection == null)
        {    
            chrome.storage.sync.set({'colorSelection':"none"}, function(){
            });
        }
        else
        {
            var select = item.colorSelection;
            if(item.colorSelection != "none")
            {
                if(item.colorSelection == "one")
                {
                    chrome.storage.sync.get('oneColorChoosed', function(item) {
                        gOneColor = item.oneColorChoosed;
                    });
                }
                else
                {
                    chrome.storage.sync.get('multiChoosed', function(item) {
                        for(i = 0; i < item.multiChoosed.length; i++)
                        {
                            gMultiColors.push(item.multiChoosed[i]);
                        }
                    });
                }

                getInfoFromDatabase(select);
            };
        }
    });
}

function getInfoFromDatabase(colorSelection)
{    
    chrome.runtime.sendMessage({message: Constants.MESSAGE_REQUEST_SHOWS}, function(response){
        console.log(response);
        
        colorData(response.farewell, colorSelection);
    });
}

function colorData(storedShowsArray, colorSelection)
{
    var entriesArr = document.getElementsByClassName("borderClass"),
        i = 2,
        entryTitle,
        currentShow,
        colorToUse,
        lineToColor;
        
    while(i < entriesArr.length)
    {
        entryTitle = entriesArr[i].childNodes[0];

        if (storedShowsArray.hasOwnProperty(entryTitle.innerText))
        {
            /* Now we know the show exists in the user's shows list. */
            currentShow = storedShowsArray[entryTitle.innerText];

            if (colorSelection == "one")
                colorToUse = gOneColor;
            else
            {
                if (currentShow.status > 4)
                    colorToUse = gMultiColors[4];
                else
                    colorToUse = gMultiColors[currentShow.status - 1];
            }
            
            /* Color the entire line in the table. (<a> --> <td> --> <tr>)*/
            lineToColor = entryTitle.parentElement.parentElement;
            lineToColor.style.backgroundColor = colorToUse;
        }
        
        /* In the "Voice Acting Roles" section we will go on each line twice.
           This solution was added to make sure we will go 
           through all the lines in the "Anime Staff" section. */
        i = i + 2;
    }
}

var gOneColor,
gMultiColors = new Array();

fetchData();