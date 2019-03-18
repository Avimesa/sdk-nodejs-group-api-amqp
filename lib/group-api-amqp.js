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

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -

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

function _listDevices(){
	return new Promise(resolve => {
		listDevices((err,devices) =>{
			resolve({err,devices});
		});
	});
}

/**
 * List Devices Async
 *
 * Sends a command 1002 to list the groups devices(s) for the Device Cloud Groups
 *
 * @return command 1003 response {err,devices}
 */
async function listDevicesAsync(){
	return await _listDevices();
}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -

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

function _addDevice(devId){
	return new Promise(resolve => {
		addDevice(devId,(err,authKey) =>{
			resolve({err,authKey});
		});
	});
}

/**
 * Add Device Async
 *
 * Sends a command 1004 to Add a Device to the group
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 *
 * @return command 1005 response {err,authKey}
 */
async function addDeviceAsync(devId){
	return await _addDevice(devId);
}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -

/**
 * Remove a Device
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

function _removeDevice(devId){
	return new Promise(resolve => {
		removeDevice(devId,(err,msg) =>{
			resolve({err,msg});
		});
	});
}

/**
 * Remove Device Async
 *
 * Sends a command 1012 to remove a Device from the Group
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 *
 * @return command 1013 response {err,msg}
 */
async function removeDeviceAsync(devId){
	return await _removeDevice(devId);
}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -

/**
 * Actuate a Device
 *
 * Sends a command to a device's actuation queue
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 * @param {String} cmd: JSON command
 * @param {Function} cb(err, message): called on response
 *
 * @return none
 */
function actuate(devId, cmd, cb) {
	rmq.sendActuationCmd(devId, cmd, function (err, msg) {
		cb(err, msg);
	});
}

function _actuate(devId, cmd){
	return new Promise(resolve => {
		actuate(devId, cmd,(err,msg) =>{
			resolve({err,msg});
		});
	});
}

/**
 * Actuate Device Async
 *
 * Sends a command to a device's actuation queue
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 * @param {String} cmd: JSON command
 *
 * @return command 1013 response {err,msg}
 */
async function actuateAsync(devId, cmd){
	return await _actuate(devId, cmd);
}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -

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

function _listFiles(devId){
	return new Promise(resolve => {
		listFiles(devId,(err,files) =>{
			resolve({err,files});
		});
	});
}

/**
 * List Files Async
 *
 * Sends a command 1006 to list a Device's files
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 *
 * @return command 1007 response {err,files}
 */
async function listFilesAsync(devId){
	return await _listFiles(devId);
}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -

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

function _uploadScript(devId, fileBuf){
	return new Promise(resolve => {
		uploadScript(devId, fileBuf, (err,msg) =>{
			resolve({err,msg});
		});
	});
}

/**
 * Upload Device Driver Script Async
 *
 * Sends a command 1008 to upload a Device Driver Script for a device
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 * @param {String} fileBuf: buffer holding the file to upload
 *
 * @return command 1009 response {err,msg}
 */
async function uploadScriptAsync(devId, fileBuf){
	return await _uploadScript(devId, fileBuf);
}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -

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

function _uploadConfig(devId, fileBuf){
	return new Promise(resolve => {
		uploadConfig(devId, fileBuf, (err,msg) =>{
			resolve({err,msg});
		});
	});
}

/**
 * Upload Device Driver Script Async
 *
 * Sends a command 1010 to upload a Device Driver Configuration for a device
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 * @param {String} fileBuf: buffer holding the file to upload
 *
 * @return command 1011 response {err,msg}
 */
async function uploadConfigAsync(devId, fileBuf){
	return await _uploadConfig(devId, fileBuf);
}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -

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

function _uploadDfuPackage(devId, fileBuf){
	return new Promise(resolve => {
		uploadDfuPackage(devId, fileBuf, (err,msg) =>{
			resolve({err,msg});
		});
	});
}

/**
 * Upload DFU Package Async
 *
 * Sends a command 1020 to upload a DFU Package for a device
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 * @param {String} fileBuf: buffer holding the file to upload
 *
 * @return command 1021 response {err,msg}
 */
async function uploadDfuPackageAsync(devId, fileBuf){
	return await _uploadDfuPackage(devId, fileBuf);
}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -

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

function _updateAuthKey(devId){
	return new Promise(resolve => {
		updateAuthKey(devId,(err,authKey) =>{
			resolve({err,authKey});
		});
	});
}

/**
 * Update Auth Key Async
 *
 * Sends a command 1014 to update a Device's Authentication Key
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 *
 * @return command 1015 response {err,autKey}
 */
async function updateAuthKeyAsync(devId){
	return await _updateAuthKey(devId);
}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -

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

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -

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

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -

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

function _count(queue){
	return new Promise(resolve => {
		count(queue,(err,count) =>{
			resolve({err,count});
		});
	});
}

/**
 * count async
 *
 * Gets a count of messages in a queue
 *
 * @param {String} queue: name of queue
 *
 * @return response {err,count}
 */
async function countAsync(queue){
	return await _count(queue);
}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -


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

function _purge(queue){
	return new Promise(resolve => {
		purge(queue,(err,count) =>{
			resolve({err,count});
		});
	});
}

/**
 * purge async
 *
 * Purges the message in a queue
 *
 * @param {String} queue: name of queue
 *
 * @return response {err,count}
 */
async function purgeAsync(queue){
	return await _purge(queue);
}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -


module.exports.listDevices = listDevices;
module.exports.listDevicesAsync = listDevicesAsync;
module.exports.addDevice = addDevice;
module.exports.addDeviceAsync = addDeviceAsync;
module.exports.removeDevice = removeDevice;
module.exports.removeDeviceAsync = removeDeviceAsync;
module.exports.actuate = actuate;
module.exports.actuateAsync = actuateAsync;
module.exports.listFiles = listFiles;
module.exports.listFilesAsync = listFilesAsync;
module.exports.uploadScript = uploadScript;
module.exports.uploadScriptAsync = uploadScriptAsync;
module.exports.uploadConfig = uploadConfig;
module.exports.uploadConfigAsync = uploadConfigAsync;
module.exports.uploadDfuPackage = uploadDfuPackage;
module.exports.uploadDfuPackageAsync = uploadDfuPackageAsync;
module.exports.updateAuthKey = updateAuthKey;
module.exports.updateAuthKeyAsync = updateAuthKeyAsync;
module.exports.consume = consume;
module.exports.listen = listen;
module.exports.count = count;
module.exports.countAsync = countAsync;
module.exports.purge = purge;
module.exports.purgeAsync = purgeAsync;
