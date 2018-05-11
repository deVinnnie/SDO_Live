const express = require('express')
const channels = require('./channels').channels
const feed = require('./feed')
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const channelEndpoint = require('./channelEndpoint')

const app = express()

// -------------------------------------------------------------------
// Main View
// -------------------------------------------------------------------
app.get('/', (req, res) => {
  res.render('index', {})
})

// -------------------------------------------------------------------
// Channels
// -------------------------------------------------------------------
app.get('/channels/', channelEndpoint.getChannels)
app.get('/channels/:channelId', channelEndpoint.getChannel)
app.get('/channels/:channelId/update', channelEndpoint.updateChannel)

// -------------------------------------------------------------------
// Actions
// -------------------------------------------------------------------
app.get('/actions/update', (req, res) => {
  cleanup()
  updateAllChannels()
  res.send("OK")
})

app.get('/actions/clear', (req, res) => {
  cleanup()
  res.send("OK")
})

app.use(express.static('static'))
app.use(express.static('dist'))
app.set('view engine', 'pug')

app.listen(3000, () => {
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
      c.update()
    }
  )
}

// -------------------------------------------------------------------
// Initialize Stuff
// -------------------------------------------------------------------
var lastUpdate = moment.unix(0);
const mininumInterval = 30; // minutes
updateAllChannels()
