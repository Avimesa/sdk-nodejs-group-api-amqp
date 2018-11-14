var assert = require('assert');
var api = require('../group-api-amqp');

describe('api', function() {
	// some commands take longer than default 2sec
	this.timeout(20000);


	describe('#listDevices()', function() {
		it('should return a response', function(done) {
			api.listDevices(function(err, devices){
				assert.equal(err, false);
				done();
			});
		});
	});


	describe('#addDevice()', function() {
		it('should return an error', function(done) {
			api.addDevice('bad id', function(err, msg){
				assert.equal(err, true);
				assert.equal(msg.response, undefined);
				done();
			});
		});
	});


	describe('#listFiles()', function() {
		it('should return error code', function(done) {
			api.listFiles('', function(err,msg){
				assert.equal(err,false);
				assert.notEqual(msg.response, null);
				assert.notEqual(msg.response.error, 1);
				done();
			});
		});
	});
});
