const http = require('https');
const parseString = require('xml2js').parseString

exports.get = function(channel){
  return new Promise((resolve, reject) => {
    // fs.readFile(file, encoding, function (err, data) {
    //   if (err) return reject(err) // rejects the promise with `err` as the reason
    //   resolve(data)               // fulfills the promise with `data` as the value
    // })
    console.log("Getting " + channel.feed)
    http.get(channel.feed, 
      (response) => {
          // Continuously update stream with data
          var body = ''
          response.on('data', function(chunk) {
            body += chunk
          });
          response.on('end', function() {
            resolve(body)
          });
    });
  })
}


/**
 *  Image resolution in pixels.
 *  Example: 512, 1024...
 *  Check http://sdo.gsfc.nasa.gov/data/ for available resolutions.
 */
var IMAGE_RESOLUTION = "1024";


exports.parseXml = function(xml){  
  return new Promise((resolve, reject) => {
    parseString(xml, function(err, result) {
      let channel = result.rss.channel[0]
      let channelItem = channel.item[0]
      let imgUrl = channelItem['link'][0]
      let pubDate = new Date(channelItem['pubDate'][0])
      
      imgUrl = imgUrl.replace(/_4096_/, "_" + IMAGE_RESOLUTION + "_")
      
      let feedResponse = {
        "date"   : pubDate,
        "image_src" : imgUrl,
        "image" : "/feed/"+imgUrl.split("/").pop()
      }
      resolve(feedResponse)
    })
  })
}

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
