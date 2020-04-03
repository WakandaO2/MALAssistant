/*
Name:           constants.js
Description:    Contains constants relevant to all scripts.
Author:         WakandaO2
Date:           11/01/2019
*/

var MalStatuses = {
    WATCHING      : 1,
    COMPLETED     : 2,
    ONHOLD        : 3,
    DROPPED       : 4,
    UNKNOWN       : 5,
    PLAN_TO_WATCH : 6 
}

var Constants = {
    // MALAssistant's version
    VERSION : browser.runtime.getManifest().version,

    // MAL URL formats
    MAL_USER_PROFILE_URL_PREFIX : "https://myanimelist.net/profile/",
    MAL_ANIMELIST_FORMAT        : "https://myanimelist.net/animelist/USERNAME?status=7",

    /* Default colors for multi-colors mode.
       The first color in the array is the default in one color mode. */
    DEFAULT_COLORS : ["#c8edb6", "#84a0e8", "#f9f193", "#eb9091", "#d2d2d2"],

    // Database constants
    DATABASE_NAME    : "ShowsDB",
    SHOWS_TABLE_NAME : "showsTable",
    
    // Messages used to communicate with the background page
    MESSAGE_REQUEST_SHOWS : "RetrieveShows",
    MESSAGE_INSERT_SHOWS  : "InsertShows"
};