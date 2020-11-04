const express = require('express')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const codes = require('../codes.json')
const worldLocation = require('../worldLocation.json')

const app = express()
const port = 1024

// todo 记得把 中国香港 改成 香港特别行政区
// todo 记得把 中国澳门 改成 澳门特别行政区
// todo 记得把 中国台湾 改成 台湾省

// 阿里云全国疫情接口
const config = {
    url: 'https://ncovdata.market.alicloudapi.com/ncov/cityDiseaseInfoWithTrend',
    appCode: '5375aa41e7f84f3580becc17986baa40',
    appKey: '203872897',
    appSecret: '4AXzzgtlHMCjZHtPH2Du6XcHKrKQcPnX'
}

app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    // Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Methods', '*')
    next()
})

app.use('/', express.static(path.join(__dirname, '../dist')))

// 更新国内疫情数据
app.get('/updateOrigin', (req, res) => {
    updateChina().then(chinaData => {
        return updateWorld(chinaData)
    }).then(() => {
        res.json({success: true})
    }).catch(reason => {
        console.error(reason)
        res.json({success: false, message: reason.message})
    })
})

app.get('/getCovid19Data', (req, res) => {
    readFile(path.join(__dirname, '../data.json')).then(dataStr => {
        let data = JSON.parse(dataStr)
        data.provinceArray.forEach(province => {
            if (province['childStatistic'] === '中国香港')
                province['childStatistic'] = '香港特别行政区'
            else if (province['childStatistic'] === '中国澳门')
                province['childStatistic'] = '澳门特别行政区'
            else if (province['childStatistic'] === '中国台湾')
                province['childStatistic'] = '台湾省'
        })

        res.json({
            success: true,
            message: '操作成功',
            data: data
        })
    }).catch(reason => {
        console.error(reason)
        res.json({
            success: false,
            message: reason.message
        })
    })
})

app.get('/getGeoJson', (req, res) => {
    readFile(path.join(__dirname, '../geoJson.json')).then(dataStr => {
        res.json({
            success: true,
            message: '操作成功',
            data: JSON.parse(dataStr)
        })
    }).catch(reason => {
        console.error(reason)
        res.json({
            success: false,
            message: reason.message
        })
    })
})

app.get('/worldCovid19Data', (req, res) => {
    readFile(path.join(__dirname, '../world.json')).then(dataStr => {
        let data = JSON.parse(dataStr)
        res.json({
            success: true,
            message: '操作成功',
            data: data
        })
    }).catch(reason => {
        console.error(reason)
        res.json({
            success: false,
            message: reason.message
        })
    })
})

app.get('/getWorldGeoJson', (req, res) => {
    readFile(path.join(__dirname, '../worldGeo.json')).then(dataStr => {
        res.json({
            success: true,
            message: '操作成功',
            data: JSON.parse(dataStr)
        })
    }).catch(reason => {
        console.error(reason)
        res.json({
            success: false,
            message: reason.message
        })
    })
})

app.listen(port, () => {
    console.log(`server start on: http://127.0.0.1:${port}`)
})

// 更新国内数据
function updateChina() {
    return new Promise((resolve, reject) => {
        axios.get(config.url, {headers: {authorization: `APPCODE ${config.appCode}`}}).then(result => {
            // 如果阿里云接口返回的是文本或页面信息，说明请求忙
            if (result.headers['content-type'].startsWith('text/html')) {
                reject(new Error('阿里接口繁忙'))
            } else {
                writeCovid19Data(result.data).then(() => {
                    return writeGeoJson(result.data)
                }).then(() => {
                    resolve(result.data)
                }).catch(reason => {
                    reject(reason)
                })
            }
        })
    })
}

// 更新全球疫情数据
function updateWorld(chinaData) {
    return new Promise((resolve, reject) => {
        axios.get('https://api.inews.qq.com/newsqa/v1/automation/foreign/country/ranklist').then(result => {

            let countryData = chinaData.country
            result.data.data.push({
                'name': '中国',
                'confirm': countryData.totalConfirmed,
                'dead': countryData.totalDeath,
                'heal': countryData.totalCured
            })

            fs.writeFile(path.join(__dirname, '../world.json'), JSON.stringify(result.data), err => {
                if (err) reject(err)
                else {
                    writeWorldGeoJson(result.data.data).then(() => {
                        resolve()
                    })
                }
            })
        })
    })
}

function writeCovid19Data(data) {
    return new Promise((resolve, reject) => {
        let writePath = path.join(__dirname, '../data.json')
        fs.writeFile(writePath, JSON.stringify(data), err => {
            if (err) {
                console.error(err)
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

function writeGeoJson(data) {
    return new Promise((resolve, reject) => {
        let geoJson = {
            'type': 'FeatureCollection',
            'crs': {
                'type': 'name',
                'properties': {
                    'name': 'urn:ogc:def:crs:OGC:1.3:CRS84'
                }
            },
            'features': []
        }
        data['provinceArray'].forEach(province => {
            if (!codes[province['childStatistic']]) {
                console.log('')
            }
            geoJson.features.push({
                'type': 'Feature',
                'properties': province,
                'geometry': {
                    'type': 'Point',
                    'coordinates': codes[province['childStatistic']]['coordinates']
                }
            })
        })
        fs.writeFile(path.join(__dirname, '../geoJson.json'), JSON.stringify(geoJson), err => {
            if (err) reject(err)
            else resolve()
        })
    })
}

function writeWorldGeoJson(countries) {
    return new Promise((resolve, reject) => {
        let geoJson = {
            'type': 'FeatureCollection',
            'crs': {
                'type': 'name',
                'properties': {
                    'name': 'urn:ogc:def:crs:OGC:1.3:CRS84'
                }
            },
            'features': []
        }
        countries.forEach(country => {
            let location = worldLocation[country.name]
            if (location) {
                geoJson.features.push({
                    'type': 'Feature',
                    'properties': country,
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [location.lng, location.lat]
                    }
                })
            }
        })

        fs.writeFile(path.join(__dirname, '../worldGeo.json'), JSON.stringify(geoJson), err => {
            if (err) {
                console.error(err)
                reject(err)
            } else resolve()
        })
    })
}

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) reject(err)
            else resolve(data.toString())
        })
    })
}
