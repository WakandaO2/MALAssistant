/*
Name:           showListProgress.js
Description:    Show the user's anime/manga list progress in its profile.
Author:         WakandaO2
Date:           26/09/2020
*/

/*****  Constants  *****/

const LIST_UPDATES_CLASS_NAME   = "statistics-updates di-b w100 mb8",
      ANIME_WATCHING_CLASS_NAME = "text anime watching",
      MANGA_READING_CLASS_NAME  = "text manga reading",
      PROGRESS_SPAN_STYLE       = "margin-left: 5px";


/*****  Functions  *****/

function calculateShowProgress(listUpdateInfo)
{
    const [ num, denom ] = listUpdateInfo.innerText.split(" ")[1].split("/");
    return String(Math.floor((num / denom) * 100) + "%");
}

function showListProgress()
{
    const listUpdates = document.getElementsByClassName(LIST_UPDATES_CLASS_NAME);
    
    for (const listUpdate of listUpdates) {
        /* --> <div class="data"> --> <div class="fn-grey2"> */
        const listUpdateData = listUpdate.childNodes[3];
        const listUpdateInfo = listUpdateData.childNodes[5];

        /* Show the progress for only relevant updates.
           "Watching" for Anime and "Reading" for manga are the only relevant updates. */
        if ((-1 !== listUpdateInfo.innerText.search("Completed")) ||
            (-1 !== listUpdateInfo.innerText.search("Plan to Watch"))) {
            continue;
        }

        /* Check if there is no valid progress to show (i.e. "50/?"). */
        if ((-1 !== listUpdateInfo.innerText.search("\\?")) ||
            (-1 !== listUpdateInfo.innerText.search("- ·")) ||
            (-1 !== listUpdateInfo.innerText.search("-/"))) {
            continue;
        }
            
        const progressSpan = document.createElement("span");
        progressSpan.classList += listUpdateInfo.childNodes[1].classList;
        progressSpan.style = PROGRESS_SPAN_STYLE;
        progressSpan.innerText = calculateShowProgress(listUpdateInfo);

        listUpdateData.childNodes[3].appendChild(progressSpan);
    }
}


showListProgress();
