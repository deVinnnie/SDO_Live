var currentIndex;

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

    $('.chart').easyPieChart({
      //animate: 500,
      animate: false,
      barColor: "#de9913",
      trackColor: "#000",
      scaleColor: false,
      size: 60
    });

    fetchImages(
      () => {
        document.getElementById('loading-icon').style.display = 'none';
        document.getElementById('metadata').style.opacity = '1';
        startCarousel();
      }
    );

    window.setInterval(fetchImages, FETCH_INTERVAL);

    imageElement = $("#image");
}

/**
 * Contacts server and loads new images
 */
function fetchImages(callback){
    console.log("Sending update command");
    $.get("/actions/update",
      () => {
        $.getJSON("/channels",
          (data) => {
            console.log("Reading Channels");
            views = data.filter(
              channel => channel.latest
            );
            if(callback){
              callback();
            }
          }
        );
      }
    )
    .fail(function() {
        console.log("Unable to do update command");
    });
}

function startCarousel(){
    if(!views.length >= 1){
      document.getElementById('error-icon').style.display = "inline-block";
      return;
    }
  
    console.log("Done Fetching and Parsing Images.");

    // Set to -1 so that when incremented in refreshImage() the very first image is at index 0.
    currentIndex = -1;
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

    var currentView = views[currentIndex];
    
    image_url = currentView.latest.image;
    imageElement.attr('src', image_url);

    setMetaData(currentView);
    
    // Determine the duration during which this image will be displayed. 
    countDown = 100;
    $('.chart').data('easyPieChart').update(countDown);
    setTimeout(removeTick, DEFAULT_INTERVAL/steps);

    setTimeout(refreshImage, DEFAULT_INTERVAL);
}

var steps = 20;
var countDown;

function removeTick(){
    $('.chart').data('easyPieChart').update(countDown);
    
    countDown-= (100/steps);
    
    if(countDown > 0){
        setTimeout(removeTick, DEFAULT_INTERVAL/steps);
    }
}

/**
* Retrieve and set metadata for the given view.
*/
function setMetaData(view){
    document.getElementById("titel").innerHTML = view.title;
    document.getElementById("viewIndicator").innerHTML = "<sup>" + (currentIndex+1) +  "</sup>"+ "/" + "<sub>"+views.length + "</sub>";
    
    var time = new Date(view.latest.date);
    
    var local = 
          ('0' + time.getDate()).slice(-2) + " " + 
          months[time.getMonth()] + " " +  
          ('0' + time.getHours()).slice(-2) + "h" + 
          ('0' + time.getMinutes()).slice(-2) + "m"
                      
    
    document.getElementById("time").textContent = local;

    var sensorFullName = sensors[view.sensor];
    document.getElementById('sensor').textContent = view.sensor + " (" + sensorFullName +")";
    
    document.getElementById("spacecraft").src="images/spacecraft/spacecraft-" + view.sensor.toLowerCase() + "-overlay.png";
}
