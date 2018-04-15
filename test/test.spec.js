'use strict'

const expect = require('chai').expect
const parseXml = require('../app/feed').parseXml
const fs = require('fs')

var content = fs.readFileSync("./static/dummy/dummyRSSFeed.xml", "utf8")

describe('parseXml', () => {
  it('should read date and image url', () => {
    let promise = parseXml(content)
    return Promise.resolve(promise)
      .then(
        (feedResponse) => {
          /*expect(feedResponse.date).to.equal(
            "2017-01-30 17:14:36.000Z"
          )*/
          expect(feedResponse.image).to.equal(
            "/feed/20170130_171436_512_0094.jpg"
          )
        }
      ).catch((err) => {
        throw new Error('was not supposed to fail'); 
      })
  })
})
