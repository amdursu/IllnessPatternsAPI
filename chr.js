var util = require('util');
const fs = require('fs');

var bleno = require('@abandonware/bleno');

var BlenoCharacteristic = bleno.Characteristic;

let receivedData;

var Chr = function() {
  Chr.super_.call(this, {
    uuid: '00001234-0000-1000-8000-00805f9b34fd',
    properties: ['read', 'write', 'notify'],
    value: null
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(Chr, BlenoCharacteristic);

Chr.prototype.onReadRequest = function(offset, callback) {
  console.log('Chr - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

Chr.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;
  let decoder = new TextDecoder();
  receivedData = decoder.decode(this._value);
  console.log('Chr - onWriteRequest: value = ' + receivedData);

  fs.writeFileSync('patientData.json', receivedData);

  if (this._updateValueCallback) {
    console.log('Chr - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

Chr.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('Chr - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

Chr.prototype.onUnsubscribe = function() {
  console.log('Chr - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = Chr;
