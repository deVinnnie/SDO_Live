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
var currentIndex;

var imageElement;

/**
 * Is the first set of images loaded yet?
 */
var carouselStarted = false;

var imageCache = [];

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

function updateProgress(){
    document.getElementById('loading').innerHTML =
        '<p>Starting... ' + readyList.count() + ' / ' + readyList.length +'</p>';
        
    if(readyList.fails() >= 1){
        document.getElementById('error-icon').style.display = 'inline-block';
    }
    else{
        document.getElementById('error-icon').style.display = 'none';
    }
}

/**
 * Contacts server and loads new images into the imageCache variable.
 */
function fetchImages(){
    readyList.clear();
    document.getElementById('loading-icon').style.display = 'inline-block'; //Display loading icon.
    for(var i = 0; i <= (views.length-1); i++){
        console.log("Fetching Feed for Image "+ (i+1));
        var view = views[i];
        var url = "./proxy.php?channel="+view.id;
        parseFeed(url, i);
    }
}

/**
 * Gets the JSON data at the specified URL `url`. 
 * The image url and meta data (date and time) are extracted from the feed.
 * When loading is complete the element `index` of the readyList array is set to true.
 */
function parseFeed(url, index){
    $.getJSON(url, function(data) {
        try{
            console.log("Parsing Feed for Image " + (index+1));

            //The first element of the JSON feed contains latest image.
            var latest = data['channel']['item'];

            // The JSON feeds offers images in size 4096x4096px (previously 512x512px) by default.
            // Example filename in JSON feed: "20140416_072402_4096_0094.jpg"
            // To access the other resolutions we need to replace the "_4096_" with the preferred resolution.
            // /_4096_/ is interpreted as a regular expression.
            var imageURL = latest.link.replace(/_4096_/, "_" + IMAGE_RESOLUTION + "_");

            // Load Image: Browser will retrieve image from server. 
            // On the next reload it will hit the cache instead of reloading the web source.
            var latestImage = new Image();
            latestImage.onload = function(){ //Only mark as done when image is fully loaded!
                console.log("Image Loaded!");
                //Mark as done and check if all images are loaded.
                //Remove loading indicator if true.
                readyList[index] = true;

                updateProgress();

                if(readyList.isDone()){
                    document.getElementById('loading-icon').style.display = 'none';
                }

                if(carouselStarted == false && readyList.isDone()){
                    startCarousel();
                }
            };
            latestImage.src = imageURL;
            latestImage.id = "image";

            // Get timestamp.
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
                'image' : latestImage,
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
        readyList[index] = "fail";
    });
}

function startCarousel(){
    console.log("Done Fetching and Parsing Images.");
    document.getElementById('loading').style.opacity = 0;

    // Set to -1 so that when incremented in refreshImage() the very first image is at index 0.
    currentIndex = -1;
    carouselStarted = true;
    refreshImage();
}

/**
 * Move carousel to next image.
 *
 * If this image is not yet loaded or failed to load it will try to move ahead to the following image.
 *
 */
function refreshImage(){
    currentIndex = (currentIndex + 1) % (views.length);
    console.log("Switching to image " + currentIndex);
    
    if(readyList[currentIndex] == "fail"){
        setTimeout(refreshImage, 0);
        return;
    }

    $("#metadata").fadeIn();

    var currentView = views[currentIndex];
    var imageObject = imageCache[currentIndex];

    image_url = imageObject.image.src;
    imageElement.attr('src', image_url);

    setMetaData(currentView, imageObject);
    
    // Determine the duration during which this image will be displayed.
    var interval = DEFAULT_INTERVAL;
    if(currentView.hasOwnProperty("duration")){
        interval = currentView.duration;
    }

    progressJs().set(100); //Reset the progressbar.
    progressJs().autoIncrease(-20, interval/5.5); //Decrease the progressbar with 5% once every 1/20 * interval.

    setTimeout(refreshImage, interval);
}

/**
* Retrieve and set metadata for the given view/image.
*/
function setMetaData(view, imageObject){
    document.getElementById("titel").innerHTML = view.title;
    document.getElementById("UTC_tijd").textContent = imageObject.utc;
    document.getElementById("Lokale_tijd").textContent = imageObject.lokaal;

    var sensorFullName = sensors[view.sensor];
    document.getElementById('sensor').textContent = view.sensor + " (" + sensorFullName +")";
}
