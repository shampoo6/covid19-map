const worldJson = require('../world.json')
const axios = require('axios')
const qs = require('querystring')
const encodeSN = require('./snTool.js')
const fs = require('fs')
const path = require('path')
const worldLocationJson = require('../worldLocation.json')

const requestDelay = 3000

let ak = 'nP44fSj77nWphy5nIft2oBk7teUcwmGn'
let countries = worldJson.data
let length = countries.length
let index = 0
let worldLocation = Object.assign({}, worldLocationJson)

let p = new Promise(resolve => {
    requestLocation(index, resolve)
})

p.then(() => {

    fs.writeFile(path.join(__dirname, '../worldLocation.json'), JSON.stringify(worldLocation), err => {
        if (err) console.error(err)
        console.log(worldLocation)
        console.log('over')
    })

})

function requestLocation(index, resolve) {
    let countryName = countries[index].name

    // 判断 国家是否已经存在了
    if (worldLocation[countryName]) {
        index++
        if (index < length) {
            requestLocation(index, resolve)
        } else {
            resolve()
        }
        return
    }

    let params = {
        query: countryName,
        region: countryName,
        output: 'json',
        ak
    }

    let sn = encodeSN('/place_abroad/v1/search?', params)
    params.sn = sn
    let paramsQS = qs.stringify(params)
    axios.get(`http://api.map.baidu.com/place_abroad/v1/search?${paramsQS}`).then(function (result) {
        let location = undefined
        try {
            location = result.data.results[0].location
            worldLocation[countries[index].name] = location
            console.log(location)
        } catch (e) {
            console.warn(`名称为：${countries[index].name} 的国家报错了`)
            console.error(e)
        }
        index++
        if (index < length) {
            setTimeout(() => {
                requestLocation(index, resolve)
            }, requestDelay)
        } else
            resolve()
    })
}