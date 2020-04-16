const noble = require('@abandonware/noble');
const BeaconScanner = require("node-beacon-scanner");

var scanner = new BeaconScanner();

// scanner.onadvertisement = (advertisement) => {
//     var beacon = advertisement["iBeacon"];
//     beacon.rssi = advertisement["rssi"];
//     console.log(JSON.stringify(beacon, null, "    "))
// };
  
// scanner.startScan().then(() => {
//     console.log("Scanning for BLE devices...");
// }).catch((error) => {
//     console.error(error);
// });

console.log('PORNIT');

noble.on('stateChange', state => {
  console.log(`State changed: ${state}`)
  if (state === 'poweredOn') {
    noble.startScanning()
  }
})

noble.on('discover', peripheral => {
    console.log(`Found device, MAC: ${peripheral.address}, UUID: ${peripheral.uuid}`)
    if(peripheral.address == '98:01:a7:b6:47:a8'){
        console.log('Andrei MBP')
    }
        
});