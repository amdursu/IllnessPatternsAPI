require('dotenv').config();
const noble = require('@abandonware/noble')
const config = require('./config');

const express = require('express'); 
const logger = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const router = express.Router();

const routes = require('./routes/index.js');

app.use(bodyParser.json()); // parse form data client

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(logger('dev'));

const db = mysql.createConnection(config.dbConfig);

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database!");
});

global.db = db;

app.use('/api', routes(router));

app.listen('3000', () => {
  console.log(`Server started at localhost:3000`);
});







// noble.on('stateChange', state => {
//   console.log(`State changed: ${state}`)
//   if (state === 'poweredOn') {
//     noble.startScanning()
//   }
// })

// noble.on('discover', async peripheral => {
//   console.log(`Found device, name: ${peripheral.address}, uuid: ${peripheral.uuid}, signal: ${peripheral.connectable}`)
//   if(peripheral.id == 'ba563e62b6174a78983de3bd0b3076f8'){
//     noble.stopScanning();
//     await peripheral.connectAsync();
//     console.log('gasit')
//     // const {characteristics} = await peripheral.discoverSomeServicesAndCharacteristicsAsync(['180f'], ['2a19']);
//     // const batteryLevel = (await characteristics[0].readAsync())[0];

//     // console.log(`${peripheral.address} (${peripheral.advertisement.localName}): ${batteryLevel}%`);
//     // await peripheral.connectAsync();
//     // peripheral.discoverServices(null, (error, services) => {
//     //   console.log(services);
//     // });
//   }
// });

module.exports = app;

// Found device, name: 8c-86-1e-ce-2b-8e, uuid: 4473b6e596a74b2089ea69b7a8c56e4d
// Found device, name: , uuid: d9c0799513944ab0bddd9557294c9881 ***
// Found device, name: , uuid: 85c91c91a4294bceb56cb1b4d541a999 ***
// Found device, name: 4d-58-2a-ef-cf-b9, uuid: 01768930051349eabed160782ea64f2d
// Found device, name: , uuid: 3f99844c54f44f00a08a6a4bc186cc0e ***
// Found device, name: , uuid: 3fd803bf27314707b9b2a65d28fccdcc ***
// Found device, name: 20-78-f0-98-07-39, uuid: 7ac65b3d4fc1466f988603f7772986b0
// Found device, name: dc-56-e7-44-60-79, uuid: 74963bb183e5427cb0b78b915b3128e5
// Found device, name: cc-b1-1a-bb-18-5d, uuid: e96c416e514745cd89340ff2d93f5710
// Found device, name: , uuid: 3f72f5b11feb4003bc0c31d42499446e ***
// Found device, name: , uuid: bf845ae0474e4c599ecbfdd012b75ee5 ***
// Found device, name: , uuid: 2be5301282444c5eb8006b545799849f ***
// Found device, name: , uuid: e9a22b4b1a904a3bad49b86d391ada96 ***
// Found device, name: , uuid: a4863b1db5bc48dd99074746031e85a3 ***
// Found device, name: , uuid: 6a892ddf28044bff8a357b5ac156e717 ***
// Found device, name: , uuid: 4e2b5caec3b242fb94675f112512add9 ***
// Found device, name: , uuid: 443aac2966e44983bff442ce55343be2 ***
// Found device, name: , uuid: bb2563bc90f841dfa0758bcd00bdd61d ***
// Found device, name: , uuid: f01a3ef9e67e4357854536b59c0a010f ***
// Found device, name: , uuid: 4e2cb66ac352452c9f50ba8e60d03372 ***
// f363803a6a3c4137af2aea39f2efbb2a