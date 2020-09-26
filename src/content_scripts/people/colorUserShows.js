/*
Name:           colorUserShows.js
Description:    Color the user's shows in people pages.
Author:         WakandaO2
Date:           2017-2018
*/

/*****  Constants  *****/

const LIST_ENTRY_CLASS_NAME = "borderClass";


/*****  Functions  *****/

function colorUserShows(colorInfo, userShows)
{
    const entriesArr = document.getElementsByClassName(LIST_ENTRY_CLASS_NAME);
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
    let items,
        response;

    try {
        items = await browser.storage.local.get('colorInfo');
    } catch (error) {
        return onColorInfoGetError(error);
    }

    if (!items['colorInfo']) {
        console.log("No color information set! Use the options page to do so.");
        return;
    }

    if (items['colorInfo'].mode == Constants.COLOR_MODES.DISABLED) {
        return;
    }

    try {
        response = await browser.runtime.sendMessage({ type: MessageTypes.REQUEST_SHOWS });
    } catch {
        return onMessageSendError(error);
    }

    colorUserShows(items['colorInfo'], response.shows);
}


main();
