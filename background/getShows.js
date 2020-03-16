//Fetches the XML file from MAL and send it to parse
function getShowListXML(user)
{
    var xmlURL;
    xmlURL = LIST_REQUEST_PARTS[0] + user + LIST_REQUEST_PARTS[1];
    var xmlhttp = new XMLHttpRequest();
    
    // Insert the onreadystatechange trigger
    xmlhttp.onreadystatechange = function () {
        if(this.readyState == 4)
        {
            if (this.status == 200)
                parseShowList(this);
            else
            {       
                alert("MAL API is down. Use the \"All Anime\" page in its profile to refresh the shows.");
                location.reload();
            }
        }
    };
    
    xmlhttp.open("GET", xmlURL, true);
    xmlhttp.send();
}

// Parse info from the XML. also corrects the username entered (lower/upper case)
function parseShowList(xml)
{
    var xmlDoc = xml.responseXML;
    
    var correctUsername = xmlDoc.getElementsByTagName("user_name")[0].childNodes[0].nodeValue;
    gUser = correctUsername;
    
    chrome.storage.sync.set({'username': correctUsername}, function() {
    });
    
    var xmlElements = new Array();
    var xmlSeriesTitle = xmlDoc.getElementsByTagName("series_title");
    
    var xmlSeriesStatus = xmlDoc.getElementsByTagName("my_status");
    xmlElements.push(xmlSeriesTitle);
    xmlElements.push(xmlSeriesStatus);
    
    var shows = new Array();
    for(i = 0; i < xmlElements[0].length; i++)
    {
        var show = {
            title: xmlElements[0][i].childNodes[0].nodeValue,
            status: xmlElements[1][i].childNodes[0].nodeValue
            };
        shows.push(show);
    }
    
    chrome.extension.getBackgroundPage().insertNewData(shows);
}