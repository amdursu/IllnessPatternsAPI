require('dotenv').config();

const fs = require('fs');
const watch = require('node-watch');
const config = require('./config');
const bleno = require('@abandonware/bleno');
var Chr = require('./chr');
var PrimaryService = bleno.PrimaryService;

const express = require('express'); 
const logger = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const insertPatientData = require('./controllers/bluetooth').insertPatientData;

const app = express();
const router = express.Router();

const routes = require('./routes/index.js');

app.use(bodyParser.json());

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

var pS = new PrimaryService({
	uuid: '00001234-0000-1000-8000-00805f9b34fb',
	characteristics: [
		new Chr()
	]
});

var services = [pS];

bleno.setServices(services);

bleno.on('stateChange', function(state) {
    console.log('on stateChange: ' + state);
    if (state === 'poweredOn') {
      bleno.startAdvertising('RPI', ['00001234-0000-1000-8000-00805f9b34fb']);
    } else {
      bleno.stopAdvertising();
    }
});

watch('patientData.json', function(event, filename) {
  let data = fs.readFileSync(filename);
  if(data != ''){
    let patientData = JSON.parse(data);
    insertPatientData(patientData);
    fs.writeFileSync(filename, '');
  }

})


module.exports = app;
