/*
Name:           findUserShows.js
Description:    Find the user's shows in the "Voice Acting Roles"/"Anime Staff Positions" tables.
Author:         WakandaO2
Date:           09/01/2021
*/

/*****  Constants  *****/

const TABLE_ENTRY_CLASS_NAME = "borderClass";


/*****  Functions  *****/

function findUserShows(userShows)
{
    const entriesArr = document.getElementsByClassName(TABLE_ENTRY_CLASS_NAME);

    let userMatches = new Array(),
        entryTitle;

    /* In the "Voice Acting Roles" section we will go on each line twice.
       This solution was added to make sure we will go 
       through all the lines in the "Anime Staff" section. */
    for (i = 2; i < entriesArr.length; i += 2) {
        entryTitle = entriesArr[i].childNodes[0];
        if (!entryTitle) {
            continue;
        }

        if (userShows[entryTitle.innerText]) {
            userMatches.push({'show': userShows[entryTitle.innerText], 
                              'tableEntry': entriesArr[i]})
        }
    }
 
    return userMatches;
}
