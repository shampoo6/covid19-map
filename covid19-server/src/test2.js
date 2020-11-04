const qs = require('querystring')
const md5 = require('crypto-js/md5')

let sk = 'jRL4zEWI1hGMi0ruPImfBDzkqt1ZGBss'

let params = {
    address: '日本',
    output: 'json',
    ak: 'v3ejsNZh5mOwmjTt4lgXKeh7xpgG4UmK'
}

let paramsStr = qs.stringify(params)

let wholeStr = '/geocoding/v3/?' + paramsStr + sk

// String tempStr = URLEncoder.encode(wholeStr, "UTF-8");

console.log(wholeStr)

// /geocoding/v3/?address=%E6%97%A5%E6%9C%AC&output=json&ak=v3ejsNZh5mOwmjTt4lgXKeh7xpgG4UmKjRL4zEWI1hGMi0ruPImfBDzkqt1ZGBss
// /geocoding/v3/?address=%E6%97%A5%E6%9C%AC&output=json&ak=v3ejsNZh5mOwmjTt4lgXKeh7xpgG4UmKjRL4zEWI1hGMi0ruPImfBDzkqt1ZGBss

let tempStr = escape(wholeStr)

tempStr = tempStr.replace(/\//g, '%2F')

// %2Fgeocoding%2Fv3%2F%3Faddress%3D%25E6%2597%25A5%25E6%259C%25AC%26output%3Djson%26ak%3Dv3ejsNZh5mOwmjTt4lgXKeh7xpgG4UmKjRL4zEWI1hGMi0ruPImfBDzkqt1ZGBss
// %2Fgeocoding%2Fv3%2F%3Faddress%3D%25E6%2597%25A5%25E6%259C%25AC%26output%3Djson%26ak%3Dv3ejsNZh5mOwmjTt4lgXKeh7xpgG4UmKjRL4zEWI1hGMi0ruPImfBDzkqt1ZGBss

console.log(tempStr)

let result = md5(tempStr).toString()
console.log(result)

// 6c2c4dc1636bf91a8c92134211dac535
// 6c2c4dc1636bf91a8c92134211dac535