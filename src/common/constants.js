/*
Name:           constants.js
Description:    Contains constants relevant to all scripts.
Author:         WakandaO2
Date:           11/01/2019
*/

var MessageTypes = {
    INSERT_SHOWS : 0,
    REQUEST_SHOWS : 1
};

var MalStatuses = {
    WATCHING      : 0,
    COMPLETED     : 1,
    ONHOLD        : 2,
    DROPPED       : 3,
    PLAN_TO_WATCH : 4,
    UNKNOWN       : 5,
};

var Constants = {
    // MALAssistant's version
    VERSION : browser.runtime.getManifest().version,

    // MAL URL formats
    MAL_USER_PROFILE_URL_PREFIX : "https://myanimelist.net/profile/",
    MAL_ANIMELIST_FORMAT        : "https://myanimelist.net/animelist/USERNAME?status=7",

    /* Default colors for multi-colors mode. */
    DEFAULT_COLORS : ["#c8edb6", "#84a0e8", "#f9f193", "#eb9091", "#d2d2d2"],
    DEFAULT_ONE_COLOR : "#c8edb6",
    COLOR_MODES    : { DISABLED : 0, ONE : 1, MULTI : 2},

    // Database constants
    DATABASE_NAME    : "ShowsDB",
    SHOWS_TABLE_NAME : "showsTable",
};