var fs = require('fs');

var municipalities = [
    'Deçan', 'Dragash', 'Ferizaj', 'Fushë Kosovë', 'Gjakovë', 'Gjilan', 'Gllogoc', 'Graçanicë', 'Hani i Elezit', 'Istog', 'Junik', 'Kamenicë', 'Kaçanik', 'Klinë', 'Kllokot', 'Leposaviq', 'Lipjan', 'Malishevë', 'Mamushë', 'Mitrovicë', 'Novobërdë', 'Obiliq', 'Partesh', 'Pejë', 'Podujevë', 'Prishtinë', 'Prizren', 'Rahovec', 'Ranillugë', 'Shtime', 'Shtërpcë', 'Skënderaj', 'Suhareka', 'Viti', 'Vushtrri', 'Zubin Potok', 'Zveçan'
]

if(!fs.existsSync('./public/uploads')) {
    fs.mkdirSync('./public/uploads')
    console.log('Create dir: ./public/uploads')
}
var path = './public/uploads/'

for(var i = 0; i < municipalities.length; i++) {
    if(!fs.existsSync(path + municipalities[i])) {
        fs.mkdirSync(path + municipalities[i])
        console.log('Create dir: ' + path + municipalities[i])
    }
}

console.log('Directories created succesfuly')

