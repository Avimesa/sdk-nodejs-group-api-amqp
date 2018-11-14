var assert = require('assert');
var config = require('../lib/config');

describe('config', function() {

	describe('#getConnParams()', function() {
		it('should load from .env file', function() {
			var param = config.getConnParams();
			assert.notEqual(param, null);
		});
	});
});
