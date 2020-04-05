/*
Name:           utils.js
Description:    Contains functions and miscellaneous things relevant to all scripts.
Author:         WakandaO2
Date:           11/01/2019
*/

/*****  Auxiliary functions  *****/

function compareShowNames(firstShow, secondShow)
{
    if (firstShow.title < secondShow.title)
        return -1;

    if (firstShow.title > secondShow.title)
        return 1;

    return 0;
}