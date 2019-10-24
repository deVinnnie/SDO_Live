/**
 *  Image resolution in pixels.
 *  Example: 512, 1024...
 *  Check http://sdo.gsfc.nasa.gov/data/ for available resolutions.
 */
const IMAGE_RESOLUTION = "1024";

const download = require('image-downloader')

// Download to a directory and save with the original filename
exports.imageDownloadDir = './static/feed'

exports.getImage = function(imgUrl){
  let options = {
    url: imgUrl,
    dest: './static/feed'
  }
  
  console.log(options)
  
  
  download.image(options)
    .then(({ filename, image }) => {
      console.log('File saved to', filename)
    }).catch((err) => {
      console.log(err)
      throw err
    })
}

const shell = require('shelljs');

exports.refresh = function getViaSh(){
  returnCode = shell.exec('./script.sh').code;
  
  if (returnCode !== 0) {
    shell.exit(1);
  }
}

const fs = require('fs');
const moment = require('moment');

function extractDate(filename){
  let slices = filename.split('_').slice(0, 2);
  return moment(slices[0]+slices[1]+"Z", "YYYYMMDD" + "HHmmss" + "ZZ");
}

function extractChannel(filename){
  return filename.split('_')[3].split('.')[0];
}

exports.getListing = function(){
  let contents = fs.readFileSync('listing.txt', 'utf8');
  
  return contents.split('\n')
    .filter(str => str !== '')
    .map(filename => {
      let date = extractDate(filename);
      return {
       "image_src": 'https://sdo.gsfc.nasa.gov/assets/img/browse/' + date.format("YYYY/MM/DD/") + filename,
       "image": '/feed/' + filename,
       "date" : date,
       "channel": extractChannel(filename)
      }
    });
}
