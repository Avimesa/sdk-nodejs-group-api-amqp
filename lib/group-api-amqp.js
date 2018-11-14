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


exports.processRespCmd = function(cb, err, cmd){
	if(err){
		cb(true);
		return false;
	}
	else if (cmd.response.error){
		cb(true, cmd.response.message);
		return false;
	}
	return true;
};

/**
 * List Devices
 *
 * Sends a command 1002 to list the device(s) for the group
 *
 * @param {Function} cb(err, devices): called on response
 *
 * @return none
 */
exports.listDevices = function(cb) {
	rmq.sendAdminCmd(models.cmd1002(), function (err, cmd1003) {
		if (this.processRespCmd(cb, err, cmd1003)){
			cb(false, cmd1003.response.message.devices);
		}
	});
};

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
exports.addDevice = function(devId, cb){
	if (!utils.validDeviceId(devId)){
		cb(true, 'Invalid device ID');
		return;
	}

	rmq.sendAdminCmd(models.cmd1004(devId), function (err, cmd1005) {
		if (this.processRespCmd(cb, err, cmd1005)){
			cb(false, cmd1005.response.message.auth_key);
		}
	});
};

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
exports.listFiles = function(devId, cb){
	rmq.sendAdminCmd(models.cmd1006(devId), function (err, cmd1007) {
		if (this.processRespCmd(cb, err, cmd1007)){
			cb(false, cmd1007.response.message.files);
		}
	});
};

/**
 * Upload Device Driver Script
 *
 * Sends a command 1008 to upload a Device Driver Script for a device
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 * @param {String} path: path to the file to upload
 * @param {Function} cb(err, message): called on response
 *
 * @return none
 */
exports.uploadScript = function(devId, path, cb){
	rmq.sendAdminCmd(models.cmd1008(devId, path), function (err, cmd1009) {
		if (this.processRespCmd(cb, err, cmd1009)){
			cb(false, "");
		}
	});
};

/**
 * Upload Device Configuration
 *
 * Sends a command 1010 to upload a Device Configuration for a device
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 * @param {String} path: path to the file to upload
 * @param {Function} cb(err, message): called on response
 *
 * @return none
 */
exports.uploadConfig = function(devId, path, cb){
	rmq.sendAdminCmd(models.cmd1010(devId, path), function (err, cmd1011) {
		if (this.processRespCmd(cb, err, cmd1011)){
			cb(false, "");
		}
	});
};

/**
 * Upload DFU Package
 *
 * Sends a command 1020 to upload a DFU Package for a device
 *
 * @param {String} devId: device ID, 32 char, UUID, no hyphens
 * @param {String} path: path to the file to upload
 * @param {Function} cb(err, message): called on response
 *
 * @return none
 */
exports.uploadDfuPackage = function(devId, path, cb){
	rmq.sendAdminCmd(models.cmd1020(devId, path), function (err, cmd1021) {
		if (this.processRespCmd(cb, err, cmd1021)){
			cb(false, "");
		}
	});
};

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
exports.updateAuthKey = function(devId, cb){
	rmq.sendAdminCmd(models.cmd1014(devId), function (err, cmd1015) {
		if (this.processRespCmd(cb, err, cmd1015)){
			cb(false, cmd1015.response.message.auth_key);
		}
	});
};

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
exports.removeDevice = function(devId, cb){
	rmq.sendAdminCmd(models.cmd1012(devId), function (err, cmd1013) {
		if (this.processRespCmd(cb, err, cmd1013)){
			cb(false, "");
		}
	});
};
