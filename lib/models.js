/*
 * COPYRIGHT: This file and the source codes contained herein ("document") are
 * the property of Avimesa, Inc.  Copyright 2016-2018, Avimesa, Inc.
 *
 * LICENSE:  Avimesa, Inc. grants the RECIPIENT a worldwide, royalty free,
 * limited license to use the source codes in this document as specified
 * in the Avimesa Open License:  http://avimesa.com/openlicense.txt
 */

'use strict';

const API_MAJ = 0;
const API_MIN = 11;


exports.getRequestId = function(){
	// 'random' 32 bit value
	return Math.round(Math.random() * (0xFFFFFFFF));
};

exports.cmd1002 = function () {
	return {
		"api_maj": API_MAJ,
		"api_min": API_MIN,
		"cmd_id": 1002,
		"req_id": this.getRequestId()
	};
};

exports.cmd1004 = function(devId) {
	return {
		"api_maj": API_MAJ,
		"api_min": API_MIN,
		"cmd_id": 1004,
		"req_id": this.getRequestId(),
		"dev_id": devId
	};
};

exports.cmd1006 = function(devId) {
	return {
		"api_maj": API_MAJ,
		"api_min": API_MIN,
		"cmd_id": 1006,
		"req_id": this.getRequestId(),
		"dev_id": devId
	};
};

exports.cmd1008 = function(devId, fileBuf) {
	return {
		"api_maj": API_MAJ,
		"api_min": API_MIN,
		"cmd_id": 1008,
		"req_id": this.getRequestId(),
		"dev_id": devId,
		"file_buf": fileBuf.toString('base64')
	};
};

exports.cmd1010 = function(devId, fileBuf) {
	return {
		"api_maj": API_MAJ,
		"api_min": API_MIN,
		"cmd_id": 1010,
		"req_id": this.getRequestId(),
		"dev_id": devId,
		"file_buf": fileBuf.toString('base64')
	};
};

exports.cmd1012 = function(devId) {
	return {
		"api_maj": API_MAJ,
		"api_min": API_MIN,
		"cmd_id": 1012,
		"req_id": this.getRequestId(),
		"dev_id": devId
	};
};

exports.cmd1014 = function(devId) {
	return {
		"api_maj": API_MAJ,
		"api_min": API_MIN,
		"cmd_id": 1014,
		"req_id": this.getRequestId(),
		"dev_id": devId
	};
};

exports.cmd1020 = function(devId, fileBuf) {
	return {
		"api_maj": API_MAJ,
		"api_min": API_MIN,
		"cmd_id": 1020,
		"req_id": this.getRequestId(),
		"dev_id": devId,
		"file_buf": fileBuf.toString('base64')
	};
};
