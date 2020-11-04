const axios = require('axios')
const qs = require('querystring')
const encodeSN = require('./snTool.js')

let params = {
    query: '俄罗斯',
    region: '俄罗斯',
    output: 'json',
    ak: 'v3ejsNZh5mOwmjTt4lgXKeh7xpgG4UmK'
}

let sn = encodeSN('/place_abroad/v1/search?', params)
params.sn = sn

let paramsQS = qs.stringify(params)

axios.get(`http://api.map.baidu.com/place_abroad/v1/search?${paramsQS}`).then(result => {
    let data = result.data.results[0]
    let _params = {
        location: data.location.lat + ',' + data.location.lng,
        output: 'json',
        ak: params.ak,
    }

    let _sn = encodeSN('/reverse_geocoding/v3/?', _params)
    _params.sn = _sn

    axios.get(`http://api.map.baidu.com/reverse_geocoding/v3/?${qs.stringify(_params)}`).then(result => {
        console.log(result.data)
    })
})