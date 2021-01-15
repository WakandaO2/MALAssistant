/*
Name:           colorUserShows.js
Description:    Color the user's shows in people pages.
Author:         WakandaO2
Date:           2017-2018
*/

/*****  Constants  *****/

const LIST_ENTRY_CLASS_NAME = "borderClass";


/*****  Functions  *****/

function colorUserShows(userMatches, colorInfo)
{
    for (let userMatch of userMatches) {
        /* Color the entire line in the table. (<a> --> <td> --> <tr>)*/
        let userMatchLine = userMatch.tableEntry.parentElement;
        
        if (colorInfo.mode == Constants.COLOR_MODES.ONE) {
            userMatchLine.style.backgroundColor = colorInfo.oneColor;
        } else {
            userMatchLine.style.backgroundColor = colorInfo.multiColors[userMatch.show.status];
        }
    }
}
