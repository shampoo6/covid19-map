const qs = require('querystring')
const md5 = require('crypto-js/md5')

const sk = '0zfz9tysYSNaR9P42Ijlh3IYTM19QqHV'

const encodeSN = function (urlPrefix, params) {
    let paramsStr = qs.stringify(params)
    let wholeStr = urlPrefix + paramsStr + sk
    let tempStr = escape(wholeStr)
    tempStr = tempStr.replace(/\//g, '%2F')
    return md5(tempStr).toString()
}

module.exports = encodeSN