import {Carousel} from './Carousel';
import {Aside} from './Aside';

import {FETCH_INTERVAL, DEFAULT_INTERVAL} from './views';

export class Main extends React.Component {
    constructor(props){
      super(props);
        this.state = {
          "current" :  {
              "id": "aia_0193",
              "title": "AIA 193",
              "sensor": "AIA",
              "feed": "https://sdo.gsfc.nasa.gov/feeds/aia_0193.rss",
              "latest": {
                "image" : "images/black_square.png",
                "date" : new Date()
              },
          },
          "error" : false,
          "loading" : true
        };
        this.channels = [];
        this.currentIndex = 0;
        this.spinner = props.spinner;
    }

    componentDidMount(){
        this.fetchImages(
            () => {
                this.startCarousel();
            }
        );

        window.setInterval(this.fetchImages.bind(this), FETCH_INTERVAL);
    }

    render(){
      return <div>
        <Carousel current={this.state.current} />
        <Aside current={this.state.current} error={this.state.error} loading={this.state.loading}/>
      </div>;
    }

    startCarousel(){
        if(!this.channels.length >= 1){
          //document.getElementById('error-icon').style.display = "inline-block";
          return;
        }

        console.log("Done Fetching and Parsing Images.");

        // Set to -1 so that when incremented in refreshImage() the very first image is at index 0.
        this.currentIndex = -1;
        this.refreshImage();
    }

    /**
     * Move carousel to next image.
     *
     * If this image is not yet loaded or failed to load it will try to move ahead to the following image.
     *
     */
    refreshImage(){
        this.currentIndex = (this.currentIndex + 1) % (this.channels.length);
        console.log("Switching to image " + this.currentIndex);

        let currentView = this.channels[this.currentIndex];

        this.setState(
            Object.assign({}, this.state, {"current" :  currentView})
        );

        this.spinner.reset(this.currentIndex, this.channels.length);
        setTimeout(this.refreshImage.bind(this), DEFAULT_INTERVAL);
    }

    /**
     * Contacts server and loads new images
     */
    fetchImages(callback){
        console.log("Sending update command");
        this.setLoading(true);
      
        fetch("/actions/update")
          .then(() => {
            fetch("/channels")
              .then(response => response.json())
              .then(
                (data) => {
                  console.log("Reading Channels");
                  this.channels = data;
                  console.log(data);

                  this.setLoading(false);

                  if(callback){
                    callback();
                  }
                }
              )
          }
        )
        .catch(error => {
            setError(true);
            console.log("Unable to do update command");
        });
    }

    setLoading(value){
        this.setState(
            Object.assign({}, this.state, {"loading" :  value})
        );
    }


    setError(value){
        this.setState(
            Object.assign({}, this.state, {"error" :  value})
        );
    }
}
