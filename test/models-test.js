var assert = require('assert');
var path = require('path');
var process = require('process');
var api = require('../lib/models');

describe('models', function() {

	describe('#getRequestId()', function() {
		it('should return a request ID', function() {
			const id = api.getRequestId();
			assert.notEqual(id, 0);
		});
	});

	describe('#cmd1002()', function() {
		it('should return a cmd1002', function() {
			const cmd = api.cmd1002();
			assert.equal(cmd.cmd_id, 1002);
			assert.notEqual(cmd.req_id, 0);
		});
	});

	describe('#cmd1004()', function() {
		it('should return a cmd1004', function() {
			const devId = '00000000000000000000000000000000';
			const cmd = api.cmd1004(devId);
			assert.equal(cmd.cmd_id, 1004);
			assert.notEqual(cmd.req_id, 0);
			assert.equal(cmd.dev_id, devId);
		});
	});

	describe('#cmd1006()', function() {
		it('should return a cmd1006', function() {
			const devId = '00000000000000000000000000000000';
			const cmd = api.cmd1006(devId);
			assert.equal(cmd.cmd_id, 1006);
			assert.notEqual(cmd.req_id, 0);
			assert.equal(cmd.dev_id, devId);
		});
	});

	describe('#cmd1008()', function() {
		it('should return a cmd1008', function() {
			const devId = '00000000000000000000000000000000';
			const filePath = path.resolve(__dirname, 'rsc/script.js');
			const cmd = api.cmd1008(devId, filePath);
			assert.equal(cmd.cmd_id, 1008);
			assert.notEqual(cmd.req_id, 0);
			assert.equal(cmd.dev_id, devId);
			assert.notEqual(cmd.file_buf, undefined);
		});
	});

	describe('#cmd1010()', function() {
		it('should return a cmd1010', function() {
			const devId = '00000000000000000000000000000000';
			const filePath = path.resolve(__dirname, 'rsc/config.json');
			const cmd = api.cmd1010(devId, filePath);
			assert.equal(cmd.cmd_id, 1010);
			assert.notEqual(cmd.req_id, 0);
			assert.equal(cmd.dev_id, devId);
			assert.notEqual(cmd.file_buf, undefined);
		});
	});

	describe('#cmd1012()', function() {
		it('should return a cmd1012', function() {
			const devId = '00000000000000000000000000000000';
			const cmd = api.cmd1012(devId);
			assert.equal(cmd.cmd_id, 1012);
			assert.notEqual(cmd.req_id, 0);
			assert.equal(cmd.dev_id, devId);
		});
	});

	describe('#cmd1014()', function() {
		it('should return a cmd1014', function() {
			const devId = '00000000000000000000000000000000';
			const cmd = api.cmd1014(devId);
			assert.equal(cmd.cmd_id, 1014);
			assert.notEqual(cmd.req_id, 0);
			assert.equal(cmd.dev_id, devId);
		});
	});

	describe('#cmd1020()', function() {
		it('should return a cmd1020', function() {
			const devId = '00000000000000000000000000000000';
			const filePath = path.resolve(__dirname, 'rsc/fw-app.dat');
			const cmd = api.cmd1020(devId, filePath);
			assert.equal(cmd.cmd_id, 1020);
			assert.notEqual(cmd.req_id, 0);
			assert.equal(cmd.dev_id, devId);
			assert.notEqual(cmd.file_buf, undefined);
		});
	});
});
