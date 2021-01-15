/*
Name:           common.js
Description:    Common functions and definitions.
Author:         WakandaO2
Date:           09/04/2020
*/

/*****  Constants  *****/

var MessageTypes = {
    INSERT_SHOWS         : 0,
    REQUEST_SHOWS        : 1,
    GESTURE_USER_MATCHES : 2
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

    // Color-related values
    DEFAULT_COLORS    : ["#c8edb6", "#84a0e8", "#f9f193", "#eb9091", "#d2d2d2"],
    DEFAULT_ONE_COLOR : "#c8edb6",
    COLOR_MODES       : { DISABLED : 0, ONE : 1, MULTI : 2},

    // Database constants
    DATABASE_NAME  : "MALAssistantDB",
    SHOWS_OBJSTORE : "Shows",
};


/*****  Callback Functions  *****/

function onMessageSendError(error)
{
    return onGenericError("Message send failed", error);
}

function onUsernameGetError(error)
{
    return onGenericError("Username set failed", error);
}

function onUsernameSetError(error)
{
    return onGenericError("Username get failed", error);
}

function onColorInfoGetError(error)
{
    return onGenericError("Color information get failed", error)
}


/*****  Functions  *****/

function onGenericError(message, error)
{
    console.log(`${message}: ${error}`);
}

function compareShowNames(firstShow, secondShow)
{
    if (firstShow.title < secondShow.title)
        return -1;

    if (firstShow.title > secondShow.title)
        return 1;

    return 0;
}