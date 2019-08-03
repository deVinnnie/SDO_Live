'use strict'

const assert = require('chai').assert
const parseXml = require('../app/feed').parseXml
const fs = require('fs')

var content = fs.readFileSync("./static/dummy/dummyRSSFeed.xml", "utf8")

describe('parseXml', () => {
  it('should read date and image url', () => {
    let promise = parseXml(content)
    return Promise.resolve(promise)
      .then(
        (feedResponse) => {
          assert.equal(
            feedResponse.date.getTime(),
            (new Date("Mon, 30 Jan 2017 17:14:36 GMT")).getTime()
          )
          
          assert.equal(
            feedResponse.image,
            "/feed/20170130_171436_1024_0094.jpg"
          )
        }
      )
  })
})
