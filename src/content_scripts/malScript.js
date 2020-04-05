/*
Name:           malScript.js
Description:    Content script responsible for coloring the user's shows.
Author:         WakandaO2
Date:           2017-2018
*/

/*****  Functions  *****/

function colorUserShows(colorInfo, userShows)
{
    const entriesArr = document.getElementsByClassName("borderClass");
    var entryTitle,
        currentShow,
        colorToUse;
        
    /* In the "Voice Acting Roles" section we will go on each line twice.
       This solution was added to make sure we will go 
       through all the lines in the "Anime Staff" section. */
    for (i = 2; i < entriesArr.length; i += 2) {
        entryTitle = entriesArr[i].childNodes[0];

        if (userShows[entryTitle.innerText]) {
            /* Now we know the show exists in the user's shows list. */
            currentShow = userShows[entryTitle.innerText];

            if (colorInfo.mode == Constants.COLOR_MODES.ONE) {
                colorToUse = colorInfo.oneColor;
            } else {
                colorToUse = colorInfo.multiColors[currentShow.status];
            }
            
            /* Color the entire line in the table. (<a> --> <td> --> <tr>)*/
            entryTitle.parentElement.parentElement.style.backgroundColor = colorToUse;
        }
    }
}

async function main()
{
    let items = await browser.storage.local.get('colorInfo');

    if (items['colorInfo'] == null) {
        console.log("No color information set! Use the options page to do so.");
        return;
    }

    if (items['colorInfo'].mode == Constants.COLOR_MODES.DISABLED) {
        return;
    }

    let response = await browser.runtime.sendMessage({type: MessageTypes.REQUEST_SHOWS});

    colorUserShows(items['colorInfo'], response.shows);
}


main();

