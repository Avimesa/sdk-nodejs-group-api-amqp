/*
 * COPYRIGHT: This file and the source codes contained herein ("document") are
 * the property of Avimesa, Inc.  Copyright 2016-2018, Avimesa, Inc.
 *
 * LICENSE:  Avimesa, Inc. grants the RECIPIENT a worldwide, royalty free,
 * limited license to use the source codes in this document as specified
 * in the Avimesa Open License:  http://avimesa.com/openlicense.txt
 */

'use strict';

const models = require('./models');
const rmq = require('./rmq');
const utils = require('./utils');


 function processRespCmd(cb, err, cmd){
	if(err){
		cb(true);
		return false;
	}
	else if (cmd.response.error){
		cb(true, cmd.response.message);
		return false;
	}
	return true;
}

/**
 * List Devices
 *
 * Sends a command 1002 to list the device(s) for the group
 *
 * @param {Function} cb(err, devices): called on response
 *
 * @return none
 */
function listDevices(cb) {
	rmq.sendAdminCmd(models.cmd1002(), function (err, cmd1003) {
		if (processRespCmd(cb, err, cmd1003)){
			cb(false, cmd1003.response.message.devices);
		}
	});
}

/**
 * Add Device
 *
 * Sends a command 1004 to Add a Device to the group
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 * @param {Function} cb(err, authKey): called on response
 *
 * @return none
 */
function addDevice(devId, cb){
	if (!utils.validDeviceId(devId)){
		cb(true, 'Invalid device ID');
		return;
	}

	rmq.sendAdminCmd(models.cmd1004(devId), function (err, cmd1005) {
		if (processRespCmd(cb, err, cmd1005)){
			cb(false, cmd1005.response.message.auth_key);
		}
	});
}

/**
 * Upload Device Configuration
 *
 * Sends a command 1012 to remove a Device from the Group
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 * @param {Function} cb(err, message): called on response
 *
 * @return none
 */
function removeDevice(devId, cb){
	rmq.sendAdminCmd(models.cmd1012(devId), function (err, cmd1013) {
		if (processRespCmd(cb, err, cmd1013)){
			cb(false, "");
		}
	});
}

function actuate(devId, cmd, cb) {
	rmq.sendActuationCmd(devId, cmd, function (err, msg) {
		cb(err, msg);
	});
}


/**
 * List Files
 *
 * Sends a command 1006 to list a Device's files
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 * @param {Function} cb(err, files): called on response
 *
 * @return none
 */
function listFiles(devId, cb){
	rmq.sendAdminCmd(models.cmd1006(devId), function (err, cmd1007) {
		if (processRespCmd(cb, err, cmd1007)){
			cb(false, cmd1007.response.message.files);
		}
	});
}

/**
 * Upload Device Driver Script
 *
 * Sends a command 1008 to upload a Device Driver Script for a device
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 * @param {String} fileBuf: buffer holding the file to upload
 * @param {Function} cb(err, msg): called on response
 *
 * @return none
 */
function uploadScript(devId, fileBuf, cb){
	rmq.sendAdminCmd(models.cmd1008(devId, fileBuf), function (err, cmd1009) {
		if (processRespCmd(cb, err, cmd1009)){
			cb(false, "");
		}
	});
}

/**
 * Upload Device Configuration
 *
 * Sends a command 1010 to upload a Device Configuration for a device
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 * @param {Buffer} fileBuf:  buffer holding the file to upload
 * @param {Function} cb(err, msg): called on response
 *
 * @return none
 */
function uploadConfig(devId, fileBuf, cb){
	rmq.sendAdminCmd(models.cmd1010(devId, fileBuf), function (err, cmd1011) {
		if (processRespCmd(cb, err, cmd1011)){
			cb(false, "");
		}
	});
}

/**
 * Upload DFU Package
 *
 * Sends a command 1020 to upload a DFU Package for a device
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 * @param {String} fileBuf: buffer holding the file to upload
 * @param {Function} cb(err, msg): called on response
 *
 * @return none
 */
function uploadDfuPackage(devId, fileBuf, cb){
	rmq.sendAdminCmd(models.cmd1020(devId, fileBuf), function (err, cmd1021) {
		if (processRespCmd(cb, err, cmd1021)){
			cb(false, "");
		}
	});
}

/**
 * Update Auth Key
 *
 * Sends a command 1014 to update a Device's Authentication Key
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 * @param {Function} cb(err, authKey): called on response
 *
 * @return none
 */
function updateAuthKey(devId, cb){
	rmq.sendAdminCmd(models.cmd1014(devId), function (err, cmd1015) {
		if (processRespCmd(cb, err, cmd1015)){
			cb(false, cmd1015.response.message.auth_key);
		}
	});
}

/**
 * consume
 *
 * Creates an exclusive subscription to a durable queue.
 *
 * Will consume any pending messages in the queue on connection.
 *
 * @param {String} queue: name of queue
 * @param {Function} cb(err, msg, ack): called on response (ack is itself a callback)
 *
 * @return none
 */
function consume(queue, cb){
	rmq.exclusiveSubscribe(queue, cb);
}

/**
 * listen
 *
 * Listens to messages from an exchange with given key
 *
 * @param {String} exchange: name of exchange
 * @param {String} key: name of routing key
 * @param {Function} cb(err, msg): called on response
 *
 * @return none
 */
function listen(exchange, key, cb){
	rmq.subscribe(exchange, key, cb);
}

/**
 * count
 *
 * Gets a count of messages in a queue
 *
 * @param {String} queue: name of queue
 * @param {Function} cb(err, count): called on response
 *
 * @return none
 */
function count(queue, cb){
	rmq.messageCount(queue, cb);
}

/**
 * purge
 *
 * Purges the message in a queue
 *
 * @param {String} queue: name of queue
 * @param {Function} cb(err, count): called on response
 *
 * @return none
 */
function purge(queue, cb){
	rmq.purgeQueue(queue, cb);
}


module.exports.listDevices = listDevices;
module.exports.addDevice = addDevice;
module.exports.removeDevice = removeDevice;
module.exports.actuate = actuate;
module.exports.listFiles = listFiles;
module.exports.uploadScript = uploadScript;
module.exports.uploadConfig = uploadConfig;
module.exports.uploadDfuPackage = uploadDfuPackage;
module.exports.updateAuthKey = updateAuthKey;
module.exports.consume = consume;
module.exports.listen = listen;
module.exports.count = count;
module.exports.purge = purge;