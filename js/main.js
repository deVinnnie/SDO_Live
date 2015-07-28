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

/*----------------
Global Variables
-------------------*/
var currentIndex = 0;
var faults = 0;
var treshold = 10;

var imageCache = [];
var readyList = [];
readyList.clear = function(){
    for(var i = 0; i <= (views.length-1); i++){
        this[i] = false;
    }
}

readyList.isDone = function(){
    var i = 0;
    var isDone = true;
    while(i <= (this.length-1) && isDone == true){
        isDone = this[i];
        i++;
    }
    return isDone;
}

/*----------------
Methods
-------------------*/

$(document).ready(
    init
);

function init(){
    $("#metadata").hide();
    progressJs().start();

    fetchImages();
    refreshImage();

    window.setInterval(fetchImages, FETCH_INTERVAL);
}

function fetchImages(){
    readyList.clear();
    document.getElementById('loading-icon').style.display = 'inline-block'; //Display loading icon.
    for(var i = 0; i <= (views.length-1); i++){
        console.log("Fetching Image "+ (i+1));
        var view = views[i];
        var url = "./proxy.php?channel="+view.id;
        parseImage(url, i);
    }
}

function parseImage(url, index){
    $.getJSON(url, function(data) {
        try{
            console.log("Parsing Image " + (index+1));
            //The first element of the JSON feed contains latest image.
            var latest = data['item'][0];

            // The JSON feeds offers images in 512px times 512px by default.
            // Example filename in JSON feed: "20140416_072402_512_0094.jpg"
            // To access the other resolutions we need to replace the "_512_" with the appropriate resolution.
            // /_512_/ is interpreted as a regular expression.
            var imageURL = latest.link.replace(/_512_/, "_"+IMAGE_RESOLUTION+"_");

            // Refresh Image: Browser will retrieve image from server or reload from cache if the image was not updated.
            //document.getElementById("image").src= imageURL;

            var nextImage = new Image();
            nextImage.src = imageURL;
            nextImage.id = "image";

            // Update the displayed Timestamp.
            // Previous:
            // The obs_date string doesn't have timezone information but is known to be in UTC.
            // For crossbrowser compatibility the date is converted to the following format: "YYYY-MM-DDTHH:MM:SSZ"
            // Z stands for Zulu = UTC in military terms.
            //
            //The rss-feeds do things differently however. The date format is: Wed, 25 Jun 2014 16:15:02 +0000
            //The closest the Date.parse (and the Date constructor) will accept is : Wed, 25 Jun 2014 16:15:02 GMT
            var observationDate = new Date(latest.pubDate.replace(/\+0000/, "GMT"));

            // By default the printed date does not include padding (leading zeroes).
            // The code appends a zero to the front of each part of the time.
            // 2 becomes 02; 11 becomes 011.
            // Calling slice with argument -2 results in slicing the string from the second to last position to the last position.
            // 02 becomes 02; 011 becomes 11.
            var utc = ('0' + observationDate.getUTCHours()).slice(-2) + ":"
                        + ('0' + observationDate.getUTCMinutes()).slice(-2) + ":"
                        + ('0' + observationDate.getUTCSeconds()).slice(-2)
                        + " UTC";

            var local = ('0' + observationDate.getHours()).slice(-2) + ":"
                            + ('0' + observationDate.getMinutes()).slice(-2) + ":"
                            + ('0' + observationDate.getSeconds()).slice(-2)
                            + " Lokale Tijd";

            imageCache[index] = {
                'image' : nextImage,
                'utc' : utc,
                'lokaal' : local
            }

            //Mark as done and check if all images are loaded.
            //Remove loading indicator if true.
            readyList[index] = true;
            if(readyList.isDone()){
                console.log("Done Fetching and Parsing Images.")
                document.getElementById('loading-icon').style.display = 'none';
            }
        }
        catch(e){
            console.error(e.message);
        }
        finally{
        }
    }
    ).fail(function() {
        console.log("Unable to retrieve JSON file for image " + index);
    });
}

function refreshImage(){
    console.log("Switching to image " + (currentIndex+1));
    if(typeof imageCache[currentIndex] === 'undefined'){
        faults++;
        if(faults > treshold){
            faults = 0;
            currentIndex = (currentIndex + 1) % (views.length);
        }

        setTimeout(refreshImage, 1000);
        return;
    }
    else{
        $("#metadata").fadeIn();
    }

    var currentView = views[currentIndex];

    document.getElementById("titel").innerHTML= currentView.title;
    document.getElementById("UTC_tijd").textContent = imageCache[currentIndex].utc;
    document.getElementById("Lokale_tijd").textContent = imageCache[currentIndex].lokaal;

    var sensorFullName = sensors[currentView.sensor];
    document.getElementById('sensor').textContent = currentView.sensor + " (" + sensorFullName +")";

    var imageElement = document.getElementById('image');
    imageElement.parentNode.replaceChild(imageCache[currentIndex].image, imageElement);

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

    var nextIndex = (currentIndex + 1) % (views.length);
    currentIndex = nextIndex;

    setTimeout(refreshImage,interval);
}
