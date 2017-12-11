const express = require('express')
const app = express()
const channels = require('./channels').channels
const feed = require('./feed')
const fs = require('fs')
const feedBaseUrl = "https://sdo.gsfc.nasa.gov/"
const path = require('path')
var moment = require('moment');

function feedUrl(channel){
  return feedBaseUrl+"feeds/"+channel.id+".rss"
}

channels.forEach(
  c => {
    c.feed = feedUrl(c)
  }
)

// Main View
app.get('/', function(req, res) {
  res.render('index', {})
})

// Actions
app.get('/channels/', function(req, res) {
  let host = 'http://'+req.headers.host
  let allChannels = channels.map(
    c => {
      let mapped = Object.assign({}, c)
      mapped._links = [
        {
          'rel': 'self', 
          'href': `${host}/channels/${c.id}`
        }
      ]; 
      return mapped
    }
  )
  res.send(allChannels)
})

function findChannel(id){
  return channels.filter(
    c => c.id == id
  )[0]
}

// Actions
app.get('/actions/update', function(req, res) {
  cleanup()
  updateAllChannels()
  res.send("OK")
})

app.get('/actions/clear', function(req, res) {
  cleanup()
  res.send("OK")
})

app.get('/channels/:channelId', function(req, res) {
  let channelId = req.params.channelId
  let channel = findChannel(channelId)

  if (channel == undefined) {
    res.status(404)
      .send('Not found')
  } else {
    res.send(channel)
  }
})

app.get('/channels/:channelId/update', function(req, res) {
  let channelId = req.params.channelId
  let channel = findChannel(channelId)
  
  updateChannel(channel)
  res.send("OK")
})

app.use(express.static('static'))
app.set('view engine', 'pug')

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})

function cleanup(){
  console.log("Removing obsolete images")
  fs.readdir(feed.imageDownloadDir, (err, files) => {
    if (err) throw err;
    
    isImageNotInUse = file => {
      return channels.
        filter(
          c => 
            c.latest && c.latest.image && c.latest.image.includes(file)
        )
        .length == 0
    }
    
    files
     .filter(
       isImageNotInUse
     )
    .forEach(
      file => {
        console.log(`Deleting ${file}`)
        fs.unlink(
          path.join(feed.imageDownloadDir, file), 
          err => {
            if (err) throw err;
          }
        )
      }
    )
  });
}

var lastUpdate = moment.unix(0);
const mininumInterval = 30; // minutes

function updateAllChannels(){
  // Limit interval between updates.
  console.log("Last updated at " + lastUpdate)
  let now = moment()
  let diff = moment.duration(now.diff(lastUpdate)).asMinutes()
  if(diff < mininumInterval){
    return
  }
  lastUpdate = now;
  
  channels.forEach(
    c => {
      updateChannel(c)
    }
  )
}

function updateChannel(channel){
  feed.get(channel)
    .then(
      (body) => feed.parseXml(body)
    )
    .then(
      (feedResponse) => {
        channel.latest = feedResponse
      }
    )
}
