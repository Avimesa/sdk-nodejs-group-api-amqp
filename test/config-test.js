var assert = require('assert');
var config = require('../lib/config');

describe('config', function() {

	describe('#getConnParams()', function() {
		it('should load from .env file', function() {
			var param = config.getConnParams();
			assert.notEqual(param, null);
		});
	});

	describe('#setConnParams()', function() {
		it('should update params from input', function() {

			var params1 = {
				hostname: 'hello',
				port: 1234,
				vhost: 'goodbye',
				username: 'jackie',
				password: 'chan',
			};
			config.setConnParams(params1);

			var params2 = config.getConnParams();
			assert.notEqual(params2, null);

			assert.equal(params2.hostname, params1.hostname);
			assert.equal(params2.port, params1.port);
			assert.equal(params2.vhost, params1.vhost);
			assert.equal(params2.username, params1.username);
			assert.equal(params2.password, params1.password);
		});
	});
});
