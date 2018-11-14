/*
 * COPYRIGHT: This file and the source codes contained herein ("document") are
 * the property of Avimesa, Inc.  Copyright 2016-2018, Avimesa, Inc.
 *
 * LICENSE:  Avimesa, Inc. grants the RECIPIENT a worldwide, royalty free,
 * limited license to use the source codes in this document as specified
 * in the Avimesa Open License:  http://avimesa.com/openlicense.txt
 */

'use strict';

const amqp = require('amqplib/callback_api');
const config = require('./config');


/**
 * Sends admin command
 *
 * Sends an admin command message following the RCP style message
 *
 * @param {Object} msg           Description.
 * @param {Object} cb            Description of optional variable.
 *
 * @return {type} Description.
 */
exports.sendAdminCmd = function (msg, cb) {

	const connParams = config.getConnParams();
	const rmqSettings = config.getRmqSettings();

	// create a random request ID (make it 32 bit)
	const requestId = Math.round(Math.random() * 0xFFFFFFFF);

	// Connect to the server
	amqp.connect(connParams, function(err, conn) {
		if(err){
			cb(true, err.message);
		}
		else{
			// Use a 'confirm channel' here so we can use callbacks on publishing
			conn.createConfirmChannel(function(err, ch) {
				if (err){
					cb(true, err.message);
					conn.close();
				}
				else {
					// Get a correlation ID used to allow 'multi-tenancy' RPC users
					const correlationId = requestId.toString();

					//
					// Create a temporary queue which will end up getting the response from our admin command.
					// Exclusive so only a single client can use it, expiration time to handle client side issues,
					// and auto delete to clean up normally after use
					//
					ch.assertQueue('', {exclusive:true, expires: 60000, autoDelete : true}, function(err, q){
						if(err){
							cb(true, err.message);
							conn.close();
						} else {

							// Subscribe to this queue so we get the response
							ch.consume(q.queue, function(msg) {

								// Is this the response we're looking for?
								if (msg.properties.correlationId === correlationId){
									// this was our request, so ack it!
									ch.ack(msg);

									// we're done for this example
									conn.close();

									cb(false, JSON.parse(msg.content.toString()));
								}
							}, {noAck: false}); // we'll give an ack once we get the message

							//
							// Pass in the queue's name that we created above, to be extra safe throw in a correlation ID
							// that we can use to track the response
							//
							const options =  {
								replyTo : q.queue,
								correlationId : correlationId,
							};

							ch.publish(rmqSettings.exchanges.admin, rmqSettings.routingKeys.admin_in, new Buffer(JSON.stringify(msg)),options, function (err, ok) {
								if (err){
									cb(true, err.message);
								}
							});
						}
					});
				}
			});
		}
	});
};
