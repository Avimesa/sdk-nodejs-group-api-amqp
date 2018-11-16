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
function sendAdminCmd(msg, cb) {

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
}


/**
 * exclusiveSubscribe
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
function exclusiveSubscribe(queue, cb) {

	const connParams = config.getConnParams();

	// Connect to the server
	amqp.connect(connParams, function(err, conn) {
		if(err) {
			cb(true, err.message);
		}
		else {
			// Use a 'confirm channel' here so we can use callbacks on publishing
			conn.createConfirmChannel(function(err, ch) {
				if (err){
					cb(true, err.message);
					conn.close();
				}
				else {
					ch.checkQueue(queue, function(err, q) {
						if(err){
							cb(true, err.message);
							conn.close();
						} else {
							// Subscribe to this queue so we get the response
							ch.consume(q.queue, function(msg) {
								// callback, with a callback!
								cb(false, JSON.parse(msg.content.toString()), function(ok){
									if(ok){
										ch.ack(msg);
									}
								});
							});
						}
					});
				}
			});
		}
	});
}


/**
 * subscribe
 *
 * Creates a temporary queue and routes messages from the given exchange matching they routing key
 *
 * Will consume any pending messages in the queue on connection.
 *
 * Will automatically ack the message
 *
 * @param {String} exchange: name of exchange
 * @param {String} key: name of routing key
 * @param {Function} cb(err, msg): called on response
 *
 * @return none
 */
function subscribe(exchange, key, cb){

	const connParams = config.getConnParams();

	// Connect to the server
	amqp.connect(connParams, function(err, conn) {
		if (err){
			cb(true, err.message);
		}
		else{
			conn.createChannel(function(err, ch) {
				if (err){
					cb(true, err.message);
					conn.close();
				}
				else{
					//
					// Don't specify a name or use 'amq.gen-' prefix as this is only resource allowed to be created
					// Use exclusive flag so it auto deletes!
					//
					ch.assertQueue('', {exclusive : true}, function(err, q) {

						if(err){
							cb(true, err.message);
						}
						else {
							// Setup a route for this queue
							ch.bindQueue(q.queue, exchange, key);

							// and subscribe, no ack as we're not in charge of persistence with a temporary use case
							ch.consume(q.queue, function(msg) {
								cb(false, msg.content.toString());
							}, {noAck: true});
						}
					});
				}
			});
		}
	});
}


/**
 * messageCount
 *
 * Gets the number of messages in a given queue
 *
 * @param {String} queue: name of queue
 * @param {Function} cb(err, count): called on response
 *
 * @return none
 */
function messageCount(queue, cb){

	const connParams = config.getConnParams();

	// Connect to the server
	amqp.connect(connParams, function(err, conn) {
		if(err){
			cb(true, err.message);
		}
		else{
			// Use a 'confirm channel' here so we can use a callback
			conn.createConfirmChannel(function(err, ch) {
				if (err){
					cb(true, err.message);
					conn.close();
				}
				else {
					ch.checkQueue(queue, function(err, q) {
						if(err){
							cb(true, err.message);
						} else {
							cb(false, q.messageCount);
						}
						conn.close();
					});
				}
			});
		}
	});
}


/**
 * purgeQueue
 *
 * Purges the given queue
 *
 * @param {String} queue: name of queue
 * @param {Function} cb(err, count): called on response
 *
 * @return none
 */
function purgeQueue(queue, cb){

	const connParams = config.getConnParams();

	// Connect to the server
	amqp.connect(connParams, function(err, conn) {
		if(err){
			cb(true, err.message);
		}
		else{
			conn.createChannel(function(err, ch) {
				if (err){
					cb(true, err.message);
					conn.close();
				}
				else{
					ch.purgeQueue(queue, function (err, resp) {
						if (err){
							cb(true, err.message);
						}
						else {
							cb(false, resp.messageCount);
						}
						conn.close();
					});
				}
			});
		}
	});
}

module.exports.sendAdminCmd = sendAdminCmd;
module.exports.exclusiveSubscribe = exclusiveSubscribe;
module.exports.subscribe = subscribe;
module.exports.messageCount = messageCount;
module.exports.purgeQueue = purgeQueue;