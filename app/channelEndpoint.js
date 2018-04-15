const channels = require('./channels').channels

/**
 * GET /channels
 */
exports.getChannels = (req, res) => {
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
};

function findChannel(id){
  return channels.filter(
    c => c.id == id
  )[0]
}
  
exports.getChannel = (req, res) => {
  let channelId = req.params.channelId
  let channel = findChannel(channelId)

  if (channel == undefined) {
    res.status(404)
      .send('Not found')
  } else {
    res.send(channel)
  }
}

exports.updateChannel = (req, res) => {
  let channelId = req.params.channelId
  let channel = findChannel(channelId)
  channel.update()
  res.send("OK")
}
