/**
 * main.js
 *
 * @author Vincent Ceulemans
 *
 */

/*----------------
Static Variables
-------------------*/

/**
 * URL to image directory. 
 */
var BASE_URL = "http://sdo.gsfc.nasa.gov/assets/img/browse";

/**
 * URL to JSON-feeds. 
 */
var JSON_URL = "http://sdo.gsfc.nasa.gov/feeds/json.php";

/*----------------
Global Variables
-------------------*/
var currentIndex = 0; 

/*----------------
Methods
-------------------*/

$(document).ready(
    init
);

function init(){
    progressJs().start(); 
    refreshImage(); 
}

function refreshImage(){
    var currentView = views[currentIndex]; 
    var url = JSON_URL + "?c=" + currentView.id;
    
    $.getJSON(url, function(data) {
        //The first element of the JSON feed contains latest image.
        var latest = data['data'][0];

        // The JSON feeds offers images in 512px times 512px by default.
        // Example filename in JSON feed: "20140416_072402_512_0094.jpg"
        // To access the other resolutions we need to replace the "_512_" with the appropriate resolution.
        // /_512_/ is interpreted as a regular expression. 
        var filename = latest.filename.replace(/_512_/, "_"+IMAGE_RESOLUTION+"_");
        var imageURL = BASE_URL 
                        + latest.filepath  // Example: "/2014/04/16/"
                         + filename;
    
        // Refresh Image: Browser will retrieve image from server or reload from cache if the image was not updated.
        document.getElementById("image").src= imageURL; 

        // Update Title
        document.getElementById("titel").innerHTML= currentView.title; 

        // Update the displayed Timestamp. 
        // The obs_date string doesn't have timezone information but is known to be in UTC.
        // For crossbrowser compatibility the date is converted to the following format: "YYYY-MM-DDTHH:MM:SSZ"
        // Z stands for Zulu = UTC in military terms. 
        var observationDate = new Date(latest.obs_date.replace(/\s/, "T")+"Z"); // "\s" = whitespace character

        // By default the printed date does not include padding (leading zeroes).
        // The code appends a zero to the front of each part of the time. 
        // 2 becomes 02; 11 becomes 011. 
        // Calling slice with argument -2 results in slicing the string from the second to last position to the last position.
        // 02 becomes 02; 011 becomes 11.
        document.getElementById("UTC_tijd").textContent = ('0' + observationDate.getUTCHours()).slice(-2) + ":"
                    + ('0' + observationDate.getUTCMinutes()).slice(-2) + ":"
                    + ('0' + observationDate.getUTCSeconds()).slice(-2)
                    + " UTC";  

        document.getElementById("Lokale_tijd").textContent = ('0' + observationDate.getHours()).slice(-2) + ":"
                        + ('0' + observationDate.getMinutes()).slice(-2) + ":"
                        + ('0' + observationDate.getSeconds()).slice(-2)
                        + " Lokale Tijd";

        // Update Sensor Information
        var found = false;
        var i = 0;
        var sensor; 
        while(!found && i < sensors.length){
            if(sensors[i].abbr == currentView.sensor){
                found = true;
                sensor = sensors[i]; 
            }
            else{
                i++; 
            }
        }

        document.getElementById("sensor").textContent = sensor.abbr + " (" + sensor.name +")";

        //Update Index 
        if(currentIndex >= views.length-1){ 
            currentIndex=0; //Resets the index to the first element.
        }
        else{
            currentIndex++; 
        }

        // Determine the duration this image will be displayed. 
        var interval; 
        if(currentView.hasOwnProperty("duration")){
            interval = currentView.duration; 
        }
        else{
            interval = DEFAULT_INTERVAL;
        }
       
        progressJs().set(100); //Reset the progressbar. 
        progressJs().autoIncrease(-1, interval/100); //Decrease the progressbar with 1% once every 0.01 * interval. 
        
        setTimeout(refreshImage,interval); 
    });
}
