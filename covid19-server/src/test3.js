const worldLocation = require('../worldLocation.json')
const world = require('../world.json')

let list = []
for (let item of world.data) {
    if (!worldLocation[item.name]) {
        list.push(item.name)
    }
}

console.log(list)