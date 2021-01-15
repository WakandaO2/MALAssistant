/*
Name:           peopleMain.js
Description:    Main module for MAL People pages content scripts.
Author:         WakandaO2
Date:           09/01/2021
*/

async function peopleMain()
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

    userMatches = findUserShows(response.shows);

    try {
        await browser.runtime.sendMessage({ type: MessageTypes.GESTURE_USER_MATCHES, 
                                            matchesCount: userMatches.length });
    } catch {
        console.log("Badge set failed!");
    }

    colorUserShows(userMatches, items['colorInfo']);
}


peopleMain();
