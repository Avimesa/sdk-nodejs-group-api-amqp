var assert = require('assert');
var api = require('../lib/utils');

describe('utils', function() {

	describe('#validDeviceId()', function() {
		it('should return false for invalid IDs', function() {
			assert.equal(api.validDeviceId('0000000000000000000000000000000'), false);
			assert.equal(api.validDeviceId('000000000000000000000000000000001'), false);
			assert.equal(api.validDeviceId('A0000000000000000000000000000000'), false);
			assert.equal(api.validDeviceId('F0000000000000000000000000000000'), false);
		});
		it('should return true for valid IDs', function() {
			assert.equal(api.validDeviceId('00000000000000000000000000000000'), true);
			assert.equal(api.validDeviceId('a0000000000000000000000000000000'), true);
			assert.equal(api.validDeviceId('f0000000000000000000000000000000'), true);
		});
	});
});
