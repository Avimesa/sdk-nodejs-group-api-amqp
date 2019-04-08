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
		it('should use default params and input', function() {

			let params1 = {
				apiKey: 'jackie',
				apiPassword: 'chan',
			};
			config.setConnParams(params1);

			let params2 = config.getConnParams();
			assert.notEqual(params2, null);

			assert.equal(params2.hostname, 'rmqserv001.avimesa.com');
			assert.equal(params2.port, 5671);
			assert.equal(params2.vhost, params1.apiKey);
			assert.equal(params2.username, params1.apiKey);
			assert.equal(params2.password, params1.apiPassword);
		});

		it('should update params from input', function() {

			let params1 = {
				hostname: 'hello',
				port: 1234,
				vhost: 'goodbye',
				apiKey: 'jackie',
				apiPassword: 'chan',
			};
			config.setConnParams(params1);

			var params2 = config.getConnParams();
			assert.notEqual(params2, null);

			assert.equal(params2.hostname,    params1.hostname);
			assert.equal(params2.port,        params1.port);
			assert.equal(params2.vhost,       params1.vhost);
			assert.equal(params2.username,    params1.apiKey);
			assert.equal(params2.password,    params1.apiPassword);
			assert.equal(params2.apiKey,      params1.apiKey);
			assert.equal(params2.apiPassword, params1.apiPassword);
		});
	});
});
