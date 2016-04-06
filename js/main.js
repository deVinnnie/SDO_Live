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

var imageElement;

/**
 * Is the first set of images loaded yet?
 */
var initialLoadComplete = false;

var imageCache = [];
var readyList = [];
readyList.clear = function(){
    for(var i = 0; i <= (views.length-1); i++){
        this[i] = false;
    }
}

/**
 * Returns true when all elements in list are loaded (true).
 * Returns false when one or more elements are still loading (false).
 */
readyList.isDone = function(){
    var i = 0;
    var isDone = true;
    while(i <= (this.length-1) && isDone == true){
        isDone = this[i];
        i++;
    }
    return isDone;
}

readyList.count = function(){
    var count = 0;
    for(var i=0; i<= (this.length-1); i++){
        if(this[i]){
            count++;
        }
    }
    return count;
}

/*----------------
Methods
-------------------*/

$(document).ready(
    init
);


// From: http://davidwalsh.name/fullscreen
// Find the right method, call on correct element
function launchFullScreen(element) {
    if(element.requestFullScreen) {
        element.requestFullScreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
}

function init(){
    launchFullScreen(document.documentElement);
    //Request Full Screen. Normally requires user interaction. Use Firefox and alter config so that:
    //full-screen-api.allow-trusted-requests-only = false
    //See: http://stackoverflow.com/questions/9454125/javascript-request-fullscreen-is-unreliable

    $("#metadata").hide();
    progressJs().start();

    fetchImages();

    window.setInterval(fetchImages, FETCH_INTERVAL);

    imageElement = $("#image");
}

/**
 * Contacts server and loads new images into the imageCache variable.
 */
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

/**
 * Gets the JSON data at the specified URL `url`.
 * When loading is complete sets element `index` of readyList to true.
 */
function parseImage(url, index){
    $.getJSON(url, function(data) {
        try{
            console.log("Parsing Image " + (index+1));

            //The first element of the JSON feed contains latest image.
            var latest = data['channel']['item'];

            // The JSON feeds offers images in 512px times 512px by default.
            // Example filename in JSON feed: "20140416_072402_512_0094.jpg"
            // To access the other resolutions we need to replace the "_512_" with the appropriate resolution.
            // /_512_/ is interpreted as a regular expression.
            var imageURL = latest.link.replace(/_512_/, "_"+IMAGE_RESOLUTION+"_");

            // Load Image: Browser will retrieve image from server. On the next reload it will use the cache instead of the web source.
            var nextImage = new Image();
            nextImage.onload = function(){ //Only mark as done when image is fully loaded!
                console.log("Loaded!");
                //Mark as done and check if all images are loaded.
                //Remove loading indicator if true.
                readyList[index] = true;

                document.getElementById('loading').innerHTML =
                    '<p>Starting... ' + readyList.count() + ' / ' + readyList.length +'</p>';

                if(readyList.isDone()){
                    console.log("Done Fetching and Parsing Images.")
                    document.getElementById('loading-icon').style.display = 'none';
                    document.getElementById('loading').style.opacity = 0;
                    initialLoadComplete = true;

                    refreshImage();
                }
            };
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

/**
 * Move carousel to next image.
 *
 * If image is not yet loaded
 * Will try for `threshold` amount before giving up and moving to the next image.
 *
 */
function refreshImage(){
    console.log("Switching to image " + (currentIndex+1));
    if(!initialLoadComplete || !readyList[currentIndex]){
        currentIndex = (currentIndex + 1) % (views.length);
        setTimeout(refreshImage, 1000);
        return;
    }

    $("#metadata").fadeIn();

    var currentView = views[currentIndex];

    document.getElementById("titel").innerHTML = currentView.title;
    document.getElementById("UTC_tijd").textContent = imageCache[currentIndex].utc;
    document.getElementById("Lokale_tijd").textContent = imageCache[currentIndex].lokaal;

    var sensorFullName = sensors[currentView.sensor];
    document.getElementById('sensor').textContent = currentView.sensor + " (" + sensorFullName +")";

    //var imageElement = document.getElementById('image');
    //imageElement.parentNode.replaceChild(imageCache[currentIndex].image, imageElement);
    //imageElement.src=imageCache[currentIndex].image.src;

    image_url = imageCache[currentIndex].image.src;
    imageElement.attr('src', image_url);

    // Determine the duration this image will be displayed.
    var interval = DEFAULT_INTERVAL;
    if(currentView.hasOwnProperty("duration")){
        interval = currentView.duration;
    }

    progressJs().set(100); //Reset the progressbar.
    progressJs().autoIncrease(-5, interval/20); //Decrease the progressbar with 5% once every 1/20 * interval.

    currentIndex = (currentIndex + 1) % (views.length);
    setTimeout(refreshImage, interval);
}
